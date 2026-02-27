"use client";
import { create } from "zustand";

// 👇 改善策: LaborItemの型定義を追加し、export する
export interface LaborItem {
  id: string;
  role: string;
  type: 'allDay' | 'hourly' | string;
  staffCount: number; // component側は 'workers'
  unitPrice: number;
  hours: number;
}

/**
 * 京王運輸 料金マスタ（初期値リファレンス）
 */
const INITIAL_PRICES = {
  平日: { vehicle: 34500, worker: 20000 },
  休日: { vehicle: 44500, worker: 24000 },
  繁忙期平日: { vehicle: 62500, worker: 30000 },
  繁忙期休日: { vehicle: 80500, worker: 36000 },
};

export const useEstimateStore = create((set: any, get: any) => {
  // ============================
  // 🔁 全体再計算ロジック
  // ============================
  const calculateAll = (state: any) => {
    const multiplier =
      state.dateCategory === "繁忙期休日"
        ? 1.5
        : state.dateCategory === "繁忙期平日"
        ? 1.3
        : state.dateCategory === "休日"
        ? 1.2
        : 1.0;

    const transportTotal = (state.trucks || []).reduce((sum: number, t: any) => {
      const lineBase =
        (Number(t.price || 0) +
          Number(t.distance || 0) * Number(t.distanceRate || 0) +
          Number(t.hours || 0) * Number(t.hourRate || 0)) *
        Number(t.quantity || 0);
      return sum + Math.round(lineBase * multiplier);
    }, 0);

    // 👇 改善策: state.labors を使用
    const laborTotal = (state.labors || []).reduce((sum: number, l: any) => {
      const base = Number(l.unitPrice || 0) * Number(l.staffCount || 0);
      const lineBase = l.type === "hourly" ? base * Number(l.hours || 1) : base;
      return sum + Math.round(lineBase * multiplier);
    }, 0);

    const serviceTotal = (state.services || []).reduce(
      (sum: number, s: any) => sum + Number(s.price || 0) * Number(s.quantity || 1),
      0
    );

    const baseForDiscount = transportTotal + laborTotal;
    const rateDiscountAmount = Math.round(
      baseForDiscount * (state.discountRate / 100)
    );
    const fixedDiscountAmount = (state.fixedDiscounts || []).reduce(
      (sum: number, d: any) => sum + Number(d.price || 0),
      0
    );

    const subtotal =
      baseForDiscount -
      rateDiscountAmount +
      serviceTotal -
      fixedDiscountAmount;

    return {
      transportTotal,
      laborTotal,
      rateDiscountAmount,
      serviceTotal,
      fixedDiscountAmount,
      subtotal: Math.max(0, subtotal),
      currentMultiplier: multiplier,
    };
  };

  return {
    // --- 👤 顧客・案件管理情報 ---
    customer: { 
      name: "", 
      moveDate: "",
      moveDate2: "",
      moveTime: "午前",
      moveTime2: "",
      phone: "",
      fromAddress: "", 
      toAddress: "",
      receivedBy: "",
      estimator: "京王 太郎",
      staffName: "",
      hasElevatorFrom: true,
      hasElevatorTo: false,
      notes: "" 
    },
    setCustomer: (data: any) => set((state: any) => ({ customer: { ...state.customer, ...data } })),
    updateCustomer: (data: any) => set((state: any) => ({ customer: { ...state.customer, ...data } })),

    // --- 📦 お届け資材 ---
    materials: [
      { id: 'm1', name: 'ダンボールA', quantity: 0, step: 5 }, 
      { id: 'm2', name: 'ダンボールB', quantity: 0, step: 5 }, 
      { id: 'm3', name: 'クレープ紙', quantity: 0, step: 1 },   
      { id: 'm4', name: 'クラフトテープ', quantity: 0, step: 1 }, 
      { id: 'm5', name: 'ハンガーBOX', quantity: 0, step: 1 },
    ],
    updateMaterial: (id: string, q: number) => set((state: any) => ({
      materials: state.materials.map((m: any) => 
        m.id === id ? { ...m, quantity: Math.max(0, q) } : m
      )
    })),

    // --- 📅 日程区分 ---
    dateCategory: "平日",
    setDateCategory: (val: string) => set((state: any) => {
      const newState = { ...state, dateCategory: val };
      return { dateCategory: val, costs: calculateAll(newState) };
    }),

    // --- 🏠 部屋・家財 ---
    rooms: [
      { id: "1", name: "LDK" }, { id: "2", name: "寝室1" }, { id: "3", name: "寝室2" }, 
      { id: "4", name: "キッチン" }, { id: "5", name: "その他" }
    ],
    currentRoomId: "1",
    setCurrentRoom: (id: string) => set({ currentRoomId: id }),
    addRoom: (name: string) => set((state: any) => ({ rooms: [...state.rooms, { id: Date.now().toString(), name }] })),
    removeRoom: (id: string) => set((state: any) => {
      const newRooms = state.rooms.filter((r: any) => r.id !== id);
      const newItems = state.items.filter((i: any) => i.roomId !== id);
      return { rooms: newRooms, items: newItems, currentRoomId: state.currentRoomId === id ? newRooms[0]?.id || "" : state.currentRoomId };
    }),
    items: [],
    totalPt: 0,
    addItem: (item: any) => set((state: any) => {
      const roomId = state.currentRoomId;
      const existing = state.items.find((i: any) => i.name === item.name && i.roomId === roomId);
      let newItems = existing 
        ? state.items.map((i: any) => i.name === item.name && i.roomId === roomId ? { ...i, quantity: i.quantity + 1 } : i)
        : [...state.items, { ...item, id: Date.now().toString(), quantity: 1, roomId }];
      return { items: newItems, totalPt: newItems.reduce((sum: number, i: any) => sum + i.pt * i.quantity, 0) };
    }),
    updateQuantity: (id: string, q: number) => set((state: any) => {
      const newItems = state.items.map((i: any) => i.id === id ? { ...i, quantity: Math.max(0, q) } : i).filter((i: any) => i.quantity > 0);
      return { items: newItems, totalPt: newItems.reduce((sum: number, i: any) => sum + i.pt * i.quantity, 0) };
    }),

    // --- 🚚 車両 ---
    trucks: [],
    addTruck: (data: any = {}) => set((state: any) => {
      const category = state.dateCategory as keyof typeof INITIAL_PRICES;
      const defaultPrice = INITIAL_PRICES[category]?.vehicle || 34500;
      const newTrucks = [...state.trucks, { id: Date.now().toString(), type: "2t", quantity: 1, price: defaultPrice, distance: 0, distanceRate: 0, hours: 0, hourRate: 0, ...data }];
      return { trucks: newTrucks, costs: calculateAll({ ...state, trucks: newTrucks }) };
    }),
    updateTruck: (id: string, data: any) => set((state: any) => {
      const newTrucks = state.trucks.map((t: any) => t.id === id ? { ...t, ...data } : t);
      return { trucks: newTrucks, costs: calculateAll({ ...state, trucks: newTrucks }) };
    }),
    removeTruck: (id: string) => set((state: any) => {
      const newTrucks = state.trucks.filter((t: any) => t.id !== id);
      return { trucks: newTrucks, costs: calculateAll({ ...state, trucks: newTrucks }) };
    }),

    // --- 👤 作業員 (修正: labor -> labors) ---
    labors: [],
    addLaborItem: (data: LaborItem) => set((state: any) => {
      const category = state.dateCategory as keyof typeof INITIAL_PRICES;
      const defaultPrice = INITIAL_PRICES[category]?.worker || 20000;
      // component側の命名と合わせる
      const newItem = { id: data.id, role: data.role || "作業員", type: data.type || "allDay", staffCount: data.staffCount || 1, unitPrice: defaultPrice, hours: data.hours || 8 };
      const newLabors = [...state.labors, newItem];
      return { labors: newLabors, costs: calculateAll({ ...state, labors: newLabors }) };
    }),
    updateLaborItem: (id: string, field: string, value: any) => set((state: any) => {
      const newLabors = state.labors.map((l: any) => l.id === id ? { ...l, [field]: value } : l);
      return { labors: newLabors, costs: calculateAll({ ...state, labors: newLabors }) };
    }),
    removeLaborItem: (id: string) => set((state: any) => {
      const newLabors = state.labors.filter((l: any) => l.id !== id);
      return { labors: newLabors, costs: calculateAll({ ...state, labors: newLabors }) };
    }),

    // --- ✨ 付帯・割引 ---
    services: [],
    addService: (name: string) => set((state: any) => {
      const newServices = [...state.services, { id: Date.now().toString(), name, price: 0, quantity: 1 }];
      return { services: newServices, costs: calculateAll({ ...state, services: newServices }) };
    }),
    updateService: (id: string, data: any) => set((state: any) => {
      const newServices = state.services.map((s: any) => s.id === id ? { ...s, ...data } : s);
      return { services: newServices, costs: calculateAll({ ...state, services: newServices }) };
    }),
    removeService: (id: string) => set((state: any) => {
      const newServices = state.services.filter((s: any) => s.id !== id);
      return { services: newServices, costs: calculateAll({ ...state, services: newServices }) };
    }),

    discountRate: 0,
    setDiscountRate: (rate: number) => set((state: any) => {
      const newState = { ...state, discountRate: rate };
      return { discountRate: rate, costs: calculateAll(newState) };
    }),

    fixedDiscounts: [],
    addFixedDiscount: (data: any) => set((state: any) => {
      const newDiscounts = [...state.fixedDiscounts, { id: Date.now().toString(), name: data.name, price: data.price }];
      const newState = { ...state, fixedDiscounts: newDiscounts };
      return { fixedDiscounts: newDiscounts, costs: calculateAll(newState) };
    }),
    updateFixedDiscount: (id: string, data: any) => set((state: any) => {
      const newDiscounts = state.fixedDiscounts.map((d: any) => d.id === id ? { ...d, ...data } : d);
      const newState = { ...state, fixedDiscounts: newDiscounts };
      return { fixedDiscounts: newDiscounts, costs: calculateAll(newState) };
    }),
    removeFixedDiscount: (id: string) => set((state: any) => {
      const newDiscounts = state.fixedDiscounts.filter((d: any) => d.id !== id);
      const newState = { ...state, fixedDiscounts: newDiscounts };
      return { fixedDiscounts: newDiscounts, costs: calculateAll(newState) };
    }),

    SERVICE_PRESETS: ["エアコン取付", "エアコン取外", "洗濯機設置", "ピアノ運送", "高速代", "駐車場代", "保険料", "カスタム"],
    costs: { transportTotal: 0, laborTotal: 0, rateDiscountAmount: 0, serviceTotal: 0, fixedDiscountAmount: 0, subtotal: 0 },
    saveEstimate: async () => { console.log("Final:", get()); alert("保存しました"); },
  };
});
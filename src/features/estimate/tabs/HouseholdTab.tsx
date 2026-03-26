"use client";
import { useState, useMemo } from "react";
// 並び替え済みのマスターデータをインポート
import { FULL_ITEM_LIST, ROOMS, RoomType } from "./householdData";

type Props = { store: any };

export default function HouseholdTab({ store }: Props) {
  const { items, addItem, updateQuantity } = store;
  const [search, setSearch] = useState("");
  const [activeRoom, setActiveRoom] = useState<RoomType | "すべて">("LDK");
  const [showSummary, setShowSummary] = useState(false);

  // --- 検索・フィルタリング ---
  // householdData.ts で定義した並び順（メインが上、共通が下）がそのまま適用されます
  const filteredList = useMemo(() => {
    return FULL_ITEM_LIST.filter((m) => {
      const matchSearch = m.name.includes(search);
      const matchRoom = activeRoom === "すべて" || m.room === activeRoom;
      return matchSearch && matchRoom;
    });
  }, [search, activeRoom]);

  // --- 内容確認（明細）用のグループ化 ---
  const roomGroups = ROOMS.filter((r) => r !== "すべて")
    .map((roomName) => ({
      name: roomName as string,
      content: items.filter((i: any) => i.room === roomName),
    }))
    .filter((group) => group.content.length > 0);

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] animate-in fade-in">
      {/* モード切替 */}
      <div className="flex bg-slate-800 p-1">
        <button
          onClick={() => setShowSummary(false)}
          className={`flex-1 py-2 text-[11px] font-black transition-all ${
            !showSummary ? "bg-[#003366] text-white shadow-inner" : "text-slate-400"
          }`}
        >
          家財入力
        </button>
        <button
          onClick={() => setShowSummary(true)}
          className={`flex-1 py-2 text-[11px] font-black transition-all ${
            showSummary ? "bg-[#003366] text-white shadow-inner" : "text-slate-400"
          }`}
        >
          内容確認
        </button>
      </div>

      {!showSummary ? (
        <>
          {/* 部屋選択タブ */}
          <div className="bg-slate-200 flex overflow-x-auto p-1 gap-1 no-scrollbar border-b border-slate-300">
            {ROOMS.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRoom(r)}
                className={`py-2 px-4 text-[10px] font-black whitespace-nowrap transition-all rounded-sm ${
                  activeRoom === r 
                    ? "bg-white text-[#003366] shadow-sm" 
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* 検索バー */}
          <div className="bg-white border-b p-3">
            <input
              type="text"
              placeholder="家財名で検索..."
              className="w-full border border-slate-300 p-2 text-xs font-bold outline-none focus:border-[#003366] rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* メインリスト：householdData.tsの並び順どおりに表示 */}
          <div className="flex-1 overflow-y-auto bg-white">
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((m) => {
                  const selected = items.find(
                    (i: any) => i.name === m.name && i.room === m.room
                  );
                  return (
                    <tr key={`${m.room}-${m.name}`} className={`transition-colors ${selected ? "bg-blue-50/50" : ""}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] px-1.5 py-0.5 font-black rounded ${
                            m.cat === "家電" ? "bg-blue-100 text-blue-600" : 
                            m.cat === "家具" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                          }`}>
                            {m.cat}
                          </span>
                          <span className="text-sm font-black text-slate-700">{m.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {selected ? (
                          <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden shadow-sm bg-white">
                            <button 
                              onClick={() => updateQuantity(selected.id, selected.quantity - 1)} 
                              className="w-10 h-10 font-black text-[#003366] active:bg-slate-100"
                            >－</button>
                            <span className="w-10 text-center text-sm font-black bg-slate-50">{selected.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(selected.id, selected.quantity + 1)} 
                              className="w-10 h-10 bg-[#003366] text-white font-black active:bg-blue-800"
                            >＋</button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              addItem({
                                ...m,
                                pt: 0,
                                id: `${m.room}-${m.name}-${Date.now()}`,
                              })
                            }
                            className="px-6 py-2 border-2 border-[#003366] text-[11px] font-black text-[#003366] rounded-full active:scale-95 transition-all hover:bg-slate-50"
                          >
                            追加
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* 内容確認画面 */
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 pb-20">
          <div className="max-w-2xl mx-auto bg-white border-2 border-[#003366] shadow-xl">
            <div className="bg-[#003366] text-white p-5 border-b-4 border-red-600">
              <h3 className="font-black text-lg">御家財明細書</h3>
              <p className="text-[9px] opacity-60 font-bold uppercase">Inventory List Summary</p>
            </div>
            <div className="p-6 space-y-8">
              {roomGroups.length > 0 ? (
                roomGroups.map((group) => (
                  <div key={group.name} className="animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-slate-900 text-white text-[10px] px-3 py-1 font-black">{group.name}</span>
                      <div className="flex-1 h-[1px] bg-slate-200"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                      {group.content.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center border-b border-slate-50 py-1.5">
                          <span className="text-xs font-bold text-slate-700">{item.name}</span>
                          <span className="text-xs font-black text-red-600">× {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 py-10 font-bold text-sm italic">登録された家財はありません</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* フッター：点数サマリー */}
      <div className="bg-slate-900 text-white p-2 flex overflow-x-auto gap-4 border-t border-red-600 shadow-2xl no-scrollbar">
        {ROOMS.filter(r => r !== "すべて").map((room) => {
          const count = items
            .filter((i: any) => i.room === room)
            .reduce((sum: number, i: any) => sum + i.quantity, 0);
          return (
            <div key={room} className={`flex flex-col items-center min-w-[80px] transition-opacity ${count > 0 ? "opacity-100" : "opacity-30"}`}>
              <span className="text-[7px] font-black truncate w-full text-center uppercase">{room}</span>
              <span className="text-[11px] font-mono font-black text-red-500">{count}点</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
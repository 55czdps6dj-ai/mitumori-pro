'use client';
import React from 'react';

// InputFieldは必ず外側に置く（フォーカス維持のため）
const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#003366] focus:bg-white transition-all shadow-sm"
    />
  </div>
);

// エレベーター切り替えスイッチ（再利用可能）
const ElevatorToggle = ({ label, checked, onChange }: any) => (
  <label
    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${
      checked
        ? 'border-[#003366] bg-blue-50/50 ring-1 ring-[#003366]'
        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
    }`}
  >
    <div className="flex items-center gap-2">
      <span className="text-lg">{checked ? '🛗' : '🏠'}</span>
      <span
        className={`text-xs font-black ${
          checked ? 'text-[#003366]' : 'text-slate-500'
        }`}
      >
        {label}
      </span>
    </div>
    <input
      type="checkbox"
      className="w-5 h-5 accent-[#003366] cursor-pointer"
      checked={checked || false}
      onChange={(e) => onChange(e.target.checked)}
    />
  </label>
);

export default function CustomerTab({ store }: { store: any }) {
  const customer = store?.customer ?? {};
  const setCustomer = store?.setCustomer;

  // 🔒 安全装置
  const safeSetCustomer =
    typeof setCustomer === 'function'
      ? setCustomer
      : (data: any) => {
          console.warn('setCustomer is not defined in store', data);
        };

  return (
    <div className="space-y-6 pb-24">
      {/* 👤 基本情報 */}
      <section className="bg-white p-5 shadow-md border-t-4 border-[#003366] rounded-xl space-y-4">
        <h3 className="font-black text-[#003366] text-sm italic">
          👤 お客様基本情報
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <InputField
            label="お客様氏名"
            value={customer.name}
            onChange={(val: string) => safeSetCustomer({ name: val })}
            placeholder="例：京王 太郎 様"
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="作業予定日"
              type="date"
              value={customer.moveDate}
              onChange={(val: string) => safeSetCustomer({ moveDate: val })}
            />
            <InputField
              label="電話番号"
              type="tel"
              value={customer.phone}
              onChange={(val: string) => safeSetCustomer({ phone: val })}
              placeholder="090-0000-0000"
            />
          </div>
        </div>
      </section>

      {/* 🏠 住所情報（エレベーター設定を追加） */}
      <section className="bg-white p-5 shadow-md border-t-4 border-slate-800 rounded-xl space-y-4">
        <h3 className="font-black text-slate-800 text-sm italic">
          🏠 住所・搬入出条件
        </h3>

        <div className="space-y-5">
          {/* 現住所エリア */}
          <div className="space-y-2">
            <InputField
              label="現住所（発地）"
              value={customer.fromAddress}
              onChange={(val: string) => safeSetCustomer({ fromAddress: val })}
              placeholder="東京都調布市..."
            />
            <ElevatorToggle
              label="現住所にエレベーターあり"
              checked={customer.hasElevatorFrom}
              onChange={(val: boolean) =>
                safeSetCustomer({ hasElevatorFrom: val })
              }
            />
          </div>

          <div className="flex justify-center text-slate-300">
            <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
              to
            </span>
          </div>

          {/* 転居先エリア */}
          <div className="space-y-2">
            <InputField
              label="転居先（着地）"
              value={customer.toAddress}
              onChange={(val: string) => safeSetCustomer({ toAddress: val })}
              placeholder="神奈川県横浜市..."
            />
            <ElevatorToggle
              label="転居先にエレベーターあり"
              checked={customer.hasElevatorTo}
              onChange={(val: boolean) =>
                safeSetCustomer({ hasElevatorTo: val })
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}

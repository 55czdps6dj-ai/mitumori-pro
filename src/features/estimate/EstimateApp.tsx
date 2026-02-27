'use client';
import React, { useState, useEffect } from 'react';
import { useEstimateStore } from './useEstimateStore';
import CustomerTab from './tabs/CustomerTab';
import HouseholdTab from './tabs/HouseholdTab';
import LaborTab from './tabs/LaborTab';
import PricingTab from './tabs/PricingTab';
import ProposalTab from './tabs/ProposalTab';

function SimplePrintView({
  store,
  onBack,
}: {
  store: any;
  onBack: () => void;
}) {
  const { customer, costs, labor, materials, items } = store;

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const activeItems = items?.filter((item: any) => item.quantity > 0) || [];
  const midIndex = Math.ceil(activeItems.length / 2);
  const leftColItems = activeItems.slice(0, midIndex);
  const rightColItems = activeItems.slice(midIndex);

  return (
    <div className="bg-white min-h-screen p-0 sm:p-8 max-w-[210mm] mx-auto print:p-0 font-sans">
      <div className="flex justify-between items-center mb-6 p-4 bg-slate-50 rounded-lg print:hidden">
        <button
          onClick={onBack}
          className="text-slate-500 font-bold flex items-center gap-2"
        >
          <span>←</span> 編集に戻る
        </button>
        <button
          onClick={() => window.print()}
          className="bg-red-600 text-white px-6 py-2 rounded-full font-black shadow-lg"
        >
          再印刷 / PDF保存
        </button>
      </div>

      <div className="border border-slate-300 p-10 min-h-[287mm] text-slate-800 flex flex-col bg-white">
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-4xl font-black text-slate-900 tracking-[0.5em]">
            御見積書
          </h1>
          <div className="text-right text-[10px] text-slate-500">
            <p>発行番号：EST-{Math.floor(Date.now() / 1000)}</p>
            <p>発行日：{new Date().toLocaleDateString('ja-JP')}</p>
          </div>
        </div>

        <div className="flex justify-between mb-10">
          <div className="w-1/2">
            <p className="text-2xl font-bold underline underline-offset-8 mb-6">
              {customer?.name || '　　　　'} 様
            </p>
            <div className="bg-slate-900 text-white p-5 rounded-sm inline-block min-w-[320px] shadow-lg">
              <span className="text-xs opacity-80 font-bold">
                御見積合計金額（税込）
              </span>
              <div className="text-4xl font-black text-center mt-1">
                ¥{Math.round((costs?.subtotal || 0) * 1.1).toLocaleString()}-
              </div>
            </div>
          </div>
          <div className="text-right text-xs space-y-1">
            <p className="font-black text-lg text-slate-900">
              引越支援システム
            </p>
            <p>東京都調布市調布ヶ丘1-1-1</p>
            <p>TEL: 03-XXXX-XXXX</p>
            {/* ★ 担当者名を反映 */}
            <p className="pt-2 font-bold text-slate-600 underline decoration-slate-300">
              担当：{customer?.staffName || '未設定'}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-black bg-slate-100 p-1.5 mb-2 border-l-4 border-slate-900">
            ■ 作業条件および現場環境
          </h3>
          <table className="w-full border-collapse border border-slate-200 text-[11px]">
            <tbody>
              <tr className="border-b border-slate-200">
                <th className="bg-slate-50 p-2 w-1/4 text-left border-r border-slate-200">
                  引越予定日
                </th>
                <td className="p-2 w-1/4 border-r border-slate-200 font-bold">
                  {customer?.moveDate || 'ご相談'}
                </td>
                <th className="bg-slate-50 p-2 w-1/4 text-left border-r border-slate-200">
                  作業員数
                </th>
                <td className="p-2 w-1/4 font-bold">
                  {labor?.staffCount || 0} 名
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <th className="bg-slate-50 p-2 text-left border-r border-slate-200">
                  使用車両
                </th>
                <td
                  className="p-2 border-r border-slate-200 font-bold"
                  colSpan={3}
                >
                  {labor?.truckType || '2tロング'} × {labor?.truckCount || 1} 台
                </td>
              </tr>
              <tr>
                {/* ★ 修正：文字が表示されるようにプロパティ名を変更 */}
                <th className="bg-slate-50 p-2 text-left border-r border-slate-200">
                  現住所（搬出）
                </th>
                <td className="p-2 border-r border-slate-200">
                  {customer?.hasElevatorFrom
                    ? '🛗 エレベーターあり'
                    : '🏠 階段作業'}
                </td>
                <th className="bg-slate-50 p-2 text-left border-r border-slate-200">
                  移転先（搬入）
                </th>
                <td className="p-2">
                  {customer?.hasElevatorTo
                    ? '🛗 エレベーターあり'
                    : '🏠 階段作業'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-black bg-slate-100 p-1.5 mb-2 border-l-4 border-slate-900">
            ■ お運びする家財明細
          </h3>
          <div className="flex gap-6 text-[10px]">
            {[leftColItems, rightColItems].map((col, idx) => (
              <table
                key={idx}
                className="flex-1 border-collapse border border-slate-100"
              >
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left p-1.5 pl-2">品名</th>
                    <th className="text-right p-1.5 pr-2 w-16">数量</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {col.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="p-1.5 pl-2">{item.name}</td>
                      <td className="p-1.5 pr-2 text-right font-bold">
                        {item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-black bg-slate-100 p-1.5 mb-2 border-l-4 border-slate-900">
            ■ お届け資材
          </h3>
          <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-[11px] p-2 border border-slate-100 rounded-sm">
            {/* ★ 修正：ProposalTabで変更した資材を確実に反映 */}
            {materials
              ?.filter((m: any) => m.quantity > 0)
              .map((m: any, i: number) => (
                <p
                  key={i}
                  className="flex justify-between border-b border-slate-100 pb-1"
                >
                  <span>{m.name}</span>
                  <span className="font-bold">{m.quantity}</span>
                </p>
              )) || <p className="text-slate-400">お届け資材はありません</p>}
          </div>
        </div>

        <div className="border border-slate-300 p-4 flex-1 rounded-sm bg-slate-50/30">
          <p className="text-[10px] font-black text-slate-500 mb-2 underline tracking-wider uppercase">
            Special Notes / 備考
          </p>
          <p className="text-[11px] whitespace-pre-wrap leading-relaxed">
            {customer?.notes || '特記事項なし'}
          </p>
        </div>

        <div className="mt-6 border-t pt-3 text-[9px] text-slate-400 flex justify-between items-center">
          <div className="space-y-1">
            <p>
              ※本見積書はシステムにより自動生成されました。有効期限は発行日より30日間です。
            </p>
            <p>
              ※当日、申告のない家財の追加や特殊作業が発生した場合は追加料金をいただく場合がございます。
            </p>
          </div>
          <p className="font-bold text-slate-300 italic text-[11px]">
            KEIO Logistics System v3.2
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EstimateApp() {
  const store = useEstimateStore();
  const [activeTab, setActiveTab] = useState('customer');

  const tabs = [
    { id: 'customer', label: '顧客', icon: '👤' },
    { id: 'household', label: '家財', icon: '📦' },
    { id: 'labor', label: '作業', icon: '🛠' },
    { id: 'pricing', label: '料金', icon: '💰' },
    { id: 'proposal', label: '提案', icon: '📄' },
  ];

  const totalAmount = Math.round((store.costs?.subtotal || 0) * 1.1);
  const isPrintMode = activeTab === 'print';

  return (
    <div
      className={`flex flex-col h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 ${
        isPrintMode ? 'overflow-y-auto bg-slate-200' : ''
      }`}
    >
      {!isPrintMode && (
        <header className="bg-[#003366] text-white p-3 shadow-lg flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <div className="bg-white text-[#003366] px-1.5 py-0.5 font-black italic text-xs rounded shadow-sm">
              KEIO
            </div>
            <h1 className="font-black text-sm sm:text-base tracking-tight uppercase">
              見積もりシステム
            </h1>
          </div>
          <div className="text-right">
            <p className="font-mono font-black text-xl text-yellow-400 leading-none tracking-tighter">
              ¥{totalAmount.toLocaleString()}
            </p>
          </div>
        </header>
      )}

      {!isPrintMode && (
        <nav className="bg-white border-b border-slate-200 flex overflow-x-auto no-scrollbar shadow-sm z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-none w-1/5 min-w-[70px] py-3 flex flex-col items-center justify-center gap-1 transition-all relative ${
                activeTab === tab.id
                  ? 'text-[#003366] font-black bg-slate-50'
                  : 'text-slate-400 hover:bg-slate-50/50'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] font-bold tracking-tighter">
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 animate-in slide-in-from-left duration-300"></div>
              )}
            </button>
          ))}
        </nav>
      )}

      <main className="flex-1 relative overflow-hidden">
        <div
          className={
            isPrintMode ? 'py-4 sm:py-10' : 'absolute inset-0 overflow-y-auto'
          }
        >
          {activeTab === 'customer' && <CustomerTab store={store} />}
          {activeTab === 'household' && <HouseholdTab store={store} />}
          {activeTab === 'labor' && (
            <div className="p-4">
              <LaborTab store={store} />
            </div>
          )}
          {activeTab === 'pricing' && <PricingTab store={store} />}
          {activeTab === 'proposal' && (
            <ProposalTab
              store={store}
              onPrintClick={() => setActiveTab('print')}
            />
          )}

          {activeTab === 'print' && (
            <SimplePrintView
              store={store}
              onBack={() => setActiveTab('proposal')}
            />
          )}
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @media print {
          nav, header, .print\\:hidden, button { display: none !important; }
          body, html { background: white !important; overflow: visible !important; }
          .min-h-screen { height: auto !important; min-height: 0 !important; }
        }
      `}</style>
    </div>
  );
}

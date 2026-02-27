'use client';

import React, { useState } from 'react';
import { useEstimateStore } from '../useEstimateStore';
// 印刷用の専用コンポーネントをインポート（もし別ファイルなら）
// ここでは、内部で定義するか、EstimateAppにあるSimplePrintViewを流用します

export default function EstimatePrintLayout({
  onBack,
}: {
  onBack: () => void;
}) {
  const store = useEstimateStore();
  // 💡修正ポイント: store から labor を取り出すのをやめました
  const { customer, costs, items, materials } = store;
  const [showPreview, setShowPreview] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      {/* 操作パネル：印刷時には hidden になるように設定 */}
      <div className="max-w-4xl mx-auto print:hidden">
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="text-blue-600">🖨️</span> 見積書の印刷・発行
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                以下の内容でPDFを発行します。内容に誤りがないか確認してください。
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
            >
              ← 編集画面に戻る
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">
                現場条件の最終確認
              </p>
              <ul className="text-sm space-y-1 font-bold text-slate-700">
                <li>
                  🏠 搬出元：
                  {customer.hasElevatorFrom ? 'エレベーターあり' : '階段作業'}
                </li>
                <li>
                  🚚 搬入先：
                  {customer.hasElevatorTo ? 'エレベーターあり' : '階段作業'}
                </li>
                <li>
                  📦 家財数：{items.filter((i: any) => i.quantity > 0).length}{' '}
                  項目
                </li>
              </ul>
            </div>

            <button
              onClick={handlePrint}
              className="bg-[#003366] hover:bg-slate-800 text-white rounded-xl shadow-lg transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
            >
              <span className="text-2xl">📄</span>
              <span className="font-black">PDF / 印刷ダイアログを開く</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- ここからが実際の印刷用レイアウト --- */}
      {/* 見積書の本体。親要素に print:block などをつけて印刷時にこれだけが出るようにします */}
      <div className="print-area bg-white mx-auto">
        <div
          className="border border-slate-300 p-10 text-slate-800 bg-white"
          id="estimate-sheet"
        >
          {/* ここに、以前作成した SimplePrintView の中身を記述します */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
            <h1 className="text-4xl font-black tracking-[0.5em]">御見積書</h1>
            <div className="text-right text-[10px]">
              <p>発行日：{new Date().toLocaleDateString('ja-JP')}</p>
            </div>
          </div>

          <div className="flex justify-between mb-10">
            <div className="w-1/2">
              <p className="text-2xl font-bold underline underline-offset-8 mb-6">
                {customer.name || '　　'} 様
              </p>
              <div className="bg-slate-900 text-white p-5 inline-block min-w-[300px]">
                <span className="text-xs">合計金額（税込）</span>
                <div className="text-3xl font-black text-center">
                  ¥{Math.round((costs?.subtotal || 0) * 1.1).toLocaleString()}-
                </div>
              </div>
            </div>
            <div className="text-right text-xs">
              <p className="font-black text-lg"> 引越支援システム</p>
              <p>東京都調布市調布ヶ丘1-1-1</p>
            </div>
          </div>

          {/* エレベーター情報の反映箇所 */}
          <div className="mb-6">
            <h3 className="text-xs font-black bg-slate-100 p-1 mb-2">
              ■ 作業条件
            </h3>
            <div className="grid grid-cols-2 gap-4 text-[11px] border p-3">
              <p className="flex justify-between border-b">
                <span>現住所（搬出）</span>
                <span>
                  {customer.hasElevatorFrom ? '🛗 エレベーターあり' : '🏠 階段'}
                </span>
              </p>
              <p className="flex justify-between border-b">
                <span>移転先（搬入）</span>
                <span>
                  {customer.hasElevatorTo ? '🛗 エレベーターあり' : '🏠 階段'}
                </span>
              </p>
              {/* 💡修正ポイント: laborの情報を表示していた箇所を一時的に隠しました */}
              <p className="flex justify-between border-b">
                <span>トラック</span>
                <span>（設定中）</span>
              </p>
              <p className="flex justify-between border-b">
                <span>作業員</span>
                <span>（設定中）</span>
              </p>
            </div>
          </div>

          {/* ... その他の明細（家財リスト・資材）も同様に記述 ... */}
        </div>
      </div>

      <style jsx>{`
        @media screen {
          .print-area {
            max-width: 210mm;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
        }
        @media print {
          .print-area {
            width: 100%;
            margin: 0;
            padding: 0;
            border: none;
          }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}

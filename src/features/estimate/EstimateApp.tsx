// @ts-nocheck
'use client';
import React, { useState } from 'react';
import { useEstimateStore } from './useEstimateStore';
import CustomerTab from './tabs/CustomerTab';
import HouseholdTab from './tabs/HouseholdTab';
import LaborTab from './tabs/LaborTab';
import PricingTab from './tabs/PricingTab';
import ProposalTab from './tabs/ProposalTab';

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

  const handlePrint = () => {
    const {
      customer,
      costs,
      labors,
      trucks,
      items,
      materials,
      services,
      fixedDiscounts,
      discountRate,
    } = store;

    // --- 数値の正規化 ---
    const transportTotal = Number(costs?.transportTotal || 0);
    const laborTotal = Number(costs?.laborTotal || 0);
    const materialTotal = (materials || []).reduce(
      (sum, m) => sum + Number(m.price || 0) * Number(m.quantity || 0),
      0
    );
    const subtotal = Number(costs?.subtotal || 0);
    const tax = Math.floor(subtotal * 0.1);
    const total = subtotal + tax;

    // --- 付帯サービス内訳 ---
    const serviceRows = (services || [])
      .filter((s) => Number(s.price) * Number(s.quantity || 1) > 0)
      .map(
        (s) =>
          `<tr><td>付帯：${s.name}</td><td style="text-align:right;">¥${(
            Number(s.price) * Number(s.quantity || 1)
          ).toLocaleString()}</td></tr>`
      )
      .join('');

    // --- 割引明細 ---
    const discountRows = [];
    if (costs?.rateDiscountAmount > 0) {
      discountRows.push(
        `<tr class="discount-row"><td>基本料金割引 (${discountRate}%)</td><td style="text-align:right;">▲¥${Number(
          costs.rateDiscountAmount
        ).toLocaleString()}</td></tr>`
      );
    }
    (fixedDiscounts || []).forEach((d) => {
      if (Number(d.price) > 0) {
        discountRows.push(
          `<tr class="discount-row"><td>${
            d.name || '特別割引'
          }</td><td style="text-align:right;">▲¥${Number(
            d.price
          ).toLocaleString()}</td></tr>`
        );
      }
    });

    // --- 家財明細 (2列) ---
    const activeItems = (items || []).filter(
      (i) => i && Number(i.quantity || 0) > 0
    );
    const mid = Math.ceil(activeItems.length / 2);
    const getItemRows = (start, end) =>
      activeItems
        .slice(start, end)
        .map(
          (i) =>
            `<tr><td>${i.name}</td><td style="text-align:right;font-weight:bold;width:25px;">${i.quantity}</td></tr>`
        )
        .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <style>
          @page { size: A4 landscape; margin: 5mm; }
          body { font-family: "Helvetica Neue", Arial, sans-serif; color: #222; margin: 0; padding: 0; line-height: 1.1; font-size: 8pt; }
          .container { width: 287mm; height: 200mm; border: 2px solid #000; padding: 10px; box-sizing: border-box; display: flex; flex-direction: column; background: #fff; position: relative; }
          
          /* ヘッダー */
          .header { display: flex; justify-content: space-between; border-bottom: 3px solid #003366; padding-bottom: 2px; margin-bottom: 8px; }
          .title-wrap h1 { font-size: 24pt; font-weight: 900; letter-spacing: 0.5em; margin: 0; color: #003366; }
          
          /* 情報エリア */
          .top-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 8px; }
          .customer-name { font-size: 16pt; font-weight: bold; border-bottom: 2px solid #000; margin-bottom: 4px; padding-bottom: 2px; }
          .address-info { font-size: 7.5pt; line-height: 1.25; }
          .company-info { text-align: right; font-size: 7.5pt; }
          .company-name { font-size: 10pt; font-weight: bold; }
          
          /* 合計金額 */
          .total-box { background: #003366; color: #fff; padding: 6px 15px; border-radius: 2px; display: flex; align-items: center; justify-content: space-between; margin: 4px 0; }
          .total-box .val { font-size: 22pt; font-weight: 900; }

          /* メインレイアウト */
          .main-layout { display: grid; grid-template-columns: 1.1fr 1fr; gap: 12px; flex-grow: 1; min-height: 0; overflow: hidden; }
          .left-column { display: flex; flex-direction: column; gap: 8px; }
          
          /* 右カラム：ここが自動縮小の対象 */
          .right-column { border: 1px solid #333; padding: 5px; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; overflow: hidden; }
          .inventory-title { font-weight: bold; border-bottom: 1px solid #333; margin-bottom: 3px; padding-bottom: 2px; font-size: 8pt; }
          #inventory-content { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; align-content: start; transition: font-size 0.1s; }
          
          /* テーブル基本 */
          table { width: 100%; border-collapse: collapse; font-size: 7.5pt; }
          th { background: #f2f2f2; border: 1px solid #333; padding: 2px 5px; text-align: left; }
          td { border: 1px solid #333; padding: 2px 5px; }
          .discount-row { color: #d32f2f; font-weight: bold; background: #fff5f5; }

          .item-table { border: none !important; }
          .item-table td { border-bottom: 1px solid #eee !important; border-left:none !important; border-right:none !important; border-top:none !important; padding: 1px 0 !important; font-size: 7.5pt; }

          .notes-section { font-size: 7pt; border: 1px dashed #999; padding: 4px; }
          .footer { display: flex; justify-content: space-between; align-items: flex-end; font-size: 7pt; margin-top: 5px; }
          .stamp-box { display: flex; gap: 5px; }
          .stamp { width: 38px; height: 38px; border: 1px solid #333; display: flex; align-items: center; justify-content: center; color: #ccc; font-size: 6pt; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title-wrap"><h1>御見積書</h1></div>
            <div style="text-align:right;">No: EST-${Math.floor(
              Date.now() / 1000
            )} / 発行日: ${new Date().toLocaleDateString('ja-JP')}</div>
          </div>

          <div class="top-grid">
            <div>
              <div class="customer-name">${
                customer?.name || '　　　　'
              } 様</div>
              <div class="address-info">
                <div>現住所：${customer?.fromAddress || '（未入力）'}</div>
                <div>新住所：${customer?.toAddress || '（未入力）'}</div>
                <div>連絡先：${customer?.phone || '（未入力）'}</div>
              </div>
            </div>
            <div class="company-info">
              <div class="company-name">京王運輸株式会社</div>
              〒182-0021 東京都調布市調布ヶ丘1-1-1<br>
              TEL: 042-XXX-XXXX / 担当：${customer?.estimator || '未設定'}
              <div class="total-box">
                <span style="font-size:8pt;">御見積合計(税込)</span>
                <span class="val">¥${total.toLocaleString()}-</span>
              </div>
            </div>
          </div>

          <div class="main-layout">
            <div class="left-column">
              <table>
                <thead><tr style="background:#f2f2f2;"><th>料金内訳明細</th><th style="width:80px; text-align:right;">金額(税抜)</th></tr></thead>
                <tbody>
                  <tr><td>基本車両運賃</td><td style="text-align:right;">¥${transportTotal.toLocaleString()}</td></tr>
                  <tr><td>作業人件費</td><td style="text-align:right;">¥${laborTotal.toLocaleString()}</td></tr>
                  <tr><td>梱包資材費</td><td style="text-align:right;">¥${materialTotal.toLocaleString()}</td></tr>
                  ${serviceRows}
                  ${discountRows.join('')}
                  <tr style="font-weight:bold; background:#fafafa;"><td>小計</td><td style="text-align:right;">¥${subtotal.toLocaleString()}</td></tr>
                  <tr><td>消費税(10%)</td><td style="text-align:right;">¥${tax.toLocaleString()}</td></tr>
                </tbody>
              </table>

              <table>
                <thead><tr style="background:#f2f2f2;"><th colspan="2">作業条件</th></tr></thead>
                <tbody>
                  <tr><td width="30%">引越予定日</td><td>${
                    customer?.moveDate || 'ご相談'
                  } ${customer?.moveTime || ''}</td></tr>
                  <tr><td>車両設定</td><td>${
                    trucks?.length > 0
                      ? trucks.map((t) => t.type + '×' + t.quantity).join(' / ')
                      : '未設定'
                  }</td></tr>
                  <tr><td>作業人員</td><td>${labors?.reduce(
                    (s, l) => s + Number(l.staffCount || 0),
                    0
                  )}名</td></tr>
                  <tr><td>搬出環境</td><td>${
                    customer?.hasElevatorFrom ? 'EV有' : '階段'
                  } / ${
      customer?.floorFrom ? customer.floorFrom + '階' : '-'
    }</td></tr>
                  <tr><td>搬入環境</td><td>${
                    customer?.hasElevatorTo ? 'EV有' : '階段'
                  } / ${
      customer?.floorTo ? customer.floorTo + '階' : '-'
    }</td></tr>
                </tbody>
              </table>
              
              <div class="notes-section">
                <strong>【備考】</strong><br>
                ${
                  customer?.notes ||
                  '標準引越運送約款に基づきお引受けいたします。'
                }
              </div>
            </div>

            <div class="right-column" id="inventory-container">
              <div class="inventory-title">■ 家財明細内訳</div>
              <div id="inventory-content">
                <table class="item-table"><tbody>${getItemRows(
                  0,
                  mid
                )}</tbody></table>
                <table class="item-table"><tbody>${getItemRows(
                  mid,
                  activeItems.length
                )}</tbody></table>
              </div>
            </div>
          </div>

          <div class="footer">
            <div style="color:#666;">※本見積は30日間有効。当日、内容に相違がある場合は再見積となる場合がございます。</div>
            <div class="stamp-box">
              <div class="stamp">受付</div><div class="stamp">検印</div><div class="stamp">担当</div>
            </div>
          </div>
        </div>

        <script>
          function adjustFontSize() {
            const container = document.getElementById('inventory-container');
            const content = document.getElementById('inventory-content');
            let fontSize = 7.5; // 初期サイズ(pt)
            
            // コンテナの高さに収まるまでフォントサイズを下げる
            // offsetHeightは親の枠、scrollHeightは中身の実際の高さ
            while (content.scrollHeight > container.offsetHeight - 30 && fontSize > 4) {
              fontSize -= 0.2;
              content.style.fontSize = fontSize + 'pt';
              // テーブル内のフォントサイズも同期させる
              const tables = content.getElementsByTagName('table');
              for(let t of tables) { t.style.fontSize = fontSize + 'pt'; }
            }
          }

          window.onload = function() {
            adjustFontSize();
            setTimeout(function() { window.print(); }, 700);
          };
          window.onafterprint = function() { window.close(); };
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      };
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden text-slate-900">
      <header className="bg-[#003366] text-white p-3 flex justify-between items-center z-20 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white text-[#003366] px-1.5 py-0.5 font-black italic text-xs rounded">
            KEIO
          </div>
          <h1 className="font-black text-sm uppercase">
            引越見積システム v3.2
          </h1>
        </div>
        <button
          onClick={() => {
            if (confirm('データをクリアしますか？')) store.clearEstimate();
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-[10px] font-black"
        >
          🗑️ リセット
        </button>
      </header>

      <nav className="bg-white border-b border-slate-200 flex shadow-sm z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 relative ${
              activeTab === tab.id
                ? 'text-[#003366] font-black'
                : 'text-slate-400'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-bold">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 w-full h-1 bg-red-600"></div>
            )}
          </button>
        ))}
      </nav>

      <main className="flex-1 relative overflow-y-auto">
        <div className="max-w-screen-xl mx-auto pb-24">
          {activeTab === 'customer' && <CustomerTab store={store} />}
          {activeTab === 'household' && <HouseholdTab store={store} />}
          {activeTab === 'labor' && (
            <div className="p-4">
              <LaborTab store={store} />
            </div>
          )}
          {activeTab === 'pricing' && <PricingTab store={store} />}
          {activeTab === 'proposal' && (
            <ProposalTab store={store} onPrintClick={handlePrint} />
          )}
        </div>
      </main>
    </div>
  );
}

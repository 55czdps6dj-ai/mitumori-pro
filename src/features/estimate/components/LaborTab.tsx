'use client';

// 👇 改善策: LaborItem型をインポート
import { useEstimateStore, LaborItem } from '../useEstimateStore';
import { v4 as uuid } from 'uuid';

export default function LaborTab() {
  const store = useEstimateStore();

  // 👇 改善策: labors と、正しい更新関数を取得
  const { labors, addLaborItem, updateLaborItem } = store;

  const handleAddLabor = () => {
    // 👇 改善策: 型定義に沿った初期データを渡す
    addLaborItem({
      id: uuid(),
      role: 'fullDay',
      type: 'allDay',
      staffCount: 1, // workersからstaffCountへ
      hours: 8,
      unitPrice: 2000,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">👷 人件費</h2>
        <button
          onClick={handleAddLabor}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          ＋ 人員追加
        </button>
      </div>

      {/* 👇 改善策: laborsを使用し、型を定義 */}
      {labors.map((l: LaborItem) => (
        <div
          key={l.id}
          className="grid grid-cols-5 gap-2 items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm"
        >
          <select
            value={l.role}
            onChange={(e) => updateLaborItem(l.id, 'role', e.target.value)}
            className="col-span-2 p-2 border rounded text-sm"
          >
            <option value="departure">発地のみ</option>
            <option value="arrival">着地のみ</option>
            <option value="fullDay">1日作業</option>
            <option value="packing">梱包</option>
            <option value="unpacking">開梱</option>
          </select>

          <input
            type="number"
            value={l.staffCount} // workersからstaffCountへ
            placeholder="人数"
            onChange={(e) =>
              updateLaborItem(l.id, 'staffCount', Number(e.target.value))
            }
            className="p-2 border rounded text-sm"
          />

          <input
            type="number"
            value={l.hours}
            placeholder="時間"
            onChange={(e) =>
              updateLaborItem(l.id, 'hours', Number(e.target.value))
            }
            className="p-2 border rounded text-sm"
          />

          <input
            type="number"
            value={l.unitPrice}
            placeholder="単価"
            onChange={(e) =>
              updateLaborItem(l.id, 'unitPrice', Number(e.target.value))
            }
            className="p-2 border rounded text-sm"
          />
        </div>
      ))}
    </div>
  );
}

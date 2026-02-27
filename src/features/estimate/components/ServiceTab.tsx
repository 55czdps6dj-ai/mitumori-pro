'use client';

// 👇 改善策: 古いContextではなく、新しいZustandストアをインポート
import { useEstimateStore } from '../useEstimateStore';
import { v4 as uuid } from 'uuid';

export default function ServiceTab() {
  // 👇 改善策: Zustandストアを呼び出し、データと関数を取得
  const store = useEstimateStore();

  // 💡 ストアの構造に合わせてサービス関連を取得
  const {
    services,
    addService: addServiceToStore,
    updateService: updateServiceInStore,
  } = store;

  const handleAddService = () => {
    // 💡 ストアの追加関数を使用。マスタの価格設定などはストア側で行うため、
    // ここでは新しいサービスの基本情報を渡すか、単に名前を渡す
    addServiceToStore('付帯サービス');
  };

  const handleUpdateService = (id: string, field: string, value: any) => {
    // 💡 ストアの更新関数を使用
    updateServiceInStore(id, { [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">🧰 付帯サービス</h2>
        <button
          onClick={handleAddService}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
        >
          ＋ サービス追加
        </button>
      </div>

      {services.map((s: any) => (
        <div
          key={s.id}
          className="grid grid-cols-5 gap-2 items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm"
        >
          <input
            value={s.name}
            onChange={(e) => handleUpdateService(s.id, 'name', e.target.value)}
            className="col-span-3 p-2 border rounded text-sm"
            placeholder="サービス名"
          />

          <input
            type="number"
            value={s.price} // context側の名前が flatFee から price に変更されている場合に対応
            placeholder="料金"
            onChange={(e) =>
              handleUpdateService(s.id, 'price', Number(e.target.value))
            }
            className="col-span-2 p-2 border rounded text-sm"
          />
        </div>
      ))}
    </div>
  );
}

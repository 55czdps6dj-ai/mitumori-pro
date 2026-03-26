"use client";

import { useState } from "react";

export default function EstimateForm() {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [total, setTotal] = useState<number | null>(null);

  const calculate = () => {
    const result = Number(price) * Number(quantity);
    setTotal(result);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md">
      <div className="mb-4">
        <label className="block mb-1">単価</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">数量</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        onClick={calculate}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        計算する
      </button>

      {total !== null && (
        <div className="mt-4 text-lg font-bold">
          合計：¥{total.toLocaleString()}
        </div>
      )}
    </div>
  );
}

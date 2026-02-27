"use client"

import { useEstimate } from "@/context/EstimateContext"

export default function SummaryTab() {
  const { estimate } = useEstimate()

  const laborTotal = estimate.labor.reduce(
    (sum: number, l: any) => sum + l.workers * l.hours * l.unitPrice,
    0
  )

  const serviceTotal = estimate.services.reduce(
    (sum: number, s: any) =>
      sum + (s.flatFee ?? 0) + (s.quantity ?? 0) * (s.unitPrice ?? 0),
    0
  )

  const otherTotal = estimate.otherCosts?.reduce(
    (sum: number, o: any) => sum + o.amount,
    0
  ) ?? 0

  const total = laborTotal + serviceTotal + otherTotal

  return (
    <div>
      <h2>🧾 合計</h2>
      <p>人件費合計: ¥{laborTotal.toLocaleString()}</p>
      <p>付帯サービス合計: ¥{serviceTotal.toLocaleString()}</p>
      <p>その他費用: ¥{otherTotal.toLocaleString()}</p>
      <h3>総合計: ¥{total.toLocaleString()}</h3>
    </div>
  )
}

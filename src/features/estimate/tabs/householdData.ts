export type RoomType = "LDK" | "寝室・個室" | "洗面所・トイレ" | "趣味" | "玄関・ベランダ" | "その他";

export const ROOMS: (RoomType | "すべて")[] = ["すべて", "LDK", "寝室・個室", "洗面所・トイレ", "趣味", "玄関・ベランダ", "その他"];

export interface HouseholdItem {
  name: string;
  room: RoomType;
  cat: "家具" | "家電" | "他";
}

/**
 * 部屋別家財マスター（並び順最適化版）
 * 部屋固有の大型家財を上に、共通的な補助家財（エアコン・照明等）を下に配置しています。
 */
export const FULL_ITEM_LIST: HouseholdItem[] = [
  // --- LDK ---
  { name: "ソファー", room: "LDK", cat: "家具" },
  { name: "ダイニングテーブル", room: "LDK", cat: "家具" },
  { name: "イス", room: "LDK", cat: "家具" },
  { name: "座卓", room: "LDK", cat: "家具" },
  { name: "液晶テレビ", room: "LDK", cat: "家電" },
  { name: "有機ELテレビ", room: "LDK", cat: "家電" },
  { name: "テレビ台", room: "LDK", cat: "家具" },
  { name: "冷蔵庫", room: "LDK", cat: "家電" },
  { name: "食器棚", room: "LDK", cat: "家具" },
  { name: "電子レンジ", room: "LDK", cat: "家電" },
  { name: "レンジ台", room: "LDK", cat: "家具" },
  { name: "ガステーブル", room: "LDK", cat: "家電" },
  { name: "キッチンカウンター", room: "LDK", cat: "家具" },
  { name: "ワゴン", room: "LDK", cat: "家具" },
  { name: "収納・すきま家具", room: "LDK", cat: "家具" },
  { name: "仏壇", room: "LDK", cat: "家具" },
  { name: "マッサージチェア", room: "LDK", cat: "家電" },
  { name: "サイドボード", room: "LDK", cat: "家具" },
  { name: "リビングボード", room: "LDK", cat: "家具" },
  { name: "ローボード", room: "LDK", cat: "家具" },
  { name: "電話台", room: "LDK", cat: "家具" },
  { name: "ビデオ・DVD", room: "LDK", cat: "家電" },
  { name: "ステレオ・コンポ", room: "LDK", cat: "家電" },
  { name: "AVラック", room: "LDK", cat: "家具" },
  { name: "フロアスタンド", room: "LDK", cat: "家電" },
  { name: "カーペット", room: "LDK", cat: "他" },
  { name: "エアコン", room: "LDK", cat: "家電" }, // 下方へ移動
  { name: "照明器具", room: "LDK", cat: "家電" }, // 下方へ移動
  { name: "ストーブ・ヒーター", room: "LDK", cat: "家電" }, // 下方へ移動
  { name: "扇風機", room: "LDK", cat: "家電" }, // 下方へ移動
  { name: "空気清浄機・加湿器", room: "LDK", cat: "家電" }, // 下方へ移動

  // --- 寝室・個室 ---
  { name: "ベット", room: "寝室・個室", cat: "家具" },
  { name: "ベットマットレス", room: "寝室・個室", cat: "家具" },
  { name: "2段ベット", room: "寝室・個室", cat: "家具" },
  { name: "ソファーベット", room: "寝室・個室", cat: "家具" },
  { name: "洋服ダンス", room: "寝室・個室", cat: "家具" },
  { name: "ワードローブ", room: "寝室・個室", cat: "家具" },
  { name: "和タンス", room: "寝室・個室", cat: "家具" },
  { name: "整理タンス", room: "寝室・個室", cat: "家具" },
  { name: "ロッカータンス", room: "寝室・個室", cat: "家具" },
  { name: "桐タンス", room: "寝室・個室", cat: "家具" },
  { name: "押入れタンス", room: "寝室・個室", cat: "家具" },
  { name: "本棚", room: "寝室・個室", cat: "家具" },
  { name: "多段プラケース", room: "寝室・個室", cat: "家具" },
  { name: "エレクター・ラック", room: "寝室・個室", cat: "家具" },
  { name: "カラーBOX", room: "寝室・個室", cat: "家具" },
  { name: "衣装ケース", room: "寝室・個室", cat: "家具" },
  { name: "ドレッサー（椅子付）", room: "寝室・個室", cat: "家具" },
  { name: "ライティング", room: "寝室・個室", cat: "家具" },
  { name: "姿見（1面鏡）", room: "寝室・個室", cat: "家具" },
  { name: "ファンシーケース", room: "寝室・個室", cat: "家具" },
  { name: "ハンガーラック", room: "寝室・個室", cat: "家具" },
  { name: "液晶テレビ", room: "寝室・個室", cat: "家電" },
  { name: "布団袋（組）", room: "寝室・個室", cat: "他" },
  { name: "茶箱", room: "寝室・個室", cat: "他" },
  { name: "エアコン", room: "寝室・個室", cat: "家電" }, // 下方へ移動
  { name: "照明器具", room: "寝室・個室", cat: "家電" }, // 下方へ移動
  { name: "ストーブ・ヒーター", room: "寝室・個室", cat: "家電" }, // 下方へ移動
  { name: "扇風機", room: "寝室・個室", cat: "家電" }, // 下方へ移動
  { name: "空気清浄機・加湿器", room: "寝室・個室", cat: "家電" }, // 下方へ移動

  // --- 洗面所・トイレ ---
  { name: "洗濯機 (ドラム式・自)", room: "洗面所・トイレ", cat: "家電" },
  { name: "乾燥機", room: "洗面所・トイレ", cat: "家電" },
  { name: "ウォシュレット", room: "洗面所・トイレ", cat: "家電" },
  { name: "ストーブ・ヒーター(小型)", room: "洗面所・トイレ", cat: "家電" },
  { name: "照明器具", room: "洗面所・トイレ", cat: "家電" }, // 下方へ移動

  // --- 趣味 ---
  { name: "パソコン(ノート)", room: "趣味", cat: "家電" },
  { name: "パソコン（デスクトップ）", room: "趣味", cat: "家電" },
  { name: "パソコンラック", room: "趣味", cat: "家具" },
  { name: "電子ピアノ", room: "趣味", cat: "他" },
  { name: "雛・五月人形セット", room: "趣味", cat: "他" },
  { name: "トランクケース", room: "趣味", cat: "他" },
  { name: "スキー スノーボード", room: "趣味", cat: "他" },
  { name: "ゴルフバック", room: "趣味", cat: "他" },
  { name: "エアコン", room: "趣味", cat: "家電" }, // 下方へ移動
  { name: "照明器具", room: "趣味", cat: "家電" }, // 下方へ移動
  { name: "空気清浄機・加湿器", room: "趣味", cat: "家電" }, // 下方へ移動

  // --- 玄関・ベランダ ---
  { name: "下駄箱", room: "玄関・ベランダ", cat: "家具" },
  { name: "自転車　大人用", room: "玄関・ベランダ", cat: "他" },
  { name: "自転車　子供用", room: "玄関・ベランダ", cat: "他" },
  { name: "物干し台・竿", room: "玄関・ベランダ", cat: "他" },
  { name: "植木鉢", room: "玄関・ベランダ", cat: "他" },
  { name: "ベビーカー", room: "玄関・ベランダ", cat: "他" },
  { name: "エアコン室外機", room: "玄関・ベランダ", cat: "家電" },

  // --- その他 ---
  { name: "ダンボール", room: "その他", cat: "他" },
  { name: "絵・額等", room: "その他", cat: "他" },
  { name: "金庫", room: "その他", cat: "他" },
];
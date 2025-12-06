'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ---------- Supabase Server（Service Role） ----------
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------- 食べ物記録の追加 ----------
export async function addFoodRecord(formData: {
  title: string;
  restaurant: string | null;
  count: number;
  date: string;
  tags: string[];
  rating: number;
  memo: string;
  imageUrl: string | null;
}) {
  try {
    const { data, error } = await supabase
      .from("food_records")   // ← ★テーブル名を修正
      .insert({
        title: formData.title,
        restaurant: formData.restaurant,
        count: formData.count,
        date: formData.date,
        tags: formData.tags,
        rating: formData.rating,
        memo: formData.memo,
        image_url: formData.imageUrl,
        created_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error("DB挿入エラー:", error);
      throw new Error("データベース登録に失敗しました");
    }

    return data; // 成功したレコード返す
  } catch (err) {
    console.error("サーバーアクションエラー:", err);
    throw err;
  }
}


//カードリストのダミーデータ
// 本来はデータベースですが、今回はここにデータを定義します
const foodRecordsData = [
  {
    id: 1,
    image: '',
    name: 'スパゲティ',
    tags: ['イタリアン', 'スパゲティ', 'サイゼリヤ'],
    rating: 4,
    comment: 'とても美味しかった',
    date: '2024/01/01',
    count: 3,
  },
  {
    id: 2,
    image: '',
    name: '鰻重',
    tags: ['和食', 'うなぎ'],
    rating: 3,
    comment: 'とても美味しかった\n店が少し汚かった',
    date: '2024/01/05',
    count: 1,
  },
  {
    id: 3,
    image: '',
    name: 'ハンバーガー',
    tags: ['アメリカン', 'ファストフード'],
    rating: 5,
    comment: '肉汁がすごかった',
    date: '2024/01/10',
    count: 5,
  },
  {
    id: 4,
    image: '',
    name: '醤油ラーメン',
    tags: ['ラーメン', '中華'],
    rating: 4,
    comment: 'さっぱりしていて食べやすい',
    date: '2024/01/15',
    count: 10,
  },
];

//検索窓の検索機能
// 検索を行うサーバーアクション
export async function searchFoods(keyword: string, tag: string = 'すべて') {  // ★ tag引数を追加（デフォルトは'すべて'）
  // サーバー側での処理の遅延をシミュレート（一瞬で終わると実感が湧かないため）
  // await new Promise((resolve) => setTimeout(resolve, 300));

  // まず全データを用意
  let filtered = foodRecordsData;

  // ★ keyword を小文字化
  const lowerKeyword = keyword?.toLowerCase() ?? '';


  // キーワードでフィルタリング（店名やタグに含まれるか）
if (keyword && keyword.trim() !== '') {
  filtered = filtered.filter((record) => {
    return (
      record.name.toLowerCase().includes(lowerKeyword) ||
      record.comment.toLowerCase().includes(lowerKeyword) ||
      record.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  });
}

// ▼▼▼ 追加: タグでフィルタリング ▼▼▼
   if (tag !== 'すべて') {
     filtered = filtered.filter((record) => record.tags.includes(tag));
   }
   // ▲▲▲ 追加ここまで ▲▲▲

  return filtered;
}
//ここまで検索窓の検索機能

// ▲▲▲ 追加ここまで ▲▲▲
//ここまでSupabaseのデータ登録

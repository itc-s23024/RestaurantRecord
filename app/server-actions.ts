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

// -----------------------------
// Supabase から検索して返す関数
// -----------------------------
//検索窓の検索機能
// 検索を行うサーバーアクション
export async function searchFoods(keyword: string, tag: string = 'すべて') {  // ★ tag引数を追加（デフォルトは'すべて'）
  // サーバー側での処理の遅延をシミュレート（一瞬で終わると実感が湧かないため）
  // await new Promise((resolve) => setTimeout(resolve, 300));

  let query = supabase
    .from("food_records")
    .select("*")
    .order("created_at", { ascending: false });

  // ★ keyword を小文字化
  const lowerKeyword = keyword?.toLowerCase() ?? '';


  // キーワードでフィルタリング（店名やタグに含まれるか）
if (keyword && keyword.trim() !== '') {
  query = query.or(
      `
      title.ilike.%${keyword}%,
      restaurant.ilike.%${keyword}%,
      memo.ilike.%${keyword}%
      `
    );
}

// ▼▼▼ 追加: タグでフィルタリング ▼▼▼
   if (tag !== 'すべて') {
     query = query.contains("tags", [tag]);
   }

   const { data, error } = await query;

  if (error) {
    console.error("検索エラー:", error);
    return [];
  }
   // ▲▲▲ 追加ここまで ▲▲▲

  return data;
}
//ここまで検索窓の検索機能

// ▲▲▲ 追加ここまで ▲▲▲
//ここまでSupabaseのデータ登録

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

//ここからタグの機能
// -----------------------------
// Supabase に存在するタグ一覧を取得
// -----------------------------
export async function getAllTags() {
  const { data, error } = await supabase
    .from("food_records")
    .select("tags");

  if (error) {
    console.error("タグ取得エラー:", error);
    return [];
  }

  const allTags = data.flatMap((row) => row.tags ?? []);
  return Array.from(new Set(allTags));
}

// -----------------------------
// タグだけで検索（単一タグ）
// -----------------------------
export async function searchByTag(tag: string) {
  if (!tag || tag === "すべて") return [];

  const { data, error } = await supabase
    .from("food_records")
    .select("*")
    .contains("tags", [tag])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("タグ検索エラー:", error);
    return [];
  }

  return data;
}
//ここまでタグの機能

// ここからカードリストの詳細機能
// -----------------------------------------
// 単一レコードをIDで取得
// -----------------------------------------
export async function getFoodRecordById(id: string) {
  const { data, error } = await supabase
    .from("food_records")
    .select("*")
    .eq("id", id)
    .single(); // ← 1件取得

  if (error) {
    console.error("詳細データ取得エラー:", error);
    return null;
  }

  return data;
}
// ここまでカードリストの詳細機能

//　ここから編集機能
// 更新用の型（必要に応じて export して使ってください）
type UpdateFoodRecordInput = {
  title?: string;
  restaurant?: string | null;
  count?: number;
  date?: string;
  tags?: string[];
  rating?: number;
  memo?: string;
  image_url?: string | null;
  address?: string | null; // もし address カラムがあるなら
};

// -----------------------------
// レコード更新: updateFoodRecord
// -----------------------------
export async function updateFoodRecord(id: string, formData: UpdateFoodRecordInput) {
  try {
    const { data, error } = await supabase
      .from('food_records')
      .update({
        // formData の中身をそのまま渡す（undefined フィールドは無視される）
        title: formData.title,
        restaurant: formData.restaurant,
        count: formData.count,
        date: formData.date,
        tags: formData.tags,
        rating: formData.rating,
        memo: formData.memo,
        image_url: formData.image_url,
        address: formData.address,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新エラー:', error);
      throw error;
    }

    // 必要なら ISR/キャッシュの再検証
    try {
      revalidatePath('/'); // ホーム一覧を再検証
      revalidatePath(`/view/${id}`); // 詳細ページを再検証
    } catch (e) {
      // 開発環境や設定によっては revalidatePath が効かない場合があるので安全に握り潰す
      console.warn('revalidatePath failed', e);
    }

    return data;
  } catch (err) {
    console.error('updateFoodRecord サーバーエラー:', err);
    throw err;
  }
}

//ここまで編集機能

//ここから画像のSupabase保存
// ---------- 画像アップロード用 ----------
export async function uploadImageToStorage(file: File, filePath: string) {
 try {
    // ① File → Buffer 化
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ② Storage にアップロード
    const { error: uploadError } = await supabase.storage
      .from("image_photo") // ← バケット名
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false, // 既存ファイルがあるとエラー → 安全
      });

    if (uploadError) {
      console.error("画像アップロードエラー:", uploadError);
      throw new Error("Supabase Storage に画像をアップロードできませんでした。");
    }

    // ③ 公開URLを取得（Public バケット前提）
    const { data: publicUrlData } = supabase.storage
      .from("image_photo")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error("画像の公開URLを取得できませんでした。");
    }

    console.log("uploadImageToStorage success:", publicUrlData.publicUrl);

    // ④ URL を返す
    return publicUrlData.publicUrl;

  } catch (err) {
    console.error("uploadImageToStorage 例外:", err);
    throw err;
  }
}
//ここまで画像のSupabase保存

"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

type ActionState = {
  ok: boolean;
  message: string;
};

export async function addMessage(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!name) return { ok: false, message: "名前を入力してください。" };
  if (!content) return { ok: false, message: "本文を入力してください。" };

  // サーバー専用の Supabase クライアント
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      ok: false,
      message:
        "環境変数が未設定です（SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY）。",
    };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { error } = await supabase
    .from("messages")
    .insert({ name, content });

  if (error) {
    console.error(error);
    return { ok: false, message: `保存に失敗しました：${error.message}` };
  }

  // 一応トップを再検証（一覧を後で追加する拡張も想定）
  revalidatePath("/");

  return { ok: true, message: "保存しました！" };
}

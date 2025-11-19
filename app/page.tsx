"use client";

import { useFormState } from "react-dom";
import styles from "./page.module.css";
import { addMessage } from "./server-actions";

type ActionState = {
  ok: boolean;
  message: string;
};

const initialState: ActionState = { ok: false, message: "" };

export default function Page() {
  const [state, formAction] = useFormState(addMessage, initialState);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>メッセージ送信（Supabase保存）</h1>

      <form action={formAction} className={styles.form}>
        <div>
          <div className={styles.label}>名前</div>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="山田 太郎"
            required
          />
        </div>

        <div>
          <div className={styles.label}>本文</div>
          <textarea
            className={styles.textarea}
            name="content"
            placeholder="本文を入力してください"
            required
          />
        </div>

        <button className={styles.button} type="submit">
          送信
        </button>

        {state.message && (
          <p className={state.ok ? styles.resultOk : styles.resultErr}>
            {state.message}
          </p>
        )}
      </form>
    </main>
  );
}

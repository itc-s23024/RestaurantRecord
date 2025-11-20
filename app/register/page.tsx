'use client';

import { useState } from 'react';
import styles from '../page.module.css'; // スタイルは共通のものを利用するか、register専用CSSを作成
import { useFormState } from 'react-dom'; // Next.js 14で提供される useFormState
import { addMessage } from '../server-actions'; // サーバーアクションのインポート
import Link from 'next/link';

// ⭐ 評価コンポーネント（前回作成したものを利用）
const MAX_RATING = 5;
function RatingComponent() {
  const [rating, setRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0); 

  // useFormStateを使う場合、Hidden Inputを使ってフォームに値を渡す
  return (
    <div className={styles.ratingContainer}>
      <input type="hidden" name="rating" value={rating} />
      
      {Array.from({ length: MAX_RATING }).map((_, index) => {
        const starValue = index + 1;
        const currentRating = hoverRating || rating;

        return (
          <span
            key={index}
            className={styles.star} 
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            style={{
              color: currentRating >= starValue ? 'gold' : 'lightgray', 
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}


// Server Actionの状態を管理する型
type ActionState = {
    ok: boolean;
    message: string;
};
const initialState: ActionState = { ok: false, message: "" };


export default function RegisterPage() {
    // フォーム送信の状態管理 (Server Action)
    const [state, formAction] = useFormState(addMessage, initialState);

    return (
        <div className={styles.container}>
            {/* 戻るボタン (ホーム画面 S-01 へ戻る) */}
            <Link href="/" className={styles.backButton}>
                 新規登録
            </Link>

            <h1 className={styles.header}>新規登録</h1>

            <form action={formAction} className={styles.form}>
                
                {/* 1. タイトル */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="title">タイトル</label>
                    <input className={styles.input} type="text" id="title" name="title" placeholder="例: スパゲティ" required />
                </div>

                {/* 2. 飲食店名 */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="restaurant_name">飲食店名</label>
                    <input className={styles.input} type="text" id="restaurant_name" name="restaurant_name" placeholder="例: サイゼリヤ" required />
                </div>
                
                {/* 3. 訪問回数 */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="visit_count">訪問回数</label>
                    <input className={styles.input} type="number" id="visit_count" name="visit_count" defaultValue="1" min="1" required />
                </div>

                {/* 4. 日付 */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="visit_date">日付</label>
                    <input className={styles.input} type="date" id="visit_date" name="visit_date" required />
                </div>

                {/* 5. 画像（URL） */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="image_url">画像</label>
                    <input className={styles.input} type="url" id="image_url" name="image_url" placeholder="画像のURLを入力" />
                </div>
                
                {/* 6. タグ */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="tags">タグ</label>
                    <input className={styles.input} type="text" id="tags" name="tags" placeholder="タグを入力してEnter" />
                    {/* タグチップの表示エリア (ここでは表示しない) */}
                </div>

                {/* 7. 評価 (星) */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>評価</label>
                    <RatingComponent /> 
                </div>

                {/* 8. 一口メモ (textarea) */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="memo">一口メモ</label>
                    <textarea className={styles.textarea} id="memo" name="memo" rows={4} placeholder="感想やメモを入力"></textarea>
                </div>

                {/* 登録ボタン */}
                <button type="submit" className={styles.button}>登録する</button>

                {/* 登録結果のメッセージ */}
                {state.message && (
                    <p className={state.ok ? styles.success : styles.error}>
                        {state.message}
                    </p>
                )}
            </form>
        </div>
    );
}

// ページに適用するCSSモジュールは、あなたのプロジェクトに合わせて調整が必要です。
// もし app/register/page.tsx を app/page.module.css と同じ階層に置く場合は、
// import styles from './page.module.css'; に修正してください。
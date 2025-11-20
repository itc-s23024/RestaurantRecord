// app/register/page.tsx

'use client'; 

import { useState } from 'react';
import styles from '../page.module.css'; 
import { useFormState } from 'react-dom'; 
import { addMessage } from '../server-actions'; // サーバーアクションのインポート
import Link from 'next/link';

// --------------------------------------------------------
// ⭐ 評価コンポーネント (前回のものを再利用)
const MAX_RATING = 5;
function RatingComponent({ initialRating = 0 }: { initialRating?: number }) {
  const [rating, setRating] = useState(initialRating); 
  const [hoverRating, setHoverRating] = useState(0); 

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
              fontSize: '30px' // 星のサイズを少し大きく
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
// --------------------------------------------------------

type ActionState = { ok: boolean; message: string; };
const initialState: ActionState = { ok: false, message: "" };


export default function RegisterPage() {
    // 状態管理 (useFormStateはクライアントコンポーネントで利用可能)
    const [state, formAction] = useFormState(addMessage, initialState);
    
    // ⭐ サンプルデータ
    const sampleData = {
        title: '寿司',
        restaurant_name: 'スシロー',
        visit_count: 1,
        visit_date: '2023-11-19', // 日付のフォーマットに注意
        image_url: 'https://storage.googleapis.com/sample-images/salmon.jpg',
        tags: 'サーモン, スシロー',
        memo: 'とても美味しかった',
    };

    return (
        <div className={styles.container}>
            {/* 戻るボタン (S-01 ホーム画面へ) */}
            <Link href="/home" className={styles.backButton}>
                 新規登録
            </Link>

            <h1 className={styles.registerHeader}>新規登録</h1> {/* ヘッダー専用のスタイルに変更 */}

            <form action={formAction} className={styles.form}>
                
                {/* 1. タイトル */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="title">タイトル</label>
                    <input className={styles.input} type="text" id="title" name="title" defaultValue={sampleData.title} required />
                </div>

                {/* 2. 飲食店名 */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="restaurant_name">飲食店名</label>
                    <input className={styles.input} type="text" id="restaurant_name" name="restaurant_name" defaultValue={sampleData.restaurant_name} required />
                </div>
                
                {/* 3. 訪問回数 */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="visit_count">訪問回数</label>
                    <input className={styles.input} type="number" id="visit_count" name="visit_count" defaultValue={sampleData.visit_count} min="1" required />
                </div>

                {/* 4. 日付 */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="visit_date">日付</label>
                    <input className={styles.input} type="date" id="visit_date" name="visit_date" defaultValue={sampleData.visit_date} required />
                </div>

                {/* 5. 画像（URL/ファイルアップロード） */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="image_url">画像</label>
                    {/* ここはURL入力のままにして、必要に応じてFile Inputに変更してください */}
                    <input className={styles.input} type="url" id="image_url" name="image_url" defaultValue={sampleData.image_url} placeholder="画像のURLを入力" />
                </div>
                
                {/* 6. タグ */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="tags">タグ</label>
                    <input className={styles.input} type="text" id="tags" name="tags" defaultValue={sampleData.tags} placeholder="タグを入力してEnter" />
                </div>

                {/* 7. 評価 (星) - 評価は入力必須ではないとして、デフォルト値は0 (星なし) */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>評価</label>
                    <RatingComponent initialRating={3} /> 
                </div>

                {/* 8. 一口メモ (textarea) */}
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="memo">一口メモ</label>
                    <textarea 
                        className={styles.textarea} 
                        id="memo" 
                        name="memo" 
                        rows={4} 
                        defaultValue={sampleData.memo}
                        placeholder="感想やメモを入力"
                    />
                </div>

                {/* 登録ボタン */}
                <button type="submit" className={styles.registerSubmitButton}>登録する</button>

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
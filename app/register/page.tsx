
'use client';  // 入力操作があるので client component にします

import React, { useState, ChangeEvent } from 'react'; // useStateなどを追加
import Link from 'next/link';
import { ArrowLeft, Camera } from 'lucide-react'; // 矢印アイコン Cameraアイコンを追加
import styles from '../page.module.css';   // ★一つ上の階層のCSSファイルを読み込む

export default function Register() {
  // ▼▼▼ 追加6: 画像プレビュー用のロジック ▼▼▼
   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

   // 画像が選択された時の処理
   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       // ファイルをブラウザ表示用のURLに変換してプレビュー表示
       const url = URL.createObjectURL(file);
       setPreviewUrl(url);
     }
   };
   // ▲▲▲ 追加6ここまで ▲▲▲
  return (
    <main className={styles.main}>
      {/* ヘッダーエリア (既存の.headerスタイルを再利用) */}
      <header className={styles.header}>
        {/* 今回追加した .headerRow で中身を横並びにする */}
        <div className={styles.headerRow}>
          {/* 戻るボタン */}
          <Link href="/" className={styles.backButton}>
            {/* デザインに合わせて少し大きめの矢印 */}
            <ArrowLeft size={32} strokeWidth={2.5} />
          </Link>

          {/* タイトル */}
          <h1 className={styles.pageTitle}>新規登録</h1>
        </div>
      </header>

      {/* フォームエリア */}
      <div className={styles.formContainer}>
        <form>
          {/* タイトル */}
          <div className={styles.formGroup}>
            <label className={styles.label}>タイトル</label>
            <input 
              type="text" 
              placeholder="例: スパゲティ" 
              className={styles.inputField}
            />
          </div>

          {/* 飲食店名 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>飲食店名</label>
            <input 
              type="text" 
              placeholder="例: サイゼリヤ" 
              className={styles.inputField}
            />
          </div>

          {/* 訪問回数 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>訪問回数</label>
            <input 
              type="number" 
              defaultValue={1} // 初期値を1に設定
              className={styles.inputField}
            />
          </div>

          {/* 日付 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>日付</label>
            <input 
              type="date" 
              // 今日の日付を初期値にする例（必要に応じて調整）
              defaultValue={new Date().toISOString().split('T')[0]} 
              className={styles.inputField}
            />
          </div>
          {/* ▼▼▼ 変更6: 画像入力エリアを丸ごと書き換え ▼▼▼ */}
            <div className={styles.formGroup}>
              <label className={styles.label}>画像</label>
              
             {/* 隠しinputと、それを操作するラベル */}
             <input 
               type="file" 
               accept="image/*"
               onChange={handleImageChange}
               id="imageUpload"
               className={styles.hiddenInput}
             />
             
             <label htmlFor="imageUpload" className={styles.imageUploadLabel}>
               {previewUrl ? (
                 // 画像が選択されている場合：プレビューを表示
                 <img src={previewUrl} alt="プレビュー" className={styles.previewImage} />
               ) : (
                 // 画像がまだの場合：カメラアイコンとテキストを表示
                 <div className={styles.placeholderContainer}>
                   <Camera size={40} strokeWidth={1.5} />
                   <span className={styles.placeholderText}>写真をアップロード</span>
                 </div>
               )}
             </label>
            </div>
            {/* ▲▲▲ 変更6ここまで ▲▲▲ */}
        </form>
      </div>
    </main>
  );
}
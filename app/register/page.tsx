
'use client';  // 入力操作があるので client component にします

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'; // 矢印アイコン
import styles from '../page.module.css';   // ★一つ上の階層のCSSファイルを読み込む

export default function Register() {
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
        </form>
      </div>
    </main>
  );
}
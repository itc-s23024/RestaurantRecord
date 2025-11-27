import React from 'react';
import Link from 'next/link';
// ピンアイコン、矢印、編集ペン をインポート
import { ArrowLeft, Pencil, MapPin, Calendar} from 'lucide-react';  // Calendarを追加
import styles from '../../page.module.css';

export default function ViewPage({ params }: { params: { id: string } }) {
  // 表示確認用のダミーデータ
  const data = {
    title: 'スパゲティ',
    restaurant: 'サイゼリヤ',
    date: '2024/01/01',
    count: 3,
    imageUrl: '/dummy.jpg', // 適切な画像パスに変更してください
  };

  return (
    <main className={styles.main}>
      {/* ヘッダーエリア */}
      <header className={styles.header}>
        <div className={styles.headerBetween}>
          <Link href="/" className={styles.backButton}>
            <ArrowLeft size={32} strokeWidth={2.5} />
          </Link>
          {/* ヘッダー内のタイトルは詳細画面では「詳細」などの固定文字にするか、空でもOK */}
          <h1 className={styles.pageTitle}>詳細</h1>
          <Link href={`/edit/${params.id}`} className={styles.editButton}>
            <Pencil size={24} strokeWidth={2.5} />
          </Link>
        </div>
      </header>

      {/* メインコンテンツエリア */}
      <div className={styles.content}>
        
        {/* 1. タイトル（一番上） */}
        <h1 className={styles.viewMainTitle}>{data.title}</h1>

        {/* 2. 画像 */}
        <img 
          src={data.imageUrl} 
          alt={data.title} 
          className={styles.viewImage}
        />

        {/* 3. 飲食店名 */}
        <div className={styles.viewRestaurant}>
          <MapPin size={20} />
          <span>{data.restaurant}</span>
        </div>

        {/* 4. 日付と訪問回数（横並び） */}
        <div className={styles.viewMetaRow}>
          {/* 日付（枠線なし） */}
          <div className={styles.dateItem}>
            <Calendar size={20} strokeWidth={2} /> {/* アイコンを表示 */}
            <span>{data.date}</span>
          </div>

          {/* 訪問回数（丸い枠線） */}
          <div className={styles.countBadge}>
            <span>訪問回数</span>
            <span>{data.count}</span>
          </div>
        </div>

        {/* ここより下にメモやタグなどが続く想定 */}
        <p>ここに感想などが表示されます...</p>

      </div>
    </main>
  );
}
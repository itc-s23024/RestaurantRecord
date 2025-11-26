'use client';   //【重要】useStateを使うために必要

import { useState } from 'react'; //  追加(タグ・フィルター)
import styles from './page.module.css';
import { Search, Filter, Star, Plus } from 'lucide-react'; //   Filterを追加  Starを追加 Plusアイコンを追加

export default function Home() {
  // 表示確認用のダミーデータ（データ連携はせず配列で用意）
  const tags = ['すべて', 'イタリアン', 'スパゲティ', 'サイゼリヤ', '和食', 'うなぎ'];
  // 選択中のタグを管理するState
  const [activeTag, setActiveTag] = useState('すべて');
  // ▼▼▼ 追加2: 表示用のダミーデータ ▼▼▼
  const foodRecords = [
    {
      id: 1,
      image: '', // 画像は今回はプレースホルダー
      name: 'スパゲティ',
      tags: ['イタリアン', 'スパゲティ', 'サイゼリヤ'],
      rating: 4, // 5段階評価
      comment: 'とても美味しかった',
    },
    {
      id: 2,
      image: '',
      name: '鰻重',
      tags: ['和食', 'うなぎ'],
      rating: 3,
      comment: 'とても美味しかった\n店が少し汚かった', // 改行を含むテキスト
    },
  ];
  // 星を描画するヘルパー関数
  const renderStars = (rating: number) => {
    return (
      <div className={styles.starRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            fill={star <= rating ? '#FFFF00' : '#e5e7eb'} // 黄色で塗りつぶし / グレー
            color={star <= rating ? '#eab308' : '#d1d5db'} // 枠線の色
            strokeWidth={1}
            className={styles.starIcon}
          />
        ))}
      </div>
    );
  };

  return (
    <main className={styles.main}>
      {/* ヘッダーエリア */}
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.appTitle}>ごちノート</h1>
          <p className={styles.subTitle}>あなたの美味しい思い出</p>
        </div>

        {/* 検索エリア */}
        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>
            <Search size={24} strokeWidth={2.5} />
          </div>
          <input 
            type="text" 
            placeholder="検索..." 
            className={styles.searchInput}
          />
        </div>
      </header>
      {/* ▼▼▼ 追加1: フィルター・タグセクション ▼▼▼ */}
      <div className={styles.filterSection}>
        {/* 左端のフィルターアイコン */}
        <button className={styles.filterIconButton}>
          <Filter size={24} strokeWidth={2} color="#666" />
        </button>

        {/* 横スクロール可能なタグリスト */}
        <div className={styles.tagList}>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`${styles.tagButton} ${
                activeTag === tag ? styles.tagActive : styles.tagInactive
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {/* ▲▲▲ 追加1ここまで ▲▲▲ */}

      {/* ▼▼▼ 追加2 変更: コンテンツエリア（カードリスト） ▼▼▼ */}
      <div className={styles.content}>
        {foodRecords.map((record) => (
          <div key={record.id} className={styles.card}>
            {/* 上部：画像プレースホルダー */}
            <div className={styles.cardImageArea}>
              {/* ここに将来的に <img /> が入ります */}
            </div>

            {/* 下部：詳細情報 */}
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{record.name}</h2>

              {/* カード内のタグリスト */}
              <div className={styles.cardTags}>
                {record.tags.map((tag, index) => (
                  <span key={index} className={styles.cardTagItem}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* 星評価 */}
              {renderStars(record.rating)}
            </div>

            {/* コメントエリア（グレー背景） */}
            <div className={styles.cardComment}>
              {record.comment.split('\n').map((line, i) => (
                <p key={i} className={styles.commentLine}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {/* ▲▲▲ 追加2ここまで ▲▲▲ */}
      </div>
      {/* ▼▼▼ ここから追加3: 新規登録ボタン ▼▼▼ */}
       <div className={styles.fabContainer}>
         <button className={styles.fabButton}>
           <Plus size={24} strokeWidth={2.5} />
           <span>新規登録</span>
         </button>
       </div>
       {/* ▲▲▲ 追加3ここまで ▲▲▲ */}
    </main>
  );
}
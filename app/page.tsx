'use client';   //【重要】useStateを使うために必要

import { useState, useEffect } from 'react'; //  追加(タグ・フィルター) useEffectを追加
import styles from './page.module.css';
import { Search, Filter, Star, Plus } from 'lucide-react'; //   Filterを追加  Starを追加 Plusアイコンを追加
import Link from 'next/link'; //画面遷移
import { searchFoods } from './server-actions'; // ★サーバーアクションをインポート

// ★ Supabase の food_records に合わせた型定義
type FoodRecord = {
  id: number;
  title: string;
  restaurant: string | null;
  count: number;
  date: string;
  tags: string[];
  rating: number;
  memo: string;
  image_url: string | null;
};

export default function Home() {
  // 表示確認用のダミーデータ（データ連携はせず配列で用意）
  const tags = ['すべて', 'イタリアン', 'スパゲティ', 'サイゼリヤ', '和食', 'うなぎ'];
  // 選択中のタグを管理するState
  const [activeTag, setActiveTag] = useState('すべて');

  // ▼▼▼ 変更: データはstateで管理し、初期値は空配列にする ▼▼▼
  const [records, setRecords] = useState<FoodRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // 検索キーワード用

  // 画面が表示された時にデータを読み込む
  useEffect(() => {
    const fetchInitialData = async () => {
      const data = await searchFoods('', 'すべて'); // 初期値はタグなし
      setRecords(data);
    };
    fetchInitialData();
  }, []);

   // 検索を実行する関数
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    // キーワードと、現在選択されているタグの両方を使って検索
    const results = await searchFoods(query, activeTag);
    setRecords(results);
  };

  //タグ絞り込み関連
  // ▼▼▼ 追加: タグを選択した時の処理 ▼▼▼
   const handleTagSelect = async (tag: string) => {
     setActiveTag(tag); // 見た目の選択状態を更新
     // 現在の検索キーワードと、新しく選んだタグで検索
     const results = await searchFoods(searchQuery, tag);
     setRecords(results);
   };
   // ▲▲▲ 追加ここまで ▲▲▲　タグ絞り込み関連

  // エンターキーで検索するためのハンドラ
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

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
          {/* ▼▼▼ 検索入力欄の変更 ▼▼▼ */}
          <input 
            type="text" 
            placeholder="検索..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)} // 文字入力のたびに検索（リアルタイム検索）
            onKeyDown={handleKeyDown} // エンターキーでも検索
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
              onClick={() => handleTagSelect(tag)} // ★ここを新しい関数に変更
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
      {/* コンテンツエリア（カードリスト） */}
      <div className={styles.content}>
        {/* データがない場合のメッセージ */}
        {records.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            見つかりませんでした
          </p>
        )}

        {records.map((record) => (
          // カードをクリックしたら詳細画面へ遷移するようにLinkで囲む
          <Link href={`/view/${record.id}`} key={record.id} style={{ textDecoration: 'none' }}>
            <div className={styles.card}>
            {/* 上部：画像プレースホルダー */}
            <div className={styles.cardImageArea}>
              {/* ここに将来的に <img /> が入ります */}
              {record.image_url ? (
                <img src={record.image_url} className={styles.cardImage} />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
            </div>

            {/* 下部：詳細情報 */}
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>{record.title}</h2>

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
              {record.memo.split('\n').map((line, i) => (
                <p key={i} className={styles.commentLine}>{line}</p>
              ))}
            </div>
          </div>
        </Link>
        ))}
        {/* ▲▲▲ 追加2ここまで ▲▲▲ */}
      </div>
      {/* ▼▼▼ ここから追加3: 新規登録ボタン ▼▼▼ */}
       <div className={styles.fabContainer}>
         <Link href="/register" className={styles.fabButton}>
          <Plus size={24} strokeWidth={2.5} />
          <span>新規登録</span>
        </Link>
       </div>
       {/* ▲▲▲ 追加3ここまで ▲▲▲ */}
    </main>
  );
}
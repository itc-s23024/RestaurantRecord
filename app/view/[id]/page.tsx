
'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
// ピンアイコン、矢印、編集ペン をインポート
import { ArrowLeft, Pencil, MapPin, Calendar, Star, ExternalLink, Trash2 } from 'lucide-react';  // Calendarを追加 Starを追加 ExternalLinkを追加 Trash2を追加
import styles from '../../page.module.css';
import { getFoodRecordById } from '../../server-actions';   //サーバーアクションをimport

export default function ViewPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  //  id で Supabase からデータを取得
  useEffect(() => {
    const fetchData = async () => {
      const record = await getFoodRecordById(params.id);
      setData(record);
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  if (loading) {
    return <p className={styles.loadingText}>読み込み中...</p>;
  }

  if (!data) {
    return <p className={styles.errorText}>データが存在しません。</p>;
  }

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
          {/* ▼▼▼ 追加: レイアウト調整用の空要素（タイトルを中央に保つため） ▼▼▼ */}
           <div style={{ width: 32 }}></div>
        </div>
      </header>

      {/* メインコンテンツエリア */}
      <div className={styles.content}>
        
        {/* 1. タイトル（一番上） */}
        <h1 className={styles.viewMainTitle}>{data.title}</h1>

        {/* 2. 画像 */}
        <img 
          src={data.image_url} 
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

        {/* ▼▼▼ 追加12: 区切り線 ▼▼▼ */}
         <hr className={styles.separator} />
         {/* ▲▲▲ 追加12ここまで ▲▲▲ */}

        {/* ▼▼▼ 追加12: タグリストの表示 ▼▼▼ */}
         <div className={styles.viewTagList}>
           {(data.tags ?? []).map((tag: string, index: number) => (
             <span key={index} className={styles.viewTagItem}>
               {tag}
             </span>
           ))}
         </div>
         {/* ▲▲▲ 追加12ここまで ▲▲▲ */}

         {/* ▼▼▼ 追加13: 星評価の表示 ▼▼▼ */}
         <div className={styles.viewStarRating}>
           {[1, 2, 3, 4, 5].map((star) => (
             <Star
               key={star}
               size={32} // 見やすいサイズ
               // 評価以下なら黄色、それ以外はグレー
               fill={star <= data.rating ? '#FFFF00' : '#e5e7eb'}
               color={star <= data.rating ? '#eab308' : '#d1d5db'}
               strokeWidth={1}
             />
           ))}
         </div>
         {/* ▲▲▲ 追加13ここまで ▲▲▲ */}

         {/* ▼▼▼ 追加14: 星評価とメモの間の区切り線 ▼▼▼ */}
         <hr className={styles.separator} />
         {/* ▲▲▲ 追加14ここまで ▲▲▲ */}

         {/* ▼▼▼ 追加14: 一口メモの表示 ▼▼▼ */}
         {/* 「一口メモS」というラベルが必要な場合はここに追加してください */}
         <div className={styles.viewMemo}>
           {data.memo}
         </div>
         {/* ▲▲▲ 追加14ここまで ▲▲▲ */}

         {/* ▼▼▼ 追加15: 区切り線 ▼▼▼ */}
         <hr className={styles.separator} style={{ marginTop: '24px' }} />
         
         {/* ▼▼▼ 追加15: 店の場所セクション ▼▼▼ */}
         {/* ▼▼▼ 修正: 店の場所（地図とボタン） ▼▼▼ */}
        <div className={styles.locationSection}>
           
           {/* 1. 上段：住所とボタンの横並び */}
           <div className={styles.locationHeader}>
             
             {/* 左：住所 (アイコン + 文字) */}
             <div className={styles.viewAddress}>
               <MapPin size={20} color="#000" />
               <span>場所</span>
             </div>

             {/* 右：Google Mapボタン */}
             <a 
               href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address || '')}`} 
               target="_blank" 
               rel="noopener noreferrer"
               className={styles.googleMapButton}
             >
               <ExternalLink size={14} />
               <span>Google Mapを開く</span>
             </a>
           </div>

           {/* 2. 下段：地図 (枠線なし) */}
           <div className={styles.mapContainer}>
             <iframe
               className={styles.mapFrame}
               title="map"
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.828030589146!2d139.7645492762319!3d35.68123617258707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bfbd89f7007%3A0x277c49ba34ed38!2z5p2x5Lqs6aeF!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp"
               loading="lazy"
             ></iframe>
           </div>

         </div>
          {/* ▲▲▲ 修正ここまで ▲▲▲ */}
         {/* ▲▲▲ 追加15ここまで ▲▲▲ */}

         {/* ▼▼▼ 追加16: 区切り線 ▼▼▼ */}
         <hr className={styles.separator} style={{ marginTop: '24px' }} />
         {/* ▼▼▼ 追加16: 編集・削除ボタンエリア（一番下） ▼▼▼ */}
         <div className={styles.actionButtonContainer}>
           
           {/* 編集ボタン（緑） */}
           <Link 
             href={`/edit/${params.id}`} 
             className={`${styles.actionButton} ${styles.editAction}`}
           >
             <Pencil size={20} />
             <span>編集</span>
           </Link>

           {/* 削除ボタン（赤） */}
           <button 
             type="button"
             className={`${styles.actionButton} ${styles.deleteAction}`}
             onClick={() => alert('削除確認ダイアログを表示します')}
           >
             <Trash2 size={20} />
             <span>削除</span>
           </button>
         </div>
         {/* ▲▲▲ 追加16ここまで ▲▲▲ */}
      </div>
    </main>
  );
}
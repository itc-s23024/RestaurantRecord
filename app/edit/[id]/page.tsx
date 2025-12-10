'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, X, Star } from 'lucide-react';
import styles from '../../page.module.css';

// ★ サーバーアクション（自分の環境のものに合わせて）
import { getFoodRecordById, updateFoodRecord } from '../../server-actions';

export default function EditPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [form, setForm] = useState({
    title: '',
    restaurant: '',
    count: 1,
    date: '',
    tags: [] as string[],
    rating: 0,
    memo: '',
    image_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // -------------------------------
  //  編集ページ初期表示：既存データ取得
  // -------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const data = await getFoodRecordById(id);

      if (!data) return;

      setForm({
        title: data.title,
        restaurant: data.restaurant ?? '',
        count: data.count ?? 1,
        date: data.date ?? '',
        tags: data.tags ?? [],
        rating: data.rating ?? 0,
        memo: data.memo ?? '',
        image_url: data.image_url ?? '',
      });

      setPreviewUrl(data.image_url ?? null);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  // -------------------------------
  //  フォーム入力変更
  // -------------------------------
  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // タグの入力（カンマ区切り）
  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateField("tags", e.target.value.split(',').map((tag) => tag.trim()));
  };

  // -------------------------------
  // 編集後の送信処理
  // -------------------------------
  const handleSubmit = async () => {
    await updateFoodRecord(id, form);
    alert('更新しました');
    window.location.href = `/view/${id}`;
  };


  if (loading) {
    return <p className={styles.loadingText}>読み込み中...</p>;
  }

  return (
    <main className={styles.main}>
      
      {/* ===== ヘッダー ===== */}
      <header className={styles.header}>
        <div className={styles.headerBetween}>
          <Link href={`/view/${id}`} className={styles.backButton}>
            <ArrowLeft size={32} strokeWidth={2.5} />
          </Link>
          <h1 className={styles.pageTitle}>編集</h1>
          <div style={{ width: 32 }}></div>
        </div>
      </header>

      {/* ===== フォームエリア ===== */}
      <div className={styles.content}>

        {/* タイトル */}
        <label className={styles.label}>料理名</label>
        <input
          className={styles.input}
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />

        {/* 飲食店名 */}
        <label className={styles.label}>飲食店名</label>
        <input
          className={styles.input}
          value={form.restaurant}
          onChange={(e) => updateField("restaurant", e.target.value)}
        />

        {/* 日付 */}
        <label className={styles.label}>日付</label>
        <input
          type="date"
          className={styles.input}
          value={form.date}
          onChange={(e) => updateField("date", e.target.value)}
        />

        {/* 訪問回数 */}
        <label className={styles.label}>訪問回数</label>
        <input
          type="number"
          className={styles.input}
          value={form.count}
          onChange={(e) => updateField("count", Number(e.target.value))}
        />

        {/* 画像プレビュー */}
        <label className={styles.label}>画像</label>
        {previewUrl && (
          <div className={styles.previewWrapper}>
            <img src={previewUrl} alt="preview" className={styles.previewImage} />
            <button className={styles.removeImageButton} onClick={() => setPreviewUrl(null)}>
              <X size={20} />
            </button>
          </div>
        )}

        {/* 画像 URL 直接編集 */}
        <input
          className={styles.input}
          placeholder="画像URLを入力"
          value={form.image_url}
          onChange={(e) => {
            updateField("image_url", e.target.value);
            setPreviewUrl(e.target.value);
          }}
        />

        {/* タグ */}
        <label className={styles.label}>タグ（カンマ区切り）</label>
        <input
          className={styles.input}
          value={form.tags.join(',')}
          onChange={handleTagsChange}
        />

        {/* 星評価 */}
        <label className={styles.label}>評価</label>
        <div className={styles.starRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={32}
              fill={star <= form.rating ? "#FFFF00" : "#e5e7eb"}
              color="#eab308"
              className={styles.starButton}
              onClick={() => updateField("rating", star)}
            />
          ))}
        </div>

        {/* メモ */}
        <label className={styles.label}>メモ</label>
        <textarea
          className={styles.textarea}
          value={form.memo}
          onChange={(e) => updateField("memo", e.target.value)}
        />

        {/* 送信ボタン */}
        <button className={styles.submitButton} onClick={handleSubmit}>
          更新する
        </button>

      </div>
    </main>
  );
}


'use client';  // 入力操作があるので client component にします

import React, { useState, ChangeEvent, KeyboardEvent } from 'react'; // useStateなどを追加 KeyboardEventを追加
import Link from 'next/link';
import { ArrowLeft, Camera, X, Star } from 'lucide-react'; // 矢印アイコン Cameraアイコンを追加 X(削除アイコン)を追加 Starを追加
import styles from '../page.module.css';   // ★一つ上の階層のCSSファイルを読み込む
// ★★★ 追加: server action を読み込む ★★★
import { addFoodRecord } from '../server-actions';
// ★★★ 追加: 画面遷移用の Router ★★★
import { useRouter } from 'next/navigation';

export default function Register() {

  const router = useRouter(); // ← 追加

  // ▼▼▼ 追加6: 画像プレビュー用のロジック ▼▼▼
   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

   // ▼▼▼ 追加7: タグ管理用のステートとロジック ▼▼▼
   const [tags, setTags] = useState<string[]>([]); // 追加されたタグのリスト
   const [tagInput, setTagInput] = useState('');   // 入力中の文字

   // ▼▼▼ 追加8: 評価（星の数）のステート ▼▼▼
   const [rating, setRating] = useState(0); // 初期値は0（未評価）
   const [memo, setMemo] = useState(''); // メモ入力用のステートを追加 追加9

   // ▼ 追加: 各フォームの入力値を管理するステート
  const [title, setTitle] = useState('');
  const [shopName, setShopName] = useState('');
  const [visitCount, setVisitCount] = useState(1);
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );

   // Enterキーが押された時の処理
   // ------- タグ処理 -------
   const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
     if (e.key === 'Enter') {
       e.preventDefault(); // フォーム送信を防ぐ
       if (tagInput.trim() !== '') {
         // 空白でなければリストに追加
         setTags([...tags, tagInput.trim()]);
         setTagInput(''); // 入力欄をクリア
       }
     }
   };

   // タグを削除する処理
   const removeTag = (indexToRemove: number) => {
     setTags(tags.filter((_, index) => index !== indexToRemove));
   };
   // ▲▲▲ 追加7ここまで ▲▲▲

   // 画像が選択された時の処理
   // ------- 画像プレビュー -------
   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       // ファイルをブラウザ表示用のURLに変換してプレビュー表示
       const url = URL.createObjectURL(file);
       setPreviewUrl(url);
     }
   };
   // ▲▲▲ 追加6ここまで ▲▲▲

  // ----------------------------------------------------------
  // ★★★ 登録ボタンの処理（Supabase に保存 → ホームへ戻る）★★★
  // ----------------------------------------------------------
  const handleSubmit = async () => {
    try {
      // Supabase に送るデータを作成（画像は除外）
      await addFoodRecord({
  title: title,
  restaurant: shopName,
  count: visitCount,
  date: date,
  tags: tags,
  rating: rating,
  memo: memo,
  imageUrl: null,
});

      // 登録完了 → ホームへ戻る
      router.push('/');
    } catch (error) {
      alert('登録に失敗しました');
      console.error(error);
    }
  };


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
          {/* タイトル入力フォーム */}
          <div className={styles.formGroup}>
            <label className={styles.label}>タイトル</label>
            <input 
              type="text" 
              placeholder="例: スパゲティ" 
              className={styles.inputField}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 飲食店名入力フォーム */}
          <div className={styles.formGroup}>
            <label className={styles.label}>飲食店名</label>
            <input 
              type="text" 
              placeholder="例: サイゼリヤ" 
              className={styles.inputField}
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>

          {/* 訪問回数入力フォーム */}
          <div className={styles.formGroup}>
            <label className={styles.label}>訪問回数</label>
            <input 
              type="number" 
              defaultValue={1} // 初期値を1に設定
              className={styles.inputField}
              value={visitCount}
              onChange={(e) => setVisitCount(Number(e.target.value))}
            />
          </div>

          {/* 日付入力フォーム */}
          <div className={styles.formGroup}>
            <label className={styles.label}>日付</label>
            <input 
              type="date" 
              // 今日の日付を初期値にする例（必要に応じて調整）
              defaultValue={new Date().toISOString().split('T')[0]} 
              className={styles.inputField}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          {/* ▼▼▼ 変更6: 画像入力エリアを丸ごと書き換え ▼▼▼ */}
            <div className={styles.formGroup}>
              <label className={styles.label}>画像</label>
              
             {/* 隠しinputと、それを操作するラベル */}
             <input 
               type="file" 
               accept="image/*"
               id="imageUpload"
               onChange={handleImageChange}
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

            {/* ▼▼▼ 追加7: タグ入力フォーム ▼▼▼ */}
           <div className={styles.formGroup}>
             <label className={styles.label}>タグ</label>
             <input 
               type="text" 
               placeholder="タグを入力してEnter" 
               className={styles.inputField}
               value={tagInput}
               onChange={(e) => setTagInput(e.target.value)}
               onKeyDown={handleTagKeyDown} // Enterキーを検知
             />
             
             {/* 追加されたタグの表示エリア */}
             <div className={styles.addedTagsArea}>
               {tags.map((tag, index) => (
                 <span key={index} className={styles.addedTagItem}>
                   {tag}
                   {/* 削除ボタン */}
                   <button 
                     type="button" 
                     onClick={() => removeTag(index)}
                     className={styles.removeTagButton}
                   >
                     <X size={14} />
                   </button>
                 </span>
               ))}
             </div>
           </div>
           {/* ▲▲▲ 追加7ここまで ▲▲▲ */}

           {/* ▼▼▼ 追加8: 星評価フォーム ▼▼▼ */}
           <div className={styles.formGroup}>
             <label className={styles.label}>評価</label>
             <div className={styles.ratingContainer}>
               {[1, 2, 3, 4, 5].map((star) => (
                 <button
                   key={star}
                   type="button" // フォーム送信を防ぐために必須
                   onClick={() => setRating(star)} // クリックで評価をセット
                   className={styles.starButton}
                 >
                   <Star
                     size={40} // 押しやすいように少し大きめ
                     // 条件分岐: 現在の評価以下なら黄色、それ以外はグレー
                     fill={star <= rating ? '#FFFF00' : '#e5e7eb'}
                     color={star <= rating ? '#eab308' : '#d1d5db'}
                     strokeWidth={1}
                   />
                 </button>
               ))}
             </div>
           </div>
           {/* ▲▲▲ 追加8ここまで ▲▲▲ */}
           {/* ▼▼▼ 追加9: 一口メモ入力フォーム ▼▼▼ */}
           <div className={styles.formGroup}>
             <label className={styles.label}>一口メモ</label>
             <textarea
               placeholder="感想やメモを入力"
               className={styles.textArea}
               value={memo}
               onChange={(e) => setMemo(e.target.value)}
             />
           </div>

           {/* ▼▼▼ 追加9: 登録ボタン ▼▼▼ */}
           <button
             type="button" // 今回は画面遷移なしのためbutton
             className={styles.submitButton}
             onClick={handleSubmit}
           >
             登録する
           </button>
           {/* ▲▲▲ 追加9ここまで ▲▲▲ */}
           
        </form>
      </div>
    </main>
  );
}
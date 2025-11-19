// app/page.tsx

'use client'; // ← クライアントコンポーネント化

import { useState, useMemo } from 'react';
import styles from './page.module.css';
import Link from 'next/link';

// 画面設計書S-02より、新規登録は /register にリンク
const REGISTER_URL = "/register";

// 【重要】ここでSupabaseから取得した全てのデータを保持します
// 実際はuseEffectでSupabaseからフェッチするロジックが入ります。
const allRecords = [
    { id: 1, title: 'スパゲティ', memo: 'とても美味しかった', rating: 4, tags: ['イタリアン', 'スパゲティ', 'サイゼリヤ'], restaurant: 'サイゼリヤ' },
    { id: 2, title: '鰻重', memo: 'とても美味しかった\n店が少し汚かった', rating: 3, tags: ['和食', 'うなぎ'], restaurant: 'うなぎ屋' },
    { id: 3, title: 'マルゲリータ', memo: 'チーズが濃厚', rating: 5, tags: ['イタリアン', 'ピザ'], restaurant: 'ピザ専門店' },
    // データ例を追加
];

// タグフィルターのリスト（ユニークなタグを抽出）
const uniqueTags = ["すべて", ...Array.from(new Set(allRecords.flatMap(record => record.tags)))];

export default function HomePage() {
    // 状態管理
    const [searchTerm, setSearchTerm] = useState(''); // 検索窓の入力値
    const [activeTag, setActiveTag] = useState('すべて'); // アクティブなタグ

    // フィルターされた記録リストの計算（Memo化でパフォーマンス向上）
    const filteredRecords = useMemo(() => {
        let list = allRecords;

        // 1. タグによる絞り込み
        if (activeTag !== 'すべて') {
            list = list.filter(record => record.tags.includes(activeTag));
        }

        // 2. 検索キーワードによる絞り込み
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            list = list.filter(record => 
                // タイトル、飲食店名、メモ、タグのいずれかにキーワードが含まれるかをチェック
                record.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                record.restaurant.toLowerCase().includes(lowerCaseSearchTerm) ||
                record.memo.toLowerCase().includes(lowerCaseSearchTerm) ||
                record.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }

        return list;
    }, [activeTag, searchTerm]); // activeTag または searchTerm が変更されたときだけ再計算

    // タブクリック時のハンドラ
    const handleTagClick = (tag: string) => {
        setActiveTag(tag);
    };

    // 検索窓入力時のハンドラ
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className={styles.container}>
            {/* 1. ヘッダー（タイトル） */}
            <header className={styles.header}>
                <h1>ごちノート</h1>
                <p>あなたの美味しい思い出</p>
            </header>

            {/* 2. 検索バー (🔍と入力ハンドラの追加) */}
            <div className={styles.searchBar}>
                <input 
                    type="search" 
                    placeholder="検索..." 
                    className={styles.searchInput} 
                    value={searchTerm}
                    onChange={handleSearchChange} // ⬅️ 入力ハンドラ
                />
                <span className={styles.searchIcon}>🔍</span>
            </div>

            {/* 3. タブフィルターとフィルターアイコン (ボタンにイベントを追加) */}
            <div className={styles.filterSection}>
                <span className={styles.filterIcon}>▼</span>
                <div className={styles.tabContainer}>
                    {uniqueTags.map(tag => (
                        <button 
                            key={tag} 
                            onClick={() => handleTagClick(tag)} // ⬅️ クリックイベント
                            className={`${styles.tabButton} ${activeTag === tag ? styles.active : ''}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. 記録カードのリスト */}
            <main className={styles.recordList}>
                {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                        <Link href={`/view/${record.id}`} key={record.id} className={styles.recordCard}>
                            {/* ... カードの表示内容は前回のまま ... */}
                            <div className={styles.cardContent}>
                                <h2 className={styles.cardTitle}>{record.title}</h2>
                                <div className={styles.tagChipsArea}>
                                    {record.tags.map(tag => (
                                        <span key={tag} className={styles.tagChip}>{tag}</span>
                                    ))}
                                </div>
                                <div className={styles.starRating}>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} style={{ color: i < record.rating ? 'gold' : 'lightgray' }}>★</span>
                                    ))}
                                </div>
                                <p className={styles.cardMemo}>{record.memo}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className={styles.noResults}>該当する記録は見つかりませんでした。</p>
                )}
            </main>

            {/* 5. 新規登録ボタン */}
            <Link href={REGISTER_URL} className={styles.registerButton}>
                <span className={styles.plusIcon}>+</span> 新規登録
            </Link>
        </div>
    );
}
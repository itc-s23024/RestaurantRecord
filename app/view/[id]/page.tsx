// app/view/[id]/page.tsx

// Server Component (データをフェッチするため)

import styles from '../../page.module.css'; // 共通のCSSを使用
import Link from 'next/link';

// ------------------- Helper Components -------------------

// 評価 (星) 表示コンポーネント
const StarRating = ({ rating }: { rating: number }) => (
    <div className={styles.starRating} style={{ display: 'flex' }}>
        {Array.from({ length: 5 }).map((_, i) => (
            <span 
                key={i} 
                // CSSモジュール内の styles.star を再利用する代わりに、インラインで色を指定
                style={{ 
                    color: i < rating ? 'gold' : 'lightgray', 
                    fontSize: '30px', 
                    marginRight: '2px' 
                }}
            >
                ★
            </span>
        ))}
    </div>
);

// ------------------- Mock Data Fetching (実際はServer Action/Supabase) -------------------

// 実際のデータ取得をシミュレート
async function getRecordById(id: string) {
    // 【TODO: Supabase実装】
    // const { data } = await supabase.from('restaurant_records').select('*').eq('id', id).single();
    // return data;

    // モックデータ
    if (id === '1') {
        return {
            id: '1',
            title: '鰻重',
            restaurant_name: 'うなぎ屋恵比寿',
            visit_date: '2025年11月2日',
            visit_count: 1,
            // 実際の画像URLを設定してください
            image_url: 'https://images.unsplash.com/photo-1549488344-932c02c462f8?fit=crop&w=600&h=400&q=80', 
            tags: ['和食', 'うなぎ'],
            rating: 3,
            memo: 'とても美味しかった\n店は少し汚かった',
            location: '東京都渋谷区恵比寿', // Googleマップ用
        };
    }
    return null; 
}

// ------------------- Main Component -------------------

export default async function ViewRecordPage({ params }: { params: { id: string } }) {
    const recordId = params.id;
    const record = await getRecordById(recordId); 

    if (!record) {
        return <div className={styles.container}>記録が見つかりませんでした。 (ID: {recordId})</div>;
    }

    // Googleマップ検索用のURL（場所名で検索）
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(record.location)}`;
    const editUrl = `/register?id=${record.id}`; // 編集画面（S-02）へのリンク

    return (
        <div className={styles.container}>
            
            {/* 1. ヘッダー（戻るボタンとタイトル） */}
            <header className={styles.detailHeader}>
                <Link href="/home" className={styles.backButton}>
                    &#8592; 戻る
                </Link>
                <h1 className={styles.detailTitle}>食事記録詳細</h1>
            </header>

            {/* 2. 画像 */}
            <div className={styles.imageContainer}>
                <img 
                    src={record.image_url} 
                    alt={record.title} 
                    className={styles.mainImage} 
                    // Next/Image を使うと最適化されますが、ここでは標準のimgタグを使用
                /> 
            </div>

            {/* 3. 詳細情報セクション */}
            <main className={styles.detailContent}>
                
                {/* タイトルとメタデータ */}
                <h2 className={styles.recordTitle}>{record.title}</h2>
                <p className={styles.recordMeta}>
                    📍 {record.restaurant_name}
                </p>
                <p className={styles.recordMeta}>
                    📅 {record.visit_date} <span>|</span> {record.visit_count}回目の訪問
                </p>

                {/* 4. タグ */}
                <div className={styles.detailSection}>
                    <h3 className={styles.sectionHeader}>タグ</h3>
                    <div className={styles.tagChipsArea}>
                        {record.tags.map(tag => (
                            <span key={tag} className={styles.tagChip}>{tag}</span>
                        ))}
                    </div>
                </div>

                {/* 5. 評価 */}
                <div className={styles.detailSection}>
                    <h3 className={styles.sectionHeader}>評価</h3>
                    <StarRating rating={record.rating} />
                </div>
                
                <hr className={styles.divider} />

                {/* 6. 一口メモ */}
                <div className={styles.detailSection}>
                    <h3 className={styles.sectionHeader}>一口メモ</h3>
                    <p className={styles.memoText}>{record.memo}</p>
                </div>

                <hr className={styles.divider} />
                
                {/* 7. 場所（Googleマップを開くボタン） */}
                <div className={styles.detailSection}>
                    <h3 className={styles.sectionHeader}>場所</h3>
                    <div className={styles.mapArea}>
                        <p className={styles.locationText}>📍 {record.location}</p>
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className={styles.mapButtonLink}>
                            🗺️ Googleマップを開く
                        </a>
                    </div>
                </div>
            </main>

            {/* 8. フッターボタン（編集・削除） */}
            <footer className={styles.footerButtons}>
                
                {/* 編集ボタン: 食事登録画面 S-02へ遷移 */}
                <Link href={editUrl} className={styles.editButton}>
                    ✏️ 編集
                </Link>
                
                {/* 削除ボタン: Server Actionを実行 */}
                <form action={async () => {
                    'use server';
                    // 【TODO: 削除 Server Action実装】
                    // await deleteRecord(record.id); 
                    // redirect('/home');
                    console.log(`記録ID ${record.id} を削除`);
                    // alert('この記録を削除します。'); // Server Actionではアラートは使えません
                }} className={styles.deleteForm}>
                    <button type="submit" className={styles.deleteButton}>
                        🗑️ 削除
                    </button>
                </form>
            </footer>
        </div>
    );
}
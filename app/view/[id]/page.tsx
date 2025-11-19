// app/view/[id]/page.tsx

import styles from '../../page.module.css'; // 共通のCSSを使用
import Link from 'next/link';
// import { getRecordById, deleteRecord } from '@/app/server-actions'; // データの取得・削除アクション

// StarRatingComponentを再利用（ここではスタティック表示用として簡略化）
const StarRating = ({ rating }: { rating: number }) => (
    <div className={styles.starRating}>
        {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < rating ? 'gold' : 'lightgray', fontSize: '24px' }}>★</span>
        ))}
    </div>
);

// ----------------------------------------------------------------------

// ページのコンポーネント定義
// Next.jsの動的ルーティングでは、paramsオブジェクトを通じてIDを受け取ります。
export default async function ViewRecordPage({ params }: { params: { id: string } }) {
    const recordId = params.id;
    
    // 【重要】ここでSupabaseからIDに基づいてデータを取得するロジックが入ります
    // const record = await getRecordById(recordId); 
    
    // 例としてモックデータを使用
    const mockRecord = {
        id: recordId,
        title: '鰻重',
        restaurant_name: 'うなぎ屋恵比寿',
        visit_date: '2025年11月2日',
        visit_count: 1,
        image_url: '/eel_mock.jpg', // 実際の画像URLに置き換えてください
        tags: ['和食', 'うなぎ'],
        rating: 3,
        memo: 'とても美味しかった\n店は少し汚かった',
        location: '恵比寿駅近く',
    };
    const record = mockRecord; // 実際のデータ取得に置き換える

    if (!record) {
        return <div className={styles.container}>記録が見つかりませんでした。</div>;
    }

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
                {/* 実際は Next/Image コンポーネントを使用し、画像のURLを設定 */}
                {/* <Image src={record.image_url} alt={record.title} width={600} height={400} className={styles.mainImage} /> */}
                <img src={record.image_url} alt={record.title} className={styles.mainImage} /> 
            </div>

            {/* 3. 詳細情報セクション */}
            <main className={styles.detailContent}>
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
                         <button className={styles.mapButton}>
                            🗺️ Googleマップを開く
                        </button>
                    </div>
                </div>
            </main>

            {/* 8. フッターボタン（編集・削除） */}
            <footer className={styles.footerButtons}>
                {/* 編集ボタン: 食事登録画面 S-02へ遷移 */}
                <Link href={`/register?id=${record.id}`} className={styles.editButton}>
                    ✏️ 編集
                </Link>
                
                {/* 削除ボタン: Server Actionを実行し、ホーム S-01へ遷移 */}
                <form action={async () => { 
                    // 実際はここで削除 Server Actionを実行
                    // await deleteRecord(record.id); 
                    // redirect('/home');
                    alert('この記録を削除します。');
                }} className={styles.deleteForm}>
                    <button type="submit" className={styles.deleteButton}>
                        🗑️ 削除
                    </button>
                </form>
            </footer>
        </div>
    );
}
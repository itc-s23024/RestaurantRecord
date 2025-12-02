'use server';

// 本来はデータベースですが、今回はここにデータを定義します
const foodRecordsData = [
  {
    id: 1,
    image: '',
    name: 'スパゲティ',
    tags: ['イタリアン', 'スパゲティ', 'サイゼリヤ'],
    rating: 4,
    comment: 'とても美味しかった',
    date: '2024/01/01',
    count: 3,
  },
  {
    id: 2,
    image: '',
    name: '鰻重',
    tags: ['和食', 'うなぎ'],
    rating: 3,
    comment: 'とても美味しかった\n店が少し汚かった',
    date: '2024/01/05',
    count: 1,
  },
  {
    id: 3,
    image: '',
    name: 'ハンバーガー',
    tags: ['アメリカン', 'ファストフード'],
    rating: 5,
    comment: '肉汁がすごかった',
    date: '2024/01/10',
    count: 5,
  },
  {
    id: 4,
    image: '',
    name: '醤油ラーメン',
    tags: ['ラーメン', '中華'],
    rating: 4,
    comment: 'さっぱりしていて食べやすい',
    date: '2024/01/15',
    count: 10,
  },
];

// 検索を行うサーバーアクション
export async function searchFoods(keyword: string) {
  // サーバー側での処理の遅延をシミュレート（一瞬で終わると実感が湧かないため）
  // await new Promise((resolve) => setTimeout(resolve, 300));

  if (!keyword || keyword.trim() === '') {
    // キーワードがなければ全件返す
    return foodRecordsData;
  }

  // キーワードでフィルタリング（店名やタグに含まれるか）
  const lowerKeyword = keyword.toLowerCase();
  
  const filtered = foodRecordsData.filter((record) => {
    return (
      record.name.toLowerCase().includes(lowerKeyword) ||
      record.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  });

  return filtered;
}
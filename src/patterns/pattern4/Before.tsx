import { useState, useEffect, useRef } from 'react'

interface Post {
  id: number
  title: string
  body: string
}

// APIリクエストをシミュレート（ランダムな遅延）
async function fetchPost(id: number): Promise<Post> {
  const delay = Math.random() * 2000 + 500 // 500-2500ms
  await new Promise(resolve => setTimeout(resolve, delay))
  return {
    id,
    title: `投稿 #${id} のタイトル`,
    body: `これは投稿 #${id} の本文です。取得に ${Math.round(delay)}ms かかりました。`
  }
}

/**
 * アンチパターン: クリーンアップなしのデータフェッチ
 *
 * 問題点:
 * 1. 競合状態（race condition）が発生する
 * 2. 素早くIDを切り替えると、遅いリクエストの結果が後から表示される
 * 3. アンマウント後にsetStateが呼ばれる可能性がある
 */
export default function Before() {
  const [postId, setPostId] = useState(1)
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)
  const renderCount = useRef(0)
  const fetchCount = useRef(0)

  renderCount.current++

  // アンチパターン: クリーンアップなしのフェッチ
  useEffect(() => {
    fetchCount.current++
    const currentFetch = fetchCount.current
    console.log(`[Before] useEffect: フェッチ開始 (ID: ${postId}, フェッチ #${currentFetch})`)

    setLoading(true)

    // クリーンアップがないため、古いリクエストの結果が後から設定される可能性
    fetchPost(postId).then(data => {
      console.log(`[Before] フェッチ完了 (ID: ${data.id}, フェッチ #${currentFetch})`)
      setPost(data)
      setLoading(false)
    })

    // クリーンアップ関数がない！
  }, [postId])

  return (
    <div>
      <div className="render-count">
        レンダリング回数: {renderCount.current}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>投稿ID: </label>
        {[1, 2, 3, 4, 5].map(id => (
          <button
            key={id}
            onClick={() => setPostId(id)}
            style={{
              background: postId === id ? '#339af0' : undefined
            }}
          >
            {id}
          </button>
        ))}
      </div>

      <p style={{ fontSize: '12px', color: '#666' }}>
        素早くボタンをクリックしてみてください。<br />
        レスポンスの順序が入れ替わる可能性があります。
      </p>

      {loading && <div className="loading">読み込み中...</div>}

      {post && (
        <div className="product-card">
          <h4>{post.title}</h4>
          <p>{post.body}</p>
        </div>
      )}

      <div className="log" style={{ marginTop: '15px' }}>
        <div className="log-entry effect">クリーンアップなし</div>
        <div className="log-entry render">競合状態（race condition）が発生する可能性</div>
        <div className="log-entry state">古いデータが表示される可能性</div>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'

interface Post {
  id: number
  title: string
  body: string
}

// APIリクエストをシミュレート（ランダムな遅延、AbortSignal対応）
async function fetchPost(id: number, signal?: AbortSignal): Promise<Post> {
  const delay = Math.random() * 2000 + 500 // 500-2500ms
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, delay)
    signal?.addEventListener('abort', () => {
      clearTimeout(timeout)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
  return {
    id,
    title: `投稿 #${id} のタイトル`,
    body: `これは投稿 #${id} の本文です。取得に ${Math.round(delay)}ms かかりました。`
  }
}

/**
 * 改善版: AbortControllerを使用した適切なクリーンアップ
 *
 * 利点:
 * 1. 競合状態を防止
 * 2. アンマウント時にリクエストをキャンセル
 * 3. 常に最新のデータのみ表示
 */
export default function After() {
  const [postId, setPostId] = useState(1)
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const renderCount = useRef(0)
  const fetchCount = useRef(0)

  renderCount.current++

  // 改善: AbortControllerを使用したクリーンアップ
  useEffect(() => {
    fetchCount.current++
    const currentFetch = fetchCount.current
    const abortController = new AbortController()

    console.log(`[After] useEffect: フェッチ開始 (ID: ${postId}, フェッチ #${currentFetch})`)

    setLoading(true)
    setError(null)

    fetchPost(postId, abortController.signal)
      .then(data => {
        console.log(`[After] フェッチ完了 (ID: ${data.id}, フェッチ #${currentFetch})`)
        setPost(data)
        setLoading(false)
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log(`[After] フェッチキャンセル (ID: ${postId}, フェッチ #${currentFetch})`)
          return // キャンセルされた場合は何もしない
        }
        setError(err.message)
        setLoading(false)
      })

    // クリーンアップ: 新しいリクエストが始まる前に古いリクエストをキャンセル
    return () => {
      console.log(`[After] クリーンアップ: リクエストをキャンセル (ID: ${postId})`)
      abortController.abort()
    }
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
        常に最新の選択に対応したデータのみ表示されます。
      </p>

      {loading && <div className="loading">読み込み中...</div>}
      {error && <div className="error">{error}</div>}

      {post && !loading && (
        <div className="product-card">
          <h4>{post.title}</h4>
          <p>{post.body}</p>
        </div>
      )}

      <div className="log" style={{ marginTop: '15px' }}>
        <div className="log-entry state">AbortControllerでキャンセル可能</div>
        <div className="log-entry render">競合状態を防止</div>
        <div className="log-entry effect">常に最新データのみ表示</div>
      </div>
    </div>
  )
}

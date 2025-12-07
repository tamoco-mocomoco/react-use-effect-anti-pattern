import { Routes, Route, NavLink } from 'react-router-dom'
import Before from './Before'
import After from './After'
import CodeBlock from '../../components/CodeBlock'

const beforeCode = `// アンチパターン: クリーンアップなしのデータフェッチ
const [postId, setPostId] = useState(1)
const [post, setPost] = useState(null)

useEffect(() => {
  setLoading(true)

  // 問題: クリーンアップがない
  // 素早くIDを切り替えると、遅いリクエストの結果が
  // 後から表示される可能性がある（race condition）
  fetchPost(postId).then(data => {
    setPost(data)
    setLoading(false)
  })

  // クリーンアップ関数がない！
}, [postId])`

const afterCode = `// 改善: AbortControllerでリクエストをキャンセル
const [postId, setPostId] = useState(1)
const [post, setPost] = useState(null)

useEffect(() => {
  const abortController = new AbortController()

  setLoading(true)

  fetchPost(postId, abortController.signal)
    .then(data => {
      setPost(data)
      setLoading(false)
    })
    .catch(err => {
      if (err.name === 'AbortError') return // キャンセルは無視
      setError(err.message)
    })

  // クリーンアップ: 古いリクエストをキャンセル
  return () => abortController.abort()
}, [postId])`

export default function Pattern4() {
  return (
    <div>
      <h2>パターン4: データフェッチ</h2>

      <div className="explanation">
        <h4>問題</h4>
        <p>
          useEffectでデータをフェッチする際に、クリーンアップを行わないと
          競合状態（race condition）が発生し、古いデータが表示される可能性があります。
        </p>
        <h4>解決策</h4>
        <p>
          AbortControllerを使用してリクエストをキャンセルするか、
          フラグを使用して古いレスポンスを無視します。
          実際のプロジェクトではReact Query / SWR等のライブラリ使用を推奨します。
        </p>
      </div>

      <div className="code-comparison">
        <div className="code-panel">
          <CodeBlock code={beforeCode} title="Before (悪い例)" />
        </div>
        <div className="code-panel">
          <CodeBlock code={afterCode} title="After (良い例)" />
        </div>
      </div>

      <nav style={{ marginBottom: '20px', marginTop: '20px' }}>
        <NavLink to="before"><button>Before を試す</button></NavLink>
        <NavLink to="after"><button>After を試す</button></NavLink>
      </nav>

      <div className="pattern-container">
        <Routes>
          <Route path="before" element={<Before />} />
          <Route path="after" element={<After />} />
          <Route path="*" element={
            <>
              <div className="panel before">
                <h3>Before <span className="badge bad">悪い例</span></h3>
                <Before />
              </div>
              <div className="panel after">
                <h3>After <span className="badge good">良い例</span></h3>
                <After />
              </div>
            </>
          } />
        </Routes>
      </div>
    </div>
  )
}

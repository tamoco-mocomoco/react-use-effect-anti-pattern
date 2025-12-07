import Before from './Before'
import After from './After'
import CodeBlock from '../../components/CodeBlock'

const beforeCode = `// アンチパターン: フラグ + useEffectでイベント処理
const [shouldSubmit, setShouldSubmit] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)

// 問題: フラグを監視して処理を実行
useEffect(() => {
  if (!shouldSubmit) return

  const submitOrder = async () => {
    setIsSubmitting(true)
    await submitToServer()
    setIsSubmitting(false)
    setShouldSubmit(false) // フラグをリセット（忘れがち！）
  }

  submitOrder()
}, [shouldSubmit])

const handleSubmit = () => {
  // 直接処理せず、フラグを立てるだけ
  setShouldSubmit(true)
}`

const afterCode = `// 改善: イベントハンドラで直接処理を実行
const [isSubmitting, setIsSubmitting] = useState(false)

// shouldSubmitフラグは不要！

const handleSubmit = async () => {
  // イベントハンドラで直接処理
  setIsSubmitting(true)
  await submitToServer()
  setIsSubmitting(false)
}

// useEffectなし！フラグ管理なし！
// 処理の流れが明確でシンプル`

export default function Pattern3() {
  return (
    <div>
      <h2>パターン3: イベントハンドラで行うべき処理</h2>

      <div className="explanation">
        <h4>問題</h4>
        <p>
          ユーザーのアクション（ボタンクリック等）に応じた処理をuseEffectで行っています。
          フラグをstateで管理して、useEffectでそのフラグを監視するパターンです。
        </p>
        <h4>解決策</h4>
        <p>
          イベントハンドラで直接処理を実行します。
          「何かが起きたとき」に実行すべき処理は、イベントハンドラに書くべきです。
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

      <div className="pattern-container">
        <div className="panel before">
          <h3>Before <span className="badge bad">悪い例</span></h3>
          <Before />
        </div>
        <div className="panel after">
          <h3>After <span className="badge good">良い例</span></h3>
          <After />
        </div>
      </div>
    </div>
  )
}

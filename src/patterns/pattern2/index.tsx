import { Routes, Route, NavLink } from 'react-router-dom'
import Before from './Before'
import After from './After'
import CodeBlock from '../../components/CodeBlock'

const beforeCode = `// アンチパターン: useEffectでprops変更時にstateをリセット
function ProfileForm({ user }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  // 問題: propsが変わったらuseEffectでstateをリセット
  useEffect(() => {
    setName(user.name)   // state更新 → 再レンダリング
    setEmail(user.email) // また再レンダリング
  }, [user])

  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
    </form>
  )
}

// 親コンポーネント
<ProfileForm user={selectedUser} />`

const afterCode = `// 改善: key属性でコンポーネントを再作成
function ProfileForm({ user }) {
  // useEffectは不要！
  // keyが変わるとReactがコンポーネントを破棄→再作成
  // stateは自動的に初期値にリセットされる
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
    </form>
  )
}

// 親コンポーネント: key属性を追加
<ProfileForm key={selectedUser.id} user={selectedUser} />`

export default function Pattern2() {
  return (
    <div>
      <h2>パターン2: propsでstateリセット</h2>

      <div className="explanation">
        <h4>問題</h4>
        <p>
          親からのpropsが変わったときに、useEffectでstateをリセットしています。
          これは余分なレンダリングを引き起こし、一瞬古いデータが表示されます。
        </p>
        <h4>解決策</h4>
        <p>
          コンポーネントにkey属性を設定して、propsが変わったらコンポーネント自体を再作成させます。
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

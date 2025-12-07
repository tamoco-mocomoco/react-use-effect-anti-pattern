import { useState, useRef } from 'react'

interface User {
  id: number
  name: string
  email: string
}

const users: User[] = [
  { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
  { id: 2, name: '山田花子', email: 'yamada@example.com' },
  { id: 3, name: '佐藤次郎', email: 'sato@example.com' },
]

/**
 * 改善版: key属性でコンポーネントを再作成させる
 *
 * keyが変わるとReactはコンポーネントを破棄して新しく作成する
 * これにより、stateは自然に初期値にリセットされる
 */
function ProfileFormGood({ user }: { user: User }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const renderCount = useRef(0)

  renderCount.current++

  // useEffectは不要！
  // keyが変わるとコンポーネントが再作成され、stateは自動的に初期化される

  return (
    <div>
      <div className="render-count">
        ProfileForm レンダリング回数: {renderCount.current}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>名前: </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>メール: </label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="log">
        <div className="log-entry state">key変更でコンポーネントが再作成される</div>
        <div className="log-entry render">余分なレンダリングなし</div>
      </div>
    </div>
  )
}

export default function After() {
  const [selectedUserId, setSelectedUserId] = useState(1)
  const selectedUser = users.find(u => u.id === selectedUserId)!

  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        <label>ユーザー選択: </label>
        <select
          value={selectedUserId}
          onChange={e => setSelectedUserId(Number(e.target.value))}
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      {/* 改善: key属性を使用してユーザー変更時にコンポーネントを再作成 */}
      <ProfileFormGood key={selectedUserId} user={selectedUser} />
    </div>
  )
}

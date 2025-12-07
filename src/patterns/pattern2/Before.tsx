import { useState, useEffect, useRef } from 'react'

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
 * アンチパターン: useEffectでprops変更時にstateをリセット
 */
function ProfileFormBad({ user }: { user: User }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const renderCount = useRef(0)

  renderCount.current++

  // アンチパターン: propsが変わったらuseEffectでstateをリセット
  useEffect(() => {
    console.log('[Before] useEffect: ユーザー変更を検知、stateをリセット')
    setName(user.name)
    setEmail(user.email)
  }, [user])

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
        <div className="log-entry effect">ユーザー切替時、一瞬古いデータが表示される</div>
        <div className="log-entry render">余分なレンダリングが発生</div>
      </div>
    </div>
  )
}

export default function Before() {
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

      <ProfileFormBad user={selectedUser} />
    </div>
  )
}

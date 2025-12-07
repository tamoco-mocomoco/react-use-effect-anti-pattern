import { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

/**
 * アンチパターン: イベント処理をuseEffectで行う
 *
 * 問題点:
 * 1. フラグ管理が複雑になる
 * 2. 処理の流れが追いにくい
 * 3. フラグのリセット忘れでバグが発生しやすい
 */
export default function Before() {
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, name: '商品A', price: 1000, quantity: 2 },
    { id: 2, name: '商品B', price: 500, quantity: 1 },
  ])
  const [shouldSubmit, setShouldSubmit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const renderCount = useRef(0)

  renderCount.current++

  // アンチパターン: フラグを監視して処理を実行
  useEffect(() => {
    if (!shouldSubmit) return

    console.log('[Before] useEffect: 注文処理を開始')

    const submitOrder = async () => {
      flushSync(() => {
        setIsSubmitting(true)
      })
      // 注文処理をシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000))
      flushSync(() => {
        setMessage('注文が完了しました！')
      })
      flushSync(() => {
        setCart([])
      })
      flushSync(() => {
        setIsSubmitting(false)
      })
      flushSync(() => {
        setShouldSubmit(false) // フラグをリセット（忘れがち！）
      })
    }

    submitOrder()
  }, [shouldSubmit])

  const handleSubmit = () => {
    // 直接処理せず、フラグを立てるだけ
    setShouldSubmit(true)
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div>
      <div className="render-count">
        レンダリング回数: {renderCount.current}
      </div>

      <h4>カート</h4>
      {cart.length === 0 ? (
        <p>カートは空です</p>
      ) : (
        cart.map(item => (
          <div key={item.id} className="product-card">
            <strong>{item.name}</strong>
            <div>¥{item.price.toLocaleString()} × {item.quantity}</div>
          </div>
        ))
      )}

      {cart.length > 0 && (
        <>
          <div className="price">合計: ¥{total.toLocaleString()}</div>
          <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '処理中...' : '注文する'}
          </button>
        </>
      )}

      {message && <div style={{ color: 'green', marginTop: '10px' }}>{message}</div>}

      <div className="log" style={{ marginTop: '15px' }}>
        <div className="log-entry effect">useEffectでフラグを監視</div>
        <div className="log-entry state">shouldSubmit, isSubmitting など状態が複雑</div>
        <div className="log-entry render">フラグのセット/リセットで余分なレンダリング</div>
      </div>
    </div>
  )
}

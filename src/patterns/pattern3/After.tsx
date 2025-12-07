import { useState, useRef } from 'react'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

/**
 * 改善版: イベントハンドラで直接処理を実行
 *
 * 利点:
 * 1. 処理の流れが明確
 * 2. 不要なstate（フラグ）が減る
 * 3. コードがシンプル
 */
export default function After() {
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, name: '商品A', price: 1000, quantity: 2 },
    { id: 2, name: '商品B', price: 500, quantity: 1 },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const renderCount = useRef(0)

  renderCount.current++

  // 改善: イベントハンドラで直接処理を実行
  const handleSubmit = async () => {
    console.log('[After] handleSubmit: 注文処理を開始')

    setIsSubmitting(true)
    // 注文処理をシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000))
    setMessage('注文が完了しました！')
    setCart([])
    setIsSubmitting(false)
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
        <div className="log-entry state">shouldSubmitフラグ不要</div>
        <div className="log-entry render">処理の流れが明確</div>
        <div className="log-entry render">余分なレンダリングなし</div>
      </div>
    </div>
  )
}

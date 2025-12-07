import { useState, useEffect, useRef } from 'react'

interface Product {
  id: number
  name: string
  category: string
  price: number
}

const products: Product[] = [
  { id: 1, name: 'ノートPC', category: 'electronics', price: 120000 },
  { id: 2, name: 'マウス', category: 'electronics', price: 3000 },
  { id: 3, name: 'デスク', category: 'furniture', price: 25000 },
  { id: 4, name: '椅子', category: 'furniture', price: 15000 },
  { id: 5, name: 'モニター', category: 'electronics', price: 45000 },
]

/**
 * アンチパターン: 派生状態をuseEffectで計算してstateに保存
 *
 * 問題点:
 * 1. 不要な再レンダリングが発生する（state変更 → render → effect → state変更 → render）
 * 2. 一瞬古いデータが表示される可能性がある
 * 3. コードが複雑になる
 */
export default function Before() {
  const [category, setCategory] = useState<string>('all')
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const renderCount = useRef(0)

  renderCount.current++

  // アンチパターン: useEffectで派生状態を計算
  useEffect(() => {
    console.log('[Before] useEffect: フィルタリング実行')
    const filtered = category === 'all'
      ? products
      : products.filter(p => p.category === category)
    setFilteredProducts(filtered)
  }, [category])

  // アンチパターン: さらに別のuseEffectで合計を計算
  useEffect(() => {
    console.log('[Before] useEffect: 合計計算実行')
    const total = filteredProducts.reduce((sum, p) => sum + p.price, 0)
    setTotalPrice(total)
  }, [filteredProducts])

  return (
    <div>
      <div className="render-count">
        レンダリング回数: {renderCount.current}
      </div>

      <div>
        <label>カテゴリ: </label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">すべて</option>
          <option value="electronics">電子機器</option>
          <option value="furniture">家具</option>
        </select>
      </div>

      <div style={{ marginTop: '15px' }}>
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <strong>{product.name}</strong>
            <div>¥{product.price.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="price">
        合計: ¥{totalPrice.toLocaleString()}
      </div>

      <div className="log" style={{ marginTop: '15px' }}>
        <div>コンソールを確認してください</div>
        <div className="log-entry effect">useEffect が2回実行されます</div>
        <div className="log-entry render">カテゴリ変更で3回レンダリングされます</div>
      </div>
    </div>
  )
}

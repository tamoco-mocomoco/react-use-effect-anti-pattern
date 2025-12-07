import { useState, useMemo, useRef } from 'react'

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
 * 改善版: レンダリング中に直接計算、または useMemo を使用
 *
 * 利点:
 * 1. 余分な再レンダリングがない
 * 2. 常に最新の計算結果が表示される
 * 3. コードがシンプル
 */
export default function After() {
  const [category, setCategory] = useState<string>('all')
  const renderCount = useRef(0)

  renderCount.current++

  // 改善: レンダリング中に直接計算（シンプルな計算の場合）
  // または useMemo を使用（重い計算の場合）
  const filteredProducts = useMemo(() => {
    console.log('[After] useMemo: フィルタリング実行')
    return category === 'all'
      ? products
      : products.filter(p => p.category === category)
  }, [category])

  // 改善: 派生値も同様にレンダリング中に計算
  const totalPrice = useMemo(() => {
    console.log('[After] useMemo: 合計計算実行')
    return filteredProducts.reduce((sum, p) => sum + p.price, 0)
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
        <div className="log-entry render">カテゴリ変更で1回だけレンダリング</div>
        <div className="log-entry state">useMemoで効率的に計算</div>
      </div>
    </div>
  )
}

import Before from './Before'
import After from './After'
import CodeBlock from '../../components/CodeBlock'

const beforeCode = `// アンチパターン: useEffectで派生状態を計算
const [category, setCategory] = useState('all')
const [filteredProducts, setFilteredProducts] = useState(products)
const [totalPrice, setTotalPrice] = useState(0)

// 問題: カテゴリが変わるたびにuseEffectでstateを更新
useEffect(() => {
  const filtered = category === 'all'
    ? products
    : products.filter(p => p.category === category)
  setFilteredProducts(filtered)  // state更新 → 再レンダリング
}, [category])

// 問題: さらに別のuseEffectで合計を計算
useEffect(() => {
  const total = filteredProducts.reduce((sum, p) => sum + p.price, 0)
  setTotalPrice(total)  // また再レンダリング
}, [filteredProducts])`

const afterCode = `// 改善: useMemoでレンダリング中に計算
const [category, setCategory] = useState('all')

// stateではなく、useMemoで派生値を計算
const filteredProducts = useMemo(() => {
  return category === 'all'
    ? products
    : products.filter(p => p.category === category)
}, [category])

// 合計も同様にuseMemoで計算
const totalPrice = useMemo(() => {
  return filteredProducts.reduce((sum, p) => sum + p.price, 0)
}, [filteredProducts])

// useEffectなし！余分な再レンダリングなし！`

export default function Pattern1() {
  return (
    <div>
      <h2>パターン1: 派生状態の計算</h2>

      <div className="explanation">
        <h4>問題</h4>
        <p>
          stateから計算できる値を、useEffectで別のstateに保存しています。
          これは不要なstate更新と再レンダリングを引き起こします。
        </p>
        <h4>解決策</h4>
        <p>
          レンダリング中に直接計算するか、パフォーマンスが問題になる場合はuseMemoを使用します。
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

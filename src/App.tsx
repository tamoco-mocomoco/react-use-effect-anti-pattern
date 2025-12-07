import { Routes, Route, NavLink } from 'react-router-dom'
import Pattern1 from './patterns/pattern1'
import Pattern2 from './patterns/pattern2'
import Pattern3 from './patterns/pattern3'
import Pattern4 from './patterns/pattern4'
import Pattern5 from './patterns/pattern5'

function Home() {
  return (
    <div>
      <h2>useEffect アンチパターン集</h2>
      <p>React の useEffect を誤って使用するケースと、その改善方法を学ぶためのサンプル集です。</p>

      <div className="explanation">
        <h4>各パターンの説明</h4>
        <ul>
          <li><strong>パターン1:</strong> 派生状態の計算 - stateから計算できる値をuseEffectで別のstateに保存</li>
          <li><strong>パターン2:</strong> propsでstateリセット - propsが変わったときにuseEffectでstateをリセット</li>
          <li><strong>パターン3:</strong> イベントハンドラで行うべき処理 - ボタンクリック等で行うべき処理をuseEffectで実行</li>
          <li><strong>パターン4:</strong> データフェッチ - 適切なクリーンアップなしのデータ取得</li>
          <li><strong>パターン5:</strong> チェーンされたuseEffect - 複数のuseEffectが連鎖的に実行される</li>
        </ul>
      </div>

      <p>左上のナビゲーションから各パターンを選択してください。</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="app">
      <h1>useEffect アンチパターン集</h1>

      <nav className="nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/pattern1">1. 派生状態</NavLink>
        <NavLink to="/pattern2">2. propsリセット</NavLink>
        <NavLink to="/pattern3">3. イベント処理</NavLink>
        <NavLink to="/pattern4">4. データフェッチ</NavLink>
        <NavLink to="/pattern5">5. チェーン</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pattern1/*" element={<Pattern1 />} />
        <Route path="/pattern2/*" element={<Pattern2 />} />
        <Route path="/pattern3/*" element={<Pattern3 />} />
        <Route path="/pattern4/*" element={<Pattern4 />} />
        <Route path="/pattern5/*" element={<Pattern5 />} />
      </Routes>
    </div>
  )
}

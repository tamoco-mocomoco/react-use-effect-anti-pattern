import Before from './Before'
import After from './After'
import CodeBlock from '../../components/CodeBlock'

const beforeCode = `// アンチパターン: チェーンされたuseEffect
const [country, setCountry] = useState('')
const [cities, setCities] = useState([])
const [selectedCity, setSelectedCity] = useState(null)
const [weather, setWeather] = useState(null)

// useEffect #1: 国が変わったら都市を取得
useEffect(() => {
  fetchCities(country).then(data => {
    setCities(data)
    setSelectedCity(data[0]?.id) // これがuseEffect #2をトリガー
  })
}, [country])

// useEffect #2: 都市が選択されたら天気を取得
useEffect(() => {
  if (!selectedCity) return
  fetchWeather(selectedCity).then(setWeather)
}, [selectedCity])

// 問題: country変更 → render → effect#1 → state更新
//       → render → effect#2 → state更新 → render`

const afterCode = `// 改善: 一つのuseEffectでまとめて処理
const [country, setCountry] = useState('')
const [data, setData] = useState({
  cities: [], selectedCity: null, weather: null
})

useEffect(() => {
  if (!country) return
  let cancelled = false

  const fetchData = async () => {
    // 都市を取得
    const cities = await fetchCities(country)
    if (cancelled) return

    // 天気も続けて取得
    const weather = await fetchWeather(cities[0]?.id)
    if (cancelled) return

    // 一度にすべて更新
    setData({ cities, selectedCity: cities[0]?.id, weather })
  }

  fetchData()
  return () => { cancelled = true }
}, [country])`

export default function Pattern5() {
  return (
    <div>
      <h2>パターン5: チェーンされたuseEffect</h2>

      <div className="explanation">
        <h4>問題</h4>
        <p>
          複数のuseEffectが連鎖的に実行され、state → useEffect → state → useEffect...
          というパターンになっています。これは余分なレンダリングと複雑なデータフローを引き起こします。
        </p>
        <h4>解決策</h4>
        <p>
          一つのuseEffect（またはイベントハンドラ）で必要な処理をまとめて行います。
          データの依存関係がある場合は、async/awaitで順次処理します。
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

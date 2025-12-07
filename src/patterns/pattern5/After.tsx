import { useState, useEffect, useRef } from 'react'

interface Country {
  code: string
  name: string
}

interface City {
  id: number
  name: string
  population: number
}

interface Weather {
  temp: number
  condition: string
}

// モックデータ
const countries: Country[] = [
  { code: 'JP', name: '日本' },
  { code: 'US', name: 'アメリカ' },
  { code: 'UK', name: 'イギリス' },
]

const citiesByCountry: Record<string, City[]> = {
  JP: [
    { id: 1, name: '東京', population: 14000000 },
    { id: 2, name: '大阪', population: 2700000 },
  ],
  US: [
    { id: 3, name: 'ニューヨーク', population: 8300000 },
    { id: 4, name: 'ロサンゼルス', population: 4000000 },
  ],
  UK: [
    { id: 5, name: 'ロンドン', population: 9000000 },
    { id: 6, name: 'マンチェスター', population: 550000 },
  ],
}

const weatherByCity: Record<number, Weather> = {
  1: { temp: 22, condition: '晴れ' },
  2: { temp: 24, condition: '曇り' },
  3: { temp: 18, condition: '雨' },
  4: { temp: 28, condition: '晴れ' },
  5: { temp: 15, condition: '曇り' },
  6: { temp: 12, condition: '雨' },
}

interface CityData {
  cities: City[]
  selectedCity: number | null
  weather: Weather | null
}

/**
 * 改善版: 一つのuseEffectでまとめて処理
 *
 * 利点:
 * 1. データ取得を一箇所で管理
 * 2. 中間状態の更新による余分なレンダリングを削減
 * 3. データフローが明確
 */
export default function After() {
  const [country, setCountry] = useState<string>('')
  const [cityData, setCityData] = useState<CityData>({
    cities: [],
    selectedCity: null,
    weather: null
  })
  const [loading, setLoading] = useState(false)
  const renderCount = useRef(0)

  renderCount.current++

  // 改善: 一つのuseEffectで必要なデータをまとめて取得
  useEffect(() => {
    if (!country) {
      setCityData({ cities: [], selectedCity: null, weather: null })
      return
    }

    let cancelled = false
    console.log('[After] useEffect: 都市と天気をまとめて取得')

    const fetchData = async () => {
      setLoading(true)

      // 都市リスト取得をシミュレート
      await new Promise(resolve => setTimeout(resolve, 300))
      if (cancelled) return

      const fetchedCities = citiesByCountry[country] || []
      const firstCityId = fetchedCities[0]?.id || null

      // 天気取得をシミュレート（最初の都市の天気）
      await new Promise(resolve => setTimeout(resolve, 300))
      if (cancelled) return

      const weather = firstCityId ? weatherByCity[firstCityId] || null : null

      // 一度にすべてのデータを更新
      setCityData({
        cities: fetchedCities,
        selectedCity: firstCityId,
        weather
      })
      setLoading(false)
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [country])

  // 都市変更時の天気更新（これはイベントハンドラで行う方が良い場合も）
  const handleCityChange = async (cityId: number) => {
    console.log('[After] handleCityChange: 天気を取得')
    setCityData(prev => ({ ...prev, selectedCity: cityId, weather: null }))

    // 天気取得をシミュレート
    await new Promise(resolve => setTimeout(resolve, 300))

    setCityData(prev => ({
      ...prev,
      weather: weatherByCity[cityId] || null
    }))
  }

  const { cities, selectedCity, weather } = cityData

  return (
    <div>
      <div className="render-count">
        レンダリング回数: {renderCount.current}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>国: </label>
        <select value={country} onChange={e => setCountry(e.target.value)}>
          <option value="">選択してください</option>
          {countries.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">データを読み込み中...</div>}

      {!loading && cities.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <label>都市: </label>
          <select
            value={selectedCity || ''}
            onChange={e => handleCityChange(Number(e.target.value))}
          >
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name} (人口: {city.population.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      )}

      {weather && (
        <div className="product-card">
          <h4>天気情報</h4>
          <p>気温: {weather.temp}°C</p>
          <p>状態: {weather.condition}</p>
        </div>
      )}

      <div className="log" style={{ marginTop: '15px' }}>
        <div className="log-entry effect">一つのuseEffectでまとめて処理</div>
        <div className="log-entry render">余分なレンダリングを削減</div>
        <div className="log-entry state">データフローが明確</div>
      </div>
    </div>
  )
}

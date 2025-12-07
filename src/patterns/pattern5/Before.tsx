import { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'

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

/**
 * アンチパターン: チェーンされたuseEffect
 *
 * 問題点:
 * 1. 国選択 → 都市リスト取得のuseEffect → 都市選択のstate変更 → 天気取得のuseEffect
 * 2. 各useEffectで再レンダリングが発生
 * 3. データフローが追いにくい
 */
export default function Before() {
  const [country, setCountry] = useState<string>('')
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<number | null>(null)
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const renderCount = useRef(0)

  renderCount.current++

  // useEffect #1: 国が変わったら都市リストを取得
  useEffect(() => {
    if (!country) {
      setCities([])
      setSelectedCity(null)
      return
    }

    console.log('[Before] useEffect #1: 都市リスト取得開始')
    setLoadingCities(true)

    // シミュレートされた遅延
    setTimeout(() => {
      const fetchedCities = citiesByCountry[country] || []

      // flushSyncでバッチングを無効化し、各setState後に即座にレンダリング
      flushSync(() => {
        setCities(fetchedCities)
      })
      flushSync(() => {
        setLoadingCities(false)
      })
      // 最初の都市を自動選択（これがuseEffect #2をトリガー）
      if (fetchedCities.length > 0) {
        flushSync(() => {
          setSelectedCity(fetchedCities[0].id)
        })
      }
      console.log('[Before] useEffect #1: 都市リスト取得完了 → selectedCity更新')
    }, 300)
  }, [country])

  // useEffect #2: 都市が選択されたら天気を取得
  useEffect(() => {
    if (!selectedCity) {
      setWeather(null)
      return
    }

    console.log('[Before] useEffect #2: 天気取得開始')
    setLoadingWeather(true)

    // シミュレートされた遅延
    setTimeout(() => {
      flushSync(() => {
        setWeather(weatherByCity[selectedCity] || null)
      })
      flushSync(() => {
        setLoadingWeather(false)
      })
      console.log('[Before] useEffect #2: 天気取得完了')
    }, 300)
  }, [selectedCity])

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

      {loadingCities && <div className="loading">都市を読み込み中...</div>}

      {cities.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <label>都市: </label>
          <select
            value={selectedCity || ''}
            onChange={e => setSelectedCity(Number(e.target.value))}
          >
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name} (人口: {city.population.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      )}

      {loadingWeather && <div className="loading">天気を読み込み中...</div>}

      {weather && !loadingWeather && (
        <div className="product-card">
          <h4>天気情報</h4>
          <p>気温: {weather.temp}°C</p>
          <p>状態: {weather.condition}</p>
        </div>
      )}

      <div className="log" style={{ marginTop: '15px' }}>
        <div className="log-entry effect">useEffect #1 → state更新 → useEffect #2</div>
        <div className="log-entry render">連鎖的なレンダリング発生</div>
        <div className="log-entry state">flushSyncで各state更新ごとに再レンダリング</div>
      </div>
    </div>
  )
}

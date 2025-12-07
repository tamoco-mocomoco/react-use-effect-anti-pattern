# React useEffect アンチパターン集

React の `useEffect` を誤って使用するケースと、その改善方法を学ぶためのサンプル集です。

## 5つのアンチパターン

| パターン | 問題 | 解決策 |
|---------|------|--------|
| 1. 派生状態の計算 | stateから計算できる値をuseEffectで別stateに保存 | `useMemo` または直接計算 |
| 2. propsでstateリセット | props変更時にuseEffectでstateをリセット | `key` 属性でコンポーネント再作成 |
| 3. イベントハンドラで行うべき処理 | フラグ + useEffectでイベント処理 | イベントハンドラで直接実行 |
| 4. データフェッチ | クリーンアップなしでフェッチ | `AbortController` でキャンセル |
| 5. チェーンされたuseEffect | 複数useEffectが連鎖実行 | 一つのuseEffectでまとめて処理 |

## 起動方法

### Docker Compose を使用する場合

```bash
docker compose up --build
```

http://localhost:7777 でアクセスできます。

### ローカルで直接実行する場合

```bash
npm install
npm run dev
```

http://localhost:5173 でアクセスできます。

## 使い方

1. ナビゲーションから各パターンを選択
2. Before（悪い例）と After（良い例）のコードを比較
3. 実際に操作してレンダリング回数の違いを確認
4. ブラウザのコンソールでログを確認

## 技術スタック

- React 19
- TypeScript
- Vite
- React Router

## 参考資料

- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) - React公式ドキュメント

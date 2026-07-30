# CDC Precautions — Appendix A Viewer

現場で **3秒で引ける**、CDC「Isolation Precautions Guideline (2007) **Appendix A**」の検索ファースト・ビューア（非公式）。

> ⚠️ **免責 / Disclaimer** — 本アプリは CDC 2007 Isolation Precautions **Appendix A** の *非公式* ビューアです。臨床判断は必ず各施設の感染対策マニュアルと[原典](https://www.cdc.gov/infection-control/hcp/isolation-precautions/appendix-a-type-duration.html)に従ってください。詳細は [`docs/DISCLAIMER.md`](docs/DISCLAIMER.md)。

## 特徴

- 🔍 **あいまい検索**（[Fuse.js](https://fusejs.io/)）— 日本語・英語・略語・かなでヒット（例: `MRSA` / `ノロ` / `measles` / `けっかく`）
- 🎨 **予防策の色分けバッジ** — Standard(グレー) / Contact(緑) / Droplet(青) / Airborne(赤)
- 🏷 **フィルタチップ** — 「空気」「飛沫」「接触」「標準のみ」「更新あり」「ヒト-ヒト感染なし」
- 📴 **PWA オフライン対応** — 電波の弱い病棟でもインストールして利用可
- 🌙 **ダークモード**（システム設定に追従、手動トグルも可）
- 🌐 **日英併記トグル** — 疾患名・期間・コメントを日本語 / 英語で切替
- 🔗 **ディープリンク** — `#<record-id>` で特定項目に直リンク（院内マニュアルや Slack から）
- ⌨️ `/` で検索フォーカス、`Esc` でクリア

## データについて

- 全 **255 レコード**（A〜Z の疾患・状態）。出典: CDC Appendix A **Web版 2025-02-02**。
- データは **UI から分離** して [`data/appendix-a.json`](data/appendix-a.json) に格納。生成元は [`scripts/build-data.mjs`](scripts/build-data.mjs)（元PDFを忠実に転記した構造化ソース）。CDC が更新した際は差分を追える。
- 直近の CDC 改訂は各カードに `⟳ 年月` バッジで表示（例: ノロ 2019-04 / ムンプス 2017-10 / VHF・Nipah・Andes 2024-09）。
- CDC 文書は米国政府著作物で **パブリックドメイン**。コードは **MIT**。

## 開発

```bash
npm install
npm run dev        # build:data → vite dev server
npm run build      # データ検証込みで本番ビルド → dist/
npm run preview
```

- `npm run build:data` — 構造化ソースから `data/appendix-a.json` を再生成
- `node scripts/validate-data.mjs` — id 重複・不正な予防策タイプなどを CI で検証

## デプロイ（GitHub Pages）

1. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定。
2. `main` に push すると [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) が `dist/` を Pages に公開。
3. 公開 URL は `https://<user>.github.io/cdc-precautions-viewer/`。
   - `vite.config.ts` の `base` はリポジトリ名 `/cdc-precautions-viewer/` 前提。カスタムドメイン等では `BASE_PATH=/ npm run build`。

## 技術構成

Vue 3 + Vite 5 + TypeScript + Tailwind CSS 3 + Fuse.js + vite-plugin-pwa。

## ライセンス

- コード: [MIT](LICENSE)
- データ: CDC 由来（U.S. Government work / public domain）。`N95®` は HHS の認証マーク。

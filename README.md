# LocateSMS

這是一個「靜態網頁 + 私人後台 API」的手機定位分享頁面。前端使用瀏覽器原生 `navigator.geolocation`，在 Chrome/Android 顯示定位權限詢問；現代格式的 Netlify Function 會使用 Netlify Blobs 暫存最新位置 24 小時。

## 使用方式

1. 將整個資料夾透過 Git 部署到 Netlify，不要只上傳 `index.html`。Netlify 會自動安裝 `package.json` 中的 Functions 依賴並提供 Blobs 的執行環境。
2. 開啟部署後的首頁，例如 `https://你的網站.netlify.app/`，按「建立定位連結」。
3. 將畫面中的「傳給另一支手機」網址放入簡訊。
4. 保留「你的私人後台查看頁」網址；對方同意並回傳後，開啟它即可看到位置。

## 部署選項

本版本需要 Netlify Functions 與 Netlify Blobs，因此請使用 Netlify 部署。只部署到 GitHub Pages 等純靜態服務時，`/api/location` 不會運作。Function 使用現代 `Request`/`Response` 格式；本機請用 `netlify dev --port 8889`，不要只啟動靜態伺服器。

## 限制與隱私

- 無法在收件人不知情或未授權時取得定位。
- 必須使用 HTTPS；直接以 `file://` 開啟通常無法使用定位權限。
- 座標只會在對方按鈕同意並取得瀏覽器權限後傳送。
- 不需要 Google Maps API 金鑰；定位使用 Chrome/Android 的瀏覽器原生權限詢問，查看座標時才開啟 Google Maps。
- 位置資料會存放在 Netlify Blobs，查看連結的持有者可以讀取；請不要把查看連結公開。不需要在程式碼或前端放入個人存取 Token。
- Function 會在資料讀取時清除超過 24 小時的定位資料。

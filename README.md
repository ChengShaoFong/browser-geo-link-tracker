# LocateSMS

這是一個需要使用者主動同意的手機定位分享頁面。Netlify Functions 會在對方同意並回傳後，暫存最新位置 24 小時。

## 使用方式

1. 將整個資料夾部署到 Netlify，不要只上傳 `index.html`。Netlify 會自動安裝 `package.json` 中的 Functions 依賴。
2. 開啟部署後的首頁，例如 `https://你的網站.netlify.app/`，按「建立定位連結」。
3. 將畫面中的「傳給另一支手機」網址放入簡訊。
4. 保留「你自己的查看頁」網址；對方同意並回傳後，開啟它即可看到位置。

## 部署選項

本版本需要 Netlify Functions 與 Netlify Blobs，因此請使用 Netlify 部署。只部署到 GitHub Pages 等純靜態服務時，`/api/location` 不會運作。

## 限制與隱私

- 無法在收件人不知情或未授權時取得定位。
- 必須使用 HTTPS；直接以 `file://` 開啟通常無法使用定位權限。
- 座標只會在對方按鈕同意並取得瀏覽器權限後傳送。
- 位置資料會存放在 Netlify Blobs，查看連結的持有者可以讀取；請不要把查看連結公開。
- Function 會在資料讀取時清除超過 24 小時的定位資料。

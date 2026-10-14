# browser-geo-link-tracker

這是一個「靜態網頁 + 私人後台 API」的手機定位分享頁面。前端使用瀏覽器原生 `navigator.geolocation`，在 Chrome/Android 顯示定位權限詢問；暫存最新位置 24 小時。

## 使用方式

https://chengshaofong.github.io/browser-geo-link-tracker/

## 自行部署

部屬至其他網站 (ex: Netlify ) 修改網址

## 限制與隱私

- 無法在收件人不知情或未授權時取得定位。
- 必須使用 HTTPS；直接以 `file://` 開啟通常無法使用定位權限。
- 座標只會在對方按鈕同意並取得瀏覽器權限後傳送。
- 不需要 Google Maps API 金鑰；定位使用 Chrome/Android 的瀏覽器原生權限詢問，查看座標時才開啟 Google Maps。
- 查看連結的持有者可以讀取；請不要把查看連結公開。不需要在程式碼或前端放入個人存取 Token。
- Function 會在資料讀取時清除超過 24 小時的定位資料。

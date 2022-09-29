## NextJS Blog

使用 Next.js 建立的部落格，主要分為**文章**、**留言**、**標籤**三個模塊。使用 CSR、SSR、SSG 三種模式渲染頁面，後端連接線上 MongoDB Clusters 雲端數據庫，並部署到 Vercel。

>  Demo 頁面：[NextJS-Blog](https://next-blog-one-phi.vercel.app/)
>
> 測試帳號：admin@gmail.com
>
> 密碼：admin

## 使用工具

* Next.js
* Antd/Sass
* axios
* mobx-react-lite
* mongodb
* iron-session
* next-cookie

## 主要功能

* 首頁
  * 顯示文章列表及主要資訊（作者、發布時間、文章標題、文章預覽、頭像、觀看次數）
  * 根據選中標籤篩選文章類型
* 會員
  * 登入、登出
  * 編輯個人資料（暱稱、職業、個人介紹）
  * 顯示個人成就（創作文章及數量、閱讀次數）
  * 檢視、關注/取消關注文章標籤
* 文章
  * 展示文章內容及主要資訊
  * 會員撰寫、編輯文章（支援 markdown 語法）
  * 會員發表文章評論

## 如何執行

1. 使用 `npm install` 安裝此專案所需的第三方套件。

2. 可參照 `env.example` 裡的指示，配置所需要的數據庫連結及 session 加密字串及 cookie 名字， 並在根目錄下新增 `.env.local` 文件（若需要打包上線，則需要新增 `.env.production` 作為線上配置）。
3. 輸入 `npm run dev` 指令在本地將專案啟動。
4. `npm run build` 建立此專案的 production 版本。


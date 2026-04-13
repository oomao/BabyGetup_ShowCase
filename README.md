<p align="center">
  <img src="assets/banner.png" alt="BabyGetUp Banner" width="100%"/>
</p>

<h1 align="center">👶 BabyGetUp — 智慧嬰兒監護系統</h1>

<p align="center">
  <strong>結合 BLE 感測器、即時視訊串流與自動睡醒安撫功能的智慧嬰兒監護方案</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/平台-Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android"/>
  <img src="https://img.shields.io/badge/藍牙-BLE_5.0-0082FC?style=for-the-badge&logo=bluetooth&logoColor=white" alt="BLE"/>
  <img src="https://img.shields.io/badge/視訊-WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white" alt="WebRTC"/>
  <img src="https://img.shields.io/badge/後端-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/伺服器-PHP_+_MySQL-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP"/>
</p>

<p align="center">
  <a href="https://oomao.github.io/BabyGetup_ShowCase/demo/">🌐 線上 Demo</a> •
  <a href="https://play.google.com/store/apps/details?id=org.easydarwin.easypusher_ap">📱 家長端 App</a> •
  <a href="https://play.google.com/store/apps/details?id=org.easydarwin.nursemaidgetupsetting_ap">📱 小孩端 App</a>
</p>

---

## 📖 專案簡介

**BabyGetUp** 是一套完整的智慧嬰兒監護系統，協助照護者透過即時視訊串流與 BLE（低功耗藍牙）感測器數據，遠端監控嬰幼兒的狀態。系統提供兩種部署架構 — **AP 模式**（裝置直連）與 **WAN 模式**（透過網路），可在不同環境靈活使用。

> ⚠️ **聲明**：基於保密協議，本倉庫不包含原始碼。此 Showcase 展示系統架構、功能特色與技術文件。

---

## ✨ 核心功能

### 📹 即時視訊監控
- 家長與小孩端 1 對 1 視訊串流（**WebRTC**）
- 低延遲點對點連線
- 根據網路狀況自適應調整視訊品質

### 🌡️ BLE 感測器整合
- **溫度**監測（°C）
- **濕度**追蹤（%）
- **呼吸頻率**偵測（bpm）
- 透過 BLE 5.0 穿戴式感測器即時取得數據
- 自定義 BLE 封包解析（PID03、PID06 格式）

### 🎵 睡醒安撫系統
- 透過 BLE 感測器自動偵測（離床與睡眠狀態）
- 可設定自動播放音樂和影片進行安撫
- 優先播放機制（影片優先，接著播放音樂）
- 音量與計時器控制

### 👥 聯絡人管理
- 家長/小孩角色帳號系統
- 好友申請與審核流程
- 隨機 ID 產生用於串流網址
- 多國語言支援（繁體中文、簡體中文、English）

### 🔐 安全機制
- JWT（RS256）Token 驗證
- JKS Keystore 用於 Android App 簽章
- FCM 推播通知
- SSL/TLS 加密通訊

---

## 🏗️ 系統架構

### AP 模式（直連）
適用於無網路環境，使用 Wi-Fi Direct 傳輸視訊，使用藍牙接收感測器數據。

```
┌──────────────┐     BLE 5.0      ┌──────────────┐
│  BLE 感測器   │ ◄──────────────► │   小孩手機    │
│  （穿戴裝置）  │                  │  (Android)   │
└──────────────┘                  └──────┬───────┘
                                         │ Wi-Fi Direct / AP
                                  ┌──────┴───────┐
                                  │   家長手機    │
                                  │  (Android)   │
                                  └──────────────┘
```

### WAN 模式（網路連線）
適用於遠端監控，使用 WebRTC 進行視訊串流，Node.js 作為信令伺服器。

```
┌──────────────┐     BLE      ┌──────────────┐
│  BLE 感測器   │ ◄──────────► │   小孩手機    │
│  （穿戴裝置）  │              │  (Android)   │
└──────────────┘              └──────┬───────┘
                                      │ WebRTC + Socket.io
                              ┌───────┴────────┐
                              │   信令伺服器     │
                              │   (Node.js)    │
                              └───────┬────────┘
                                      │ WebRTC + Socket.io
                              ┌───────┴────────┐
                              │    家長手機      │
                              │   (Android)    │
                              └───────┬────────┘
                                      │ HTTPS
                              ┌───────┴────────┐
                              │   API 伺服器    │
                              │ (PHP + MySQL)  │
                              └────────────────┘
```

### 詳細流程圖

<p align="center">
  <img src="docs/architecture/system-architecture.png" alt="系統架構圖" width="700"/>
</p>

<details>
<summary>📋 點擊查看完整 App 流程圖</summary>
<br>
<p align="center">
  <img src="docs/architecture/app-flowchart.png" alt="App 流程圖" width="100%"/>
</p>
</details>

<details>
<summary>📋 點擊查看小孩版等待頁面流程</summary>
<br>
<p align="center">
  <img src="docs/architecture/child-waiting-flow.png" alt="小孩等待頁面流程圖" width="100%"/>
</p>
</details>

---

## 🛠️ 技術棧

| 層級 | 技術 | 用途 |
|:---:|:---:|:---|
| 📱 **行動端** | Android (Java) | 家長端 & 小孩端 App |
| 📡 **BLE** | Bluetooth 5.0 | 感測器數據通訊 |
| 🎥 **視訊** | WebRTC | 即時點對點視訊串流 |
| 🔌 **信令** | Node.js + Socket.io | WebRTC 信令與房間管理 |
| 🌐 **API** | PHP (Apache/AppServ) | RESTful API、身份驗證、使用者管理 |
| 💾 **資料庫** | MySQL (InnoDB) | 使用者資料、FCM Token、好友關係 |
| 🔑 **驗證** | JWT (RS256) | Token 驗證機制 |
| 📩 **推播** | Firebase Cloud Messaging | 推播通知 |
| 🔒 **SSL** | OpenSSL | HTTPS 加密 |
| 🔄 **程序管理** | PM2 | Node.js 進程管理與自動重啟 |

---

## 📱 App 版本

### AP 版（直連 / 藍牙）
適用於無網路環境。使用 Wi-Fi Direct 傳輸視訊、使用藍牙連接感測器。

<p align="center">
  <a href="https://play.google.com/store/apps/details?id=org.easydarwin.easypusher_ap">
    <img src="https://img.shields.io/badge/家長端_App-Google_Play-414141?style=for-the-badge&logo=google-play&logoColor=white" alt="家長端 App"/>
  </a>
  <a href="https://play.google.com/store/apps/details?id=org.easydarwin.nursemaidgetupsetting_ap">
    <img src="https://img.shields.io/badge/小孩端_App-Google_Play-414141?style=for-the-badge&logo=google-play&logoColor=white" alt="小孩端 App"/>
  </a>
</p>

### WAN 版（網路 / WebRTC）
適用於遠端監控。使用 WebRTC 進行視訊串流，Node.js 信令伺服器管理連線。

---

## 🎮 線上 Demo

透過互動式網頁 Demo 體驗 BabyGetUp 的介面：

🔗 **[開始體驗 →](https://oomao.github.io/BabyGetup_ShowCase/demo/)**

Demo 模擬了 App 的主要畫面，包含：
- 🏠 啟動畫面 & 登入 / 註冊
- 👥 模式選擇（家長 / 小孩）
- 📹 視訊通話介面（含計時器與控制按鈕）
- 🌡️ 即時感測器數據展示（溫度、電量、狀態模擬）
- 🎵 影音播放設定（音樂、影片、YouTube）
- 📋 側邊導覽選單

> *注意：此為 UI 展示，不涉及實際裝置連線或視訊串流。*

---

## 📂 專案結構

```
BabyGetup_ShowCase/
├── README.md                          # 本文件
├── .gitignore                         # Git 排除規則
├── assets/                            # Banner & 媒體素材
│   └── banner.png
│
├── BabyGetup_WAN/                     # WAN 版 Android 資源檔
│   └── res/                           # Android Res（供 Demo 使用）
│       ├── drawable/                  # 圖片與向量圖
│       ├── layout/                    # Android Layout XML
│       ├── menu/                      # 選單定義
│       └── values/                    # 顏色、字串、主題
│
├── demo/                              # 🌐 互動式 Live Demo
│   ├── index.html                     # （可部署至 GitHub Pages）
│   ├── style.css
│   └── app.js
│
└── docs/
    ├── architecture/                  # 📊 系統架構圖
    │   ├── system-architecture.png
    │   ├── app-flowchart.png
    │   └── child-waiting-flow.png
    │
    ├── technical/                     # 📖 技術文件
    │   ├── BabyGetUp.mdj             # StarUML 模型
    │   ├── pm2-guide.txt             # PM2 使用說明
    │   ├── future-directions.txt     # 未來發展方向
    │   └── packet-formats/           # BLE 封包格式規格
    │
    ├── changelog/                     # 📝 版本修正紀錄
    │   ├── AP_changelog_20240826.docx
    │   └── WAN_changelog_20240704.docx
    │
    └── operation/                     # 🔧 操作手冊
        ├── server-startup-guide.docx
        ├── openssl-update-guide.docx
        └── server-settings/
```

---

## 🚀 未來方向

1. **多人視訊** — 從 1 對 1 擴展為 3~4 人視訊監控
2. **負載平衡** — Nginx + Docker 部署可擴展的信令伺服器
3. **橫向視訊** — 根據手機方向動態調整視訊佈局
4. **連線優化** — 微調 WebRTC 參數提升連線品質
5. **STUN/TURN 伺服器** — 自建 NAT 穿越伺服器
6. **Bug 修復與穩定性改善**

---

## 👤 作者

**Cmao** — [@oomao](https://github.com/oomao)

---

## 📄 授權

本專案 Showcase 僅供展示用途。原始碼為專有軟體，不包含於本倉庫中。

---

<p align="center">
  <sub>用 ❤️ 打造更智慧的嬰兒照護</sub>
</p>

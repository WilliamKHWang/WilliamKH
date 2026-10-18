# William KH Wang - Personal Portfolio Website

> 🚀 現代科技風 Bento Grid 個人作品集靜態網站，專為 **GitHub Pages** 設計打造。

![Portfolio Preview](assets/images/avatar.jpg)

## ✨ 特色亮點 (Features)

1. **Bento Grid 便當盒格狀佈局**：
   - 整合自介、核心指標、即時狀態與能力矩陣。
   - 支援現代 Glassmorphism 玻璃擬態與漸層微光邊框。
2. **互動式網頁終端機 (Interactive Mini Terminal)**：
   - 模擬 Unix 終端體驗，支援 `help`, `bio`, `skills`, `projects`, `contact`, `theme`, `clear` 等動態互動指令與上下鍵命令歷史記錄。
3. **波的傳播物理動態模擬實驗室 (WaveSim Physics Lab)**：
   - 內建 60fps HTML5 Canvas 物理引擎，可即時切換**橫波**與**縱波（疏密波）**，並動態調整頻率與振幅。
4. **流暢雙色主題切換 (Dark / Light Mode)**：
   - 預設賽博微光深色科技模式，支援一鍵切換至極簡純淨淺色模式，並自動記憶偏好至 `localStorage`。
5. **動態背景粒子網絡 (Particle Mesh Canvas)**：
   - 滑鼠懸停互動反應，並根據主題自動調整色彩。
6. **專案篩選機制與一鍵複製**：
   - 即時分類標籤切換（AI、全端、物理模擬、開源工具）。
   - 一鍵複製 Email 與 Toast 輕量提示反饋。
7. **零構建依賴 (Zero Build Dependency)**：
   - 純標準 HTML5、現代 CSS 與原生 JavaScript，推送到 GitHub 即可透過 GitHub Pages 零延遲發布！

---

## 🌐 如何啟用 GitHub Pages (How to Deploy to GitHub Pages)

本專案採用純靜態架構，可直接使用 GitHub 官方提供的 GitHub Pages 服務進行免費託管：

1. **提交並推送代碼到 GitHub**：
   ```bash
   git add .
   git commit -m "feat: launch modern bento portfolio website"
   git push origin main
   ```

2. **在 GitHub 儲存庫中開啟 Pages**：
   - 進入儲存庫網頁：`https://github.com/WilliamKHWang/WilliamKH`
   - 點擊頂部的 **Settings**（設定）
   - 在左側選單點選 **Pages**
   - 在 **Build and deployment** > **Source** 選擇 **Deploy from a branch**
   - 在 **Branch** 選取 `main` 分支與 `/ (root)` 資料夾，點選 **Save**

3. **完成發布**：
   - 等待約 1~2 分鐘，你的個人網站將會發布在：
   - 👉 `https://williamkhwang.github.io/WilliamKH/`

---

## 💻 本地預覽 (Local Preview)

你可以使用任何靜態伺服器在本地預覽：

```bash
# 使用 Python 內建伺服器
python3 -m http.server 8000

# 或使用 npx serve
npx serve .
```

開啟瀏覽器前往 `http://localhost:8000` 即可預覽。

---

## 🛠️ 目錄結構

```
WilliamKH/
├── index.html           # 網站主結構與 SEO 配置
├── styles.css           # 樣式表（Bento Grid、變數、深淺主題）
├── script.js            # 互動邏輯（粒子背景、終端機、物理模擬、主題切換）
├── assets/
│   └── images/
│       └── avatar.jpg   # 個人頭像與視覺圖像
└── README.md            # 專案說明與部署指南
```

---

© 2026 William KH Wang (王國憲). Crafted with passion & modern web standards.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0B0E11",     // 最背面
          panel: "#12161C",    // パネル
          box: "#161B22",      // 内部ボックス
        },
        text: {
          main: "#EAECEF",     // メインテキスト
          sub: "#B7BDC6",      // サブテキスト
          mute: "#6F7782",     // 非アクティブ
        },
        trade: {
          ask: "#F6465D",      // 売り
          bid: "#0ECB81",      // 買い
          askBg: "rgba(246,70,93,0.25)",
          bidBg: "rgba(14,203,129,0.25)",
          mid: "#58D1C9",      // 中央価格
        },
        ui: {
          active: "#8B5CF6",   // アクティブUI（紫）
        },
      },
    },
  },
  plugins: [],
};

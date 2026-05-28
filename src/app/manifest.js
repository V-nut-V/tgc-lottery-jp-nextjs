export default function manifest() {
  return {
    name: "TGC 抽選",
    short_name: "抽選",
    description: "TGC 店舗用抽選アプリ",
    start_url: "/store",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
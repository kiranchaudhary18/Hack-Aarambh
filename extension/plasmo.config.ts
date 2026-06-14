const config = {
  srcDir: "src",
  htmlDir: "html",
  buildDir: "build",
  assetsDir: "assets",
  devServer: {
    port: 3002,
    strictPort: false,
    hmr: true
  },
  manifest: {
    name: "ScamSniff Extension",
    version: "1.0.0",
    description: "Browser extension for detecting scams in images using AI",
    permissions: [
      "storage",
      "activeTab",
      "scripting"
    ],
    host_permissions: [
      "http://localhost:3000/*",
      "http://localhost:5173/*"
    ],
    action: {
      default_title: "Open ScamSniff",
      default_popup: "popup.html"
    }
  }
}

export default config

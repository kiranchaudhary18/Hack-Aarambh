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
      "scripting",
      "sidePanel",
      "tabs"
    ],
    host_permissions: [
      "http://localhost:3000/*",
      "http://localhost:5173/*"
    ],
    action: {
      default_title: "Open ScamSniff"
    },
    side_panel: {
      default_path: "sidepanel.html"
    }
  }
}

export default config

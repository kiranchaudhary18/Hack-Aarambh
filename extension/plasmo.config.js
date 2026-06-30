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
    },
    sidebar_action: {
      default_panel: "sidepanel.html"
    },
    browser_specific_settings: {
      gecko: {
        id: "scamsniff-extension@example.com",
        strict_min_version: "109.0"
      }
    }
  }
}

export default config

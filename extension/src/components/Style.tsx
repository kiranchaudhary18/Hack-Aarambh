type Theme = "light" | "dark";

export default function Style({ theme }: { theme: Theme }) {
  const isDark = theme === "dark";

  return (
    <style>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      :root {
        --radius: 1.75rem;
        --background: ${isDark ? "oklch(0.15 0.02 270)" : "oklch(0.97 0.018 95)"};
        --foreground: ${isDark ? "oklch(0.95 0.02 95)" : "oklch(0.24 0.04 270)"};
        --card: ${isDark ? "oklch(0.18 0.02 270)" : "oklch(0.985 0.012 95)"};
        --card-foreground: ${isDark ? "oklch(0.95 0.02 95)" : "oklch(0.24 0.04 270)"};
        --primary: oklch(0.62 0.18 295);
        --primary-foreground: oklch(0.99 0.005 95);
        --secondary: ${isDark ? "oklch(0.25 0.04 270)" : "oklch(0.92 0.04 95)"};
        --secondary-foreground: ${isDark ? "oklch(0.95 0.02 95)" : "oklch(0.3 0.04 270)"};
        --muted: ${isDark ? "oklch(0.25 0.04 270)" : "oklch(0.94 0.02 95)"};
        --muted-foreground: ${isDark ? "oklch(0.6 0.03 270)" : "oklch(0.5 0.03 270)"};
        --accent: oklch(0.85 0.12 70);
        --accent-foreground: ${isDark ? "oklch(0.95 0.02 95)" : "oklch(0.24 0.04 270)"};
        --destructive: oklch(0.66 0.22 22);
        --destructive-foreground: oklch(0.99 0.005 95);
        --border: ${isDark ? "oklch(0.3 0.025 270 / 0.7)" : "oklch(0.88 0.025 95 / 0.7)"};
        --input: ${isDark ? "oklch(0.25 0.04 270)" : "oklch(0.92 0.02 95)"};
        --ring: oklch(0.62 0.18 295);

        --shadow-clay: ${isDark
          ? "6px 6px 16px rgba(0, 0, 0, 0.3), -6px -6px 16px rgba(255, 255, 255, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)"
          : "6px 6px 16px rgba(247, 246, 246, 0.04), -6px -6px 16px rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.02)"};
        --shadow-clay-sm: ${isDark
          ? "3px 3px 8px rgba(0, 0, 0, 0.2), -3px -3px 8px rgba(255, 255, 255, 0.05), 0 1px 1px rgba(0, 0, 0, 0.1)"
          : "3px 3px 8px rgba(0, 0, 0, 0.03), -3px -3px 8px rgba(255, 255, 255, 0.8), 0 1px 1px rgba(0, 0, 0, 0.02)"};
        --shadow-clay-inset: ${isDark
          ? "inset 3px 3px 6px rgba(0, 0, 0, 0.3), inset -3px -3px 6px rgba(255, 255, 255, 0.05)"
          : "inset 3px 3px 6px rgba(0, 0, 0, 0.04), inset -3px -3px 6px rgba(255, 255, 255, 0.7)"};
      }
      
      body {
        font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
        background: var(--background);
        color: var(--foreground);
        overflow-x: hidden;
        width: 100%;
        word-wrap: break-word;
        word-break: break-word;
      }
      
      .clay {
        background: var(--card);
        border-radius: var(--radius);
        border: 1px solid rgba(0, 0, 0, 0.02);
      }

      .clay-inset {
        background: var(--muted);
        border-radius: calc(var(--radius) - 0.5rem);
        border: 1px solid rgba(0, 0, 0, 0.02);
      }

      .clay-primary {
        background: linear-gradient(145deg, oklch(0.72 0.18 295), oklch(0.55 0.2 305));
        color: var(--primary-foreground);
        border-radius: 999px;
      }
      
      .w-full { width: 100%; max-width: 100%; }
      .p-6 { padding: 1.5rem; }
      .mb-6 { margin-bottom: 1.5rem; }
      .space-y-4 > * + * { margin-top: 1rem; }
      .text-center { text-align: center; }
      .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
      .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
      .text-base { font-size: 1rem; line-height: 1.5rem; }
      .font-bold { font-weight: 700; }
      .font-medium { font-weight: 500; }
      .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
      .text-foreground { color: var(--foreground); }
      .text-muted-foreground { color: var(--muted-foreground); }
      .text-primary { color: var(--primary); }
      .text-destructive { color: var(--destructive); }
      .text-primary-foreground { color: var(--primary-foreground); }
      .bg-destructive\\/10 { background-color: color-mix(in srgb, var(--destructive) 10%, transparent); }
      .rounded { border-radius: var(--radius); }
      .rounded-lg { border-radius: 0.5rem; }
      .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .mt-1 { margin-top: 0.25rem; }
      .mt-4 { margin-top: 1rem; }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .w-3\\/4 { width: 75%; }
      .w-auto { width: auto; }
      .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .block { display: block; }
      .hover\\:underline:hover { text-decoration: underline; }
      .disabled\\:opacity-50:disabled { opacity: 0.5; }
      .h-48 { height: 12rem; }
      .object-cover { object-fit: cover; }
      .overflow-hidden { overflow: hidden; }
      .flex { display: flex; }
      .flex-col { flex-direction: column; }
      .gap-2 { gap: 0.5rem; }
      .gap-3 { gap: 0.75rem; }
      .flex-1 { flex: 1; }
      .items-center { align-items: center; }
      .justify-center { justify-content: center; }
      .hover\\:opacity-80:hover { opacity: 0.8; }
      .border-t { border-top-width: 1px; }
      .border-border { border-color: var(--border); }
      .max-w-\[400px\] { max-width: 400px; }
      .min-h-\[500px\] { min-height: 500px; }
      .min-h-full { min-height: 100%; }
      .overflow-x-hidden { overflow-x: hidden; }
      .h-14 { height: 3.5rem; }
      .animate-spin { animation: spin 1s linear infinite; }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      input {
        max-width: 100%;
        box-sizing: border-box;
      }
      
      button {
        max-width: 100%;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1.5;
        white-space: nowrap;
        cursor: pointer;
      }
    `}</style>
  );
}

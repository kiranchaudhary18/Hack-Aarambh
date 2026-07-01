import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { KeyRound, Plus, Copy, Trash2, X, ChevronLeft, Calendar, Eye, Check, Download, Puzzle } from "lucide-react";
import { api } from "@/shared/lib/api";
import { toast } from "sonner";

export function ApiTokens() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [apiTokens, setApiTokens] = useState<any[]>([]);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [expirationDays, setExpirationDays] = useState<number>(30);
  const [tokenVisibility, setTokenVisibility] = useState<Record<string, "hidden" | "visible">>({});
  const [copiedTokens, setCopiedTokens] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!token) {
      toast.error("Please login to access API tokens");
      navigate("/login");
      return;
    }
    document.title = "API Tokens — ScamSniff";
    fetchTokens();
  }, [token]);

  if (!token) {
    return null;
  }

  async function fetchTokens() {
    try {
      const tokens = await api.getTokens();
      setApiTokens(tokens);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    }
  }

  async function handleGenerateToken() {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expirationDays);

      const result = await api.generateToken(
        newTokenName || "Extension Token",
        expiresAt.toISOString(),
      );
      setGeneratedToken(result.token);
      setTokenVisibility((prev) => ({ ...prev, generated: "hidden" }));
      setApiTokens([...apiTokens, result]);
      setNewTokenName("");
      setExpirationDays(30);
      toast.success("API token generated successfully");
    } catch (error) {
      console.error("Failed to generate token:", error);
      toast.error("Failed to generate API token");
    }
  }

  async function handleDeleteToken(tokenId: string) {
    if (confirm("Delete this API token?")) {
      try {
        await api.deleteToken(tokenId);
        setApiTokens(apiTokens.filter((k: any) => k.id !== tokenId));
        toast.success("API token deleted successfully");
      } catch (error) {
        console.error("Failed to delete token:", error);
        toast.error("Failed to delete API token");
      }
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function isExpired(expiresAt: string | null) {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  function maskToken(token: string) {
    if (token.length <= 10) return token;
    const start = token.substring(0, 8);
    const end = token.substring(token.length - 4);
    return `${start}...${end}`;
  }

  function handleTokenToggle(tokenId: string, token: string) {
    const currentState = tokenVisibility[tokenId] || "hidden";

    if (currentState === "hidden") {
      setTokenVisibility((prev) => ({ ...prev, [tokenId]: "visible" }));
    } else if (currentState === "visible") {
      try {
        navigator.clipboard.writeText(token);
        toast.success("API token copied to clipboard");
        setCopiedTokens((prev) => ({ ...prev, [tokenId]: true }));
        setTimeout(() => {
          setCopiedTokens((prev) => ({ ...prev, [tokenId]: false }));
        }, 2000);
      } catch (error) {
        console.error("Clipboard write failed:", error);
        toast.error("Failed to copy to clipboard. Please copy manually.");
      }
      setTokenVisibility((prev) => ({ ...prev, [tokenId]: "hidden" }));
    }
  }

  function handleGeneratedTokenToggle() {
    const currentState = tokenVisibility["generated"] || "hidden";
    if (currentState === "hidden") {
      setTokenVisibility((prev) => ({ ...prev, generated: "visible" }));
    } else {
      try {
        navigator.clipboard.writeText(generatedToken!);
        toast.success("API token copied to clipboard");
        setCopiedTokens((prev) => ({ ...prev, generated: true }));
        setTimeout(() => {
          setCopiedTokens((prev) => ({ ...prev, generated: false }));
        }, 2000);
      } catch (error) {
        console.error("Clipboard write failed:", error);
        toast.error("Failed to copy to clipboard. Please copy manually.");
      }
      setTokenVisibility((prev) => ({ ...prev, generated: "hidden" }));
    }
  }

  function getToggleIcon(tokenId: string, state: "hidden" | "visible") {
    if (copiedTokens[tokenId]) {
      return <Check className="h-4 w-4" />;
    }
    switch (state) {
      case "hidden":
        return <Eye className="h-4 w-4" />;
      case "visible":
        return <Copy className="h-4 w-4" />;
    }
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <Sidebar />
        <main className="hide-scrollbar min-w-0 flex-1 space-y-6 overflow-y-auto pr-2 pb-6">
          <FadeIn>
            <div className="flex items-center gap-4">
              <Link to="/settings" className="clay-btn p-2">
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <div>
                <p className="clay-pill inline-block">Settings</p>
                <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">API Tokens</h1>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="clay p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold">Your API Tokens</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Generate and manage API tokens for the browser extension
                  </p>
                </div>
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="clay-btn inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold"
                >
                  <Plus className="h-3.5 w-3.5" /> Generate token
                </button>
              </div>
              <div className="mt-5 space-y-3">
                {apiTokens.length === 0 ? (
                  <div className="clay-inset p-4 text-center">
                    <KeyRound className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-semibold">No API tokens yet</p>
                    <p className="text-xs text-muted-foreground">
                      Generate an API token to use with the browser extension
                    </p>
                  </div>
                ) : (
                  apiTokens.map((token: any) => (
                    <div key={token.id} className="clay-inset p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full clay-inset">
                            <KeyRound className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold">{token.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {token.usageCount} / {token.dailyLimit} used today
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTokenToggle(token.id, token.token)}
                            className="clay-btn p-2"
                          >
                            {getToggleIcon(token.id, tokenVisibility[token.id] || "hidden")}
                          </button>
                          <button
                            onClick={() => handleDeleteToken(token.id)}
                            className="clay-btn p-2 text-[color:var(--destructive)]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <code className="clay-inset block w-full px-3 py-2 text-xs font-mono">
                          {tokenVisibility[token.id] === "visible"
                            ? token.token
                            : maskToken(token.token)}
                        </code>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Expires: {formatDate(token.expiresAt)}</span>
                          {isExpired(token.expiresAt) && (
                            <span className="text-[color:var(--destructive)]">(Expired)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="clay p-6">
              <h3 className="font-display text-xl font-bold flex items-center gap-2">
                <Puzzle className="h-5 w-5 text-[color:var(--clay-blue)]" />
                ScamSniff Browser Extension
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Enhance your safety by scanning LinkedIn and Indeed job offers directly from your browser.
              </p>
              
              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <div className="clay-inset p-5 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">Download Extension Package</h4>
                    <p className="mt-1 text-xs text-muted-foreground font-medium">
                      Get the latest developer build of the ScamSniff extension to load manually into your browser.
                    </p>
                  </div>
                  <a
                    href="/scamsniff-extension.zip"
                    download="scamsniff-extension.zip"
                    className="clay-primary mt-6 inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-center w-full"
                  >
                    <Download className="h-4 w-4" /> Download Extension (.zip)
                  </a>
                </div>

                <div className="clay-inset p-5">
                  <h4 className="font-semibold text-sm">How to Install (Chrome/Brave/Edge)</h4>
                  <ol className="mt-3 space-y-2.5 text-xs text-muted-foreground list-decimal list-inside">
                    <li>Download the extension and <strong>unzip</strong> (extract) the folder.</li>
                    <li>Open your browser and navigate to <code className="px-1.5 py-0.5 rounded bg-black/10 font-mono text-[10px]">chrome://extensions/</code>.</li>
                    <li>Enable <strong>Developer mode</strong> using the toggle button in the top-right.</li>
                    <li>Click on the <strong>Load unpacked</strong> button in the top-left.</li>
                    <li>Select the extracted folder (e.g., <code className="px-1.5 py-0.5 rounded bg-black/10 font-mono text-[10px]">chrome-mv3-prod</code>).</li>
                  </ol>
                </div>
              </div>
            </div>
          </FadeIn>
        </main>
      </div>

      {/* API Token Generation Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="clay p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold">Generate API Token</h3>
              <button
                onClick={() => {
                  setShowApiKeyModal(false);
                  setGeneratedToken(null);
                  setTokenVisibility((prev) => {
                    const { generated, ...rest } = prev;
                    return rest;
                  });
                  setNewTokenName("");
                  setExpirationDays(30);
                }}
                className="clay-btn p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {generatedToken ? (
              <div className="space-y-4">
                <div className="clay-inset p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground">Your API token:</p>
                    <button onClick={handleGeneratedTokenToggle} className="clay-btn p-1">
                      {getToggleIcon("generated", tokenVisibility["generated"] || "hidden")}
                    </button>
                  </div>
                  <code className="block w-full px-3 py-2 text-xs font-mono break-all">
                    {tokenVisibility["generated"] === "visible"
                      ? generatedToken
                      : maskToken(generatedToken)}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  {tokenVisibility["generated"] === "hidden"
                    ? "Click the eye icon to view your token, then copy it."
                    : "Click the copy icon to copy your token."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Token name (optional)</label>
                  <input
                    type="text"
                    value={newTokenName}
                    onChange={(e) => setNewTokenName(e.target.value)}
                    placeholder="e.g., Extension Token"
                    className="clay-inset mt-1 w-full px-4 py-2.5 text-sm font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Expiration (days)</label>
                  <input
                    type="number"
                    value={expirationDays}
                    onChange={(e) => setExpirationDays(parseInt(e.target.value) || 30)}
                    min="1"
                    max="365"
                    className="clay-inset mt-1 w-full px-4 py-2.5 text-sm font-semibold outline-none"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Token will expire in {expirationDays} day{expirationDays !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={handleGenerateToken}
                  className="clay-primary w-full py-2.5 text-sm font-semibold"
                >
                  <Plus className="inline h-4 w-4 mr-2" /> Generate Token
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

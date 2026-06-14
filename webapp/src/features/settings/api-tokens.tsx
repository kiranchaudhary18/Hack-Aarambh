import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { ClayBlobs } from "@/shared/components/ClayBlobs";
import { FadeIn } from "@/shared/components/Animated";
import { KeyRound, Plus, Copy, Trash2, X, ChevronLeft, Calendar } from "lucide-react";
import { api } from "@/shared/lib/api";
import { toast } from "sonner";

export function ApiTokens() {
  const [apiTokens, setApiTokens] = useState<any[]>([]);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [expirationDays, setExpirationDays] = useState<number>(30);

  useEffect(() => {
    document.title = "API Tokens — ScamSniff";
    fetchTokens();
  }, []);

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
      
      const result = await api.generateToken(newTokenName || "Extension Token", expiresAt.toISOString());
      setGeneratedToken(result.token);
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
                            onClick={() => {
                              navigator.clipboard.writeText(token.token);
                              toast.success("API token copied to clipboard");
                            }}
                            className="clay-btn p-2"
                          >
                            <Copy className="h-4 w-4" />
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
                          {token.token}
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
                  <p className="text-xs text-muted-foreground mb-2">Your API token:</p>
                  <code className="block w-full px-3 py-2 text-xs font-mono break-all">
                    {generatedToken}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  Copy this token now. You won't be able to see it again.
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedToken);
                    toast.success("API token copied to clipboard");
                  }}
                  className="clay-primary w-full py-2.5 text-sm font-semibold"
                >
                  <Copy className="inline h-4 w-4 mr-2" /> Copy Token
                </button>
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
                    Token will expire in {expirationDays} day{expirationDays !== 1 ? 's' : ''}
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

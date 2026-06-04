import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Sidebar } from "@/components/Sidebar";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn } from "@/components/Animated";
import { LoadingScreen } from "@/components/Loading";
import { api } from "@/lib/api";
import { resultStore } from "@/lib/resultStore";
import { FileText, Link2, Type, ScanSearch, Upload, Loader2, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze offer — ScamSniff" },
      {
        name: "description",
        content: "Paste, upload, or link a job offer for instant scam analysis.",
      },
    ],
  }),
  component: Analyze,
});

type Tab = "text" | "pdf" | "url";

function Analyze() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const samples = [
    "Congratulations! You've been selected for a remote data entry role paying $4,500 per week. No interview required. Send $50 activation fee via crypto wallet to begin onboarding. Reply within 2 hours.",
    "Hi Aisha, following up on your portfolio review for the Product Designer role at Notion Labs. Attaching the SOW and rate card. Let me know if you'd like to schedule the next stage. — Best, Sarah",
    "URGENT! Amazon Logistics is hiring package handlers — work from home, $3000/week. Contact our HR on WhatsApp +1-555-0199 to secure your slot today!",
  ];

  async function handleAnalyze() {
    if (tab === "text" && text.trim().length < 20)
      return toast.error("Paste at least 20 characters of the offer.");
    if (tab === "text" && text.length > 8000)
      return toast.error("Text must be under 8000 characters.");
    if (tab === "url" && !/^https?:\/\/.+\..+/.test(url.trim()))
      return toast.error("Enter a valid URL starting with http(s)://");
    if (tab === "pdf") {
      if (!file) return toast.error("Please upload a PDF file.");
      if (file.type !== "application/pdf") return toast.error("Only PDF files are supported.");
      if (file.size > 10 * 1024 * 1024) return toast.error("File must be under 10MB.");
    }
    setLoading(true);

    try {
      let result;
      if (tab === "text") {
        result = await api.analyzeText(text);
      } else if (tab === "pdf" && file) {
        result = await api.analyzePdf(file);
      } else if (tab === "url") {
        result = await api.analyzeText(`Job link: ${url}`);
      }

      resultStore.set(result);
      toast.success("Analysis complete");
      nav({ to: "/result", search: { id: result.id || undefined } });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error(error instanceof Error ? error.message : "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <ClayBlobs />
      <div className="relative mx-auto flex h-full max-w-[1380px] gap-6 p-6">
        <Sidebar />
        <main className="hide-scrollbar min-w-0 flex-1 space-y-6 overflow-y-auto pb-6">
          {loading ? (
            <div className="clay-lg p-8">
              <LoadingScreen />
            </div>
          ) : (
            <>
              <FadeIn>
                <p className="clay-pill inline-block">Analyze</p>
                <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
                  Drop the offer in here.
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Paste the message, upload a PDF, or share the URL. We score it in seconds.
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="clay-lg p-6 md:p-8">
                  <div className="clay-inset inline-flex gap-1 p-1">
                    {(
                      [
                        { id: "text", label: "Paste text", icon: Type },
                        { id: "pdf", label: "Upload PDF", icon: FileText },
                        { id: "url", label: "Job URL", icon: Link2 },
                      ] as {
                        id: Tab;
                        label: string;
                        icon: React.ComponentType<{ className?: string }>;
                      }[]
                    ).map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setTab(id)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${tab === id ? "clay-primary" : "text-muted-foreground"}`}
                      >
                        <Icon className="h-4 w-4" /> {label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6">
                    {tab === "text" && (
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={10}
                        placeholder="Paste the suspicious email, DM, or offer letter here..."
                        className="clay-inset w-full resize-none p-5 text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
                      />
                    )}
                    {tab === "pdf" && (
                      <label className="clay-inset flex cursor-pointer flex-col items-center justify-center gap-3 p-12 text-center">
                        <span
                          className="grid h-16 w-16 place-items-center rounded-3xl"
                          style={{ background: "var(--clay-blue)" }}
                        >
                          <Upload className="h-7 w-7" />
                        </span>
                        <p className="font-display text-xl font-bold">
                          {file ? file.name : "Drop your offer PDF"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {file
                            ? `${(file.size / 1024).toFixed(0)} KB · click to replace`
                            : "or click to browse · max 10MB"}
                        </p>
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    )}
                    {tab === "url" && (
                      <div className="clay-inset flex items-center gap-3 px-5 py-4">
                        <Link2 className="h-5 w-5 text-muted-foreground" />
                        <input
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://careers.example.com/posting/123"
                          className="flex-1 bg-transparent text-sm outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      We never store the raw content. Analysis runs in under 4 seconds.
                    </p>
                    <button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="clay-primary inline-flex items-center gap-2 px-7 py-3.5 font-semibold disabled:opacity-70"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <ScanSearch className="h-5 w-5" />
                      )}
                      {loading ? "Sniffing..." : "Analyze now"}
                    </button>
                  </div>
                </div>
              </FadeIn>

              {tab === "text" && (
                <FadeIn delay={0.2}>
                  <div className="clay p-6">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-10 w-10 place-items-center rounded-2xl"
                        style={{ background: "var(--clay-yellow)" }}
                      >
                        <Lightbulb className="h-5 w-5" />
                      </span>
                      <h2 className="font-display text-xl font-bold">Try with a sample</h2>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {samples.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => setText(s)}
                          className="clay-sm p-4 text-left text-sm transition hover:-translate-y-0.5"
                        >
                          {s.slice(0, 110)}…
                        </button>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

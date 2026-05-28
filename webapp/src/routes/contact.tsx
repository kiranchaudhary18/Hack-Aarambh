import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClayBlobs } from "@/components/ClayBlobs";
import { FadeIn } from "@/components/Animated";
import { Mail, MessageSquare, Twitter, Github, Linkedin, Send, Loader2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — ScamSniff" },
    { name: "description", content: "Get in touch with the ScamSniff team. We reply within 24 hours." },
    { property: "og:title", content: "Contact ScamSniff" },
  ]}),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (!name || name.length > 100) return toast.error("Please enter a valid name (1–100 chars).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return toast.error("Please enter a valid email.");
    if (!message || message.length > 1000) return toast.error("Message must be 1–1000 characters.");
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", message: "" });
      toast.success("Message sent! We'll reply within 24h.");
    }, 1200);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ClayBlobs />
      <Navbar />
      <section className="relative mx-auto w-[min(1180px,94%)] pt-12">
        <FadeIn>
          <span className="clay-pill inline-block">Contact</span>
          <h1 className="mt-4 font-display text-5xl font-bold sm:text-6xl">Let's <span className="text-gradient">talk.</span></h1>
          <p className="mt-4 max-w-xl text-muted-foreground">Press, partnerships, bug reports, or just a hello — we read every message.</p>
        </FadeIn>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <FadeIn delay={0.05}>
            <form onSubmit={submit} className="clay-lg space-y-5 p-8">
              <div>
                <label className="text-sm font-semibold">Your name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                  placeholder="Aisha Khan"
                  className="clay-inset mt-2 w-full px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                  placeholder="you@example.com"
                  className="clay-inset mt-2 w-full px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={6}
                  maxLength={1000}
                  placeholder="What's on your mind?"
                  className="clay-inset mt-2 w-full resize-none px-4 py-3 text-sm outline-none"
                />
                <p className="mt-1 text-xs text-muted-foreground">{form.message.length}/1000</p>
              </div>
              <button disabled={sending} className="clay-primary inline-flex items-center gap-2 px-7 py-3.5 font-semibold disabled:opacity-70">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="space-y-5">
              <div className="clay p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: "var(--clay-pink)" }}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold">hello@scamsniff.app</p>
                  </div>
                </div>
              </div>
              <div className="clay p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: "var(--clay-green)" }}>
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Support</p>
                    <p className="font-semibold">support@scamsniff.app</p>
                  </div>
                </div>
              </div>
              <div className="clay p-6">
                <p className="text-sm font-semibold">Follow along</p>
                <div className="mt-3 flex gap-2">
                  {[Twitter, Github, Linkedin].map((I, i) => (
                    <a key={i} href="#" className="clay-btn grid h-11 w-11 place-items-center">
                      <I className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      <div className="mt-20"><Footer /></div>
    </div>
  );
}

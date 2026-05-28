export type Verdict = "scam" | "safe" | "suspicious";

export interface JobCheck {
  id: string;
  title: string;
  company: string;
  snippet: string;
  date: string;
  score: number; // 0-100 risk
  verdict: Verdict;
  reasons: { label: string; severity: "high" | "med" | "low"; detail: string }[];
  source: "text" | "pdf" | "url";
}

export const recentChecks: JobCheck[] = [
  {
    id: "c1",
    title: "Remote Data Entry – $4,500/week",
    company: "GlobalHire Solutions",
    snippet: "Congratulations! You've been selected without interview. Send $50 processing fee...",
    date: "2026-05-22",
    score: 92,
    verdict: "scam",
    source: "text",
    reasons: [
      { label: "Upfront payment requested", severity: "high", detail: "Legitimate employers never ask for fees." },
      { label: "Unrealistic salary", severity: "high", detail: "Pay is 5x market rate for this role." },
      { label: "No interview process", severity: "med", detail: "Offer extended without any screening." },
      { label: "Gmail sender domain", severity: "med", detail: "Email from globalhire.hr@gmail.com — not corporate." },
    ],
  },
  {
    id: "c2",
    title: "Junior Frontend Developer",
    company: "Linear",
    snippet: "We'd love to schedule a 30-min intro call this week. Here is the JD and benefits...",
    date: "2026-05-20",
    score: 8,
    verdict: "safe",
    source: "pdf",
    reasons: [
      { label: "Verified corporate domain", severity: "low", detail: "Sent from @linear.app — verified DKIM." },
      { label: "Structured process", severity: "low", detail: "Includes interview stages and team intros." },
    ],
  },
  {
    id: "c3",
    title: "Urgent: Amazon Package Handler – WFH",
    company: "Amaz0n Logistics",
    snippet: "Reply within 2 hours to secure your spot. WhatsApp our HR at +1...",
    date: "2026-05-18",
    score: 78,
    verdict: "scam",
    source: "text",
    reasons: [
      { label: "Spoofed brand name", severity: "high", detail: "'Amaz0n' uses zero instead of o." },
      { label: "Urgency pressure", severity: "high", detail: "Manufactured deadline to bypass critical thinking." },
      { label: "WhatsApp recruitment", severity: "med", detail: "Real recruiters use email + ATS systems." },
    ],
  },
  {
    id: "c4",
    title: "Product Designer Contract – 6mo",
    company: "Notion Labs",
    snippet: "Hi! Following up after your portfolio review. Attached is the SOW and rate card...",
    date: "2026-05-15",
    score: 14,
    verdict: "safe",
    source: "pdf",
    reasons: [
      { label: "Personalized outreach", severity: "low", detail: "References your portfolio specifically." },
      { label: "Standard SOW attached", severity: "low", detail: "Includes deliverables, milestones, IP terms." },
    ],
  },
  {
    id: "c5",
    title: "Crypto Recruiter Bonus – $10k Sign-on",
    company: "BlockHire Global",
    snippet: "Pay $200 to activate your worker wallet and receive sign-on bonus instantly...",
    date: "2026-05-12",
    score: 96,
    verdict: "scam",
    source: "url",
    reasons: [
      { label: "Crypto wallet activation fee", severity: "high", detail: "Classic advance-fee fraud pattern." },
      { label: "Instant bonus claim", severity: "high", detail: "No employer pays bonuses before day one." },
      { label: "Newly registered domain", severity: "med", detail: "blockhire-global.xyz registered 6 days ago." },
    ],
  },
  {
    id: "c6",
    title: "Backend Engineer (Go)",
    company: "Stripe",
    snippet: "We reviewed your application and would like to invite you to a technical screen...",
    date: "2026-05-08",
    score: 11,
    verdict: "safe",
    source: "text",
    reasons: [
      { label: "Multi-stage interview", severity: "low", detail: "Standard 4-stage Stripe process." },
      { label: "Verified domain", severity: "low", detail: "@stripe.com with SPF + DKIM aligned." },
    ],
  },
];

export const tips = [
  {
    icon: "DollarSign",
    title: "Upfront fee = walk away",
    desc: "No legitimate employer asks for money to start a job. Training, equipment, background checks — all paid by the company.",
    color: "clay-pink",
  },
  {
    icon: "Mail",
    title: "Inspect the sender domain",
    desc: "@gmail.com or @outlook.com from a 'recruiter' at a Fortune 500? Almost always fake.",
    color: "clay-blue",
  },
  {
    icon: "Clock",
    title: "Urgency is a weapon",
    desc: "'Respond in 2 hours' or 'limited slots' are pressure tactics to short-circuit your judgment.",
    color: "clay-yellow",
  },
  {
    icon: "Banknote",
    title: "Too-good salaries",
    desc: "If pay is 3–5x the market rate for entry-level remote work, it's bait. Cross-check on Levels.fyi.",
    color: "clay-green",
  },
  {
    icon: "MessageCircle",
    title: "WhatsApp/Telegram red flag",
    desc: "Real recruiters use email and ATS platforms. Encrypted chat-first contact is a scam pattern.",
    color: "clay-purple",
  },
  {
    icon: "Link2",
    title: "Hover before you click",
    desc: "Application links pointing to bit.ly, tinyurl, or unrelated domains are phishing attempts.",
    color: "clay-orange",
  },
];

export const scamTypes = [
  { name: "Advance-fee fraud", value: 34, color: "var(--clay-pink)" },
  { name: "Fake recruiter", value: 26, color: "var(--clay-blue)" },
  { name: "Brand impersonation", value: 18, color: "var(--clay-yellow)" },
  { name: "Crypto / wallet", value: 12, color: "var(--clay-green)" },
  { name: "Phishing link", value: 10, color: "var(--clay-purple)" },
];

export const trendData = [
  { month: "Dec", scams: 42, safe: 180 },
  { month: "Jan", scams: 58, safe: 210 },
  { month: "Feb", scams: 71, safe: 234 },
  { month: "Mar", scams: 94, safe: 252 },
  { month: "Apr", scams: 128, safe: 281 },
  { month: "May", scams: 156, safe: 312 },
];

export const flaggedCases = recentChecks.filter((c) => c.score >= 70);

export const adminStats = {
  totalScans: 18472,
  scamsDetected: 6128,
  activeUsers: 2391,
  savedDollars: 1840000,
};

export function analyzeText(input: string): JobCheck {
  const lower = input.toLowerCase();
  const reasons: JobCheck["reasons"] = [];
  let score = 12;

  if (/fee|payment|deposit|activation|wallet/.test(lower)) {
    reasons.push({ label: "Upfront payment requested", severity: "high", detail: "Money requested before work begins." });
    score += 35;
  }
  if (/urgent|immediately|within \d+ hour|limited/.test(lower)) {
    reasons.push({ label: "Urgency pressure tactic", severity: "high", detail: "Artificial deadline detected." });
    score += 22;
  }
  if (/whatsapp|telegram|signal/.test(lower)) {
    reasons.push({ label: "Off-platform contact channel", severity: "med", detail: "Recruitment moved to encrypted chat." });
    score += 15;
  }
  if (/gmail\.com|outlook\.com|yahoo\.com/.test(lower) && /recruit|hr|hire/.test(lower)) {
    reasons.push({ label: "Personal email domain", severity: "med", detail: "Recruiter using free email service." });
    score += 14;
  }
  if (/\$[\d,]{4,}|\d{4,}\s*(per week|\/week|weekly)/.test(lower)) {
    reasons.push({ label: "Unusually high compensation", severity: "med", detail: "Pay claim above market norms." });
    score += 12;
  }
  if (/no interview|without interview|selected directly/.test(lower)) {
    reasons.push({ label: "No interview step", severity: "high", detail: "Offer extended with zero screening." });
    score += 18;
  }
  if (/crypto|bitcoin|btc|usdt|wallet activation/.test(lower)) {
    reasons.push({ label: "Crypto-related onboarding", severity: "high", detail: "Wallet/crypto requirement is a known fraud vector." });
    score += 20;
  }

  if (reasons.length === 0) {
    reasons.push(
      { label: "No critical red flags detected", severity: "low", detail: "Sender, tone, and process appear consistent with legitimate hiring." },
      { label: "Structured language", severity: "low", detail: "Message uses professional formatting." },
    );
  }

  score = Math.min(98, score);
  const verdict: Verdict = score >= 65 ? "scam" : score >= 35 ? "suspicious" : "safe";

  return {
    id: "live-" + Date.now(),
    title: input.split("\n")[0].slice(0, 60) || "Pasted job offer",
    company: "Unknown sender",
    snippet: input.slice(0, 160),
    date: new Date().toISOString().slice(0, 10),
    score,
    verdict,
    reasons,
    source: "text",
  };
}

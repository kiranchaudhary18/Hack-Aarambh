// Mock data for SafeHire AI

export const mockUsers = [
  {
    id: "u1",
    name: "Alex Rivera",
    email: "alex.rivera@gmail.com",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    scansCount: 14,
    flaggedCount: 6,
    joinDate: "2026-01-15",
  },
  {
    id: "u2",
    name: "Sarah Chen",
    email: "sarah.chen@safehire.ai",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    scansCount: 142,
    flaggedCount: 89,
    joinDate: "2025-11-01",
  },
  {
    id: "u3",
    name: "Marcus Vance",
    email: "marcus.v@outlook.com",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    scansCount: 3,
    flaggedCount: 1,
    joinDate: "2026-04-10",
  }
];

export const mockScamReports = [
  {
    id: "scam-101",
    companyName: "GlobalTech Solutions (Impersonated)",
    jobTitle: "Remote Data Entry Clerk",
    reportedBy: "Alex Rivera",
    date: "2026-05-24",
    scamType: "Advance Fee Phishing",
    severity: "critical",
    redFlags: [
      "Unofficial domain used (@globaltech-hr-desk.com)",
      "Urgent demand to purchase laptop equipment from 'approved vendor'",
      "Payment requested via crypto or check deposit",
      "Extremely high salary ($45/hr for basic data entry)"
    ],
    fraudScore: 94,
    status: "verified_fraud"
  },
  {
    id: "scam-102",
    companyName: "Amazon Talent Acquisition (Fake Link)",
    jobTitle: "Virtual Assistant",
    reportedBy: "Marcus Vance",
    date: "2026-05-22",
    scamType: "Identity Theft / Info Harvesting",
    severity: "high",
    redFlags: [
      "Interview conducted solely via Telegram chat",
      "Immediate hire without verbal or video interview",
      "Requested SSN and banking details on day 1 for 'onboarding'",
      "Grammatical errors in the contract agreement"
    ],
    fraudScore: 88,
    status: "flagged"
  },
  {
    id: "scam-103",
    companyName: "BlockLabs Inc",
    jobTitle: "Solidity Developer",
    reportedBy: "Jane Doe",
    date: "2026-05-20",
    scamType: "Fake Task / Unpaid Labor",
    severity: "medium",
    redFlags: [
      "Requires building a fully functioning app as a 24hr 'take-home test'",
      "No contact information or LinkedIn presence for the hiring manager",
      "Vague contract terms, compensation structured entirely on token launch"
    ],
    fraudScore: 62,
    status: "under_review"
  },
  {
    id: "scam-104",
    companyName: "Chevron Energy Partners",
    jobTitle: "Operations Supervisor",
    reportedBy: "Derrick Miller",
    date: "2026-05-18",
    scamType: "Visa Scam",
    severity: "critical",
    redFlags: [
      "Job offer from unofficial email address (@chevron-careers-gulf.com)",
      "Demands fee payment for 'official immigration visa processing'",
      "Suspiciously fast screening and offer letter within 3 hours"
    ],
    fraudScore: 97,
    status: "verified_fraud"
  }
];

export const mockStatistics = {
  totalScans: 28430,
  scamsDetected: 9812,
  flaggedDomains: 1403,
  avgFraudScore: 78.4,
  accuracyRate: 99.6,
  dailyScans: [
    { name: "Mon", scans: 450, threats: 120 },
    { name: "Tue", scans: 610, threats: 180 },
    { name: "Wed", scans: 890, threats: 240 },
    { name: "Thu", scans: 720, threats: 210 },
    { name: "Fri", scans: 980, threats: 310 },
    { name: "Sat", scans: 410, threats: 90 },
    { name: "Sun", scans: 320, threats: 60 }
  ],
  scamCategories: [
    { name: "Equipment Purchase", value: 35, color: "#ec4899" },
    { name: "Identity Harvesting", value: 25, color: "#b026ff" },
    { name: "Visa / Travel Fee", value: 20, color: "#00f2fe" },
    { name: "Fake Task / Unpaid Labor", value: 12, color: "#00ffd0" },
    { name: "Other Phishing", value: 8, color: "#8a99ad" }
  ],
  monthlyThreatTrend: [
    { name: "Jan", threats: 320 },
    { name: "Feb", threats: 410 },
    { name: "Mar", threats: 590 },
    { name: "Apr", threats: 780 },
    { name: "May", threats: 910 }
  ]
};

export const mockNotifications = [
  {
    id: "n1",
    title: "Critical Phishing Alert",
    message: "A new fake visa recruitment scam mimicking 'Shell Global' has been reported.",
    time: "10m ago",
    type: "critical",
    unread: true
  },
  {
    id: "n2",
    title: "Scan Completed",
    message: "Your PDF scan for 'Google Project Manager Offer' was verified as SAFE. Score: 8%.",
    time: "2h ago",
    type: "success",
    unread: true
  },
  {
    id: "n3",
    title: "Domain Flagged",
    message: "Added 'support@meta-onboarding-hr.com' to active warning list.",
    time: "1d ago",
    type: "info",
    unread: false
  }
];

export const mockJobOffers = [
  {
    id: "offer-1",
    title: "Data Operator Offer (Scam)",
    companyName: "GlobalTech Solutions",
    rawText: `Dear Candidate,
We are pleased to offer you a remote role of Data Operator at GlobalTech. Your pay rate will be $45/hour paid weekly. 
Before you start, you will need to purchase an Apple MacBook Pro and a special secure server software from our certified vendor. 
We will send you a check for $3,000 to cover these expenses. You must cash this check immediately and send the funds via Zelle or Bitcoin to the vendor at vendor@globaltech-equipments.com.
Failure to do so in 24 hours will forfeit your job.
Best,
Hiring Manager
GlobalTech Recruitment Team`,
    analyzedResult: {
      score: 95,
      isFake: true,
      category: "Equipment Fee Phishing",
      severity: "critical",
      reasons: [
        "Unrealistic salary rate ($45/hr for basic data entry role).",
        "Demand to purchase equipment through a specific vendor using a check deposit.",
        "Requirement of payment via Zelle or Bitcoin.",
        "Artificial urgency (24 hours deadline to avoid forfeiture)."
      ],
      metadata: {
        emails: ["vendor@globaltech-equipments.com"],
        phoneNumbers: [],
        domains: ["globaltech-equipments.com"],
        urgencyTokens: ["immediately", "24 hours", "forfeit"]
      }
    }
  },
  {
    id: "offer-2",
    title: "Backend Engineer Offer (Genuine)",
    companyName: "Stripe Inc",
    rawText: `Hi Alex,
We are thrilled to offer you the position of Software Engineer (Backend) at Stripe! 
Your annual base salary will be $155,000, plus equity and full healthcare benefits. 
Your manager will be Sarah Chen. You will receive an official onboarding email with details on how to select your company-issued laptop via our internal portal. Stripe will ship this directly to your address, and you do not need to make any payment or deposit.
Please sign and return the attached contract by Friday.
Congratulations and welcome to Stripe!
Best regards,
Stripe Talent Acquisition`,
    analyzedResult: {
      score: 4,
      isFake: false,
      category: "Safe / Genuine Offer",
      severity: "none",
      reasons: [
        "Uses official and transparent onboarding process.",
        "Does not ask for advance payments or vendor transfers.",
        "Clear terms, professional phrasing, and reasonable response timeline."
      ],
      metadata: {
        emails: [],
        phoneNumbers: [],
        domains: ["stripe.com"],
        urgencyTokens: []
      }
    }
  }
];

// Smart Detection utility for identifying scammy elements

export interface DetectedElement {
  type: 'phone' | 'url' | 'logo' | 'email' | 'suspicious_text';
  text: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Phone number patterns (international formats)
const PHONE_PATTERNS = [
  /\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, // US/Canada
  /\+?44[-.\s]?\d{4}[-.\s]?\d{6}/g, // UK
  /\+?91[-.\s]?\d{5}[-.\s]?\d{5}/g, // India
  /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, // International
];

// URL patterns
const URL_PATTERNS = [
  /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g,
  /www\.[^\s<>"{}|\\^`\[\]]+\.[^\s<>"{}|\\^`\[\]]+/g,
];

// Email patterns
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Suspicious keywords often found in scams
const SUSPICIOUS_KEYWORDS = [
  'urgent', 'act now', 'limited time', 'winner', 'congratulations',
  'you have been selected', 'claim now', 'free money', 'bitcoin',
  'cryptocurrency', 'investment opportunity', 'guaranteed returns',
  'risk-free', 'no risk', 'double your money', 'verify your account',
  'suspended account', 'unusual activity', 'security alert',
  'payment required', 'wire transfer', 'gift card', 'bitcoin atm',
  'lottery', 'prize', 'inheritance', 'nigerian', 'western union',
  'moneygram', 'secret shopper', 'work from home', 'easy money'
];

// Logo detection patterns (common scam logos)
const LOGO_KEYWORDS = [
  'paypal', 'amazon', 'google', 'microsoft', 'apple', 'facebook',
  'bank', 'chase', 'wells fargo', 'citibank', 'bank of america',
  'irs', 'fbi', 'cia', 'police', 'government', 'court',
  'ups', 'fedex', 'dhl', 'usps', 'postal service'
];

export function detectPhoneNumbers(text: string): DetectedElement[] {
  const detected: DetectedElement[] = [];
  
  PHONE_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        detected.push({
          type: 'phone',
          text: match,
          confidence: 0.85,
        });
      });
    }
  });
  
  return detected;
}

export function detectURLs(text: string): DetectedElement[] {
  const detected: DetectedElement[] = [];
  
  URL_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        detected.push({
          type: 'url',
          text: match,
          confidence: 0.9,
        });
      });
    }
  });
  
  return detected;
}

export function detectEmails(text: string): DetectedElement[] {
  const detected: DetectedElement[] = [];
  const matches = text.match(EMAIL_PATTERN);
  
  if (matches) {
    matches.forEach(match => {
      detected.push({
        type: 'email',
        text: match,
        confidence: 0.8,
      });
    });
  }
  
  return detected;
}

export function detectSuspiciousText(text: string): DetectedElement[] {
  const detected: DetectedElement[] = [];
  const lowerText = text.toLowerCase();
  
  SUSPICIOUS_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      detected.push({
        type: 'suspicious_text',
        text: keyword,
        confidence: 0.75,
      });
    }
  });
  
  return detected;
}

export function detectLogos(text: string): DetectedElement[] {
  const detected: DetectedElement[] = [];
  const lowerText = text.toLowerCase();
  
  LOGO_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      detected.push({
        type: 'logo',
        text: keyword,
        confidence: 0.7,
      });
    }
  });
  
  return detected;
}

export function analyzeTextForScams(text: string): DetectedElement[] {
  const allDetected: DetectedElement[] = [];
  
  allDetected.push(...detectPhoneNumbers(text));
  allDetected.push(...detectURLs(text));
  allDetected.push(...detectEmails(text));
  allDetected.push(...detectSuspiciousText(text));
  allDetected.push(...detectLogos(text));
  
  // Remove duplicates
  const unique = allDetected.filter((element, index, self) =>
    index === self.findIndex((e) => e.text === element.text && e.type === element.type)
  );
  
  return unique;
}

export function calculateRiskScore(detectedElements: DetectedElement[]): {
  score: number;
  level: 'low' | 'medium' | 'high';
  details: string;
} {
  if (detectedElements.length === 0) {
    return { score: 0, level: 'low', details: 'No suspicious elements detected' };
  }
  
  let score = 0;
  const phoneCount = detectedElements.filter(e => e.type === 'phone').length;
  const urlCount = detectedElements.filter(e => e.type === 'url').length;
  const suspiciousCount = detectedElements.filter(e => e.type === 'suspicious_text').length;
  const logoCount = detectedElements.filter(e => e.type === 'logo').length;
  
  // Score calculation based on detected elements
  score += phoneCount * 15; // Phone numbers are high risk
  score += urlCount * 20; // URLs are very high risk
  score += suspiciousCount * 10; // Suspicious keywords
  score += logoCount * 25; // Fake logos are very high risk
  
  // Cap score at 100
  score = Math.min(score, 100);
  
  let level: 'low' | 'medium' | 'high';
  let details: string;
  
  if (score < 30) {
    level = 'low';
    details = 'Low risk: Few suspicious elements detected';
  } else if (score < 60) {
    level = 'medium';
    details = 'Medium risk: Multiple suspicious elements detected';
  } else {
    level = 'high';
    details = 'High risk: Many suspicious elements detected - likely a scam';
  }
  
  return { score, level, details };
}

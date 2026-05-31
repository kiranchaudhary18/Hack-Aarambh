import json
import re
from typing import Dict, List


class PaymentDetector:
    """Detect payment-related fraud signals"""

    def __init__(self, keywords_path: str = None):
        """Initialize with payment keywords"""
        self.keywords = self._load_keywords(keywords_path)

    def _load_keywords(self, path: str = None) -> Dict:
        """Load keywords configuration"""
        if path is None:
            path = "/home/developer21/Documents/WebDev/HackAarambh/server/src/ai-engine/config/keywords.json"

        try:
            with open(path, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading keywords: {e}")
            return {}

    def detect_payment_demand(self, text: str) -> tuple:
        """Detect if payment is being demanded"""
        payment_keywords = self.keywords.get("payment_keywords", [])

        found_keywords = []
        for keyword in payment_keywords:
            if keyword in text:
                found_keywords.append(keyword)

        return len(found_keywords) > 0, found_keywords

    def extract_amounts(self, text: str) -> List[int]:
        """Extract payment amounts from text"""
        patterns = [
            r"₹\s*(\d{1,3}(?:,\d{3})*|\d+)",
            r"(?:pay|fee|cost|amount)\s*(?:of|:)?\s*(?:₹)?(\d{1,3}(?:,\d{3})*|\d+)",
        ]

        amounts = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                amount = int(match.replace(",", ""))
                amounts.append(amount)

        return list(set(amounts))  # Remove duplicates

    def detect_payment_issues(self, text: str) -> Dict:
        """Analyze payment-related fraud signals"""
        has_demand, keywords = self.detect_payment_demand(text)
        amounts = self.extract_amounts(text)

        return {
            "payment_demand": has_demand,
            "payment_keywords": keywords,
            "amounts_found": amounts,
            "total_amounts": len(amounts),
            "is_suspicious": has_demand and len(amounts) > 0,
        }


# Example usage
if __name__ == "__main__":
    detector = PaymentDetector()
    text = "Register now! Pay ₹500 registration fee to confirm your job"
    result = detector.detect_payment_issues(text)
    print(f"Payment detection: {result}")

import json
from typing import Dict, List
from pathlib import Path


class KeywordDetector:
    """Phase 3: Feature Engineering - Rule-Based Detector"""

    def __init__(self, keywords_path: str = None):
        """Load keywords configuration"""
        self.keywords = self._load_keywords(keywords_path)

    def _load_keywords(self, path: str = None) -> Dict:
        """Load keywords from JSON config"""
        if path is None:
            path = Path(__file__).resolve().parents[1] / "config" / "keywords.json"

        try:
            with open(path, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading keywords: {e}")
            return {}

    def detect_payment_keywords(self, text: str) -> tuple:
        """Detect payment-related keywords"""
        count = 0
        found_keywords = []
        normalized_text = text.lower()

        for keyword in self.keywords.get("payment_keywords", []):
            normalized_keyword = keyword.lower()
            if normalized_keyword in normalized_text:
                count += normalized_text.count(normalized_keyword)
                if keyword not in found_keywords:
                    found_keywords.append(keyword)

        return count > 0, found_keywords

    def detect_urgency_keywords(self, text: str) -> tuple:
        """Detect urgency-related keywords"""
        count = 0
        found_keywords = []
        normalized_text = text.lower()

        for keyword in self.keywords.get("urgency_keywords", []):
            normalized_keyword = keyword.lower()
            if normalized_keyword in normalized_text:
                count += normalized_text.count(normalized_keyword)
                if keyword not in found_keywords:
                    found_keywords.append(keyword)

        return count > 0, found_keywords

    def detect_suspicious_phrases(self, text: str) -> tuple:
        """Detect suspicious job phrases"""
        count = 0
        found_phrases = []
        normalized_text = text.lower()

        for phrase in self.keywords.get("suspicious_phrases", []):
            normalized_phrase = phrase.lower()
            if normalized_phrase in normalized_text:
                count += normalized_text.count(normalized_phrase)
                if phrase not in found_phrases:
                    found_phrases.append(phrase)

        return count > 0, found_phrases

    def get_all_detections(self, text: str) -> Dict:
        """Run all keyword detections"""
        has_payment, payment_kw = self.detect_payment_keywords(text)
        has_urgency, urgency_kw = self.detect_urgency_keywords(text)
        has_suspicious, suspicious_ph = self.detect_suspicious_phrases(text)

        return {
            "payment": has_payment,
            "payment_keywords": payment_kw,
            "urgency": has_urgency,
            "urgency_keywords": urgency_kw,
            "suspicious": has_suspicious,
            "suspicious_phrases": suspicious_ph,
        }


# Example usage
if __name__ == "__main__":
    detector = KeywordDetector()
    text = "urgent job offer pay 500 registration fee work from home"
    result = detector.get_all_detections(text)
    print(f"Detection result: {result}")

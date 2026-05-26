import re
import json
from typing import Dict

class EmailDetector:
    """Detect email domain and assess legitimacy"""
    
    def __init__(self, keywords_path: str = None):
        """Initialize with official domains list"""
        self.keywords = self._load_keywords(keywords_path)
        self.free_email_providers = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'mail.com', 'yandex.com']
    
    def _load_keywords(self, path: str = None) -> Dict:
        """Load keywords configuration"""
        if path is None:
            path = "/home/developer21/Documents/WebDev/HackAarambh/server/src/ai-engine/config/keywords.json"
        
        try:
            with open(path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading keywords: {e}")
            return {}
    
    def extract_email_domain(self, text: str) -> str:
        """Extract email domain from text"""
        email_pattern = r'[\w\.-]+@([\w\.-]+)'
        matches = re.findall(email_pattern, text)
        return matches[0] if matches else None
    
    def is_free_email(self, domain: str) -> bool:
        """Check if email domain is from free provider"""
        return domain.lower() in self.free_email_providers
    
    def is_official_domain(self, domain: str) -> bool:
        """Check if email domain is official (verified company)"""
        official_domains = self.keywords.get('official_domains', [])
        return domain.lower() in official_domains
    
    def detect_email_issues(self, text: str) -> Dict:
        """Analyze email-related fraud signals"""
        domain = self.extract_email_domain(text)
        
        if not domain:
            return {
                "email_found": False,
                "domain": None,
                "is_free_email": False,
                "is_official": False,
                "is_suspicious": False
            }
        
        is_free = self.is_free_email(domain)
        is_official = self.is_official_domain(domain)
        
        return {
            "email_found": True,
            "domain": domain,
            "is_free_email": is_free,
            "is_official": is_official,
            "is_suspicious": is_free and not is_official
        }

# Example usage
if __name__ == "__main__":
    detector = EmailDetector()
    text = "Contact us at recruiter@gmail.com for more details"
    result = detector.detect_email_issues(text)
    print(f"Email detection: {result}")

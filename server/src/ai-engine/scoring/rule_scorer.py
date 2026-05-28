import json
from typing import Dict
from detectors.keyword_detector import KeywordDetector
from detectors.salary_detector import SalaryDetector
from detectors.email_detector import EmailDetector
from detectors.payment_detector import PaymentDetector

class RuleBasedScorer:
    """Phase 6: Rule-Based Scoring Component"""
    
    def __init__(self):
        self.keyword_detector = KeywordDetector()
        self.salary_detector = SalaryDetector()
        self.email_detector = EmailDetector()
        self.payment_detector = PaymentDetector()
        
        # Rule score weights
        self.weights = {
            "payment_demand": 25,
            "unrealistic_salary": 20,
            "free_email": 15,
            "urgency": 15,
            "suspicious_phrases": 10,
            "negative_indicators": 15
        }
    
    def calculate_rule_score(self, text: str) -> Dict:
        """Calculate rule-based score"""
        score = 0
        indicators = []
        
        # Check for payment demand
        payment_result = self.payment_detector.detect_payment_issues(text)
        if payment_result['is_suspicious']:
            score += self.weights['payment_demand']
            indicators.append("Payment demand detected")
        
        # Check for unrealistic salary
        salary_result = self.salary_detector.detect_salary_issues(text)
        if salary_result['is_suspicious']:
            score += self.weights['unrealistic_salary']
            indicators.append("Unrealistic salary for fresher")
        
        # Check for free email domain
        email_result = self.email_detector.detect_email_issues(text)
        if email_result['email_found'] and email_result['is_suspicious']:
            score += self.weights['free_email']
            indicators.append("Unofficial email domain")
        
        # Check for urgency keywords
        keyword_result = self.keyword_detector.get_all_detections(text)
        if keyword_result['urgency']:
            score += self.weights['urgency']
            indicators.append("Urgency pressure detected")
        
        # Check for suspicious phrases
        if keyword_result['suspicious']:
            score += self.weights['suspicious_phrases']
            indicators.append("Suspicious job phrases")
        
        # Check text length (very short messages suspicious)
        if len(text) < 50:
            score += 5
            indicators.append("Unusually short message")
        
        return {
            "rule_score": min(score, 100),  # Cap at 100
            "indicators": indicators,
            "details": {
                "payment": payment_result,
                "salary": salary_result,
                "email": email_result,
                "keywords": keyword_result
            }
        }

# Example usage
if __name__ == "__main__":
    scorer = RuleBasedScorer()
    text = "URGENT: Pay ₹500 registration fee! Get ₹80,000/month job immediately. Contact recruiter@gmail.com"
    result = scorer.calculate_rule_score(text)
    print(f"Rule Score Result:\n{json.dumps(result, indent=2)}")

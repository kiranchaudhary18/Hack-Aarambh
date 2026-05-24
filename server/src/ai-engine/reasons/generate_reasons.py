from typing import List, Dict
from scoring.rule_scorer import RuleBasedScorer

class ReasonsGenerator:
    """Phase 7: Generate explainable reasons for scam verdict"""
    
    def __init__(self):
        self.rule_scorer = RuleBasedScorer()
        
        # Reason mappings
        self.reason_messages = {
            "payment_demand": "Payment request detected (registration/training/deposit fee)",
            "unrealistic_salary": "Unrealistic high salary claim for entry-level position",
            "free_email": "Unofficial email domain (Gmail/Yahoo instead of company domain)",
            "urgency": "Urgency or pressure tactics (urgent, limited time, apply now)",
            "suspicious_phrases": "Suspicious job phrases (work from home, easy money, passive income)",
            "short_message": "Unusually short or cryptic message content",
            "payment_keywords": "Multiple payment-related keywords in text",
            "high_salary_keywords": "Extremely high salary promises"
        }
    
    def generate_reasons(self, text: str) -> List[str]:
        """Generate list of reasons why offer might be fake"""
        reasons = []
        rule_result = self.rule_scorer.calculate_rule_score(text)
        
        # Extract indicators from rule scorer
        indicators = rule_result.get('indicators', [])
        
        # Map indicators to user-friendly reasons
        for indicator in indicators:
            if "Payment" in indicator:
                reasons.append(self.reason_messages['payment_demand'])
            elif "Unrealistic salary" in indicator:
                reasons.append(self.reason_messages['unrealistic_salary'])
            elif "Unofficial email" in indicator:
                reasons.append(self.reason_messages['free_email'])
            elif "Urgency" in indicator:
                reasons.append(self.reason_messages['urgency'])
            elif "Suspicious" in indicator:
                reasons.append(self.reason_messages['suspicious_phrases'])
            elif "short" in indicator:
                reasons.append(self.reason_messages['short_message'])
        
        # Remove duplicates
        reasons = list(set(reasons))
        
        return reasons
    
    def generate_detailed_reasons(self, text: str) -> Dict:
        """Generate detailed reasons with evidence"""
        rule_result = self.rule_scorer.calculate_rule_score(text)
        details = rule_result.get('details', {})
        
        detailed_reasons = []
        
        # Payment details
        payment_info = details.get('payment', {})
        if payment_info.get('is_suspicious'):
            for keyword in payment_info.get('payment_keywords', []):
                detailed_reasons.append({
                    "category": "Payment Demand",
                    "reason": f"Found payment keyword: '{keyword}'",
                    "severity": "high"
                })
            for amount in payment_info.get('amounts_found', []):
                detailed_reasons.append({
                    "category": "Payment Amount",
                    "reason": f"Specific amount found: ₹{amount}",
                    "severity": "high"
                })
        
        # Salary details
        salary_info = details.get('salary', {})
        if salary_info.get('is_suspicious'):
            for salary in salary_info.get('unrealistic_salaries', []):
                detailed_reasons.append({
                    "category": "Unrealistic Salary",
                    "reason": f"Salary of ₹{salary}/month is unrealistic for fresher",
                    "severity": "high"
                })
        
        # Email details
        email_info = details.get('email', {})
        if email_info.get('is_suspicious'):
            detailed_reasons.append({
                "category": "Email Domain",
                "reason": f"Free email domain used: {email_info.get('domain')}",
                "severity": "medium"
            })
        
        # Keyword details
        keyword_info = details.get('keywords', {})
        if keyword_info.get('urgency'):
            detailed_reasons.append({
                "category": "Urgency Tactics",
                "reason": f"Urgency keywords: {', '.join(keyword_info.get('urgency_keywords', []))}",
                "severity": "medium"
            })
        
        if keyword_info.get('suspicious'):
            detailed_reasons.append({
                "category": "Suspicious Phrases",
                "reason": f"Found phrases: {', '.join(keyword_info.get('suspicious_phrases', []))}",
                "severity": "medium"
            })
        
        return detailed_reasons

# Example usage
if __name__ == "__main__":
    generator = ReasonsGenerator()
    
    text = "URGENT! Pay ₹500 registration fee. Get ₹80,000/month job immediately. Contact recruiter@gmail.com"
    
    reasons = generator.generate_reasons(text)
    print(f"Simple Reasons:\n{reasons}\n")
    
    detailed = generator.generate_detailed_reasons(text)
    print(f"Detailed Reasons:\n")
    for r in detailed:
        print(f"  - {r['category']}: {r['reason']} (Severity: {r['severity']})")

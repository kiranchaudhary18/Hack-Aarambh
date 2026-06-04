"""
Phase 4: Advanced Features
Implements advanced NLP features for scam detection
"""

import re
from typing import Dict, List
from features.embedding_extractor import EmbeddingExtractor


class AdvancedFeatureExtractor:
    """Extract advanced features from text"""

    def __init__(self):
        self.embedding_extractor = EmbeddingExtractor()
        
        # Known scam patterns (for similarity matching)
        self.known_scam_patterns = [
            "pay registration fee",
            "urgent job offer",
            "work from home easy money",
            "no experience required high salary",
            "deposit for training",
            "immediate hiring payment"
        ]

    def extract_company_names(self, text: str) -> List[str]:
        """Extract potential company names from text"""
        # Simple heuristic: capitalized words that might be company names
        words = text.split()
        company_names = []
        
        # Look for patterns like "Google", "Microsoft", etc.
        # This is a simplified version - in production, use NER
        known_companies = [
            'google', 'microsoft', 'amazon', 'tcs', 'infosys', 'wipro',
            'accenture', 'cognizant', 'ibm', 'oracle', 'salesforce'
        ]
        
        for word in words:
            clean_word = word.lower().strip('.,!?')
            if clean_word in known_companies:
                company_names.append(clean_word)
        
        return company_names

    def extract_email_domain(self, text: str) -> str:
        """Extract email domain from text"""
        email_pattern = r'[\w\.-]+@([\w\.-]+\.\w+)'
        match = re.search(email_pattern, text)
        if match:
            return match.group(1)
        return None

    def is_official_domain(self, domain: str) -> bool:
        """Check if domain is official company domain"""
        official_domains = [
            'google.com', 'microsoft.com', 'amazon.com', 'tcs.com',
            'infosys.com', 'wipro.com', 'cognizant.com', 'accenture.com'
        ]
        return domain in official_domains if domain else False

    def extract_salary_info(self, text: str) -> Dict:
        """Extract salary information from text"""
        # Look for salary patterns
        salary_patterns = [
            r'₹[\d,]+/month',
            r'₹[\d,]+ per month',
            r'[\d,]+ rupees',
            r'[\d,]+ INR',
            r'₹[\d,]+'
        ]
        
        salaries = []
        for pattern in salary_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            salaries.extend(matches)
        
        return {
            'has_salary': len(salaries) > 0,
            'salary_mentions': salaries,
            'salary_count': len(salaries)
        }

    def extract_urgency_indicators(self, text: str) -> Dict:
        """Extract urgency indicators from text"""
        urgency_words = [
            'urgent', 'immediately', 'asap', 'now', 'today', 'limited time',
            'deadline', 'expire', 'hurry', 'quick', 'fast'
        ]
        
        text_lower = text.lower()
        found = [word for word in urgency_words if word in text_lower]
        
        return {
            'has_urgency': len(found) > 0,
            'urgency_words': found,
            'urgency_count': len(found)
        }

    def extract_payment_indicators(self, text: str) -> Dict:
        """Extract payment indicators from text"""
        payment_words = [
            'pay', 'fee', 'charge', 'deposit', 'registration',
            'investment', 'transfer', 'payment', 'upi', 'bank'
        ]
        
        text_lower = text.lower()
        found = [word for word in payment_words if word in text_lower]
        
        return {
            'has_payment': len(found) > 0,
            'payment_words': found,
            'payment_count': len(found)
        }

    def compute_scam_similarity(self, text: str) -> float:
        """Compute similarity with known scam patterns"""
        if not self.embedding_extractor.is_available():
            return 0.0

        similarities = []
        for pattern in self.known_scam_patterns:
            sim = self.embedding_extractor.compute_similarity(text, pattern)
            similarities.append(sim)

        # Return maximum similarity
        return max(similarities) if similarities else 0.0

    def extract_all_features(self, text: str) -> Dict:
        """Extract all advanced features from text"""
        company_names = self.extract_company_names(text)
        email_domain = self.extract_email_domain(text)
        salary_info = self.extract_salary_info(text)
        urgency_info = self.extract_urgency_indicators(text)
        payment_info = self.extract_payment_indicators(text)
        scam_similarity = self.compute_scam_similarity(text)

        return {
            'company_names': company_names,
            'has_company': len(company_names) > 0,
            'email_domain': email_domain,
            'is_official_domain': self.is_official_domain(email_domain) if email_domain else False,
            'salary_info': salary_info,
            'urgency_info': urgency_info,
            'payment_info': payment_info,
            'scam_similarity': scam_similarity,
            'advanced_risk_score': self._compute_advanced_risk_score(
                salary_info, urgency_info, payment_info, scam_similarity
            )
        }

    def _compute_advanced_risk_score(self, salary_info, urgency_info, 
                                    payment_info, scam_similarity) -> float:
        """Compute advanced risk score based on features"""
        score = 0.0

        # Payment indicators (high weight)
        if payment_info['has_payment']:
            score += 0.3

        # Urgency indicators (medium weight)
        if urgency_info['has_urgency']:
            score += 0.2

        # Scam similarity (high weight)
        score += scam_similarity * 0.3

        # Salary mentions (low weight)
        if salary_info['has_salary']:
            score += 0.1

        # Multiple salary mentions (suspicious)
        if salary_info['salary_count'] > 1:
            score += 0.1

        return min(score, 1.0)  # Cap at 1.0


# Example usage
if __name__ == "__main__":
    extractor = AdvancedFeatureExtractor()

    test_texts = [
        "URGENT! Pay ₹500 registration fee and get ₹80,000/month job",
        "Google is hiring Software Engineers. Visit careers.google.com",
        "Work from home data entry job ₹40,000/month easy money"
    ]

    print("="*80)
    print("ADVANCED FEATURE EXTRACTOR TEST")
    print("="*80)

    for i, text in enumerate(test_texts, 1):
        print(f"\nTest Case {i}:")
        print(f"Text: {text[:60]}...")
        features = extractor.extract_all_features(text)
        print(f"Features:\n{features}")

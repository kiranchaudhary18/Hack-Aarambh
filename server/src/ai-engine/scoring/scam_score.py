import json
from typing import Dict
from scoring.rule_scorer import RuleBasedScorer
from training.train_model import ModelTrainer

class HybridScorer:
    """Phase 6: Hybrid Scoring System combining ML + Rules"""
    
    def __init__(self):
        self.rule_scorer = RuleBasedScorer()
        self.ml_trainer = ModelTrainer()
        
        # Load pre-trained ML model
        self.ml_trainer.load_model()
        
        # Score weights
        self.ml_weight = 0.6
        self.rule_weight = 0.4
    
    def get_ml_score(self, text: str) -> float:
        """Get ML model prediction score (0-1)"""
        try:
            prob = self.ml_trainer.predict_proba(text)
            return prob * 100  # Convert to 0-100 scale
        except Exception as e:
            print(f"ML scoring error: {e}")
            return 50  # Default to neutral score
    
    def get_rule_score(self, text: str) -> float:
        """Get rule-based score (0-100)"""
        result = self.rule_scorer.calculate_rule_score(text)
        return result['rule_score']
    
    def calculate_hybrid_score(self, text: str) -> Dict:
        """Calculate final hybrid score"""
        ml_score = self.get_ml_score(text)
        rule_score = self.get_rule_score(text)
        
        # Combine scores
        final_score = (ml_score * self.ml_weight) + (rule_score * self.rule_weight)
        final_score = min(100, max(0, final_score))  # Clamp between 0-100
        
        # Determine verdict
        if final_score >= 70:
            verdict = "Likely Scam"
        elif final_score >= 50:
            verdict = "Suspicious"
        else:
            verdict = "Likely Real"
        
        return {
            "final_score": round(final_score, 2),
            "verdict": verdict,
            "ml_score": round(ml_score, 2),
            "rule_score": round(rule_score, 2),
            "ml_weight": self.ml_weight,
            "rule_weight": self.rule_weight
        }

# Example usage
if __name__ == "__main__":
    scorer = HybridScorer()
    
    test_texts = [
        "URGENT! Pay ₹500 registration fee and get ₹80,000/month job",
        "Google is hiring Software Engineers via careers.google.com",
        "Work from home data entry ₹40,000/month"
    ]
    
    for text in test_texts:
        result = scorer.calculate_hybrid_score(text)
        print(f"Text: {text[:50]}...")
        print(f"Result: {json.dumps(result, indent=2)}\n")

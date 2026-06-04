import json
from typing import Dict
from training.preprocess import TextPreprocessor
from scoring.scam_score import HybridScorer
from reasons.generate_reasons import ReasonsGenerator

class PredictionEngine:
    """Phase 8-10: Complete AI Prediction Pipeline"""

    def __init__(self):
        self.preprocessor = TextPreprocessor()
        self.scorer = HybridScorer()
        self.reasons_generator = ReasonsGenerator()

    def predict(self, text: str) -> Dict:
        """
        Complete prediction pipeline:
        Input text → Preprocess → Score → Generate reasons → Return result
        """
        # Step 1: Validate input
        if not text or len(text.strip()) == 0:
            return {
                "error": "Empty input",
                "scam_score": 0,
                "verdict": "Invalid",
                "reasons": ["No text provided for analysis"]
            }

        # Step 2: Normalize only for input sanity; scoring keeps raw evidence for rules.
        self.preprocessor.preprocess_pipeline(text)

        # Step 3: Get hybrid score. The ML model preprocesses internally, while
        # rule detectors need the original text to preserve emails, URLs and symbols.
        score_result = self.scorer.calculate_hybrid_score(text)

        # Step 4: Generate reasons
        reasons = self.reasons_generator.generate_reasons(text)
        detailed_reasons = self.reasons_generator.generate_detailed_reasons(text)

        # Step 5: Determine is_fake
        is_fake = score_result['verdict'] != "Likely Real"

        # Step 6: Build response
        response = {
            "success": True,
            "input_length": len(text),
            "is_fake": is_fake,
            "scam_score": score_result['final_score'],
            "verdict": score_result['verdict'],
            "reasons": reasons,
            "detailed_reasons": detailed_reasons,
            "scoring_breakdown": {
                "ml_score": score_result['ml_score'],
                "rule_score": score_result['rule_score'],
                "ml_weight": score_result['ml_weight'],
                "rule_weight": score_result['rule_weight'],
                "model_used": score_result.get('model_used', 'logistic_regression')
            },
            "confidence": "high" if score_result['final_score'] > 80 or score_result['final_score'] < 20 else "medium"
        }

        return response

# Example usage
if __name__ == "__main__":
    engine = PredictionEngine()

    test_cases = [
        "URGENT! Pay ₹500 registration fee and get ₹80,000/month job",
        "Google is hiring Software Engineers. Visit careers.google.com",
        "Work from home data entry job ₹40,000/month easy money"
    ]

    print("="*80)
    print("FAKE JOB OFFER DETECTOR - COMPLETE PIPELINE TEST")
    print("="*80)

    for i, text in enumerate(test_cases, 1):
        print(f"\nTest Case {i}:")
        print(f"Input: {text[:60]}...")
        result = engine.predict(text)
        print(f"Output:\n{json.dumps(result, indent=2)}\n")

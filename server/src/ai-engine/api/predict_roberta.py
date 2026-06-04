"""
Phase 2.5: RoBERTa-Only Prediction API
API endpoint that uses only RoBERTa model for predictions (no hybrid scoring)
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
from typing import Dict
from training.preprocess import TextPreprocessor
from scoring.roberta_scorer import RoBERTaScorer
from reasons.generate_reasons import ReasonsGenerator


class RoBERTaPredictionEngine:
    """RoBERTa-only prediction pipeline"""

    def __init__(self):
        self.preprocessor = TextPreprocessor()
        self.roberta_scorer = RoBERTaScorer()
        self.reasons_generator = ReasonsGenerator()

    def predict(self, text: str) -> Dict:
        """
        RoBERTa-only prediction pipeline:
        Input text → Preprocess → RoBERTa prediction → Generate reasons → Return result
        """
        # Step 1: Validate input
        if not text or len(text.strip()) == 0:
            return {
                "error": "Empty input",
                "scam_score": 0,
                "verdict": "Invalid",
                "reasons": ["No text provided for analysis"]
            }

        # Step 2: Normalize for the model only; rule explanations keep raw evidence.
        cleaned_text = self.preprocessor.preprocess_pipeline(text)

        # Step 3: Get RoBERTa prediction
        roberta_result = self.roberta_scorer.predict(cleaned_text)

        # Step 4: Generate reasons
        reasons = self.reasons_generator.generate_reasons(text)
        detailed_reasons = self.reasons_generator.generate_detailed_reasons(text)

        # Step 5: Determine verdict and score
        predicted_class = roberta_result['predicted_class']
        fake_probability = roberta_result['probabilities']['fake']
        scam_score = fake_probability * 100  # Convert to 0-100 scale

        if scam_score >= 70:
            verdict = "Likely Scam"
        elif scam_score >= 50:
            verdict = "Suspicious"
        else:
            verdict = "Likely Real"

        # Step 6: Build response
        response = {
            "success": True,
            "input_length": len(text),
            "is_fake": predicted_class == 1,
            "scam_score": round(scam_score, 2),
            "verdict": verdict,
            "reasons": reasons,
            "detailed_reasons": detailed_reasons,
            "model_info": {
                "model_used": roberta_result['model_used'],
                "confidence": round(roberta_result['confidence'], 2),
                "probabilities": {
                    "real": round(roberta_result['probabilities']['real'], 4),
                    "fake": round(roberta_result['probabilities']['fake'], 4)
                }
            },
            "confidence_level": "high" if roberta_result['confidence'] > 0.8 else "medium"
        }

        return response


# Example usage
if __name__ == "__main__":
    engine = RoBERTaPredictionEngine()

    test_cases = [
        "URGENT! Pay ₹500 registration fee and get ₹80,000/month job",
        "Google is hiring Software Engineers. Visit careers.google.com",
        "Work from home data entry job ₹40,000/month easy money"
    ]

    print("="*80)
    print("FAKE JOB OFFER DETECTOR - RoBERTa ONLY")
    print("="*80)

    for i, text in enumerate(test_cases, 1):
        print(f"\nTest Case {i}:")
        print(f"Input: {text[:60]}...")
        result = engine.predict(text)
        print(f"Output:\n{json.dumps(result, indent=2)}\n")

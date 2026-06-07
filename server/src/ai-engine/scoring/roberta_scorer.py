"""
Phase 2.4: RoBERTa Scorer Integration
Integrates RoBERTa model with the hybrid scoring system
"""

import os
import sys
import torch
from typing import Dict, Optional
from transformers import RobertaTokenizer, RobertaForSequenceClassification


class RoBERTaScorer:
    """RoBERTa-based ML scorer for scam detection"""
    
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path or os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "models",
            "roberta_scam_classifier"
        )
        self.tokenizer = None
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._load_model()
    
    def _load_model(self):
        """Load fine-tuned RoBERTa model"""
        if os.path.exists(self.model_path):
            try:
                # Use stderr for logging to avoid interfering with JSON output
                print(f"Loading RoBERTa model from {self.model_path}", file=sys.stderr)
                self.tokenizer = RobertaTokenizer.from_pretrained(self.model_path)
                self.model = RobertaForSequenceClassification.from_pretrained(self.model_path)
                self.model.to(self.device)
                self.model.eval()
                print("RoBERTa model loaded successfully", file=sys.stderr)
            except Exception as e:
                print(f"Error loading RoBERTa model: {e}", file=sys.stderr)
                print("Falling back to rule-based scoring only", file=sys.stderr)
        else:
            print(f"RoBERTa model not found at {self.model_path}", file=sys.stderr)
            print("Using Logistic Regression fallback in hybrid scoring", file=sys.stderr)
    
    def is_available(self) -> bool:
        """Check if RoBERTa model is available"""
        return self.model is not None and self.tokenizer is not None
    
    def predict_proba(self, text: str) -> float:
        """
        Get scam probability from RoBERTa model
        Returns probability of being fake (0-1)
        """
        if not self.is_available():
            return 0.5  # Neutral score if model not available
        
        try:
            # Tokenize
            inputs = self.tokenizer(
                text,
                truncation=True,
                padding="max_length",
                max_length=512,
                return_tensors="pt"
            ).to(self.device)
            
            # Predict
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                probabilities = torch.softmax(logits, dim=1)
            
            # Return probability of being fake (class 1)
            fake_probability = probabilities[0][1].item()
            return fake_probability
            
        except Exception as e:
            print(f"Error in RoBERTa prediction: {e}", file=sys.stderr)
            return 0.5  # Neutral score on error
    
    def predict(self, text: str) -> Dict:
        """
        Get full prediction from RoBERTa model
        Returns dict with predicted class, confidence, and probabilities
        """
        if not self.is_available():
            return {
                "predicted_class": 0,
                "confidence": 0.5,
                "probabilities": {"real": 0.5, "fake": 0.5},
                "model_used": "fallback"
            }
        
        try:
            # Tokenize
            inputs = self.tokenizer(
                text,
                truncation=True,
                padding="max_length",
                max_length=512,
                return_tensors="pt"
            ).to(self.device)
            
            # Predict
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                probabilities = torch.softmax(logits, dim=1)
            
            # Get prediction
            predicted_class = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][predicted_class].item()
            
            return {
                "predicted_class": predicted_class,  # 0 = Real, 1 = Fake
                "confidence": confidence,
                "probabilities": {
                    "real": probabilities[0][0].item(),
                    "fake": probabilities[0][1].item()
                },
                "model_used": "roberta"
            }
            
        except Exception as e:
            print(f"Error in RoBERTa prediction: {e}", file=sys.stderr)
            return {
                "predicted_class": 0,
                "confidence": 0.5,
                "probabilities": {"real": 0.5, "fake": 0.5},
                "model_used": "fallback"
            }


# Example usage
if __name__ == "__main__":
    scorer = RoBERTaScorer()
    
    test_texts = [
        "URGENT! Pay ₹500 registration fee and get ₹80,000/month job",
        "Google is hiring Software Engineers via careers.google.com",
        "Work from home data entry ₹40,000/month",
    ]
    
    for text in test_texts:
        result = scorer.predict(text)
        print(f"Text: {text[:50]}...")
        print(f"Prediction: {result}\n")

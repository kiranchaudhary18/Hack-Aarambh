#!/usr/bin/env python3
"""
Text Analysis Inference Script
Loads trained text_analysis.pt model and performs scam detection
"""

import torch
import numpy as np
import os
import sys
from transformers import DistilBertTokenizer

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from training.utils import load_model, get_device


class TextInference:
    """Text analysis inference engine"""
    
    def __init__(self, model_path=None, use_cpu=False):
        """
        Initialize text inference engine
        
        Args:
            model_path: Path to text_analysis.pt model file
            use_cpu: Force CPU inference
        """
        self.device = get_device(use_cpu=use_cpu)
        
        # Default model path
        if model_path is None:
            model_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                'models', 'text_analysis.pt'
            )
        
        print(f"Loading text model from {model_path}...")
        
        # Load checkpoint with CPU fallback for OOM
        try:
            checkpoint = torch.load(model_path, map_location=self.device, weights_only=False)
        except torch.cuda.OutOfMemoryError:
            print("GPU OOM, falling back to CPU")
            self.device = torch.device('cpu')
            checkpoint = torch.load(model_path, map_location=self.device, weights_only=False)
        
        # Initialize tokenizer
        self.tokenizer = checkpoint['tokenizer']

        # Initialize model
        from transformers import DistilBertForSequenceClassification
        self.model = DistilBertForSequenceClassification(checkpoint['config'])
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model.to(self.device)
        self.model.eval()
        
        print("Text model loaded successfully")
    
    def preprocess(self, text, max_length=512):
        """
        Preprocess text for model input
        
        Args:
            text: Input text string
            max_length: Maximum sequence length
        
        Returns:
            dict: Tokenized input
        """
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=max_length,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].to(self.device),
            'attention_mask': encoding['attention_mask'].to(self.device)
        }
    
    def predict(self, text, return_probabilities=False):
        """
        Predict scam probability for given text
        
        Args:
            text: Input text string
            return_probabilities: Return raw probabilities
        
        Returns:
            dict: Prediction results
        """
        # Preprocess
        inputs = self.preprocess(text)
        
        # Inference
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=-1)
        
        # Get predictions
        scam_prob = probabilities[0][1].item()
        legit_prob = probabilities[0][0].item()
        predicted_class = torch.argmax(probabilities, dim=-1)[0].item()
        
        # Calculate confidence
        confidence = max(scam_prob, legit_prob)
        
        result = {
            'is_scam': predicted_class == 1,
            'scam_probability': scam_prob,
            'legitimate_probability': legit_prob,
            'confidence': confidence,
            'predicted_class': predicted_class
        }
        
        if return_probabilities:
            result['probabilities'] = probabilities.cpu().numpy()[0]
        
        return result
    
    def batch_predict(self, texts):
        """
        Predict scam probabilities for multiple texts
        
        Args:
            texts: List of text strings
        
        Returns:
            list: Prediction results for each text
        """
        results = []
        for text in texts:
            result = self.predict(text)
            results.append(result)
        
        return results


def main():
    """Test inference with sample texts"""
    
    print("=" * 50)
    print("Text Analysis Inference Test")
    print("=" * 50)
    
    # Initialize inference engine
    inference = TextInference()
    
    # Test texts
    scam_text = "Congratulations! You have been selected for a high-paying position. Pay ₹5000 registration fee immediately to secure your spot."
    legit_text = "Thank you for applying to Google. We have received your application for Software Engineer position. Our team will review your profile and get back to you within 2 weeks."
    
    print("\n--- Scam Text Test ---")
    print(f"Input: {scam_text}")
    result = inference.predict(scam_text)
    print(f"Prediction: {'SCAM' if result['is_scam'] else 'LEGITIMATE'}")
    print(f"Scam Probability: {result['scam_probability']:.4f}")
    print(f"Confidence: {result['confidence']:.4f}")
    
    print("\n--- Legitimate Text Test ---")
    print(f"Input: {legit_text}")
    result = inference.predict(legit_text)
    print(f"Prediction: {'SCAM' if result['is_scam'] else 'LEGITIMATE'}")
    print(f"Scam Probability: {result['scam_probability']:.4f}")
    print(f"Confidence: {result['confidence']:.4f}")


if __name__ == "__main__":
    main()

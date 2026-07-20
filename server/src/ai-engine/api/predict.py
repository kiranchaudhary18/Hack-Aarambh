#!/usr/bin/env python3
"""
Mark-2 AI Model Prediction API
Main API endpoint for NestJS integration
"""

import sys
import os
import json
import argparse
from io import BytesIO
from PIL import Image

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from inference.mark2_router import Mark2Router


class Mark2PredictionAPI:
    """Main prediction API for Mark-2 system"""
    
    def __init__(self, model_dir=None, use_cpu=False):
        """
        Initialize prediction API
        
        Args:
            model_dir: Directory containing model files
            use_cpu: Force CPU inference
        """
        self.router = Mark2Router(model_dir=model_dir, use_cpu=use_cpu)
        print("Mark-2 Prediction API initialized")
    
    def predict_text(self, text):
        """
        Analyze text for scam detection
        
        Args:
            text: Input text string
        
        Returns:
            dict: Formatted prediction result
        """
        try:
            result = self.router.analyze(text=text, document=None)
            formatted = self.router.format_result(result)
            
            # Add scam reasons based on analysis
            reasons = self._generate_reasons(result, text_only=True)
            formatted['reasons'] = reasons
            
            return {
                'success': True,
                'result': formatted
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def predict_document(self, image_buffer):
        """
        Analyze document image for scam detection
        
        Args:
            image_buffer: Image buffer (bytes)
        
        Returns:
            dict: Formatted prediction result
        """
        try:
            # Convert buffer to PIL Image
            image = Image.open(BytesIO(image_buffer)).convert('RGB')
            
            # For document-only analysis, use generic text
            generic_text = "Document analysis request"
            result = self.router.analyze(text=generic_text, document=image)
            formatted = self.router.format_result(result)
            
            # Add scam reasons
            reasons = self._generate_reasons(result, doc_only=True)
            formatted['reasons'] = reasons
            
            return {
                'success': True,
                'result': formatted
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def predict_combined(self, text, image_buffer):
        """
        Analyze both text and document with Mark-2 routing
        
        Args:
            text: Input text string
            image_buffer: Image buffer (bytes)
        
        Returns:
            dict: Formatted prediction result
        """
        try:
            # Convert buffer to PIL Image
            image = Image.open(BytesIO(image_buffer)).convert('RGB')
            
            result = self.router.analyze(text=text, document=image)
            formatted = self.router.format_result(result)
            
            # Add scam reasons
            reasons = self._generate_reasons(result, combined=True)
            formatted['reasons'] = reasons
            
            return {
                'success': True,
                'result': formatted
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _generate_reasons(self, result, text_only=False, doc_only=False, combined=False):
        """
        Generate human-readable reasons for scam detection
        
        Args:
            result: Analysis result from router
            text_only: Text-only analysis
            doc_only: Document-only analysis
            combined: Combined analysis
        
        Returns:
            list: List of reason strings
        """
        reasons = []
        
        # Score-based reasons
        score = result['final_score']
        
        if score >= 0.8:
            reasons.append("High scam probability detected")
        elif score >= 0.6:
            reasons.append("Moderate scam indicators found")
        elif score >= 0.4:
            reasons.append("Some suspicious patterns detected")
        
        # Text-specific reasons
        if text_only or combined:
            text_result = result.get('text_analysis', {})
            text_score = text_result.get('scam_probability', 0)
            
            if text_score >= 0.7:
                reasons.append("Text contains scam patterns")
            
            # Add keyword-based reasons (simplified)
            if text_only:
                reasons.append("Text analysis completed")
        
        # Document-specific reasons
        if doc_only or combined:
            doc_result = result.get('document_analysis', {})
            doc_score = doc_result.get('scam_probability', 0)
            
            if doc_score >= 0.7:
                reasons.append("Document shows scam indicators")
            
            if doc_only:
                reasons.append("Document analysis completed")
        
        # Routing decision reason
        if combined:
            routing = result.get('routing_decision', '')
            if 'text_only' in routing:
                reasons.append("High confidence in text analysis")
            elif 'doc_only' in routing:
                reasons.append("High confidence in document analysis")
            elif 'mark2_neural' in routing:
                reasons.append("Mark-2 neural network routing")
            else:
                reasons.append("Combined weighted analysis")
        
        # Confidence-based reasons
        confidence = result.get('confidence', 0)
        if confidence >= 0.8:
            reasons.append("High confidence prediction")
        elif confidence >= 0.6:
            reasons.append("Moderate confidence prediction")
        else:
            reasons.append("Low confidence - manual review recommended")
        
        return reasons if reasons else ["Analysis completed"]


def main():
    """CLI interface for testing"""
    parser = argparse.ArgumentParser(description='Mark-2 Prediction API')
    parser.add_argument('--text', type=str, help='Text to analyze')
    parser.add_argument('--image', type=str, help='Image path to analyze')
    parser.add_argument('--cpu', action='store_true', help='Use CPU inference')
    
    args = parser.parse_args()
    
    # Initialize API
    api = Mark2PredictionAPI(use_cpu=args.cpu)
    
    if args.text and args.image:
        # Combined analysis
        with open(args.image, 'rb') as f:
            image_buffer = f.read()
        result = api.predict_combined(args.text, image_buffer)
    elif args.text:
        # Text only
        result = api.predict_text(args.text)
    elif args.image:
        # Document only
        with open(args.image, 'rb') as f:
            image_buffer = f.read()
        result = api.predict_document(image_buffer)
    else:
        # Test with sample
        sample_text = "Congratulations! You have been selected for a high-paying position. Pay ₹5000 registration fee immediately."
        result = api.predict_text(sample_text)
    
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()

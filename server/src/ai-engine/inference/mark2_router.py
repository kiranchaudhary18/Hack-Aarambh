#!/usr/bin/env python3
"""
Mark-2 Router Inference Script
Coordinates between text and document analysis models using routing logic
"""

import torch
import numpy as np
import os
import sys
import json

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from training.utils import get_device
from inference.text_inference import TextInference
from inference.doc_inference import DocumentInference


class Mark2Router:
    """Mark-2 routing coordinator for scam detection"""
    
    def __init__(self, model_dir=None, use_cpu=False):
        """
        Initialize Mark-2 router with all models
        
        Args:
            model_dir: Directory containing model files
            use_cpu: Force CPU inference
        """
        self.device = get_device(use_cpu=use_cpu)
        
        # Default model directory
        if model_dir is None:
            model_dir = os.path.join(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                'models'
            )
        
        print("Initializing Mark-2 Router...")
        
        # Load text analysis model
        print("Loading text analysis model...")
        self.text_inference = TextInference(
            model_path=os.path.join(model_dir, 'text_analysis.pt'),
            use_cpu=use_cpu
        )
        
        # Load document analysis model
        print("Loading document analysis model...")
        self.doc_inference = DocumentInference(
            model_path=os.path.join(model_dir, 'doc_analysis.pt'),
            use_cpu=use_cpu
        )
        
        # Load Mark-2 routing model
        print("Loading Mark-2 routing model...")
        mark2_path = os.path.join(model_dir, 'Mark_2.pt')
        if os.path.exists(mark2_path):
            checkpoint = torch.load(mark2_path, map_location=self.device)
            self.routing_config = checkpoint.get('routing_logic', {
                'text_threshold': 0.8,
                'doc_threshold': 0.8
            })
            
            # Load routing neural network
            from training.train_mark2 import Mark2Router as Mark2NN
            self.mark2_model = Mark2NN(
                input_size=4,
                hidden_size=checkpoint['model_config']['hidden_size'],
                num_classes=2
            )
            self.mark2_model.load_state_dict(checkpoint['model_state_dict'])
            self.mark2_model.to(self.device)
            self.mark2_model.eval()
            self.has_mark2_model = True
        else:
            print("Mark-2 model not found, using rule-based routing")
            self.routing_config = {
                'text_threshold': 0.8,
                'doc_threshold': 0.8
            }
            self.has_mark2_model = False
        
        # Load routing configuration
        config_path = os.path.join(model_dir, 'Mark_2_config.json')
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                config = json.load(f)
                self.routing_config.update(config)
        
        print("Mark-2 Router initialized successfully")
    
    def route_text_only(self, text):
        """
        Analyze text only (no document provided)
        
        Args:
            text: Input text string
        
        Returns:
            dict: Analysis results
        """
        text_result = self.text_inference.predict(text)
        
        return {
            'routing_decision': 'text_only',
            'final_score': text_result['scam_probability'],
            'confidence': text_result['confidence'],
            'is_scam': text_result['is_scam'],
            'text_analysis': text_result,
            'reason': 'Text analysis only (no document provided)'
        }
    
    def route_with_document(self, text, document):
        """
        Analyze both text and document with routing logic
        
        Args:
            text: Input text string
            document: PIL Image or image path or buffer
        
        Returns:
            dict: Analysis results with routing decision
        """
        # Get predictions from both models
        text_result = self.text_inference.predict(text)
        doc_result = self.doc_inference.predict(document)
        
        text_score = text_result['scam_probability']
        text_confidence = text_result['confidence']
        doc_score = doc_result['scam_probability']
        doc_confidence = doc_result['confidence']
        
        # Apply routing logic
        result = self._apply_routing_logic(
            text_score, text_confidence, doc_score, doc_confidence
        )
        
        result['text_analysis'] = text_result
        result['document_analysis'] = doc_result
        
        return result
    
    def _apply_routing_logic(self, text_score, text_confidence, doc_score, doc_confidence):
        """
        Apply Mark-2 routing logic to determine final decision
        
        Args:
            text_score: Scam probability from text model
            text_confidence: Confidence from text model
            doc_score: Scam probability from document model
            doc_confidence: Confidence from document model
        
        Returns:
            dict: Routing decision and final score
        """
        text_threshold = self.routing_config.get('text_threshold', 0.8)
        doc_threshold = self.routing_config.get('doc_threshold', 0.8)
        
        result = {
            'routing_decision': None,
            'final_score': None,
            'confidence': None,
            'is_scam': None,
            'reason': None
        }
        
        # High confidence in text analysis
        if text_confidence >= text_threshold:
            result['routing_decision'] = 'text_only'
            result['final_score'] = text_score
            result['confidence'] = text_confidence
            result['is_scam'] = text_score >= 0.5
            result['reason'] = 'High confidence in text analysis'
        
        # High confidence in document analysis
        elif doc_confidence >= doc_threshold:
            result['routing_decision'] = 'doc_only'
            result['final_score'] = doc_score
            result['confidence'] = doc_confidence
            result['is_scam'] = doc_score >= 0.5
            result['reason'] = 'High confidence in document analysis'
        
        # Use Mark-2 neural network if available
        elif self.has_mark2_model:
            result['routing_decision'] = 'mark2_neural'
            
            # Prepare features for Mark-2 model
            features = torch.FloatTensor([
                [text_score, text_confidence, doc_score, doc_confidence]
            ]).to(self.device)
            
            with torch.no_grad():
                outputs = self.mark2_model(features)
                probabilities = torch.softmax(outputs, dim=-1)
                mark2_score = probabilities[0][1].item()
            
            result['final_score'] = mark2_score
            result['confidence'] = max(text_confidence, doc_confidence)
            result['is_scam'] = mark2_score >= 0.5
            result['reason'] = 'Mark-2 neural network routing'
        
        # Combined weighted average
        else:
            result['routing_decision'] = 'combined_weighted'
            
            # Weighted average based on confidence
            total_confidence = text_confidence + doc_confidence
            if total_confidence > 0:
                result['final_score'] = (
                    (text_score * text_confidence + doc_score * doc_confidence) / 
                    total_confidence
                )
            else:
                result['final_score'] = (text_score + doc_score) / 2
            
            result['confidence'] = max(text_confidence, doc_confidence)
            result['is_scam'] = result['final_score'] >= 0.5
            result['reason'] = 'Combined weighted average'
        
        return result
    
    def analyze(self, text, document=None):
        """
        Main analysis method with automatic routing
        
        Args:
            text: Input text string
            document: Optional PIL Image, image path, or buffer
        
        Returns:
            dict: Complete analysis results
        """
        if document is None:
            return self.route_text_only(text)
        else:
            return self.route_with_document(text, document)
    
    def format_result(self, result):
        """
        Format result for API response
        
        Args:
            result: Raw analysis result
        
        Returns:
            dict: Formatted result
        """
        return {
            'is_fake': result['is_scam'],
            'score': int(result['final_score'] * 100),
            'confidence': int(result['confidence'] * 100),
            'routing_decision': result['routing_decision'],
            'reason': result['reason'],
            'text_scam_probability': result.get('text_analysis', {}).get('scam_probability', 0),
            'doc_scam_probability': result.get('document_analysis', {}).get('scam_probability', 0),
        }


def main():
    """Test Mark-2 router with sample inputs"""
    
    print("=" * 50)
    print("Mark-2 Router Test")
    print("=" * 50)
    
    # Initialize router
    router = Mark2Router()
    
    # Test text only
    scam_text = "Congratulations! You have been selected for a high-paying position. Pay ₹5000 registration fee immediately."
    print("\n--- Text Only Test (Scam) ---")
    result = router.analyze(scam_text)
    formatted = router.format_result(result)
    print(f"Routing Decision: {formatted['routing_decision']}")
    print(f"Is Scam: {formatted['is_fake']}")
    print(f"Score: {formatted['score']}/100")
    print(f"Reason: {formatted['reason']}")
    
    legit_text = "Thank you for applying to Google. We have received your application for Software Engineer position."
    print("\n--- Text Only Test (Legitimate) ---")
    result = router.analyze(legit_text)
    formatted = router.format_result(result)
    print(f"Routing Decision: {formatted['routing_decision']}")
    print(f"Is Scam: {formatted['is_fake']}")
    print(f"Score: {formatted['score']}/100")
    print(f"Reason: {formatted['reason']}")
    
    # Test with document (if available)
    data_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
        'datasets', 'doc_data', 'images'
    )
    
    scam_doc_path = os.path.join(data_dir, 'scam', 'scam_doc_0.png')
    if os.path.exists(scam_doc_path):
        print("\n--- Text + Document Test (Scam) ---")
        result = router.analyze(scam_text, scam_doc_path)
        formatted = router.format_result(result)
        print(f"Routing Decision: {formatted['routing_decision']}")
        print(f"Is Scam: {formatted['is_fake']}")
        print(f"Score: {formatted['score']}/100")
        print(f"Text Probability: {formatted['text_scam_probability']:.4f}")
        print(f"Doc Probability: {formatted['doc_scam_probability']:.4f}")
        print(f"Reason: {formatted['reason']}")


if __name__ == "__main__":
    main()

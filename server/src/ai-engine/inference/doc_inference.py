#!/usr/bin/env python3
"""
Document Analysis Inference Script
Loads trained doc_analysis.pt model and performs scam detection on images/PDFs
"""

import torch
import numpy as np
import os
import sys
from PIL import Image
from transformers import ViTImageProcessor

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from training.utils import load_model, get_device


class DocumentInference:
    """Document analysis inference engine"""
    
    def __init__(self, model_path=None, use_cpu=False):
        """
        Initialize document inference engine
        
        Args:
            model_path: Path to doc_analysis.pt model file
            use_cpu: Force CPU inference
        """
        self.device = get_device(use_cpu=use_cpu)
        
        # Default model path
        if model_path is None:
            model_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                'models', 'doc_analysis.pt'
            )
        
        print(f"Loading document model from {model_path}...")

        # Load checkpoint with CPU fallback for OOM
        try:
            checkpoint = torch.load(model_path, map_location=self.device, weights_only=False)
        except torch.cuda.OutOfMemoryError:
            print("GPU OOM, falling back to CPU")
            self.device = torch.device('cpu')
            checkpoint = torch.load(model_path, map_location=self.device, weights_only=False)

        # Initialize image processor
        self.image_processor = checkpoint['tokenizer']

        # Initialize model
        from transformers import ViTForImageClassification
        self.model = ViTForImageClassification(checkpoint['config'])
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model.to(self.device)
        self.model.eval()
        
        print("Document model loaded successfully")
    
    def preprocess(self, image, image_size=224):
        """
        Preprocess image for model input
        
        Args:
            image: PIL Image or image path
            image_size: Target image size
        
        Returns:
            dict: Processed image tensor
        """
        # Load image if path is provided
        if isinstance(image, str):
            image = Image.open(image).convert('RGB')
        elif not isinstance(image, Image.Image):
            raise ValueError("Input must be PIL Image or image path")
        
        # Resize image
        image = image.resize((image_size, image_size))
        
        # Feature extraction
        inputs = self.image_processor(images=image, return_tensors="pt")
        
        return {
            'pixel_values': inputs['pixel_values'].to(self.device)
        }
    
    def predict(self, image, return_probabilities=False):
        """
        Predict scam probability for given document image
        
        Args:
            image: PIL Image or image path
            return_probabilities: Return raw probabilities
        
        Returns:
            dict: Prediction results
        """
        # Preprocess
        inputs = self.preprocess(image)
        
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
    
    def predict_from_buffer(self, image_buffer, return_probabilities=False):
        """
        Predict scam probability from image buffer
        
        Args:
            image_buffer: Image buffer (bytes)
            return_probabilities: Return raw probabilities
        
        Returns:
            dict: Prediction results
        """
        from io import BytesIO
        image = Image.open(BytesIO(image_buffer)).convert('RGB')
        return self.predict(image, return_probabilities)


def main():
    """Test inference with sample document images"""
    
    print("=" * 50)
    print("Document Analysis Inference Test")
    print("=" * 50)
    
    # Initialize inference engine
    inference = DocumentInference()
    
    # Test with synthetic document images
    data_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
        'datasets', 'doc_data', 'images'
    )
    
    scam_image_path = os.path.join(data_dir, 'scam', 'scam_doc_0.png')
    legit_image_path = os.path.join(data_dir, 'legit', 'legit_doc_0.png')
    
    if os.path.exists(scam_image_path):
        print("\n--- Scam Document Test ---")
        print(f"Input: {scam_image_path}")
        result = inference.predict(scam_image_path)
        print(f"Prediction: {'SCAM' if result['is_scam'] else 'LEGITIMATE'}")
        print(f"Scam Probability: {result['scam_probability']:.4f}")
        print(f"Confidence: {result['confidence']:.4f}")
    else:
        print(f"Scam test image not found at {scam_image_path}")
    
    if os.path.exists(legit_image_path):
        print("\n--- Legitimate Document Test ---")
        print(f"Input: {legit_image_path}")
        result = inference.predict(legit_image_path)
        print(f"Prediction: {'SCAM' if result['is_scam'] else 'LEGITIMATE'}")
        print(f"Scam Probability: {result['scam_probability']:.4f}")
        print(f"Confidence: {result['confidence']:.4f}")
    else:
        print(f"Legitimate test image not found at {legit_image_path}")


if __name__ == "__main__":
    main()

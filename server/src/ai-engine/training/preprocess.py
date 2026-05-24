import re
import string
from typing import List

class TextPreprocessor:
    """Phase 2: Input Processing Pipeline - Text Cleaning"""
    
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Clean and preprocess text:
        - lowercase
        - remove special characters
        - remove extra spaces
        - handle unicode
        """
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove punctuation but keep some context
        text = re.sub(r'[^\w\s₹]', ' ', text)
        
        # Remove extra spaces again
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    @staticmethod
    def tokenize(text: str) -> List[str]:
        """Split text into tokens (words)"""
        return text.split()
    
    @staticmethod
    def preprocess_pipeline(text: str) -> str:
        """Complete preprocessing pipeline"""
        cleaned = TextPreprocessor.clean_text(text)
        return cleaned

# Example usage
if __name__ == "__main__":
    test_text = "URGENT JOB OFFER!!! Earn 80,000/month Pay ₹500 registration"
    preprocessor = TextPreprocessor()
    cleaned = preprocessor.preprocess_pipeline(test_text)
    print(f"Original: {test_text}")
    print(f"Cleaned: {cleaned}")
    print(f"Tokens: {preprocessor.tokenize(cleaned)}")

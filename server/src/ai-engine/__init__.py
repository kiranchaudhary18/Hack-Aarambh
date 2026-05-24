"""
AI Engine Package Initializer
Complete fake job offer detection pipeline
"""

from training.train_model import ModelTrainer
from training.preprocess import TextPreprocessor
from detectors.keyword_detector import KeywordDetector
from detectors.salary_detector import SalaryDetector
from detectors.email_detector import EmailDetector
from detectors.payment_detector import PaymentDetector
from scoring.rule_scorer import RuleBasedScorer
from scoring.scam_score import HybridScorer
from reasons.generate_reasons import ReasonsGenerator
from api.predict import PredictionEngine

__all__ = [
    'ModelTrainer',
    'TextPreprocessor',
    'KeywordDetector',
    'SalaryDetector',
    'EmailDetector',
    'PaymentDetector',
    'RuleBasedScorer',
    'HybridScorer',
    'ReasonsGenerator',
    'PredictionEngine'
]

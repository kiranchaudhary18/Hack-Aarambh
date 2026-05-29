"""
AI Engine Package Initializer
Complete fake job offer detection pipeline
"""

from api.predict import PredictionEngine
from detectors.email_detector import EmailDetector
from detectors.keyword_detector import KeywordDetector
from detectors.payment_detector import PaymentDetector
from detectors.salary_detector import SalaryDetector
from reasons.generate_reasons import ReasonsGenerator
from scoring.rule_scorer import RuleBasedScorer
from scoring.scam_score import HybridScorer
from training.preprocess import TextPreprocessor
from training.train_model import ModelTrainer

__all__ = [
    "ModelTrainer",
    "TextPreprocessor",
    "KeywordDetector",
    "SalaryDetector",
    "EmailDetector",
    "PaymentDetector",
    "RuleBasedScorer",
    "HybridScorer",
    "ReasonsGenerator",
    "PredictionEngine",
]

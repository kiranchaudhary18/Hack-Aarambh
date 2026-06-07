"""
AI Engine Package Initializer
Complete fake job offer detection pipeline - Level 2 (Production Ready)
"""

from api.predict import PredictionEngine
from api.predict_hybrid_v2 import PredictionEngineV2
from api.predict_roberta import RoBERTaPredictionEngine
from detectors.email_detector import EmailDetector
from detectors.keyword_detector import KeywordDetector
from detectors.payment_detector import PaymentDetector
from detectors.salary_detector import SalaryDetector
from reasons.generate_reasons import ReasonsGenerator
from scoring.rule_scorer import RuleBasedScorer
from scoring.scam_score import HybridScorer
from scoring.roberta_scorer import RoBERTaScorer
from training.preprocess import TextPreprocessor
from training.train_model import ModelTrainer
from training.cross_validate import CrossValidator
from training.evaluate_model import ModelEvaluator
from training.hyperparameter_tune import HyperparameterTuner
from features.embedding_extractor import EmbeddingExtractor
from features.advanced_features import AdvancedFeatureExtractor
from explainability.shap_explainer import SHAPExplainer
from monitoring.prediction_logger import PredictionLogger
from monitoring.continuous_learning import ContinuousLearningPipeline

__all__ = [
    "ModelTrainer",
    "TextPreprocessor",
    "KeywordDetector",
    "SalaryDetector",
    "EmailDetector",
    "PaymentDetector",
    "RuleBasedScorer",
    "HybridScorer",
    "RoBERTaScorer",
    "ReasonsGenerator",
    "PredictionEngine",
    "PredictionEngineV2",
    "RoBERTaPredictionEngine",
    "CrossValidator",
    "ModelEvaluator",
    "HyperparameterTuner",
    "EmbeddingExtractor",
    "AdvancedFeatureExtractor",
    "SHAPExplainer",
    "PredictionLogger",
    "ContinuousLearningPipeline",
]

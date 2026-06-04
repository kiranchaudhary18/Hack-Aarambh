"""
Phase 6: SHAP Explainability
Implements SHAP values for model interpretation and explainability
"""

import numpy as np
from typing import Dict, List
import shap
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pandas as pd
import os


class SHAPExplainer:
    """SHAP-based model explainer for scam detection"""

    def __init__(self, model, vectorizer, feature_names=None):
        self.model = model
        self.vectorizer = vectorizer
        self.feature_names = feature_names or vectorizer.get_feature_names_out()
        self.explainer = None
        self._initialize_explainer()

    def _initialize_explainer(self):
        """Initialize SHAP explainer"""
        try:
            # Use LinearExplainer for Logistic Regression
            self.explainer = shap.LinearExplainer(self.model, self.vectorizer.transform([""]))
            print("SHAP explainer initialized successfully")
        except Exception as e:
            print(f"Error initializing SHAP explainer: {e}")
            print("SHAP explanations will be unavailable")

    def is_available(self) -> bool:
        """Check if SHAP explainer is available"""
        return self.explainer is not None

    def explain_prediction(self, text: str) -> Dict:
        """Generate SHAP explanation for a single prediction"""
        if not self.is_available():
            return {
                'error': 'SHAP explainer not available',
                'feature_importance': [],
                'top_features': []
            }

        try:
            # Vectorize text
            text_vectorized = self.vectorizer.transform([text])

            # Get SHAP values
            shap_values = self.explainer.shap_values(text_vectorized)

            # Get feature importance
            feature_importance = []
            for i, feature_name in enumerate(self.feature_names):
                importance = shap_values[0][i]
                feature_importance.append({
                    'feature': feature_name,
                    'importance': float(importance),
                    'abs_importance': abs(float(importance))
                })

            # Sort by absolute importance
            feature_importance.sort(key=lambda x: x['abs_importance'], reverse=True)

            # Get top features
            top_features = feature_importance[:10]

            return {
                'feature_importance': feature_importance,
                'top_features': top_features,
                'base_value': float(self.explainer.expected_value),
                'prediction': float(self.model.predict(text_vectorized)[0])
            }

        except Exception as e:
            print(f"Error generating SHAP explanation: {e}")
            return {
                'error': str(e),
                'feature_importance': [],
                'top_features': []
            }

    def explain_batch(self, texts: List[str]) -> List[Dict]:
        """Generate SHAP explanations for multiple texts"""
        explanations = []
        for text in texts:
            explanation = self.explain_prediction(text)
            explanations.append(explanation)
        return explanations

    def get_feature_importance_summary(self, texts: List[str]) -> Dict:
        """Get summary of feature importance across multiple texts"""
        if not self.is_available():
            return {'error': 'SHAP explainer not available'}

        try:
            explanations = self.explain_batch(texts)

            # Aggregate feature importance
            feature_scores = {}
            for explanation in explanations:
                if 'feature_importance' in explanation:
                    for feature in explanation['feature_importance']:
                        feature_name = feature['feature']
                        importance = feature['abs_importance']
                        if feature_name not in feature_scores:
                            feature_scores[feature_name] = []
                        feature_scores[feature_name].append(importance)

            # Calculate average importance
            avg_importance = {}
            for feature_name, scores in feature_scores.items():
                avg_importance[feature_name] = np.mean(scores)

            # Sort by average importance
            sorted_features = sorted(avg_importance.items(), key=lambda x: x[1], reverse=True)

            return {
                'top_features': [
                    {'feature': name, 'avg_importance': float(score)}
                    for name, score in sorted_features[:20]
                ],
                'total_features': len(sorted_features)
            }

        except Exception as e:
            print(f"Error generating feature importance summary: {e}")
            return {'error': str(e)}


class FeatureImportanceAnalyzer:
    """Analyze feature importance without SHAP (fallback method)"""

    def __init__(self, model, vectorizer):
        self.model = model
        self.vectorizer = vectorizer
        self.feature_names = vectorizer.get_feature_names_out()

    def get_coefficient_importance(self) -> List[Dict]:
        """Get feature importance from model coefficients"""
        try:
            # Get coefficients
            coefficients = self.model.coef_[0]

            # Create feature importance list
            feature_importance = []
            for i, feature_name in enumerate(self.feature_names):
                importance = coefficients[i]
                feature_importance.append({
                    'feature': feature_name,
                    'importance': float(importance),
                    'abs_importance': abs(float(importance))
                })

            # Sort by absolute importance
            feature_importance.sort(key=lambda x: x['abs_importance'], reverse=True)

            return feature_importance

        except Exception as e:
            print(f"Error getting coefficient importance: {e}")
            return []

    def get_top_features(self, n: int = 20) -> Dict:
        """Get top N important features"""
        feature_importance = self.get_coefficient_importance()

        top_positive = [f for f in feature_importance if f['importance'] > 0][:n]
        top_negative = [f for f in feature_importance if f['importance'] < 0][:n]

        return {
            'top_positive_features': top_positive,
            'top_negative_features': top_negative,
            'summary': {
                'total_features': len(feature_importance),
                'top_positive_count': len(top_positive),
                'top_negative_count': len(top_negative)
            }
        }


# Example usage
if __name__ == "__main__":
    print("="*80)
    print("PHASE 6: SHAP EXPLAINABILITY")
    print("="*80)

    # This would require a trained model and vectorizer
    # For demonstration, we'll show the structure
    print("\nSHAP Explainer requires a trained model and vectorizer.")
    print("Use this module after training the model.")
    print("\nExample usage:")
    print("  explainer = SHAPExplainer(model, vectorizer)")
    print("  explanation = explainer.explain_prediction('Your text here')")
    print("  print(explanation)")

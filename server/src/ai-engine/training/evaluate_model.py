"""
Phase 3.2: Advanced Model Evaluation
Adds ROC-AUC curves, confusion matrix visualization, and detailed metrics
"""

import sys
import os
from pathlib import Path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, roc_auc_score, roc_curve, auc,
    classification_report
)
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import seaborn as sns
from training.preprocess import TextPreprocessor


class ModelEvaluator:
    """Advanced model evaluation with ROC-AUC and confusion matrix"""

    def __init__(self, dataset_path: str = None):
        self.base_dir = Path(__file__).resolve().parents[1]
        self.dataset_path = dataset_path or self.base_dir / "datasets" / "expanded_fake_jobs.csv"
        self.preprocessor = TextPreprocessor()
        self.output_dir = self.base_dir / "datasets"
        os.makedirs(self.output_dir, exist_ok=True)

    def load_dataset(self):
        """Load dataset"""
        df = pd.read_csv(self.dataset_path)
        df = df.dropna(subset=['text', 'label'])
        print(f"Loaded {len(df)} samples")
        return df

    def prepare_data(self, df):
        """Prepare data for evaluation"""
        df["text_clean"] = df["text"].apply(self.preprocessor.preprocess_pipeline)
        X = df["text_clean"].values
        y = df["label"].values
        return X, y

    def train_model(self, X_train, y_train):
        """Train model on training data"""
        vectorizer = TfidfVectorizer(
            max_features=4000,
            ngram_range=(1, 3),
            sublinear_tf=True,
            strip_accents="unicode",
        )
        X_train_vec = vectorizer.fit_transform(X_train)
        
        model = LogisticRegression(max_iter=2000, random_state=42, class_weight="balanced", C=2.0)
        model.fit(X_train_vec, y_train)
        
        return model, vectorizer

    def evaluate(self, model, vectorizer, X_test, y_test):
        """Evaluate model with advanced metrics"""
        X_test_vec = vectorizer.transform(X_test)
        y_pred = model.predict(X_test_vec)
        y_proba = model.predict_proba(X_test_vec)[:, 1]
        
        # Calculate metrics
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_proba)
        
        print("\n=== Model Evaluation Metrics ===")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall: {recall:.4f}")
        print(f"F1-Score: {f1:.4f}")
        print(f"ROC-AUC: {roc_auc:.4f}")
        
        # Classification report
        print("\n=== Classification Report ===")
        print(classification_report(y_test, y_pred, target_names=['Real', 'Fake']))
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1': f1,
            'roc_auc': roc_auc,
            'y_pred': y_pred,
            'y_proba': y_proba,
            'y_test': y_test
        }

    def plot_confusion_matrix(self, y_test, y_pred):
        """Plot confusion matrix"""
        cm = confusion_matrix(y_test, y_pred)
        
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                   xticklabels=['Real', 'Fake'],
                   yticklabels=['Real', 'Fake'])
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.tight_layout()
        
        output_path = os.path.join(self.output_dir, 'confusion_matrix.png')
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        print(f"Confusion matrix saved to {output_path}")
        plt.close()

    def plot_roc_curve(self, y_test, y_proba):
        """Plot ROC curve"""
        fpr, tpr, thresholds = roc_curve(y_test, y_proba)
        roc_auc = auc(fpr, tpr)
        
        plt.figure(figsize=(8, 6))
        plt.plot(fpr, tpr, color='darkorange', lw=2, 
                label=f'ROC curve (AUC = {roc_auc:.4f})')
        plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.title('Receiver Operating Characteristic (ROC) Curve')
        plt.legend(loc="lower right")
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        output_path = os.path.join(self.output_dir, 'roc_curve.png')
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        print(f"ROC curve saved to {output_path}")
        plt.close()

    def save_metrics(self, metrics):
        """Save evaluation metrics to JSON"""
        metrics_to_save = {
            'accuracy': float(metrics['accuracy']),
            'precision': float(metrics['precision']),
            'recall': float(metrics['recall']),
            'f1': float(metrics['f1']),
            'roc_auc': float(metrics['roc_auc'])
        }
        
        output_path = os.path.join(self.output_dir, 'evaluation_metrics.json')
        import json
        with open(output_path, 'w') as f:
            json.dump(metrics_to_save, f, indent=2)
        print(f"Metrics saved to {output_path}")


def main():
    """Main execution function"""
    print("="*80)
    print("PHASE 3.2: ADVANCED MODEL EVALUATION")
    print("="*80)
    
    evaluator = ModelEvaluator()
    
    # Load dataset
    df = evaluator.load_dataset()
    
    # Prepare data
    X, y = evaluator.prepare_data(df)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train model
    print("\n=== Training Model ===")
    model, vectorizer = evaluator.train_model(X_train, y_train)
    
    # Evaluate
    metrics = evaluator.evaluate(model, vectorizer, X_test, y_test)
    
    # Plot confusion matrix
    print("\n=== Generating Confusion Matrix ===")
    evaluator.plot_confusion_matrix(metrics['y_test'], metrics['y_pred'])
    
    # Plot ROC curve
    print("\n=== Generating ROC Curve ===")
    evaluator.plot_roc_curve(metrics['y_test'], metrics['y_proba'])
    
    # Save metrics
    evaluator.save_metrics(metrics)
    
    print("\n" + "="*80)
    print("PHASE 3.2 COMPLETE")
    print("="*80)


if __name__ == "__main__":
    main()

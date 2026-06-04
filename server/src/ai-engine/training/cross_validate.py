"""
Phase 3.1: 5-Fold Cross-Validation
Implements stratified k-fold cross-validation for model evaluation
"""

import sys
import os
from pathlib import Path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
import json
from training.preprocess import TextPreprocessor


class CrossValidator:
    """5-Fold Stratified Cross-Validation for model evaluation"""

    def __init__(self, dataset_path: str = None):
        self.base_dir = Path(__file__).resolve().parents[1]
        self.dataset_path = dataset_path or self.base_dir / "datasets" / "expanded_fake_jobs.csv"
        self.preprocessor = TextPreprocessor()
        self.n_splits = 5
        self.random_state = 42

    def load_dataset(self):
        """Load dataset"""
        df = pd.read_csv(self.dataset_path)
        df = df.dropna(subset=['text', 'label'])
        print(f"Loaded {len(df)} samples")
        return df

    def prepare_data(self, df):
        """Prepare data for cross-validation"""
        # Clean text
        df["text_clean"] = df["text"].apply(self.preprocessor.preprocess_pipeline)
        X = df["text_clean"].values
        y = df["label"].values
        return X, y

    def cross_validate(self, X, y):
        """Perform 5-fold stratified cross-validation"""
        print("\n=== 5-Fold Stratified Cross-Validation ===")
        
        skf = StratifiedKFold(n_splits=self.n_splits, shuffle=True, random_state=self.random_state)
        
        results = {
            'fold_accuracies': [],
            'fold_precisions': [],
            'fold_recalls': [],
            'fold_f1_scores': [],
            'fold_reports': []
        }
        
        for fold, (train_idx, val_idx) in enumerate(skf.split(X, y), 1):
            print(f"\n--- Fold {fold}/{self.n_splits} ---")
            
            X_train, X_val = X[train_idx], X[val_idx]
            y_train, y_val = y[train_idx], y[val_idx]
            
            # Vectorize
            vectorizer = TfidfVectorizer(
                max_features=4000,
                ngram_range=(1, 3),
                sublinear_tf=True,
                strip_accents="unicode",
            )
            X_train_vec = vectorizer.fit_transform(X_train)
            X_val_vec = vectorizer.transform(X_val)
            
            # Train model
            model = LogisticRegression(
                max_iter=2000,
                random_state=self.random_state,
                class_weight="balanced",
                C=2.0,
            )
            model.fit(X_train_vec, y_train)
            
            # Predict
            y_pred = model.predict(X_val_vec)
            
            # Calculate metrics
            accuracy = accuracy_score(y_val, y_pred)
            precision = precision_score(y_val, y_pred)
            recall = recall_score(y_val, y_pred)
            f1 = f1_score(y_val, y_pred)
            
            print(f"Accuracy: {accuracy:.4f}")
            print(f"Precision: {precision:.4f}")
            print(f"Recall: {recall:.4f}")
            print(f"F1-Score: {f1:.4f}")
            
            # Store results
            results['fold_accuracies'].append(accuracy)
            results['fold_precisions'].append(precision)
            results['fold_recalls'].append(recall)
            results['fold_f1_scores'].append(f1)
            
            # Classification report
            report = classification_report(y_val, y_pred, output_dict=True)
            results['fold_reports'].append(report)
        
        return results

    def summarize_results(self, results):
        """Summarize cross-validation results"""
        print("\n=== Cross-Validation Summary ===")
        
        metrics = {
            'accuracy': results['fold_accuracies'],
            'precision': results['fold_precisions'],
            'recall': results['fold_recalls'],
            'f1_score': results['fold_f1_scores']
        }
        
        for metric_name, values in metrics.items():
            mean = np.mean(values)
            std = np.std(values)
            print(f"{metric_name.capitalize()}: {mean:.4f} (+/- {std:.4f})")
        
        summary = {
            'n_splits': self.n_splits,
            'mean_accuracy': float(np.mean(results['fold_accuracies'])),
            'std_accuracy': float(np.std(results['fold_accuracies'])),
            'mean_precision': float(np.mean(results['fold_precisions'])),
            'std_precision': float(np.std(results['fold_precisions'])),
            'mean_recall': float(np.mean(results['fold_recalls'])),
            'std_recall': float(np.std(results['fold_recalls'])),
            'mean_f1': float(np.mean(results['fold_f1_scores'])),
            'std_f1': float(np.std(results['fold_f1_scores'])),
            'fold_results': results
        }
        
        return summary

    def save_results(self, summary):
        """Save cross-validation results"""
        output_path = self.base_dir / "datasets" / "cross_validation_results.json"
        with open(output_path, 'w') as f:
            json.dump(summary, f, indent=2)
        print(f"\nResults saved to {output_path}")


def main():
    """Main execution function"""
    print("="*80)
    print("PHASE 3.1: 5-FOLD CROSS-VALIDATION")
    print("="*80)
    
    validator = CrossValidator()
    
    # Load dataset
    df = validator.load_dataset()
    
    # Prepare data
    X, y = validator.prepare_data(df)
    
    # Perform cross-validation
    results = validator.cross_validate(X, y)
    
    # Summarize results
    summary = validator.summarize_results(results)
    
    # Save results
    validator.save_results(summary)
    
    print("\n" + "="*80)
    print("PHASE 3.1 COMPLETE")
    print("="*80)


if __name__ == "__main__":
    main()

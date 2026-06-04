"""
Phase 5: Hyperparameter Tuning
Implements grid search and random search for hyperparameter optimization
"""

import sys
import os
from pathlib import Path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import json
from training.preprocess import TextPreprocessor


class HyperparameterTuner:
    """Hyperparameter tuning for Logistic Regression model"""

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
        """Prepare data for tuning"""
        df["text_clean"] = df["text"].apply(self.preprocessor.preprocess_pipeline)
        X = df["text_clean"].values
        y = df["label"].values
        return X, y

    def grid_search(self, X_train, y_train):
        """Perform grid search for hyperparameter tuning"""
        print("\n=== Grid Search ===")
        
        # Define parameter grid
        param_grid = {
            'C': [0.1, 1.0, 10.0, 100.0],
            'penalty': ['l1', 'l2'],
            'solver': ['liblinear', 'saga'],
            'max_iter': [1000, 2000]
        }

        # Create model
        model = LogisticRegression(random_state=42)

        # Grid search
        grid_search = GridSearchCV(
            estimator=model,
            param_grid=param_grid,
            cv=5,
            scoring='f1',
            n_jobs=-1,
            verbose=1
        )

        grid_search.fit(X_train, y_train)

        print(f"\nBest parameters: {grid_search.best_params_}")
        print(f"Best F1 score: {grid_search.best_score_:.4f}")

        return grid_search.best_estimator_, grid_search.best_params_

    def random_search(self, X_train, y_train, n_iter=50):
        """Perform random search for hyperparameter tuning"""
        print("\n=== Random Search ===")
        
        # Define parameter distributions
        param_distributions = {
            'C': [0.01, 0.1, 1.0, 10.0, 100.0, 1000.0],
            'penalty': ['l1', 'l2'],
            'solver': ['liblinear', 'saga'],
            'max_iter': [500, 1000, 2000, 5000]
        }

        # Create model
        model = LogisticRegression(random_state=42)

        # Random search
        random_search = RandomizedSearchCV(
            estimator=model,
            param_distributions=param_distributions,
            n_iter=n_iter,
            cv=5,
            scoring='f1',
            n_jobs=-1,
            verbose=1,
            random_state=42
        )

        random_search.fit(X_train, y_train)

        print(f"\nBest parameters: {random_search.best_params_}")
        print(f"Best F1 score: {random_search.best_score_:.4f}")

        return random_search.best_estimator_, random_search.best_params_

    def evaluate_model(self, model, X_test, y_test):
        """Evaluate model performance"""
        y_pred = model.predict(X_test)
        
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        
        print(f"\n=== Model Performance ===")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall: {recall:.4f}")
        print(f"F1-Score: {f1:.4f}")
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1': f1
        }

    def tune_tfidf_params(self, X, y):
        """Tune TF-IDF parameters"""
        print("\n=== TF-IDF Parameter Tuning ===")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Define TF-IDF parameter grid
        tfidf_param_grid = {
            'max_features': [50, 100, 200, 500],
            'ngram_range': [(1, 1), (1, 2), (1, 3)],
            'min_df': [1, 2, 3],
            'max_df': [0.8, 0.9, 1.0]
        }

        best_score = 0
        best_params = None
        best_vectorizer = None

        for max_feat in tfidf_param_grid['max_features']:
            for ngram in tfidf_param_grid['ngram_range']:
                for min_df in tfidf_param_grid['min_df']:
                    for max_df in tfidf_param_grid['max_df']:
                        try:
                            vectorizer = TfidfVectorizer(
                                max_features=max_feat,
                                ngram_range=ngram,
                                min_df=min_df,
                                max_df=max_df
                            )
                            X_train_vec = vectorizer.fit_transform(X_train)
                            X_test_vec = vectorizer.transform(X_test)
                            
                            model = LogisticRegression(max_iter=1000, random_state=42)
                            model.fit(X_train_vec, y_train)
                            y_pred = model.predict(X_test_vec)
                            score = f1_score(y_test, y_pred)
                            
                            if score > best_score:
                                best_score = score
                                best_params = {
                                    'max_features': max_feat,
                                    'ngram_range': ngram,
                                    'min_df': min_df,
                                    'max_df': max_df
                                }
                                best_vectorizer = vectorizer
                        except Exception as e:
                            continue

        print(f"Best TF-IDF parameters: {best_params}")
        print(f"Best F1 score: {best_score:.4f}")

        return best_params, best_score

    def save_results(self, results):
        """Save tuning results"""
        output_path = os.path.join(self.output_dir, 'hyperparameter_tuning_results.json')
        with open(output_path, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\nResults saved to {output_path}")


def main():
    """Main execution function"""
    print("="*80)
    print("PHASE 5: HYPERPARAMETER TUNING")
    print("="*80)
    
    tuner = HyperparameterTuner()
    
    # Load dataset
    df = tuner.load_dataset()
    
    # Prepare data
    X, y = tuner.prepare_data(df)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Vectorize
    vectorizer = TfidfVectorizer(max_features=100, ngram_range=(1, 2))
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # Grid search
    best_model_grid, best_params_grid = tuner.grid_search(X_train_vec, y_train)
    grid_metrics = tuner.evaluate_model(best_model_grid, X_test_vec, y_test)
    
    # Random search
    best_model_random, best_params_random = tuner.random_search(X_train_vec, y_train)
    random_metrics = tuner.evaluate_model(best_model_random, X_test_vec, y_test)
    
    # TF-IDF tuning
    best_tfidf_params, best_tfidf_score = tuner.tune_tfidf_params(X, y)
    
    # Save results
    results = {
        'grid_search': {
            'best_params': best_params_grid,
            'metrics': grid_metrics
        },
        'random_search': {
            'best_params': best_params_random,
            'metrics': random_metrics
        },
        'tfidf_tuning': {
            'best_params': best_tfidf_params,
            'best_score': best_tfidf_score
        }
    }
    tuner.save_results(results)
    
    print("\n" + "="*80)
    print("PHASE 5 COMPLETE")
    print("="*80)


if __name__ == "__main__":
    main()

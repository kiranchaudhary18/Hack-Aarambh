import os
import pickle

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from training.preprocess import TextPreprocessor


class ModelTrainer:
    """Phase 4: Model Training"""

    def __init__(self, dataset_path: str = None):
        self.dataset_path = (
            dataset_path
            or "/home/developer21/Documents/WebDev/HackAarambh/server/src/ai-engine/datasets/fake_jobs.csv"
        )
        self.model = None
        self.vectorizer = None
        self.preprocessor = TextPreprocessor()
        self.models_dir = (
            "/home/developer21/Documents/WebDev/HackAarambh/server/src/ai-engine/models"
        )

    def load_dataset(self):
        """Load training dataset"""
        try:
            df = pd.read_csv(self.dataset_path)
            print(f"Loaded {len(df)} samples")
            return df
        except Exception as e:
            print(f"Error loading dataset: {e}")
            return None

    def prepare_data(self, df):
        """Prepare data for training"""
        # Clean text
        df["text_clean"] = df["text"].apply(self.preprocessor.preprocess_pipeline)

        X = df["text_clean"].values
        y = df["label"].values

        return X, y

    def train(self):
        """Train the ML model"""
        print("Step 1: Loading dataset...")
        df = self.load_dataset()
        if df is None:
            return False

        print("Step 2: Preparing data...")
        X, y = self.prepare_data(df)

        print("Step 3: Splitting data...")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        print("Step 4: Vectorizing text (TF-IDF)...")
        self.vectorizer = TfidfVectorizer(max_features=100, ngram_range=(1, 2))
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)

        print("Step 5: Training Logistic Regression model...")
        self.model = LogisticRegression(max_iter=1000, random_state=42)
        self.model.fit(X_train_vec, y_train)

        print("Step 6: Evaluating model...")
        train_score = self.model.score(X_train_vec, y_train)
        test_score = self.model.score(X_test_vec, y_test)

        y_pred = self.model.predict(X_test_vec)

        print(f"\nTrain Accuracy: {train_score:.4f}")
        print(f"Test Accuracy: {test_score:.4f}")
        print(f"\nClassification Report:\n{classification_report(y_test, y_pred)}")
        print(f"\nConfusion Matrix:\n{confusion_matrix(y_test, y_pred)}")

        return True

    def save_model(self):
        """Save trained model and vectorizer"""
        if self.model is None or self.vectorizer is None:
            print("Model not trained yet!")
            return False

        os.makedirs(self.models_dir, exist_ok=True)

        model_path = os.path.join(self.models_dir, "scam_classifier.pkl")
        vectorizer_path = os.path.join(self.models_dir, "vectorizer.pkl")

        with open(model_path, "wb") as f:
            pickle.dump(self.model, f)

        with open(vectorizer_path, "wb") as f:
            pickle.dump(self.vectorizer, f)

        print(f"Model saved to {model_path}")
        print(f"Vectorizer saved to {vectorizer_path}")
        return True

    def load_model(self):
        """Load trained model and vectorizer"""
        model_path = os.path.join(self.models_dir, "scam_classifier.pkl")
        vectorizer_path = os.path.join(self.models_dir, "vectorizer.pkl")

        try:
            with open(model_path, "rb") as f:
                self.model = pickle.load(f)

            with open(vectorizer_path, "rb") as f:
                self.vectorizer = pickle.load(f)

            print("Model loaded successfully")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

    def predict_proba(self, text: str) -> float:
        """Predict scam probability"""
        if self.model is None or self.vectorizer is None:
            self.load_model()

        cleaned_text = self.preprocessor.preprocess_pipeline(text)
        vectorized = self.vectorizer.transform([cleaned_text])
        proba = self.model.predict_proba(vectorized)[0]

        return proba[1]  # Return probability of being fake (class 1)


# Example usage
if __name__ == "__main__":
    trainer = ModelTrainer()

    # Train model
    if trainer.train():
        # Save model
        trainer.save_model()

        # Test prediction
        test_text = "URGENT! Pay ₹500 registration fee and get ₹80,000/month job"
        prob = trainer.predict_proba(test_text)
        print(f"\nPrediction for test text: {prob:.4f}")

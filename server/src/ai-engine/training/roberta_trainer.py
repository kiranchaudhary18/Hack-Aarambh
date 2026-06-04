"""
Phase 2.2: RoBERTa Model Trainer
Fine-tunes roberta-base for fake job offer detection
"""

import os
import torch
import pandas as pd
import numpy as np
from pathlib import Path
from transformers import (
    RobertaTokenizer, 
    RobertaForSequenceClassification,
    Trainer,
    TrainingArguments,
    DataCollatorWithPadding
)
from datasets import Dataset
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report
import json


class RoBERTaTrainer:
    """Fine-tune RoBERTa for scam detection"""
    
    def __init__(self, model_name: str = "roberta-base"):
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {self.device}")
        
        self.base_dir = Path(__file__).resolve().parents[1]
        self.models_dir = self.base_dir / "models"
        self.data_dir = self.base_dir / "datasets"
        
    def load_tokenizer_and_model(self):
        """Load pre-trained RoBERTa tokenizer and model"""
        print(f"\nLoading {self.model_name}...")
        self.tokenizer = RobertaTokenizer.from_pretrained(self.model_name)
        self.model = RobertaForSequenceClassification.from_pretrained(
            self.model_name, 
            num_labels=2
        )
        self.model.to(self.device)
        print("Model loaded successfully")
    
    def load_data(self, split: str = "train") -> Dataset:
        """Load data from CSV and convert to Dataset"""
        csv_path = os.path.join(self.data_dir, f"{split}.csv")
        df = pd.read_csv(csv_path)
        
        # Ensure we have text and label columns
        df = df[['text', 'label']].dropna()
        
        # Convert to HuggingFace Dataset
        dataset = Dataset.from_pandas(df)
        print(f"Loaded {len(dataset)} samples from {split}.csv")
        return dataset
    
    def tokenize_function(self, examples):
        """Tokenize text for RoBERTa"""
        return self.tokenizer(
            examples["text"],
            truncation=True,
            padding="max_length",
            max_length=512,
            return_tensors=None
        )
    
    def prepare_datasets(self):
        """Load and tokenize train/val/test datasets"""
        print("\n=== Preparing Datasets ===")
        
        # Load datasets
        train_dataset = self.load_data("train")
        val_dataset = self.load_data("val")
        test_dataset = self.load_data("test")
        
        # Tokenize
        train_dataset = train_dataset.map(self.tokenize_function, batched=True)
        val_dataset = val_dataset.map(self.tokenize_function, batched=True)
        test_dataset = test_dataset.map(self.tokenize_function, batched=True)
        
        # Remove text column (keep only tokenized inputs and labels)
        train_dataset = train_dataset.remove_columns(['text'])
        val_dataset = val_dataset.remove_columns(['text'])
        test_dataset = test_dataset.remove_columns(['text'])
        
        # Set format for PyTorch
        train_dataset.set_format("torch")
        val_dataset.set_format("torch")
        test_dataset.set_format("torch")
        
        return train_dataset, val_dataset, test_dataset
    
    def compute_metrics(self, eval_pred):
        """Compute metrics for evaluation"""
        predictions, labels = eval_pred
        predictions = np.argmax(predictions, axis=1)
        
        accuracy = accuracy_score(labels, predictions)
        precision, recall, f1, _ = precision_recall_fscore_support(
            labels, predictions, average='binary'
        )
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1': f1
        }
    
    def train_model(self, train_dataset, val_dataset):
        """Fine-tune RoBERTa model"""
        print("\n=== Training RoBERTa Model ===")
        
        # Training arguments
        training_args = TrainingArguments(
            output_dir=os.path.join(self.models_dir, "roberta_checkpoints"),
            num_train_epochs=3,
            per_device_train_batch_size=16,
            per_device_eval_batch_size=16,
            warmup_steps=500,
            weight_decay=0.01,
            logging_dir=os.path.join(self.models_dir, "roberta_logs"),
            logging_steps=100,
            evaluation_strategy="epoch",
            save_strategy="epoch",
            load_best_model_at_end=True,
            metric_for_best_model="f1",
            greater_is_better=True,
            learning_rate=2e-5,
            fp16=torch.cuda.is_available(),  # Use mixed precision if GPU available
            report_to="none",  # Disable wandb/tensorboard
        )
        
        # Initialize Trainer
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=val_dataset,
            tokenizer=self.tokenizer,
            data_collator=DataCollatorWithPadding(tokenizer=self.tokenizer),
            compute_metrics=self.compute_metrics,
        )
        
        # Train
        print("Starting training...")
        trainer.train()
        
        # Evaluate on validation set
        print("\n=== Validation Results ===")
        val_results = trainer.evaluate()
        print(val_results)
        
        return trainer
    
    def evaluate_model(self, trainer, test_dataset):
        """Evaluate model on test set"""
        print("\n=== Test Set Evaluation ===")
        test_results = trainer.evaluate(test_dataset)
        print(test_results)
        
        # Get predictions for detailed report
        predictions = trainer.predict(test_dataset)
        preds = np.argmax(predictions.predictions, axis=1)
        labels = predictions.label_ids
        
        print("\n=== Classification Report ===")
        print(classification_report(labels, preds, target_names=['Real', 'Fake']))
        
        return test_results
    
    def save_model(self, trainer):
        """Save fine-tuned model and tokenizer"""
        print("\n=== Saving Model ===")
        
        model_path = os.path.join(self.models_dir, "roberta_scam_classifier")
        os.makedirs(model_path, exist_ok=True)
        
        # Save model and tokenizer
        trainer.save_model(model_path)
        self.tokenizer.save_pretrained(model_path)
        
        print(f"Model saved to {model_path}")
        
        # Save training info
        training_info = {
            "model_name": self.model_name,
            "num_labels": 2,
            "max_length": 512,
            "device": str(self.device),
        }
        
        info_path = os.path.join(model_path, "training_info.json")
        with open(info_path, 'w') as f:
            json.dump(training_info, f, indent=2)
        
        print(f"Training info saved to {info_path}")
    
    def load_saved_model(self):
        """Load saved fine-tuned model"""
        model_path = os.path.join(self.models_dir, "roberta_scam_classifier")
        
        print(f"\nLoading saved model from {model_path}...")
        self.tokenizer = RobertaTokenizer.from_pretrained(model_path)
        self.model = RobertaForSequenceClassification.from_pretrained(model_path)
        self.model.to(self.device)
        print("Model loaded successfully")
    
    def predict(self, text: str) -> dict:
        """Make prediction on single text"""
        if self.model is None or self.tokenizer is None:
            self.load_saved_model()
        
        # Tokenize
        inputs = self.tokenizer(
            text,
            truncation=True,
            padding="max_length",
            max_length=512,
            return_tensors="pt"
        ).to(self.device)
        
        # Predict
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)
        
        # Get prediction
        predicted_class = torch.argmax(probabilities, dim=1).item()
        confidence = probabilities[0][predicted_class].item()
        
        return {
            "predicted_class": predicted_class,  # 0 = Real, 1 = Fake
            "confidence": confidence,
            "probabilities": {
                "real": probabilities[0][0].item(),
                "fake": probabilities[0][1].item()
            }
        }


def main():
    """Main execution function"""
    print("="*80)
    print("PHASE 2.2-2.3: ROBERTA MODEL TRAINING")
    print("="*80)
    
    trainer = RoBERTaTrainer(model_name="roberta-base")
    
    # Load tokenizer and model
    trainer.load_tokenizer_and_model()
    
    # Prepare datasets
    train_dataset, val_dataset, test_dataset = trainer.prepare_datasets()
    
    # Train model
    trained_trainer = trainer.train_model(train_dataset, val_dataset)
    
    # Evaluate on test set
    trainer.evaluate_model(trained_trainer, test_dataset)
    
    # Save model
    trainer.save_model(trained_trainer)
    
    # Test prediction
    print("\n=== Test Prediction ===")
    test_text = "URGENT! Pay ₹500 registration fee and get ₹80,000/month job"
    result = trainer.predict(test_text)
    print(f"Text: {test_text}")
    print(f"Prediction: {result}")
    
    print("\n" + "="*80)
    print("PHASE 2.2-2.3 COMPLETE")
    print("="*80)


if __name__ == "__main__":
    main()

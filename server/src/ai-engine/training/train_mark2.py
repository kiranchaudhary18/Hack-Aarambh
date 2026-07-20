#!/usr/bin/env python3
"""
Mark-2 Routing Model Training Script
Trains a meta-classifier to route between text and document analysis models
"""

import torch
import torch.nn as nn
import pandas as pd
import numpy as np
import argparse
import os
import sys
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import json

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from training.utils import save_model, get_device


class Mark2Dataset(Dataset):
    """Dataset for Mark-2 routing model"""
    
    def __init__(self, features, labels):
        self.features = torch.FloatTensor(features)
        self.labels = torch.LongTensor(labels)
    
    def __len__(self):
        return len(self.labels)
    
    def __getitem__(self, idx):
        return {
            'features': self.features[idx],
            'labels': self.labels[idx]
        }


class Mark2Router(nn.Module):
    """Mark-2 Routing Neural Network"""
    
    def __init__(self, input_size=4, hidden_size=128, num_classes=2):
        super(Mark2Router, self).__init__()
        
        self.network = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_size // 2, num_classes)
        )
    
    def forward(self, x):
        return self.network(x)


class Mark2RoutingLogic:
    """Mark-2 routing logic with confidence-based decision making"""
    
    def __init__(self, text_threshold=0.8, doc_threshold=0.8):
        self.text_threshold = text_threshold
        self.doc_threshold = doc_threshold
    
    def route(self, text_score, text_confidence, doc_score, doc_confidence, has_document=False):
        """
        Route analysis based on confidence scores
        
        Args:
            text_score: Scam probability from text model (0-1)
            text_confidence: Confidence score from text model (0-1)
            doc_score: Scam probability from document model (0-1)
            doc_confidence: Confidence score from document model (0-1)
            has_document: Whether document analysis is available
        
        Returns:
            dict: Routing decision and final score
        """
        result = {
            'routing_decision': None,
            'final_score': None,
            'confidence': None,
            'reason': None
        }
        
        # High confidence in text analysis
        if text_confidence >= self.text_threshold:
            result['routing_decision'] = 'text_only'
            result['final_score'] = text_score
            result['confidence'] = text_confidence
            result['reason'] = 'High confidence in text analysis'
        
        # High confidence in document analysis (if available)
        elif has_document and doc_confidence >= self.doc_threshold:
            result['routing_decision'] = 'doc_only'
            result['final_score'] = doc_score
            result['confidence'] = doc_confidence
            result['reason'] = 'High confidence in document analysis'
        
        # Use combined routing when both have moderate confidence
        elif has_document:
            result['routing_decision'] = 'combined'
            # Weighted average based on confidence
            total_confidence = text_confidence + doc_confidence
            if total_confidence > 0:
                result['final_score'] = (
                    (text_score * text_confidence + doc_score * doc_confidence) / 
                    total_confidence
                )
            else:
                result['final_score'] = (text_score + doc_score) / 2
            result['confidence'] = max(text_confidence, doc_confidence)
            result['reason'] = 'Combined analysis with moderate confidence'
        
        # Text only with low confidence
        else:
            result['routing_decision'] = 'text_only'
            result['final_score'] = text_score
            result['confidence'] = text_confidence
            result['reason'] = 'Text analysis only (low confidence)'
        
        return result


def create_synthetic_routing_data():
    """Create synthetic training data for Mark-2 router"""
    
    print("Creating synthetic routing data...")
    
    # Generate synthetic features: [text_score, text_confidence, doc_score, doc_confidence]
    # Labels: 0 = legitimate, 1 = scam
    
    np.random.seed(42)
    
    n_samples = 200
    
    features = []
    labels = []
    
    # Generate scam samples (label=1)
    for _ in range(n_samples // 2):
        # High scam probability
        text_score = np.random.uniform(0.7, 1.0)
        text_conf = np.random.uniform(0.6, 0.95)
        doc_score = np.random.uniform(0.7, 1.0)
        doc_conf = np.random.uniform(0.6, 0.95)
        
        features.append([text_score, text_conf, doc_score, doc_conf])
        labels.append(1)
    
    # Generate legitimate samples (label=0)
    for _ in range(n_samples // 2):
        # Low scam probability
        text_score = np.random.uniform(0.0, 0.3)
        text_conf = np.random.uniform(0.6, 0.95)
        doc_score = np.random.uniform(0.0, 0.3)
        doc_conf = np.random.uniform(0.6, 0.95)
        
        features.append([text_score, text_conf, doc_score, doc_conf])
        labels.append(0)
    
    # Convert to numpy arrays
    features = np.array(features)
    labels = np.array(labels)
    
    # Shuffle
    indices = np.random.permutation(len(features))
    features = features[indices]
    labels = labels[indices]
    
    print(f"Created {len(features)} routing samples")
    
    return features, labels


def train_model(args):
    """Main training function"""
    
    print("=" * 50)
    print("Mark-2 Routing Model Training")
    print("=" * 50)
    
    # Set device
    device = get_device(use_cpu=args.cpu)
    print(f"Using device: {device}")
    
    # Create synthetic data
    features, labels = create_synthetic_routing_data()
    
    # Split data
    X_train, X_val, y_train, y_val = train_test_split(
        features, labels, test_size=0.2, random_state=42, stratify=labels
    )
    
    print(f"Training samples: {len(X_train)}")
    print(f"Validation samples: {len(X_val)}")
    
    # Create datasets
    train_dataset = Mark2Dataset(X_train, y_train)
    val_dataset = Mark2Dataset(X_val, y_val)
    
    # Create dataloaders
    train_loader = DataLoader(
        train_dataset, 
        batch_size=args.batch_size, 
        shuffle=True
    )
    val_loader = DataLoader(
        val_dataset, 
        batch_size=args.batch_size, 
        shuffle=False
    )
    
    # Initialize model
    print("Initializing Mark-2 routing network...")
    model = Mark2Router(input_size=4, hidden_size=args.hidden_size, num_classes=2)
    model.to(device)
    
    # Loss and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.learning_rate, weight_decay=0.01)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)
    
    # Training loop
    print("Starting training...")
    best_val_accuracy = 0.0
    
    for epoch in range(args.epochs):
        model.train()
        train_loss = 0.0
        train_correct = 0
        train_total = 0
        
        for batch in train_loader:
            features = batch['features'].to(device)
            labels = batch['labels'].to(device)
            
            optimizer.zero_grad()
            outputs = model(features)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            train_total += labels.size(0)
            train_correct += (predicted == labels).sum().item()
        
        # Validation
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            for batch in val_loader:
                features = batch['features'].to(device)
                labels = batch['labels'].to(device)
                
                outputs = model(features)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item()
                _, predicted = torch.max(outputs.data, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).sum().item()
        
        # Calculate metrics
        train_accuracy = 100 * train_correct / train_total
        val_accuracy = 100 * val_correct / val_total
        
        print(f"Epoch {epoch+1}/{args.epochs}:")
        print(f"  Train Loss: {train_loss/len(train_loader):.4f}, Accuracy: {train_accuracy:.2f}%")
        print(f"  Val Loss: {val_loss/len(val_loader):.4f}, Accuracy: {val_accuracy:.2f}%")
        
        # Save best model
        if val_accuracy > best_val_accuracy:
            best_val_accuracy = val_accuracy
            output_dir = args.output_dir or os.path.join(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                'models'
            )
            os.makedirs(output_dir, exist_ok=True)
            
            torch.save({
                'model_state_dict': model.state_dict(),
                'model_config': {
                    'input_size': 4,
                    'hidden_size': args.hidden_size,
                    'num_classes': 2
                },
                'routing_logic': {
                    'text_threshold': 0.8,
                    'doc_threshold': 0.8
                }
            }, os.path.join(output_dir, 'Mark_2.pt'))
            
            print(f"  Saved best model with accuracy: {val_accuracy:.2f}%")
        
        scheduler.step()
    
    print("Training completed successfully!")
    print(f"Best validation accuracy: {best_val_accuracy:.2f}%")
    print(f"Model saved as Mark_2.pt")
    
    # Save routing logic configuration
    routing_logic = Mark2RoutingLogic()
    routing_config = {
        'text_threshold': routing_logic.text_threshold,
        'doc_threshold': routing_logic.doc_threshold,
        'description': 'Mark-2 routing logic configuration'
    }
    
    output_dir = args.output_dir or os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
        'models'
    )
    
    with open(os.path.join(output_dir, 'Mark_2_config.json'), 'w') as f:
        json.dump(routing_config, f, indent=2)
    
    print("Routing configuration saved as Mark_2_config.json")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Train Mark-2 routing model')
    parser.add_argument('--epochs', type=int, default=10, help='Number of training epochs')
    parser.add_argument('--batch_size', type=int, default=16, help='Batch size for training')
    parser.add_argument('--hidden_size', type=int, default=128, help='Hidden layer size')
    parser.add_argument('--learning_rate', type=float, default=1e-3, help='Learning rate')
    parser.add_argument('--output_dir', type=str, default=None, help='Output directory for model')
    parser.add_argument('--cpu', action='store_true', help='Use CPU instead of GPU')
    
    args = parser.parse_args()
    
    # Adjust batch size for CPU
    if args.cpu:
        args.batch_size = min(args.batch_size, 8)
        print("CPU mode: Reduced batch size to 8")
    
    train_model(args)

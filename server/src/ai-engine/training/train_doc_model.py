#!/usr/bin/env python3
"""
Document Analysis Model Training Script
Trains ViT/ResNet model for scam detection in images and PDFs
"""

import torch
import pandas as pd
import numpy as np
import argparse
import os
import sys
from transformers import (
    ViTImageProcessor,
    ViTForImageClassification,
    Trainer,
    TrainingArguments,
    EarlyStoppingCallback
)
from torch.utils.data import Dataset
from PIL import Image
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from training.utils import compute_metrics, save_model, get_device


class DocumentDataset(Dataset):
    """Custom dataset for document image classification"""

    def __init__(self, image_folder, image_processor, transform=None):
        self.image_folder = image_folder
        self.image_processor = image_processor
        self.transform = transform
        
        # Load image paths and labels
        self.images = []
        self.labels = []
        
        scam_dir = os.path.join(image_folder, 'scam')
        legit_dir = os.path.join(image_folder, 'legit')
        
        # Load scam images
        if os.path.exists(scam_dir):
            for img_name in os.listdir(scam_dir):
                if img_name.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
                    self.images.append(os.path.join(scam_dir, img_name))
                    self.labels.append(1)
        
        # Load legitimate images
        if os.path.exists(legit_dir):
            for img_name in os.listdir(legit_dir):
                if img_name.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
                    self.images.append(os.path.join(legit_dir, img_name))
                    self.labels.append(0)
        
        print(f"Loaded {len(self.images)} images from {image_folder}")
        print(f"Scam images: {sum(self.labels)}, Legit images: {len(self.labels) - sum(self.labels)}")
    
    def __len__(self):
        return len(self.images)
    
    def __getitem__(self, idx):
        image_path = self.images[idx]
        label = self.labels[idx]
        
        # Load image
        image = Image.open(image_path).convert('RGB')
        
        # Apply transforms if specified
        if self.transform:
            image = self.transform(image)
        
        # Feature extraction
        inputs = self.image_processor(images=image, return_tensors="pt")
        
        return {
            'pixel_values': inputs['pixel_values'].squeeze(),
            'labels': torch.tensor(label, dtype=torch.long)
        }


def create_synthetic_doc_images(data_dir):
    """Create synthetic document images for training"""
    from PIL import Image, ImageDraw, ImageFont
    import textwrap
    
    print("Creating synthetic document images...")
    
    scam_dir = os.path.join(data_dir, 'scam')
    legit_dir = os.path.join(data_dir, 'legit')
    
    os.makedirs(scam_dir, exist_ok=True)
    os.makedirs(legit_dir, exist_ok=True)
    
    # Scam document texts
    scam_texts = [
        "URGENT! Pay ₹5000\nRegistration Fee\nHigh Salary Job\nWork From Home",
        "Congratulations!\nYou Have Been Selected\nPay ₹2000 Now\nLimited Time Offer",
        "Immediate Joining\nPay ₹3000 Training Fee\n₹80,000/Month Salary\nGenuine Opportunity",
        "Selected Candidate\nDeposit ₹4000 Equipment\nWork From Home\nFlexible Hours",
        "Final Selection!\nPay ₹1500 For ID Card\nJoin Immediately\n₹60,000 Monthly",
    ]
    
    # Legitimate document texts
    legit_texts = [
        "Google LLC\nSoftware Engineer\nInterview Schedule\nAugust 15, 2026",
        "Microsoft India\nTechnical Interview\nRound 1: Online Assessment\nDate: August 20, 2026",
        "Amazon Development\nApplication Received\nReview in Progress\nWe will contact you",
        "Infosys Limited\nShortlisted for Interview\nTechnical Round\nVenue: Infosys Campus",
        "TCS Digital Hiring\nProfile Under Review\nComplete Assessment\nBy August 25, 2026",
    ]
    
    # Create scam images
    for i, text in enumerate(scam_texts):
        img = Image.new('RGB', (400, 300), color='white')
        draw = ImageDraw.Draw(img)
        
        # Draw simple document-like structure
        draw.rectangle([10, 10, 390, 290], outline='black', width=2)
        
        # Add text
        lines = text.split('\n')
        y_offset = 50
        for line in lines:
            draw.text((30, y_offset), line, fill='black')
            y_offset += 40
        
        img.save(os.path.join(scam_dir, f'scam_doc_{i}.png'))
    
    # Create legitimate images
    for i, text in enumerate(legit_texts):
        img = Image.new('RGB', (400, 300), color='white')
        draw = ImageDraw.Draw(img)
        
        # Draw professional document structure
        draw.rectangle([10, 10, 390, 290], outline='blue', width=2)
        
        # Add header
        draw.rectangle([10, 10, 390, 60], fill='lightblue')
        draw.text((30, 25), "OFFICIAL DOCUMENT", fill='black')
        
        # Add text
        lines = text.split('\n')
        y_offset = 80
        for line in lines:
            draw.text((30, y_offset), line, fill='black')
            y_offset += 40
        
        img.save(os.path.join(legit_dir, f'legit_doc_{i}.png'))
    
    print(f"Created {len(scam_texts)} scam document images")
    print(f"Created {len(legit_texts)} legitimate document images")


def load_data(data_dir):
    """Load and prepare training data"""
    train_dir = os.path.join(data_dir, 'train')
    val_dir = os.path.join(data_dir, 'val')
    
    # Check if directories exist, if not create synthetic data
    if not os.path.exists(train_dir):
        print("Training data not found, creating synthetic document images...")
        create_synthetic_doc_images(data_dir)
        
        # Split into train/val
        scam_dir = os.path.join(data_dir, 'scam')
        legit_dir = os.path.join(data_dir, 'legit')
        
        os.makedirs(train_dir, exist_ok=True)
        os.makedirs(val_dir, exist_ok=True)
        os.makedirs(os.path.join(train_dir, 'scam'), exist_ok=True)
        os.makedirs(os.path.join(train_dir, 'legit'), exist_ok=True)
        os.makedirs(os.path.join(val_dir, 'scam'), exist_ok=True)
        os.makedirs(os.path.join(val_dir, 'legit'), exist_ok=True)
        
        # Split scam images
        scam_images = [f for f in os.listdir(scam_dir) if f.endswith('.png')]
        for i, img in enumerate(scam_images):
            src = os.path.join(scam_dir, img)
            if i < len(scam_images) * 0.8:
                dst = os.path.join(train_dir, 'scam', img)
            else:
                dst = os.path.join(val_dir, 'scam', img)
            os.rename(src, dst)
        
        # Split legit images
        legit_images = [f for f in os.listdir(legit_dir) if f.endswith('.png')]
        for i, img in enumerate(legit_images):
            src = os.path.join(legit_dir, img)
            if i < len(legit_images) * 0.8:
                dst = os.path.join(train_dir, 'legit', img)
            else:
                dst = os.path.join(val_dir, 'legit', img)
            os.rename(src, dst)
        
        # Remove empty directories
        os.rmdir(scam_dir)
        os.rmdir(legit_dir)
    
    return train_dir, val_dir


def train_model(args):
    """Main training function"""
    
    print("=" * 50)
    print("Document Analysis Model Training")
    print("=" * 50)
    
    # Set device
    device = get_device(use_cpu=args.cpu)
    print(f"Using device: {device}")
    
    # Load data
    data_dir = args.data_dir or os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
        'datasets', 'doc_data', 'images'
    )
    train_dir, val_dir = load_data(data_dir)
    
    # Data augmentation for training
    train_transform = transforms.Compose([
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.Resize((224, 224)),
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
    ])
    
    # Initialize image processor
    print("Loading ViT image processor...")
    image_processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')

    # Create datasets
    print("Creating datasets...")
    train_dataset = DocumentDataset(train_dir, image_processor, transform=train_transform)
    val_dataset = DocumentDataset(val_dir, image_processor, transform=val_transform)
    
    # Initialize model
    print("Loading ViT model for image classification...")
    model = ViTForImageClassification.from_pretrained(
        'google/vit-base-patch16-224',
        num_labels=2,
        ignore_mismatched_sizes=True
    )
    
    # Training arguments
    print("Setting up training arguments...")
    training_args = TrainingArguments(
        output_dir='./doc_model_output',
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        per_device_eval_batch_size=args.batch_size,
        warmup_steps=100,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=5,
        eval_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="accuracy",
        greater_is_better=True,
        fp16=not args.cpu,  # Use mixed precision only on GPU
        dataloader_num_workers=2,
        learning_rate=args.learning_rate,
        gradient_accumulation_steps=2 if args.cpu else 1,
    )
    
    # Initialize trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics,
        callbacks=[EarlyStoppingCallback(early_stopping_patience=3)]
    )
    
    # Train
    print("Starting training...")
    trainer.train()
    
    # Evaluate
    print("Evaluating model...")
    eval_results = trainer.evaluate()
    print(f"Evaluation results: {eval_results}")
    
    # Save model
    output_dir = args.output_dir or os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'models'
    )
    print(f"Saving model to {output_dir}...")
    save_model(model, image_processor, output_dir, 'doc_analysis')
    
    print("Training completed successfully!")
    print(f"Model saved as doc_analysis.pt")
    print(f"Final accuracy: {eval_results['eval_accuracy']:.4f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Train document analysis model')
    parser.add_argument('--epochs', type=int, default=8, help='Number of training epochs')
    parser.add_argument('--batch_size', type=int, default=4, help='Batch size for training')
    parser.add_argument('--learning_rate', type=float, default=3e-5, help='Learning rate')
    parser.add_argument('--data_dir', type=str, default=None, help='Data directory path')
    parser.add_argument('--output_dir', type=str, default=None, help='Output directory for model')
    parser.add_argument('--cpu', action='store_true', help='Use CPU instead of GPU')
    
    args = parser.parse_args()
    
    # Adjust batch size for CPU
    if args.cpu:
        args.batch_size = min(args.batch_size, 2)
        print("CPU mode: Reduced batch size to 2")
    
    train_model(args)

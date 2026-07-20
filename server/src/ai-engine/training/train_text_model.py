#!/usr/bin/env python3
"""
Text Analysis Model Training Script
Trains DistilRoBERTa model for scam detection in text messages
"""

import torch
import pandas as pd
import numpy as np
import argparse
import os
import sys
from transformers import (
    DistilBertTokenizer, 
    DistilBertForSequenceClassification,
    Trainer, 
    TrainingArguments,
    EarlyStoppingCallback
)
from torch.utils.data import Dataset
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import yaml

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from training.utils import compute_metrics, save_model, get_device


class TextDataset(Dataset):
    """Custom dataset for text classification"""
    
    def __init__(self, texts, labels, tokenizer, max_length=512):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]
        
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }


def load_data(data_dir):
    """Load and prepare training data"""
    train_path = os.path.join(data_dir, 'train.csv')
    val_path = os.path.join(data_dir, 'val.csv')
    
    # Check if files exist, if not create synthetic data
    if not os.path.exists(train_path):
        print("Training data not found, creating synthetic data...")
        create_synthetic_data(data_dir)
    
    train_df = pd.read_csv(train_path)
    val_df = pd.read_csv(val_path)
    
    print(f"Loaded {len(train_df)} training samples")
    print(f"Loaded {len(val_df)} validation samples")
    
    return train_df, val_df


def create_synthetic_data(data_dir):
    """Create synthetic training data for scam detection"""
    
    # Scam examples (label=1)
    scam_texts = [
        "Congratulations! You have been selected for a high-paying position. Pay ₹5000 registration fee immediately to secure your spot.",
        "URGENT: Limited time offer! Work from home and earn ₹50,000/month. No experience needed. Send payment via UPI to start today.",
        "You have been hired! Send ₹2000 training fee to get your offer letter. This is a genuine opportunity with top MNC.",
        "Immediate joining required! Pay ₹1000 for documentation and verification. Salary ₹80,000/month guaranteed.",
        "Selected candidate! Deposit ₹3000 for equipment setup. Work from home, flexible hours, high salary.",
        "Congratulations on your selection! Pay ₹1500 for ID card and uniform. Join immediately with ₹60,000 monthly salary.",
        "You got the job! Send ₹2500 to process your offer letter. This is a legitimate company with great benefits.",
        "Urgent hiring! Pay ₹500 for interview registration. High salary package, work from home available.",
        "Final selection! Pay ₹4000 for training material. Start earning ₹70,000/month from home.",
        "Congratulations! Send ₹1800 via Google Pay to receive your appointment letter. Limited seats available.",
        "You are hired! Immediate payment of ₹2200 required for background verification. Salary ₹90,000/month.",
        "Selected for high-paying role! Pay ₹3500 for software and tools. Work remotely with flexible timing.",
        "Congratulations on your offer! Pay ₹2800 for company ID and access cards. Join today with ₹55,000 salary.",
        "Urgent: You have been selected! Send ₹1200 for profile verification. Start working immediately.",
        "Final round cleared! Pay ₹4500 for onboarding kit. Salary ₹75,000/month, work from home.",
        "Congratulations! Pay ₹3200 for training certification. Guaranteed placement with ₹65,000 monthly salary.",
        "You got selected! Immediate payment of ₹1900 required for offer processing. Join top company today.",
        "Selected candidate! Pay ₹2700 for equipment. Work from home with ₹85,000 monthly salary.",
        "Congratulations! Send ₹2300 for documentation. This is a genuine opportunity with ₹70,000 salary.",
        "Urgent hiring! Pay ₹1600 for registration. High salary, immediate joining, no interview needed.",
        "You have been selected! Pay ₹3800 for background check. Salary ₹95,000/month, work from home.",
        "Congratulations on your selection! Pay ₹2100 for company registration. Join immediately.",
        "Selected for premium position! Pay ₹4200 for training materials. Salary ₹80,000/month guaranteed.",
        "You got the job! Send ₹1700 for ID verification. Start today with ₹60,000 monthly salary.",
        "Final selection! Pay ₹2900 for onboarding. Work from home with flexible hours and high pay.",
        "Congratulations! Pay ₹2400 for offer letter processing. This is a legitimate opportunity.",
        "Urgent: You have been hired! Send ₹3600 for equipment setup. Salary ₹88,000/month.",
        "Selected candidate! Pay ₹1300 for profile activation. Immediate joining with great benefits.",
        "Congratulations! Pay ₹3100 for training. Guaranteed placement with ₹72,000 monthly salary.",
        "You got selected! Pay ₹2600 for documentation. Join top MNC with ₹78,000 salary.",
        "Congratulations on your offer! Pay ₹2000 for company registration. Start working today.",
        "Selected for high-paying role! Pay ₹3300 for software. Work remotely with ₹82,000 salary.",
        "You have been selected! Pay ₹3700 for background verification. Salary ₹92,000/month.",
        "Congratulations! Send ₹1400 for ID card. Join immediately with ₹58,000 monthly salary.",
        "Final round cleared! Pay ₹3900 for onboarding. Salary ₹76,000/month, work from home.",
        "Congratulations! Pay ₹2500 for training certification. Salary ₹68,000/month guaranteed.",
        "You got selected! Pay ₹1800 for offer processing. Join today with top company.",
        "Selected candidate! Pay ₹3400 for equipment. Work from home with ₹84,000 salary.",
        "Congratulations! Send ₹2700 for documentation. This is genuine with ₹74,000 salary.",
        "Urgent hiring! Pay ₹1500 for registration. Immediate joining, high salary package.",
        "You have been selected! Pay ₹4100 for background check. Salary ₹96,000/month.",
        "Congratulations on your selection! Pay ₹2200 for company registration. Join immediately.",
        "Selected for premium position! Pay ₹3000 for training. Salary ₹81,000/month.",
        "You got the job! Send ₹1600 for ID verification. Start with ₹62,000 monthly salary.",
        "Final selection! Pay ₹2800 for onboarding. Work from home with ₹77,000 salary.",
        "Congratulations! Pay ₹2300 for offer letter. This is a legitimate opportunity.",
        "Urgent: You have been hired! Send ₹3500 for equipment. Salary ₹89,000/month.",
        "Selected candidate! Pay ₹1200 for profile activation. Immediate joining.",
        "Congratulations! Pay ₹3200 for training. Placement with ₹73,000 monthly salary.",
        "You got selected! Pay ₹2500 for documentation. Join MNC with ₹79,000 salary.",
    ]
    
    # Legitimate examples (label=0)
    legit_texts = [
        "Thank you for applying to Google. We have received your application for Software Engineer position. Our team will review your profile and get back to you within 2 weeks.",
        "Interview scheduled for Microsoft Software Engineer role on 15th August at 10:00 AM. Please bring your resume and ID proof. Venue: Microsoft Campus, Hyderabad.",
        "Application received for Amazon Development Associate position. Your profile is under review. We will contact you if shortlisted for further rounds.",
        "Congratulations! You have been shortlisted for the Technical Interview at Infosys. Round 1: Online Assessment on 20th August. Details sent to your email.",
        "Your application for TCS Digital Hiring Program has been received. Please complete the online assessment by 25th August to proceed further.",
        "Wipro recruitment process: You have cleared the online test. Next round: Technical Interview on 18th August. Check your email for meeting link.",
        "Accenture hiring drive: Your profile matches our requirements for Software Developer. Please attend the interview on 22nd August at our Bangalore office.",
        "HCL Technologies: Application received for Graduate Trainee position. Shortlisted candidates will be notified via email for interview schedule.",
        "Thank you for your interest in IBM. We are reviewing your application for Data Analyst role. Selected candidates will be contacted for interview.",
        "Capgemini recruitment: You have been invited for Group Discussion on 19th August. Venue: Capgemini Office, Pune. Time: 2:00 PM.",
        "Your application for Cognizant Technology Solutions is under review. Please ensure your profile is complete. We will update you on next steps.",
        "Tech Mahindra hiring: Online assessment completed successfully. Next round: Technical Interview scheduled for 21st August.",
        "Deloitte application received for Consulting role. Our team will review your profile and shortlist suitable candidates for interview process.",
        "Thank you for applying to Oracle. Your application for Database Administrator position is being processed. We will contact you soon.",
        "SAP recruitment drive: You have been shortlisted for Technical Interview. Round details sent to your registered email address.",
        "Your application for Adobe Software Engineer role has been received. Our hiring team will review and contact you if selected.",
        "Cisco Systems: Application received for Network Engineer position. Please complete the technical assessment by 30th August.",
        "Intel recruitment: Profile matched for Hardware Engineer role. Interview process details will be shared via email.",
        "Thank you for applying to NVIDIA. Your application for GPU Computing Specialist is under review.",
        "Qualcomm hiring: You have been shortlisted for Technical Interview. Interview schedule: 23rd August at 11:00 AM.",
        "Your application for AMD Software Developer position is being processed. We will update you on further steps.",
        "Broadcom recruitment: Online test completed successfully. Next round: HR Interview on 24th August.",
        "Texas Instruments: Application received for Embedded Systems Engineer. Shortlisted candidates will be notified.",
        "Analog Devices hiring: Profile shortlisted for Technical Interview. Interview details sent to your email.",
        "Thank you for applying to Linear Technology. Your application for Circuit Design role is under review.",
        "Maxim Integrated recruitment: You have been invited for Technical Discussion on 26th August.",
        "Your application for Microchip Technology is being processed. We will contact you for interview if selected.",
        "ON Semiconductor hiring: Online assessment completed. Next round: Technical Interview scheduled.",
        "NXP Semiconductors: Application received for Embedded Software Engineer. Review in progress.",
        "Infineon Technologies: Profile shortlisted for interview. Interview schedule will be shared soon.",
        "Thank you for applying to STMicroelectronics. Your application for IoT Engineer role is under review.",
        "Renesas recruitment: You have been invited for Technical Interview on 28th August.",
        "Your application for Cypress Semiconductor is being processed. We will update you shortly.",
        "Monolithic Power Systems hiring: Profile matched for Power Electronics Engineer role.",
        "Vishay Intertechnology: Application received for Component Engineer. Review in progress.",
        "Thank you for applying to KEMET. Your application for Capacitor Design role is under review.",
        "AVX recruitment: You have been shortlisted for Technical Interview. Details sent via email.",
        "Your application for TDK Electronics is being processed. We will contact you soon.",
        "Murata Manufacturing hiring: Profile shortlisted for Component Engineer role.",
        "Yageo Corporation: Application received for Resistor Design position. Review in progress.",
        "Thank you for applying to Panasonic. Your application for Battery Engineer role is under review.",
        "Samsung SDI recruitment: You have been invited for Technical Interview on 29th August.",
        "Your application for LG Chem is being processed. We will update you on next steps.",
        "CATL hiring: Profile matched for Battery Design Engineer role. Interview details to follow.",
        "BYD Company: Application received for EV Battery Engineer. Shortlisted candidates will be notified.",
        "Thank you for applying to Tesla. Your application for Energy Storage Engineer is under review.",
    ]
    
    # Create dataframes
    scam_df = pd.DataFrame({
        'text': scam_texts,
        'label': [1] * len(scam_texts)
    })
    
    legit_df = pd.DataFrame({
        'text': legit_texts,
        'label': [0] * len(legit_texts)
    })
    
    # Combine and split
    all_data = pd.concat([scam_df, legit_df], ignore_index=True)
    all_data = all_data.sample(frac=1, random_state=42).reset_index(drop=True)
    
    train_df, val_df = train_test_split(
        all_data, 
        test_size=0.2, 
        random_state=42,
        stratify=all_data['label']
    )
    
    # Save datasets
    os.makedirs(data_dir, exist_ok=True)
    train_df.to_csv(os.path.join(data_dir, 'train.csv'), index=False)
    val_df.to_csv(os.path.join(data_dir, 'val.csv'), index=False)
    
    print(f"Created synthetic dataset: {len(train_df)} training, {len(val_df)} validation samples")


def train_model(args):
    """Main training function"""
    
    print("=" * 50)
    print("Text Analysis Model Training")
    print("=" * 50)
    
    # Set device
    device = get_device(use_cpu=args.cpu)
    print(f"Using device: {device}")
    
    # Load data
    data_dir = args.data_dir or os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
        'datasets', 'text_data'
    )
    train_df, val_df = load_data(data_dir)
    
    # Initialize tokenizer
    print("Loading DistilBERT tokenizer...")
    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
    
    # Create datasets
    print("Creating datasets...")
    train_dataset = TextDataset(
        train_df['text'].values, 
        train_df['label'].values, 
        tokenizer,
        max_length=args.max_length
    )
    val_dataset = TextDataset(
        val_df['text'].values, 
        val_df['label'].values, 
        tokenizer,
        max_length=args.max_length
    )
    
    # Initialize model
    print("Loading DistilBERT model for sequence classification...")
    model = DistilBertForSequenceClassification.from_pretrained(
        'distilbert-base-uncased',
        num_labels=2
    )
    
    # Training arguments
    print("Setting up training arguments...")
    training_args = TrainingArguments(
        output_dir='./text_model_output',
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        per_device_eval_batch_size=args.batch_size,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=10,
        eval_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="accuracy",
        greater_is_better=True,
        fp16=not args.cpu,  # Use mixed precision only on GPU
        dataloader_num_workers=2,
        learning_rate=args.learning_rate,
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
    save_model(model, tokenizer, output_dir, 'text_analysis')
    
    print("Training completed successfully!")
    print(f"Model saved as text_analysis.pt")
    print(f"Final accuracy: {eval_results['eval_accuracy']:.4f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Train text analysis model')
    parser.add_argument('--epochs', type=int, default=5, help='Number of training epochs')
    parser.add_argument('--batch_size', type=int, default=8, help='Batch size for training')
    parser.add_argument('--max_length', type=int, default=512, help='Maximum sequence length')
    parser.add_argument('--learning_rate', type=float, default=2e-5, help='Learning rate')
    parser.add_argument('--data_dir', type=str, default=None, help='Data directory path')
    parser.add_argument('--output_dir', type=str, default=None, help='Output directory for model')
    parser.add_argument('--cpu', action='store_true', help='Use CPU instead of GPU')
    
    args = parser.parse_args()
    
    # Adjust batch size for CPU
    if args.cpu:
        args.batch_size = min(args.batch_size, 4)
        print("CPU mode: Reduced batch size to 4")
    
    train_model(args)

import torch
import numpy as np
from transformers import Trainer, TrainingArguments
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import os


def compute_metrics(eval_pred):
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


class CustomTrainer(Trainer):
    """Custom trainer with mixed precision support"""
    def __init__(self, *args, use_cpu=False, **kwargs):
        super().__init__(*args, **kwargs)
        self.use_cpu = use_cpu
    
    def create_optimizer(self):
        """Create optimizer with weight decay"""
        if self.use_cpu:
            # CPU-specific optimizations
            return super().create_optimizer()
        else:
            # GPU with mixed precision
            return super().create_optimizer()


def save_model(model, tokenizer, output_path, model_name):
    """Save model and tokenizer"""
    os.makedirs(output_path, exist_ok=True)
    
    # Save as .pt file
    torch.save({
        'model_state_dict': model.state_dict(),
        'config': model.config,
        'tokenizer': tokenizer
    }, os.path.join(output_path, f"{model_name}.pt"))
    
    print(f"Model saved as {model_name}.pt")


def load_model(model_class, model_path, device='cpu'):
    """Load model from .pt file"""
    checkpoint = torch.load(model_path, map_location=device)
    
    model = model_class.from_config(checkpoint['config'])
    model.load_state_dict(checkpoint['model_state_dict'])
    model.to(device)
    model.eval()
    
    tokenizer = checkpoint['tokenizer']
    
    return model, tokenizer


def get_device(use_cpu=False):
    """Get appropriate device for training"""
    if use_cpu:
        return torch.device('cpu')
    else:
        if torch.cuda.is_available():
            return torch.device('cuda')
        else:
            print("CUDA not available, falling back to CPU")
            return torch.device('cpu')

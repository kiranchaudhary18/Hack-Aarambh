"""
Phase 1.3: Dataset Cleaning, Validation, and Train/Val/Test Splits
Creates stratified splits for model training
"""

import pandas as pd
import json
from sklearn.model_selection import train_test_split
from typing import Dict, Tuple
import os
from pathlib import Path


class DataSplitter:
    """Clean, validate, and split dataset for training"""
    
    def __init__(self, dataset_path: str):
        self.dataset_path = dataset_path
        self.output_dir = os.path.dirname(dataset_path)
        
    def load_dataset(self) -> pd.DataFrame:
        """Load expanded dataset"""
        df = pd.read_csv(self.dataset_path)
        print(f"Loaded {len(df)} samples from {self.dataset_path}")
        return df
    
    def clean_dataset(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and validate dataset"""
        print("\n=== Cleaning Dataset ===")
        
        # Remove duplicates
        initial_count = len(df)
        df = df.drop_duplicates(subset=['text'])
        duplicates_removed = initial_count - len(df)
        print(f"Removed {duplicates_removed} duplicate entries")
        
        # Remove rows with missing text or labels
        initial_count = len(df)
        df = df.dropna(subset=['text', 'label'])
        missing_removed = initial_count - len(df)
        print(f"Removed {missing_removed} entries with missing values")
        
        # Ensure labels are integers
        df['label'] = df['label'].astype(int)
        
        # Filter valid labels (0 or 1 only)
        initial_count = len(df)
        df = df[df['label'].isin([0, 1])]
        invalid_removed = initial_count - len(df)
        print(f"Removed {invalid_removed} entries with invalid labels")
        
        # Remove very short texts (< 10 characters)
        initial_count = len(df)
        df = df[df['text'].str.len() >= 10]
        short_removed = initial_count - len(df)
        print(f"Removed {short_removed} entries with very short text")
        
        print(f"Final dataset size: {len(df)} samples")
        return df
    
    def validate_dataset(self, df: pd.DataFrame) -> Dict:
        """Validate dataset quality and return statistics"""
        print("\n=== Dataset Validation ===")
        
        stats = {
            'total_samples': len(df),
            'fake_samples': int(df['label'].sum()),
            'real_samples': int(len(df) - df['label'].sum()),
            'balance_ratio': float(df['label'].sum() / len(df)),
        }
        
        # Category distribution
        category_dist = df['category'].value_counts().to_dict()
        stats['category_distribution'] = category_dist
        
        # Language distribution
        language_dist = df['language'].value_counts().to_dict()
        stats['language_distribution'] = language_dist
        
        # Source distribution
        source_dist = df['source'].value_counts().to_dict()
        stats['source_distribution'] = source_dist
        
        # Text length statistics
        text_lengths = df['text'].str.len()
        stats['avg_text_length'] = float(text_lengths.mean())
        stats['min_text_length'] = int(text_lengths.min())
        stats['max_text_length'] = int(text_lengths.max())
        
        print(f"Total samples: {stats['total_samples']}")
        print(f"Fake samples: {stats['fake_samples']} ({stats['fake_samples']/stats['total_samples']*100:.1f}%)")
        print(f"Real samples: {stats['real_samples']} ({stats['real_samples']/stats['total_samples']*100:.1f}%)")
        print(f"Balance ratio: {stats['balance_ratio']:.2f}")
        print(f"Categories: {category_dist}")
        print(f"Languages: {language_dist}")
        print(f"Sources: {source_dist}")
        print(f"Avg text length: {stats['avg_text_length']:.1f} chars")
        
        return stats
    
    def create_splits(self, df: pd.DataFrame, 
                     train_ratio: float = 0.7,
                     val_ratio: float = 0.15,
                     test_ratio: float = 0.15,
                     random_state: int = 42) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """Create stratified train/val/test splits"""
        print("\n=== Creating Data Splits ===")
        
        # First split: train + temp (val + test)
        train_df, temp_df = train_test_split(
            df,
            test_size=(val_ratio + test_ratio),
            stratify=df['label'],
            random_state=random_state
        )
        
        # Second split: val and test from temp
        val_ratio_adjusted = val_ratio / (val_ratio + test_ratio)
        val_df, test_df = train_test_split(
            temp_df,
            test_size=(1 - val_ratio_adjusted),
            stratify=temp_df['label'],
            random_state=random_state
        )
        
        print(f"Train set: {len(train_df)} samples ({len(train_df)/len(df)*100:.1f}%)")
        print(f"Validation set: {len(val_df)} samples ({len(val_df)/len(df)*100:.1f}%)")
        print(f"Test set: {len(test_df)} samples ({len(test_df)/len(df)*100:.1f}%)")
        
        # Verify balance in each split
        print("\n=== Label Distribution in Splits ===")
        print(f"Train - Fake: {train_df['label'].sum()}, Real: {len(train_df) - train_df['label'].sum()}")
        print(f"Val - Fake: {val_df['label'].sum()}, Real: {len(val_df) - val_df['label'].sum()}")
        print(f"Test - Fake: {test_df['label'].sum()}, Real: {len(test_df) - test_df['label'].sum()}")
        
        return train_df, val_df, test_df
    
    def save_splits(self, train_df: pd.DataFrame, 
                   val_df: pd.DataFrame, 
                   test_df: pd.DataFrame,
                   stats: Dict):
        """Save splits and statistics"""
        # Save splits
        train_path = os.path.join(self.output_dir, 'train.csv')
        val_path = os.path.join(self.output_dir, 'val.csv')
        test_path = os.path.join(self.output_dir, 'test.csv')
        
        train_df.to_csv(train_path, index=False)
        val_df.to_csv(val_path, index=False)
        test_df.to_csv(test_path, index=False)
        
        print(f"\nSaved splits:")
        print(f"  Train: {train_path}")
        print(f"  Val: {val_path}")
        print(f"  Test: {test_path}")
        
        # Save statistics
        stats_path = os.path.join(self.output_dir, 'data_splits_stats.json')
        with open(stats_path, 'w') as f:
            json.dump(stats, f, indent=2)
        print(f"  Stats: {stats_path}")
        
        # Save split info
        split_info = {
            'train_samples': len(train_df),
            'val_samples': len(val_df),
            'test_samples': len(test_df),
            'train_path': train_path,
            'val_path': val_path,
            'test_path': test_path,
            'train_ratio': len(train_df) / (len(train_df) + len(val_df) + len(test_df)),
            'val_ratio': len(val_df) / (len(train_df) + len(val_df) + len(test_df)),
            'test_ratio': len(test_df) / (len(train_df) + len(val_df) + len(test_df)),
        }
        
        split_info_path = os.path.join(self.output_dir, 'data_splits.json')
        with open(split_info_path, 'w') as f:
            json.dump(split_info, f, indent=2)
        print(f"  Split info: {split_info_path}")


def main():
    """Main execution function"""
    base_dir = Path(__file__).resolve().parents[1]
    dataset_path = base_dir / "datasets" / "expanded_fake_jobs.csv"
    
    print("="*80)
    print("PHASE 1.3: DATASET CLEANING, VALIDATION, AND SPLITS")
    print("="*80)
    
    splitter = DataSplitter(dataset_path)
    
    # Load dataset
    df = splitter.load_dataset()
    
    # Clean dataset
    df_clean = splitter.clean_dataset(df)
    
    # Validate dataset
    stats = splitter.validate_dataset(df_clean)
    
    # Create splits
    train_df, val_df, test_df = splitter.create_splits(df_clean)
    
    # Save splits
    splitter.save_splits(train_df, val_df, test_df, stats)
    
    print("\n" + "="*80)
    print("PHASE 1.3 COMPLETE")
    print("="*80)


if __name__ == "__main__":
    main()

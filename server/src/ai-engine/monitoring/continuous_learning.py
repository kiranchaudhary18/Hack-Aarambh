"""
Phase 8: Continuous Learning Feedback Loop
Implements user feedback collection and model retraining
"""

import json
import os
from datetime import datetime
from typing import Dict, List
from pathlib import Path
import pandas as pd
from training.train_model import ModelTrainer


class FeedbackCollector:
    """Collect user feedback on predictions"""

    def __init__(self, feedback_dir: str = None):
        self.feedback_dir = feedback_dir or Path(__file__).resolve().parents[1] / "feedback"
        os.makedirs(self.feedback_dir, exist_ok=True)
        self.feedback_file = os.path.join(self.feedback_dir, "user_feedback.jsonl")

    def collect_feedback(self, prediction: Dict, user_label: int, 
                        user_comment: str = None, confidence: int = None):
        """
        Collect user feedback on a prediction
        
        Args:
            prediction: The original prediction result
            user_label: User's corrected label (0 = Real, 1 = Fake)
            user_comment: Optional user comment
            confidence: User's confidence in their label (1-5)
        """
        feedback_entry = {
            'timestamp': datetime.now().isoformat(),
            'original_prediction': {
                'is_fake': prediction.get('is_fake'),
                'scam_score': prediction.get('scam_score'),
                'verdict': prediction.get('verdict')
            },
            'user_label': user_label,
            'is_correct': prediction.get('is_fake') == user_label,
            'user_comment': user_comment,
            'confidence': confidence,
            'input_text': prediction.get('input_text', '')
        }

        # Write to feedback file
        with open(self.feedback_file, 'a') as f:
            f.write(json.dumps(feedback_entry) + '\n')

    def get_feedback(self, n: int = 100) -> List[Dict]:
        """Get recent feedback entries"""
        if not os.path.exists(self.feedback_file):
            return []

        feedback = []
        with open(self.feedback_file, 'r') as f:
            for line in f:
                feedback.append(json.loads(line))
        
        return feedback[-n:]

    def get_misclassified_examples(self, n: int = 50) -> List[Dict]:
        """Get examples where model was wrong"""
        all_feedback = self.get_feedback()
        misclassified = [f for f in all_feedback if not f['is_correct']]
        return misclassified[-n:]

    def get_feedback_statistics(self) -> Dict:
        """Get statistics on user feedback"""
        feedback = self.get_feedback()
        
        if not feedback:
            return {'error': 'No feedback available'}

        total = len(feedback)
        correct = sum(1 for f in feedback if f['is_correct'])
        accuracy = correct / total if total > 0 else 0

        return {
            'total_feedback': total,
            'correct_predictions': correct,
            'incorrect_predictions': total - correct,
            'accuracy': accuracy,
            'avg_confidence': sum(f.get('confidence', 0) for f in feedback) / total if total > 0 else 0
        }


class ActiveLearningSelector:
    """Select examples for labeling using active learning"""

    def __init__(self, uncertainty_threshold: float = 0.5):
        self.uncertainty_threshold = uncertainty_threshold

    def select_uncertain_examples(self, predictions: List[Dict], 
                                 n: int = 10) -> List[Dict]:
        """
        Select examples with uncertain predictions for user labeling
        
        Args:
            predictions: List of prediction results
            n: Number of examples to select
        
        Returns:
            List of uncertain examples
        """
        uncertain = []
        
        for pred in predictions:
            scam_score = pred.get('scam_score', 50)
            
            # Select examples with scores near threshold
            if 40 <= scam_score <= 60:
                uncertain.append({
                    'prediction': pred,
                    'uncertainty': abs(50 - scam_score),
                    'reason': 'score_near_threshold'
                })
            elif pred.get('confidence') == 'medium':
                uncertain.append({
                    'prediction': pred,
                    'uncertainty': 0.5,
                    'reason': 'medium_confidence'
                })

        # Sort by uncertainty and return top n
        uncertain.sort(key=lambda x: x['uncertainty'], reverse=True)
        return uncertain[:n]

    def select_diverse_examples(self, predictions: List[Dict], 
                               n: int = 10) -> List[Dict]:
        """
        Select diverse examples for labeling
        
        Args:
            predictions: List of prediction results
            n: Number of examples to select
        
        Returns:
            List of diverse examples
        """
        # Group by verdict
        by_verdict = {'Likely Scam': [], 'Suspicious': [], 'Likely Real': []}
        
        for pred in predictions:
            verdict = pred.get('verdict', 'Unknown')
            if verdict in by_verdict:
                by_verdict[verdict].append(pred)

        # Select from each category
        diverse = []
        per_category = max(1, n // 3)
        
        for verdict, examples in by_verdict.items():
            diverse.extend(examples[:per_category])

        return diverse[:n]


class ContinuousLearningPipeline:
    """Pipeline for continuous learning and model updates"""

    def __init__(self):
        self.feedback_collector = FeedbackCollector()
        self.active_learner = ActiveLearningSelector()
        self.model_trainer = ModelTrainer()
        self.feedback_dir = self.feedback_collector.feedback_dir

    def add_feedback(self, prediction: Dict, user_label: int, 
                    user_comment: str = None):
        """Add user feedback"""
        self.feedback_collector.collect_feedback(
            prediction, user_label, user_comment
        )

    def should_retrain(self, min_feedback: int = 50, 
                      accuracy_threshold: float = 0.85) -> Dict:
        """
        Determine if model should be retrained based on feedback
        
        Args:
            min_feedback: Minimum number of feedback entries required
            accuracy_threshold: Accuracy threshold below which retraining is needed
        
        Returns:
            Dict with retrain recommendation
        """
        stats = self.feedback_collector.get_feedback_statistics()
        
        if 'error' in stats:
            return {
                'should_retrain': False,
                'reason': 'insufficient_feedback',
                'stats': stats
            }

        if stats['total_feedback'] < min_feedback:
            return {
                'should_retrain': False,
                'reason': 'insufficient_feedback',
                'required': min_feedback,
                'current': stats['total_feedback']
            }

        if stats['accuracy'] < accuracy_threshold:
            return {
                'should_retrain': True,
                'reason': 'low_accuracy',
                'current_accuracy': stats['accuracy'],
                'threshold': accuracy_threshold
            }

        return {
            'should_retrain': False,
            'reason': 'accuracy_sufficient',
            'current_accuracy': stats['accuracy']
        }

    def prepare_retraining_dataset(self) -> str:
        """
        Prepare dataset for retraining with user feedback
        
        Returns:
            Path to prepared dataset
        """
        # Get misclassified examples
        misclassified = self.feedback_collector.get_misclassified_examples()
        
        if not misclassified:
            return None

        # Create retraining dataset
        retraining_data = []
        for feedback in misclassified:
            retraining_data.append({
                'text': feedback['input_text'],
                'label': feedback['user_label'],
                'source': 'user_feedback',
                'original_prediction': feedback['original_prediction']['is_fake']
            })

        # Save to file
        retraining_file = os.path.join(self.feedback_dir, 'retraining_dataset.csv')
        df = pd.DataFrame(retraining_data)
        df.to_csv(retraining_file, index=False)

        return retraining_file

    def retrain_model(self, retraining_dataset_path: str = None):
        """
        Retrain model with new data
        
        Args:
            retraining_dataset_path: Path to retraining dataset
        """
        if retraining_dataset_path is None:
            retraining_dataset_path = self.prepare_retraining_dataset()

        if not retraining_dataset_path or not os.path.exists(retraining_dataset_path):
            print("No retraining dataset available")
            return False

        print(f"Retraining model with dataset: {retraining_dataset_path}")
        
        # Update trainer to use retraining dataset
        self.model_trainer.dataset_path = retraining_dataset_path
        
        # Train model
        if self.model_trainer.train():
            self.model_trainer.save_model()
            print("Model retrained successfully")
            return True
        
        return False

    def get_learning_progress(self) -> Dict:
        """Get progress of continuous learning"""
        stats = self.feedback_collector.get_feedback_statistics()
        misclassified = self.feedback_collector.get_misclassified_examples()
        
        return {
            'feedback_statistics': stats,
            'misclassified_count': len(misclassified),
            'retrain_recommendation': self.should_retrain()
        }


# Example usage
if __name__ == "__main__":
    print("="*80)
    print("PHASE 8: CONTINUOUS LEARNING FEEDBACK LOOP")
    print("="*80)

    pipeline = ContinuousLearningPipeline()

    # Simulate adding feedback
    test_prediction = {
        'is_fake': True,
        'scam_score': 75,
        'verdict': 'Likely Scam',
        'input_text': 'Test job offer'
    }

    print("\nAdding user feedback...")
    pipeline.add_feedback(test_prediction, user_label=0, user_comment="This is actually real")

    # Get progress
    progress = pipeline.get_learning_progress()
    print(f"\nLearning Progress: {json.dumps(progress, indent=2)}")

    # Check if retraining is needed
    retrain_check = pipeline.should_retrain()
    print(f"\nRetrain Check: {json.dumps(retrain_check, indent=2)}")

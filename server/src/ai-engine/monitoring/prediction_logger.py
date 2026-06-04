"""
Phase 7: Monitoring and Logging System
Logs all predictions with metadata for tracking and analysis
"""

import json
import os
from datetime import datetime
from typing import Dict, List
from pathlib import Path
import pandas as pd


class PredictionLogger:
    """Log predictions for monitoring and analysis"""

    def __init__(self, log_dir: str = None):
        self.log_dir = log_dir or Path(__file__).resolve().parents[1] / "logs"
        os.makedirs(self.log_dir, exist_ok=True)
        
        self.log_file = os.path.join(self.log_dir, "predictions.jsonl")
        self.metrics_file = os.path.join(self.log_dir, "metrics.json")
        
        # Initialize metrics
        self.metrics = {
            'total_predictions': 0,
            'fake_predictions': 0,
            'real_predictions': 0,
            'high_confidence_fake': 0,
            'high_confidence_real': 0,
            'model_usage': {
                'logistic_regression': 0,
                'roberta': 0
            }
        }

    def log_prediction(self, prediction: Dict, input_text: str = None):
        """Log a single prediction"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'input_text': input_text or prediction.get('input_text', ''),
            'input_length': len(input_text) if input_text else prediction.get('input_length', 0),
            'is_fake': prediction.get('is_fake', False),
            'scam_score': prediction.get('scam_score', 0),
            'verdict': prediction.get('verdict', 'Unknown'),
            'model_used': prediction.get('scoring_breakdown', {}).get('model_used', 'unknown'),
            'confidence': prediction.get('confidence', 'unknown'),
            'reasons': prediction.get('reasons', [])
        }

        # Write to log file
        with open(self.log_file, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')

        # Update metrics
        self._update_metrics(log_entry)

    def _update_metrics(self, log_entry: Dict):
        """Update metrics based on log entry"""
        self.metrics['total_predictions'] += 1
        
        if log_entry['is_fake']:
            self.metrics['fake_predictions'] += 1
            if log_entry['scam_score'] > 80:
                self.metrics['high_confidence_fake'] += 1
        else:
            self.metrics['real_predictions'] += 1
            if log_entry['scam_score'] < 20:
                self.metrics['high_confidence_real'] += 1
        
        model_used = log_entry['model_used']
        if model_used in self.metrics['model_usage']:
            self.metrics['model_usage'][model_used] += 1

    def save_metrics(self):
        """Save metrics to file"""
        with open(self.metrics_file, 'w') as f:
            json.dump(self.metrics, f, indent=2)

    def load_metrics(self):
        """Load metrics from file"""
        if os.path.exists(self.metrics_file):
            with open(self.metrics_file, 'r') as f:
                self.metrics = json.load(f)
        return self.metrics

    def get_metrics(self) -> Dict:
        """Get current metrics"""
        return self.metrics

    def get_recent_predictions(self, n: int = 100) -> List[Dict]:
        """Get recent n predictions from log"""
        if not os.path.exists(self.log_file):
            return []

        predictions = []
        with open(self.log_file, 'r') as f:
            for line in f:
                predictions.append(json.loads(line))
        
        # Return last n predictions
        return predictions[-n:]

    def analyze_predictions(self) -> Dict:
        """Analyze prediction patterns"""
        predictions = self.get_recent_predictions(1000)
        
        if not predictions:
            return {'error': 'No predictions to analyze'}

        df = pd.DataFrame(predictions)
        
        analysis = {
            'total_analyzed': len(predictions),
            'fake_percentage': (df['is_fake'].sum() / len(df)) * 100,
            'real_percentage': (100 - (df['is_fake'].sum() / len(df)) * 100),
            'avg_scam_score': df['scam_score'].mean(),
            'score_distribution': {
                'high_risk': len(df[df['scam_score'] >= 70]),
                'medium_risk': len(df[(df['scam_score'] >= 50) & (df['scam_score'] < 70)]),
                'low_risk': len(df[df['scam_score'] < 50])
            },
            'verdict_distribution': df['verdict'].value_counts().to_dict(),
            'model_usage': df['model_used'].value_counts().to_dict()
        }

        return analysis

    def clear_logs(self):
        """Clear all logs (use with caution)"""
        if os.path.exists(self.log_file):
            os.remove(self.log_file)
        
        # Reset metrics
        self.metrics = {
            'total_predictions': 0,
            'fake_predictions': 0,
            'real_predictions': 0,
            'high_confidence_fake': 0,
            'high_confidence_real': 0,
            'model_usage': {
                'logistic_regression': 0,
                'roberta': 0
            }
        }
        self.save_metrics()


class PerformanceTracker:
    """Track model performance over time"""

    def __init__(self, log_dir: str = None):
        self.log_dir = log_dir or Path(__file__).resolve().parents[1] / "logs"
        os.makedirs(self.log_dir, exist_ok=True)
        self.performance_file = os.path.join(self.log_dir, "performance.json")
        self.performance_history = self._load_history()

    def _load_history(self) -> List[Dict]:
        """Load performance history"""
        if os.path.exists(self.performance_file):
            with open(self.performance_file, 'r') as f:
                return json.load(f)
        return []

    def log_performance(self, metrics: Dict):
        """Log performance metrics"""
        entry = {
            'timestamp': datetime.now().isoformat(),
            'metrics': metrics
        }
        self.performance_history.append(entry)
        self._save_history()

    def _save_history(self):
        """Save performance history"""
        with open(self.performance_file, 'w') as f:
            json.dump(self.performance_history, f, indent=2)

    def get_performance_trend(self, metric_name: str = 'accuracy') -> List[Dict]:
        """Get trend for a specific metric"""
        trend = []
        for entry in self.performance_history:
            if metric_name in entry['metrics']:
                trend.append({
                    'timestamp': entry['timestamp'],
                    'value': entry['metrics'][metric_name]
                })
        return trend

    def check_performance_degradation(self, threshold: float = 0.1) -> Dict:
        """Check if performance has degraded"""
        if len(self.performance_history) < 2:
            return {'status': 'insufficient_data'}

        latest = self.performance_history[-1]['metrics']
        previous = self.performance_history[-2]['metrics']

        degradation = {}
        for key in latest:
            if key in previous and isinstance(latest[key], (int, float)):
                change = latest[key] - previous[key]
                if change < -threshold:
                    degradation[key] = {
                        'change': change,
                        'previous': previous[key],
                        'latest': latest[key]
                    }

        if degradation:
            return {
                'status': 'degradation_detected',
                'degraded_metrics': degradation
            }
        else:
            return {'status': 'no_degradation'}


# Example usage
if __name__ == "__main__":
    print("="*80)
    print("PHASE 7: MONITORING AND LOGGING")
    print("="*80)

    logger = PredictionLogger()

    # Log some test predictions
    test_predictions = [
        {
            'is_fake': True,
            'scam_score': 85,
            'verdict': 'Likely Scam',
            'scoring_breakdown': {'model_used': 'logistic_regression'},
            'confidence': 'high',
            'reasons': ['Payment demand detected']
        },
        {
            'is_fake': False,
            'scam_score': 15,
            'verdict': 'Likely Real',
            'scoring_breakdown': {'model_used': 'logistic_regression'},
            'confidence': 'high',
            'reasons': []
        }
    ]

    for pred in test_predictions:
        logger.log_prediction(pred)

    # Get metrics
    metrics = logger.get_metrics()
    print(f"\nMetrics: {json.dumps(metrics, indent=2)}")

    # Analyze predictions
    analysis = logger.analyze_predictions()
    print(f"\nAnalysis: {json.dumps(analysis, indent=2)}")

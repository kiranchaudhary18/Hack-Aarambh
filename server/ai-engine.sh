#!/bin/bash
# AI Engine Setup Script

echo "Setting up AI Engine..."

# Navigate to ai-engine directory
cd "$(dirname "$0")/src/ai-engine" || exit 1

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Training ML model..."
python3 training/train_model.py

echo "Running AI engine tests..."
python3 -m pytest api/test_predict.py -v

echo "AI Engine setup complete!"

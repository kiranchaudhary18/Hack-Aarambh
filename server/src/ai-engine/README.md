# Mark-2 AI Model System

Advanced AI-powered scam detection system for job offers, emails, and documents using Andrej Karpathy's training methodology.

## Overview

Mark-2 is a three-model AI system designed to detect scams in job offers, emails, and documents with high accuracy. The system uses:

- **text_analysis.pt**: DistilBERT-based text classifier for message analysis
- **doc_analysis.pt**: Vision Transformer (ViT) for document/image analysis  
- **Mark_2.pt**: Neural routing logic for intelligent model coordination

## Features

- **Multi-modal Analysis**: Analyzes both text and documents
- **Intelligent Routing**: Automatically selects best analysis method
- **Confidence-based Decisions**: Provides confidence scores for predictions
- **CPU/GPU Support**: Optimized for both CPU and GPU training
- **Andrej Karpathy Methodology**: Follows modern ML training practices
- **Production Ready**: Integrated with NestJS backend

## Architecture

```
Input (Text + Document)
    ↓
Mark-2 Router
    ↓
├── Text Analysis (text_analysis.pt)
│   └── DistilBERT → Scam Probability
├── Document Analysis (doc_analysis.pt)  
│   └── ViT → Scam Probability
└── Routing Logic (Mark_2.pt)
    └── MLP → Final Decision
    ↓
Output (Scam Score + Reasons)
```

## Quick Start

### Installation

```bash
cd server/src/ai-engine
pip install -r requirements.txt
```

### Training

Train all three models:

```bash
# Text model
python training/train_text_model.py --epochs 5 --batch_size 8

# Document model  
python training/train_doc_model.py --epochs 8 --batch_size 4

# Mark-2 router
python training/train_mark2.py --epochs 10 --batch_size 16
```

### Inference

```bash
# Test text analysis
python inference/text_inference.py

# Test document analysis
python inference/doc_inference.py

# Test Mark-2 router
python inference/mark2_router.py
```

## Directory Structure

```
ai-engine/
├── models/                    # Trained models (.pt files)
│   ├── text_analysis.pt      # Text classifier
│   ├── doc_analysis.pt       # Document classifier
│   └── Mark_2.pt            # Routing model
├── training/                 # Training scripts
│   ├── train_text_model.py   # Text model training
│   ├── train_doc_model.py    # Document model training
│   ├── train_mark2.py        # Mark-2 router training
│   └── utils.py              # Common utilities
├── inference/                # Inference scripts
│   ├── text_inference.py    # Text analysis
│   ├── doc_inference.py     # Document analysis
│   └── mark2_router.py       # Mark-2 routing
├── datasets/                 # Training data
│   ├── text_data/           # Text datasets
│   └── doc_data/            # Document datasets
├── config/                   # Configuration files
│   ├── model_config.yaml    # Model architecture
│   └── training_config.yaml # Training settings
├── api/                      # API integration
│   └── predict.py           # Main prediction API
├── requirements.txt          # Python dependencies
├── testing.md               # Complete training guide
└── README.md                # This file
```

## Model Specifications

### text_analysis.pt
- **Architecture**: DistilBERT-base-uncased
- **Parameters**: 82M
- **Input**: Text (max 512 tokens)
- **Output**: Scam probability (0-1)
- **Training Time**: ~30-45 min (GPU), ~2-3 hours (CPU)
- **Target Accuracy**: >85%

### doc_analysis.pt
- **Architecture**: ViT-base-patch16-224
- **Parameters**: 86M
- **Input**: Images (224x224)
- **Output**: Scam probability (0-1)
- **Training Time**: ~1-1.5 hours (GPU), ~4-6 hours (CPU)
- **Target Accuracy**: >80%

### Mark_2.pt
- **Architecture**: Custom MLP (4→128→64→2)
- **Parameters**: 50K
- **Input**: [text_score, text_conf, doc_score, doc_conf]
- **Output**: Final scam decision
- **Training Time**: ~10-15 min (GPU), ~20-30 min (CPU)
- **Target Accuracy**: >90%

## Hardware Requirements

### Minimum Requirements
- **CPU**: Intel Core i5 11th Gen or equivalent
- **RAM**: 16GB
- **Storage**: 512GB SSD
- **Python**: 3.10+

### Recommended Requirements
- **GPU**: NVIDIA RTX 2050 (4GB VRAM) or better
- **RAM**: 32GB
- **CUDA**: 11.8

## Usage Examples

### Python API

```python
from api.predict import Mark2PredictionAPI

# Initialize API
api = Mark2PredictionAPI()

# Analyze text
result = api.predict_text("Your job offer text here")
print(result)

# Analyze document
with open('document.png', 'rb') as f:
    image_buffer = f.read()
result = api.predict_document(image_buffer)
print(result)

# Combined analysis
result = api.predict_combined(text, image_buffer)
print(result)
```

### NestJS Integration

The system is integrated with the NestJS backend:

```typescript
// Service automatically calls Mark-2 API
const result = await this.aiEngine.analyzeText(jobOfferText);
```

## Configuration

Edit `config/model_config.yaml` to customize:

- Model architectures
- Training hyperparameters
- Routing logic thresholds
- Hardware settings

Example:
```yaml
routing_logic:
  text_threshold: 0.8
  doc_threshold: 0.8
```

## Performance

### Expected Accuracy
- Text Analysis: 85-95%
- Document Analysis: 80-90%
- Mark-2 Routing: 90-95%

### Inference Time
- Text only: 200-300ms
- Document only: 300-400ms
- Combined: 400-500ms

## Training Data

The system automatically creates synthetic datasets for training. For production use, provide your own labeled data:

### Text Data Format
```csv
text,label
"Scam job offer text",1
"Legitimate job offer text",0
```

### Document Data Format
```
images/
├── scam/
│   └── scam_documents.png
└── legit/
    └── legitimate_documents.png
```

## Troubleshooting

### CUDA Out of Memory
Reduce batch size:
```bash
python training/train_text_model.py --batch_size 4
```

### CPU Training Slow
Expected behavior. CPU is 3-5x slower than GPU. Consider:
- Reducing epochs
- Running overnight
- Using smaller batch sizes

### Model Not Found
Ensure models are in `models/` directory:
```bash
ls -la models/
```

## Complete Training Guide

For detailed training instructions, see [testing.md](testing.md).

## Andrej Karpathy Methodology

This system follows Andrej Karpathy's training principles:
- Minimal, hackable code
- Compute-optimal models
- Clear evaluation metrics
- Reproducible training
- Educational focus

## Integration with Scansniff Project

Mark-2 is designed for the Scansniff project to detect:
- Fake job offers
- Scam emails
- Fraudulent documents
- Phishing attempts

## License

MIT License - See project LICENSE file

## Contributing

To improve the models:
1. Collect more training data
2. Fine-tune hyperparameters
3. Add new scam patterns
4. Improve routing logic

## Support

For detailed training and installation instructions, refer to [testing.md](testing.md).

## Citation

If you use Mark-2 in your project, please cite:

```bibtex
@misc{mark2-ai,
  title = "Mark-2 AI Model System for Scam Detection",
  author = "Your Name",
  year = "2026",
  publisher = "GitHub",
  url = "https://github.com/yourusername/scansniff"
}
```

## Acknowledgments

- Inspired by Andrej Karpathy's [nanochat](https://github.com/karpathy/nanochat)
- HuggingFace Transformers library
- PyTorch framework
- Vision Transformer architecture

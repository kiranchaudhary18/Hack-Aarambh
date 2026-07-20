# Mark-2 AI Model Training and Installation Guide

Complete guide for training and deploying the Mark-2 AI Model System for scam detection in job offers, emails, and documents.

## System Requirements

### Hardware Requirements
- **CPU**: Intel Core i5 11th Gen or equivalent
- **RAM**: 16GB minimum (32GB recommended)
- **Storage**: 512GB SSD minimum
- **GPU**: NVIDIA RTX 2050 (4GB VRAM) or equivalent
- **OS**: Linux (Ubuntu 20.04+) or Windows 10/11 with WSL2

### Software Requirements
- Python 3.10 or higher
- pip package manager
- CUDA 11.8 (for GPU training)
- Git

## Installation Steps

### 1. Navigate to AI Engine Directory

```bash
cd /home/narvin/Documents/Web/HackAarambh/server/src/ai-engine
```

### 2. Create Virtual Environment (Recommended)

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**If installing with GPU support:**
```bash
pip install torch==2.0.1 --index-url https://download.pytorch.org/whl/cu118
```

**For CPU-only installation:**
```bash
pip install torch==2.0.1 --index-url https://download.pytorch.org/whl/cpu
```

### 4. Verify Installation

```bash
python -c "import torch; print(f'PyTorch version: {torch.__version__}'); print(f'CUDA available: {torch.cuda.is_available()}')"
```

## Dataset Preparation

The training scripts will automatically create synthetic datasets if they don't exist. However, for production use, you should provide your own labeled datasets.

### Text Dataset Format

Create CSV files in `datasets/text_data/`:

**train.csv:**
```csv
text,label
"Congratulations! You have been selected for a high-paying position. Pay ₹5000 registration fee immediately.",1
"Thank you for applying to Google. We have received your application for Software Engineer position.",0
```

**Columns:**
- `text`: The job offer/message text
- `label`: 1 for scam, 0 for legitimate

### Document Dataset Format

Organize images in `datasets/doc_data/images/`:

```
datasets/doc_data/images/
├── train/
│   ├── scam/
│   │   ├── scam_doc_1.png
│   │   └── scam_doc_2.png
│   └── legit/
│       ├── legit_doc_1.png
│       └── legit_doc_2.png
└── val/
    ├── scam/
    └── legit/
```

**Image Requirements:**
- Format: PNG, JPG, JPEG, BMP, or GIF
- Recommended size: 224x224 pixels (will be auto-resized)
- Color: RGB (will be auto-converted)

## Training Steps

### Phase 1: Train Text Analysis Model (text_analysis.pt)

**GPU Training (Recommended):**
```bash
python training/train_text_model.py \
    --epochs 5 \
    --batch_size 8 \
    --learning_rate 2e-5 \
    --max_length 512
```

**CPU Training (Slower):**
```bash
python training/train_text_model.py \
    --epochs 5 \
    --batch_size 4 \
    --learning_rate 2e-5 \
    --max_length 512 \
    --cpu
```

**Expected Training Time:**
- GPU (RTX 2050): ~30-45 minutes
- CPU (i5 11th Gen): ~2-3 hours

**Expected Output:**
- Model saved as: `models/text_analysis.pt`
- Target accuracy: >85%

### Phase 2: Train Document Analysis Model (doc_analysis.pt)

**GPU Training (Recommended):**
```bash
python training/train_doc_model.py \
    --epochs 8 \
    --batch_size 4 \
    --learning_rate 3e-5
```

**CPU Training (Slower):**
```bash
python training/train_doc_model.py \
    --epochs 8 \
    --batch_size 2 \
    --learning_rate 3e-5 \
    --cpu
```

**Expected Training Time:**
- GPU (RTX 2050): ~1-1.5 hours
- CPU (i5 11th Gen): ~4-6 hours

**Expected Output:**
- Model saved as: `models/doc_analysis.pt`
- Target accuracy: >80%

### Phase 3: Train Mark-2 Routing Model (Mark_2.pt)

**GPU Training:**
```bash
python training/train_mark2.py \
    --epochs 10 \
    --batch_size 16 \
    --hidden_size 128 \
    --learning_rate 1e-3
```

**CPU Training:**
```bash
python training/train_mark2.py \
    --epochs 10 \
    --batch_size 8 \
    --hidden_size 128 \
    --learning_rate 1e-3 \
    --cpu
```

**Expected Training Time:**
- GPU (RTX 2050): ~10-15 minutes
- CPU (i5 11th Gen): ~20-30 minutes

**Expected Output:**
- Model saved as: `models/Mark_2.pt`
- Configuration saved as: `models/Mark_2_config.json`
- Target accuracy: >90%

## Testing Trained Models

### Test Text Analysis

```bash
python inference/text_inference.py
```

**Expected Output:**
```
Text Analysis Inference Test
Loading text model from models/text_analysis.pt...
Text model loaded successfully

--- Scam Text Test ---
Input: Congratulations! You have been selected...
Prediction: SCAM
Scam Probability: 0.9234
Confidence: 0.9234

--- Legitimate Text Test ---
Input: Thank you for applying to Google...
Prediction: LEGITIMATE
Scam Probability: 0.0876
Confidence: 0.9124
```

### Test Document Analysis

```bash
python inference/doc_inference.py
```

### Test Mark-2 Router

```bash
python inference/mark2_router.py
```

### Test API Integration

```bash
python api/predict.py --text "Your test message here"
```

**With image:**
```bash
python api/predict.py --text "Your test message" --image path/to/image.png
```

## Integration with NestJS Backend

The Mark-2 system is already integrated with the NestJS backend. The integration is handled by:

1. **Service**: `server/src/analysis/ai-engine.service.ts`
2. **Controller**: `server/src/analysis/analysis.controller.ts`
3. **API Endpoint**: `POST /analysis/text`

### Testing NestJS Integration

1. Start the NestJS server:
```bash
cd /home/narvin/Documents/Web/HackAarambh/server
npm run start:dev
```

2. Test the API endpoint:
```bash
curl -X POST http://localhost:3000/analysis/text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"text": "Congratulations! You have been selected for a high-paying position. Pay ₹5000 registration fee immediately."}'
```

**Expected Response:**
```json
{
  "isFake": true,
  "score": 92,
  "reasons": [
    "High scam probability detected",
    "Text contains scam patterns",
    "High confidence prediction"
  ],
  "verdict": "Likely Scam"
}
```

## Troubleshooting

### CUDA Out of Memory

**Problem:** Training fails with CUDA out of memory error.

**Solution:** Reduce batch size
```bash
python training/train_text_model.py --batch_size 4  # Reduce from 8
python training/train_doc_model.py --batch_size 2  # Reduce from 4
```

### Slow Training on CPU

**Problem:** Training is extremely slow on CPU.

**Solution:** This is expected. CPU training is 3-5x slower than GPU. Consider:
- Reducing epochs: `--epochs 3`
- Using smaller batch sizes: `--batch_size 2`
- Running overnight for long training sessions

### Model Not Found

**Problem:** Error "Model file not found" during inference.

**Solution:** Ensure models are in the correct directory:
```bash
ls -la models/
# Should show: text_analysis.pt, doc_analysis.pt, Mark_2.pt
```

### Poor Accuracy

**Problem:** Model accuracy is below expected thresholds.

**Solution:**
- Increase training epochs: `--epochs 10`
- Add more training data
- Check data quality and labeling
- Try different learning rates: `--learning_rate 1e-5`

### Import Errors

**Problem:** Python import errors for transformers or torch.

**Solution:** Reinstall dependencies:
```bash
pip install --upgrade -r requirements.txt
```

## Performance Optimization

### GPU Optimization

For RTX 2050 (4GB VRAM):
- Use mixed precision training (enabled by default)
- Gradient accumulation for larger effective batch sizes
- Reduce image size if needed: modify `image_size` in config

### CPU Optimization

For CPU-only training:
- Reduce batch sizes to 2-4
- Disable data augmentation
- Use PyTorch CPU optimizations
- Consider using fewer model layers

## Model Deployment

### Production Deployment

1. **Move trained models to production:**
```bash
cp models/*.pt /path/to/production/models/
```

2. **Update model paths in configuration:**
```yaml
# config/model_config.yaml
paths:
  models_dir: "/path/to/production/models"
```

3. **Restart NestJS server:**
```bash
npm run start:prod
```

### Monitoring

Monitor model performance in production:
- Track prediction accuracy
- Monitor inference time (target: <500ms per request)
- Log confidence scores
- Collect feedback for retraining

## Retraining and Updates

### When to Retrain

- Accuracy drops below 80%
- New scam patterns emerge
- Dataset size increases significantly
- Model performance degrades over time

### Retraining Process

1. Collect new labeled data
2. Add to existing datasets
3. Re-run training scripts
4. Validate new models
5. Deploy after testing

## Advanced Configuration

### Custom Model Architectures

Edit `config/model_config.yaml` to customize:
- Model architectures
- Training hyperparameters
- Routing logic thresholds
- Hardware settings

### Custom Datasets

For custom datasets:
1. Prepare data in specified format
2. Update paths in `config/training_config.yaml`
3. Run training scripts with custom data paths

## Support and Resources

### Documentation
- Andrej Karpathy's nanochat: https://github.com/karpathy/nanochat
- HuggingFace Transformers: https://huggingface.co/docs/transformers
- PyTorch Documentation: https://pytorch.org/docs

### Model Specifications
- **text_analysis.pt**: DistilBERT-base, 82M parameters
- **doc_analysis.pt**: ViT-base, 86M parameters  
- **Mark_2.pt**: Custom MLP, 50K parameters

### Expected Performance
- **Text Analysis**: 85-95% accuracy
- **Document Analysis**: 80-90% accuracy
- **Mark-2 Routing**: 90-95% accuracy
- **Inference Time**: 200-500ms per request

## Summary

This guide provides complete instructions for:
1. ✅ Installing dependencies
2. ✅ Preparing datasets
3. ✅ Training all three models
4. ✅ Testing model performance
5. ✅ Integrating with NestJS backend
6. ✅ Troubleshooting common issues
7. ✅ Optimizing for your hardware

**Total Training Time (RTX 2050):** ~2-3 hours
**Total Training Time (CPU only):** ~8-12 hours

For questions or issues, refer to the troubleshooting section or check the model configuration files.

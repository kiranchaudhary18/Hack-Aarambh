import subprocess
import sys
import json
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api.predict_hybrid_v2 import PredictionEngineV2

def analyze_job_text(text: str) -> dict:
    """
    Python entry point for NestJS to call AI engine
    Accepts text via stdin and returns JSON result
    """
    try:
        engine = PredictionEngineV2(use_roberta=True)
        result = engine.predict(text)
        return result
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e),
            "scam_score": 50,
            "verdict": "Analysis Error"
        }))
        sys.exit(1)

if __name__ == '__main__':
    # Read input from stdin
    input_data = sys.stdin.read()

    try:
        data = json.loads(input_data)
        text = data.get('text', '')
    except:
        text = input_data

    result = analyze_job_text(text)
    print(json.dumps(result))

"""
Phase 4: Embedding Extractor
Extracts sentence embeddings using SBERT for semantic similarity
"""

import os
from typing import List, Dict
import numpy as np
from sentence_transformers import SentenceTransformer


class EmbeddingExtractor:
    """Extract sentence embeddings using SBERT"""

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self._load_model()

    def _load_model(self):
        """Load SBERT model"""
        try:
            print(f"Loading SBERT model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            print("SBERT model loaded successfully")
        except Exception as e:
            print(f"Error loading SBERT model: {e}")
            print("Embedding features will be unavailable")

    def is_available(self) -> bool:
        """Check if embedding model is available"""
        return self.model is not None

    def extract_embedding(self, text: str) -> np.ndarray:
        """Extract embedding for a single text"""
        if not self.is_available():
            return None

        try:
            embedding = self.model.encode(text, show_progress_bar=False)
            return embedding
        except Exception as e:
            print(f"Error extracting embedding: {e}")
            return None

    def extract_embeddings_batch(self, texts: List[str]) -> List[np.ndarray]:
        """Extract embeddings for multiple texts"""
        if not self.is_available():
            return [None] * len(texts)

        try:
            embeddings = self.model.encode(texts, show_progress_bar=False)
            return embeddings
        except Exception as e:
            print(f"Error extracting batch embeddings: {e}")
            return [None] * len(texts)

    def compute_similarity(self, text1: str, text2: str) -> float:
        """Compute cosine similarity between two texts"""
        if not self.is_available():
            return 0.0

        try:
            emb1 = self.extract_embedding(text1)
            emb2 = self.extract_embedding(text2)

            if emb1 is None or emb2 is None:
                return 0.0

            # Cosine similarity
            similarity = np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2))
            return float(similarity)
        except Exception as e:
            print(f"Error computing similarity: {e}")
            return 0.0

    def find_most_similar(self, query_text: str, candidate_texts: List[str], top_k: int = 5) -> List[Dict]:
        """Find most similar texts to query"""
        if not self.is_available():
            return []

        try:
            query_embedding = self.extract_embedding(query_text)
            if query_embedding is None:
                return []

            candidate_embeddings = self.extract_embeddings_batch(candidate_texts)

            # Compute similarities
            similarities = []
            for i, candidate_emb in enumerate(candidate_embeddings):
                if candidate_emb is not None:
                    sim = np.dot(query_embedding, candidate_emb) / (
                        np.linalg.norm(query_embedding) * np.linalg.norm(candidate_emb)
                    )
                    similarities.append({
                        'text': candidate_texts[i],
                        'similarity': float(sim),
                        'index': i
                    })

            # Sort by similarity and return top_k
            similarities.sort(key=lambda x: x['similarity'], reverse=True)
            return similarities[:top_k]
        except Exception as e:
            print(f"Error finding most similar: {e}")
            return []


# Example usage
if __name__ == "__main__":
    extractor = EmbeddingExtractor()

    test_texts = [
        "Pay ₹500 registration fee for job",
        "Google is hiring software engineers",
        "Work from home data entry job"
    ]

    print("="*80)
    print("EMBEDDING EXTRACTOR TEST")
    print("="*80)

    # Extract single embedding
    print("\nExtracting embedding for single text:")
    emb = extractor.extract_embedding(test_texts[0])
    if emb is not None:
        print(f"Embedding shape: {emb.shape}")
        print(f"First 5 values: {emb[:5]}")

    # Compute similarity
    print("\nComputing similarity between texts:")
    sim = extractor.compute_similarity(test_texts[0], test_texts[1])
    print(f"Similarity between text 1 and text 2: {sim:.4f}")

    # Find most similar
    print("\nFinding most similar texts:")
    query = "Urgent job offer with payment required"
    similar = extractor.find_most_similar(query, test_texts)
    for item in similar:
        print(f"Text: {item['text'][:50]}... | Similarity: {item['similarity']:.4f}")

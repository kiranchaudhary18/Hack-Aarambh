import unittest
from api.predict import PredictionEngine

class TestPredictionEngine(unittest.TestCase):
    """Phase 9: Testing Strategy"""

    def setUp(self):
        """Initialize prediction engine for tests"""
        self.engine = PredictionEngine()

    def test_fake_offer_with_payment(self):
        """Test Case 1: Fake offer with payment demand"""
        text = "Pay ₹500 registration fee and get job"
        result = self.engine.predict(text)

        self.assertTrue(result['success'])
        self.assertTrue(result['is_fake'])
        self.assertGreater(result['scam_score'], 60)
        self.assertIn("Payment", str(result['reasons']))

    def test_real_offer_from_known_company(self):
        """Test Case 2: Real job offer"""
        text = "Google is hiring Software Engineers. Visit careers.google.com"
        result = self.engine.predict(text)

        self.assertTrue(result['success'])
        self.assertFalse(result['is_fake'])
        self.assertLess(result['scam_score'], 50)

    def test_suspicious_high_salary(self):
        """Test Case 3: Suspicious high salary"""
        text = "Fresher job ₹80,000 per month easy work from home"
        result = self.engine.predict(text)

        self.assertTrue(result['success'])
        self.assertTrue(result['is_fake'])

    def test_urgency_tactics(self):
        """Test Case 4: Urgency tactics"""
        text = "URGENT! Limited time offer. Apply within 2 hours"
        result = self.engine.predict(text)

        self.assertTrue(result['success'])
        # Should be flagged as suspicious
        self.assertGreater(result['scam_score'], 30)

    def test_empty_input(self):
        """Test Case 5: Empty input"""
        text = ""
        result = self.engine.predict(text)

        self.assertFalse(result['success'])

    def test_short_message(self):
        """Test Case 6: Short message"""
        text = "Job offer"
        result = self.engine.predict(text)

        self.assertTrue(result['success'])
        self.assertIn("short", str(result).lower() or "unusual" in str(result).lower())

    def test_multiple_red_flags(self):
        """Test Case 7: Multiple red flags"""
        text = "URGENT!!! Pay ₹1000 fee. Earn ₹100,000/month. Contact recruiter@gmail.com NOW!"
        result = self.engine.predict(text)

        self.assertTrue(result['success'])
        self.assertTrue(result['is_fake'])
        self.assertGreater(result['scam_score'], 80)
        self.assertGreater(len(result['detailed_reasons']), 2)

    def test_response_structure(self):
        """Test Case 8: Response structure"""
        text = "Sample job text"
        result = self.engine.predict(text)

        # Check all required fields are present
        self.assertIn('success', result)
        self.assertIn('is_fake', result)
        self.assertIn('scam_score', result)
        self.assertIn('verdict', result)
        self.assertIn('reasons', result)
        self.assertIn('detailed_reasons', result)
        self.assertIn('scoring_breakdown', result)
        self.assertIn('confidence', result)

    def test_score_range(self):
        """Test Case 9: Score is within valid range"""
        test_texts = [
            "Fake: Pay ₹500",
            "Real: Google careers",
            "Suspicious: Work from home"
        ]

        for text in test_texts:
            result = self.engine.predict(text)
            self.assertGreaterEqual(result['scam_score'], 0)
            self.assertLessEqual(result['scam_score'], 100)

    def test_verdict_consistency(self):
        """Test Case 10: Verdict is consistent with score"""
        text = "URGENT! Pay now for job"
        result = self.engine.predict(text)

        if result['is_fake']:
            self.assertIn(result['verdict'], ["Likely Scam", "Suspicious"])
        else:
            self.assertEqual(result['verdict'], "Likely Real")

if __name__ == '__main__':
    unittest.main()

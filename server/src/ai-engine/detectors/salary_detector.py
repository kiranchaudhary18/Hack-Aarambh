import re
from typing import Dict, List


class SalaryDetector:
    """Detect salary-related patterns and unrealistic salary claims"""

    def __init__(self):
        self.fresher_salary_threshold = 50000  # ₹50k+ suspicious for fresher
        self.mid_salary_threshold = 200000  # ₹2L+ very suspicious

    def extract_salary_values(self, text: str) -> List[int]:
        """Extract numeric salary values from text"""
        # Match patterns like: 80000, ₹80000, 80,000, etc.
        patterns = [
            r"₹\s*(\d{1,3}(?:,\d{3})*|\d+)",
            r"(\d{1,3}(?:,\d{3})*|\d+)(?:\s*(?:per|/)\s*month|per month|month)",
            r"(?:salary|income|earn|earning)\s*(?:of|:)?\s*(?:₹)?(\d{1,3}(?:,\d{3})*|\d+)",
        ]

        salaries = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                # Remove commas and convert to int
                salary = int(match.replace(",", ""))
                salaries.append(salary)

        return list(set(salaries))  # Remove duplicates

    def is_unrealistic_salary(self, salary: int) -> bool:
        """Check if salary is unrealistic for a fresher"""
        return salary >= self.fresher_salary_threshold

    def detect_salary_issues(self, text: str) -> Dict:
        """Analyze salary-related fraud signals"""
        salaries = self.extract_salary_values(text)

        unrealistic_salaries = [s for s in salaries if self.is_unrealistic_salary(s)]
        very_high_salaries = [s for s in salaries if s >= self.mid_salary_threshold]

        return {
            "salaries_found": salaries,
            "unrealistic_count": len(unrealistic_salaries),
            "unrealistic_salaries": unrealistic_salaries,
            "very_high_salaries": very_high_salaries,
            "is_suspicious": len(unrealistic_salaries) > 0,
        }


# Example usage
if __name__ == "__main__":
    detector = SalaryDetector()
    text = "Fresher job offer: ₹80,000 per month"
    result = detector.detect_salary_issues(text)
    print(f"Salary detection: {result}")

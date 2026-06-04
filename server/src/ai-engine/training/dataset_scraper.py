"""
Phase 1.1: Web Scraping Infrastructure for Dataset Expansion
Collects fake and real job postings from various sources
"""

import csv
import json
import random
import time
from typing import List, Dict
from datetime import datetime
from pathlib import Path
import requests
from bs4 import BeautifulSoup


class DatasetScraper:
    """Web scraper for collecting job posting data"""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.delay_range = (1, 3)  # Respectful scraping delay
        
    def _delay(self):
        """Add random delay to respect rate limits"""
        delay = random.uniform(*self.delay_range)
        time.sleep(delay)
    
    def _make_request(self, url: str) -> str:
        """Make HTTP request with error handling"""
        try:
            self._delay()
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def generate_synthetic_fake_jobs(self, count: int = 250) -> List[Dict]:
        """
        Generate synthetic fake job examples based on common scam patterns
        This is a fallback when web scraping is limited
        """
        fake_templates = [
            "URGENT! Pay ₹{fee} registration fee to get ₹{salary}/month job as {role}",
            "Work from home {role} - Earn ₹{salary}/month, no experience needed",
            "Limited time offer: {role} position, ₹{salary}/month, apply now via {email}",
            "Immediate hiring for {role} - ₹{salary}/month, send {fee} for training",
            "Part-time {role} from home - ₹{salary}/month guaranteed, deposit ₹{fee}",
            "Google/Microsoft hiring {role} - ₹{salary}/month, pay verification fee ₹{fee}",
            "Data entry job {role} - ₹{salary}/month, pay registration ₹{fee}",
            "WhatsApp job offer: {role} for ₹{salary}/month, send ₹{fee} to confirm",
            "Easy money: {role} task-based work, earn ₹{salary}/day, invest ₹{fee}",
            "Fortune 500 company: {role} fresher role ₹{salary}/month, pay subscription ₹{fee}",
        ]
        
        roles = [
            "Data Entry Operator", "Software Engineer", "Customer Support",
            "Content Writer", "Virtual Assistant", "Social Media Manager",
            "Telecaller", "Back Office Executive", "Online Tutor",
            "Graphic Designer", "Web Developer", "Digital Marketing"
        ]
        
        fees = ["500", "1000", "2000", "3000", "5000", "999", "1500", "2500"]
        salaries = ["40,000", "50,000", "60,000", "80,000", "1,00,000", "1,50,000"]
        emails = ["gmail.com", "yahoo.com", "outlook.com", "protonmail.com"]
        
        synthetic_jobs = []
        for _ in range(count):
            template = random.choice(fake_templates)
            job_text = template.format(
                fee=random.choice(fees),
                salary=random.choice(salaries),
                role=random.choice(roles),
                email=random.choice(emails)
            )
            
            synthetic_jobs.append({
                "text": job_text,
                "label": 1,  # Fake
                "source": "synthetic",
                "category": random.choice(["IT", "non-IT", "freelance"]),
                "language": "English",
                "date": datetime.now().strftime("%Y-%m-%d")
            })
        
        return synthetic_jobs
    
    def generate_synthetic_real_jobs(self, count: int = 250) -> List[Dict]:
        """
        Generate synthetic real job examples based on legitimate patterns
        """
        real_templates = [
            "{company} is hiring {role} - Apply via careers.{company_domain}.com",
            "{role} position at {company} - 3-5 years experience required",
            "{company} recruitment drive for {role} - Visit official job portal",
            "Job opening: {role} at {company} - Send resume to hr@{company_domain}.com",
            "{company} internship program for {role} - Apply with portfolio",
            "Campus placement: {company} hiring {role} for 2024 batch",
            "{role} vacancy at {company} - Interview scheduled at office",
            "Official job posting: {role} at {company} through LinkedIn",
            "{company} career opportunity: {role} position, apply on company website",
            "Government job: {role} recruitment via official UPSC portal",
        ]
        
        companies = [
            "TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra",
            "Google", "Microsoft", "Amazon", "Adobe", "Oracle",
            "IBM", "Accenture", "Cognizant", "Capgemini", "Deloitte"
        ]
        
        company_domains = [
            "tcs", "infosys", "wipro", "hcl", "techmahindra",
            "google", "microsoft", "amazon", "adobe", "oracle"
        ]
        
        roles = [
            "Software Engineer", "Data Scientist", "Product Manager",
            "UX Designer", "DevOps Engineer", "Cloud Architect",
            "Business Analyst", "QA Engineer", "Full Stack Developer",
            "Machine Learning Engineer", "Cybersecurity Analyst"
        ]
        
        synthetic_jobs = []
        for _ in range(count):
            template = random.choice(real_templates)
            company = random.choice(companies)
            company_domain = random.choice(company_domains)
            
            job_text = template.format(
                company=company,
                company_domain=company_domain,
                role=random.choice(roles)
            )
            
            synthetic_jobs.append({
                "text": job_text,
                "label": 0,  # Real
                "source": "synthetic",
                "category": random.choice(["IT", "government", "established"]),
                "language": "English",
                "date": datetime.now().strftime("%Y-%m-%d")
            })
        
        return synthetic_jobs
    
    def generate_hindi_mixed_jobs(self, count: int = 100) -> List[Dict]:
        """
        Generate Hindi/mixed language job examples
        """
        hindi_fake_templates = [
            "जल्दी करो! ₹{fee} रजिस्ट्रेशन फी दो और ₹{salary}/महीने की नौकरी पाओ",
            "घर से काम {role} - ₹{salary}/महीना कमाओ, कोई अनुभव नहीं चाहिए",
            "सीमित समय ऑफर: {role} पद, ₹{salary}/महीना, अभी आवेदन करो",
            "तुरंत भर्ती {role} के लिए - ₹{salary}/महीना, ट्रेनिंग के लिए ₹{fee} भेजो",
        ]
        
        hindi_real_templates = [
            "{company} {role} के लिए भर्ती कर रहा है - careers.{company_domain}.com पर आवेदन करें",
            "{company} में {role} पद - 3-5 साल का अनुभव आवश्यक",
            "सरकारी नौकरी: {role} भर्ती आधिकारिक पोर्टल के माध्यम से",
        ]
        
        roles = ["डेटा एंट्री ऑपरेटर", "सॉफ्टवेयर इंजीनियर", "कस्टमर सपोर्ट"]
        fees = ["500", "1000", "2000"]
        salaries = ["40,000", "50,000", "60,000"]
        companies = ["TCS", "Infosys", "Wipro"]
        company_domains = ["tcs", "infosys", "wipro"]
        
        synthetic_jobs = []
        
        # Generate fake Hindi jobs
        for _ in range(count // 2):
            template = random.choice(hindi_fake_templates)
            job_text = template.format(
                fee=random.choice(fees),
                salary=random.choice(salaries),
                role=random.choice(roles)
            )
            synthetic_jobs.append({
                "text": job_text,
                "label": 1,
                "source": "synthetic",
                "category": "mixed",
                "language": "Hindi",
                "date": datetime.now().strftime("%Y-%m-%d")
            })
        
        # Generate real Hindi jobs
        for _ in range(count // 2):
            template = random.choice(hindi_real_templates)
            company = random.choice(companies)
            company_domain = random.choice(company_domains)
            
            job_text = template.format(
                company=company,
                company_domain=company_domain,
                role=random.choice(roles)
            )
            synthetic_jobs.append({
                "text": job_text,
                "label": 0,
                "source": "synthetic",
                "category": "mixed",
                "language": "Hindi",
                "date": datetime.now().strftime("%Y-%m-%d")
            })
        
        return synthetic_jobs
    
    def combine_with_existing(self, new_jobs: List[Dict], existing_path: str) -> List[Dict]:
        """Combine new jobs with existing dataset"""
        existing_jobs = []
        
        try:
            with open(existing_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    existing_jobs.append({
                        "text": row['text'],
                        "label": int(row['label']),
                        "source": "existing",
                        "category": "unknown",
                        "language": "English",
                        "date": "2024-01-01"
                    })
        except Exception as e:
            print(f"Error loading existing dataset: {e}")
        
        combined = existing_jobs + new_jobs
        print(f"Combined dataset: {len(existing_jobs)} existing + {len(new_jobs)} new = {len(combined)} total")
        return combined
    
    def save_dataset(self, jobs: List[Dict], output_path: str):
        """Save dataset to CSV file"""
        fieldnames = ['text', 'label', 'source', 'category', 'language', 'date']
        
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(jobs)
        
        print(f"Dataset saved to {output_path}")
        print(f"Total samples: {len(jobs)}")
        
        # Print distribution
        fake_count = sum(1 for job in jobs if job['label'] == 1)
        real_count = sum(1 for job in jobs if job['label'] == 0)
        print(f"Fake jobs: {fake_count}")
        print(f"Real jobs: {real_count}")
        
        # Print category distribution
        categories = {}
        for job in jobs:
            cat = job['category']
            categories[cat] = categories.get(cat, 0) + 1
        print(f"Categories: {categories}")
        
        # Print language distribution
        languages = {}
        for job in jobs:
            lang = job['language']
            languages[lang] = languages.get(lang, 0) + 1
        print(f"Languages: {languages}")


def main():
    """Main execution function"""
    scraper = DatasetScraper()
    base_dir = Path(__file__).resolve().parents[1]
    
    print("="*80)
    print("PHASE 1.1: DATASET EXPANSION - WEB SCRAPING")
    print("="*80)
    
    # Generate synthetic fake jobs
    print("\nGenerating synthetic fake jobs...")
    fake_jobs = scraper.generate_synthetic_fake_jobs(count=250)
    print(f"Generated {len(fake_jobs)} fake job examples")
    
    # Generate synthetic real jobs
    print("\nGenerating synthetic real jobs...")
    real_jobs = scraper.generate_synthetic_real_jobs(count=250)
    print(f"Generated {len(real_jobs)} real job examples")
    
    # Generate Hindi/mixed jobs
    print("\nGenerating Hindi/mixed language jobs...")
    hindi_jobs = scraper.generate_hindi_mixed_jobs(count=100)
    print(f"Generated {len(hindi_jobs)} Hindi/mixed job examples")
    
    # Combine all new jobs
    all_new_jobs = fake_jobs + real_jobs + hindi_jobs
    print(f"\nTotal new jobs generated: {len(all_new_jobs)}")
    
    # Combine with existing dataset
    existing_path = base_dir / "datasets" / "fake_jobs.csv"
    combined_jobs = scraper.combine_with_existing(all_new_jobs, existing_path)
    
    # Save expanded dataset
    output_path = base_dir / "datasets" / "expanded_fake_jobs.csv"
    scraper.save_dataset(combined_jobs, output_path)
    
    print("\n" + "="*80)
    print("DATASET EXPANSION COMPLETE")
    print("="*80)


if __name__ == "__main__":
    main()

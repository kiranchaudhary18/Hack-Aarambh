import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from './search-bar';
import { SearchResults } from './search-results';
import { api } from '@/shared/lib/api';
import { FadeIn } from '@/shared/components/Animated';

interface SearchResult {
  id: string;
  companyName: string;
  domain?: string;
  scamType: string;
  severity: string;
  description: string;
  reportCount: number;
  isVerified: boolean;
  isExternal: boolean;
  relevanceScore: number;
  matchedTerms: string[];
  createdAt: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  filters: any;
  limit: number;
  offset: number;
}

export function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    document.title = 'Search — ScamSniff';
  }, []);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response: SearchResponse = await api.search(searchQuery);
      setResults(response.results);
      setTotal(response.total);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl font-bold sm:text-5xl">
              Scam Database Search
            </h1>
            <p className="mt-2 text-muted-foreground">
              Search our comprehensive database of reported scams and fraudulent companies
            </p>
          </div>

          <SearchBar onSearch={handleSearch} initialQuery={query} />

          {loading && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">Searching...</p>
            </div>
          )}

          {!loading && hasSearched && (
            <SearchResults results={results} total={total} query={query} />
          )}

          {!hasSearched && (
            <div className="mt-12 text-center">
              <div className="clay-inset mx-auto max-w-2xl p-8">
                <h3 className="font-display text-2xl font-bold">
                  Start Searching
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Enter a company name, domain, or scam pattern to search our database
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="clay p-4">
                    <p className="font-semibold">Company Names</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Search by company name to find reported scams
                    </p>
                  </div>
                  <div className="clay p-4">
                    <p className="font-semibold">Domains</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Search by website domain for phishing sites
                    </p>
                  </div>
                  <div className="clay p-4">
                    <p className="font-semibold">Patterns</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Search by scam type or pattern
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}

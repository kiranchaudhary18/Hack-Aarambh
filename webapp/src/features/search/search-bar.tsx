import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { api } from '@/shared/lib/api';
import { useDebounce } from '@/shared/hooks/use-debounce';

const PLACEHOLDER_TEXTS = [
  "Search company name...",
  "Search domain URL...",
  "Search scam pattern...",
  "Search fraudulent companies...",
];

interface Suggestion {
  companyName: string;
  domain?: string;
  type: 'company' | 'domain';
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  const fetchSuggestions = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await api.getSuggestions(searchQuery);
      setSuggestions(response.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        selectSuggestion(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const selectSuggestion = (suggestion: Suggestion) => {
    const searchValue = suggestion.type === 'domain' ? suggestion.domain! : suggestion.companyName;
    setQuery(searchValue);
    onSearch(searchValue);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="relative">
        <div className="clay-inset flex items-center gap-3 px-4 py-3">
          <span className="text-muted-foreground">
            <Search className="h-4 w-4" />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder=""
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoComplete="off"
          />
          {!query && (
            <div className="absolute left-12 right-12 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden h-5">
              <div className="animate-marquee text-sm text-muted-foreground">
                {[...PLACEHOLDER_TEXTS, ...PLACEHOLDER_TEXTS].map((text, index) => (
                  <div key={index} className="leading-5">
                    {text}
                  </div>
                ))}
              </div>
            </div>
          )}
          {query && (
            <button
              onClick={clearSearch}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 mt-2 w-full clay overflow-hidden rounded-lg shadow-lg"
          >
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading suggestions...
              </div>
            ) : (
              <ul className="py-2">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className={`cursor-pointer px-4 py-2 text-sm transition hover:bg-muted ${
                      index === selectedIndex ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {suggestion.companyName}
                      </span>
                      {suggestion.domain && (
                        <span className="text-muted-foreground">
                          ({suggestion.domain})
                        </span>
                      )}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {suggestion.type}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

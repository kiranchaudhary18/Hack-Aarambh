import { ShieldAlert, ShieldCheck, ExternalLink, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn, StaggerChildren } from '@/shared/components/Animated';

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

interface SearchResultsProps {
  results: SearchResult[];
  total: number;
  query: string;
}

export function SearchResults({ results, total, query }: SearchResultsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <ShieldAlert className="h-4 w-4" />;
      case 'low':
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  };

  if (results.length === 0) {
    return (
      <FadeIn>
        <div className="mt-8 text-center">
          <div className="clay-inset mx-auto max-w-2xl p-8">
            <ShieldCheck className="mx-auto h-12 w-12 text-success" />
            <h3 className="mt-4 font-display text-2xl font-bold">
              No Results Found
            </h3>
            <p className="mt-2 text-muted-foreground">
              No scams found matching "{query}". Try a different search term or check your spelling.
            </p>
            <div className="mt-6">
              <Link
                to="/report"
                className="clay-btn inline-flex items-center gap-2 px-4 py-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Report a New Scam
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Found {total} result{total !== 1 ? 's' : ''} for "{query}"
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Sorted by relevance</span>
          </div>
        </div>

        <StaggerChildren className="mt-6 space-y-4">
          {results.map((result) => (
            <div key={result.id} className="clay p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-xl font-bold">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(result.companyName, query),
                        }}
                      />
                    </h3>
                    <span
                      className={`clay-pill flex items-center gap-1 text-xs ${getSeverityColor(
                        result.severity,
                      )}`}
                    >
                      {getSeverityIcon(result.severity)}
                      {result.severity}
                    </span>
                    {result.isVerified && (
                      <span className="clay-pill text-xs bg-success text-success-foreground">
                        Verified
                      </span>
                    )}
                    {result.isExternal && (
                      <span className="clay-pill text-xs bg-muted">
                        External Source
                      </span>
                    )}
                  </div>

                  {result.domain && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Domain:{' '}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(result.domain, query),
                        }}
                      />
                    </p>
                  )}

                  <p className="mt-3 text-sm">{result.description}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" />
                      <span>{result.scamType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{result.reportCount} reports</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Relevance: {result.relevanceScore}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to="/analyze"
                    state={{ query: result.companyName }}
                    className="clay-btn flex items-center justify-center gap-2 px-3 py-2 text-sm"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Analyze
                  </Link>
                  {result.domain && (
                    <a
                      href={`https://${result.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clay-btn flex items-center justify-center gap-2 px-3 py-2 text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit Site
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </FadeIn>
  );
}

import React, { useState } from 'react'
import { 
  BookOpen, 
  Search, 
  Download, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { searchPubmedWithDetails } from '../services/pubmedService'
import { summarizeArticle } from '../services/aiService'
import { PubmedArticle } from '../types/pubmed'
import { ArticleSummary } from '../types/ai'
import ReadAloudControls from '../components/ui/ReadAloudControls'

const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i)

const articleTypes = [
  { value: '', label: 'All Types' },
  { value: 'journal-article', label: 'Journal Article' },
  { value: 'clinical-trial', label: 'Clinical Trial' },
  { value: 'review', label: 'Review' },
  { value: 'case-reports', label: 'Case Reports' },
]

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Newest First', value: 'pub_date' },
]

interface ExpandedArticle {
  article: PubmedArticle
  isExpanded: boolean
  summary?: ArticleSummary
  isSummarizing: boolean
  summaryError?: string
}

const MedicalKnowledgePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchYear, setSearchYear] = useState('')
  const [articleType, setArticleType] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [results, setResults] = useState<PubmedArticle[]>([])
  const [expandedArticles, setExpandedArticles] = useState<Record<string, ExpandedArticle>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { articles } = await searchPubmedWithDetails(query, 10, 0)
      setResults(articles)
      
      // Initialize expanded state for new articles
      const newExpanded: Record<string, ExpandedArticle> = {}
      articles.forEach((article) => {
        if (!expandedArticles[article.pmid]) {
          newExpanded[article.pmid] = {
            article,
            isExpanded: false,
            isSummarizing: false,
          }
        }
      })
      setExpandedArticles(prev => ({ ...prev, ...newExpanded }))
      
      if (articles.length === 0) {
        setError('No articles found. Try different keywords.')
      }
    } catch (err) {
      setError('Failed to load articles. Please check your connection and try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm)
    }
  }

  const toggleExpand = (pmid: string) => {
    setExpandedArticles(prev => ({
      ...prev,
      [pmid]: {
        ...prev[pmid],
        isExpanded: !prev[pmid].isExpanded,
      },
    }))
  }

  const handleSummarize = async (pmid: string) => {
    const expanded = expandedArticles[pmid]
    if (!expanded) return

    setExpandedArticles(prev => ({
      ...prev,
      [pmid]: {
        ...prev[pmid],
        isSummarizing: true,
      },
    }))

    try {
      const result = await summarizeArticle({
        pmid: expanded.article.pmid,
        title: expanded.article.title,
        abstract: expanded.article.abstract,
        authors: expanded.article.authors,
        journal: expanded.article.journal,
        publicationDate: expanded.article.publicationDate,
      })

      setExpandedArticles(prev => ({
        ...prev,
        [pmid]: {
          ...prev[pmid],
          summary: result.summary,
          isSummarizing: false,
          summaryError: result.error,
        },
      }))
    } catch (err) {
      setExpandedArticles(prev => ({
        ...prev,
        [pmid]: {
          ...prev[pmid],
          isSummarizing: false,
          summaryError: 'Failed to generate summary. Please try again.',
        },
      }))
    }
  }

  const loadMore = async () => {
    if (!searchTerm) return
    
    setIsLoading(true)
    setError(null)

    try {
      const currentLength = results.length
      const { articles } = await searchPubmedWithDetails(searchTerm, 10, currentLength)
      
      setResults(prev => {
        const existingPmids = new Set(prev.map(a => a.pmid))
        const newArticles = articles.filter(a => !existingPmids.has(a.pmid))
        return [...prev, ...newArticles]
      })

      // Expand new articles
      const newExpanded: Record<string, ExpandedArticle> = {}
      articles.forEach((article) => {
        const existingPmids = new Set(results.map(a => a.pmid))
        if (!existingPmids.has(article.pmid)) {
          newExpanded[article.pmid] = {
            article,
            isExpanded: false,
            isSummarizing: false,
          }
        }
      })
      setExpandedArticles(prev => ({ ...prev, ...newExpanded }))
    } catch (err) {
      setError('Failed to load more articles.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredResults = () => {
    let filtered = [...results]
    
    if (searchYear) {
      const yearNum = parseInt(searchYear)
      filtered = filtered.filter(article => {
        const pubYear = new Date(article.publicationDate).getFullYear()
        return pubYear === yearNum
      })
    }

    return filtered
  }

  const filteredResults = getFilteredResults()

  // Generate text for speech from summary
  const generateSpeechText = (summary?: ArticleSummary): string => {
    if (!summary) return ''
    
    const parts = []
    if (summary.overview) parts.push(`Overview: ${summary.overview}`)
    if (summary.researchQuestion) parts.push(`Research Question: ${summary.researchQuestion}`)
    if (summary.keyFindings && summary.keyFindings.length > 0) {
      parts.push(`Key Findings: ${summary.keyFindings.join(' ')}`)
    }
    if (summary.significance) parts.push(`Significance: ${summary.significance}`)
    if (summary.takeaways) parts.push(`Key Takeaway: ${summary.takeaways}`)
    
    return parts.join(' ')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-darkGreen mb-2">Medical Knowledge</h1>
        <p className="text-secondaryText">
          Explore trusted medical research and understand it in simpler language.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="w-5 h-5 text-secondaryText" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search diseases, medical conditions, or research topics..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-sage-300 bg-white focus:outline-none focus:ring-2 focus:ring-primaryGreen shadow-sm transition-all"
        />
        <button
          onClick={() => handleSearch(searchTerm)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-darkGreen text-white px-6 py-2 rounded-xl font-medium hover:bg-primaryGreen transition-colors"
        >
          Search
        </button>
      </div>

      {/* Filters Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 text-secondaryText hover:text-primaryGreen transition-colors"
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        Show Filters
      </button>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-sage-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-secondaryText mb-2">Publication Year</label>
              <select
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-primaryGreen bg-white"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-secondaryText mb-2">Article Type</label>
              <select
                value={articleType}
                onChange={(e) => setArticleType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-primaryGreen bg-white"
              >
                {articleTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-secondaryText mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-primaryGreen bg-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => handleSearch(searchTerm)}
            className="ml-auto text-sm font-medium text-red-600 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Initial State (No Search Performed) */}
      {results.length === 0 && !isLoading && (
        <div className="bg-gradient-to-br from-cream to-white rounded-3xl p-12 text-center border border-sage-200 shadow-sm">
          <div className="w-20 h-20 bg-primaryGreen rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-darkGreen mb-4">Explore Medical Research</h2>
          <p className="text-secondaryText text-lg max-w-2xl mx-auto mb-8">
            Search trusted scientific publications from PubMed and explore medical findings in simpler language.
          </p>
          
          <div className="mb-8">
            <p className="text-sm font-bold text-secondaryText uppercase tracking-wide mb-4">Search by topic:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { term: 'Diabetes', label: 'Diabetes Research' },
                { term: 'Heart disease', label: 'Heart Health' },
                { term: 'Cancer', label: 'Cancer Research' },
                { term: 'Mental health', label: 'Mental Health' },
                { term: 'Nutrition', label: 'Nutrition' },
                { term: 'Hypertension', label: 'Hypertension' },
              ].map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(topic.term)}
                  className="px-5 py-2.5 bg-white border border-sage-300 hover:border-primaryGreen hover:bg-sage-50 rounded-xl text-sm font-medium text-secondaryText transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">{topic.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <p className="text-sm text-secondaryText mb-2">Or search for other topics:</p>
            <div className="text-xs text-sage-500">
              Examples: preventive healthcare, infectious diseases, women's health, surgery
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primaryGreen animate-spin" />
          <span className="ml-3 text-secondaryText">Searching PubMed for medical research...</span>
        </div>
      )}

      {!isLoading && filteredResults.length === 0 && !error && (
        <div className="bg-cream rounded-2xl p-12 text-center border border-sage-200">
          <div className="w-16 h-16 bg-sage-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-sage-500" />
          </div>
          <h3 className="text-xl font-bold text-darkGreen mb-2">No articles found</h3>
          <p className="text-secondaryText">Try a different search term or browse suggested topics above.</p>
        </div>
      )}

      {/* Results Header */}
      {filteredResults.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-darkGreen">
            {filteredResults.length} {filteredResults.length === 1 ? 'Article' : 'Articles'} Found
          </h2>
        </div>
      )}

      <div className="space-y-4">
        {filteredResults.map((article) => {
          const expanded = expandedArticles[article.pmid]
          const speechText = generateSpeechText(expanded?.summary)
          
          return (
            <div
              key={article.pmid}
              className="bg-white rounded-2xl p-6 shadow-sm border border-sage-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {article.journal}
                    </span>
                    <span className="text-xs text-sage-500">• {article.publicationDate}</span>
                    <span className="text-xs text-sage-500">• PMID: {article.pmid}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-bold text-lg text-darkGreen mb-2 hover:text-primaryGreen transition-colors">
                    {article.title}
                  </h3>
                  
                  {/* Authors */}
                  <p className="text-sm text-secondaryText mb-3">
                    {article.authors.length > 0 
                      ? article.authors.slice(0, 3).join(', ') + (article.authors.length > 3 ? ' et al.' : '')
                      : 'No authors listed'}
                  </p>
                  
                  {/* Abstract */}
                  {article.abstract && (
                    <div className="mb-4">
                      <p className="text-sm text-secondaryText leading-relaxed line-clamp-3">
                        {article.abstract}
                      </p>
                      <button
                        onClick={() => toggleExpand(article.pmid)}
                        className="text-sm font-medium text-primaryGreen hover:text-darkGreen flex items-center gap-1 mt-2"
                      >
                        {expanded?.isExpanded ? 'Show less' : 'Read abstract'}
                        {expanded?.isExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                      
                      {expanded?.isExpanded && (
                        <div className="mt-3 pt-3 border-t border-sage-100">
                          <p className="text-sm text-secondaryText leading-relaxed">
                            {article.abstract}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* AI Summary */}
                  {expanded?.summary && (
                    <div className="mt-4 p-4 bg-cream rounded-xl">
                      <h4 className="font-bold text-primaryGreen mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        AI-generated educational summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        {expanded.summary.overview && (
                          <div>
                            <span className="font-bold text-darkGreen">1. Research Overview:</span>{' '}
                            {expanded.summary.overview}
                          </div>
                        )}
                        {expanded.summary.researchQuestion && (
                          <div>
                            <span className="font-bold text-darkGreen">2. What Researchers Studied:</span>{' '}
                            {expanded.summary.researchQuestion}
                          </div>
                        )}
                        {expanded.summary.keyFindings && expanded.summary.keyFindings.length > 0 && (
                          <div>
                            <span className="font-bold text-darkGreen">3. Key Findings:</span>
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                              {expanded.summary.keyFindings.map((finding, idx) => (
                                <li key={idx} className="text-secondaryText">{finding}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {expanded.summary.significance && (
                          <div>
                            <span className="font-bold text-darkGreen">4. Why It Matters:</span>{' '}
                            {expanded.summary.significance}
                          </div>
                        )}
                        {expanded.summary.takeaways && (
                          <div className="mt-2 pt-2 border-t border-cream/50">
                            <span className="font-bold text-darkGreen">5. Key Takeaway:</span>{' '}
                            {expanded.summary.takeaways}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    {expanded?.summaryError && (
                      <div className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        {expanded.summaryError}
                      </div>
                    )}
                    
                    <button
                      onClick={() => handleSummarize(article.pmid)}
                      disabled={isLoading || expanded?.isSummarizing}
                      className="bg-primaryGreen text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {expanded?.isSummarizing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Summarizing...
                        </>
                      ) : (
                        <>
                          <span className="text-sm">Summarize in Simple Language</span>
                        </>
                      )}
                    </button>
                    
                    {expanded?.summary && (
                      <>
                        <ReadAloudControls text={speechText} />
                        <button
                          onClick={() => window.open(article.url, '_blank')}
                          className="text-sm font-medium text-primaryGreen hover:text-darkGreen flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Read Original Research
                        </button>
                      </>
                    )}
                    
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primaryGreen hover:text-darkGreen flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load More Button */}
      {filteredResults.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="bg-darkGreen text-white px-8 py-3 rounded-xl font-medium hover:bg-primaryGreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading More...
              </>
            ) : (
              <>
                Load More Results
                <ChevronDown className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default MedicalKnowledgePage

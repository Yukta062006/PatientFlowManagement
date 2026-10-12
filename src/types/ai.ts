export interface ArticleSummary {
  overview: string
  researchQuestion: string
  keyFindings: string[]
  significance: string
  limitations?: string
  takeaways: string
  sources?: {
    type: 'ai' | 'abstract'
    content: string
  }[]
}

export interface SummarizationRequest {
  pmid: string
  title: string
  abstract: string
  authors: string[]
  journal: string
  publicationDate: string
}

export interface SummarizationResponse {
  success: boolean
  summary?: ArticleSummary
  error?: string
  warning?: string
}

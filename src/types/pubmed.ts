export interface PubmedArticle {
  pmid: string
  title: string
  authors: string[]
  journal: string
  publicationDate: string
  abstract: string
  doi?: string
  url: string
}

export interface PubmedSearchResponse {
  esearchresult: {
    idlist: string[]
    count: string
    retmax: string
    retstart: string
  }
}

export interface PubmedFetchResponse {
  status: string
  items?: PubmedArticle[]
}

export interface ArticleFilter {
  year?: number
  type?: string
}

export interface ArticleSortOption {
  label: string
  value: string
}

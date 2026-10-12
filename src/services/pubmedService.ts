import { PubmedArticle } from '../types/pubmed'

const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'

/**
 * Fetch search results from PubMed E-utilities API (XML format)
 * @param query - Search term for medical research
 * @param retMax - Maximum number of results to return (default: 10)
 * @param retStart - Offset for pagination (default: 0)
 */
export async function searchPubmed(
  query: string,
  retMax: number = 10,
  retStart: number = 0
): Promise<string[]> {
  if (!query.trim()) {
    console.log('[PubMed] Empty search term provided')
    return []
  }

  console.log(`[PubMed] Searching with term: "${query}", max: ${retMax}, start: ${retStart}`)

  try {
    // Build the search URL (NCBI returns XML by default, retmode=json is not reliable)
    const searchUrl = `${BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${retMax}&retstart=${retStart}`
    
    console.log(`[PubMed] Fetching from: ${searchUrl}`)
    
    const response = await fetch(searchUrl)
    
    console.log(`[PubMed] Response status: ${response.status} ${response.ok ? 'OK' : 'ERROR'}`)
    
    if (!response.ok) {
      throw new Error(`PubMed API error: ${response.status} ${response.statusText}`)
    }
    
    const xmlText = await response.text()
    console.log(`[PubMed] Response received (length: ${xmlText.length} chars)`)
    
    // Parse XML to extract IDs
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    
    // Check for errors
    const errorNode = xmlDoc.querySelector('ERROR')
    if (errorNode) {
      const errorMsg = errorNode.textContent
      console.error(`[PubMed] API Error: ${errorMsg}`)
      throw new Error(`PubMed API Error: ${errorMsg}`)
    }
    
    // Extract IDs from IDList
    const idList = xmlDoc.querySelector('IdList')
    if (!idList) {
      console.log('[PubMed] No IdList found in response')
      return []
    }
    
    const idNodes = idList.querySelectorAll('Id')
    const ids = Array.from(idNodes).map(node => node.textContent?.trim() || '')
    
    console.log(`[PubMed] Found ${ids.length} article IDs`)
    
    return ids
  } catch (error) {
    console.error('[PubMed] Error searching PubMed:', error)
    throw error
  }
}

/**
 * Fetch detailed article information from PubMed (XML format)
 * @param pmids - Array of PubMed IDs to fetch
 */
export async function fetchPubmedArticles(pmids: string[]): Promise<PubmedArticle[]> {
  if (pmids.length === 0) {
    return []
  }

  console.log(`[PubMed] Fetching details for ${pmids.length} articles`)

  try {
    // Join PMIDs with commas
    const idList = pmids.join(',')
    
    // Build the fetch URL
    const fetchUrl = `${BASE_URL}/efetch.fcgi?db=pubmed&id=${idList}`
    
    console.log(`[PubMed] Fetching from: ${fetchUrl}`)
    
    const response = await fetch(fetchUrl)
    
    console.log(`[PubMed] Fetch response status: ${response.status}`)
    
    if (!response.ok) {
      throw new Error(`PubMed fetch error: ${response.status} ${response.statusText}`)
    }
    
    const xmlText = await response.text()
    console.log(`[PubMed] Fetch response received (length: ${xmlText.length} chars)`)
    
    // Parse XML response
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    
    // Check for errors
    const errorNode = xmlDoc.querySelector('ERROR')
    if (errorNode) {
      const errorMsg = errorNode.textContent
      console.error(`[PubMed] Fetch API Error: ${errorMsg}`)
      throw new Error(`PubMed Fetch Error: ${errorMsg}`)
    }
    
    // Parse the response structure
    const articles: PubmedArticle[] = []
    
    // Get all PubmedArticle nodes
    const articleNodes = xmlDoc.querySelectorAll('PubmedArticle, PubmedBookArticle')
    
    console.log(`[PubMed] Found ${articleNodes.length} article nodes`)
    
    for (const articleNode of articleNodes) {
      try {
        // Extract MedlineCitation
        const medlineCitation = articleNode.querySelector('MedlineCitation')
        const article = medlineCitation?.querySelector('Article')
        
        if (article) {
          // Extract authors
          const authors: string[] = []
          const authorList = article.querySelectorAll('AuthorList Author')
          for (const author of Array.from(authorList)) {
            const lastName = author.querySelector('LastName')?.textContent?.trim()
            const foreName = author.querySelector('ForeName')?.textContent?.trim()
            const collectiveName = author.querySelector('CollectiveName')?.textContent?.trim()
            
            if (collectiveName) {
              authors.push(collectiveName)
            } else if (lastName && foreName) {
              authors.push(`${foreName} ${lastName}`)
            } else if (lastName) {
              authors.push(lastName)
            }
          }
          
          // Extract journal info
          const journal = article.querySelector('Journal')
          const journalTitle = journal?.querySelector('Title')?.textContent?.trim() || 
                              journal?.querySelector('ISOAbbreviation')?.textContent?.trim() || 
                              'Unknown Journal'
          
          // Extract publication date
          let pubDate = 'Unknown'
          const articleDate = article.querySelector('ArticleDate')
          if (articleDate) {
            const year = articleDate.querySelector('Year')?.textContent?.trim()
            const month = articleDate.querySelector('Month')?.textContent?.trim()
            const day = articleDate.querySelector('Day')?.textContent?.trim()
            if (year) {
              pubDate = `${year}-${month?.padStart(2, '0') || '01'}-${day?.padStart(2, '0') || '01'}`
            }
          } else {
            const pubDateElem = article.querySelector('Journal/JournalIssue/PubDate')
            if (pubDateElem) {
              const year = pubDateElem.querySelector('Year')?.textContent?.trim()
              const month = pubDateElem.querySelector('Month')?.textContent?.trim()
              const day = pubDateElem.querySelector('Day')?.textContent?.trim()
              if (year) {
                pubDate = `${year}-${month?.padStart(2, '0') || '01'}-${day?.padStart(2, '0') || '01'}`
              }
            }
          }
          
          // Extract abstract
          const abstractElem = article.querySelector('Abstract')
          const abstract = abstractElem 
            ? Array.from(abstractElem.querySelectorAll('AbstractText'))
                .map(text => text.textContent?.trim() || '')
                .filter(text => text.length > 0)
                .join(' ')
            : ''
          
          // Extract DOI
          const doi = article.querySelector('ELocationID[EIdType="doi"]')?.textContent?.trim() ||
                     article.querySelector('ArticleId[IdType="doi"]')?.textContent?.trim() ||
                     undefined
          
          // Get PMID from MedlineCitation
          const pmid = medlineCitation?.querySelector('PMID')?.textContent?.trim() ||
                      medlineCitation?.querySelector('ArticleIDList ArticleId[IdType="pubmed"]')?.textContent?.trim() ||
                      'Unknown'
          
          articles.push({
            pmid,
            title: article.querySelector('ArticleTitle')?.textContent?.trim() || 'Untitled Article',
            authors,
            journal: journalTitle,
            publicationDate: pubDate,
            abstract,
            doi,
            url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
          })
        }
      } catch (err) {
        console.error('[PubMed] Error parsing article:', err)
      }
    }
    
    console.log(`[PubMed] Successfully parsed ${articles.length} articles`)
    
    return articles
  } catch (error) {
    console.error('[PubMed] Error fetching PubMed articles:', error)
    throw error
  }
}

/**
 * Search PubMed and return full article details
 * @param query - Search term
 * @param retMax - Maximum results
 * @param retStart - Pagination offset
 */
export async function searchPubmedWithDetails(
  query: string,
  retMax: number = 10,
  retStart: number = 0
): Promise<{ articles: PubmedArticle[]; totalResults: number }> {
  console.log(`[PubMed] Search started for: "${query}"`)
  
  // Step 1: Get PMIDs from search
  const pmids = await searchPubmed(query, retMax, retStart)
  
  console.log(`[PubMed] Retrieved ${pmids.length} PMIDs`)
  
  if (pmids.length === 0) {
    return { articles: [], totalResults: 0 }
  }
  
  // Step 2: Fetch full article details
  const articles = await fetchPubmedArticles(pmids)
  
  console.log(`[PubMed] Final result: ${articles.length} articles returned`)
  
  return { articles, totalResults: articles.length }
}
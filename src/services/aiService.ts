import { SummarizationRequest, SummarizationResponse, ArticleSummary } from '../types/ai'

/**
 * AI Summarization Service
 * 
 * SECURITY NOTE: This service is designed to be used server-side.
 * For production, integrate with a backend that handles API keys securely.
 * 
 * To implement properly:
 * 1. Create a backend server (Node.js/Express, Python/Flask, etc.)
 * 2. Store GEMINI_API_KEY in environment variables on the server
 * 3. Call this service from the backend
 * 
 * For now, this mock demonstrates the expected interface.
 */

/**
 * Simulate AI summarization (mock for demonstration)
 * In production, replace this with actual API calls to a backend
 */
export async function summarizeArticle(request: SummarizationRequest): Promise<SummarizationResponse> {
  // For production, make a server-side call to Gemini API
  // Example: POST https://generativelanguage.googleapis.com/v1beta/models/gemini-...:generateContent
  
  // This is a DETAILED MOCK that demonstrates the expected structure
  // It creates a realistic-looking summary without actually using AI
  // In production, this would call the real Gemini API
  
  if (!request.abstract || request.abstract.length < 50) {
    return {
      success: false,
      error: 'Insufficient content for summarization. The abstract is too short.',
    }
  }

  // Mock summary structure - this would come from actual AI
  const summary: ArticleSummary = {
    overview: `This research study published in ${request.journal} examines ${request.title.toLowerCase()}. The study was conducted by ${request.authors.length > 0 ? request.authors.slice(0, 2).join(' and ') + (request.authors.length > 2 ? ' et al.' : '') : 'researchers'} and provides important insights into this medical topic.`,
    researchQuestion: `The researchers investigated how ${request.title.toLowerCase().replace(/the|a|an/g, '').trim()} affects patient outcomes and health management. The study specifically looked at the effectiveness of various interventions and approaches.`,
    keyFindings: [
      `The research found significant evidence related to ${request.title.toLowerCase().split(' ').slice(0, 5).join(' ')}.`,
      `The study demonstrated improvements in [specific health outcomes] among participants.`,
      `The findings suggest potential benefits for patients with related conditions.`
    ],
    significance: `This research is important because it contributes to our understanding of ${request.title.toLowerCase()}. The results may help inform clinical decisions and improve patient care approaches. However, further research would be needed to confirm these findings.`,
    takeaways: `In summary, this study provides valuable insights into ${request.title.toLowerCase()}. The findings suggest potential benefits for patients, though individual results may vary. Patients should consult their healthcare providers about how this research might apply to their specific situation.`,
  }

  return {
    success: true,
    summary,
  }
}

/**
 * Get summary placeholder when AI is unavailable
 */
export function getFallbackSummary(request: SummarizationRequest): ArticleSummary {
  return {
    overview: `This research study published in ${request.journal} examines ${request.title.toLowerCase()}.`,
    researchQuestion: `The researchers investigated ${request.title.toLowerCase()}.`,
    keyFindings: [
      'This study provides valuable insights into the topic.',
      'The findings contribute to existing medical knowledge.',
    ],
    significance: `This research helps improve understanding of ${request.title.toLowerCase()}.`,
    takeaways: `The study provides important information for patients and healthcare providers about ${request.title.toLowerCase()}.`
  }
}

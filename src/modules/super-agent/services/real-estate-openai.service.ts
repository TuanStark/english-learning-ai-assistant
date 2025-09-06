import { Injectable, Logger } from '@nestjs/common';
import { OpenAiService } from '../../core/services/openai.service';
import { KnowledgeBaseLoader } from '../../../knowledge/knowledge-base-loader';
import { QueryComplexityAnalyzer } from '../../../knowledge/query-complexity-analyzer';

/**
 * Real Estate OpenAI Service - Following Express.js logic
 */
@Injectable()
export class RealEstateOpenAIService {
  private readonly logger = new Logger(RealEstateOpenAIService.name);
  private knowledgeLoader: KnowledgeBaseLoader;
  private complexityAnalyzer: QueryComplexityAnalyzer;
  private isKnowledgeLoaded = false;

  constructor(private readonly openAiService: OpenAiService) {
    this.knowledgeLoader = new KnowledgeBaseLoader();
    this.complexityAnalyzer = new QueryComplexityAnalyzer();
    this.initializeKnowledge();
  }

  async initializeKnowledge(): Promise<void> {
    try {
      await this.knowledgeLoader.loadKnowledgeBase();
      this.isKnowledgeLoaded = true;
      this.logger.log('Real Estate Knowledge Base initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize knowledge base', error);
      this.isKnowledgeLoaded = false;
    }
  }

  // Delegate methods to openAIService
  isAvailable(): boolean {
    return true; // Simplified for now
  }

  getStatus(): any {
    return { available: true, model: 'gpt-4o' };
  }

  checkQuotaStatus(): any {
    return { available: true, reason: 'OK' };
  }

  /**
   * Get enhanced system prompt with conditional knowledge base
   */
  getEnhancedSystemPrompt(basePrompt = '', query = ''): string {
    this.logger.log('getEnhancedSystemPrompt called', {
      hasBasePrompt: !!basePrompt,
      basePromptLength: basePrompt.length,
      hasQuery: !!query,
      query: query ? query.substring(0, 100) + '...' : 'no query',
      isKnowledgeLoaded: this.isKnowledgeLoaded
    });

    if (!this.isKnowledgeLoaded) {
      this.logger.warn('Knowledge base not loaded, using base prompt only');
      return basePrompt;
    }

    // If no query provided, use full knowledge base (backward compatibility)
    if (!query) {
      this.logger.warn('No query provided, using full knowledge base');
      return this.knowledgeLoader.getEnhancedSystemPrompt(basePrompt);
    }

    // Analyze query complexity
    const complexityAnalysis = this.complexityAnalyzer.analyzeComplexity(query);

    this.logger.log('Query complexity analysis result', {
      query: query,
      complexity: complexityAnalysis.complexity,
      score: complexityAnalysis.score,
      needsKnowledgeBase: complexityAnalysis.needsKnowledgeBase,
      indicators: complexityAnalysis.indicators
    });

    // For simple queries, use base prompt only
    if (!complexityAnalysis.needsKnowledgeBase) {
      this.logger.log('Using base prompt for simple query', {
        query: query,
        complexity: complexityAnalysis.complexity,
        score: complexityAnalysis.score,
        basePromptLength: basePrompt.length
      });
      return basePrompt;
    }

    // For complex queries, use selective knowledge base
    const relevantSections = this.complexityAnalyzer.getRelevantKnowledgeSections(query, complexityAnalysis);
    const selectivePrompt = this.buildSelectivePrompt(basePrompt, relevantSections);

    this.logger.log('Using enhanced prompt for complex query', {
      query: query,
      complexity: complexityAnalysis.complexity,
      score: complexityAnalysis.score,
      sections: relevantSections,
      basePromptLength: basePrompt.length,
      enhancedPromptLength: selectivePrompt.length
    });

    return selectivePrompt;
  }

  /**
   * Build selective prompt with only relevant knowledge sections
   */
  buildSelectivePrompt(basePrompt: string, sections: string[]): string {
    if (!sections || sections.length === 0) {
      return basePrompt;
    }

    let enhancedPrompt = basePrompt + '\n\n# 🧠 SELECTIVE KNOWLEDGE BASE\n\n';

    sections.forEach(section => {
      // Simplified - just add section name for now
      enhancedPrompt += `## ${section.toUpperCase()}\n[Knowledge section: ${section}]\n\n`;
    });

    enhancedPrompt += `
# 🎯 SELECTIVE INTEGRATION INSTRUCTIONS

**KNOWLEDGE APPLICATION:**
- Sử dụng kiến thức được cung cấp để đưa ra lời khuyên chính xác
- Áp dụng patterns phù hợp với loại query
- Kết hợp tool results với domain expertise

**RESPONSE ENHANCEMENT:**
- Thêm insights từ kiến thức được load
- Đưa ra lời khuyên dựa trên kinh nghiệm thực tế
- Đảm bảo thông tin chính xác và cập nhật
`;

    return enhancedPrompt;
  }

  /**
   * Analyze query complexity
   */
  analyzeQueryComplexity(query: string): any {
    return this.complexityAnalyzer.analyzeComplexity(query);
  }

  /**
   * Get knowledge base status
   */
  getKnowledgeStatus(): any {
    return {
      isLoaded: this.isKnowledgeLoaded,
      complexityAnalyzer: {
        available: !!this.complexityAnalyzer,
        stats: null // Simplified
      },
      status: 'loaded'
    };
  }

  // async enhancedNLPAnalysis(query: string, basicAnalysis: any): Promise<any> {
  //   // Simplified - just return basic analysis for now
  //   return basicAnalysis;
  // }

  // async generateIntelligentResponse(queryAnalysis: any, searchResults: any[], expertAdvice: any, customerProfile: any): Promise<string | null> {
  //   // Simplified - return null for now
  //   return null;
  // }

  // async generateMarketAnalysis(location: string, propertyType?: string): Promise<string | null> {
  //   // Simplified - return null for now
  //   return null;
  // }

  // private parseJsonResponse(content: string): any {
  //   try {
  //     // Try to extract JSON from the response
  //     const jsonMatch = content.match(/\{[\s\S]*\}/);
  //     if (jsonMatch) {
  //       return JSON.parse(jsonMatch[0]);
  //     }
  //     return JSON.parse(content);
  //   } catch (error) {
  //     this.logger.error('Failed to parse JSON response', error);
  //     return null;
  //   }
  // }
}

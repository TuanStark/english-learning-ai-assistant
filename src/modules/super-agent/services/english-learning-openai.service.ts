import { Injectable, Logger } from '@nestjs/common';
import { OpenAiService } from '../../core/services/openai.service';
import { KnowledgeBaseLoader } from '../../../knowledge/knowledge-base-loader';
import { QueryComplexityAnalyzer } from '../../../knowledge/query-complexity-analyzer';

/**
 * English Learning OpenAI Service
 */
@Injectable()
export class EnglishLearningOpenAIService {
  private readonly logger = new Logger(EnglishLearningOpenAIService.name);
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
      this.logger.log('English Learning Knowledge Base initialized successfully');
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
      query: query ? query.substring(0, 100) + '...' : 'no query'
    });

    // If no query provided, use base prompt only
    if (!query) {
      this.logger.warn('No query provided, using base prompt only');
      return basePrompt;
    }

    // Analyze query complexity
    const complexityAnalysis = this.complexityAnalyzer.analyzeComplexity(query);

    this.logger.log('Query complexity analysis result', {
      query: query.substring(0, 50) + '...',
      complexity: complexityAnalysis.complexity,
      score: complexityAnalysis.score,
      needsKnowledgeBase: complexityAnalysis.needsKnowledgeBase,
      indicators: complexityAnalysis.indicators
    });

    // For simple queries, use base prompt only
    if (!complexityAnalysis.needsKnowledgeBase) {
      this.logger.log('Using base prompt for simple query', {
        query: query.substring(0, 50) + '...',
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
      query: query.substring(0, 50) + '...',
      complexity: complexityAnalysis.complexity,
      score: complexityAnalysis.score,
      sections: relevantSections,
      basePromptLength: basePrompt.length,
      enhancedPromptLength: selectivePrompt.length
    });

    return selectivePrompt;
  }

  /**
   * Build selective prompt with relevant knowledge sections
   */
  private buildSelectivePrompt(basePrompt: string, sections: string[]): string {
    try {
      let enhancedPrompt = basePrompt;

      for (const section of sections) {
        const sectionContent = this.getKnowledgeSection(section);
        if (sectionContent) {
          enhancedPrompt += `\n\n${sectionContent}`;
        }
      }

      return enhancedPrompt;
    } catch (error) {
      this.logger.error('Failed to build selective prompt', error);
      return basePrompt;
    }
  }

  /**
   * Get specific knowledge section content from knowledge base files
   */
  private getKnowledgeSection(section: string): string {
    try {
      // Check if knowledge base is loaded
      if (!this.knowledgeLoader.isKnowledgeLoaded()) {
        this.logger.warn('Knowledge base not loaded, using fallback');
        return ''; // Return empty string if knowledge not loaded
      }

      // Get English learning knowledge for all sections (since they're all English learning related)
      const englishLearningKnowledge = this.knowledgeLoader.getKnowledgeSection('englishLearning');
      const websiteContext = this.knowledgeLoader.getKnowledgeSection('website');

      // For now, return the full English learning knowledge for all sections
      // In the future, we could parse and extract specific sections from the markdown
      switch (section) {
        case 'GENERAL_KNOWLEDGE':
          return englishLearningKnowledge + '\n\n' + websiteContext;
        default:
          return englishLearningKnowledge;
      }
    } catch (error) {
      this.logger.error('Failed to get knowledge section', error);
      return ''; // Fallback to empty string
    }
  }

  /**
   * Get knowledge status
   */
  getKnowledgeStatus(): any {
    return {
      isLoaded: this.isKnowledgeLoaded,
      stats: this.knowledgeLoader.getStats()
    };
  }

  /**
   * Analyze query for English learning context
   */
  analyzeQuery(query: string): any {
    try {
      const complexityAnalysis = this.complexityAnalyzer.analyzeComplexity(query);
      
      // Extract English learning specific information
      const learningContext = this.extractLearningContext(query);
      
      return {
        complexity: complexityAnalysis,
        learningContext: learningContext,
        needsKnowledgeBase: complexityAnalysis.needsKnowledgeBase
      };
    } catch (error) {
      this.logger.error('Failed to analyze query', error);
      return {
        complexity: { complexity: 'unknown', score: 0, needsKnowledgeBase: false, indicators: [] },
        learningContext: { type: 'unknown', level: 'unknown', topic: 'unknown' },
        needsKnowledgeBase: false
      };
    }
  }

  /**
   * Extract learning context from query
   */
  private extractLearningContext(query: string): any {
    const lowerQuery = query.toLowerCase();
    
    // Extract exercise type
    let type = 'general';
    if (lowerQuery.includes('ngữ pháp') || lowerQuery.includes('grammar')) {
      type = 'grammar';
    } else if (lowerQuery.includes('từ vựng') || lowerQuery.includes('vocabulary')) {
      type = 'vocabulary';
    } else if (lowerQuery.includes('nghe') || lowerQuery.includes('listening')) {
      type = 'listening';
    } else if (lowerQuery.includes('nói') || lowerQuery.includes('speaking')) {
      type = 'speaking';
    } else if (lowerQuery.includes('đọc') || lowerQuery.includes('reading')) {
      type = 'reading';
    } else if (lowerQuery.includes('viết') || lowerQuery.includes('writing')) {
      type = 'writing';
    }

    // Extract level
    let level = 'unknown';
    if (lowerQuery.includes('a1')) {
      level = 'A1';
    } else if (lowerQuery.includes('a2')) {
      level = 'A2';
    } else if (lowerQuery.includes('b1')) {
      level = 'B1';
    } else if (lowerQuery.includes('b2')) {
      level = 'B2';
    } else if (lowerQuery.includes('c1')) {
      level = 'C1';
    } else if (lowerQuery.includes('c2')) {
      level = 'C2';
    } else if (lowerQuery.includes('dễ') || lowerQuery.includes('easy')) {
      level = 'A1-A2';
    } else if (lowerQuery.includes('khó') || lowerQuery.includes('hard')) {
      level = 'B2-C1';
    }

    // Extract topic
    let topic = 'general';
    if (lowerQuery.includes('gia đình') || lowerQuery.includes('family')) {
      topic = 'family';
    } else if (lowerQuery.includes('công việc') || lowerQuery.includes('work')) {
      topic = 'work';
    } else if (lowerQuery.includes('du lịch') || lowerQuery.includes('travel')) {
      topic = 'travel';
    } else if (lowerQuery.includes('thực phẩm') || lowerQuery.includes('food')) {
      topic = 'food';
    } else if (lowerQuery.includes('thời tiết') || lowerQuery.includes('weather')) {
      topic = 'weather';
    } else if (lowerQuery.includes('giáo dục') || lowerQuery.includes('education')) {
      topic = 'education';
    } else if (lowerQuery.includes('sức khỏe') || lowerQuery.includes('health')) {
      topic = 'health';
    } else if (lowerQuery.includes('môi trường') || lowerQuery.includes('environment')) {
      topic = 'environment';
    } else if (lowerQuery.includes('công nghệ') || lowerQuery.includes('technology')) {
      topic = 'technology';
    }

    return {
      type,
      level,
      topic
    };
  }

  /**
   * Get relevant exercises based on query analysis
   */
  getRelevantExercises(query: string): any {
    try {
      const analysis = this.analyzeQuery(query);
      const learningContext = analysis.learningContext;

      // This would typically call MCP tools to get exercises
      // For now, return a mock response
      return {
        type: learningContext.type,
        level: learningContext.level,
        topic: learningContext.topic,
        exercises: [], // Would be populated by MCP tools
        totalCount: 0
      };
    } catch (error) {
      this.logger.error('Failed to get relevant exercises', error);
      return {
        type: 'general',
        level: 'unknown',
        topic: 'general',
        exercises: [],
        totalCount: 0
      };
    }
  }

  /**
   * Get vocabulary based on topic and level
   */
  getVocabulary(topic: string, level: string): any {
    try {
      // This would typically call MCP tools to get vocabulary
      // For now, return a mock response
      return {
        topic,
        level,
        words: [], // Would be populated by MCP tools
        totalCount: 0
      };
    } catch (error) {
      this.logger.error('Failed to get vocabulary', error);
      return {
        topic,
        level,
        words: [],
        totalCount: 0
      };
    }
  }

  /**
   * Get learning path based on current and target level
   */
  getLearningPath(currentLevel: string, targetLevel: string): any {
    try {
      // This would typically call MCP tools to get learning path
      // For now, return a mock response
      return {
        currentLevel,
        targetLevel,
        steps: [], // Would be populated by MCP tools
        estimatedDuration: 0
      };
    } catch (error) {
      this.logger.error('Failed to get learning path', error);
      return {
        currentLevel,
        targetLevel,
        steps: [],
        estimatedDuration: 0
      };
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface KnowledgeBase {
  realEstateKnowledge: string;
  websiteContext: string;
  enhancedPrompt: string;
  conversationExamples: string;
  isLoaded: boolean;
}

@Injectable()
export class KnowledgeBaseLoader {
  private readonly logger = new Logger(KnowledgeBaseLoader.name);
  private knowledgeBase: KnowledgeBase;
  private readonly basePath: string;

  constructor() {
    this.knowledgeBase = {
      realEstateKnowledge: '',
      websiteContext: '',
      enhancedPrompt: '',
      conversationExamples: '',
      isLoaded: false
    };
    
    this.basePath = path.join(__dirname, '../knowledge/real_estate_domain');
  }

  /**
   * Load all knowledge base files
   */
  async loadKnowledgeBase(): Promise<void> {
    try {
      this.logger.log('Loading real estate knowledge base...');

      // Load real estate domain knowledge
      this.knowledgeBase.realEstateKnowledge = await this.loadFile(
        path.join(this.basePath, 'documents', 'real_estate_knowledge.md')
      );

      // Load website context
      this.knowledgeBase.websiteContext = await this.loadFile(
        path.join(this.basePath, 'context', 'website_context.md')
      );

      // Load enhanced prompts
      this.knowledgeBase.enhancedPrompt = await this.loadFile(
        path.join(this.basePath, 'prompts', 'enhanced_agent_prompt.md')
      );

      // Load conversation examples
      this.knowledgeBase.conversationExamples = await this.loadFile(
        path.join(this.basePath, 'examples', 'conversation_examples.md')
      );

      this.knowledgeBase.isLoaded = true;
      
      this.logger.log('Knowledge base loaded successfully', {
        realEstateKnowledge: this.knowledgeBase.realEstateKnowledge.length,
        websiteContext: this.knowledgeBase.websiteContext.length,
        enhancedPrompt: this.knowledgeBase.enhancedPrompt.length,
        conversationExamples: this.knowledgeBase.conversationExamples.length
      });
    } catch (error) {
      this.logger.error('Failed to load knowledge base', error);
      this.knowledgeBase.isLoaded = false;
      throw error;
    }
  }

  /**
   * Load a single file
   */
  private async loadFile(filePath: string): Promise<string> {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        this.logger.debug(`Loaded file: ${path.basename(filePath)}`, {
          size: content.length
        });
        return content;
      } else {
        this.logger.warn(`File not found: ${filePath}`);
        return '';
      }
    } catch (error) {
      this.logger.error(`Failed to load file: ${filePath}`, error);
      return '';
    }
  }

  /**
   * Get enhanced system prompt with knowledge base
   */
  getEnhancedSystemPrompt(basePrompt: string): string {
    if (!this.knowledgeBase.isLoaded) {
      this.logger.warn('Knowledge base not loaded, using base prompt');
      return basePrompt;
    }

    const enhancedPrompt = `${basePrompt}

${this.knowledgeBase.enhancedPrompt}

📚 KIẾN THỨC CHUYÊN MÔN:
${this.knowledgeBase.realEstateKnowledge}

🌐 BỐI CẢNH WEBSITE:
${this.knowledgeBase.websiteContext}

💬 VÍ DỤ HỘI THOẠI:
${this.knowledgeBase.conversationExamples}`;

    return enhancedPrompt;
  }

  /**
   * Get specific knowledge section
   */
  getKnowledgeSection(section: 'realEstate' | 'website' | 'prompt' | 'examples'): string {
    if (!this.knowledgeBase.isLoaded) {
      return '';
    }

    switch (section) {
      case 'realEstate':
        return this.knowledgeBase.realEstateKnowledge;
      case 'website':
        return this.knowledgeBase.websiteContext;
      case 'prompt':
        return this.knowledgeBase.enhancedPrompt;
      case 'examples':
        return this.knowledgeBase.conversationExamples;
      default:
        return '';
    }
  }

  /**
   * Check if knowledge base is loaded
   */
  isKnowledgeLoaded(): boolean {
    return this.knowledgeBase.isLoaded;
  }

  /**
   * Get relevant knowledge for a query
   */
  async getRelevantKnowledge(query: string): Promise<any[]> {
    if (!this.knowledgeBase.isLoaded) {
      this.logger.warn('Knowledge base not loaded, cannot get relevant knowledge');
      return [];
    }

    const normalizedQuery = query.toLowerCase();
    const relevantKnowledge: any[] = [];

    try {
      // Phân tích landmarks và địa điểm nổi tiếng
      const landmarks = this.extractLandmarkInfo(normalizedQuery);
      if (landmarks.length > 0) {
        relevantKnowledge.push(...landmarks);
      }

      // Phân tích thông tin khu vực
      const areaInfo = this.extractAreaInfo(normalizedQuery);
      if (areaInfo.length > 0) {
        relevantKnowledge.push(...areaInfo);
      }

      // Phân tích thông tin địa lý
      const locationInfo = this.extractLocationInfo(normalizedQuery);
      if (locationInfo.length > 0) {
        relevantKnowledge.push(...locationInfo);
      }

      this.logger.log('Extracted relevant knowledge', {
        query: query.substring(0, 50),
        knowledgeCount: relevantKnowledge.length,
        types: relevantKnowledge.map(k => k.type)
      });

      return relevantKnowledge;
    } catch (error) {
      this.logger.error('Failed to extract relevant knowledge', {
        error: error.message,
        query: query.substring(0, 50)
      });
      return [];
    }
  }

  /**
   * Extract landmark information from query
   */
  private extractLandmarkInfo(query: string): any[] {
    const landmarks = [
      {
        names: ['cầu rồng', 'cau rong', 'dragon bridge'],
        data: {
          location: 'Hải Châu',
          coordinates: { lat: 16.0544, lng: 108.2272 },
          radius: 2000, // 2km radius
          nearbyAreas: ['Hải Châu', 'Sơn Trà'],
          description: 'Cầu Rồng - biểu tượng của Đà Nẵng'
        }
      },
      {
        names: ['cầu tình yêu', 'cau tinh yeu', 'love bridge'],
        data: {
          location: 'Sơn Trà',
          coordinates: { lat: 16.0838, lng: 108.2441 },
          radius: 1500,
          nearbyAreas: ['Sơn Trà', 'Ngũ Hành Sơn'],
          description: 'Cầu Tình Yêu trên bán đảo Sơn Trà'
        }
      },
      {
        names: ['chùa linh ung', 'chua linh ung', 'linh ung pagoda'],
        data: {
          location: 'Sơn Trà',
          coordinates: { lat: 16.1102, lng: 108.2653 },
          radius: 3000,
          nearbyAreas: ['Sơn Trà', 'Ngũ Hành Sơn'],
          description: 'Chùa Linh Ứng trên bán đảo Sơn Trà'
        }
      },
      {
        names: ['bà nà hills', 'ba na hills', 'bana hills'],
        data: {
          location: 'Hòa Vang',
          coordinates: { lat: 15.9969, lng: 107.9881 },
          radius: 5000,
          nearbyAreas: ['Hòa Vang', 'Liên Chiểu'],
          description: 'Khu du lịch Bà Nà Hills'
        }
      },
      {
        names: ['ngũ hành sơn', 'ngu hanh son', 'marble mountains'],
        data: {
          location: 'Ngũ Hành Sơn',
          coordinates: { lat: 16.0042, lng: 108.2653 },
          radius: 2500,
          nearbyAreas: ['Ngũ Hành Sơn', 'Sơn Trà', 'Hòa Vang'],
          description: 'Ngũ Hành Sơn - núi đá cẩm thạch nổi tiếng'
        }
      }
    ];

    const found: any[] = [];
    for (const landmark of landmarks) {
      for (const name of landmark.names) {
        if (query.includes(name)) {
          found.push({
            type: 'landmark',
            name: landmark.names[0],
            data: landmark.data
          });
          break;
        }
      }
    }

    return found;
  }

  /**
   * Extract area information from query
   */
  private extractAreaInfo(query: string): any[] {
    const areas = [
      {
        names: ['hải châu', 'hai chau'],
        data: {
          propertyTypes: ['căn hộ', 'shophouse', 'văn phòng'],
          priceRange: { min: 2000000000, max: 8000000000 },
          characteristics: ['trung tâm', 'sầm uất', 'tiện ích đầy đủ'],
          nearbyLandmarks: ['cầu rồng', 'chợ hàn']
        }
      },
      {
        names: ['sơn trà', 'son tra'],
        data: {
          propertyTypes: ['biệt thự', 'căn hộ cao cấp', 'resort'],
          priceRange: { min: 5000000000, max: 20000000000 },
          characteristics: ['view biển', 'không khí trong lành', 'yên tĩnh'],
          nearbyLandmarks: ['chùa linh ứng', 'cầu tình yêu']
        }
      },
      {
        names: ['thanh khê', 'thanh khe'],
        data: {
          propertyTypes: ['căn hộ', 'nhà riêng', 'đất nền'],
          priceRange: { min: 1500000000, max: 5000000000 },
          characteristics: ['khu công nghệ', 'phát triển nhanh', 'giá hợp lý'],
          nearbyLandmarks: ['khu công nghệ cao']
        }
      }
    ];

    const found: any[] = [];
    for (const area of areas) {
      for (const name of area.names) {
        if (query.includes(name)) {
          found.push({
            type: 'area_info',
            name: area.names[0],
            data: area.data
          });
          break;
        }
      }
    }

    return found;
  }

  /**
   * Extract location information from query
   */
  private extractLocationInfo(query: string): any[] {
    const locations = [
      {
        keywords: ['gần biển', 'gan bien', 'near beach', 'view biển', 'view bien'],
        data: {
          nearbyAreas: ['Sơn Trà', 'Ngũ Hành Sơn', 'Hòa Vang'],
          propertyTypes: ['biệt thự', 'căn hộ cao cấp'],
          priceAdjustment: 1.3 // Tăng giá 30% cho property gần biển
        }
      },
      {
        keywords: ['trung tâm', 'trung tam', 'downtown', 'city center'],
        data: {
          nearbyAreas: ['Hải Châu', 'Thanh Khê'],
          propertyTypes: ['căn hộ', 'shophouse', 'văn phòng'],
          priceAdjustment: 1.2 // Tăng giá 20% cho property trung tâm
        }
      },
      {
        keywords: ['yên tĩnh', 'yen tinh', 'quiet', 'peaceful'],
        data: {
          nearbyAreas: ['Hòa Vang', 'Liên Chiểu', 'Cẩm Lệ'],
          propertyTypes: ['biệt thự', 'nhà riêng', 'đất nền'],
          priceAdjustment: 0.9 // Giảm giá 10% cho khu vực yên tĩnh
        }
      }
    ];

    const found: any[] = [];
    for (const location of locations) {
      for (const keyword of location.keywords) {
        if (query.includes(keyword)) {
          found.push({
            type: 'location',
            keyword,
            data: location.data
          });
          break;
        }
      }
    }

    return found;
  }

  /**
   * Get knowledge base stats
   */
  getStats(): any {
    return {
      isLoaded: this.knowledgeBase.isLoaded,
      realEstateKnowledge: this.knowledgeBase.realEstateKnowledge.length,
      websiteContext: this.knowledgeBase.websiteContext.length,
      enhancedPrompt: this.knowledgeBase.enhancedPrompt.length,
      conversationExamples: this.knowledgeBase.conversationExamples.length,
      totalSize: Object.values(this.knowledgeBase)
        .filter(v => typeof v === 'string')
        .reduce((sum, content) => sum + content.length, 0)
    };
  }
}

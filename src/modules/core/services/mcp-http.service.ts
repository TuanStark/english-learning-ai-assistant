import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios, { AxiosInstance } from 'axios';

export interface McpResponse {
  success: boolean;
  data?: any;
  error?: string;
  duration?: number;
}

export interface McpTool {
  function: {
    name: string;
    description: string;
    parameters: any;
  };
}

@Injectable()
export class McpHttpService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(McpHttpService.name);
  private isConnected = false;
  private mcpTools: McpTool[] = []; // Cache tools
  private readonly timeout: number;
  private readonly mcpServerUrl: string;
  private httpClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.timeout = this.configService.get<number>('MCP_TIMEOUT', 30000);
    this.mcpServerUrl = this.configService.get<string>('MCP_SERVER_URL');
    
    // Initialize HTTP client
    this.httpClient = axios.create({
      baseURL: this.mcpServerUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      }
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async onModuleInit() {
    await this.initializeMcpServer();
  }

  async onModuleDestroy() {
    await this.cleanup();
  }

  /**
   * Initialize MCP server connection
   */
  private async initializeMcpServer(): Promise<void> {
    try {
      this.logger.log('Initializing MCP server connection via HTTP...');
      this.logger.log(`Connecting to MCP server at ${this.mcpServerUrl}`);
      
      // Test basic connectivity
      const healthResponse = await this.httpClient.get('/');
      this.logger.log('Basic connectivity test successful:', healthResponse.data);
      
      // Get available tools using JSON-RPC
      const toolsResponse = await this.httpClient.post('/mcp', {
        jsonrpc: "2.0",
        method: "tools/list",
        id: 1
      });
      
      if (toolsResponse.data.error) {
        throw new Error(`MCP server error: ${toolsResponse.data.error.message}`);
      }
      
      const tools = toolsResponse.data.result.tools || [];
      
      // Convert to McpTool format
      this.mcpTools = tools.map(tool => ({
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema
        }
      }));
      
      this.logger.log(`Successfully connected to MCP server and loaded ${this.mcpTools.length} tools`);
      this.isConnected = true;
    } catch (error) {
      this.logger.error('Failed to initialize MCP server connection:', error);
      this.isConnected = false;
    }
  }

  /**
   * Call MCP tool using JSON-RPC
   */
  async callTool(toolName: string, args: any): Promise<McpResponse> {
    const startTime = Date.now();

    try {
      if (!this.isConnected) {
        throw new Error('MCP server is not connected');
      }

      this.logger.debug(`Calling MCP tool: ${toolName}`, { args });

      // Call tool using JSON-RPC
      const response = await this.httpClient.post('/mcp', {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: toolName,
          arguments: args
        },
        id: Date.now()
      });

      const duration = Date.now() - startTime;

      if (response.data.error) {
        this.logger.error(`MCP tool call failed: ${response.data.error.message}`);
        return {
          success: false,
          error: response.data.error.message,
          duration
        };
      }

      // Parse the result content
      let resultData = null;
      if (response.data.result && response.data.result.content) {
        try {
          resultData = JSON.parse(response.data.result.content[0].text);
        } catch (parseError) {
          this.logger.warn('Failed to parse MCP tool result, returning raw content');
          resultData = response.data.result.content[0].text;
        }
      }

      this.logger.log(`MCP tool call successful in ${duration}ms`, {
        toolName,
        resultType: typeof resultData
      });

      return {
        success: true,
        data: resultData,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`MCP tool call failed: ${error.message}`, { toolName, args, duration });
      
      return {
        success: false,
        error: error.message,
        duration
      };
    }
  }

  /**
   * Get available MCP tools
   */
  async getTools(): Promise<McpTool[]> {
    if (!this.isConnected) {
      this.logger.warn('MCP server not connected, returning empty tools list');
      return [];
    }

    try {
      this.logger.log('Getting MCP tools via JSON-RPC...');
      const startTime = Date.now();

      // Get tools using JSON-RPC
      const response = await this.httpClient.post('/mcp', {
        jsonrpc: "2.0",
        method: "tools/list",
        id: 1
      });
      
      if (response.data.error) {
        throw new Error(`MCP server error: ${response.data.error.message}`);
      }
      
      const tools = response.data.result.tools || [];
      const duration = Date.now() - startTime;
      this.logger.log(`MCP tools retrieved successfully in ${duration}ms`, {
        toolCount: tools.length
      });

      // Convert to McpTool format
      this.mcpTools = tools.map(tool => ({
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema
        }
      }));

      return this.mcpTools;
    } catch (error) {
      this.logger.error('Failed to get MCP tools', error);
      return [];
    }
  }

  /**
   * Get cached tools
   */
  getAvailableMCPTools(): McpTool[] {
    return this.mcpTools;
  }

  /**
   * Check if MCP server is connected
   */
  isMcpConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get MCP server status
   */
  getMcpStatus(): any {
    return {
      connected: this.isConnected,
      serverUrl: this.mcpServerUrl,
      toolCount: this.mcpTools.length,
      tools: this.mcpTools.map(tool => ({
        name: tool.function.name,
        description: tool.function.description
      }))
    };
  }

  /**
   * Cleanup resources
   */
  private async cleanup(): Promise<void> {
    try {
      this.logger.log('Cleaning up MCP HTTP service...');
      this.isConnected = false;
      this.mcpTools = [];
    } catch (error) {
      this.logger.error('Error during cleanup:', error);
    }
  }

  /**
   * Test MCP server connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.httpClient.get('/');
      return response.status === 200;
    } catch (error) {
      this.logger.error('MCP server connection test failed:', error);
      return false;
    }
  }

  /**
   * Get MCP tools info for logging
   */
  getMcpToolsInfo(): any {
    return {
      connected: this.isConnected,
      toolCount: this.mcpTools.length,
      tools: this.mcpTools.map(tool => tool.function.name)
    };
  }
}

# 📚 English Learning AI Assistant (NestJS + TypeScript)

## 🚀 Overview

Advanced AI-powered English learning assistant built with **NestJS** and **TypeScript**, providing intelligent exercise generation, personalized learning paths, and comprehensive English language support.

## ✨ Features

### 🤖 **AI-Powered Intelligence**
- **GPT-4o Integration**: Advanced natural language understanding
- **Smart Query Processing**: Intent recognition and context awareness
- **Multi-tool Execution**: Seamless integration with learning databases

### 📖 **English Learning Expertise**
- **Exercise Generation**: Grammar, vocabulary, listening, speaking, reading, writing
- **Level Assessment**: A1, A2, B1, B2, C1, C2 proficiency levels
- **Personalized Learning**: Adaptive learning paths based on individual needs

### 🛡️ **Enterprise-Grade Architecture**
- **Type Safety**: Full TypeScript support with compile-time validation
- **Modular Design**: Clean separation of concerns with NestJS modules
- **Error Handling**: Comprehensive error management and logging
- **Performance**: Optimized with caching and rate limiting

### 🔧 **Advanced Features**
- **MCP Integration**: Model Context Protocol for external tools
- **Knowledge Base**: Comprehensive English learning resources
- **Session Management**: Persistent conversation context
- **API Documentation**: Auto-generated Swagger/OpenAPI docs

## 🏗️ Architecture

### **Core Modules**
```
src/
├── modules/
│   ├── core/           # Core services (OpenAI, MCP, Cache)
│   ├── super-agent/    # Main English learning logic
│   └── health/         # Health check endpoints
├── knowledge/          # English learning knowledge base
├── dto/               # Data Transfer Objects
└── common/            # Shared utilities and validators
```

### **Key Components**
- **SuperAgentService**: Main orchestration logic
- **EnglishLearningOpenAIService**: AI-powered learning assistance
- **McpService**: External tool integration
- **KnowledgeBaseLoader**: Learning resource management
- **SystemPromptUtil**: Dynamic prompt generation

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- OpenAI API key
- MCP server (optional)

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd english-learning-ai-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the application**
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### **Environment Variables**
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o

# MCP Configuration
MCP_SERVER_URL=http://localhost:8080
MCP_API_KEY=english-learning-api-key-123

# Application
PORT=3000
NODE_ENV=development
```

## 📚 API Documentation

### **Base URL**
```
http://localhost:3000/api/v1
```

### **Main Endpoints**

#### **Process Learning Query**
```http
POST /super-agent/query
Content-Type: application/json

{
  "query": "Tôi muốn học ngữ pháp thì hiện tại hoàn thành, trình độ B1",
  "sessionId": "optional-session-id"
}
```

#### **Get Agent Status**
```http
GET /super-agent/status
```

#### **Health Check**
```http
GET /super-agent/health
```

### **Swagger Documentation**
Visit `http://localhost:3000/api/docs` for interactive API documentation.

## 🎯 Usage Examples

### **Grammar Learning**
```json
{
  "query": "Tôi muốn học ngữ pháp thì hiện tại hoàn thành, trình độ B1",
  "sessionId": "session-123"
}
```

### **Vocabulary Learning**
```json
{
  "query": "Học từ vựng chủ đề gia đình, trình độ A2",
  "sessionId": "session-123"
}
```

### **Listening Practice**
```json
{
  "query": "Luyện nghe tiếng Anh chủ đề công việc, trình độ B2",
  "sessionId": "session-123"
}
```

### **Speaking Practice**
```json
{
  "query": "Luyện nói tiếng Anh chủ đề du lịch, trình độ B1",
  "sessionId": "session-123"
}
```

## 🧠 AI Capabilities

### **Exercise Generation**
- **Grammar**: Present perfect, past simple, conditionals, passive voice
- **Vocabulary**: Topic-based word lists with definitions and examples
- **Listening**: Audio exercises with comprehension questions
- **Speaking**: Conversation practice and pronunciation guidance
- **Reading**: Comprehension passages with questions
- **Writing**: Essay prompts and writing exercises

### **Level Assessment**
- **A1 (Beginner)**: Basic communication, simple sentences
- **A2 (Elementary)**: Everyday situations, basic grammar
- **B1 (Intermediate)**: Work and study contexts, complex grammar
- **B2 (Upper Intermediate)**: Abstract topics, fluent communication
- **C1 (Advanced)**: Professional contexts, nuanced language
- **C2 (Proficiency)**: Native-like fluency, complex texts

### **Personalized Learning**
- **Adaptive Difficulty**: Adjusts based on performance
- **Learning Paths**: Customized progression routes
- **Progress Tracking**: Monitors improvement over time
- **Weakness Detection**: Identifies areas needing attention

## 🔧 Configuration

### **Learning Configuration**
```typescript
englishLearning: {
  exerciseCacheTtl: 3600,           // 1 hour cache
  difficultyThreshold: 0.7,         // Difficulty matching threshold
  maxExercisesPerRequest: 20        // Max exercises per request
}
```

### **AI Configuration**
```typescript
openai: {
  model: 'gpt-4o',
  maxTokens: 4000,
  temperature: 0.7,
  timeout: 30000
}
```

## 🚀 Deployment

### **Docker**
```bash
# Build image
docker build -t english-learning-ai-assistant .

# Run container
docker run -p 3000:3000 english-learning-ai-assistant
```

### **Docker Compose**
```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.prod.yml up
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📊 Monitoring

### **Health Checks**
- **Liveness**: `/super-agent/health`
- **Readiness**: `/super-agent/status`
- **Metrics**: Built-in performance monitoring

### **Logging**
- **Structured Logs**: JSON format with correlation IDs
- **Log Levels**: DEBUG, INFO, WARN, ERROR
- **Request Tracking**: Full request/response logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- **Documentation**: Check the `/docs` folder
- **Issues**: Create a GitHub issue
- **Email**: support@english-learning-ai.net

## 🎯 Roadmap

### **Phase 1** ✅
- [x] Basic exercise generation
- [x] Level assessment
- [x] Grammar and vocabulary support

### **Phase 2** 🚧
- [ ] Advanced listening exercises
- [ ] Speaking practice with AI
- [ ] Writing feedback system

### **Phase 3** 📋
- [ ] Mobile app integration
- [ ] Gamification features
- [ ] Social learning features

---

**Built with ❤️ using NestJS, TypeScript, and OpenAI**
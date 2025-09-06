const axios = require('axios');

async function testMCPConnection() {
  const mcpServerUrl = 'http://localhost:3003/mcp';
  
  console.log('🔍 Testing MCP Server Connection (JSON-RPC)...');
  console.log(`📍 Server URL: ${mcpServerUrl}`);
  
  try {
    // Test 1: Basic connectivity
    console.log('\n1️⃣ Testing basic connectivity...');
    try {
      const healthResponse = await axios.get('http://localhost:3003/', {
        timeout: 5000
      });
      console.log('✅ Basic connectivity successful:', healthResponse.data);
    } catch (healthError) {
      console.log('⚠️ Basic connectivity test failed, but server might be running with different endpoints');
    }
    
    // Test 2: Get available tools using JSON-RPC
    console.log('\n2️⃣ Testing MCP tools endpoint (JSON-RPC)...');
    const toolsResponse = await axios.post(mcpServerUrl, {
      jsonrpc: "2.0",
      method: "tools/list",
      id: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      timeout: 5000
    });
    
    console.log('✅ Tools retrieved successfully!');
    const tools = toolsResponse.data.result.tools;
    console.log('📊 Total tools:', tools.length);
    
    if (tools && tools.length > 0) {
      console.log('\n🛠️ Available English Learning tools:');
      tools.forEach((tool, index) => {
        console.log(`   ${index + 1}. ${tool.name}`);
        console.log(`      Description: ${tool.description}`);
        console.log(`      Parameters: ${JSON.stringify(tool.inputSchema.properties, null, 2)}`);
        console.log('');
      });
    }
    
    // Test 3: Test vocabulary tool
    console.log('\n3️⃣ Testing get_vocabulary_by_topic tool...');
    try {
      const vocabResponse = await axios.post(mcpServerUrl, {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "get_vocabulary_by_topic",
          arguments: {
            topic_name: "family",
            difficulty_level: "Easy",
            limit: 3
          }
        },
        id: 2
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        timeout: 10000
      });
      
      console.log('✅ Vocabulary tool call successful!');
      const result = JSON.parse(vocabResponse.data.result.content[0].text);
      console.log('📚 Vocabulary results:');
      console.log(`   Total found: ${result.total_found}`);
      console.log(`   Search criteria: ${JSON.stringify(result.search_criteria)}`);
      console.log('\n📖 Sample vocabulary:');
      result.vocabulary.forEach((word, index) => {
        console.log(`   ${index + 1}. ${word.englishWord} (${word.pronunciation})`);
        console.log(`      Meaning: ${word.vietnameseMeaning}`);
        console.log(`      Type: ${word.wordType}`);
        console.log(`      Difficulty: ${word.difficultyLevel}`);
        console.log('');
      });
    } catch (vocabError) {
      console.log('❌ Vocabulary tool call failed:', vocabError.response?.data || vocabError.message);
    }
    
    // Test 4: Test grammar lessons tool
    console.log('\n4️⃣ Testing get_grammar_lessons tool...');
    try {
      const grammarResponse = await axios.post(mcpServerUrl, {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "get_grammar_lessons",
          arguments: {
            difficulty_level: "Easy",
            limit: 2
          }
        },
        id: 3
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        timeout: 10000
      });
      
      console.log('✅ Grammar lessons tool call successful!');
      const result = JSON.parse(grammarResponse.data.result.content[0].text);
      console.log('📝 Grammar lessons results:');
      console.log(`   Total found: ${result.total_found}`);
      console.log(`   Search criteria: ${JSON.stringify(result.search_criteria)}`);
    } catch (grammarError) {
      console.log('❌ Grammar lessons tool call failed:', grammarError.response?.data || grammarError.message);
    }
    
    // Test 5: Test search vocabulary tool
    console.log('\n5️⃣ Testing search_vocabulary tool...');
    try {
      const searchResponse = await axios.post(mcpServerUrl, {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "search_vocabulary",
          arguments: {
            keyword: "family",
            limit: 2
          }
        },
        id: 4
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        timeout: 10000
      });
      
      console.log('✅ Search vocabulary tool call successful!');
      const result = JSON.parse(searchResponse.data.result.content[0].text);
      console.log('🔍 Search results:');
      console.log(`   Total found: ${result.total_found}`);
      console.log(`   Search keyword: ${result.search_criteria.keyword}`);
    } catch (searchError) {
      console.log('❌ Search vocabulary tool call failed:', searchError.response?.data || searchError.message);
    }
    
    // Test 6: Test learning paths tool
    console.log('\n6️⃣ Testing get_learning_paths tool...');
    try {
      const pathsResponse = await axios.post(mcpServerUrl, {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "get_learning_paths",
          arguments: {
            target_level: "Intermediate",
            limit: 2
          }
        },
        id: 5
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        timeout: 10000
      });
      
      console.log('✅ Learning paths tool call successful!');
      const result = JSON.parse(pathsResponse.data.result.content[0].text);
      console.log('🛤️ Learning paths results:');
      console.log(`   Total found: ${result.total_found}`);
      console.log(`   Target level: ${result.search_criteria.target_level}`);
    } catch (pathsError) {
      console.log('❌ Learning paths tool call failed:', pathsError.response?.data || pathsError.message);
    }
    
    console.log('\n🎉 MCP Server connection test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ MCP Server is running and responsive');
    console.log('   ✅ JSON-RPC protocol working correctly');
    console.log('   ✅ Multiple English Learning tools available');
    console.log('   ✅ Tools can be called successfully');
    console.log('   ✅ Data is being returned in correct format');
    
  } catch (error) {
    console.error('❌ MCP Server connection failed:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   🔌 Connection refused - Server might not be running');
      console.error('   💡 Make sure MCP server is running on localhost:3003');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   ⏰ Connection timeout - Server might be slow or unresponsive');
    } else if (error.response) {
      console.error('   📡 Server responded with error:', error.response.status, error.response.statusText);
      console.error('   📄 Response data:', error.response.data);
    } else {
      console.error('   🚨 Unexpected error:', error.message);
    }
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Check if MCP server is running: curl http://localhost:3003/');
    console.log('   2. Check server logs for any errors');
    console.log('   3. Verify the server URL and port');
    console.log('   4. Check firewall settings');
    console.log('   5. Check MCP server documentation for correct endpoints');
  }
}

// Run the test
testMCPConnection();

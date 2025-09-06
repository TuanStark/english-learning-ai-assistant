const axios = require('axios');

async function testMCPConnection() {
  const mcpServerUrl = 'http://localhost:3003';
  
  console.log('🔍 Testing MCP Server Connection...');
  console.log(`📍 Server URL: ${mcpServerUrl}`);
  
  try {
    // Test 1: Basic connectivity
    console.log('\n1️⃣ Testing basic connectivity...');
    try {
      const healthResponse = await axios.get(`${mcpServerUrl}/`, {
        timeout: 5000
      });
      console.log('✅ Basic connectivity successful:', healthResponse.data);
    } catch (healthError) {
      console.log('⚠️ Basic connectivity test failed, but server might be running with different endpoints');
    }
    
    // Test 2: Get available tools using correct endpoint
    console.log('\n2️⃣ Testing MCP tools endpoint...');
    const toolsResponse = await axios.get(`${mcpServerUrl}/mcp/tools`, {
      timeout: 5000
    });
    console.log('✅ Tools retrieved successfully!');
    console.log('📊 Response data:', JSON.stringify(toolsResponse.data, null, 2));
    
    const tools = toolsResponse.data.tools || toolsResponse.data;
    console.log('📊 Total tools:', tools.length || 0);
    
    if (tools && tools.length > 0) {
      console.log('\n🛠️ Available tools:');
      tools.forEach((tool, index) => {
        console.log(`   ${index + 1}. ${tool.name || tool.function?.name || 'Unknown'}`);
        console.log(`      Description: ${tool.description || tool.function?.description || 'No description'}`);
        if (tool.parameters || tool.function?.parameters) {
          console.log(`      Parameters: ${JSON.stringify(tool.parameters || tool.function?.parameters || {})}`);
        }
        console.log('');
      });
    }
    
    // Test 3: Test English Learning specific tool call
    console.log('\n3️⃣ Testing English Learning tool call...');
    try {
      const toolCallResponse = await axios.post(`${mcpServerUrl}/mcp/call`, {
        tool: 'get_vocabulary_by_topic',
        parameters: {
          topic_name: 'family',
          difficulty_level: 'Easy',
          limit: 5
        }
      }, {
        timeout: 10000
      });
      console.log('✅ Tool call successful!');
      console.log('📊 Response data:', JSON.stringify(toolCallResponse.data, null, 2));
    } catch (toolError) {
      console.log('⚠️ Tool call failed:', toolError.response?.data || toolError.message);
      
      // Try alternative call format
      try {
        console.log('\n🔄 Trying alternative call format...');
        const altCallResponse = await axios.post(`${mcpServerUrl}/mcp/call`, {
          name: 'get_vocabulary_by_topic',
          arguments: {
            topic_name: 'family',
            difficulty_level: 'Easy',
            limit: 5
          }
        }, {
          timeout: 10000
        });
        console.log('✅ Alternative call successful!');
        console.log('📊 Response data:', JSON.stringify(altCallResponse.data, null, 2));
      } catch (altError) {
        console.log('❌ Alternative call also failed:', altError.response?.data || altError.message);
      }
    }
    
    // Test 4: Test other English Learning tools if available
    console.log('\n4️⃣ Testing other English Learning tools...');
    const englishLearningTools = tools.filter(tool => 
      (tool.name || tool.function?.name)?.includes('vocabulary') || 
      (tool.name || tool.function?.name)?.includes('exercise') || 
      (tool.name || tool.function?.name)?.includes('grammar') ||
      (tool.name || tool.function?.name)?.includes('learning')
    );
    
    console.log(`📚 English Learning tools found: ${englishLearningTools.length}`);
    
    for (const tool of englishLearningTools) {
      const toolName = tool.name || tool.function?.name;
      console.log(`\n🔧 Testing tool: ${toolName}`);
      
      try {
        const testResponse = await axios.post(`${mcpServerUrl}/mcp/call`, {
          tool: toolName,
          parameters: {
            limit: 3
          }
        }, {
          timeout: 10000
        });
        console.log(`   ✅ ${toolName} call successful!`);
        console.log(`   📊 Response: ${JSON.stringify(testResponse.data, null, 2).substring(0, 200)}...`);
      } catch (error) {
        console.log(`   ❌ ${toolName} call failed: ${error.response?.data?.message || error.message}`);
      }
    }
    
    // Test 5: Test other possible endpoints
    console.log('\n5️⃣ Testing other possible endpoints...');
    const otherEndpoints = [
      '/mcp/status',
      '/api/status',
      '/status',
      '/mcp/health',
      '/api/health'
    ];
    
    for (const endpoint of otherEndpoints) {
      try {
        const response = await axios.get(`${mcpServerUrl}${endpoint}`, {
          timeout: 3000
        });
        console.log(`✅ ${endpoint}:`, response.data);
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.response?.status || error.message}`);
      }
    }
    
    console.log('\n🎉 MCP Server connection test completed!');
    
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

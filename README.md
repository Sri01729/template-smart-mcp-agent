# Smart MCP Agent Template

A Mastra template for creating intelligent AI agents that can dynamically discover, install, and use MCP (Model Context Protocol) servers in run time. This template provides a foundation for building agents that can automatically find and integrate external services through the MCP ecosystem.

## 🚀 Features

- **Dynamic MCP Server Discovery**: Search the Smithery registry for available MCP servers
- **Automatic Server Installation**: Add servers to your agent's configuration dynamically
- **Persistent Configuration**: Servers are permanently added to the codebase
- **File System Access**: Built-in filesystem MCP server for project file operations
- **Memory Management**: LibSQL-based memory storage for agent state
- **Type Safety**: Full TypeScript support with Zod schema validation

## 🏗️ Project Structure

```
src/
├── mastra/
│   ├── agents/
│   │   └── smart-mcp-agent.ts      # Main AI agent with MCP capabilities
│   ├── tools/
│   │   ├── add-mcp-server.ts       # Dynamically add MCP servers to config
│   │   ├── discover-servers.ts     # Search Smithery registry for servers
│   │   └── list-servers.ts         # List currently configured servers
│   ├── index.ts                    # Mastra configuration
│   ├── mcp.ts                      # MCP client configuration
│   └── types.ts                    # TypeScript type definitions
```

## 🛠️ Installation

1. **Clone the template**:
   ```bash
   npx create-mastra@latest template-smart-mcp-agent
   cd template-smart-mcp-agent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for agent model | Yes |
| `SMITHERY_API_KEY` | Smithery registry API key  | Yes |

### Agent Configuration

```typescript
import { smartMcpAgent } from './src/mastra/agents/smart-mcp-agent';

// Agent is configured with:
// - OpenAI GPT-4o-mini model
// - LibSQL memory storage
// - Dynamic MCP server management
```

## 🔄 Workflow

The Smart MCP Agent follows this workflow:

1. **Discovery**: Use `discover-servers` to search for MCP servers on Smithery
2. **Installation**: Use `add-mcp-server` to dynamically add servers to the configuration
3. **Verification**: Use `list-servers` to confirm installation
4. **Usage**: Access server tools through the agent

### Example Usage

```typescript
// Search for web search servers
await discoverServersTool.execute({
  context: { query: "web search", limit: 5 }
});

// Add a web search server
await addMcpServerTool.execute({
  context: {
    name: "websearch",
    serverId: "@Aas-ee/open-websearch",
    description: "Web search capabilities"
  }
});

// List configured servers
await listServersTool.execute({ context: {} });
```

## 🛠️ Tools

### Add MCP Server Tool

Dynamically adds MCP servers to the `mcp.ts` configuration file.

**Input Schema**:
```typescript
{
  name: z.string().min(1),           // Server name (e.g., "websearch")
  serverId: z.string().min(1),       // Full server ID (e.g., "@Aas-ee/open-websearch")
  description: z.string().optional() // Optional description
}
```

**Features**:
- Automatically converts server names to valid JavaScript identifiers
- Updates the `mcp.ts` file with proper configuration
- Triggers automatic server restart to load new servers
- Provides clear feedback and next steps

### Discover Servers Tool

Searches the Smithery registry for available MCP servers.

**Input Schema**:
```typescript
{
  query: z.string(),                 // Search query
  limit: z.number().int().min(1).max(20).optional() // Result limit
}
```

**Features**:
- Searches Smithery registry with optional API key
- Returns server details including name, description, and usage stats
- Graceful fallback if API is unavailable

### List Servers Tool

Lists all currently configured MCP servers.

**Features**:
- Reads the current `mcp.ts` configuration
- Identifies server types (Smithery, filesystem, etc.)
- Shows server IDs and configuration details
- Provides clear status information

## 🔄 Server Management

### Adding Servers

When you add a server using `add-mcp-server`:

1. **Configuration Update**: The server is added to `src/mastra/mcp.ts`
2. **Automatic Restart**: Mastra server restarts to load the new server
3. **Persistence**: Server configuration persists across restarts
4. **Verification**: Use `list-servers` to confirm successful addition

### Server Types

- **Smithery Servers**: Remote MCP servers hosted on Smithery
- **Filesystem Server**: Local filesystem access for project files
- **Custom Servers**: Any MCP-compatible server

### Current Configuration

The template comes with these pre-configured servers:

- **textEditor**: Filesystem access for project files
- **geeknews**: Tech news and updates
- **aidaily**: AI daily news and insights

## 🛡️ Error Handling

The template includes comprehensive error handling:

- **MCP Connection Failures**: Graceful handling of server connection issues
- **File System Errors**: Safe file operations with proper error messages
- **API Rate Limiting**: Built-in retry logic for external API calls
- **Validation Errors**: Zod schema validation with clear error messages

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server

### Development Workflow

1. **Start the dev server**: `npm run dev`
2. **Access the playground**: http://localhost:4111
3. **Test agent interactions**: Use the playground to interact with the agent
4. **Add new servers**: Use the agent to discover and add MCP servers
5. **Monitor logs**: Check terminal output for server status and errors

## 📝 API Reference

### Agent

The `smartMcpAgent` provides:

- **Model**: OpenAI GPT-4o-mini
- **Memory**: LibSQL-based persistent storage
- **Tools**: Dynamic MCP server management tools
- **Instructions**: Comprehensive workflow guidance

### MCP Client

The MCP client (`buildMcp`) manages:

- **Server Connections**: Automatic connection to configured servers
- **Tool Discovery**: Dynamic tool loading from MCP servers
- **Error Recovery**: Graceful handling of connection issues
- **Heartbeat Management**: Automatic connection maintenance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details.

## 🔗 Resources

- [Mastra Documentation](https://mastra.ai)
- [MCP Protocol](https://modelcontextprotocol.io)
- [Smithery Registry](https://smithery.ai)
- [OpenAI API](https://platform.openai.com)

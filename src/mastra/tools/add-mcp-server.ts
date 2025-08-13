import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const addMcpServerTool = createTool({
  id: 'add-mcp-server',
  description: 'Add an MCP server by dynamically modifying the mcp.ts file configuration',
  inputSchema: z.object({
    name: z.string().min(1),
    serverId: z.string().min(1), // e.g., "@Aas-ee/open-websearch"
    description: z.string().optional(),
  }),
  outputSchema: z.object({
    status: z.literal('ok'),
    name: z.string(),
    serverId: z.string(),
    message: z.string()
  }),
  execute: async ({ context }) => {
    const { name, serverId, description } = context;

    try {
      // Fix path resolution for bundled environment
      // In dev mode, we need to go up from .mastra/output to the project root
      const projectRoot = process.cwd().includes('.mastra/output')
        ? join(process.cwd(), '..', '..')
        : process.cwd();
      const mcpFilePath = join(projectRoot, 'src', 'mastra', 'mcp.ts');

      let mcpContent = readFileSync(mcpFilePath, 'utf8');

      // Find the servers object in the buildMcp function - handle multiline structure
      const serversPattern = /const servers: Record<string, any> = \{([\s\S]*?)\};/;
      const match = mcpContent.match(serversPattern);

      if (!match) {
        throw new Error('Could not find servers configuration in mcp.ts');
      }

      // Convert server name to valid JavaScript identifier
      const serverKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');

      const currentServers = match[1];
      const newServerConfig = `    ${serverKey}: {
      command: 'npx',
      args: [
        '-y',
        '@smithery/cli@latest',
        'run',
        '${serverId}',
        '--config',
        '{}',
      ],
    },`;

      // Add the new server to the configuration
      const updatedServers = currentServers + '\n' + newServerConfig;
      const newMcpContent = mcpContent.replace(serversPattern, `const servers: Record<string, any> = {${updatedServers}};`);

      // Write the updated content back to the file
      writeFileSync(mcpFilePath, newMcpContent, 'utf8');

      return {
        status: 'ok' as const,
        name,
        serverId,
        message: `✅ Successfully added ${serverId} to mcp.ts configuration!

The server "${name}" has been dynamically added to the MCP client configuration in src/mastra/mcp.ts.

Server configuration:
- Name: ${name} (key: ${serverKey})
- Server ID: ${serverId}
- Method: Smithery CLI over stdio

🔄 **Server Restart Notice**: The Mastra server will automatically restart to load the new MCP server. You may experience a brief connection interruption during the restart process. Once the restart completes, the new server will be available and ready to use!

💡 **Next Steps**:
- Wait for the server restart to complete (usually takes 10-15 seconds)
- Use "list-servers" to verify the server was added successfully
- The new server's tools will be available for the agent to use`
      };
    } catch (error) {
      throw new Error(`Failed to add MCP server to mcp.ts: ${error}`);
    }
  },
});

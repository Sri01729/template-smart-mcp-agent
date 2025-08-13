import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const listServersTool = createTool({
  id: 'list-servers',
  description: 'List all MCP servers currently configured in the mcp.ts file',
  inputSchema: z.object({}),
  outputSchema: z.object({
    servers: z.array(z.object({
      name: z.string(),
      serverId: z.string().optional(),
      type: z.string(),
    })),
    message: z.string(),
  }),
  execute: async () => {
    try {
      // Fix path resolution for bundled environment
      // In dev mode, we need to go up from .mastra/output to the project root
      const projectRoot = process.cwd().includes('.mastra/output')
        ? join(process.cwd(), '..', '..')
        : process.cwd();
      const mcpFilePath = join(projectRoot, 'src', 'mastra', 'mcp.ts');

      const mcpContent = readFileSync(mcpFilePath, 'utf8');

      // Find all server configurations in the file
      const serverPattern = /(\w+):\s*\{\s*command:\s*['"]npx['"],\s*args:\s*\[([^\]]+)\]/g;
      const matches = Array.from(mcpContent.matchAll(serverPattern));

      const servers = matches.map(match => {
        const name = match[1];
        const args = match[2];

        // Extract server ID from args if it's a Smithery server
        let serverId: string | undefined;
        let type = 'unknown';

        if (args.includes('@smithery/cli')) {
          // Find the server ID in the args
          const serverIdMatch = args.match(/['"]([^'"]+@[^'"]+)['"]/);
          serverId = serverIdMatch ? serverIdMatch[1] : undefined;
          type = 'smithery';
        } else if (args.includes('@modelcontextprotocol/server-filesystem')) {
          type = 'filesystem';
        }

        return {
          name,
          serverId,
          type,
        };
      });

      return {
        servers,
        message: `Found ${servers.length} MCP servers configured in mcp.ts:

${servers.map(server =>
  `- ${server.name} (${server.type})${server.serverId ? ` - ${server.serverId}` : ''}`
).join('\n')}

These servers are permanently configured in the codebase and will persist across restarts.`,
      };
    } catch (error) {
      throw new Error(`Failed to list servers from mcp.ts: ${error}`);
    }
  },
});

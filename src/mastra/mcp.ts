import path from 'node:path';
import { MCPClient } from '@mastra/mcp';

export async function buildMcp(): Promise<MCPClient> {
  const servers: Record<string, any> = {
    // Filesystem server for project access
    textEditor: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', path.join(process.cwd(), '..', '..')],
    },

    // Agent-added servers (use lowercase identifiers, no spaces)

    
    geeknews: {
      command: 'npx',
      args: [
        '-y',
        '@smithery/cli@latest',
        'run',
        '@the0807/geeknews-mcp-server',
        '--config',
        '{}',
      ],
    },
    aidaily: {
      command: 'npx',
      args: [
        '-y',
        '@smithery/cli@latest',
        'run',
        '@PawNzZi/aidaily',
        '--config',
        '{}',
      ],
    },};

  return new MCPClient({ id: 'app-store-mcp', servers });
}

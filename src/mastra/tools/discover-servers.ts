import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const discoverServersTool = createTool({
  id: 'discover-servers',
  description: 'Search for MCP servers on Smithery',
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().int().min(1).max(20).optional(),
  }),
  outputSchema: z.object({
    servers: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      qualifiedName: z.string(),
      useCount: z.number().optional(),
      remote: z.boolean().optional(),
      homepage: z.string().optional(),
    })),
  }),
  execute: async ({ context }) => {
    const { query, limit = 10 } = context;

    // Smithery Registry API call with API key
    const url = new URL('/servers', 'https://registry.smithery.ai');
    url.searchParams.set('q', query);
    url.searchParams.set('pageSize', String(limit));

    try {
      const apiKey = process.env.SMITHERY_API_KEY;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        throw new Error(`Smithery Registry API error: ${response.status}`);
      }

      const data = await response.json();
      const servers = (data.servers || []).map((server: any) => ({
        id: server.qualifiedName,
        name: server.displayName,
        description: server.description,
        qualifiedName: server.qualifiedName,
        useCount: server.useCount,
        remote: server.remote,
        homepage: server.homepage,
      }));

      return { servers };
    } catch (error) {
      // Return empty array if API fails
      return { servers: [] };
    }
  },
});

import { z } from 'zod';

// Tool input/output schemas
export const addMcpServerInputSchema = z.object({
  name: z.string().min(1),
  serverId: z.string().min(1),
  description: z.string().optional(),
});

export const addMcpServerOutputSchema = z.object({
  status: z.literal('ok'),
  name: z.string(),
  serverId: z.string(),
  message: z.string(),
});

export const discoverServersInputSchema = z.object({
  query: z.string().optional(),
  pageSize: z.number().optional().default(10),
});

export const discoverServersOutputSchema = z.object({
  servers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })),
  totalCount: z.number(),
  message: z.string(),
});

export const listServersInputSchema = z.object({});

export const listServersOutputSchema = z.object({
  servers: z.array(z.object({
    name: z.string(),
    serverId: z.string().optional(),
    type: z.string(),
  })),
  message: z.string(),
});

// TypeScript types derived from schemas
export type AddMcpServerInput = z.infer<typeof addMcpServerInputSchema>;
export type AddMcpServerOutput = z.infer<typeof addMcpServerOutputSchema>;
export type DiscoverServersInput = z.infer<typeof discoverServersInputSchema>;
export type DiscoverServersOutput = z.infer<typeof discoverServersOutputSchema>;
export type ListServersInput = z.infer<typeof listServersInputSchema>;
export type ListServersOutput = z.infer<typeof listServersOutputSchema>;

// MCP Server types
export interface McpServer {
  id: string;
  name: string;
  description?: string;
  author?: string;
  tags?: string[];
  type: 'smithery' | 'filesystem' | 'unknown';
}

// Workflow types
export interface ServerDiscoveryResult {
  success: boolean;
  installedServer?: {
    id: string;
    name: string;
    serverKey: string;
  };
  message: string;
}

// Agent configuration types
export interface AgentConfig {
  name: string;
  model: string;
  tools: string[];
  memory: {
    type: string;
    url: string;
  };
}

// Error types
export interface MastraError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Configuration types
export interface MastraConfig {
  agents: Record<string, AgentConfig>;
  workflows: Record<string, any>;
  storage: {
    type: string;
    url: string;
  };
  logger: {
    name: string;
    level: string;
  };
}

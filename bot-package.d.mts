export interface ImportedBot {
  id: string;
  name: string;
  strategy: string;
  active: false;
  symbols: string[];
  lotSize: number;
  stakeUsd: number;
  multiplier: number;
  minAccuracy: number;
  slPips: number;
  tpPips: number;
  cooldownMs: number;
  tradesCount: number;
  winRate: number;
  winsCount: number;
  realizedPnl: number;
  researchEvidence: Record<string, unknown>;
  lastExecutedAt: number;
  scriptRuntime: 'node' | 'python' | null;
  scriptSource: string | null;
}

export function parseBotImport(
  fileName: string,
  contents: string,
  availableSymbols: string[],
  defaults: Record<string, unknown>
): ImportedBot[];

export const botImportLimits: Readonly<{
  maxImportBytes: number;
  maxScriptBytes: number;
  maxBots: number;
}>;

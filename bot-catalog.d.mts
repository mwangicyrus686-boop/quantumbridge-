export type BotCatalogFilter = 'all' | 'active' | 'synthetics' | 'fx-metals' | 'custom';

export function filterBotCatalog<T extends {
  id?: string;
  name?: string;
  strategy?: string;
  symbols?: string[];
  active?: boolean;
  scriptRuntime?: string | null;
}>(
  bots: T[],
  filter: BotCatalogFilter,
  query: string,
  markets: Array<{ symbol: string; category?: string }>
): T[];

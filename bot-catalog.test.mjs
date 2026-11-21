import assert from 'node:assert/strict';
import test from 'node:test';
import { filterBotCatalog } from './bot-catalog.mjs';

const markets = [
  { symbol: 'R_75', category: 'Synthetic • 1s' },
  { symbol: 'EUR/USD', category: 'FX Major • 2s' },
  { symbol: 'XAU/USD', category: 'Metals • 2s' },
];
const bots = [
  { id: 'DRV-01', name: 'Index watcher', strategy: 'Trend filter', symbols: ['R_75'], active: true },
  { id: 'QB-IMP-02', name: 'Imported metals', strategy: 'Mean reversion', symbols: ['XAU/USD'], active: false },
  { id: 'DRV-03', name: 'FX scanner', strategy: 'Session filter', symbols: ['EUR/USD'], active: false },
];

test('filters catalog by assigned market category and active status', () => {
  assert.deepEqual(filterBotCatalog(bots, 'synthetics', '', markets).map((bot) => bot.id), ['DRV-01']);
  assert.deepEqual(filterBotCatalog(bots, 'fx-metals', '', markets).map((bot) => bot.id), ['QB-IMP-02', 'DRV-03']);
  assert.deepEqual(filterBotCatalog(bots, 'active', '', markets).map((bot) => bot.id), ['DRV-01']);
  assert.deepEqual(filterBotCatalog(bots, 'custom', '', markets).map((bot) => bot.id), ['QB-IMP-02']);
});

test('searches names, strategies, and symbols without case sensitivity', () => {
  assert.deepEqual(filterBotCatalog(bots, 'all', 'mean', markets).map((bot) => bot.id), ['QB-IMP-02']);
  assert.deepEqual(filterBotCatalog(bots, 'all', 'r_75', markets).map((bot) => bot.id), ['DRV-01']);
});

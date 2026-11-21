function marketCategoriesFor(bot, markets) {
  const symbols = new Set(Array.isArray(bot.symbols) ? bot.symbols : []);
  return markets
    .filter((market) => symbols.has(market.symbol))
    .map((market) => String(market.category || '').toLowerCase());
}

export function filterBotCatalog(bots, filter, query, markets) {
  const normalizedQuery = String(query || '').trim().toLowerCase();

  return bots.filter((bot) => {
    if (filter === 'active' && !bot.active) return false;
    if (filter === 'custom') {
      const isCustom = bot.id?.startsWith('QB-IMP-')
        || bot.id?.startsWith('DRV-BOT-')
        || Boolean(bot.scriptRuntime);
      if (!isCustom) return false;
    }

    const categories = marketCategoriesFor(bot, markets);
    if (filter === 'synthetics' && !categories.some((category) => /synthetic|boom|crash|step|jump/.test(category))) {
      return false;
    }
    if (filter === 'fx-metals' && !categories.some((category) => /fx|metal/.test(category))) {
      return false;
    }
    if (normalizedQuery) {
      const searchableText = [bot.name, bot.strategy, ...(bot.symbols || [])]
        .join(' ')
        .toLowerCase();
      if (!searchableText.includes(normalizedQuery)) return false;
    }
    return true;
  });
}

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Activity,
  Bot,
  Cpu,
  Terminal,
  ShieldAlert,
  Play,
  Pause,
  Zap,
  Code2,
  Copy,
  Check,
  Radio,
  Layers,
  X,
  Server,
  ChevronRight,
  Sparkles,
  Lock,
  Unlock,
  Settings,
  Gauge,
  Flame,
  Hash,
  Globe2,
  ShieldCheck,
  Wallet,
  KeyRound,
  LogOut,
  AlertTriangle,
  OctagonAlert,
  ExternalLink,
  Link2,
  RefreshCw,
  UserCheck,
  Plus,
  Sliders,
  Trash2,
  Maximize2,
  LayoutGrid,
  Home,
  ArrowRight,
  BarChart3,
  Shield,
  Compass,
  Palette,
  Award,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  BookOpen,
  Compass as CompassIcon,
  Eye,
  EyeOff
} from 'lucide-react';

// ============================================================================
// BRAND LOGO: CUSTOM "Q" WITH RISING TRADING GRAPH & CANDLESTICKS
// ============================================================================

const QuantumBridgeLogo = ({ className = 'w-10 h-10' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="QuantumBridge Logo"
  >
    <defs>
      <linearGradient id="qbRingGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="50%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
      <linearGradient id="qbGraphGrad" x1="16" y1="42" x2="50" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#a7f3d0" />
      </linearGradient>
      <filter id="qbGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Subtle dark badge backdrop */}
    <rect x="3" y="3" width="58" height="58" rx="15" fill="#091118" stroke="url(#qbRingGrad)" strokeWidth="2" />

    {/* Inner mini candlesticks */}
    <rect x="21" y="29" width="3" height="9" rx="1" fill="#10b981" opacity="0.55" />
    <rect x="27" y="24" width="3" height="12" rx="1" fill="#06b6d4" opacity="0.65" />
    <rect x="33" y="26" width="3" height="10" rx="1" fill="#f43f5e" opacity="0.55" />
    <rect x="39" y="19" width="3" height="14" rx="1" fill="#10b981" opacity="0.75" />

    {/* Outer "Q" Ring */}
    <circle
      cx="31"
      cy="31"
      r="17.5"
      stroke="url(#qbRingGrad)"
      strokeWidth="4.5"
      strokeLinecap="round"
    />

    {/* "Q" Tail */}
    <path
      d="M39.5 40.5L50.5 51.5"
      stroke="url(#qbRingGrad)"
      strokeWidth="5"
      strokeLinecap="round"
    />

    {/* Rising Trading Graph Trendline cutting through the Q */}
    <path
      d="M15 40L24 32L31 35.5L46 18.5"
      stroke="url(#qbGraphGrad)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#qbGlow)"
    />
    {/* Arrowhead on Trading Graph */}
    <path
      d="M40.5 18H46.5V24"
      stroke="#a7f3d0"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ============================================================================
// VISUAL THEMES CONFIGURATION
// ============================================================================

const APP_THEMES = {
  quantum_emerald: {
    id: 'quantum_emerald',
    name: 'Quantum Emerald (Default)',
    description: 'Deep midnight slate with emerald and cyan institutional accents.',
    appBg: 'bg-[#080b10]',
    headerBg: 'bg-[#0c1017]/95',
    cardBg: 'bg-[#0d1117]',
    subCardBg: 'bg-[#080b10]',
    border: 'border-slate-800/90',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-600 hover:bg-emerald-500',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    swatch: ['#080b10', '#10b981', '#06b6d4']
  },
  obsidian_gold: {
    id: 'obsidian_gold',
    name: 'Obsidian Gold Desk',
    description: 'High-contrast charcoal carbon with warm sovereign gold highlights.',
    appBg: 'bg-[#090807]',
    headerBg: 'bg-[#11100d]/95',
    cardBg: 'bg-[#14120e]',
    subCardBg: 'bg-[#0b0a08]',
    border: 'border-amber-900/40',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-stone-400',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-600 hover:bg-amber-500',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    swatch: ['#090807', '#f59e0b', '#fbbf24']
  },
  cyber_violet: {
    id: 'cyber_violet',
    name: 'Cyber Violet Synth',
    description: 'Electric indigo backdrop engineered for 24/7 synthetic volatility.',
    appBg: 'bg-[#090712]',
    headerBg: 'bg-[#100d1f]/95',
    cardBg: 'bg-[#131024]',
    subCardBg: 'bg-[#0a0814]',
    border: 'border-violet-900/50',
    textPrimary: 'text-violet-50',
    textSecondary: 'text-indigo-300/70',
    accentText: 'text-fuchsia-400',
    accentBg: 'bg-fuchsia-600 hover:bg-fuchsia-500',
    badgeBg: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/40',
    swatch: ['#090712', '#d946ef', '#8b5cf6']
  },
  crimson_deriv: {
    id: 'crimson_deriv',
    name: 'Quantum Crimson Pro',
    description: 'Signature coral-crimson terminal with high-legibility dark surfaces.',
    appBg: 'bg-[#0c0809]',
    headerBg: 'bg-[#140d0f]/95',
    cardBg: 'bg-[#171012]',
    subCardBg: 'bg-[#0d090a]',
    border: 'border-rose-900/45',
    textPrimary: 'text-rose-50',
    textSecondary: 'text-zinc-400',
    accentText: 'text-rose-400',
    accentBg: 'bg-rose-600 hover:bg-rose-500',
    badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
    swatch: ['#0c0809', '#f43f5e', '#fb7185']
  },
  arctic_daylight: {
    id: 'arctic_daylight',
    name: 'Arctic Daylight Terminal',
    description: 'Crisp high-visibility light mode for bright trading rooms.',
    appBg: 'bg-slate-100',
    headerBg: 'bg-white/95',
    cardBg: 'bg-white',
    subCardBg: 'bg-slate-50',
    border: 'border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    accentText: 'text-emerald-600',
    accentBg: 'bg-emerald-600 hover:bg-emerald-700',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    swatch: ['#f1f5f9', '#059669', '#0284c7']
  }
};

// ============================================================================
// SYNTHETIC, FX & COMMODITIES MARKET CONFIGURATIONS
// ============================================================================

const INITIAL_DERIV_MARKETS = [
  {
    symbol: 'R_75',
    derivTickSymbol: 'R_75',
    ctraderName: 'Volatility 75 Index',
    displayName: 'Volatility 75 Index',
    category: 'Synthetic • 1s',
    tickSpeed: '1s',
    constVol: '75%',
    price: 412845.62,
    digits: 2,
    pipSize: 1.0,
    minLot: 0.001,
    lotStep: 0.001,
    defaultLot: 0.005,
    pointValuePerLot: 1.0,
    spread: 18.5,
    rsi: 64.2,
    macd: 412.4,
    spikeCounter: null,
    spikeAvg: null,
    spikeProb: null,
    regime: 'TRENDING EXPANSION',
    accuracy: 89,
    bias: 'BUY',
    history: [411900, 412150, 412080, 412420, 412610, 412730, 412845.62]
  },
  {
    symbol: '1HZ100V',
    derivTickSymbol: '1HZ100V',
    ctraderName: 'Volatility 100 (1s) Index',
    displayName: 'Volatility 100 (1s)',
    category: 'Synthetic • 1s',
    tickSpeed: '1s',
    constVol: '100%',
    price: 1842.35,
    digits: 2,
    pipSize: 0.1,
    minLot: 0.01,
    lotStep: 0.01,
    defaultLot: 0.05,
    pointValuePerLot: 1.0,
    spread: 0.45,
    rsi: 31.4,
    macd: -4.82,
    spikeCounter: null,
    spikeAvg: null,
    spikeProb: null,
    regime: 'MEAN REVERSION',
    accuracy: 86,
    bias: 'BUY',
    history: [1849.1, 1847.4, 1846.2, 1845.8, 1844.1, 1843.0, 1842.35]
  },
  {
    symbol: 'BOOM1000',
    derivTickSymbol: 'BOOM1000',
    ctraderName: 'Boom 1000 Index',
    displayName: 'Boom 1000 Index',
    category: 'Boom/Crash • 1s',
    tickSpeed: '1s',
    constVol: 'Spike+',
    price: 14892.45,
    digits: 2,
    pipSize: 0.1,
    minLot: 0.20,
    lotStep: 0.01,
    defaultLot: 0.20,
    pointValuePerLot: 0.1,
    spread: 1.2,
    rsi: 28.6,
    macd: -12.4,
    spikeCounter: 874,
    spikeAvg: 1000,
    spikeProb: 87,
    regime: 'TICK EXHAUSTION',
    accuracy: 91,
    bias: 'BUY',
    history: [14908, 14905, 14902, 14899, 14896, 14894, 14892.45]
  },
  {
    symbol: 'CRASH500',
    derivTickSymbol: 'CRASH500',
    ctraderName: 'Crash 500 Index',
    displayName: 'Crash 500 Index',
    category: 'Boom/Crash • 1s',
    tickSpeed: '1s',
    constVol: 'Spike-',
    price: 6418.70,
    digits: 2,
    pipSize: 0.1,
    minLot: 0.20,
    lotStep: 0.01,
    defaultLot: 0.25,
    pointValuePerLot: 0.1,
    spread: 0.9,
    rsi: 72.1,
    macd: 8.65,
    spikeCounter: 438,
    spikeAvg: 500,
    spikeProb: 88,
    regime: 'DROP IMMINENT',
    accuracy: 88,
    bias: 'SELL',
    history: [6406, 6409, 6411, 6413, 6415, 6417, 6418.70]
  },
  {
    symbol: 'stpRNG',
    derivTickSymbol: 'stpRNG',
    ctraderName: 'Step Index',
    displayName: 'Step Index',
    category: 'Step • 1s',
    tickSpeed: '1s',
    constVol: '±0.10 Fixed',
    price: 8542.30,
    digits: 2,
    pipSize: 0.1,
    minLot: 0.10,
    lotStep: 0.10,
    defaultLot: 0.20,
    pointValuePerLot: 1.0,
    spread: 0.2,
    rsi: 51.8,
    macd: 0.45,
    spikeCounter: null,
    spikeAvg: null,
    spikeProb: null,
    regime: 'SYMMETRIC WALK',
    accuracy: 77,
    bias: 'BUY',
    history: [8541.8, 8542.0, 8541.9, 8542.1, 8542.2, 8542.1, 8542.30]
  },
  {
    symbol: 'JD25',
    derivTickSymbol: 'JD25',
    ctraderName: 'Jump 25 Index',
    displayName: 'Jump 25 Index',
    category: 'Jump • 1s',
    tickSpeed: '1s',
    constVol: '25% + 3xJmp',
    price: 52910.40,
    digits: 2,
    pipSize: 0.1,
    minLot: 0.01,
    lotStep: 0.01,
    defaultLot: 0.02,
    pointValuePerLot: 0.1,
    spread: 2.1,
    rsi: 59.4,
    macd: 34.2,
    spikeCounter: 1420,
    spikeAvg: 1800,
    spikeProb: 79,
    regime: 'JUMP WINDOW',
    accuracy: 84,
    bias: 'BUY',
    history: [52840, 52855, 52870, 52862, 52890, 52902, 52910.40]
  },
  {
    symbol: 'EUR/USD',
    derivTickSymbol: 'frxEURUSD',
    ctraderName: 'EURUSD',
    displayName: 'EUR/USD (FX Major)',
    category: 'FX Major • 2s',
    tickSpeed: '2s',
    constVol: 'Dynamic',
    price: 1.08642,
    digits: 5,
    pipSize: 0.0001,
    minLot: 0.01,
    lotStep: 0.01,
    defaultLot: 0.50,
    pointValuePerLot: 10.0,
    spread: 0.3,
    rsi: 54.2,
    macd: 0.00018,
    spikeCounter: null,
    spikeAvg: null,
    spikeProb: null,
    regime: 'LONDON SESSION',
    accuracy: 75,
    bias: 'BUY',
    history: [1.0861, 1.0862, 1.08615, 1.0863, 1.08628, 1.08635, 1.08642]
  },
  {
    symbol: 'XAU/USD',
    derivTickSymbol: 'frxXAUUSD',
    ctraderName: 'XAUUSD',
    displayName: 'XAU/USD (Spot Gold)',
    category: 'Metals • 2s',
    tickSpeed: '2s',
    constVol: 'Dynamic',
    price: 2742.85,
    digits: 2,
    pipSize: 0.1,
    minLot: 0.01,
    lotStep: 0.01,
    defaultLot: 0.10,
    pointValuePerLot: 10.0,
    spread: 1.5,
    rsi: 67.1,
    macd: 2.45,
    spikeCounter: null,
    spikeAvg: null,
    spikeProb: null,
    regime: 'BULLISH IMPULSE',
    accuracy: 83,
    bias: 'BUY',
    history: [2738.2, 2739.5, 2740.1, 2739.8, 2741.4, 2742.1, 2742.85]
  }
];

type BotResearchEvidence = {
  minimumSampleTrades: number;
  outOfSampleTrades: number;
  outOfSampleWins: number;
  randomBaselineWinRatePct: number;
  randomBaselineMeasured: boolean;
  averageWinR: number;
  averageLossR: number;
  costPerTradeR: number;
  requiredEdgeR: number;
  costsIncluded: boolean;
  backtestPassed: boolean;
  walkForwardPassed: boolean;
  forwardTestPassed: boolean;
  drawdownWithinRange: boolean;
};

const createEmptyResearchEvidence = (): BotResearchEvidence => ({
  minimumSampleTrades: 0,
  outOfSampleTrades: 0,
  outOfSampleWins: 0,
  randomBaselineWinRatePct: 0,
  randomBaselineMeasured: false,
  averageWinR: 0,
  averageLossR: 0,
  costPerTradeR: 0,
  requiredEdgeR: 0,
  costsIncluded: false,
  backtestPassed: false,
  walkForwardPassed: false,
  forwardTestPassed: false,
  drawdownWithinRange: false
});

const evaluateBotResearch = (input: Partial<BotResearchEvidence> = {}) => {
  const evidence = { ...createEmptyResearchEvidence(), ...input };
  const minimumSampleTrades = Number(evidence.minimumSampleTrades) || 0;
  const trades = Number(evidence.outOfSampleTrades) || 0;
  const wins = Number(evidence.outOfSampleWins) || 0;
  const baselineWinRate = (Number(evidence.randomBaselineWinRatePct) || 0) / 100;
  const averageWinR = Number(evidence.averageWinR) || 0;
  const averageLossR = Number(evidence.averageLossR) || 0;
  const costPerTradeR = Number(evidence.costPerTradeR) || 0;
  const requiredEdgeR = Number(evidence.requiredEdgeR) || 0;
  const winRate = trades > 0 ? wins / trades : 0;
  const shrinkageWeight = Math.max(0, minimumSampleTrades);
  const shrunkWinRate = trades + shrinkageWeight > 0
    ? (wins + baselineWinRate * shrinkageWeight) / (trades + shrinkageWeight)
    : 0;
  const expectancyR = shrunkWinRate * averageWinR - (1 - shrunkWinRate) * averageLossR - costPerTradeR;
  const baselineExpectancyR = baselineWinRate * averageWinR - (1 - baselineWinRate) * averageLossR - costPerTradeR;
  const breakEvenWinRate = averageWinR + averageLossR > 0
    ? (averageLossR + costPerTradeR + requiredEdgeR) / (averageWinR + averageLossR)
    : null;
  const checks = [
    Number.isInteger(minimumSampleTrades) && minimumSampleTrades > 0 && Number.isInteger(trades) && Number.isInteger(wins) && trades >= minimumSampleTrades && wins >= 0 && wins <= trades,
    evidence.randomBaselineMeasured === true && baselineWinRate >= 0 && baselineWinRate <= 1,
    averageWinR > 0 && averageLossR > 0 && costPerTradeR >= 0,
    requiredEdgeR > 0 && expectancyR > 0 && expectancyR - baselineExpectancyR >= requiredEdgeR,
    evidence.costsIncluded === true,
    evidence.backtestPassed === true,
    evidence.walkForwardPassed === true,
    evidence.forwardTestPassed === true,
    evidence.drawdownWithinRange === true
  ];
  return {
    approved: checks.every(Boolean),
    winRate,
    shrunkWinRate,
    expectancyR,
    baselineExpectancyR,
    breakEvenWinRate,
    missingSample: !(Number.isInteger(minimumSampleTrades) && minimumSampleTrades > 0 && Number.isInteger(trades) && Number.isInteger(wins) && trades >= minimumSampleTrades && wins >= 0 && wins <= trades)
  };
};

const INITIAL_DERIV_BOTS = [
  {
    id: 'DRV-V75-01',
    name: 'V75 Liquidity & Structure Research Bot',
    strategy: 'Hypothesis: Constant-Volatility Structure Break + Jump 25 Delta',
    active: false,
    symbols: ['R_75', 'JD25', 'XAU/USD'],
    lotSize: 0.005,
    stakeUsd: 25,
    multiplier: 100,
    maxDrawdown: 0,
    minAccuracy: 86,
    slPips: 180,
    tpPips: 450,
    tradesCount: 0,
    winRate: 0,
    winsCount: 0,
    realizedPnl: 0,
    researchEvidence: createEmptyResearchEvidence(),
    cooldownMs: 7000,
    lastExecutedAt: 0
  },
  {
    id: 'DRV-SPK-02',
    name: 'Boom/Crash Spike Research Bot',
    strategy: 'Hypothesis: Spike-Interval Context + Exhaustion',
    active: false,
    symbols: ['BOOM1000', 'CRASH500'],
    lotSize: 0.20,
    stakeUsd: 15,
    multiplier: 200,
    maxDrawdown: 0,
    minAccuracy: 87,
    slPips: 45,
    tpPips: 120,
    tradesCount: 0,
    winRate: 0,
    winsCount: 0,
    realizedPnl: 0,
    researchEvidence: createEmptyResearchEvidence(),
    cooldownMs: 7000,
    lastExecutedAt: 0
  },
  {
    id: 'DRV-1HZ-03',
    name: '1s Scalper & Digit Frequency Research Bot',
    strategy: 'Hypothesis: 1HZ100V Micro-Scalp + Digit-Frequency Filter',
    active: false,
    symbols: ['1HZ100V', 'stpRNG', 'EUR/USD'],
    lotSize: 0.05,
    stakeUsd: 10,
    multiplier: 250,
    maxDrawdown: 0,
    minAccuracy: 85,
    slPips: 35,
    tpPips: 75,
    tradesCount: 0,
    winRate: 0,
    winsCount: 0,
    realizedPnl: 0,
    researchEvidence: createEmptyResearchEvidence(),
    cooldownMs: 7000,
    lastExecutedAt: 0
  },
  {
    id: 'DRV-GLD-04',
    name: 'XAU/USD & Step Index Research Bot',
    strategy: 'Hypothesis: London/NY Liquidity Sweep + Step Momentum',
    active: false,
    symbols: ['XAU/USD', 'stpRNG'],
    lotSize: 0.10,
    stakeUsd: 20,
    multiplier: 150,
    maxDrawdown: 0,
    minAccuracy: 84,
    slPips: 85,
    tpPips: 210,
    tradesCount: 0,
    winRate: 0,
    winsCount: 0,
    realizedPnl: 0,
    researchEvidence: createEmptyResearchEvidence(),
    cooldownMs: 8000,
    lastExecutedAt: 0
  }
];

const BOT_CONFIG_STORAGE_KEY = 'quantumbridge.botConfigs.v1';
const BOT_CONFIG_FIELDS = [
  'name', 'strategy', 'symbols', 'lotSize', 'stakeUsd', 'multiplier',
  'minAccuracy', 'slPips', 'tpPips', 'cooldownMs', 'researchEvidence'
];

const loadBotConfigurations = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(BOT_CONFIG_STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return INITIAL_DERIV_BOTS;
    const savedById = new Map(saved.filter((bot) => bot && bot.id).map((bot) => [bot.id, bot]));
    const defaults = INITIAL_DERIV_BOTS.map((base) => {
      const prior = savedById.get(base.id) || {};
      const config = Object.fromEntries(BOT_CONFIG_FIELDS
        .filter((field) => prior[field] !== undefined)
        .map((field) => [field, prior[field]]));
      savedById.delete(base.id);
      return {
        ...base,
        ...config,
        active: false,
        tradesCount: 0,
        winsCount: 0,
        winRate: 0,
        realizedPnl: 0,
        lastExecutedAt: 0,
        researchEvidence: { ...createEmptyResearchEvidence(), ...(prior.researchEvidence || {}) }
      };
    });
    const custom = [...savedById.values()].map((prior) => {
      const config = Object.fromEntries(BOT_CONFIG_FIELDS
        .filter((field) => prior[field] !== undefined)
        .map((field) => [field, prior[field]]));
      return {
        ...prior,
        ...config,
        active: false,
        tradesCount: 0,
        winsCount: 0,
        winRate: 0,
        realizedPnl: 0,
        lastExecutedAt: 0,
        researchEvidence: { ...createEmptyResearchEvidence(), ...(prior.researchEvidence || {}) }
      };
    });
    return [...defaults, ...custom];
  } catch {
    return INITIAL_DERIV_BOTS;
  }
};

const saveBotConfigurations = (bots) => {
  try {
    const saved = bots.map((bot) => ({
      id: bot.id,
      ...Object.fromEntries(BOT_CONFIG_FIELDS.map((field) => [field, bot[field]]))
    }));
    localStorage.setItem(BOT_CONFIG_STORAGE_KEY, JSON.stringify(saved));
  } catch {}
};

const INITIAL_DERIV_POSITIONS = [];

const INITIAL_DIGIT_DISTRIBUTION = [
  { digit: 0, pct: 10.2 },
  { digit: 1, pct: 9.8 },
  { digit: 2, pct: 10.1 },
  { digit: 3, pct: 9.7 },
  { digit: 4, pct: 10.4 },
  { digit: 5, pct: 10.0 },
  { digit: 6, pct: 9.9 },
  { digit: 7, pct: 10.3 },
  { digit: 8, pct: 10.2 },
  { digit: 9, pct: 9.4 }
];

const DERIV_CTRADER_PLUGIN_CS = `// ============================================================================
// QuantumBridge Local Execution Plugin (Desktop Bridge 5.0+)
// File: QuantumBridgeExecutor.cs
// Purpose: Connects to QuantumBridge Web UI via WebSocket (ws://127.0.0.1:8765)
//          and HTTP IPC, maps synthetic symbols ("R_75" -> "Volatility 75 Index"),
//          normalizes fractional lot sizes (0.001 on V75, 0.20 on Boom/Crash),
//          and executes real-account orders with AccessRights.FullAccess.
// ============================================================================

using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using cAlgo.API;
using cAlgo.API.Internals;

namespace cAlgo.Robots
{
    public class DerivSignalPayload
    {
        public string signalId { get; set; }
        public string timestamp { get; set; }
        public string brokerTarget { get; set; }
        public string executionMode { get; set; }
        public string botId { get; set; }
        public string symbol { get; set; }
        public string ctraderSymbol { get; set; }
        public string action { get; set; }
        public double normalizedLots { get; set; }
        public double accuracyScore { get; set; }
        public double stopLossPips { get; set; }
        public double takeProfitPips { get; set; }
        public bool autoCloseBeforeSpike { get; set; }
    }

    [Robot(AccessRights = AccessRights.FullAccess, Name = "QuantumBridgeExecutor", DisplayName = "QuantumBridge Signal Executor", Version = "2.5")]
    public class QuantumBridgeExecutor : Robot
    {
        [Parameter("HTTP Bridge Port", DefaultValue = 8765)]
        public int BridgePort { get; set; }

        [Parameter("Minimum Signal Accuracy (%)", DefaultValue = 85.0)]
        public double MinAccuracy { get; set; }

        private HttpListener _listener;
        private CancellationTokenSource _cts;

        private static readonly Dictionary<string, string> DerivSymbolMap = new()
        {
            { "R_75", "Volatility 75 Index" },
            { "1HZ100V", "Volatility 100 (1s) Index" },
            { "BOOM1000", "Boom 1000 Index" },
            { "CRASH500", "Crash 500 Index" },
            { "stpRNG", "Step Index" },
            { "JD25", "Jump 25 Index" },
            { "EUR/USD", "EURUSD" },
            { "XAU/USD", "XAUUSD" }
        };

        protected override void OnStart()
        {
            _cts = new CancellationTokenSource();
            _listener = new HttpListener();
            _listener.Prefixes.Add($"http://127.0.0.1:{BridgePort}/");
            _listener.Start();

            Print($"[QuantumBridge] FullAccess Executor Live on port {BridgePort} | Account: {Account.Number} ({Account.Currency})");
            Task.Run(() => ListenForSignalsAsync(_cts.Token));
        }

        private async Task ListenForSignalsAsync(CancellationToken token)
        {
            while (!token.IsCancellationRequested && _listener.IsListening)
            {
                try
                {
                    var context = await _listener.GetContextAsync();
                    context.Response.AddHeader("Access-Control-Allow-Origin", "*");
                    context.Response.AddHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
                    context.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type");

                    if (context.Request.HttpMethod == "OPTIONS")
                    {
                        context.Response.StatusCode = 200;
                        context.Response.Close();
                        continue;
                    }

                    if (context.Request.HttpMethod == "GET")
                    {
                        var statusJson = JsonSerializer.Serialize(new
                        {
                            status = "CONNECTED",
                            accountId = $"cTrader-{Account.Number}",
                            isLive = Account.IsLive,
                            currency = Account.Currency,
                            balance = Account.Balance,
                            equity = Account.Equity,
                            freeMargin = Account.FreeMargin
                        });
                        byte[] statusBytes = Encoding.UTF8.GetBytes(statusJson);
                        context.Response.OutputStream.Write(statusBytes, 0, statusBytes.Length);
                        context.Response.Close();
                        continue;
                    }

                    using var reader = new StreamReader(context.Request.InputStream, Encoding.UTF8);
                    string rawJson = await reader.ReadToEndAsync();
                    var payload = JsonSerializer.Deserialize<DerivSignalPayload>(rawJson);

                    if (payload != null && payload.accuracyScore >= MinAccuracy)
                    {
                        string targetName = !string.IsNullOrEmpty(payload.ctraderSymbol)
                            ? payload.ctraderSymbol
                            : (DerivSymbolMap.TryGetValue(payload.symbol, out var mapped) ? mapped : payload.symbol);

                        BeginInvokeOnMainThread(() => ExecuteDerivOrder(targetName, payload));
                    }

                    byte[] ack = Encoding.UTF8.GetBytes("{\\"status\\":\\"ORDER_ROUTED_TO_BRIDGE\\"}");
                    context.Response.OutputStream.Write(ack, 0, ack.Length);
                    context.Response.Close();
                }
                catch (Exception ex)
                {
                    if (!token.IsCancellationRequested)
                        Print($"[QuantumBridge Error] {ex.Message}");
                }
            }
        }

        private void ExecuteDerivOrder(string symbolName, DerivSignalPayload signal)
        {
            Symbol sym = Symbols.GetSymbol(symbolName);
            if (sym == null)
            {
                Print($"[QuantumBridge] Symbol not found on server: {symbolName}");
                return;
            }

            TradeType side = signal.action.ToUpper() == "BUY" ? TradeType.Buy : TradeType.Sell;
            double rawUnits = sym.QuantityToVolumeInUnits(signal.normalizedLots);
            double safeUnits = sym.NormalizeVolumeInUnits(rawUnits, RoundingMode.ToNearest);

            var result = ExecuteMarketOrder(side, sym.Name, safeUnits, $"QB_{signal.botId}", signal.stopLossPips, signal.takeProfitPips);
            if (result.IsSuccessful)
                Print($"[QuantumBridge Filled] #{result.Position.Id} {side} {signal.normalizedLots} lots {sym.Name} @ {result.Position.EntryPrice}");
            else
                Print($"[QuantumBridge Rejected] {result.Error}");
        }

        protected override void OnStop()
        {
            _cts?.Cancel();
            _listener?.Stop();
        }
    }
}`;

const SparklineSVG = ({ data, width = 120, height = 32, isPositive = true }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((val, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={isPositive ? '#10b981' : '#f43f5e'}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

// ============================================================================
// REALISTIC CIRCLE (DONUT) GRAPH OF TOP 4 PERFORMING BOTS
// ============================================================================

const TopBotsCircleChart = ({ bots, theme }) => {
  const [hoveredBotId, setHoveredBotId] = useState(null);

  const segmentPalette = ['#10b981', '#06b6d4', '#f59e0b', '#ec4899'];

  const top4Bots = useMemo(() => {
    const sorted = [...bots].sort((a, b) => {
      const scoreA = Math.max(0, a.realizedPnl) + a.winRate * 3;
      const scoreB = Math.max(0, b.realizedPnl) + b.winRate * 3;
      return scoreB - scoreA;
    });
    return sorted.slice(0, 4);
  }, [bots]);

  const totalMetric = useMemo(() => {
    const sum = top4Bots.reduce((acc, b) => acc + Math.max(10, b.realizedPnl), 0);
    return sum || 1;
  }, [top4Bots]);

  const totalTop4Pnl = useMemo(
    () => top4Bots.reduce((acc, b) => acc + b.realizedPnl, 0),
    [top4Bots]
  );

  const size = 210;
  const strokeWidth = 24;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const hoveredBot = top4Bots.find((b) => b.id === hoveredBotId) || null;

  if (top4Bots.every((bot) => Number(bot.tradesCount) === 0)) {
    return (
      <div className={`${theme.cardBg} border ${theme.border} rounded-2xl p-5 shadow-xl`}>
        <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${theme.textPrimary}`}>Bot Results</h3>
        <p className={`text-xs mt-2 ${theme.textSecondary}`}>No completed app-modeled trades yet. Unverified starter performance has been cleared. Use held-out data in each bot's Research Evidence Gate before enabling live automation.</p>
      </div>
    );
  }

  return (
    <div className={`${theme.cardBg} border ${theme.border} rounded-2xl p-5 shadow-xl flex flex-col justify-between`}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${theme.textPrimary}`}>
              Bot Results (App-Modeled)
            </h3>
            <p className={`text-[11px] ${theme.textSecondary}`}>
              These simulated results are separate from held-out validation evidence.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          {bots.filter((b) => b.active).length} Active Instances
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        {/* SVG Realistic Radial Donut Chart */}
        <div className="sm:col-span-5 flex items-center justify-center relative">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
            <defs>
              <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Subtle Base Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="rgba(148, 163, 184, 0.14)"
              strokeWidth={strokeWidth}
            />

            {/* Individual Bot Arcs */}
            {top4Bots.map((bot, idx) => {
              const weight = Math.max(10, bot.realizedPnl) / totalMetric;
              const gapPercent = top4Bots.length > 1 ? 0.015 : 0;
              const visiblePercent = Math.max(0.02, weight - gapPercent);
              const strokeDasharray = `${visiblePercent * circumference} ${circumference}`;
              const rotationDeg = cumulativePercent * 360 - 90;
              cumulativePercent += weight;

              const isHovered = hoveredBotId === bot.id;
              const color = segmentPalette[idx % segmentPalette.length];

              return (
                <circle
                  key={bot.id}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  transform={`rotate(${rotationDeg} ${center} ${center})`}
                  filter={isHovered ? 'url(#donutGlow)' : undefined}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredBotId(bot.id)}
                  onMouseLeave={() => setHoveredBotId(null)}
                />
              );
            })}
          </svg>

          {/* Center Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              {hoveredBot ? hoveredBot.id : 'TOP 4 NET P&L'}
            </span>
            <span className={`text-base sm:text-lg font-mono font-extrabold ${theme.textPrimary}`}>
              {hoveredBot
                ? `${hoveredBot.realizedPnl >= 0 ? '+' : ''}$${hoveredBot.realizedPnl.toFixed(0)}`
                : `${totalTop4Pnl >= 0 ? '+' : ''}$${totalTop4Pnl.toFixed(0)}`}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              {hoveredBot ? `${hoveredBot.winRate}% Win` : `${bots.filter((b) => b.active).length} Bots Live`}
            </span>
          </div>
        </div>

        {/* Ranked Legend */}
        <div className="sm:col-span-7 space-y-2.5">
          {top4Bots.map((bot, idx) => {
            const sharePct = ((Math.max(10, bot.realizedPnl) / totalMetric) * 100).toFixed(1);
            const color = segmentPalette[idx % segmentPalette.length];
            const isHovered = hoveredBotId === bot.id;

            return (
              <div
                key={bot.id}
                onMouseEnter={() => setHoveredBotId(bot.id)}
                onMouseLeave={() => setHoveredBotId(null)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isHovered
                    ? 'border-emerald-500/60 bg-emerald-500/10'
                    : `${theme.subCardBg} ${theme.border}`
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow"
                    style={{ backgroundColor: color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                      <span className={`text-xs font-bold truncate ${theme.textPrimary}`}>
                        {bot.name}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
                      <span>{bot.id}</span>
                      <span>•</span>
                      <span>{bot.winRate}% WR</span>
                      <span>•</span>
                      <span className={bot.active ? 'text-emerald-400' : 'text-slate-500'}>
                        {bot.active ? 'ACTIVE' : 'PAUSED'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono shrink-0">
                  <div className="text-xs font-bold text-emerald-400">
                    {bot.realizedPnl >= 0 ? '+' : ''}${bot.realizedPnl.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">{sharePct}% share</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activePage, setActivePage] = useState('HOME'); // 'HOME' | 'BOTS' | 'MARKETS' | 'BRIDGE' | 'RISK'
  const [activeThemeKey, setActiveThemeKey] = useState('quantum_emerald');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [executionMode, setExecutionMode] = useState('DERIV_WS_OPTIONS');
  const [markets, setMarkets] = useState(INITIAL_DERIV_MARKETS);
  const [digitsMatrix, setDigitsMatrix] = useState(INITIAL_DIGIT_DISTRIBUTION);
  const [bots, setBots] = useState(loadBotConfigurations);
  const [mcpProposals, setMcpProposals] = useState<any[]>([]);
  const [mcpBridgeOnline, setMcpBridgeOnline] = useState(false);
  const [positions, setPositions] = useState(INITIAL_DERIV_POSITIONS);
  const [selectedSymbol, setSelectedSymbol] = useState('R_75');

  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const [connectionMethod, setConnectionMethod] = useState('SIMULATOR');
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [activeAccountId, setActiveAccountId] = useState('');
  const [derivAppId, setDerivAppId] = useState(() => localStorage.getItem('quantumbridge.derivClientId') || '');
  
  // Advanced App ID & OAuth Management State
  const [showDerivAppSettingsModal, setShowDerivAppSettingsModal] = useState(false);
  const [customAppName, setCustomAppName] = useState('QuantumBridge Pro');
  const [customRedirectUriInput, setCustomRedirectUriInput] = useState('');
  const [savedAppConfigs, setSavedAppConfigs] = useState([]);

  const [oauthScopes, setOauthScopes] = useState(() => {
    const defaults = { trade: true, account_manage: false, application_read: false, payment: false };
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem('quantumbridge.derivScopes') || '{}') };
    } catch {
      return defaults;
    }
  });
  const [oauthAccessToken, setOauthAccessToken] = useState('');
  const [oauthExpiresAt, setOauthExpiresAt] = useState(null);
  const [oauthConnecting, setOauthConnecting] = useState(false);
  const [ctraderEndpoint, setCtraderEndpoint] = useState('http://127.0.0.1:8765');
  const [authError, setAuthError] = useState('');
  const [liveTickStreamActive, setLiveTickStreamActive] = useState(false);
  const [jarvisConnected, setJarvisConnected] = useState(false);
  const [jarvisSnapshot, setJarvisSnapshot] = useState(null);
  const [jarvisDerivStatus, setJarvisDerivStatus] = useState(null);
  const [jarvisError, setJarvisError] = useState('');
  const [jarvisRefreshing, setJarvisRefreshing] = useState(false);
  const [jarvisStake, setJarvisStake] = useState('');
  const [jarvisDurationTicks, setJarvisDurationTicks] = useState('');
  const [jarvisMultiplier, setJarvisMultiplier] = useState('');
  const [jarvisProposal, setJarvisProposal] = useState(null);
  const [jarvisTradeStatus, setJarvisTradeStatus] = useState('');

  const [liveExecutionArmed, setLiveExecutionArmed] = useState(false);
  const [dailyMaxLossUsd, setDailyMaxLossUsd] = useState(250);
  const [maxSessionDrawdownUsd, setMaxSessionDrawdownUsd] = useState(0);
  const [maxConcurrentPositions, setMaxConcurrentPositions] = useState(4);
  const [perTradeMaxRiskPct, setPerTradeMaxRiskPct] = useState(1.0);
  const [sessionRealizedPnl, setSessionRealizedPnl] = useState(0);
  const [sessionPeakRealizedPnl, setSessionPeakRealizedPnl] = useState(0);

  const [bridgeConnected, setBridgeConnected] = useState(true);
  const [derivServer, setDerivServer] = useState('Quantum-Server (Live SVG)');
  const [autoCloseBeforeSpike, setAutoCloseBeforeSpike] = useState(true);
  const [latencyMs, setLatencyMs] = useState(9);
  const [accountBalance, setAccountBalance] = useState(25000.00);
  const [accountCurrency, setAccountCurrency] = useState('USD');
  const [hideBalance, setHideBalance] = useState(false);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  // Keep autonomous execution paused until an operator enables it deliberately.
  const [autoExecuteEnabled, setAutoExecuteEnabled] = useState(false);

  const [logs, setLogs] = useState<any[]>([
    {
      id: 'LOG-DRV-INIT',
      time: '14:32:19.084',
      type: 'EXECUTION',
      title: 'QuantumBridge Engine Ready • Connect Real or Demo Account',
      summary: 'Awaiting Deriv OAuth 2.0 Authorization Code + PKCE sign-in.',
      payload: {
        status: 'READY_FOR_REAL_ACCOUNT',
        supportedAccounts: ['Live Real (CR...)', 'Virtual Demo (VRTC...)', 'Local Execution Bridge (AccessRights.FullAccess)'],
        wsEndpoint: 'wss://ws.derivws.com/websockets/v3',
        localPluginRelay: 'http://127.0.0.1:8765'
      }
    }
  ]);
  const [selectedLogId, setSelectedLogId] = useState('LOG-DRV-INIT');
  const [showPluginModal, setShowPluginModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectTab, setConnectTab] = useState('oauth');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedRedirectUri, setCopiedRedirectUri] = useState(false);
  const [oauthLastCallbackLog, setOauthLastCallbackLog] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  // Bot Space Expansion & New Bot Creator State
  const [botViewLayout, setBotViewLayout] = useState('expanded'); // 'expanded' | 'compact'
  const [expandedBotConfigId, setExpandedBotConfigId] = useState('DRV-V75-01');
  const [showNewBotModal, setShowNewBotModal] = useState(false);
  const [newBotForm, setNewBotForm] = useState({
      name: 'Gold & V100 Research Bot',
      strategy: 'Hypothesis: Multi-Timeframe Liquidity Sweep + RSI Divergence',
    symbols: ['XAU/USD', '1HZ100V'],
    lotSize: 0.02,
    stakeUsd: 20,
    multiplier: 100,
    minAccuracy: 86,
    slPips: 60,
    tpPips: 150
  });

  useEffect(() => {
    localStorage.setItem('quantumbridge.derivScopes', JSON.stringify(oauthScopes));
  }, [oauthScopes]);

  useEffect(() => {
    saveBotConfigurations(bots);
  }, [bots]);

  const derivWsRef = useRef(null);
  const ctraderPollRef = useRef(null);
  const jarvisProposalReqIdRef = useRef(null);
  const jarvisBuyReqIdRef = useRef(null);
  const jarvisRequestedSignalRef = useRef(null);
  const jarvisProposalRef = useRef(null);
  const botsRef = useRef(bots);
  const marketsRef = useRef(markets);
  const positionsRef = useRef(positions);
  const bridgeConnectedRef = useRef(bridgeConnected);
  const autoExecuteRef = useRef(autoExecuteEnabled);
  const executionModeRef = useRef(executionMode);
  const autoCloseSpikeRef = useRef(autoCloseBeforeSpike);
  const digitsRef = useRef(digitsMatrix);
  const connectionStatusRef = useRef(connectionStatus);
  const connectionMethodRef = useRef(connectionMethod);
  const liveExecutionArmedRef = useRef(liveExecutionArmed);
  const liveTickStreamActiveRef = useRef(liveTickStreamActive);
  const maxConcurrentRef = useRef(maxConcurrentPositions);
  const dailyMaxLossRef = useRef(dailyMaxLossUsd);
  const maxSessionDrawdownRef = useRef(maxSessionDrawdownUsd);
  const sessionRealizedRef = useRef(sessionRealizedPnl);
  const sessionPeakRealizedRef = useRef(sessionPeakRealizedPnl);
  const perTradeMaxRiskRef = useRef(perTradeMaxRiskPct);
  const accountBalanceRef = useRef(accountBalance);
  const ctraderEndpointRef = useRef(ctraderEndpoint);

  useEffect(() => { botsRef.current = bots; }, [bots]);
  useEffect(() => { marketsRef.current = markets; }, [markets]);
  useEffect(() => { positionsRef.current = positions; }, [positions]);
  useEffect(() => { bridgeConnectedRef.current = bridgeConnected; }, [bridgeConnected]);
  useEffect(() => { autoExecuteRef.current = autoExecuteEnabled; }, [autoExecuteEnabled]);
  useEffect(() => { executionModeRef.current = executionMode; }, [executionMode]);
  useEffect(() => { autoCloseSpikeRef.current = autoCloseBeforeSpike; }, [autoCloseBeforeSpike]);
  useEffect(() => { digitsRef.current = digitsMatrix; }, [digitsMatrix]);
  useEffect(() => { connectionStatusRef.current = connectionStatus; }, [connectionStatus]);
  useEffect(() => { connectionMethodRef.current = connectionMethod; }, [connectionMethod]);
  useEffect(() => { liveExecutionArmedRef.current = liveExecutionArmed; }, [liveExecutionArmed]);
  useEffect(() => { liveTickStreamActiveRef.current = liveTickStreamActive; }, [liveTickStreamActive]);
  useEffect(() => { maxConcurrentRef.current = maxConcurrentPositions; }, [maxConcurrentPositions]);
  useEffect(() => { dailyMaxLossRef.current = dailyMaxLossUsd; }, [dailyMaxLossUsd]);
  useEffect(() => { maxSessionDrawdownRef.current = maxSessionDrawdownUsd; }, [maxSessionDrawdownUsd]);
  useEffect(() => { sessionRealizedRef.current = sessionRealizedPnl; }, [sessionRealizedPnl]);
  useEffect(() => { sessionPeakRealizedRef.current = sessionPeakRealizedPnl; }, [sessionPeakRealizedPnl]);
  useEffect(() => { perTradeMaxRiskRef.current = perTradeMaxRiskPct; }, [perTradeMaxRiskPct]);
  useEffect(() => { accountBalanceRef.current = accountBalance; }, [accountBalance]);
  useEffect(() => {
    setSessionPeakRealizedPnl((peak) => Math.max(peak, sessionRealizedPnl));
  }, [sessionRealizedPnl]);
  useEffect(() => {
    const dailyLimitReached = sessionRealizedPnl <= -Math.abs(dailyMaxLossUsd);
    const drawdownLimitReached = maxSessionDrawdownUsd > 0 && sessionPeakRealizedPnl - sessionRealizedPnl >= maxSessionDrawdownUsd;
    if (dailyLimitReached || drawdownLimitReached) {
      setAutoExecuteEnabled(false);
      setLiveExecutionArmed(false);
      setBots((prev) => prev.some((bot) => bot.active) ? prev.map((bot) => ({ ...bot, active: false })) : prev);
    }
  }, [sessionRealizedPnl, sessionPeakRealizedPnl, dailyMaxLossUsd, maxSessionDrawdownUsd]);
  useEffect(() => { ctraderEndpointRef.current = ctraderEndpoint; }, [ctraderEndpoint]);
  useEffect(() => { jarvisProposalRef.current = jarvisProposal; }, [jarvisProposal]);

  const activeAccount = useMemo(
    () => connectedAccounts.find((a) => a.accountId === activeAccountId) || null,
    [connectedAccounts, activeAccountId]
  );

  const triggerToast = (title, subtitle, tone = 'emerald') => {
    setToastNotification({ title, subtitle, tone });
    setTimeout(() => {
      setToastNotification((prev) => (prev?.title === title ? null : prev));
    }, 4000);
  };

  useEffect(() => {
    let stopped = false;
    const publishAndPollMcp = async () => {
      try {
        const currentBots = botsRef.current;
        const currentMarkets = marketsRef.current;
        const stateResponse = await fetch('/api/mcp/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            marketSource: liveTickStreamActiveRef.current ? 'DERIV_WS' : 'SIMULATOR',
            bots: currentBots.map((bot) => {
              const research = evaluateBotResearch(bot.researchEvidence);
              return {
                id: bot.id,
                name: bot.name,
                strategy: bot.strategy,
                active: bot.active,
                symbols: bot.symbols,
                minSignalScore: bot.minAccuracy,
                research: {
                  approved: research.approved,
                  sampleTrades: Number(bot.researchEvidence?.outOfSampleTrades || 0),
                  minimumSampleTrades: Number(bot.researchEvidence?.minimumSampleTrades || 0),
                  shrunkWinRatePct: research.shrunkWinRate * 100,
                  expectancyR: research.expectancyR,
                  baselineExpectancyR: research.baselineExpectancyR,
                  breakEvenWinRatePct: research.breakEvenWinRate === null ? null : research.breakEvenWinRate * 100,
                },
              };
            }),
            markets: currentMarkets.map((market) => ({
              symbol: market.symbol,
              name: market.displayName || market.ctraderName || market.symbol,
              price: market.price,
              signalScore: market.accuracy,
              bias: market.bias,
              regime: market.regime,
              spread: market.spread,
            })),
            risk: {
              connectionMode: connectionStatusRef.current === 'LIVE_CONNECTED'
                ? 'LIVE'
                : String(connectionStatusRef.current).includes('DEMO') ? 'DEMO' : 'SIMULATOR',
              autoExecutionEnabled: autoExecuteRef.current,
              liveExecutionArmed: liveExecutionArmedRef.current,
              maxRiskPerTradePct: perTradeMaxRiskRef.current,
              dailyMaxLoss: dailyMaxLossRef.current,
              maxRealizedDrawdown: maxSessionDrawdownRef.current,
              currentRealizedDrawdown: Math.max(0, sessionPeakRealizedRef.current - sessionRealizedRef.current),
              openPositionCount: positionsRef.current.length,
            },
          }),
        });
        if (!stateResponse.ok) throw new Error('MCP snapshot bridge is not available.');
        const response = await fetch('/api/mcp/proposals', { cache: 'no-store' });
        if (!response.ok) throw new Error('MCP proposal inbox is not available.');
        const payload = await response.json();
        if (!stopped) {
          setMcpProposals(Array.isArray(payload.proposals) ? payload.proposals : []);
          setMcpBridgeOnline(true);
        }
      } catch {
        if (!stopped) setMcpBridgeOnline(false);
      }
    };
    void publishAndPollMcp();
    const timer = window.setInterval(publishAndPollMcp, 2500);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, []);

  const handleMcpProposalDecision = async (proposal, decision) => {
    try {
      const response = await fetch(`/api/mcp/proposals/${encodeURIComponent(proposal.id)}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not update the paper proposal.');
      setMcpProposals((current) => current.filter((item) => item.id !== proposal.id));
      if (decision === 'PAPER_LOGGED') {
        const logEntry = {
          id: `MCP-PAPER-${proposal.id}`,
          time: new Date().toTimeString().split(' ')[0],
          type: 'RESEARCH',
          title: `MCP PAPER SIGNAL • ${proposal.action} ${proposal.symbol}`,
          summary: `${proposal.botName} • ${proposal.rationale}`,
          payload: { botId: proposal.botId, symbol: proposal.symbol, action: proposal.action, status: 'PAPER_ONLY' },
        };
        setLogs((current) => [logEntry, ...current.slice(0, 29)]);
        setSelectedLogId(logEntry.id);
        triggerToast('Paper Signal Recorded', `${proposal.botName} • ${proposal.action} ${proposal.symbol}`, 'cyan');
      } else {
        triggerToast('Paper Signal Dismissed', `${proposal.botName} • ${proposal.symbol}`, 'amber');
      }
    } catch (error) {
      triggerToast('MCP Review Failed', error.message || 'Could not update proposal.', 'crimson');
    }
  };

  // ==========================================================================
  // Exchange the authorization code returned by Deriv after validating state.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const returnedState = params.get('state');
    const oauthError = params.get('error_description') || params.get('error');
    if (!code && !oauthError) return;
    setShowConnectModal(true);

    const savedState = sessionStorage.getItem('qb.oauth.state');
    const codeVerifier = sessionStorage.getItem('qb.oauth.verifier');
    const clientId = sessionStorage.getItem('qb.oauth.client_id') || localStorage.getItem('quantumbridge.derivClientId') || '';
    const redirectUri = sessionStorage.getItem('qb.oauth.redirect_uri') || '';
    window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.hash}`);

    const clearPendingLogin = () => {
      sessionStorage.removeItem('qb.oauth.state');
      sessionStorage.removeItem('qb.oauth.verifier');
      sessionStorage.removeItem('qb.oauth.client_id');
      sessionStorage.removeItem('qb.oauth.redirect_uri');
    };
    const failLogin = (message) => {
      clearPendingLogin();
      setOauthConnecting(false);
      setAuthError(message);
    };

    if (oauthError) return failLogin(`Deriv sign-in did not complete: ${oauthError}`);
    if (!savedState || !returnedState || returnedState !== savedState) {
      return failLogin('The sign-in state did not match. Start OAuth login again.');
    }
    if (!codeVerifier || !clientId || !redirectUri) {
      return failLogin('The secure sign-in session is incomplete. Start OAuth login again.');
    }

    setOauthConnecting(true);
    setAuthError('');
    (async () => {
      try {
        const exchange = await fetch('/api/oauth/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_id: clientId, redirect_uri: redirectUri, code, code_verifier: codeVerifier })
        });
        const tokenResult = await exchange.json();
        if (!exchange.ok) throw new Error(tokenResult.error || 'Deriv could not exchange the authorization code.');
        clearPendingLogin();
        setOauthAccessToken(tokenResult.access_token);
        setOauthExpiresAt(Date.now() + Number(tokenResult.expires_in) * 1000);

        const accountResponse = await fetch('/api/deriv/accounts', {
          headers: { Authorization: `Bearer ${tokenResult.access_token}` }
        });
        const accountResult = await accountResponse.json();
        if (!accountResponse.ok) throw new Error(accountResult.error || 'Sign-in succeeded, but accounts could not be loaded. Check the trade scope.');
        const rawAccounts = Array.isArray(accountResult.data)
          ? accountResult.data
          : Array.isArray(accountResult.data?.accounts) ? accountResult.data.accounts : [];
        const accounts = rawAccounts.map((account) => {
          const kind = String(account.account_type || account.type || '').toLowerCase();
          const isLive = kind === 'real' || kind === 'live';
          return {
            accountId: String(account.account_id || account.loginid || ''),
            currency: account.currency || 'USD',
            isLive,
            broker: isLive ? 'Deriv Options Real' : 'Deriv Options Demo',
            balance: Number(account.balance || 0),
            status: account.status || 'active'
          };
        }).filter((account) => account.accountId);
        if (!accounts.length) throw new Error('Sign-in succeeded, but Deriv returned no Options accounts.');

        setConnectedAccounts(accounts);
        setOauthLastCallbackLog({
          receivedAt: new Date().toISOString(),
          accountsCount: accounts.length,
          accounts: accounts.map((account) => ({ accountId: account.accountId, currency: account.currency, type: account.isLive ? 'REAL' : 'DEMO' }))
        });
        const safeDefault = accounts.find((account) => !account.isLive) || accounts[0];
        setActiveAccountId(safeDefault.accountId);
        setAccountBalance(safeDefault.balance);
        setAccountCurrency(safeDefault.currency);
        setLiveExecutionArmed(false);
        setAutoExecuteEnabled(false);
        setConnectionMethod('DERIV_OAUTH');
        await connectOAuthAccount(safeDefault, tokenResult.access_token);
        setShowConnectModal(false);
        triggerToast('Deriv OAuth connected', `${safeDefault.broker} • ${safeDefault.accountId}`, safeDefault.isLive ? 'crimson' : 'emerald');
      } catch (error) {
        clearPendingLogin();
        setAuthError(error.message || 'Deriv OAuth sign-in failed.');
      } finally {
        setOauthConnecting(false);
      }
    })();
  }, []);
  useEffect(() => {
    return () => {
      if (derivWsRef.current) derivWsRef.current.close();
      if (ctraderPollRef.current) clearInterval(ctraderPollRef.current);
    };
  }, []);

  const connectLocalCTraderBridge = async () => {
    setAuthError('');
    setConnectionStatus('CONNECTING');
    const cleanUrl = ctraderEndpoint.replace(/\/$/, '');
    const t0 = performance.now();

    try {
      const response = await fetch(cleanUrl, { method: 'GET' });
      const data = await response.json();
      const rtt = Math.max(2, Math.round(performance.now() - t0));

      const isLive = Boolean(data.isLive);
      const acctId = data.accountId || 'Bridge-1049281';
      const bal = Number(data.balance || 10000);
      const cur = data.currency || 'USD';

      const ctraderAcct = {
        accountId: acctId,
        token: 'CTRADER_LOCAL_IPC',
        currency: cur,
        isLive,
        broker: isLive ? 'Plugin Bridge Live' : 'Plugin Bridge Demo',
        balance: bal
      };

      setConnectedAccounts([ctraderAcct]);
      setActiveAccountId(acctId);
      setAccountBalance(bal);
      setAccountCurrency(cur);
      setLatencyMs(rtt);
      setConnectionMethod('CTRADER_LOCAL');
      setConnectionStatus(isLive ? 'LIVE_CONNECTED' : 'DEMO_CONNECTED');
      setDerivServer(isLive ? `Bridge-Live (${acctId})` : `Bridge-Demo (${acctId})`);
      setLiveExecutionArmed(!isLive);
      setShowConnectModal(false);

      if (ctraderPollRef.current) clearInterval(ctraderPollRef.current);
      ctraderPollRef.current = setInterval(async () => {
        try {
          const p0 = performance.now();
          const res = await fetch(cleanUrl, { method: 'GET' });
          const syncData = await res.json();
          setLatencyMs(Math.max(1, Math.round(performance.now() - p0)));
          if (syncData.balance !== undefined) {
            setAccountBalance(Number(syncData.balance));
          }
        } catch (e) {}
      }, 4000);

      triggerToast(
        `Plugin Bridge Connected (${acctId})`,
        `Latency: ${rtt}ms • Balance: ${bal.toFixed(2)} ${cur}`,
        isLive ? 'crimson' : 'emerald'
      );
    } catch (err) {
      setConnectionStatus('DISCONNECTED');
      setAuthError(
        `Could not connect to Local Plugin at ${cleanUrl}. Ensure QuantumBridgeExecutor.cs is running with AccessRights.FullAccess.`
      );
    }
  };

  const refreshJarvisSignals = async () => {
    setJarvisRefreshing(true);
    setJarvisError('');
    try {
      const [statusResponse, signalsResponse] = await Promise.all([
        fetch('/api/jarvis/status', { cache: 'no-store' }),
        fetch('/api/jarvis/signals', { cache: 'no-store' })
      ]);
      const status = await statusResponse.json();
      const snapshot = await signalsResponse.json();
      if (!statusResponse.ok) throw new Error(status.error || 'JARVIS status is unavailable.');
      if (!signalsResponse.ok) throw new Error(snapshot.error || 'JARVIS signal service is unavailable.');
      if (!Array.isArray(snapshot.signals)) throw new Error('JARVIS returned an invalid signal snapshot.');
      setJarvisDerivStatus(status.deriv || { connected: false, accounts: [] });
      setJarvisSnapshot(snapshot);
      setJarvisConnected(true);
    } catch (error) {
      setJarvisConnected(false);
      setJarvisError(error.message || 'Could not reach JARVIS.');
    } finally {
      setJarvisRefreshing(false);
    }
  };

  const openJarvisDerivLogin = () => {
    window.open('http://localhost:5000/deriv/connect', '_blank', 'noopener,noreferrer');
  };

  const requestJarvisTradeProposal = (signal) => {
    const ws = derivWsRef.current;
    if (!jarvisConnected || !jarvisSnapshot) return setJarvisError('Connect to the JARVIS Workshop signal feed first.');
    if (jarvisSnapshot.real_trading !== false || jarvisSnapshot.mode !== 'PAPER_SIGNALS') {
      return setJarvisError('The JARVIS source is not marked as a paper-signal provider.');
    }
    if (!jarvisSnapshot.market_connected) return setJarvisError('JARVIS has no live market feed yet. Wait for its Deriv market worker.');
    if (signal?.gate !== 'PASS' || !['BUY', 'SELL'].includes(signal?.signal)) {
      return setJarvisError('Only a fresh Jarvis BUY or SELL signal with a PASS gate can be reviewed.');
    }
    const snapshotAge = Date.now() - Date.parse(jarvisSnapshot.generated_at || '');
    if (!Number.isFinite(snapshotAge) || snapshotAge < 0 || snapshotAge > 30_000) {
      return setJarvisError('That JARVIS signal snapshot is stale. Refresh it and review the current signal.');
    }
    if (connectionMethod !== 'DERIV_OAUTH' || !ws || ws.readyState !== WebSocket.OPEN) {
      return setJarvisError('Connect a Deriv account in QuantumBridge before requesting a trade quote.');
    }
    if (connectionStatus === 'LIVE_CONNECTED' && !liveExecutionArmed) {
      return setJarvisError('Live execution is locked. Arm live execution in QuantumBridge before proceeding.');
    }
    const stake = Number(jarvisStake);
    const duration = Number(jarvisDurationTicks);
    const multiplier = Number(jarvisMultiplier);
    if (!Number.isFinite(stake) || stake <= 0 || stake > accountBalance) {
      return setJarvisError('Enter a positive stake that does not exceed the connected account balance.');
    }
    if (!Number.isInteger(duration) || duration < 1) {
      return setJarvisError('Enter a whole-number contract duration of at least 1 tick.');
    }
    if (!Number.isInteger(multiplier) || multiplier < 1) {
      return setJarvisError('Enter a whole-number multiplier of at least 1.');
    }
    const maxStakeByRisk = accountBalance * Math.min(2, Math.max(0.5, perTradeMaxRiskPct)) / 100;
    if (stake > maxStakeByRisk) {
      return setJarvisError(`Stake exceeds the configured ${perTradeMaxRiskPct}% per-trade risk cap (${accountCurrency} ${maxStakeByRisk.toFixed(2)}).`);
    }
    if (positionsRef.current.length >= maxConcurrentRef.current) {
      return setJarvisError('The open-position limit has been reached.');
    }
    if (sessionRealizedRef.current <= -Math.abs(dailyMaxLossRef.current)) {
      return setJarvisError('The daily loss limit has been reached.');
    }
    const currentRealizedDrawdown = Math.max(0, sessionPeakRealizedRef.current - sessionRealizedRef.current);
    if (maxSessionDrawdownRef.current <= 0 || currentRealizedDrawdown >= maxSessionDrawdownRef.current) {
      return setJarvisError('Set a positive realized-drawdown limit and keep current drawdown below it before requesting a trade.');
    }

    const reqId = Math.floor(Date.now() % 2_147_483_647);
    jarvisProposalReqIdRef.current = reqId;
    jarvisRequestedSignalRef.current = signal;
    if (jarvisProposal?.subscriptionId) {
      ws.send(JSON.stringify({ forget: jarvisProposal.subscriptionId }));
    }
    setJarvisProposal(null);
    setJarvisTradeStatus('Requesting a Deriv quote…');
    setJarvisError('');
    ws.send(JSON.stringify({
      proposal: 1,
      amount: stake,
      basis: 'stake',
      contract_type: signal.signal === 'BUY' ? 'MULTUP' : 'MULTDOWN',
      currency: accountCurrency,
      duration,
      duration_unit: 't',
      multiplier,
      underlying_symbol: signal.symbol,
      subscribe: 1,
      req_id: reqId
    }));
  };

  const confirmJarvisTrade = () => {
    const ws = derivWsRef.current;
    const proposal = jarvisProposal?.proposal;
    if (!proposal?.id || !ws || ws.readyState !== WebSocket.OPEN) {
      return setJarvisError('The quote is no longer available. Request a new quote.');
    }
    if (connectionStatus === 'LIVE_CONNECTED' && !liveExecutionArmed) {
      return setJarvisError('Live execution is locked. Arm live execution in QuantumBridge first.');
    }
    const askPrice = Number(proposal.ask_price);
    if (!Number.isFinite(askPrice) || askPrice <= 0) {
      return setJarvisError('Deriv returned an invalid quote price. Request a new quote.');
    }
    const maxStakeByRisk = accountBalance * Math.min(2, Math.max(0.5, perTradeMaxRiskPct)) / 100;
    const currentRealizedDrawdown = Math.max(0, sessionPeakRealizedPnl - sessionRealizedPnl);
    if (askPrice > maxStakeByRisk || sessionRealizedPnl <= -Math.abs(dailyMaxLossUsd) || maxSessionDrawdownUsd <= 0 || currentRealizedDrawdown >= maxSessionDrawdownUsd) {
      return setJarvisError('Risk limits changed while the quote was open. Review limits and request a new quote.');
    }
    const accountType = connectionStatus === 'LIVE_CONNECTED' ? 'LIVE' : 'DEMO';
    const accepted = window.confirm(
      `Confirm ${accountType} ${jarvisProposal.signal.signal} ${jarvisProposal.signal.symbol} contract for ${askPrice} ${accountCurrency}?`
    );
    if (!accepted) return;

    const reqId = Math.floor((Date.now() + 1) % 2_147_483_647);
    jarvisBuyReqIdRef.current = reqId;
    setJarvisTradeStatus('Sending the confirmed buy request…');
    setJarvisError('');
    ws.send(JSON.stringify({ buy: proposal.id, price: askPrice, req_id: reqId }));
  };

  useEffect(() => {
    if (connectTab !== 'jarvis' || !jarvisConnected) return undefined;
    const timer = setInterval(() => { refreshJarvisSignals(); }, 5000);
    return () => clearInterval(timer);
  }, [connectTab, jarvisConnected]);

  const connectOAuthAccount = async (account, accessToken = oauthAccessToken) => {
    if (!account?.accountId || !accessToken) {
      setAuthError('Sign in with Deriv before connecting an account.');
      return;
    }

    setAuthError('');
    setConnectionStatus('CONNECTING');
    setLiveTickStreamActive(false);
    if (derivWsRef.current) derivWsRef.current.close();

    try {
      const startedAt = performance.now();
      const response = await fetch(`/api/deriv/accounts/${encodeURIComponent(account.accountId)}/otp`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Deriv could not create the one-time WebSocket connection.');
      const wsUrl = result.data?.url;
      if (typeof wsUrl !== 'string' || !wsUrl.startsWith('wss://api.derivws.com/trading/v1/options/ws/')) {
        throw new Error('Deriv returned an unexpected WebSocket address.');
      }

      const ws = new WebSocket(wsUrl);
      derivWsRef.current = ws;
      ws.onopen = () => {
        if (derivWsRef.current !== ws) return;
        setLatencyMs(Math.max(1, Math.round(performance.now() - startedAt)));
        setConnectionMethod('DERIV_OAUTH');
        setConnectionStatus(account.isLive ? 'LIVE_CONNECTED' : 'DEMO_CONNECTED');
        setActiveAccountId(account.accountId);
        setAccountBalance(Number(account.balance || 0));
        setAccountCurrency(account.currency || 'USD');
        setDerivServer(`${account.broker} (${account.accountId})`);
        setLiveExecutionArmed(false);
        setAutoExecuteEnabled(false);
        ws.send(JSON.stringify({ balance: 1, subscribe: 1 }));
        INITIAL_DERIV_MARKETS.forEach((market) => {
          ws.send(JSON.stringify({ ticks: market.derivTickSymbol, subscribe: 1 }));
        });
        setLiveTickStreamActive(true);
      };

      ws.onmessage = (event) => {
        if (derivWsRef.current !== ws) return;
        const message = JSON.parse(event.data);
        const responseReqId = Number(message.req_id);
        if (jarvisProposalReqIdRef.current !== null && responseReqId === jarvisProposalReqIdRef.current) {
          jarvisProposalReqIdRef.current = null;
          if (message.error) {
            setJarvisTradeStatus('Quote request failed.');
            setJarvisError(message.error.message || 'Deriv could not quote this JARVIS signal.');
          } else if (message.msg_type === 'proposal' && message.proposal?.id) {
            setJarvisProposal({
              proposal: message.proposal,
              signal: jarvisRequestedSignalRef.current,
              subscriptionId: message.subscription?.id || null
            });
            setJarvisTradeStatus('Quote ready. Review the price, then confirm explicitly to buy.');
          }
        }
        if (jarvisBuyReqIdRef.current !== null && responseReqId === jarvisBuyReqIdRef.current) {
          jarvisBuyReqIdRef.current = null;
          if (message.error) {
            setJarvisTradeStatus('Buy request rejected.');
            setJarvisError(message.error.message || 'Deriv rejected the confirmed buy request.');
          } else if (message.msg_type === 'buy' && message.buy) {
            const contractId = message.buy.contract_id || 'accepted';
            if (jarvisProposalRef.current?.subscriptionId) {
              ws.send(JSON.stringify({ forget: jarvisProposalRef.current.subscriptionId }));
            }
            setJarvisTradeStatus(`Order placed. Contract ${contractId}.`);
            setJarvisProposal(null);
            setJarvisError('');
          }
        }
        if (message.error) {
          setAuthError(message.error.message || 'Deriv rejected the account WebSocket request.');
          return;
        }
        if (message.msg_type === 'balance' && message.balance) {
          const balance = Number(message.balance.balance ?? message.balance);
          if (Number.isFinite(balance)) setAccountBalance(balance);
        }
        if (message.msg_type === 'tick' && message.tick) {
          const symbol = message.tick.symbol;
          const quote = Number(message.tick.quote);
          if (!Number.isFinite(quote)) return;
          setMarkets((previous) => previous.map((market) => {
            if (market.derivTickSymbol !== symbol) return market;
            const delta = quote - market.price;
            return {
              ...market,
              price: quote,
              rsi: Number(Math.min(91, Math.max(9, market.rsi + (delta > 0 ? 1.4 : delta < 0 ? -1.4 : 0))).toFixed(1)),
              bias: delta >= 0 ? 'BUY' : 'SELL',
              history: [...market.history.slice(-14), quote]
            };
          }));
        }
      };

      ws.onerror = () => {
        if (derivWsRef.current !== ws) return;
        setAuthError('The Deriv account WebSocket could not connect. Try connecting the account again.');
        setConnectionStatus('DISCONNECTED');
        setLiveTickStreamActive(false);
      };
      ws.onclose = () => {
        if (derivWsRef.current !== ws) return;
        setConnectionStatus('DISCONNECTED');
        setLiveTickStreamActive(false);
      };
    } catch (error) {
      setConnectionStatus('DISCONNECTED');
      setLiveTickStreamActive(false);
      setAuthError(error.message || 'Could not connect the Deriv account.');
    }
  };

  const handleSwitchAccount = async (newAcctId) => {
    const target = connectedAccounts.find((a) => a.accountId === newAcctId);
    if (!target) return;

    if (connectionMethod === 'DERIV_OAUTH' && oauthAccessToken) {
      await connectOAuthAccount(target);
      return;
    }

    setActiveAccountId(target.accountId);
    if (target.balance !== null && target.balance !== undefined) {
      setAccountBalance(target.balance);
    }
    setAccountCurrency(target.currency);
    setConnectionStatus(target.isLive ? 'LIVE_CONNECTED' : 'DEMO_CONNECTED');
    setDerivServer(`${target.broker} (${target.accountId})`);
    setLiveExecutionArmed(!target.isLive);

    triggerToast(
      `Switched to ${target.accountId} (${target.isLive ? 'REAL' : 'DEMO'})`,
      target.isLive
        ? 'Real-money safety lock engaged. Click "ARM LIVE EXECUTION" to trade.'
        : 'Demo account active and ready.',
      target.isLive ? 'crimson' : 'emerald'
    );
  };

  const handleDisconnectAccount = () => {
    if (derivWsRef.current) {
      try {
        derivWsRef.current.close();
      } catch (e) {}
      derivWsRef.current = null;
    }
    if (ctraderPollRef.current) {
      clearInterval(ctraderPollRef.current);
      ctraderPollRef.current = null;
    }
    setConnectedAccounts([]);
    setActiveAccountId('');
    setConnectionStatus('DISCONNECTED');
    setConnectionMethod('SIMULATOR');
    setOauthAccessToken('');
    setOauthExpiresAt(null);
    setLiveTickStreamActive(false);
    setLiveExecutionArmed(false);
    setAccountBalance(25000.00);
    setAccountCurrency('USD');
    triggerToast('Account Disconnected', 'Reverted to offline strategy simulation mode.', 'crimson');
  };

  const handleRefreshLiveBalance = async () => {
    setIsRefreshingBalance(true);
    try {
      if (
        derivWsRef.current &&
        derivWsRef.current.readyState === WebSocket.OPEN &&
        connectionMethod === 'DERIV_OAUTH'
      ) {
        derivWsRef.current.send(JSON.stringify({ balance: 1 }));
        triggerToast('Live Balance Synced', `Queried WebSocket for ${activeAccountId}`, 'emerald');
      } else if (connectionMethod === 'CTRADER_LOCAL') {
        const res = await fetch(ctraderEndpoint.replace(/\/$/, ''), { method: 'GET' });
        const syncData = await res.json();
        if (syncData.balance !== undefined) {
          setAccountBalance(Number(syncData.balance));
          setConnectedAccounts((prev) =>
            prev.map((a) =>
              a.accountId === activeAccountId ? { ...a, balance: Number(syncData.balance) } : a
            )
          );
          triggerToast('Plugin Balance Synced', `Updated ${activeAccountId} balance`, 'emerald');
        }
      } else {
        triggerToast(
          'Connect Real Account to Sync',
          'Showing simulated balance. Click "Connect Real Account" to fetch live funds.',
          'amber'
        );
      }
    } catch (e) {
      triggerToast('Balance Sync Failed', 'Unable to reach broker endpoint.', 'crimson');
    } finally {
      setTimeout(() => setIsRefreshingBalance(false), 500);
    }
  };

  const handleEmergencyKillSwitch = () => {
    setAutoExecuteEnabled(false);
    setLiveExecutionArmed(false);
    setBots((prev) => prev.map((b) => ({ ...b, active: false })));
    setPositions([]);

    const killLog = {
      id: `LOG-KILL-${Date.now()}`,
      time: new Date().toTimeString().split(' ')[0],
      type: 'KILL_SWITCH',
      title: 'EMERGENCY KILL SWITCH ACTIVATED • All Bots Disarmed & Positions Flattened',
      summary: 'All autonomous bots paused, Live Execution disarmed, and close-all command dispatched.',
      payload: {
        command: 'EMERGENCY_FLATTEN_AND_DISARM',
        timestamp: new Date().toISOString(),
        accountId: activeAccountId || 'SIMULATOR'
      }
    };
    setLogs((prev) => [killLog, ...prev.slice(0, 29)]);
    setSelectedLogId(killLog.id);
    triggerToast('KILL SWITCH ACTIVATED', 'All bots stopped and live execution disarmed.', 'crimson');
  };

  const normalizeDerivLotSize = (requestedLot, market) => {
    const clamped = Math.max(market.minLot, requestedLot);
    const steps = Math.floor(clamped / market.lotStep + 1e-9);
    const normalized = Number((steps * market.lotStep).toFixed(3));
    return Math.max(market.minLot, normalized);
  };

  const handleToggleLiveExecution = () => {
    if (liveExecutionArmed) {
      setLiveExecutionArmed(false);
      triggerToast('LIVE EXECUTION DISARMED', 'Real order transmission is locked.', 'emerald');
      return;
    }
    const clearedBot = bots.find((bot) => bot.active && evaluateBotResearch(bot.researchEvidence).approved);
    if (!clearedBot) {
      triggerToast('Research Gate Closed', 'No active bot has complete out-of-sample evidence, positive cost-adjusted expectancy, and a passed forward test.', 'crimson');
      return;
    }
    if (dailyMaxLossUsd <= 0 || maxSessionDrawdownUsd <= 0 || maxConcurrentPositions < 1) {
      triggerToast('Risk Limits Required', 'Set positive daily-loss, realized-drawdown, and open-position limits before arming live execution.', 'crimson');
      return;
    }
    setLiveExecutionArmed(true);
    triggerToast('LIVE EXECUTION ARMED', 'Only research-cleared bots can transmit real orders.', 'crimson');
  };

  const handleToggleAutoExecution = () => {
    if (autoExecuteEnabled) {
      setAutoExecuteEnabled(false);
      return;
    }
    if (connectionStatus === 'LIVE_CONNECTED') {
      const clearedBot = bots.find((bot) => bot.active && evaluateBotResearch(bot.researchEvidence).approved);
      if (!clearedBot || !liveExecutionArmed) {
        triggerToast('Live Bot Gate Closed', 'Arm live execution only after an active bot passes its research gate and all risk limits are set.', 'crimson');
        return;
      }
    }
    if (dailyMaxLossUsd <= 0 || maxSessionDrawdownUsd <= 0 || maxConcurrentPositions < 1) {
      triggerToast('Risk Limits Required', 'Set positive daily-loss, realized-drawdown, and open-position limits before starting automated bots.', 'crimson');
      return;
    }
    if (!bots.some((bot) => bot.active)) {
      triggerToast('No Bots Active', 'Activate a bot in the fleet before starting automation.', 'amber');
      return;
    }
    setAutoExecuteEnabled(true);
  };

  const dispatchDerivSignal = (bot, market, forcedAccuracy = null, options: { paperOnly?: boolean } = {}) => {
    if (!bridgeConnectedRef.current) return;

    const paperOnly = options.paperOnly === true;
    const isLiveAccount = connectionStatusRef.current === 'LIVE_CONNECTED';
    if (isLiveAccount && !liveExecutionArmedRef.current && !paperOnly) {
      return;
    }

    if (isLiveAccount && !paperOnly && !evaluateBotResearch(bot.researchEvidence).approved) {
      triggerToast('Bot Abstained', 'This setup has not passed its sample, cost, random-baseline, walk-forward, and forward-test checks.', 'amber');
      return;
    }

    if (positionsRef.current.length >= maxConcurrentRef.current) return;
    const realizedDrawdown = Math.max(0, sessionPeakRealizedRef.current - sessionRealizedRef.current);
    const dailyLossReached = sessionRealizedRef.current <= -Math.abs(dailyMaxLossRef.current);
    const sessionDrawdownReached = maxSessionDrawdownRef.current > 0 && realizedDrawdown >= maxSessionDrawdownRef.current;
    if (dailyLossReached || sessionDrawdownReached) {
      setAutoExecuteEnabled(false);
      setLiveExecutionArmed(false);
      setBots((prev) => prev.map((item) => ({ ...item, active: false })));
      triggerToast(
        dailyLossReached ? 'Daily Max Loss Reached' : 'Realized Drawdown Limit Reached',
        'Bots paused and live order transmission disarmed by the risk guardrail.',
        'crimson'
      );
      return;
    }

    const mode = executionModeRef.current;
    const accuracy = forcedAccuracy ?? market.accuracy;
    const action = market.bias;
    const entryPrice = market.price;
    const riskPct = Math.min(2, Math.max(0.5, Number(perTradeMaxRiskRef.current) || 1));
    const maxTradeRiskUsd = Number(accountBalanceRef.current || 0) * riskPct / 100;
    if (!(maxTradeRiskUsd >= 1)) {
      triggerToast('Trade Abstained', 'The configured per-trade risk cap is below the broker minimum stake.', 'amber');
      return;
    }
    const requestedStake = Math.max(1, Number(bot.stakeUsd || 10));
    const safeStakeUsd = Number(Math.min(requestedStake, maxTradeRiskUsd).toFixed(2));
    const riskPerLot = bot.slPips * market.pipSize * market.pointValuePerLot;
    const riskCappedLots = riskPerLot > 0 ? Math.min(bot.lotSize, maxTradeRiskUsd / riskPerLot) : bot.lotSize;
    const safeLotSize = normalizeDerivLotSize(riskCappedLots, market);
    const estimatedCfdRisk = bot.slPips * market.pipSize * market.pointValuePerLot * safeLotSize;
    if (mode === 'CTRADER_CFD' && estimatedCfdRisk > maxTradeRiskUsd + 0.01) {
      triggerToast('Trade Abstained', 'The smallest permitted CFD size would exceed the per-trade risk cap.', 'amber');
      return;
    }

    const slDistance = bot.slPips * market.pipSize;
    const tpDistance = bot.tpPips * market.pipSize;
    const sl = action === 'BUY' ? entryPrice - slDistance : entryPrice + slDistance;
    const tp = action === 'BUY' ? entryPrice + tpDistance : entryPrice - tpDistance;

    const signalId = `SIG-${Math.floor(10000 + Math.random() * 90000)}`;
    const ticketId = `DRV-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const sortedDigits = [...digitsRef.current].sort((a, b) => b.pct - a.pct);
    const hottestDigit = sortedDigits[0];

    const jsonPayload =
      mode === 'CTRADER_CFD'
        ? {
            signalId,
            timestamp: now.toISOString(),
            accountId: activeAccountId || 'SIMULATOR',
            isLiveAccount,
            paperOnly,
            brokerTarget: derivServer,
            executionMode: 'CTRADER_CFD',
            botId: bot.id,
            symbol: market.symbol,
            ctraderSymbol: market.ctraderName,
            action,
            requestedLots: bot.lotSize,
            normalizedLots: safeLotSize,
            minAllowedLot: market.minLot,
            accuracyScore: accuracy,
            entryPrice: Number(entryPrice.toFixed(market.digits)),
            stopLoss: Number(sl.toFixed(market.digits)),
            takeProfit: Number(tp.toFixed(market.digits)),
            stopLossPips: bot.slPips,
            takeProfitPips: bot.tpPips,
            autoCloseBeforeSpike: autoCloseSpikeRef.current
          }
        : {
            signalId,
            timestamp: now.toISOString(),
            accountId: activeAccountId || 'SIMULATOR',
            isLiveAccount,
            paperOnly,
            endpoint: `wss://ws.derivws.com/websockets/v3?app_id=${derivAppId}`,
            executionMode: 'DERIV_WS_MULTIPLIER',
            botId: bot.id,
            symbol: market.derivTickSymbol,
            contractType: action === 'BUY' ? 'MULTUP' : 'MULTDOWN',
            digitEdgeHint: `DIGITDIFF_${sortedDigits[sortedDigits.length - 1].digit} / HOT_${hottestDigit.digit}`,
            stakeUsd: safeStakeUsd,
            multiplier: bot.multiplier,
            accuracyScore: accuracy
          };

    if (!paperOnly && mode === 'DERIV_WS_OPTIONS' && (
      derivWsRef.current &&
      derivWsRef.current.readyState === WebSocket.OPEN &&
      connectionMethodRef.current === 'DERIV_OAUTH'
    )) {
      const stake = safeStakeUsd;
      const realBuyRequest = {
        buy: 1,
        price: stake,
        parameters: {
          amount: stake,
          basis: 'stake',
          contract_type: action === 'BUY' ? 'MULTUP' : 'MULTDOWN',
          currency: accountCurrency || 'USD',
          multiplier: bot.multiplier || 100,
          symbol: market.derivTickSymbol
        }
      };
      derivWsRef.current.send(JSON.stringify(realBuyRequest));
    }

    if (!paperOnly && connectionMethodRef.current === 'CTRADER_LOCAL') {
      fetch(ctraderEndpointRef.current.replace(/\/$/, ''), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonPayload)
      }).catch(() => {});
    }

    setBots((prev) =>
      prev.map((b) =>
        b.id === bot.id
          ? { ...b, lastExecutedAt: Date.now() }
          : b
      )
    );

    const newPosition = {
      id: ticketId,
      botId: bot.id,
      botName: bot.name,
      symbol: market.symbol,
      ctraderName: market.ctraderName,
      side: action,
      contractType: mode === 'CTRADER_CFD' ? 'CFD' : `MULT x${bot.multiplier}`,
      volume: mode === 'CTRADER_CFD' ? safeLotSize : safeStakeUsd,
      entryPrice: Number(entryPrice.toFixed(market.digits)),
      sl: Number(sl.toFixed(market.digits)),
      tp: Number(tp.toFixed(market.digits)),
      accuracy,
      openTime: now.toTimeString().split(' ')[0]
    };

    setPositions((prev) => [newPosition, ...prev.slice(0, 11)]);

    const logEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 999)}`,
      time: timeStr,
      type: 'EXECUTION',
      title: `${paperOnly ? '[PAPER TEST]' : isLiveAccount ? '[LIVE REAL]' : '[DEMO/SIM]'} #${ticketId} • ${market.ctraderName}`,
      summary: `${bot.name} → ${action} ${mode === 'CTRADER_CFD' ? `${safeLotSize} lots` : `$${safeStakeUsd} Stake`} @ ${entryPrice.toFixed(market.digits)} (Signal Score: ${accuracy}%)`,
      payload: jsonPayload
    };

    setLogs((prev) => [logEntry, ...prev.slice(0, 29)]);
    setSelectedLogId(logEntry.id);

    triggerToast(
      `${connectionStatusRef.current === 'LIVE_CONNECTED' ? 'LIVE ORDER:' : 'Signal Routed:'} ${action} ${market.ctraderName}`,
      mode === 'CTRADER_CFD'
        ? `${safeLotSize} Normalized Lots • Signal Score ${accuracy}%`
        : `$${safeStakeUsd} Stake (x${bot.multiplier}) • Signal Score ${accuracy}%`,
      action === 'BUY' ? 'emerald' : 'crimson'
    );
  };

  useEffect(() => {
    const tickInterval = setInterval(() => {
      if (bridgeConnectedRef.current && connectionMethodRef.current === 'SIMULATOR') {
        setLatencyMs(Math.floor(7 + Math.random() * 8));
      }

      if (liveTickStreamActive) {
        if (autoExecuteRef.current && bridgeConnectedRef.current) {
          const now = Date.now();
          const activeBots = botsRef.current.filter((b) =>
            b.active && (connectionStatusRef.current !== 'LIVE_CONNECTED' || evaluateBotResearch(b.researchEvidence).approved)
          );
          for (const bot of activeBots) {
            if (now - bot.lastExecutedAt < bot.cooldownMs) continue;
            const botOpenCount = positionsRef.current.filter((p) => p.botId === bot.id).length;
            if (botOpenCount >= 2) continue;

            const candidateMarket = marketsRef.current.find(
              (m) => bot.symbols.includes(m.symbol) && m.accuracy >= bot.minAccuracy
            );
            if (candidateMarket) {
              dispatchDerivSignal(bot, candidateMarket);
              break;
            }
          }
        }
        return;
      }

      setDigitsMatrix((prevDigits) => {
        const idxUp = Math.floor(Math.random() * 10);
        const idxDown = (idxUp + Math.floor(1 + Math.random() * 8)) % 10;
        return prevDigits.map((item, idx) => {
          if (idx === idxUp && item.pct < 15.5) return { ...item, pct: Number((item.pct + 0.2).toFixed(1)) };
          if (idx === idxDown && item.pct > 5.5) return { ...item, pct: Number((item.pct - 0.2).toFixed(1)) };
          return item;
        });
      });

      setMarkets((prevMarkets) => {
        const updatedMarkets = prevMarkets.map((m) => {
          let nextPrice = m.price;
          let nextSpikeCounter = m.spikeCounter;
          let nextSpikeProb = m.spikeProb;
          let spikeOccurred = false;

          if (m.symbol === 'BOOM1000') {
            nextSpikeCounter = (m.spikeCounter || 850) + 1;
            if (Math.random() > 0.965 || nextSpikeCounter >= 1040) {
              nextPrice = Number((m.price + (18 + Math.random() * 24)).toFixed(m.digits));
              nextSpikeCounter = 1;
              spikeOccurred = true;
            } else {
              nextPrice = Number((m.price - (0.35 + Math.random() * 0.45)).toFixed(m.digits));
            }
            nextSpikeProb = Math.min(98, Math.round((nextSpikeCounter / m.spikeAvg) * 92));
          } else if (m.symbol === 'CRASH500') {
            nextSpikeCounter = (m.spikeCounter || 420) + 1;
            if (Math.random() > 0.96 || nextSpikeCounter >= 530) {
              nextPrice = Number((m.price - (14 + Math.random() * 20)).toFixed(m.digits));
              nextSpikeCounter = 1;
              spikeOccurred = true;
            } else {
              nextPrice = Number((m.price + (0.30 + Math.random() * 0.40)).toFixed(m.digits));
            }
            nextSpikeProb = Math.min(98, Math.round((nextSpikeCounter / m.spikeAvg) * 92));
          } else if (m.symbol === 'stpRNG') {
            const step = Math.random() >= 0.5 ? 0.1 : -0.1;
            nextPrice = Number((m.price + step).toFixed(m.digits));
          } else if (m.symbol === 'JD25') {
            nextSpikeCounter = (m.spikeCounter || 1400) + 1;
            const isJump = Math.random() > 0.95;
            const move = isJump
              ? (Math.random() > 0.5 ? 1 : -1) * (45 + Math.random() * 40)
              : (Math.random() - 0.49) * 14;
            if (isJump) nextSpikeCounter = 1;
            nextPrice = Number((m.price + move).toFixed(m.digits));
            nextSpikeProb = Math.min(95, Math.round((nextSpikeCounter / m.spikeAvg) * 88));
          } else {
            const vol =
              m.symbol === 'R_75'
                ? 95
                : m.symbol === '1HZ100V'
                ? 1.4
                : m.symbol === 'XAU/USD'
                ? 0.85
                : m.pipSize * 2.2;
            const delta = (Math.random() - 0.49) * vol;
            nextPrice = Number((m.price + delta).toFixed(m.digits));
          }

          const rsiDelta = (Math.random() - 0.5) * 4.5;
          const nextRsi = Number(Math.min(89, Math.max(12, m.rsi + rsiDelta)).toFixed(1));

          let nextAccuracy = 72;
          if (nextSpikeProb !== null) {
            nextAccuracy = Math.min(97, Math.max(58, Math.round(nextSpikeProb * 0.72 + Math.abs(nextRsi - 50) * 0.75)));
          } else {
            const rsiEdge = Math.abs(nextRsi - 50) * 1.35;
            nextAccuracy = Math.min(96, Math.max(60, Math.round(54 + rsiEdge)));
          }

          const nextBias =
            m.symbol === 'BOOM1000'
              ? 'BUY'
              : m.symbol === 'CRASH500'
              ? 'SELL'
              : nextRsi < 48
              ? 'BUY'
              : 'SELL';

          const nextHistory = [...m.history.slice(-14), nextPrice];

          return {
            ...m,
            price: nextPrice,
            rsi: nextRsi,
            spikeCounter: nextSpikeCounter,
            spikeProb: nextSpikeProb,
            accuracy: spikeOccurred ? 62 : nextAccuracy,
            bias: nextBias,
            history: nextHistory
          };
        });

        setPositions((prevPos) => {
          const remaining = [];
          let realizedDelta = 0;

          prevPos.forEach((pos) => {
            const mkt = updatedMarkets.find((item) => item.symbol === pos.symbol);
            if (!mkt) {
              remaining.push(pos);
              return;
            }

            const isBoomCrash = mkt.symbol === 'BOOM1000' || mkt.symbol === 'CRASH500';
            const dangerSpikeClose =
              autoCloseSpikeRef.current &&
              isBoomCrash &&
              mkt.spikeProb !== null &&
              mkt.spikeProb >= 94;

            const hitTp = pos.side === 'BUY' ? mkt.price >= pos.tp : mkt.price <= pos.tp;
            const hitSl = pos.side === 'BUY' ? mkt.price <= pos.sl : mkt.price >= pos.sl;

            if (hitTp || hitSl || dangerSpikeClose) {
              const priceDiff = pos.side === 'BUY' ? mkt.price - pos.entryPrice : pos.entryPrice - mkt.price;
              const pnl =
                pos.contractType === 'CFD'
                  ? (priceDiff / mkt.pipSize) * (pos.volume * mkt.pointValuePerLot)
                  : hitTp
                  ? pos.volume * 0.85
                  : -pos.volume * 0.45;

              realizedDelta += pnl;

              setBots((prevBots) =>
                prevBots.map((b) => {
                  if (b.id !== pos.botId) return b;
                  const tradesCount = Number(b.tradesCount || 0) + 1;
                  const winsCount = Number(b.winsCount || 0) + (pnl > 0 ? 1 : 0);
                  return {
                    ...b,
                    tradesCount,
                    winsCount,
                    winRate: Number(((winsCount / tradesCount) * 100).toFixed(1)),
                    realizedPnl: Number((b.realizedPnl + pnl).toFixed(2))
                  };
                })
              );

              const closeReason = dangerSpikeClose
                ? 'ANTI-SPIKE GUARDRAIL'
                : hitTp
                ? 'TAKE PROFIT'
                : 'STOP LOSS';

              setLogs((prevLogs) => [
                {
                  id: `LOG-CLS-${Date.now()}-${Math.random()}`,
                  time: new Date().toTimeString().split(' ')[0],
                  type: dangerSpikeClose ? 'SPIKE_GUARD' : hitTp ? 'TP_HIT' : 'SL_HIT',
                  title: `Position #${pos.id} Closed (${closeReason})`,
                  summary: `${mkt.ctraderName} ${pos.side} closed @ ${mkt.price.toFixed(mkt.digits)} | Net: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`,
                  payload: {
                    event: closeReason,
                    positionId: pos.id,
                    symbol: pos.symbol,
                    bridgeSymbol: mkt.ctraderName,
                    closePrice: mkt.price,
                    netProfitUsd: Number(pnl.toFixed(2))
                  }
                },
                ...prevLogs.slice(0, 29)
              ]);
            } else {
              remaining.push(pos);
            }
          });

          if (realizedDelta !== 0) {
            setSessionRealizedPnl((prev) => Number((prev + realizedDelta).toFixed(2)));
            if (connectionMethodRef.current === 'SIMULATOR') {
              setAccountBalance((prevBal) => Number((prevBal + realizedDelta).toFixed(2)));
            }
          }

          return remaining;
        });

        if (autoExecuteRef.current && bridgeConnectedRef.current) {
          const now = Date.now();
          const activeBots = botsRef.current.filter((b) =>
            b.active && (connectionStatusRef.current !== 'LIVE_CONNECTED' || evaluateBotResearch(b.researchEvidence).approved)
          );

          for (const bot of activeBots) {
            if (now - bot.lastExecutedAt < bot.cooldownMs) continue;
            const botOpenCount = positionsRef.current.filter((p) => p.botId === bot.id).length;
            if (botOpenCount >= 2) continue;

            const candidateMarket = updatedMarkets.find(
              (m) => bot.symbols.includes(m.symbol) && m.accuracy >= bot.minAccuracy
            );

            if (candidateMarket) {
              dispatchDerivSignal(bot, candidateMarket);
              break;
            }
          }
        }

        return updatedMarkets;
      });
    }, 1350);

    return () => clearInterval(tickInterval);
  }, [liveTickStreamActive]);

  const handleSimulateHighAccuracySignal = () => {
    if (!bridgeConnected) {
      triggerToast('Execution Bridge Offline', 'Reconnect the Plugin Bridge to route signals.', 'crimson');
      return;
    }
    const targetMarket = activeMarketObj;
    const eligibleBot =
      bots.find((b) => b.active && b.symbols.includes(targetMarket.symbol)) ||
      bots.find((b) => b.active) ||
      bots[0];
    dispatchDerivSignal(eligibleBot, targetMarket, targetMarket.accuracy, { paperOnly: true });
  };

  const fallbackCopyTextToClipboard = (text, successTitle) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
        triggerToast(successTitle, 'Copied using fallback execution.', 'emerald');
      } else {
        triggerToast('Copy Failed', 'Please select and copy manually.', 'crimson');
      }
    } catch (err) {
      triggerToast('Copy Error', 'Clipboard access restricted in sandbox.', 'crimson');
    }
  };

  const handleCopyCode = () => {
    const textToCopy = DERIV_CTRADER_PLUGIN_CS;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
         triggerToast('Source Code Copied', 'Ready to paste into your C# execution plugin.', 'emerald');
      }).catch(() => {
        fallbackCopyTextToClipboard(textToCopy, 'Source Code Copied');
      });
    } else {
      fallbackCopyTextToClipboard(textToCopy, 'Source Code Copied');
    }
  };

  const oauthRedirectUri = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const configuredUri = customRedirectUriInput.trim();
    if (configuredUri) return configuredUri;

    // Deriv permits localhost for development; its registration must match exactly.
    if (window.location.hostname === 'localhost' && window.location.port === '5173') {
      return 'http://localhost:5173/';
    }

    // On a published deployment, use that deployment's own callback path.
    return `${window.location.origin}${window.location.pathname}`;
  }, [customRedirectUriInput]);

  const handleOAuthLogin = async () => {
    const clientId = derivAppId.trim();
    if (!clientId) {
      setAuthError('Enter the App ID from your registered Deriv Web-based OAuth app in App ID Settings.');
      setShowDerivAppSettingsModal(true);
      return;
    }

    const selectedScopes = Object.entries(oauthScopes)
      .filter(([, enabled]) => enabled)
      .map(([scope]) => scope)
      .join(' ');
    if (!selectedScopes.split(' ').includes('trade')) {
      setAuthError('Select the Trade scope to read your Options accounts and connect a trading session.');
      setShowDerivAppSettingsModal(true);
      return;
    }

    try {
      const verifierBytes = crypto.getRandomValues(new Uint8Array(32));
      const codeVerifier = btoa(String.fromCharCode(...verifierBytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
      const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      const stateBytes = crypto.getRandomValues(new Uint8Array(16));
      const state = Array.from(stateBytes, (value) => value.toString(16).padStart(2, '0')).join('');

      sessionStorage.setItem('qb.oauth.state', state);
      sessionStorage.setItem('qb.oauth.verifier', codeVerifier);
      sessionStorage.setItem('qb.oauth.client_id', clientId);
      sessionStorage.setItem('qb.oauth.redirect_uri', oauthRedirectUri);
      localStorage.setItem('quantumbridge.derivClientId', clientId);
      setAuthError('');

      const authorizeUrl = new URL('https://auth.deriv.com/oauth2/auth');
      authorizeUrl.searchParams.set('response_type', 'code');
      authorizeUrl.searchParams.set('client_id', clientId);
      authorizeUrl.searchParams.set('redirect_uri', oauthRedirectUri);
      authorizeUrl.searchParams.set('scope', selectedScopes);
      authorizeUrl.searchParams.set('state', state);
      authorizeUrl.searchParams.set('code_challenge', codeChallenge);
      authorizeUrl.searchParams.set('code_challenge_method', 'S256');
      window.location.assign(authorizeUrl.toString());
    } catch (error) {
      setAuthError(error.message || 'Could not start secure Deriv sign-in.');
    }
  };

  const handleSaveAppConfig = (e) => {
    e.preventDefault();
    if (!derivAppId.trim()) return;
    localStorage.setItem('quantumbridge.derivClientId', derivAppId.trim());
    const exists = savedAppConfigs.some((c) => c.appId === derivAppId.trim());
    if (!exists) {
      setSavedAppConfigs((prev) => [
        ...prev,
        { appId: derivAppId.trim(), name: customAppName.trim() || `App (${derivAppId})`, isDefault: false }
      ]);
    }
    setShowDerivAppSettingsModal(false);
    triggerToast('App Settings Updated', `Configured App ID ${derivAppId} with OAuth scopes & redirect URI.`, 'emerald');
  };

  const handleCopyRedirectUri = () => {
    if (!oauthRedirectUri) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(oauthRedirectUri).then(() => {
        setCopiedRedirectUri(true);
        setTimeout(() => setCopiedRedirectUri(false), 2000);
        triggerToast('Redirect URI Copied', 'Paste this URL into your OAuth App Registration settings.', 'emerald');
      }).catch(() => {
        fallbackCopyTextToClipboard(oauthRedirectUri, 'Redirect URI Copied');
      });
    } else {
      fallbackCopyTextToClipboard(oauthRedirectUri, 'Redirect URI Copied');
    }
  };

  const activeMarketObj = useMemo(
    () => markets.find((m) => m.symbol === selectedSymbol) || markets[0],
    [markets, selectedSymbol]
  );

  const currentTheme = APP_THEMES[activeThemeKey] || APP_THEMES.quantum_emerald;
  const activeBotsCount = useMemo(() => bots.filter((b) => b.active).length, [bots]);

  const totalFloatingPnl = useMemo(() => {
    return positions.reduce((acc, pos) => {
      const mkt = markets.find((item) => item.symbol === pos.symbol);
      if (!mkt) return acc;
      const priceDiff = pos.side === 'BUY' ? mkt.price - pos.entryPrice : pos.entryPrice - mkt.price;
      const pnl =
        pos.contractType === 'CFD'
          ? (priceDiff / mkt.pipSize) * (pos.volume * mkt.pointValuePerLot)
          : pos.volume * 0.75;
      return acc + pnl;
    }, 0);
  }, [positions, markets]);

  const accountEquity = accountBalance + totalFloatingPnl;
  const selectedLog = logs.find((l) => l.id === selectedLogId) || logs[0];

  const enrichedPositions = useMemo(() => {
    return positions.map((pos) => {
      const mkt = markets.find((item) => item.symbol === pos.symbol) || markets[0];
      const priceDiff = pos.side === 'BUY' ? mkt.price - pos.entryPrice : pos.entryPrice - mkt.price;
      const floatingPnl =
        pos.contractType === 'CFD'
          ? (priceDiff / mkt.pipSize) * (pos.volume * mkt.pointValuePerLot)
          : pos.volume * 0.75;
      const pips = Math.round(priceDiff / mkt.pipSize);
      return {
        ...pos,
        currentPrice: mkt.price,
        digits: mkt.digits,
        floatingPnl,
        pips
      };
    });
  }, [positions, markets]);

  const handleClosePosition = (positionId) => {
    const pos = positions.find((p) => p.id === positionId);
    if (!pos) return;
    const mkt = markets.find((item) => item.symbol === pos.symbol);
    const exitPrice = mkt ? mkt.price : pos.entryPrice;
    const priceDiff = pos.side === 'BUY' ? exitPrice - pos.entryPrice : pos.entryPrice - exitPrice;
    const netPnl =
      pos.contractType === 'CFD'
        ? (priceDiff / mkt.pipSize) * (pos.volume * mkt.pointValuePerLot)
        : pos.volume * 0.75;

    setPositions((prev) => prev.filter((p) => p.id !== positionId));
    setSessionRealizedPnl((prev) => Number((prev + netPnl).toFixed(2)));
    if (connectionMethod === 'SIMULATOR') {
      setAccountBalance((prev) => Number((prev + netPnl).toFixed(2)));
    }

    setBots((prev) => prev.map((b) => {
      if (b.id !== pos.botId) return b;
      const tradesCount = Number(b.tradesCount || 0) + 1;
      const winsCount = Number(b.winsCount || 0) + (netPnl > 0 ? 1 : 0);
      return {
        ...b,
        tradesCount,
        winsCount,
        winRate: Number(((winsCount / tradesCount) * 100).toFixed(1)),
        realizedPnl: Number((b.realizedPnl + netPnl).toFixed(2))
      };
    }));

    const closeLog = {
      id: `LOG-CLOSE-MANUAL-${Date.now()}`,
      time: new Date().toTimeString().split(' ')[0],
      type: 'EXECUTION',
      title: `Position #${pos.id} Closed Manually`,
      summary: `${pos.ctraderName} ${pos.side} closed @ ${exitPrice.toFixed(mkt?.digits || 2)} | P&L: ${netPnl >= 0 ? '+' : ''}$${netPnl.toFixed(2)}`,
      payload: { event: 'MANUAL_CLOSE', positionId: pos.id, netPnlUsd: Number(netPnl.toFixed(2)) }
    };
    setLogs((prev) => [closeLog, ...prev.slice(0, 29)]);
    setSelectedLogId(closeLog.id);

    triggerToast(
      `Position Closed: #${pos.id}`,
      `Realized P&L: ${netPnl >= 0 ? '+' : ''}$${netPnl.toFixed(2)}`,
      netPnl >= 0 ? 'emerald' : 'crimson'
    );
  };

  const handleUpdateBotParam = (botId, field, value) => {
    setBots((prev) =>
      prev.map((b) => (b.id === botId ? { ...b, [field]: value } : b))
    );
  };

  const handleUpdateBotResearch = (botId, field, value) => {
    setBots((prev) => prev.map((bot) => {
      if (bot.id !== botId) return bot;
      return {
        ...bot,
        researchEvidence: {
          ...createEmptyResearchEvidence(),
          ...(bot.researchEvidence || {}),
          [field]: value
        }
      };
    }));
  };

  const handleToggleBotSymbol = (botId, sym) => {
    setBots((prev) =>
      prev.map((b) => {
        if (b.id !== botId) return b;
        const exists = b.symbols.includes(sym);
        const nextSymbols = exists
          ? b.symbols.length > 1
            ? b.symbols.filter((s) => s !== sym)
            : b.symbols
          : [...b.symbols, sym];
        return { ...b, symbols: nextSymbols };
      })
    );
  };

  const handleCreateNewBot = (e) => {
    e.preventDefault();
    if (!newBotForm.name.trim()) return;
    const newId = `DRV-BOT-${Math.floor(10 + Math.random() * 89)}`;
    const createdBot = {
      id: newId,
      name: newBotForm.name.trim(),
      strategy: newBotForm.strategy.trim() || 'Custom Deriv Algorithmic Execution',
      active: false,
      symbols: newBotForm.symbols.length > 0 ? newBotForm.symbols : ['R_75'],
      lotSize: Number(newBotForm.lotSize) || 0.01,
      stakeUsd: Number(newBotForm.stakeUsd) || 15,
      multiplier: Number(newBotForm.multiplier) || 100,
      maxDrawdown: 0,
      minAccuracy: Number(newBotForm.minAccuracy) || 85,
      slPips: Number(newBotForm.slPips) || 50,
      tpPips: Number(newBotForm.tpPips) || 120,
      tradesCount: 0,
      winRate: 0,
      winsCount: 0,
      realizedPnl: 0.0,
      researchEvidence: createEmptyResearchEvidence(),
      cooldownMs: 7000,
      lastExecutedAt: 0
    };
    setBots((prev) => [...prev, createdBot]);
    setExpandedBotConfigId(newId);
    setShowNewBotModal(false);
    triggerToast(`Bot Deployed: ${createdBot.name}`, `Assigned ID ${newId} • Monitoring ${createdBot.symbols.join(', ')}`, 'emerald');
  };

  const handleDeleteBot = (botId) => {
    if (bots.length <= 1) {
      triggerToast('Cannot Remove Last Bot', 'At least one trading bot instance must remain active in the workspace.', 'crimson');
      return;
    }
    setBots((prev) => prev.filter((b) => b.id !== botId));
    triggerToast('Bot Instance Removed', `Decommissioned ${botId}`, 'crimson');
  };

  const MODULE_CLASSES = [
    {
      id: 'BOTS',
      classCode: 'CLASS 01 • AUTOMATION',
      title: 'Autonomous Bot Fleet',
      subtitle: 'Deploy, tune, and monitor algorithmic synthetic & FX bots with per-bot SL/TP and lot sizing.',
      metricLabel: 'Active Bots',
      metricValue: `${bots.filter((b) => b.active).length} / ${bots.length} Running`,
      accent: 'emerald',
      icon: Bot,
      highlights: ['V75 Structure Hunter', 'Boom/Crash Spike Bot', 'Custom Bot Creator']
    },
    {
      id: 'MARKETS',
      classCode: 'CLASS 02 • TELEMETRY',
      title: 'Synthetics & Digit Intelligence',
      subtitle: 'Market readings and simulated last-digit distributions are descriptive inputs; they do not establish a predictive edge.',
      metricLabel: 'Top Signal',
      metricValue: `${activeMarketObj.symbol} (${activeMarketObj.accuracy}% score)`,
      accent: 'cyan',
      icon: BarChart3,
      highlights: ['Market Feed', 'Research Filters', 'Cost-Matched Baselines']
    },
    {
      id: 'BRIDGE',
      classCode: 'CLASS 03 • EXECUTION',
      title: 'Plugin Bridge & Ledger',
      subtitle: 'Inspect live JSON payloads, manage open positions, and copy C# AccessRights.FullAccess bridge code.',
      metricLabel: 'Open Positions',
      metricValue: `${positions.length} Active (${totalFloatingPnl >= 0 ? '+' : ''}$${totalFloatingPnl.toFixed(2)})`,
      accent: 'amber',
      icon: Cpu,
      highlights: ['Live Execution Ledger', 'JSON Payload Inspector', 'C# & Python Bridge Code']
    },
    {
      id: 'RISK',
      classCode: 'CLASS 04 • SECURITY & VAULT',
      title: 'Account & Risk Guardrails',
      subtitle: 'Connect live or demo accounts via Deriv OAuth 2.0, configure daily loss caps, and arm execution.',
      metricLabel: 'Account Status',
      metricValue: connectionStatus === 'DISCONNECTED' ? 'Simulator Mode' : activeAccountId,
      accent: 'rose',
      icon: Shield,
      highlights: ['OAuth2 Handshake', 'Anti-Spike Auto-Close', 'Daily Max Loss Lock']
    }
  ];

  return (
    <div className={`min-h-screen ${currentTheme.appBg} ${currentTheme.textPrimary} font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col transition-colors duration-300`}>
      {toastNotification && (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-2xl backdrop-blur-md ${
              toastNotification.tone === 'emerald'
                ? 'bg-[#0d1916]/95 border-emerald-500/40 text-emerald-100'
                : 'bg-[#1c0e12]/95 border-rose-500/40 text-rose-100'
            }`}
          >
            <Zap
              className={`w-4 h-4 shrink-0 ${
                toastNotification.tone === 'emerald' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            />
            <div>
              <div className="text-xs font-semibold tracking-wide">{toastNotification.title}</div>
              <div className="text-[11px] font-mono opacity-80">{toastNotification.subtitle}</div>
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER */}
      <header className={`border-b ${currentTheme.border} ${currentTheme.headerBg} backdrop-blur-md sticky top-0 z-30 transition-colors`}>
        <div className="max-w-[1620px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('HOME')}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
              title="Return to Home Portal"
            >
              <QuantumBridgeLogo className="w-10 h-10 shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm sm:text-base font-extrabold tracking-tight ${currentTheme.textPrimary}`}>
                    QUANTUM<span className={currentTheme.accentText}>BRIDGE</span>
                    <span className="text-cyan-400 font-semibold ml-1.5 text-xs">PRO</span>
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${
                      liveTickStreamActive
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                        : `${currentTheme.subCardBg} ${currentTheme.textSecondary} ${currentTheme.border}`
                    }`}
                  >
                    <Globe2 className="w-3 h-3" />
                    {liveTickStreamActive ? 'LIVE WS STREAM' : `${activeBotsCount} BOTS ACTIVE`}
                  </span>
                </div>
                <p className={`text-[11px] ${currentTheme.textSecondary} hidden sm:block`}>
                  Guided Algorithmic Workflow • OAuth2 & Plugin Execution Bridge
                </p>
              </div>
            </button>
          </div>

          {/* CLASS NAVIGATION TABS */}
          <nav className={`flex items-center gap-1 ${currentTheme.subCardBg} p-1 rounded-xl border ${currentTheme.border} overflow-x-auto`}>
            {[
              { id: 'HOME', label: '1. Home & Guide', icon: Home },
              { id: 'BOTS', label: `2. Bot Fleet (${activeBotsCount})`, icon: Bot },
              { id: 'MARKETS', label: '3. Live Markets', icon: BarChart3 },
              { id: 'BRIDGE', label: '4. Bridge & Ledger', icon: Terminal },
              { id: 'RISK', label: '5. Vault & Risk', icon: Shield }
            ].map((nav) => {
              const IconComp = nav.icon;
              const isActive = activePage === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActivePage(nav.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? `${currentTheme.badgeBg} border shadow`
                      : `${currentTheme.textSecondary} hover:opacity-90 border border-transparent`
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{nav.label}</span>
                </button>
              );
            })}
          </nav>

          <div className={`flex items-center gap-3 sm:gap-4 ${currentTheme.subCardBg} px-3.5 py-1.5 rounded-lg border ${currentTheme.border}`}>
            {connectedAccounts.length > 0 ? (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                  Active Account
                </div>
                <select
                  value={activeAccountId}
                  onChange={(e) => handleSwitchAccount(e.target.value)}
                  className="bg-transparent text-xs font-mono font-bold text-emerald-300 focus:outline-none cursor-pointer"
                >
                  {connectedAccounts.map((acc) => (
                    <option key={acc.accountId} value={acc.accountId} className="bg-slate-900 text-slate-100">
                      {acc.accountId} ({acc.isLive ? 'REAL' : 'DEMO'} • {acc.currency})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                  Active Bots
                </div>
                <div className={`text-xs font-mono font-bold ${currentTheme.accentText}`}>
                  {activeBotsCount} / {bots.length} LIVE
                </div>
              </div>
            )}

            <div className="h-6 w-px bg-slate-800" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium flex items-center gap-1.5">
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                    connectionStatus === 'LIVE_CONNECTED'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : connectionStatus === 'DEMO_CONNECTED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {connectionStatus === 'LIVE_CONNECTED'
                    ? 'REAL BALANCE'
                    : connectionStatus === 'DEMO_CONNECTED'
                    ? 'DEMO BALANCE'
                    : 'SIM BALANCE'}
                </span>
                <span>({accountCurrency})</span>
                <button
                  onClick={() => setHideBalance(!hideBalance)}
                  className="text-slate-400 hover:text-white transition-colors"
                  title={hideBalance ? 'Show Balance' : 'Hide Balance'}
                >
                  {hideBalance ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
                <button
                  onClick={handleRefreshLiveBalance}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                  title="Sync Real Account Balance"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshingBalance ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
              </div>
              <div
                className={`text-xs sm:text-sm font-mono font-extrabold ${
                  connectionStatus === 'LIVE_CONNECTED' ? 'text-rose-300' : currentTheme.textPrimary
                }`}
              >
                {hideBalance
                  ? '••••••••'
                  : `${accountCurrency === 'USD' ? '$' : ''}${accountBalance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`}
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800 hidden md:block" />
            <div className="hidden md:block">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Equity</div>
              <div className={`text-xs sm:text-sm font-mono font-semibold ${currentTheme.textPrimary}`}>
                {hideBalance
                  ? '••••••••'
                  : `${accountCurrency === 'USD' ? '$' : ''}${accountEquity.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConnectModal(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-lg ${
                connectionStatus === 'LIVE_CONNECTED'
                  ? 'bg-rose-500/20 border-rose-500/60 text-rose-200 hover:bg-rose-500/30 shadow-rose-950/40'
                  : connectionStatus === 'DEMO_CONNECTED'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/30'
                  : 'bg-gradient-to-r from-emerald-600 to-cyan-600 border-emerald-400/40 text-white hover:from-emerald-500 hover:to-cyan-500'
              }`}
            >
              <span className="relative flex h-2 w-2">
                {connectionStatus !== 'DISCONNECTED' && (
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      connectionStatus === 'LIVE_CONNECTED' ? 'bg-rose-400' : 'bg-emerald-400'
                    }`}
                  />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    connectionStatus === 'LIVE_CONNECTED'
                      ? 'bg-rose-400'
                      : connectionStatus === 'DEMO_CONNECTED'
                      ? 'bg-emerald-400'
                      : 'bg-white'
                  }`}
                />
              </span>
              <Wallet className="w-3.5 h-3.5" />
              <span>
                {connectionStatus === 'LIVE_CONNECTED'
                  ? `LIVE: ${activeAccountId}`
                  : connectionStatus === 'DEMO_CONNECTED'
                  ? `DEMO: ${activeAccountId}`
                  : connectionStatus === 'CONNECTING'
                  ? 'Connecting...'
                  : 'Connect Real Account'}
              </span>
              {connectionStatus !== 'DISCONNECTED' && (
                <span className="font-mono text-[10px] opacity-80 border-l border-current/30 pl-1.5">
                  {latencyMs}ms
                </span>
              )}
            </button>

            {connectionStatus !== 'DISCONNECTED' && (
              <button
                onClick={handleDisconnectAccount}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 transition-colors"
                title="Disconnect Active Account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleEmergencyKillSwitch}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/90 hover:bg-rose-900 text-rose-200 border border-rose-500/50 text-xs font-bold transition-colors"
              title="Emergency Kill Switch"
            >
              <OctagonAlert className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden xl:inline">Kill Switch</span>
            </button>

            <button
              onClick={() => setShowPluginModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Plugin Code</span>
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-medium transition-colors"
              title="Settings & Visual Themes"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* LIVE SAFETY BANNER */}
      {connectionStatus === 'LIVE_CONNECTED' && (
        <div className="bg-gradient-to-r from-rose-950 via-rose-900/90 to-amber-950 border-b border-rose-500/60">
          <div className="max-w-[1620px] mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-rose-100">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <span>
                <strong>LIVE REAL MONEY ACCOUNT CONNECTED ({activeAccountId}):</strong> Real capital is at risk.
                Confirm daily loss, realized drawdown, per-trade cap, and the bot's out-of-sample research gate before arming.
              </span>
            </div>

            <button
              onClick={handleToggleLiveExecution}
              className={`flex items-center gap-2 px-3.5 py-1 rounded-md font-mono text-xs font-bold border transition-all ${
                liveExecutionArmed
                  ? 'bg-rose-600 text-white border-rose-300 shadow-lg shadow-rose-950'
                  : 'bg-slate-950/90 text-amber-300 border-amber-400/60 hover:bg-slate-900'
              }`}
            >
              {liveExecutionArmed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{liveExecutionArmed ? 'LIVE EXECUTION: ARMED' : 'ARM LIVE EXECUTION'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB BAR */}
      <div className="bg-[#0b0f16] border-b border-slate-800/70">
        <div className="max-w-[1620px] mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg bg-[#07090d] p-0.5 border border-slate-800">
              <button
                onClick={() => setExecutionMode('CTRADER_CFD')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  executionMode === 'CTRADER_CFD'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Plugin Bridge CFDs (Synthetics + FX)
              </button>
              <button
                onClick={() => setExecutionMode('DERIV_WS_OPTIONS')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  executionMode === 'DERIV_WS_OPTIONS'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Direct Multipliers / Options (WS API)
              </button>
            </div>

            <button
              onClick={() => setAutoCloseBeforeSpike(!autoCloseBeforeSpike)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                autoCloseBeforeSpike
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>SPIKE GUARD: {autoCloseBeforeSpike ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={handleToggleAutoExecution}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                autoExecuteEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
            >
              {autoExecuteEnabled ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              <span>BOTS: {autoExecuteEnabled ? 'ARMED' : 'PAUSED'}</span>
            </button>
          </div>

          <button
            onClick={handleSimulateHighAccuracySignal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.99]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Paper Signal Preview ({activeMarketObj.symbol})</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FRONT PAGE: HOME CLASS DIRECTORY PORTAL                               */}
      {/* ===================================================================== */}
      {activePage === 'HOME' && (
        <main className="max-w-[1620px] mx-auto p-4 sm:p-6 flex-1 w-full space-y-6">
          {/* NEAT 4-STEP QUICK-START NAVIGATION ROADMAP */}
          <section className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-2xl p-4 sm:p-5 shadow-lg`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h2 className={`text-xs font-mono font-bold uppercase tracking-wider ${currentTheme.textPrimary}`}>
                  Neat Execution Roadmap — Follow Steps 1 to 4
                </h2>
              </div>
              <span className={`text-[11px] font-mono ${currentTheme.textSecondary}`}>
                Click any step below to jump directly to its workspace
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  step: 'STEP 01',
                  title: 'Connect Trading Account',
                  desc: 'Sign in through Deriv OAuth 2.0 to link your Options accounts.',
                  status: connectionStatus !== 'DISCONNECTED' ? `Connected (${activeAccountId})` : 'Action Needed',
                  done: connectionStatus !== 'DISCONNECTED',
                  action: () => setShowConnectModal(true),
                  cta: 'Connect Account'
                },
                {
                  step: 'STEP 02',
                  title: 'Configure Bot Fleet',
                  desc: 'Keep bots paused while you define a setup, test unseen windows, compare costs, and set risk limits.',
                  status: `${activeBotsCount} of ${bots.length} Bots Active`,
                  done: activeBotsCount > 0,
                  action: () => setActivePage('BOTS'),
                  cta: 'Open Bot Fleet'
                },
                {
                  step: 'STEP 03',
                  title: 'Link Execution Plugin',
                  desc: 'Copy the FullAccess C# Executor into your desktop terminal to receive live signals.',
                  status: bridgeConnected ? `Bridge Ready (${latencyMs}ms)` : 'Bridge Offline',
                  done: bridgeConnected,
                  action: () => setShowPluginModal(true),
                  cta: 'Get C# Plugin'
                },
                {
                  step: 'STEP 04',
                  title: 'Monitor Ledger & Risk',
                  desc: 'Inspect live JSON payloads, open positions, and daily max-loss guardrails.',
                  status: `${positions.length} Open • $${dailyMaxLossUsd} Max Loss`,
                  done: true,
                  action: () => setActivePage('BRIDGE'),
                  cta: 'View Ledger'
                }
              ].map((item) => (
                <div
                  key={item.step}
                  onClick={item.action}
                  className={`group cursor-pointer rounded-xl p-3.5 border transition-all flex flex-col justify-between ${currentTheme.subCardBg} ${currentTheme.border} hover:border-emerald-500/60`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {item.step}
                      </span>
                      <span className={`text-[10px] font-mono flex items-center gap-1 ${item.done ? 'text-emerald-400' : 'text-amber-400'}`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {item.status}
                      </span>
                    </div>
                    <h3 className={`text-xs sm:text-sm font-bold ${currentTheme.textPrimary} group-hover:text-emerald-400 transition-colors mb-1`}>
                      {item.title}
                    </h3>
                    <p className={`text-[11px] ${currentTheme.textSecondary} leading-relaxed mb-3`}>
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] font-mono font-bold text-cyan-400 group-hover:text-emerald-300">
                    <span>{item.cta}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hero Command Banner + OAuth 2.0 Quick-Connect Card */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0e1520] via-[#0b1018] to-[#091412] p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
              <div className="xl:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <QuantumBridgeLogo className="w-12 h-12 shrink-0" />
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                    <Compass className="w-3.5 h-3.5" />
                    <span>QUANTUMBRIDGE COMMAND DIRECTORY • WEB OAUTH 2.0 ENABLED</span>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Algorithmic Execution & Telemetry Hub for{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    Synthetics & FX
                  </span>
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Sign in through Deriv OAuth 2.0 with PKCE, connect an Options account, and monitor synthetic market signals. Live bot execution starts paused.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleOAuthLogin}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-950/60 transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Sign in with OAuth 2.0</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActivePage('BOTS')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 transition-all"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Launch Bot Fleet</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowConnectModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-bold transition-all"
                  >
                    <Wallet className="w-4 h-4 text-cyan-400" />
                    <span>Connection Options</span>
                  </button>
                </div>
              </div>

              {/* OAuth 2.0 Redirect Flow Live Card */}
              <div className="xl:col-span-5 bg-[#070a10]/95 border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      Web OAuth 2.0 Redirect Flow
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      connectionStatus !== 'DISCONNECTED'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {connectionStatus !== 'DISCONNECTED' ? `LINKED: ${activeAccountId}` : 'READY FOR REDIRECT'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                  <div className="p-2 rounded-lg bg-[#0c111a] border border-slate-800">
                    <div className="text-cyan-400 font-bold mb-0.5">1. REDIRECT</div>
                    <div className="text-slate-400">OAuth Provider</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0c111a] border border-slate-800">
                    <div className="text-emerald-400 font-bold mb-0.5">2. CALLBACK</div>
                    <div className="text-slate-400">?code=&state=</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0c111a] border border-slate-800">
                    <div className="text-amber-400 font-bold mb-0.5">3. WS AUTH</div>
                    <div className="text-slate-400">One-time WebSocket URL</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[10px] font-mono uppercase text-slate-400">
                      Registered Redirect URI (Copy to OAuth App Settings)
                    </label>
                    <button
                      onClick={handleCopyRedirectUri}
                      className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300"
                    >
                      {copiedRedirectUri ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedRedirectUri ? 'Copied' : 'Copy URI'}</span>
                    </button>
                  </div>
                  <div className="bg-[#0b1018] border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-slate-300 truncate">
                    {oauthRedirectUri}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[9px] font-mono uppercase text-slate-500 mb-1">
                      Deriv OAuth App ID
                    </label>
                    <input
                      type="text"
                      value={derivAppId}
                      onChange={(e) => setDerivAppId(e.target.value)}
                      className="w-full bg-[#0b1018] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="pt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOAuthLogin}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
                    >
                      <span>Authorize</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live KPI Strip inside Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 font-mono">
              <div className={`${currentTheme.subCardBg} border ${currentTheme.border} rounded-xl p-3`}>
                <div className="flex items-center justify-between text-[10px] uppercase text-slate-500">
                  <span>
                    {connectionStatus === 'LIVE_CONNECTED'
                      ? 'Real Trading Balance'
                      : connectionStatus === 'DEMO_CONNECTED'
                      ? 'Demo Trading Balance'
                      : 'Trading Balance (Sim)'}
                  </span>
                  <button
                    onClick={handleRefreshLiveBalance}
                    className="text-cyan-400 hover:text-cyan-300"
                    title="Refresh Balance"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshingBalance ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div
                  className={`text-lg font-extrabold mt-0.5 ${
                    connectionStatus === 'LIVE_CONNECTED' ? 'text-rose-400' : currentTheme.accentText
                  }`}
                >
                  {hideBalance
                    ? '••••••••'
                    : `${accountCurrency === 'USD' ? '$' : ''}${accountBalance.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {activeAccountId ? `${activeAccountId} • ${derivServer}` : 'Click Connect Real Account to sync'}
                </div>
              </div>
              <div className={`${currentTheme.subCardBg} border ${currentTheme.border} rounded-xl p-3`}>
                <div className="text-[10px] uppercase text-slate-500">Session Realized P&L</div>
                <div className={`text-lg font-bold mt-0.5 ${sessionRealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {sessionRealizedPnl >= 0 ? '+' : ''}${sessionRealizedPnl.toFixed(2)}
                </div>
              </div>
              <div className={`${currentTheme.subCardBg} border ${currentTheme.border} rounded-xl p-3`}>
                <div className="text-[10px] uppercase text-slate-500">Highest Signal Edge</div>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">
                  {Math.max(...markets.map((m) => m.accuracy))}% Score
                </div>
              </div>
              <div className={`${currentTheme.subCardBg} border ${currentTheme.border} rounded-xl p-3`}>
                <div className="text-[10px] uppercase text-slate-500">Active Visual Theme</div>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="text-xs font-bold text-amber-400 hover:underline mt-1 flex items-center gap-1"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span className="truncate">{currentTheme.name.split(' (')[0]}</span>
                </button>
              </div>
            </div>
          </section>

          {/* TOP 4 BOTS CIRCLE PERFORMANCE GRAPH + QUICK FLEET OVERVIEW */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7">
              <TopBotsCircleChart bots={bots} theme={currentTheme} />
            </div>

            <div className={`lg:col-span-5 ${currentTheme.cardBg} border ${currentTheme.border} rounded-2xl p-5 shadow-xl flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${currentTheme.textPrimary}`}>
                      Fleet Capacity & Quick Actions
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    {activeBotsCount} Active
                  </span>
                </div>

                <p className={`text-xs ${currentTheme.textSecondary} leading-relaxed mb-4`}>
                  You currently have <strong className={currentTheme.textPrimary}>{activeBotsCount} active bot instances</strong> out of <strong className={currentTheme.textPrimary}>{bots.length} total deployed bots</strong> scanning 1s synthetic indices and FX pairs.
                </p>

                <div className="space-y-2 mb-4">
                  {bots.map((b) => (
                    <div
                      key={b.id}
                      className={`px-3 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.subCardBg} flex items-center justify-between text-xs font-mono`}
                    >
                      <span className="truncate font-semibold">{b.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.active
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {b.active ? 'RUNNING' : 'PAUSED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-800/70">
                <button
                  onClick={() => setActivePage('BOTS')}
                  className={`flex-1 py-2 px-3 rounded-xl ${currentTheme.accentBg} text-white text-xs font-bold transition-colors text-center`}
                >
                  Manage All {bots.length} Bots
                </button>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Themes</span>
                </button>
              </div>
            </div>
          </section>

          {/* 4 CLASS MODULE CARDS */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MODULE_CLASSES.map((mod) => {
              const borderAccent =
                mod.accent === 'emerald'
                  ? 'hover:border-emerald-500/60'
                  : mod.accent === 'cyan'
                  ? 'hover:border-cyan-500/60'
                  : mod.accent === 'amber'
                  ? 'hover:border-amber-500/60'
                  : 'hover:border-rose-500/60';
              const iconBg =
                mod.accent === 'emerald'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : mod.accent === 'cyan'
                  ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                  : mod.accent === 'amber'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30';
              const IconComponent = mod.icon;

              return (
                <div
                  key={mod.id}
                  onClick={() => setActivePage(mod.id)}
                  className={`group cursor-pointer rounded-2xl bg-[#0d1117] border border-slate-800/90 ${borderAccent} p-6 shadow-xl transition-all flex flex-col justify-between hover:-translate-y-0.5`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-[11px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                        {mod.classCode}
                      </span>
                      <div className={`p-2.5 rounded-xl border ${iconBg}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                      {mod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                      {mod.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {mod.highlights.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#080b10] border border-slate-800 text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-slate-500">{mod.metricLabel}</div>
                      <div className="text-xs font-mono font-bold text-slate-100">{mod.metricValue}</div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800/90 group-hover:bg-emerald-600 text-slate-200 group-hover:text-white text-xs font-bold transition-colors">
                      <span>Open Class</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </section>
        </main>
      )}

      {/* ===================================================================== */}
      {/* CLASS WORKSPACE VIEWS (BOTS / MARKETS / BRIDGE / RISK)                */}
      {/* ===================================================================== */}
      {activePage !== 'HOME' && (
      <main className="max-w-[1620px] mx-auto p-4 flex-1 w-full space-y-4">
        {/* NEAT SUB-PAGE WAYFINDING & BREADCRUMB BAR */}
        <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow`}>
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setActivePage('HOME')}
              className="flex items-center gap-1 text-emerald-400 hover:underline font-bold"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home Guide</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className={`font-bold uppercase ${currentTheme.textPrimary}`}>
              {activePage === 'BOTS' && 'Class 01 • Autonomous Bot Fleet'}
              {activePage === 'MARKETS' && 'Class 02 • Live Synthetics & Digit Markets'}
              {activePage === 'BRIDGE' && 'Class 03 • Plugin Bridge & Execution Ledger'}
              {activePage === 'RISK' && 'Class 04 • Account Vault & Risk Guardrails'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className={currentTheme.textSecondary}>Next Step:</span>
            {activePage === 'BOTS' && (
              <button
                onClick={() => setActivePage('BRIDGE')}
                className="px-2.5 py-1 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 font-bold flex items-center gap-1"
              >
                <span>Inspect Bridge & Ledger</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            {activePage === 'MARKETS' && (
              <button
                onClick={() => setActivePage('BOTS')}
                className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 font-bold flex items-center gap-1"
              >
                <span>Assign Signal to Bot Fleet</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            {activePage === 'BRIDGE' && (
              <button
                onClick={() => setActivePage('RISK')}
                className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 font-bold flex items-center gap-1"
              >
                <span>Verify Risk Guardrails</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
            {activePage === 'RISK' && (
              <button
                onClick={() => setActivePage('HOME')}
                className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 font-bold flex items-center gap-1"
              >
                <span>Back to Home Hub</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: MARKETS & DIGIT MATRIX */}
        {(activePage === 'MARKETS' || activePage === 'BOTS') && (
        <div className={`${activePage === 'MARKETS' ? 'lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-4' : 'lg:col-span-4 space-y-4 flex flex-col'}`}>
          {/* MARKET WATCHER */}
          <section className={`${activePage === 'MARKETS' ? 'lg:col-span-7' : ''} bg-[#0d1117] border border-slate-800/90 rounded-xl p-4 shadow-xl`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Synthetics & FX Market Watch
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {liveTickStreamActive ? 'WS 1s Ticks' : 'Sim 24/7 Engine'}
              </span>
            </div>

            <div className={`space-y-2 ${activePage === 'MARKETS' ? 'max-h-[560px]' : 'max-h-[380px]'} overflow-y-auto pr-1`}>
              {markets.map((m) => {
                const isSelected = selectedSymbol === m.symbol;
                return (
                  <div
                    key={m.symbol}
                    onClick={() => setSelectedSymbol(m.symbol)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/80 border-emerald-500/50 shadow-md'
                        : 'bg-[#080b10] border-slate-800/70 hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{m.displayName}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            {m.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-slate-100">
                          {m.price.toFixed(m.digits)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.2 rounded font-bold ${
                            m.bias === 'BUY' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                          }`}
                        >
                          {m.bias}
                        </span>
                        <span className="text-slate-400">RSI: {m.rsi}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">{m.accuracy}% Score</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* DIGIT DISTRIBUTION MATRIX */}
          <section className={`${activePage === 'MARKETS' ? 'lg:col-span-5' : ''} bg-[#0d1117] border border-slate-800/90 rounded-xl p-4 shadow-xl`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Last-Digit Distribution (Descriptive Only)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">1HZ100V</span>
            </div>

            <p className="text-[10px] text-slate-500 mb-3">Displayed counts are simulated in simulator mode. A frequency deviation is not proof of a predictive edge.</p>

            <div className="grid grid-cols-5 gap-2">
              {digitsMatrix.map((d) => (
                <div
                  key={d.digit}
                  className={`p-2 rounded-lg border text-center font-mono ${
                    d.pct >= 12
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                      : 'bg-[#080b10] border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="text-[10px] text-slate-500">DIGIT</div>
                  <div className="text-sm font-bold text-white">{d.digit}</div>
                  <div className="text-[10px] mt-0.5">{d.pct}%</div>
                </div>
              ))}
            </div>
          </section>
        </div>
        )}

        {/* CENTER & RIGHT COLUMN: BOTS, POSITIONS & INSPECTOR */}
        {activePage !== 'MARKETS' && (
        <div className={`${activePage === 'BOTS' ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4 flex flex-col`}>
          {/* TOP 4 BOTS CIRCLE GRAPH IN BOT FLEET VIEW */}
          {activePage === 'BOTS' && (
            <TopBotsCircleChart bots={bots} theme={currentTheme} />
          )}

          {activePage === 'BOTS' && (
            <section className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-xl p-4 shadow-xl`}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">MCP Agent Inbox</h2>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Local agents can read bot and market status and send paper ideas for review. Recording a signal never places a broker order.
                  </p>
                </div>
                <span className={`text-[10px] font-mono px-2 py-1 rounded border ${mcpBridgeOnline ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' : 'text-slate-400 bg-slate-800/60 border-slate-700'}`}>
                  {mcpBridgeOnline ? 'LOCAL BRIDGE ONLINE' : 'WAITING FOR LOCAL SERVER'}
                </span>
              </div>
              {mcpProposals.length === 0 ? (
                <div className="text-xs text-slate-500 bg-[#080b10]/70 border border-slate-800 rounded-lg px-3 py-3">
                  No paper proposals are waiting for review.
                </div>
              ) : (
                <div className="space-y-2">
                  {mcpProposals.map((proposal) => (
                    <div key={proposal.id} className="flex flex-wrap items-center justify-between gap-3 bg-[#080b10]/70 border border-slate-800 rounded-lg p-3">
                      <div className="min-w-[220px] flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-cyan-300">{proposal.action} {proposal.symbol}</span>
                          <span className="text-[10px] text-slate-400">{proposal.botName}</span>
                          <span className="text-[10px] text-slate-500">{new Date(proposal.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 break-words">{proposal.rationale}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleMcpProposalDecision(proposal, 'PAPER_LOGGED')} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-200 bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25">
                          Record as paper
                        </button>
                        <button onClick={() => handleMcpProposalDecision(proposal, 'DISMISSED')} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 1. AUTONOMOUS TRADING BOTS (SPACIOUS WORKSPACE) */}
          {activePage === 'BOTS' && (
          <section className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-xl p-5 shadow-xl`}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                    Autonomous Trading Bots Workspace
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Configure fixed stakes, market filters, and per-setup research evidence. Signal scores are not win probabilities.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="text-xs font-mono text-slate-400 bg-[#080b10] px-3 py-1.5 rounded-lg border border-slate-800">
                  Running:{' '}
                  <strong className="text-emerald-400">{bots.filter((b) => b.active).length}</strong> / {bots.length} Bots
                </div>

                <div className="inline-flex rounded-lg bg-[#080b10] p-0.5 border border-slate-800">
                  <button
                    onClick={() => setBotViewLayout('expanded')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                      botViewLayout === 'expanded'
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Spacious 2-Column Workspace"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Spacious</span>
                  </button>
                  <button
                    onClick={() => setBotViewLayout('compact')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                      botViewLayout === 'compact'
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Compact 3-Column Grid"
                  >
                    <LayoutGrid className="w-3 h-3" />
                    <span>Grid</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowNewBotModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Deploy New Bot</span>
                </button>
              </div>
            </div>

            <div
              className={`grid gap-4 ${
                botViewLayout === 'expanded'
                  ? 'grid-cols-1 xl:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-3'
              }`}
            >
              {bots.map((bot) => {
                const isTuningOpen = expandedBotConfigId === bot.id;
                const researchEvidence = { ...createEmptyResearchEvidence(), ...(bot.researchEvidence || {}) };
                const research = evaluateBotResearch(researchEvidence);
                return (
                  <div
                    key={bot.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      bot.active
                        ? 'bg-[#0b121a] border-slate-700/90 shadow-lg'
                        : 'bg-[#080b10]/70 border-slate-800/70 opacity-75'
                    }`}
                  >
                    <div>
                      {/* Bot Card Header */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-slate-700">
                            {bot.id}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {bot.tradesCount} trades
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setExpandedBotConfigId(isTuningOpen ? null : bot.id)
                            }
                            className={`p-1.5 rounded-lg border text-xs transition-colors ${
                              isTuningOpen
                                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                            }`}
                            title="Tune Bot Parameters"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() =>
                              setBots((prev) =>
                                prev.map((b) => (b.id === bot.id ? { ...b, active: !b.active } : b))
                              )
                            }
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                              bot.active
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {bot.active ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                            <span>{bot.active ? 'ACTIVE' : 'PAUSED'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Bot Name & Strategy */}
                      <h3 className="text-sm font-bold text-white mb-1">{bot.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">{bot.strategy}</p>

                      <div className={`mb-3 p-2.5 rounded-lg border ${research.approved ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-mono font-bold uppercase ${research.approved ? 'text-emerald-300' : 'text-amber-300'}`}>
                            {research.approved ? 'Research Gate: Cleared' : 'Trade or Abstain: Abstain'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            OOS {researchEvidence.outOfSampleTrades || 0}/{researchEvidence.minimumSampleTrades || 'set sample'} trades
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] font-mono text-slate-300">
                          <span>Shrunk win {researchEvidence.outOfSampleTrades > 0 ? `${(research.shrunkWinRate * 100).toFixed(1)}%` : 'n.a.'}</span>
                          <span>Break-even {research.breakEvenWinRate !== null ? `${(research.breakEvenWinRate * 100).toFixed(1)}%` : 'n.a.'}</span>
                          <span>Expectancy {researchEvidence.outOfSampleTrades > 0 ? `${research.expectancyR.toFixed(3)}R` : 'n.a.'}</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-slate-400 mt-2">
                          Signal scores are not win probabilities. The held-out win estimate is shrunk toward the matched random baseline; live orders remain blocked until all research checks pass.
                        </p>
                      </div>

                      {/* Assigned Markets Pills */}
                      <div className="mb-3.5">
                        <div className="text-[10px] font-mono uppercase text-slate-500 mb-1.5">
                          Assigned Markets (Click to toggle in tune mode)
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(isTuningOpen ? markets.map((m) => m.symbol) : bot.symbols).map((sym) => {
                            const assigned = bot.symbols.includes(sym);
                            return (
                              <button
                                key={sym}
                                type="button"
                                disabled={!isTuningOpen}
                                onClick={() => isTuningOpen && handleToggleBotSymbol(bot.id, sym)}
                                className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition-colors ${
                                  assigned
                                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                                    : 'bg-[#07090d] border-slate-800 text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                {sym}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quick Parameter Summary Strip */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#070a0f] border border-slate-800/80 mb-3 font-mono text-xs">
                        <div>
                          <div className="text-[9px] uppercase text-slate-500">
                            {executionMode === 'CTRADER_CFD' ? 'Lot Size' : 'WS Stake'}
                          </div>
                          <div className="font-bold text-slate-100">
                            {executionMode === 'CTRADER_CFD'
                              ? `${bot.lotSize} lots`
                              : `$${bot.stakeUsd} (x${bot.multiplier})`}
                          </div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase text-slate-500">Min Signal Score</div>
                          <div className="font-bold text-cyan-300">&ge; {bot.minAccuracy}%</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase text-slate-500">SL / TP</div>
                          <div className="font-bold text-slate-200">
                            {bot.slPips} / {bot.tpPips}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Fine-Tuning Drawer */}
                      {isTuningOpen && (
                        <div className="p-3 rounded-lg bg-[#07090e] border border-cyan-500/30 mb-3 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                              Live Parameter Controls
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteBot(bot.id)}
                              className="flex items-center gap-1 text-[10px] font-mono text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove Bot</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                            <div>
                              <label className="block text-[9px] text-slate-500 uppercase mb-1">
                                {executionMode === 'CTRADER_CFD' ? 'Lots' : 'Stake ($)'}
                              </label>
                              <input
                                type="number"
                                step={executionMode === 'CTRADER_CFD' ? '0.001' : '1'}
                                value={executionMode === 'CTRADER_CFD' ? bot.lotSize : bot.stakeUsd}
                                onChange={(e) =>
                                  handleUpdateBotParam(
                                    bot.id,
                                    executionMode === 'CTRADER_CFD' ? 'lotSize' : 'stakeUsd',
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-cyan-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] text-slate-500 uppercase mb-1">
                                Min Signal Score %
                              </label>
                              <input
                                type="number"
                                min="55"
                                max="99"
                                value={bot.minAccuracy}
                                onChange={(e) =>
                                  handleUpdateBotParam(bot.id, 'minAccuracy', Number(e.target.value))
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-cyan-300 focus:outline-none focus:border-cyan-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] text-slate-500 uppercase mb-1">
                                SL (Pts)
                              </label>
                              <input
                                type="number"
                                value={bot.slPips}
                                onChange={(e) =>
                                  handleUpdateBotParam(bot.id, 'slPips', Number(e.target.value))
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-rose-300 focus:outline-none focus:border-cyan-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] text-slate-500 uppercase mb-1">
                                TP (Pts)
                              </label>
                              <input
                                type="number"
                                value={bot.tpPips}
                                onChange={(e) =>
                                  handleUpdateBotParam(bot.id, 'tpPips', Number(e.target.value))
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-300 focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                          </div>
                          <div className="pt-3 border-t border-slate-800 space-y-2.5">
                            <div>
                              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold">Research Evidence Gate</div>
                              <p className="text-[10px] leading-relaxed text-slate-400 mt-1">
                                Follow backtest → walk-forward → tiny-stake forward test → scale. Enter held-out results for this setup only. Include spread, slippage, and other costs. These entries are operator-reported and are not independently verified by QuantumBridge.
                              </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
                              {[
                                { label: 'Minimum OOS Trades', field: 'minimumSampleTrades', step: 1 },
                                { label: 'OOS Trades', field: 'outOfSampleTrades', step: 1 },
                                { label: 'OOS Wins', field: 'outOfSampleWins', step: 1 },
                                { label: 'Random Baseline Win %', field: 'randomBaselineWinRatePct', step: 0.1 },
                                { label: 'Average Win (R)', field: 'averageWinR', step: 0.01 },
                                { label: 'Average Loss (R)', field: 'averageLossR', step: 0.01 },
                                { label: 'Cost / Trade (R)', field: 'costPerTradeR', step: 0.01 },
                                { label: 'Required Edge Margin (R)', field: 'requiredEdgeR', step: 0.01 }
                              ].map(({ label, field, step }) => (
                                <label key={field} className="block text-slate-500 uppercase">
                                  {label}
                                  <input
                                    type="number"
                                    min="0"
                                    step={step}
                                    value={researchEvidence[field]}
                                    onChange={(e) => handleUpdateBotResearch(bot.id, field, Math.max(0, Number(e.target.value) || 0))}
                                    className="mt-1 w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 focus:outline-none focus:border-amber-500"
                                  />
                                </label>
                              ))}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-300">
                              {[
                                { field: 'costsIncluded', label: 'Costs are included in held-out results' },
                                { field: 'randomBaselineMeasured', label: 'Measured random baseline with identical costs and sizing' },
                                { field: 'backtestPassed', label: 'Backtest completed against a stated hypothesis' },
                                { field: 'walkForwardPassed', label: 'Passed walk-forward checks on unseen windows' },
                                { field: 'forwardTestPassed', label: 'Passed a forward test at tiny stakes' },
                                { field: 'drawdownWithinRange', label: 'Forward drawdown stayed within tested range' }
                              ].map(({ field, label }) => (
                                <label key={field} className="flex items-start gap-2 rounded bg-slate-900/70 p-2">
                                  <input
                                    type="checkbox"
                                    checked={researchEvidence[field] === true}
                                    onChange={(e) => handleUpdateBotResearch(bot.id, field, e.target.checked)}
                                    className="mt-0.5 accent-amber-500"
                                  />
                                  <span>{label}</span>
                                </label>
                              ))}
                            </div>
                            <div className={`text-[10px] font-mono ${research.approved ? 'text-emerald-300' : 'text-amber-300'}`}>
                              {research.approved
                                ? `Gate cleared: shrunk expectancy ${research.expectancyR.toFixed(3)}R beats the matched baseline by the required margin.`
                                : research.missingSample
                                ? 'Gate closed: define a minimum sample and enter enough held-out trades.'
                                : 'Gate closed: positive expectancy, baseline outperformance, edge margin, cost, backtest, walk-forward, forward, and drawdown checks are required.'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bot Performance Footer */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="text-slate-500 text-[10px]">APP-MODELED P&L</div>
                        <div
                          className={`text-sm font-bold ${
                            bot.realizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {bot.realizedPnl >= 0 ? '+' : ''}${bot.realizedPnl.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-500 text-[10px]">RESEARCH</div>
                        <div className={`font-semibold ${research.approved ? 'text-emerald-300' : 'text-amber-300'}`}>{research.approved ? 'CLEARED' : 'ABSTAIN'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-500 text-[10px]">SHRUNK OOS WIN</div>
                        <div className="text-sm font-bold text-slate-100">{researchEvidence.outOfSampleTrades > 0 ? `${(research.shrunkWinRate * 100).toFixed(1)}%` : 'n.a.'}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          )}

          {/* 2. LIVE POSITIONS LEDGER */}
          {(activePage === 'BOTS' || activePage === 'BRIDGE') && (
          <section className="bg-[#0d1117] border border-slate-800/90 rounded-xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Live Execution Ledger & Open Positions ({positions.length})
                </h2>
              </div>
              <div className="text-xs font-mono">
                Floating P&L:{' '}
                <span
                  className={`font-bold ${
                    totalFloatingPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {totalFloatingPnl >= 0 ? '+' : ''}${totalFloatingPnl.toFixed(2)}
                </span>
              </div>
            </div>

            {positions.length === 0 ? (
              <div className="p-7 text-center text-slate-500 text-xs font-mono">
                No active positions. A signal score alone does not establish an edge; live automation requires a cleared per-setup research gate.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-[10px] font-mono uppercase text-slate-500 bg-[#0a0d12]">
                      <th className="py-2 px-3.5">Ticket / Bot</th>
                      <th className="py-2 px-3">Contract</th>
                      <th className="py-2 px-3">Vol / Stake</th>
                      <th className="py-2 px-3">Entry → Spot</th>
                      <th className="py-2 px-3 text-right">Net P&L</th>
                      <th className="py-2 px-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {enrichedPositions.map((pos) => (
                      <tr key={pos.id} className="hover:bg-slate-800/25">
                        <td className="py-2.5 px-3.5">
                          <div className="font-mono text-[11px] font-semibold text-slate-200">
                            #{pos.id}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                            {pos.botName}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-100">{pos.ctraderName}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                pos.side === 'BUY'
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : 'bg-rose-500/15 text-rose-400'
                              }`}
                            >
                              {pos.side}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">
                              {pos.contractType}
                            </span>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 font-mono text-slate-300">
                          {pos.contractType === 'CFD' ? `${pos.volume} lots` : `$${pos.volume}`}
                        </td>

                        <td className="py-2.5 px-3 font-mono">
                          <div className="text-slate-200">
                            {pos.entryPrice.toFixed(pos.digits)} →{' '}
                            <span className="text-cyan-400">{pos.currentPrice.toFixed(pos.digits)}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {pos.pips >= 0 ? `+${pos.pips}` : pos.pips} pts ({pos.accuracy}% acc)
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-right font-mono">
                          <div
                            className={`font-bold ${
                              pos.floatingPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {pos.floatingPnl >= 0 ? '+' : ''}${pos.floatingPnl.toFixed(2)}
                          </div>
                        </td>

                        <td className="py-2.5 px-3.5 text-right">
                          <button
                            onClick={() => handleClosePosition(pos.id)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 text-[11px] font-mono font-bold transition-colors"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          )}

          {/* 3. cTRADER PLUGIN JSON PAYLOAD & EVENT LOG INSPECTOR (BRIDGE PAGE) */}
          {activePage === 'BRIDGE' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 bg-[#0d1117] border border-slate-800/90 rounded-xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Plugin Transmission Stream
                  </h3>
                </div>
                <button
                  onClick={() => setShowPluginModal(true)}
                  className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>View C# Source</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {logs.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedLogId(item.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      selectedLog?.id === item.id
                        ? 'bg-emerald-500/10 border-emerald-500/50'
                        : 'bg-[#080b10] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span className="text-emerald-400 font-bold">{item.type}</span>
                      <span>{item.time}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-100">{item.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.summary}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#0d1117] border border-slate-800/90 rounded-xl p-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      JSON Payload Shared with Execution Plugin
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {selectedLog?.id}
                  </span>
                </div>
                <pre className="p-3.5 rounded-xl bg-[#07090d] border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[290px]">
                  {JSON.stringify(selectedLog?.payload || {}, null, 2)}
                </pre>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Endpoint: {ctraderEndpoint}</span>
                <span className="text-emerald-400">AccessRights.FullAccess Ready</span>
              </div>
            </div>
          </section>
          )}

          {/* 4. ACCOUNT VAULT & RISK GUARDRAILS WORKSPACE (RISK PAGE) */}
          {activePage === 'RISK' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 bg-[#0d1117] border border-slate-800/90 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">OAuth 2.0 & Account Vault</h3>
                    <p className="text-[11px] text-slate-400">Manage Deriv OAuth accounts and registered App ID</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDerivAppSettingsModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold"
                >
                  App ID Settings ({derivAppId})
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080b10] border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Connection State:</span>
                  <span
                    className={`font-bold ${
                      connectionStatus === 'LIVE_CONNECTED' ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {connectionStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Login ID:</span>
                  <span className="text-white font-bold">{activeAccountId || 'Offline Simulator'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">
                    {connectionStatus === 'LIVE_CONNECTED' ? 'Real Account Balance:' : 'Account Balance:'}
                  </span>
                  <span className="text-emerald-300 font-extrabold">
                    {hideBalance
                      ? '••••••••'
                      : `${accountBalance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} ${accountCurrency}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Live Account Equity:</span>
                  <span className="text-cyan-300 font-bold">
                    {hideBalance
                      ? '••••••••'
                      : `${accountEquity.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })} ${accountCurrency}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Authorized Redirect URI:</span>
                  <span className="text-cyan-300 truncate max-w-[240px]">{oauthRedirectUri}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleOAuthLogin}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                >
                  <span>Redirect to OAuth 2.0 Login</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowConnectModal(true)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold"
                >
                  Deriv OAuth / Local Bridge
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#0d1117] border border-slate-800/90 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Automated Capital Protection Guardrails</h3>
                  <p className="text-[11px] text-slate-400">Hard stops enforced prior to plugin order transmission</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 font-mono text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Daily Max Loss ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={dailyMaxLossUsd}
                    onChange={(e) => setDailyMaxLossUsd(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-rose-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Realized Drawdown Limit ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={maxSessionDrawdownUsd}
                    onChange={(e) => setMaxSessionDrawdownUsd(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-rose-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Max Open Trades</label>
                  <input
                    type="number"
                    min="1"
                    value={maxConcurrentPositions}
                    onChange={(e) => setMaxConcurrentPositions(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-cyan-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Max Risk / Trade (%)</label>
                  <input
                    type="number"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={perTradeMaxRiskPct}
                    onChange={(e) => setPerTradeMaxRiskPct(Math.min(2, Math.max(0.5, Number(e.target.value) || 1)))}
                    className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-emerald-300 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Fixed stake only. Live automation also requires positive daily-loss and realized-drawdown limits. Per-trade risk is capped at 0.5–2%.
                </span>
                <button
                  onClick={handleEmergencyKillSwitch}
                  className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0"
                >
                  Trigger Kill Switch
                </button>
              </div>
            </div>
          </section>
          )}
        </div>
        )}
        </div>
      </main>
      )}

      {/* APP ID & OAUTH SETTINGS MANAGEMENT MODAL */}
      {showDerivAppSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-slate-700 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#111620]">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    App ID, Scopes & OAuth Settings Console
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Configure your registered application credentials and redirect URIs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDerivAppSettingsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppConfig} className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-100/90 text-[11px] leading-relaxed">
                Ensure your registered <strong>Redirect URL</strong> in your OAuth developer console matches the URI below so authorization tokens return securely to QuantumBridge.
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-slate-400 mb-1.5">
                  Saved App Presets
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {savedAppConfigs.map((cfg) => (
                    <button
                      key={cfg.appId}
                      type="button"
                      onClick={() => {
                        setDerivAppId(cfg.appId);
                        setCustomAppName(cfg.name);
                      }}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs border transition-all ${
                        derivAppId === cfg.appId
                          ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                          : 'bg-[#080b10] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cfg.name} (ID: {cfg.appId})
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono uppercase text-[10px] text-slate-400 mb-1.5">
                    Deriv OAuth App ID
                  </label>
                  <input
                    type="text"
                    required
                    value={derivAppId}
                    onChange={(e) => setDerivAppId(e.target.value)}
                    className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase text-[10px] text-slate-400 mb-1.5">
                    App Name / Description
                  </label>
                  <input
                    type="text"
                    value={customAppName}
                    onChange={(e) => setCustomAppName(e.target.value)}
                    className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-slate-400 mb-1.5">
                  Custom Redirect URI (Override if hosting on custom domain)
                </label>
                <input
                  type="text"
                  placeholder={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : ''}
                  value={customRedirectUriInput}
                  onChange={(e) => setCustomRedirectUriInput(e.target.value)}
                  className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-slate-400 mb-1.5">
                  OAuth Scopes Required
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  {Object.keys(oauthScopes).map((sc) => (
                    <label key={sc} className="flex items-center gap-2 p-2 rounded-lg bg-[#080b10] border border-slate-800 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={oauthScopes[sc]}
                        onChange={(e) => setOauthScopes({ ...oauthScopes, [sc]: e.target.checked })}
                        className="accent-cyan-500"
                      />
                      <span className="capitalize">{sc.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">Authorization Code + PKCE • trade scope required</span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDerivAppSettingsModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-950/50"
                  >
                    Save & Apply App ID
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONNECT REAL ACCOUNT MODAL */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#111620]">
              <div className="flex items-center gap-2.5">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Connect Deriv OAuth 2.0 Account
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Sign in with the registered OAuth App ID; no pasted API token is used.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConnectModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 pt-3 border-b border-slate-800 flex flex-wrap gap-2 bg-[#0a0d12]">
              <button
                onClick={() => { setConnectTab('oauth'); setAuthError(''); }}
                className={`px-3.5 py-2 rounded-t-lg text-xs font-semibold border-t border-x transition-colors flex items-center gap-1.5 ${
                  connectTab === 'oauth'
                    ? 'bg-[#0d1117] border-slate-700 text-cyan-300'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>1. OAuth2 Redirect Login</span>
              </button>
              <button
                onClick={() => { setConnectTab('jarvis'); setJarvisError(''); }}
                className={`px-3.5 py-2 rounded-t-lg text-xs font-semibold border-t border-x transition-colors flex items-center gap-1.5 ${
                  connectTab === 'jarvis'
                    ? 'bg-[#0d1117] border-slate-700 text-emerald-300'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>2. JARVIS Link</span>
              </button>
              <button
                onClick={() => { setConnectTab('ctrader'); setAuthError(''); }}
                className={`px-3.5 py-2 rounded-t-lg text-xs font-semibold border-t border-x transition-colors flex items-center gap-1.5 ${
                  connectTab === 'ctrader'
                    ? 'bg-[#0d1117] border-slate-700 text-amber-300'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>3. Local Bridge</span>
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {connectTab === 'oauth' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-100/90 text-xs leading-relaxed">
                    Sign in on Deriv using the registered Web-based app. The app uses OAuth 2.0 with PKCE; never paste an API token here.
                  </div>
                  <div>
                    <label className="block font-mono uppercase text-[10px] text-slate-400 mb-1.5">Deriv App ID</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={derivAppId}
                      onChange={(e) => setDerivAppId(e.target.value)}
                      placeholder="Enter the App ID from Deriv Developers"
                      className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-cyan-200 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block font-mono uppercase text-[10px] text-slate-400 mb-1.5">Registered Redirect URL</label>
                    <div className="w-full bg-[#080b10] border border-slate-800 rounded-lg px-3 py-2 text-slate-300 font-mono text-[11px] break-all">{oauthRedirectUri}</div>
                    <p className="text-[10px] text-slate-500 mt-1">Add this exact URL to the app’s Redirect URLs in Deriv Developers.</p>
                  </div>
                  {authError && <div role="alert" className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs">{authError}</div>}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleOAuthLogin}
                      disabled={oauthConnecting}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-bold transition-colors shadow-lg shadow-cyan-950/50"
                    >
                      <span>{oauthConnecting ? 'Connecting…' : 'Continue to Deriv Login'}</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {connectTab === 'jarvis' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-100/90 text-xs leading-relaxed">
                    JARVIS Workshop supplies research signals. QuantumBridge remains the Deriv order executor. Signals never trade automatically: request a quote, review it, then explicitly confirm the order.
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#080b10] border border-slate-800 p-3">
                    <div>
                      <div className="text-xs font-bold text-white">JARVIS Workshop</div>
                      <div className="text-[10px] text-slate-400">
                        {jarvisConnected
                          ? `Signal feed ${jarvisSnapshot?.market_connected ? 'online' : 'waiting for market data'} • paper-only`
                          : 'Not connected • start JARVIS Workshop on localhost:5000'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={refreshJarvisSignals}
                        disabled={jarvisRefreshing}
                        className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-60 text-white text-xs font-bold"
                      >
                        {jarvisRefreshing ? 'Checking…' : jarvisConnected ? 'Refresh Signals' : 'Connect JARVIS'}
                      </button>
                      <button
                        type="button"
                        onClick={openJarvisDerivLogin}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                      >
                        JARVIS Deriv Login
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#080b10] border border-slate-800 text-[11px] text-slate-400">
                    JARVIS Deriv account: <span className={jarvisDerivStatus?.connected ? 'text-emerald-300' : 'text-slate-300'}>
                      {jarvisDerivStatus?.connected
                        ? `connected (${jarvisDerivStatus.accounts?.length || 0} Options account(s))`
                        : 'not signed in'}
                    </span>
                    <div className="mt-1">For the JARVIS login page, register this additional redirect URL: <span className="text-cyan-300 font-mono">http://localhost:5000/deriv/oauth/callback</span></div>
                    <div className="mt-1">To place a trade, QuantumBridge itself must also have an active Deriv OAuth session.</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className="text-[10px] text-slate-400">Stake ({accountCurrency})
                      <input type="number" min="0.01" step="0.01" value={jarvisStake} onChange={(e) => setJarvisStake(e.target.value)} placeholder="Enter stake" className="mt-1 w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-white" />
                    </label>
                    <label className="text-[10px] text-slate-400">Duration (ticks)
                      <input type="number" min="1" step="1" value={jarvisDurationTicks} onChange={(e) => setJarvisDurationTicks(e.target.value)} placeholder="Enter ticks" className="mt-1 w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-white" />
                    </label>
                    <label className="text-[10px] text-slate-400">Multiplier
                      <input type="number" min="1" step="1" value={jarvisMultiplier} onChange={(e) => setJarvisMultiplier(e.target.value)} placeholder="Enter multiplier" className="mt-1 w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-white" />
                    </label>
                  </div>

                  {jarvisError && <div role="alert" className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs">{jarvisError}</div>}
                  {jarvisTradeStatus && <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-100 text-xs">{jarvisTradeStatus}</div>}

                  {jarvisProposal && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="text-xs font-bold text-amber-100">Review Deriv quote: {jarvisProposal.signal.signal} {jarvisProposal.signal.symbol}</div>
                      <div className="text-[11px] text-slate-300">Cost: {jarvisProposal.proposal.ask_price} {accountCurrency} • Potential payout: {jarvisProposal.proposal.payout ?? 'See Deriv quote'}</div>
                      <button type="button" onClick={confirmJarvisTrade} className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold">
                        Confirm Buy on {connectionStatus === 'LIVE_CONNECTED' ? 'Live' : 'Demo'} Account
                      </button>
                    </div>
                  )}

                  {jarvisSnapshot?.signals?.length > 0 ? (
                    <div className="space-y-2">
                      {jarvisSnapshot.signals.map((signal) => {
                        const canReview = signal.gate === 'PASS' && ['BUY', 'SELL'].includes(signal.signal);
                        return (
                          <div key={signal.symbol} className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#080b10] border border-slate-800">
                            <div>
                              <div className="text-xs font-bold text-white">{signal.symbol} · <span className={signal.signal === 'BUY' ? 'text-emerald-300' : signal.signal === 'SELL' ? 'text-rose-300' : 'text-slate-400'}>{signal.signal}</span></div>
                              <div className="text-[10px] text-slate-400">Gate {signal.gate} · Agreement {Number(signal.agreement || 0).toFixed(1)}% · Score {signal.score ?? 0}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{signal.reason || 'No reason supplied'}</div>
                            </div>
                            <button type="button" disabled={!canReview || !jarvisConnected} onClick={() => requestJarvisTradeProposal(signal)} className="px-3 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 disabled:opacity-40 text-white text-xs font-bold">
                              Request Quote
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-[#080b10] border border-slate-800 text-xs text-slate-400">Connect to JARVIS to load its current signals.</div>
                  )}
                </div>
              )}

              {/* TAB 2: LOCAL PLUGIN BRIDGE */}
              {connectTab === 'ctrader' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-100/90 text-[11px] leading-relaxed">
                    Connects to local desktop execution plugin on port 8765.
                  </div>
                  <div>
                    <label className="block font-mono uppercase text-[10px] text-slate-400 mb-1.5">
                      Listener URL
                    </label>
                    <input
                      type="text"
                      value={ctraderEndpoint}
                      onChange={(e) => setCtraderEndpoint(e.target.value)}
                      className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-mono focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={connectLocalCTraderBridge}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors"
                    >
                      <Link2 className="w-4 h-4" />
                      <span>Handshake with Local Plugin</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PLUGIN CODE MODAL */}
      {showPluginModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#111620]">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">QuantumBridge C# Execution Plugin</h3>
                  <p className="text-xs text-slate-400">Local execution bridge source</p>
                </div>
              </div>
              <button
                onClick={() => setShowPluginModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-2.5 border-b border-slate-800 flex items-center justify-between bg-[#0d1117]">
              <span className="text-xs font-mono text-slate-300">QuantumBridgeExecutor.cs</span>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-medium transition-colors"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Source</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-auto p-5 bg-[#07090d] font-mono text-xs leading-relaxed">
              <pre className="text-slate-200">
                {DERIV_CTRADER_PLUGIN_CS}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* DEPLOY NEW BOT MODAL */}
      {showNewBotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#111620]">
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Deploy New Algorithmic Trading Bot</h3>
                  <p className="text-[11px] text-slate-400">
                    Add a dedicated strategy instance to your QuantumBridge workspace
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewBotModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewBot} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-mono uppercase text-[10px] text-slate-400 mb-1.5">
                  Bot Instance Name
                </label>
                <input
                  type="text"
                  required
                  value={newBotForm.name}
                  onChange={(e) => setNewBotForm({ ...newBotForm, name: e.target.value })}
                  className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-slate-400 mb-1.5">
                  Strategy Description
                </label>
                <input
                  type="text"
                  value={newBotForm.strategy}
                  onChange={(e) => setNewBotForm({ ...newBotForm, strategy: e.target.value })}
                  className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[10px] text-slate-400 mb-1.5">
                  Target Markets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {markets.map((m) => {
                    const selected = newBotForm.symbols.includes(m.symbol);
                    return (
                      <button
                        key={m.symbol}
                        type="button"
                        onClick={() => {
                          const exists = newBotForm.symbols.includes(m.symbol);
                          setNewBotForm({
                            ...newBotForm,
                            symbols: exists
                              ? newBotForm.symbols.filter((s) => s !== m.symbol)
                              : [...newBotForm.symbols, m.symbol]
                          });
                        }}
                        className={`px-2.5 py-1 rounded-md font-mono text-[11px] border transition-colors ${
                          selected
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                            : 'bg-[#080b10] border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {m.symbol}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div>
                  <label className="block uppercase text-[10px] text-slate-400 mb-1">
                    CFD Lot Size
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={newBotForm.lotSize}
                    onChange={(e) => setNewBotForm({ ...newBotForm, lotSize: Number(e.target.value) })}
                    className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] text-slate-400 mb-1">
                    WS Stake ($)
                  </label>
                  <input
                    type="number"
                    value={newBotForm.stakeUsd}
                    onChange={(e) => setNewBotForm({ ...newBotForm, stakeUsd: Number(e.target.value) })}
                    className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] text-slate-400 mb-1">
                    Min Acc (%)
                  </label>
                  <input
                    type="number"
                    value={newBotForm.minAccuracy}
                    onChange={(e) => setNewBotForm({ ...newBotForm, minAccuracy: Number(e.target.value) })}
                    className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-2.5 py-1.5 text-cyan-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] text-slate-400 mb-1">
                    TP (Pts)
                  </label>
                  <input
                    type="number"
                    value={newBotForm.tpPips}
                    onChange={(e) => setNewBotForm({ ...newBotForm, tpPips: Number(e.target.value) })}
                    className="w-full bg-[#080b10] border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewBotModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/50"
                >
                  Deploy Bot Instance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SETTINGS & THEMES MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#111620]">
              <div className="flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Platform Settings & Interface Themes
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Customize your visual workspace palette and live execution defaults
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 text-xs max-h-[82vh] overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-mono uppercase font-bold tracking-wider text-slate-200">
                    Select Command Center Theme ({Object.keys(APP_THEMES).length} Available)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(APP_THEMES).map((themeItem) => {
                    const isSelected = activeThemeKey === themeItem.id;
                    return (
                      <button
                        key={themeItem.id}
                        type="button"
                        onClick={() => {
                          setActiveThemeKey(themeItem.id);
                          triggerToast('Theme Applied', `Switched interface to ${themeItem.name}`, 'emerald');
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-400 shadow-lg shadow-emerald-950/40'
                            : 'bg-[#080b10] border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-bold text-white text-xs">{themeItem.name}</span>
                          <div className="flex items-center gap-1">
                            {themeItem.swatch.map((hex, i) => (
                              <span
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-white/20"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                          {themeItem.description}
                        </p>
                        <div className="text-[10px] font-mono font-bold">
                          {isSelected ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> ACTIVE THEME
                            </span>
                          ) : (
                            <span className="text-slate-500">Click to activate</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="font-mono uppercase font-bold tracking-wider text-slate-200">
                  Execution & Fleet Summary
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-[#080b10] border border-slate-800">
                    <div className="text-[10px] text-slate-500">ACTIVE BOT INSTANCES</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">
                      {activeBotsCount} / {bots.length} Bots
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#080b10] border border-slate-800">
                    <div className="text-[10px] text-slate-500">REGISTERED APP ID</div>
                    <div className="text-sm font-bold text-cyan-300 mt-0.5">{derivAppId}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#080b10] border border-slate-800">
                    <div className="text-[10px] text-slate-500">ANTI-SPIKE GUARD</div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5">
                      {autoCloseBeforeSpike ? 'ENABLED' : 'DISABLED'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

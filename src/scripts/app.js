/**
 * HELLO WORLD APPLICATION
 *
 * A broadcast-themed interactive experience with cinematic animations,
 * adaptive audio, and responsive UI elements. This module orchestrates
 * the full experience lifecycle, from initialization through user interaction
 * to state replay and visual effects.
 *
 * Responsibilities:
 * - DOM query and state management
 * - Audio synthesis and scheduling
 * - Animation and visual effect orchestration
 * - Event logging and replay
 * - Accessibility (captions, motion preferences)
 *
 * Dependencies:
 * - Web Audio API (audio synthesis)
 * - GSAP / requestAnimationFrame (animations)
 * - DOM manipulation
 *
 * DO NOT directly mutate styles on elements outside of established
 * update patterns (setMode, cameraCue, animateValue) — this ensures
 * all state changes remain observable and traceable in event logs.
 */

// ============================================================================
// CONSTANTS: Application Configuration
// ============================================================================
// WHY: Named constants prevent magic numbers and improve maintainability.
// Update these to tune responsiveness, timing, and visual feedback.

const CONFIG = {
  // UI Element Query Selectors
  DOM: {
    headline: '#headline',
    eventMapNodes: '.globe-point',
    viewerCount: '#viewerCount',
    countryCount: '#countryCount',
    mentionCount: '#mentionCount',
    subhead: '#subhead',
    liveFeed: '#liveFeed',
    tickerTrack: '#tickerTrack',
    timestamp: '#timestamp',
    stage: '.stage',
    mapStatus: '#mapStatus',
    heatFill: '#heatFill',
    heatValue: '#heatValue',
    mapConnections: '#mapConnections',
    modeChips: '.mode-chip[data-mode]',
    audioCaptions: '#audioCaptions',
    // Buttons
    launchButton: '#launchButton',
    refreshButton: '#refreshButton',
    timelineButton: '#timelineButton',
    replayButton: '#replayButton',
    stormModeButton: '#stormModeButton',
    gravityModeButton: '#gravityModeButton',
    captionsToggle: '#captionsToggle',
    // Intro gate
    introGate: '#introGate',
    goLiveButton: '#goLiveButton',
    // Easter egg guide
    easterGuideToggle: '#easterGuideToggle',
    easterGuide: '#easterGuide',
    easterGuideClose: '#easterGuideClose',
    secretStormButton: '#secretStormButton',
    secretZeroButton: '#secretZeroButton',
    secretTimelineButton: '#secretTimelineButton',
    secretReplayButton: '#secretReplayButton',
    secretViralButton: '#secretViralButton',
    // Viral alert overlay
    viralOverlay: '#viralOverlay',
    viralCounter: '#viralCounter',
    // Broadcast countdown overlay
    countdownOverlay: '#countdownOverlay',
    countdownNumber: '#countdownNumber',
    countdownRingFill: '#countdownRingFill'
  },

  // Audio Configuration
  AUDIO: {
    masterGainValue: 0.17,
    echoDelayTime: 0.16,
    echoDelayDuration: 0.45,
    echoFeedbackGain: 0.2,
    hoverToneDuration: 0.5,
    hoverToneGain: 0.08,
    hoverToneHarmonicGain: 0.03,
    hoverToneGainDecay: 0.42,
    clickChordDuration: 0.72,
    beatPulseBaseFreq: 92,
    beatPulseDuration: 0.24,
    beatPulseGain: 0.05,
    beatPulseHighFreqMultiplier: 1.5,
    beatsPerMinuteBase: 68,
    beatsPerMinuteHeatCoeff: 0.65,
    beatsPerMinuteActivityCoeff: 12,
    beatMinInterval: 220,
    hoverScaleFrequencies: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]
  },

  // Viral Alert Configuration
  VIRAL: {
    heatThreshold: 88,
    autoTriggerChance: 0.15,
    cooldownMs: 45000,
    displayDurationMs: 5200,
    counterTarget: 12450000,
    counterDurationMs: 4000
  },

  // Animation & Timing Configuration
  ANIMATION: {
    idleTimeoutMs: 6500,
    idleAttentionIntervalMs: 1900,
    metricsAnimationDuration: 900,
    cameraCueDefaultDuration: 700,
    captionDisplayDuration: 1800,
    launchCameraDuration: 900,
    launchDelay: 2200,
    orbitModeCameraDuration: 1200,
    orbitModeDelay: 2600,
    stormModeDelay: 2300,
    timelineGlyphDelay: 650,
    timelineGlyphIterations: 3,
    sunriseModeDelay: 1700,
    timelineFinalDuration: 2400,
    shockParticleCount: 8,
    shockParticleDuration: 560,
    burstParticleCount: 28,
    burstDuration: 1000,
    quantumRippleDuration: 980,
    quantumGhostCount: 7,
    quantumGhostDuration: 980,
    glyphWaveTimeout: 620,
    glyphRenderDelayMs: 150,
    hoverSparkMinInterval: 90,
    hoverToneMinInterval: 140,
    clickAnimationTimeout: 1320,
    idleCallAnimationTimeout: 1320
  },

  // Metric & Heat Engine Configuration
  METRICS: {
    viewerTargetRange: [18000, 45000],
    countryTargetRange: [42, 132],
    mentionTargetRange: [900, 5200],
    // WHY: Heat calculation weights total 1.0 and are tuned to emphasize mentions.
    heatViewerWeight: 0.42,
    heatCountryWeight: 0.18,
    heatMentionWeight: 0.4,
    heatMaxValue: 100
  },

  // UI & Presentation Configuration
  UI: {
    headlineRenderChance: 0.35,
    maxLiveFeedItems: 6,
    maxEventLogEntries: 140,
    tickerGeneratedCount: 3,
    feedRefreshIntervalMs: 5500,
    pointerMoveSensitivity: 22,
    glyphHoverSensitivity: 0.09,
    glyphMoveSensitivity: 0.12,
    glyphTiltMax: 18,
    glyphTiltDegrees: 0.5,
    shockParticleRadius: 25,
    shockParticleRadiusVariance: 55,
    burstParticleRadius: 100,
    burstParticleRadiusVariance: 260,
    quantumDistanceMin: 90,
    quantumDistanceVariance: 160,
    quantumRotationMax: 360
  },

  // Activity Level Management
  ACTIVITY: {
    registrationBoost: 0.4,
    maxActivityLevel: 2.6,
    idleDecayRate: 0.12
  }
};

// ============================================================================
// STATE: Application Runtime State
// ============================================================================

let headline = null; // Cached DOM ref
let headlineWords = [];
let eventMapNodes = [];

// DOM element cache (initialized on first query)
const domCache = {
  headline: null,
  viewerCount: null,
  countryCount: null,
  mentionCount: null,
  subhead: null,
  liveFeed: null,
  tickerTrack: null,
  timestamp: null,
  stage: null,
  mapStatus: null,
  easterGuideToggle: null,
  easterGuide: null,
  easterGuideClose: null,
  heatFill: null,
  heatValue: null,
  mapConnections: null,
  modeChips: [],
  audioCaptions: null,
  // Buttons
  launchButton: null,
  refreshButton: null,
  timelineButton: null,
  replayButton: null,
  stormModeButton: null,
  gravityModeButton: null,
  captionsToggle: null,
  // Control containers
  introGate: null,
  goLiveButton: null,
  secretStormButton: null,
  secretZeroButton: null,
  secretTimelineButton: null,
  secretReplayButton: null,
  secretViralButton: null,
  // Viral alert
  viralOverlay: null,
  viralCounter: null,
  // Broadcast countdown
  countdownOverlay: null,
  countdownNumber: null,
  countdownRingFill: null
};

// ============================================================================
// CONTENT: Static copy and variation pools
// ============================================================================

const CONTENT = {
  headlineVariants: [
    ['Hello', 'World', 'Breaks', 'The Feed'],
    ['Signal', 'Rises', 'Across', 'The Planet'],
    ['One Line', 'Of Code', 'Goes', 'Prime Time'],
    ['Broadcast', 'Level', 'Hello', 'World']
  ],

  subheads: [
    'The internet asked for a simple greeting. It got a full front-page moment.',
    'One line of code became a global broadcast in under 60 seconds.',
    'What started as a demo now feels like a season premiere.'
  ],

  feedPool: [
    'Commentators label this the first cinematic hello world rollout.',
    'Analysts report developers replaying the reveal sequence on loop.',
    'Crowd reaction remains unusually high for a single greeting.',
    'Breaking desks mention a 4x increase in hello world searches.',
    'Studios ask whether this app has a behind-the-scenes documentary.'
  ],

  tickerPool: [
    'Developers call this the loudest launch of the year.',
    'Realtime metrics confirm attention spikes worldwide.',
    'Press rooms agree this is not your average hello world.',
    'UI directors praise the bold editorial visual style.'
  ]
};

// ============================================================================
// MODES: Visual theme configuration
// ============================================================================

const MODES = {
  alert: {
    hot: '#ff4f1f',
    warn: '#ffc145',
    cool: '#2fe8ff',
    line: 'Alert Desk is now driving the main broadcast palette.'
  },
  orbit: {
    hot: '#f85f83',
    warn: '#7ec8ff',
    cool: '#70ffc2',
    line: 'Orbit View engaged with high-altitude satellite visuals.'
  },
  sunrise: {
    hot: '#ff7a28',
    warn: '#ffe680',
    cool: '#8bf4ff',
    line: 'Sunrise Show mode enabled with bright editorial tones.'
  }
};

// ============================================================================
// RUNTIME STATE: Mutable application state
// ============================================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const driftingGlyphs = [];
const eventLog = [];

let audioContext = null;
let masterGain = null;
let echoDelay = null;
let echoFeedback = null;
let musicLoopTimer = null;
// WHY: Track the glyph-drift rAF ID so the loop can be cancelled before a
// new one starts, preventing stacked loops if initialize() is ever called twice.
let glyphDriftRafId = null;

let captionsEnabled = true;
let currentMode = 'alert';
let currentHeat = 0;
let activityLevel = 0;
let isTimelineRunning = false;
let isReplaying = false;

let idleTimer = null;
let idleAttentionInterval = null;
let idleModeActive = false;
let idleIndex = 0;

let isEasterGuideOpen = false;
let isViralAlertActive = false;
let lastViralAlertTime = -Infinity;
// WHY: Track the viral counter animation frame so it can be cancelled if the
// alert is dismissed and re-triggered before the previous counter finishes.
let viralCounterRafId = null;
// WHY: Track the feed refresh interval so it can be cleared before a new one
// is set, preventing stacked intervals if initialize() is called more than once.
let feedIntervalId = null;

const metricsState = {
  viewers: 0,
  countries: 0,
  mentions: 0
};

// ============================================================================
// LOGGING & OBSERVABILITY
// ============================================================================
/**
 * Log an application event.
 *
 * Events are timestamped and stored in a bounded ring buffer for replay.
 * Events logged during replay are suppressed to avoid infinite recursion.
 *
 * @param {string} name - Event type identifier (e.g., 'buzz', 'launch', 'mode')
 * @param {object} payload - Event metadata (optional)
 */
const logEvent = (name, payload = {}) => {
  if (isReplaying) {
    return;
  }

  eventLog.push({ t: performance.now(), name, payload });
  while (eventLog.length > CONFIG.UI.maxEventLogEntries) {
    eventLog.shift();
  }
};

/**
 * Guard: Get a cached DOM element or throw.
 *
 * WHY: Explicit guards ensure all DOM queries fail fast if elements
 * are missing, preventing null-reference bugs downstream.
 *
 * @param {string} key - Key in domCache object
 * @returns {HTMLElement} The DOM element
 * @throws {Error} If element not found
 */
const getElement = (key) => {
  const element = domCache[key];
  if (!element) {
    throw new Error(`Required DOM element "${key}" not found.`);
  }
  return element;
};

/**
 * Initialize DOM element cache. Must be called before any interactions.
 *
 * Fail-fast strategy: if critical elements are missing, throw immediately
 * with a clear error. This prevents silent failures at interaction time.
 */
const initializeDOMCache = () => {
  try {
    domCache.headline = document.querySelector(CONFIG.DOM.headline);
    domCache.viewerCount = document.querySelector(CONFIG.DOM.viewerCount);
    domCache.countryCount = document.querySelector(CONFIG.DOM.countryCount);
    domCache.mentionCount = document.querySelector(CONFIG.DOM.mentionCount);
    domCache.subhead = document.querySelector(CONFIG.DOM.subhead);
    domCache.liveFeed = document.querySelector(CONFIG.DOM.liveFeed);
    domCache.tickerTrack = document.querySelector(CONFIG.DOM.tickerTrack);
    domCache.timestamp = document.querySelector(CONFIG.DOM.timestamp);
    domCache.stage = document.querySelector(CONFIG.DOM.stage);
    domCache.mapStatus = document.querySelector(CONFIG.DOM.mapStatus);
    domCache.audioCaptions = document.querySelector(CONFIG.DOM.audioCaptions);
    domCache.heatFill = document.querySelector(CONFIG.DOM.heatFill);
    domCache.heatValue = document.querySelector(CONFIG.DOM.heatValue);
    domCache.mapConnections = document.querySelector(CONFIG.DOM.mapConnections);
    domCache.launchButton = document.querySelector(CONFIG.DOM.launchButton);
    domCache.refreshButton = document.querySelector(CONFIG.DOM.refreshButton);
    domCache.timelineButton = document.querySelector(CONFIG.DOM.timelineButton);
    domCache.replayButton = document.querySelector(CONFIG.DOM.replayButton);
    domCache.stormModeButton = document.querySelector(CONFIG.DOM.stormModeButton);
    domCache.gravityModeButton = document.querySelector(CONFIG.DOM.gravityModeButton);
    domCache.captionsToggle = document.querySelector(CONFIG.DOM.captionsToggle);
    domCache.introGate = document.querySelector(CONFIG.DOM.introGate);
    domCache.goLiveButton = document.querySelector(CONFIG.DOM.goLiveButton);
    domCache.easterGuideToggle = document.querySelector(CONFIG.DOM.easterGuideToggle);
    domCache.easterGuide = document.querySelector(CONFIG.DOM.easterGuide);
    domCache.easterGuideClose = document.querySelector(CONFIG.DOM.easterGuideClose);
    domCache.secretStormButton = document.querySelector(CONFIG.DOM.secretStormButton);
    domCache.secretZeroButton = document.querySelector(CONFIG.DOM.secretZeroButton);
    domCache.secretTimelineButton = document.querySelector(CONFIG.DOM.secretTimelineButton);
    domCache.secretReplayButton = document.querySelector(CONFIG.DOM.secretReplayButton);
    domCache.secretViralButton = document.querySelector(CONFIG.DOM.secretViralButton);
    domCache.viralOverlay = document.querySelector(CONFIG.DOM.viralOverlay);
    domCache.viralCounter = document.querySelector(CONFIG.DOM.viralCounter);
    domCache.countdownOverlay = document.querySelector(CONFIG.DOM.countdownOverlay);
    domCache.countdownNumber = document.querySelector(CONFIG.DOM.countdownNumber);
    domCache.countdownRingFill = document.querySelector(CONFIG.DOM.countdownRingFill);
    domCache.modeChips = Array.from(document.querySelectorAll(CONFIG.DOM.modeChips));

    // Cache event map nodes
    eventMapNodes = Array.from(document.querySelectorAll(CONFIG.DOM.eventMapNodes));

    // Ensure required elements are present.
    ['headline', 'liveFeed', 'introGate', 'stage', 'audioCaptions'].forEach((key) => {
      if (!domCache[key]) {
        throw new Error(`Critical DOM element "${key}" not found.`);
      }
    });
  } catch (error) {
    console.error('DOM initialization failed:', error);
    throw error;
  }
};

// Update references after cache initialization
const getHeadlineRef = () => domCache.headline;
const getViewerCountRef = () => domCache.viewerCount;
const getCountryCountRef = () => domCache.countryCount;
const getMentionCountRef = () => domCache.mentionCount;
const getSubheadRef = () => domCache.subhead;
const getLiveFeedRef = () => domCache.liveFeed;
const getTickerTrackRef = () => domCache.tickerTrack;
const getTimestampRef = () => domCache.timestamp;
const getStageRef = () => domCache.stage;
const getMapStatusRef = () => domCache.mapStatus;
const getAudioCaptionsRef = () => domCache.audioCaptions;
const getHeatFillRef = () => domCache.heatFill;
const getHeatValueRef = () => domCache.heatValue;

/**
 * Initialize the map connection lines between cities.
 * Creates SVG lines that connect map nodes in a network pattern.
 */
const initializeMapConnections = () => {
  const svg = domCache.mapConnections;
  if (!svg || !eventMapNodes.length) return;

  // Clear existing connections
  svg.innerHTML = '';

  // Create connections between nearby nodes (simplified network)
  const connections = [
    [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4], [4, 5], [5, 6], [6, 7]
  ];

  connections.forEach(([from, to]) => {
    if (from >= eventMapNodes.length || to >= eventMapNodes.length) return;

    const fromNode = eventMapNodes[from];
    const toNode = eventMapNodes[to];

    const fromRect = fromNode.getBoundingClientRect();
    const toRect = toNode.getBoundingClientRect();
    const mapRect = svg.getBoundingClientRect();

    const x1 = fromRect.left + fromRect.width / 2 - mapRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - mapRect.top;
    const x2 = toRect.left + toRect.width / 2 - mapRect.left;
    const y2 = toRect.top + toRect.height / 2 - mapRect.top;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.classList.add('connection-line');

    svg.appendChild(line);
  });
};

// ============================================================================
// UTILITIES: Primitive operations
// ============================================================================

/**
 * Delay execution. Returns a promise that resolves after ms milliseconds.
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Format a number for display with thousands separators.
 */
const formatNumber = (value) =>
  new Intl.NumberFormat('en-US').format(Math.round(value));

/**
 * Generate a random integer within [min, max] inclusive.
 */
const randomInRange = ([min, max]) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Display an audio caption for accessibility.
 *
 * Captions are shown only if enabled. Each call resets the timeout,
 * so messages don't overlap unexpectedly.
 *
 * @param {string} text - Caption text to display
 */
const showCaption = (text) => {
  if (!captionsEnabled) {
    return;
  }

  const audioCaptions = getAudioCaptionsRef();
  audioCaptions.textContent = text;
  audioCaptions.classList.add('is-visible');
  clearTimeout(showCaption.timeout);
  showCaption.timeout = setTimeout(() => {
    audioCaptions.classList.remove('is-visible');
  }, CONFIG.ANIMATION.captionDisplayDuration);
};

/**
 * Update the current timestamp display.
 */
const stampTime = () => {
  const timestamp = getTimestampRef();
  timestamp.textContent = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Prepend an item to the live feed, maintaining max item limit.
 *
 * Excess items are removed from the bottom to preserve a bounded DOM size.
 */
const prependFeedItem = (message) => {
  const liveFeed = getLiveFeedRef();
  const item = document.createElement('li');
  item.textContent = message;
  liveFeed.prepend(item);

  while (liveFeed.children.length > CONFIG.UI.maxLiveFeedItems) {
    liveFeed.removeChild(liveFeed.lastElementChild);
  }
};

// ============================================================================
// AUDIO ENGINE: Web Audio API synthesis and scheduling
// ============================================================================

/**
 * Initialize the Web Audio API context and effects chain if needed.
 *
 * WHY: Lazy initialization because browsers require user interaction
 * before audio context can play. ensureAudio() is called from the
 * first user interaction handler and before playVoice().
 *
 * @returns {Promise<boolean>} True if audio is available, false otherwise
 */
const ensureAudio = async () => {
  if (audioContext) {
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    return true;
  }

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    console.warn('Web Audio API not supported in this browser.');
    return false;
  }

  try {
    audioContext = new AudioCtx();
    masterGain = audioContext.createGain();
    masterGain.gain.value = CONFIG.AUDIO.masterGainValue;

    echoDelay = audioContext.createDelay(CONFIG.AUDIO.echoDelayDuration);
    echoDelay.delayTime.value = CONFIG.AUDIO.echoDelayTime;
    echoFeedback = audioContext.createGain();
    echoFeedback.gain.value = CONFIG.AUDIO.echoFeedbackGain;

    // Wire effects chain: echoDelay -> echoFeedback (for feedback) -> masterGain -> output
    echoDelay.connect(echoFeedback);
    echoFeedback.connect(echoDelay);

    masterGain.connect(audioContext.destination);
    echoDelay.connect(masterGain);

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    return true;
  } catch (error) {
    console.error('Audio initialization failed:', error);
    return false;
  }
};

/**
 * Map a letter to a scale frequency.
 *
 * Uses the chromatic scale and wraps letter codes modulo to ensure
 * any input letter maps to a pitch.
 */
const noteFromLetter = (letter) => {
  const code = (letter.toUpperCase().charCodeAt(0) || 65);
  return CONFIG.AUDIO.hoverScaleFrequencies[code % CONFIG.AUDIO.hoverScaleFrequencies.length];
};

/**
 * Synthesis primitive: oscillator + gain envelope + stereo pan.
 *
 * WHY: playVoice is the lowest-level audio primitive. All sounds
 * (hover tones, chords, pulses) are built from playVoice calls.
 *
 * @param {object} options - Configuration
 * @param {number} options.freq - Frequency in Hz
 * @param {number} options.gainPeak - Peak gain (0-1)
 * @param {number} options.duration - Duration in seconds
 * @param {number} options.pan - Stereo pan (-1 to +1)
 * @param {string} options.type - Oscillator type (triangle, sine, sawtooth)
 * @param {string} options.caption - Optional accessibility caption
 */
const playVoice = async ({ freq, gainPeak, duration, pan = 0, type = 'triangle', caption }) => {
  const ready = await ensureAudio();
  if (!ready) {
    return;
  }

  const now = audioContext.currentTime;
  const voice = audioContext.createOscillator();
  voice.type = type;
  voice.frequency.setValueAtTime(freq, now);

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(gainPeak, now + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  const panner = audioContext.createStereoPanner();
  panner.pan.value = Math.max(-0.95, Math.min(0.95, pan));

  voice.connect(gainNode);
  gainNode.connect(panner);
  panner.connect(masterGain);
  panner.connect(echoDelay);

  voice.start(now);
  voice.stop(now + duration + 0.02);

  if (caption) {
    showCaption(caption);
  }
};

/**
 * Play a soft, two-note hover tone when the user hovers over a glyph.
 */
const playHoverTone = async (letter, pan = 0) => {
  const base = noteFromLetter(letter);
  await playVoice({
    freq: base,
    gainPeak: CONFIG.AUDIO.hoverToneGain,
    duration: CONFIG.AUDIO.hoverToneDuration,
    pan,
    caption: `Soft chime ${Math.round(base)}Hz`
  });
  await playVoice({
    freq: base * 2,
    gainPeak: CONFIG.AUDIO.hoverToneHarmonicGain,
    duration: CONFIG.AUDIO.hoverToneGainDecay,
    pan: pan * 0.6,
    type: 'sine'
  });
};

/**
 * Play a rich chord when user clicks on a glyph.
 *
 * WHY: Promise.all fires all three voices simultaneously (true chord) and
 * awaits each one, preventing the race condition that occurred when forEach
 * discarded the returned promises from the async playVoice calls.
 */
const playClickChord = async (letter, pan = 0) => {
  const base = noteFromLetter(letter);
  const ratios = [1, 1.25, 1.5];
  await Promise.all(ratios.map((ratio, index) => playVoice({
    freq: base * ratio,
    gainPeak: CONFIG.AUDIO.clickChordDuration / (index + 1),
    duration: CONFIG.AUDIO.clickChordDuration,
    pan: pan + (index - 1) * 0.18,
    type: index === 0 ? 'sawtooth' : 'triangle',
    caption: index === 0 ? 'Impact chord' : undefined
  })));
};

/**
 * Play an adaptive pulse that increases frequency with heat.
 */
const playBeatPulse = async () => {
  const base = CONFIG.AUDIO.beatPulseBaseFreq + currentHeat * CONFIG.AUDIO.beatPulseHeatCoeff;
  await playVoice({
    freq: base,
    gainPeak: CONFIG.AUDIO.beatPulseGain,
    duration: CONFIG.AUDIO.beatPulseDuration,
    type: 'sine',
    caption: 'Adaptive pulse'
  });

  if (currentHeat > 74) {
    // WHY: Both voices are awaited via Promise.all so playBeatPulse resolves
    // only after all audio work is scheduled. The 100 ms stagger between the
    // two high-heat notes is preserved inside the second promise.
    await Promise.all([
      playVoice({
        freq: base * CONFIG.AUDIO.beatPulseHighFreqMultiplier,
        gainPeak: 0.035,
        duration: 0.2,
        pan: -0.2,
        type: 'triangle'
      }),
      new Promise((resolve) => setTimeout(() => {
        resolve(playVoice({
          freq: base * 2,
          gainPeak: 0.03,
          duration: 0.18,
          pan: 0.2,
          type: 'triangle'
        }));
      }, 100))
    ]);
  }
};

/**
 * Schedule the adaptive beat pulse loop.
 *
 * BPM increases with heat and activity level. Loop ends when new
 * call arrives (scheduling replaces the old timer).
 */
const scheduleAdaptiveBeat = () => {
  clearTimeout(musicLoopTimer);

  // WHY: tick is async so we can await playBeatPulse. This ensures the next
  // beat is not scheduled until the current audio work is fully dispatched,
  // preventing beats from overlapping when the audio context is slow to start.
  const tick = async () => {
    const bpm = CONFIG.AUDIO.beatsPerMinuteBase +
               currentHeat * CONFIG.AUDIO.beatsPerMinuteHeatCoeff +
               activityLevel * CONFIG.AUDIO.beatsPerMinuteActivityCoeff;
    const interval = Math.max(CONFIG.AUDIO.beatMinInterval, Math.round(60000 / bpm));

    await playBeatPulse();
    activityLevel = Math.max(0, activityLevel - CONFIG.ACTIVITY.idleDecayRate);
    musicLoopTimer = setTimeout(tick, interval);
  };

  musicLoopTimer = setTimeout(tick, 600);
};

// ============================================================================
// VISUAL EFFECTS: Animations and particles
// ============================================================================

/**
 * Refresh the ticker strip with a lead message and random selections.
 */
const refreshTicker = (lead = 'Hello World now trending across every major feed.') => {
  const all = [lead, ...CONTENT.tickerPool.sort(() => Math.random() - 0.5).slice(0, CONFIG.UI.tickerGeneratedCount)];
  // WHY: Pre-select the index once so exactly one item receives pulse-highlight.
  // Evaluating Math.random() inside the map gave each item an independent chance,
  // meaning zero or multiple items could be highlighted unpredictably.
  const pulseIdx = Math.floor(Math.random() * all.length);
  getTickerTrackRef().innerHTML = all.map((line, idx) => `<span class="${idx === pulseIdx ? 'pulse-highlight' : ''}">${line}</span>`).join('');
};

/**
 * Update the map visualization based on mention count.
 *
 * Activates map nodes proportionally to the mention count, and updates
 * the map status text to indicate a trending city.
 */
const updateMapByMentions = (mentions) => {
  // WHY: Guard prevents crash when no globe-point elements exist in the DOM
  // (e.g. during testing or if the map section is conditionally rendered).
  if (!eventMapNodes.length) {
    return;
  }

  const activeCount = Math.max(
    1,
    Math.min(eventMapNodes.length, Math.round((mentions / CONFIG.METRICS.mentionTargetRange[1]) * eventMapNodes.length))
  );

  eventMapNodes.forEach((node, index) => {
    if (index < activeCount) {
      node.classList.remove('is-hot');
      void node.offsetWidth; // Trigger reflow to restart animation
      node.classList.add('is-hot');
    }
  });

  // Activate connection lines for active nodes
  const svg = domCache.mapConnections;
  if (svg) {
    const lines = svg.querySelectorAll('line');
    lines.forEach((line, index) => {
      if (index < activeCount - 1) {
        line.classList.add('is-active');
      } else {
        line.classList.remove('is-active');
      }
    });
  }

  const hotCity = eventMapNodes[Math.floor(Math.random() * activeCount)].dataset.city;
  getMapStatusRef().textContent = `Hot signal near ${hotCity}`;
};

/**
 * Add a camera movement class temporarily for cinematic effect.
 *
 * WHY: cameraCue uses transient CSS classes rather than direct style
 * mutations, making all visual changes observable and testable.
 *
 * @param {string} mode - Camera effect type (zoom, shake, headline, metrics)
 * @param {number} duration - How long to apply the effect (ms)
 */
const cameraCue = (mode, duration = CONFIG.ANIMATION.cameraCueDefaultDuration) => {
  const classMap = {
    zoom: 'camera-zoom',
    shake: 'camera-shake',
    headline: 'camera-focus-headline',
    metrics: 'camera-focus-metrics'
  };

  const className = classMap[mode];
  if (!className) {
    console.warn(`Unknown camera mode: ${mode}`);
    return;
  }

  document.body.classList.add(className);
  setTimeout(() => {
    document.body.classList.remove(className);
  }, duration);
};

/**
 * Animate a number from current value to target with easing.
 */
const animateValue = (element, target, duration) => {
  // WHY: A zero duration would cause division by zero (Infinity), silently
  // skipping the animation. Snap to target immediately instead.
  if (duration <= 0) {
    element.textContent = formatNumber(target);
    element.dataset.value = String(target);
    return;
  }

  const start = Number(element.dataset.value || 0);
  const startedAt = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;
    element.textContent = formatNumber(current);

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    element.dataset.value = String(target);
  };

  requestAnimationFrame(tick);
};

/**
 * Create shock sparks radiating from a point (on glyph hover/click).
 */
const createShockSparks = (x, y) => {
  for (let i = 0; i < CONFIG.ANIMATION.shockParticleCount; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'shock-particle';
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;

    const angle = (Math.PI * 2 * i) / CONFIG.ANIMATION.shockParticleCount + Math.random() * 0.4;
    const radius = CONFIG.ANIMATION.shockParticleRadius + Math.random() * CONFIG.ANIMATION.shockParticleRadiusVariance;
    spark.style.setProperty('--spark-x', `${Math.cos(angle) * radius}px`);
    spark.style.setProperty('--spark-y', `${Math.sin(angle) * radius}px`);

    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), CONFIG.ANIMATION.shockParticleDuration);
  }
};

/**
 * Blast burst particles in all directions.
 */
const blastParticles = () => {
  const burst = document.createElement('div');
  burst.className = 'burst';

  for (let i = 0; i < CONFIG.ANIMATION.burstParticleCount; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    const angle = (Math.PI * 2 * i) / CONFIG.ANIMATION.burstParticleCount;
    const radius = CONFIG.ANIMATION.burstParticleRadius + Math.random() * CONFIG.ANIMATION.burstParticleRadiusVariance;
    particle.style.setProperty('--x', `${Math.cos(angle) * radius}px`);
    particle.style.setProperty('--y', `${Math.sin(angle) * radius}px`);
    particle.style.setProperty('--hue', String(12 + Math.floor(Math.random() * 40)));
    burst.appendChild(particle);
  }

  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), CONFIG.ANIMATION.burstDuration);
};

/**
 * Create a quantum ripple and ghost characters on glyph click.
 */
const createQuantumBurst = (x, y, letter) => {
  const ripple = document.createElement('span');
  ripple.className = 'quantum-ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), CONFIG.ANIMATION.quantumRippleDuration);

  for (let i = 0; i < CONFIG.ANIMATION.quantumGhostCount; i += 1) {
    const ghost = document.createElement('span');
    ghost.className = 'quantum-ghost';
    ghost.textContent = letter;
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;

    const angle = (Math.PI * 2 * i) / CONFIG.ANIMATION.quantumGhostCount + Math.random() * 0.6;
    const distance = CONFIG.ANIMATION.quantumDistanceMin + Math.random() * CONFIG.ANIMATION.quantumDistanceVariance;
    ghost.style.setProperty('--ghost-x', `${Math.cos(angle) * distance}px`);
    ghost.style.setProperty('--ghost-y', `${Math.sin(angle) * distance}px`);
    ghost.style.setProperty('--ghost-r', `${(Math.random() * 2 - 1) * CONFIG.ANIMATION.quantumRotationMax}deg`);

    document.body.appendChild(ghost);
    setTimeout(() => ghost.remove(), CONFIG.ANIMATION.quantumGhostDuration);
  }
};

/**
 * Trigger a wave animation across headline glyphs radiating from origin.
 */
const triggerHeadlineWave = (originGlyph) => {
  if (!originGlyph) {
    return;
  }

  const originRect = originGlyph.getBoundingClientRect();
  const originX = originRect.left + originRect.width / 2;
  const originY = originRect.top + originRect.height / 2;

  driftingGlyphs.forEach((glyph) => {
    const rect = glyph.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const distance = Math.hypot(originX - x, originY - y);
    const delay = Math.min(420, distance * 0.9);
    glyph.style.setProperty('--wave-delay', `${delay}ms`);
    glyph.classList.remove('is-wave');
    void glyph.offsetWidth;
    glyph.classList.add('is-wave');
    setTimeout(() => glyph.classList.remove('is-wave'), delay + CONFIG.ANIMATION.glyphWaveTimeout);
  });
};

// ============================================================================
// METRICS ENGINE: Audience engagement simulation and heat scoring
// ============================================================================

/**
 * Refresh displayed metrics and compute overall heat.
 *
 * Heat is a weighted combination of viewer interaction, geographic spread,
 * and mention activity. It drives adaptive audio and visual intensity.
 *
 * @param {number} intensity - Multiplier for mention count (for special moments)
 */
const refreshMetrics = (intensity = 1) => {
  const viewers = randomInRange(CONFIG.METRICS.viewerTargetRange);
  const countries = randomInRange(CONFIG.METRICS.countryTargetRange);
  const mentions = Math.min(
    CONFIG.METRICS.mentionTargetRange[1],
    Math.round(randomInRange(CONFIG.METRICS.mentionTargetRange) * intensity)
  );

  animateValue(getViewerCountRef(), viewers, CONFIG.ANIMATION.metricsAnimationDuration);
  animateValue(getCountryCountRef(), countries, CONFIG.ANIMATION.metricsAnimationDuration - 50);
  animateValue(getMentionCountRef(), mentions, CONFIG.ANIMATION.metricsAnimationDuration + 20);

  metricsState.viewers = viewers;
  metricsState.countries = countries;
  metricsState.mentions = mentions;

  // Normalize each metric to [0, 1] and compute weighted heat.
  const viewerScore = (viewers - CONFIG.METRICS.viewerTargetRange[0]) /
                      (CONFIG.METRICS.viewerTargetRange[1] - CONFIG.METRICS.viewerTargetRange[0]);
  const countryScore = (countries - CONFIG.METRICS.countryTargetRange[0]) /
                       (CONFIG.METRICS.countryTargetRange[1] - CONFIG.METRICS.countryTargetRange[0]);
  const mentionScore = (mentions - CONFIG.METRICS.mentionTargetRange[0]) /
                       (CONFIG.METRICS.mentionTargetRange[1] - CONFIG.METRICS.mentionTargetRange[0]);
  
  currentHeat = Math.min(
    CONFIG.METRICS.heatMaxValue,
    Math.round((
      viewerScore * CONFIG.METRICS.heatViewerWeight +
      countryScore * CONFIG.METRICS.heatCountryWeight +
      mentionScore * CONFIG.METRICS.heatMentionWeight
    ) * 100)
  );

  getHeatFillRef().style.width = `${currentHeat}%`;
  getHeatValueRef().textContent = String(currentHeat);
  updateMapByMentions(mentions);

  // Auto-trigger viral alert when heat is critical (rare chance, with cooldown)
  if (
    currentHeat >= CONFIG.VIRAL.heatThreshold &&
    Math.random() < CONFIG.VIRAL.autoTriggerChance &&
    performance.now() - lastViralAlertTime >= CONFIG.VIRAL.cooldownMs
  ) {
    setTimeout(triggerViralAlert, 400);
  }
};

/**
 * Generate a templated headline from metrics or select a variant.
 *
 * Template selection: 65% chance for a variant, 35% for a data-driven template.
 */
const buildGeneratedHeadline = () => {
  const templates = [
    [
      'HELLO WORLD',
      `${Math.round(metricsState.viewers / 1000)}K WATCHERS`,
      'ENTER LIVE',
      'PRIME FEED'
    ],
    [
      `${metricsState.countries} NATIONS`,
      'TRACKING',
      'ONE GREETING',
      'IN REAL TIME'
    ],
    [
      'TREND SURGE',
      `${Math.round(metricsState.mentions / 10)}0 MENTIONS`,
      currentMode.toUpperCase(),
      'ON AIR'
    ]
  ];

  if (Math.random() < CONFIG.UI.headlineRenderChance) {
    return CONTENT.headlineVariants[Math.floor(Math.random() * CONTENT.headlineVariants.length)];
  }

  return templates[Math.floor(Math.random() * templates.length)];
};

// ============================================================================
// HEADLINE & INTERACTION: Rendering and user input handling
// ============================================================================

/**
 * Render a headline from word lines and attach hover/click effects.
 */
const renderHeadline = (lines) => {
  const headline = getHeadlineRef();
  headline.innerHTML = lines.map((line) => `<span>${line}</span>`).join('');
  headlineWords = Array.from(headline.children);

  headlineWords.forEach((word, index) => {
    setTimeout(() => {
      word.classList.add('is-visible');
    }, index * CONFIG.ANIMATION.glyphRenderDelayMs);
  });

  driftingGlyphs.length = 0;
  installHeadlineHoverFx();
};

/**
 * Install pointer and click event handlers on headline glyphs.
 *
 * WHY: Event handlers are installed per-render to ensure state is fresh
 * and last spark/tone timings are independent for each glyph.
 *
 * Glyph effects:
 * - pointerenter: Establish 3D hover state, play tone, emit sparks
 * - pointermove: Update 3D perspective based on pointer position
 * - pointerleave: Reset to default 3D state
 * - click: Play chord, emit quantum burst, trigger wave, log event
 */
const installHeadlineHoverFx = () => {
  headlineWords.forEach((line) => {
    const letters = Array.from(line.textContent);
    line.textContent = '';

    letters.forEach((letter) => {
      const glyph = document.createElement('span');
      const isSpace = letter === ' ';
      glyph.className = isSpace ? 'glyph-space' : 'glyph';
      glyph.textContent = letter;

      if (!isSpace) {
        glyph.dataset.glyph = letter;
        let lastSpark = 0;
        let lastTone = 0;
        driftingGlyphs.push(glyph);

        glyph.addEventListener('pointerenter', (event) => {
          registerActivity();
          const { left, top, width, height } = glyph.getBoundingClientRect();
          const relativeX = event.clientX - (left + width / 2);
          const relativeY = event.clientY - (top + height / 2);
          glyph.style.setProperty('--hover-x', `${relativeX * CONFIG.UI.glyphHoverSensitivity}px`);
          glyph.style.setProperty('--hover-y', `${relativeY * CONFIG.UI.glyphHoverSensitivity}px`);
          glyph.style.setProperty('--hover-z', '16px');
          glyph.style.setProperty('--tilt-x', `${Math.max(-CONFIG.UI.glyphTiltMax, Math.min(CONFIG.UI.glyphTiltMax, -relativeY * CONFIG.UI.glyphTiltDegrees))}deg`);
          glyph.style.setProperty('--tilt-y', `${Math.max(-CONFIG.UI.glyphTiltMax, Math.min(CONFIG.UI.glyphTiltMax, relativeX * 0.45))}deg`);
          glyph.style.setProperty('--hover-scale', '1.12');
          glyph.classList.add('is-hovered');
          createShockSparks(event.clientX, event.clientY);
          playHoverTone(letter, relativeX / Math.max(12, width / 2));
          lastSpark = performance.now();
          lastTone = performance.now();
        });

        glyph.addEventListener('pointermove', (event) => {
          const { left, top, width, height } = glyph.getBoundingClientRect();
          const relativeX = event.clientX - (left + width / 2);
          const relativeY = event.clientY - (top + height / 2);
          glyph.style.setProperty('--hover-x', `${relativeX * CONFIG.UI.glyphMoveSensitivity}px`);
          glyph.style.setProperty('--hover-y', `${relativeY * CONFIG.UI.glyphMoveSensitivity}px`);
          glyph.style.setProperty('--hover-z', '18px');
          glyph.style.setProperty('--tilt-x', `${Math.max(-20, Math.min(20, -relativeY * 0.56))}deg`);
          glyph.style.setProperty('--tilt-y', `${Math.max(-20, Math.min(20, relativeX * 0.5))}deg`);
          glyph.style.setProperty('--hover-scale', '1.14');

          if (performance.now() - lastSpark > CONFIG.ANIMATION.hoverSparkMinInterval) {
            createShockSparks(event.clientX, event.clientY);
            lastSpark = performance.now();
          }

          if (performance.now() - lastTone > CONFIG.ANIMATION.hoverToneMinInterval) {
            playHoverTone(letter, relativeX / Math.max(12, width / 2));
            lastTone = performance.now();
          }
        });

        glyph.addEventListener('pointerleave', () => {
          glyph.classList.remove('is-hovered');
          glyph.style.setProperty('--hover-x', '0px');
          glyph.style.setProperty('--hover-y', '0px');
          glyph.style.setProperty('--hover-z', '0px');
          glyph.style.setProperty('--tilt-x', '0deg');
          glyph.style.setProperty('--tilt-y', '0deg');
          glyph.style.setProperty('--hover-scale', '1');
        });

        glyph.addEventListener('click', (event) => {
          registerActivity();
          const { left, width } = glyph.getBoundingClientRect();
          const relativeX = event.clientX - (left + width / 2);
          const glyphIndex = driftingGlyphs.indexOf(glyph);

          glyph.classList.remove('is-clicked');
          void glyph.offsetWidth;
          glyph.classList.add('is-clicked');

          createQuantumBurst(event.clientX, event.clientY, letter);
          createShockSparks(event.clientX, event.clientY);
          triggerHeadlineWave(glyph);
          playClickChord(letter, relativeX / Math.max(12, width / 2));
          cameraCue('shake', 320);
          prependFeedItem(`Impact burst triggered on letter ${letter.toUpperCase()}.`);
          stampTime();
          logEvent('glyph-click', { index: glyphIndex, letter });
        });
      }

      line.appendChild(glyph);
    });
  });
};

/**
 * Set the current visual mode and update CSS variables.
 *
 * @param {string} modeKey - Mode key (alert, orbit, sunrise)
 * @param {boolean} silent - If true, skip feed item and logging
 */
const setMode = (modeKey, silent = false) => {
  const mode = MODES[modeKey];
  if (!mode) {
    console.warn(`Unknown mode: ${modeKey}`);
    return;
  }

  currentMode = modeKey;
  document.documentElement.style.setProperty('--accent-hot', mode.hot);
  document.documentElement.style.setProperty('--accent-warn', mode.warn);
  document.documentElement.style.setProperty('--accent-cool', mode.cool);

  domCache.modeChips.forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.mode === modeKey);
  });

  if (!silent) {
    prependFeedItem(mode.line);
    stampTime();
    logEvent('mode', { mode: modeKey });
  }
};

/**
 * Toggle storm broadcast mode (visual/audio intensity boost).
 */
const activateStormMode = () => {
  document.body.classList.toggle('storm-broadcast');
  prependFeedItem('Storm Broadcast mode toggled.');
  cameraCue('shake', 460);
  showCaption('Storm mode online');
  logEvent('storm');
};

/**
 * Toggle zero-gravity mode (glyphs drift more aggressively).
 */
const activateZeroGravity = () => {
  document.body.classList.toggle('zero-gravity');
  prependFeedItem('Zero Gravity letters activated.');
  showCaption('Zero gravity field engaged');
  logEvent('zero');
};

/**
 * Trigger the viral surge alert overlay.
 *
 * Shows a full-viewport "GOING VIRAL" takeover with a spinning impressions
 * counter, pulsing border, and scanline effects. Auto-dismisses after
 * CONFIG.VIRAL.displayDurationMs. A cooldown prevents back-to-back triggers.
 */
const triggerViralAlert = () => {
  if (isViralAlertActive) {
    return;
  }

  const now = performance.now();
  if (now - lastViralAlertTime < CONFIG.VIRAL.cooldownMs) {
    return;
  }

  const overlay = domCache.viralOverlay;
  const counter = domCache.viralCounter;
  if (!overlay || !counter) {
    return;
  }

  isViralAlertActive = true;
  lastViralAlertTime = now;

  // Cancel any counter animation still running from a previous trigger
  if (viralCounterRafId !== null) {
    cancelAnimationFrame(viralCounterRafId);
    viralCounterRafId = null;
  }

  // Spike all metrics and activate all globe nodes
  refreshMetrics(1.5);
  blastParticles();
  cameraCue('zoom', 1400);
  prependFeedItem('VIRAL ALERT: Signal has saturated all networks. Peak broadcast moment recorded.');
  stampTime();
  logEvent('viral');
  showCaption('Going viral — peak broadcast moment');

  // Show overlay
  overlay.hidden = false;
  counter.textContent = '0 IMPRESSIONS';

  requestAnimationFrame(() => {
    overlay.classList.add('is-active');
  });

  // Animate counter from 0 to target
  const startTime = performance.now();
  const target = CONFIG.VIRAL.counterTarget;
  const duration = CONFIG.VIRAL.counterDurationMs;

  const animateCounter = (ts) => {
    const elapsed = ts - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const value = Math.round(eased * target);
    counter.textContent = `${new Intl.NumberFormat('en-US').format(value)} IMPRESSIONS`;

    if (progress < 1) {
      viralCounterRafId = requestAnimationFrame(animateCounter);
    } else {
      viralCounterRafId = null;
    }
  };

  viralCounterRafId = requestAnimationFrame(animateCounter);

  // Auto-dismiss
  setTimeout(() => {
    overlay.classList.remove('is-active');
    setTimeout(() => {
      overlay.hidden = true;
      isViralAlertActive = false;
      prependFeedItem('Viral surge subsiding. Broadcast returning to regular cadence.');
      stampTime();
    }, 320);
  }, CONFIG.VIRAL.displayDurationMs);
};

/**
 * Perform continuous floating animation for headline glyphs.
 *
 * WHY: requestAnimationFrame loop runs indefinitely and is independent
 * of the beat schedule. Glyphs float using sine waves offset per-glyph
 * for organic, non-synchronous motion.
 */
const startGlyphDrift = () => {
  // WHY: Cancel any existing loop before starting a new one. Without this,
  // each call to startGlyphDrift stacks an additional rAF loop, multiplying
  // CPU cost on every re-initialisation.
  if (glyphDriftRafId !== null) {
    cancelAnimationFrame(glyphDriftRafId);
    glyphDriftRafId = null;
  }

  const animate = (time) => {
    driftingGlyphs.forEach((glyph, index) => {
      const gravityBoost = document.body.classList.contains('zero-gravity') ? 1.8 : 1;
      const phase = time * 0.00042 + index * 0.63;
      const phaseAlt = time * 0.00033 + index * 0.37;

      glyph.style.setProperty('--float-x', `${Math.sin(phase) * 3.8 * gravityBoost}px`);
      glyph.style.setProperty('--float-y', `${Math.cos(phaseAlt) * 4.6 * gravityBoost}px`);
      glyph.style.setProperty('--float-z', `${(Math.sin(phase * 1.12) + 1) * 8 * gravityBoost}px`);
      glyph.style.setProperty('--float-rx', `${Math.cos(phaseAlt) * 5.5 * gravityBoost}deg`);
      glyph.style.setProperty('--float-ry', `${Math.sin(phase) * 6.2 * gravityBoost}deg`);
    });

    glyphDriftRafId = requestAnimationFrame(animate);
  };

  glyphDriftRafId = requestAnimationFrame(animate);
};

// ============================================================================
// WORKFLOWS: State machines for major application flows
// ============================================================================

/**
 * Regenerate all headline, metrics, and feed content.
 *
 * @param {number} intensity - Multiplier for mentions
 * @param {string} source - Origin ('manual', 'replay', etc.)
 */
const regenerateBuzz = (intensity = 1, source = 'manual') => {
  refreshMetrics(intensity);

  const generated = buildGeneratedHeadline();
  renderHeadline(generated);

  const line = `Breaking: ${generated.join(' / ')}.`;
  refreshTicker(line);
  getSubheadRef().textContent = CONTENT.subheads[Math.floor(Math.random() * CONTENT.subheads.length)];
  prependFeedItem(CONTENT.feedPool[Math.floor(Math.random() * CONTENT.feedPool.length)]);
  stampTime();

  if (source !== 'replay') {
    logEvent('buzz', { intensity });
  }
};

/**
 * Execute one idle attention milestone (highlight one glyph, play tone).
 */
const triggerIdleAttentionStep = () => {
  if (!driftingGlyphs.length) {
    return;
  }

  const glyph = driftingGlyphs[idleIndex % driftingGlyphs.length];
  idleIndex += 1;

  // WHY: Array could be modified between the length check and this access
  // (e.g. headline re-rendered mid-idle cycle), so guard defensively.
  if (!glyph) {
    return;
  }

  const rect = glyph.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  glyph.classList.remove('is-idle-call');
  void glyph.offsetWidth;
  glyph.classList.add('is-idle-call');

  createShockSparks(x, y);
  playHoverTone(glyph.textContent || 'A', 0);
  setTimeout(() => glyph.classList.remove('is-idle-call'), CONFIG.ANIMATION.idleCallAnimationTimeout);
};

/**
 * Exit idle mode: stop attention sequence and remove visual markers.
 */
const exitIdleMode = () => {
  if (!idleModeActive) {
    return;
  }

  idleModeActive = false;
  clearInterval(idleAttentionInterval);
  driftingGlyphs.forEach((glyph) => glyph.classList.remove('is-idle-call'));
};

/**
 * Enter idle mode: start an automatic glyph attention sequence.
 *
 * WHY: Idle mode engages the user if no interaction for idleTimeoutMs.
 * It's a retention mechanism that keeps the app feeling alive.
 */
const enterIdleMode = () => {
  if (idleModeActive || !getElement('introGate').classList.contains('is-hidden')) {
    return;
  }

  idleModeActive = true;
  prependFeedItem('Idle detected. Headline beacon sequence engaged.');
  stampTime();

  triggerIdleAttentionStep();
  idleAttentionInterval = setInterval(triggerIdleAttentionStep, CONFIG.ANIMATION.idleAttentionIntervalMs);
};

/**
 * Reset the idle timer (restart idle countdown).
 */
const resetIdleTimer = () => {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(enterIdleMode, CONFIG.ANIMATION.idleTimeoutMs);
};

/**
 * Register user activity: boost activity level, exit idle, reset timer.
 *
 * Called by interaction handlers to ensure app responds to all input.
 */
const registerActivity = () => {
  activityLevel = Math.min(CONFIG.ACTIVITY.maxActivityLevel, activityLevel + CONFIG.ACTIVITY.registrationBoost);
  exitIdleMode();
  resetIdleTimer();
};

/**
 * Trigger launch moment: high metrics, visual blast, log event.
 */
const runLaunchMoment = (source = 'manual') => {
  refreshMetrics(1.15);
  cameraCue('headline', CONFIG.ANIMATION.launchCameraDuration);
  blastParticles();
  prependFeedItem('Launch command received. Headline sequence now live.');
  stampTime();
  if (source !== 'replay') {
    logEvent('launch');
  }
};

/**
 * Replay a single logged event.
 *
 * Used by replayLastMoments to reconstruct a sequence of actions.
 */
const replayAction = (event) => {
  switch (event.name) {
    case 'buzz':
      regenerateBuzz(event.payload.intensity || 1, 'replay');
      break;
    case 'launch':
      runLaunchMoment('replay');
      break;
    case 'mode':
      setMode(event.payload.mode, true);
      break;
    case 'storm':
      activateStormMode();
      break;
    case 'zero':
      activateZeroGravity();
      break;
    case 'glyph-click': {
      const glyph = driftingGlyphs[event.payload.index];
      if (glyph) {
        const rect = glyph.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        createQuantumBurst(x, y, event.payload.letter || glyph.textContent || 'A');
        triggerHeadlineWave(glyph);
      }
      break;
    }
    default:
      console.log(`Unknown event type in replay: ${event.name}`);
  }
};

/**
 * Replay events from the last 8 seconds.
 *
 * WHY: Replay reconstructs the user's recent actions for review,
 * useful for understanding what happened and for exhibition purposes.
 */
const replayLastMoments = () => {
  const now = performance.now();
  const recent = eventLog.filter((entry) => now - entry.t <= 8000);

  if (!recent.length) {
    prependFeedItem('No recent sequence captured yet. Create some action first.');
    stampTime();
    return;
  }

  isReplaying = true;
  const replayButton = getElement('replayButton');
  replayButton.disabled = true;
  prependFeedItem('Replaying the last 8 seconds.');
  showCaption('Replay sequence started');

  const base = recent[0].t;
  recent.forEach((entry) => {
    setTimeout(() => replayAction(entry), entry.t - base);
  });

  setTimeout(() => {
    isReplaying = false;
    replayButton.disabled = false;
    prependFeedItem('Replay complete.');
    stampTime();
  }, recent[recent.length - 1].t - base + 900);
};

/**
 * Run a 20-second cinematic timeline with curated moments.
 *
 * WHY: The timeline is a predefined sequence showcasing app features.
 * It's a powerful engagement mechanism for first-time viewers.
 */
const runCinematicTimeline = async () => {
  if (isTimelineRunning) {
    return;
  }

  isTimelineRunning = true;
  const timelineButton = getElement('timelineButton');
  timelineButton.disabled = true;
  showCaption('Cinematic timeline initiated');
  prependFeedItem('Director started a 20-second cinematic timeline.');
  logEvent('timeline');

  cameraCue('zoom', 1300);
  runLaunchMoment();
  await wait(CONFIG.ANIMATION.launchDelay);

  setMode('orbit');
  cameraCue('metrics', CONFIG.ANIMATION.orbitModeCameraDuration);
  regenerateBuzz(1.2);
  await wait(CONFIG.ANIMATION.orbitModeDelay);

  activateStormMode();
  await wait(CONFIG.ANIMATION.stormModeDelay);

  for (let i = 0; i < CONFIG.ANIMATION.timelineGlyphIterations; i += 1) {
    const glyph = driftingGlyphs[Math.floor(Math.random() * driftingGlyphs.length)];
    if (glyph) {
      const rect = glyph.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      createQuantumBurst(x, y, glyph.textContent || 'A');
      triggerHeadlineWave(glyph);
      playClickChord(glyph.textContent || 'A', 0);
    }
    await wait(CONFIG.ANIMATION.timelineGlyphDelay);
  }

  await wait(CONFIG.ANIMATION.sunriseModeDelay);
  setMode('sunrise');
  regenerateBuzz(1.28);
  cameraCue('headline', 1200);
  prependFeedItem('Timeline finale reached maximum broadcast intensity.');
  showCaption('Finale crescendo');

  // Climax: fire the viral alert at the peak of the timeline
  lastViralAlertTime = -Infinity;
  triggerViralAlert();

  await wait(CONFIG.ANIMATION.timelineFinalDuration);
  isTimelineRunning = false;
  timelineButton.disabled = false;
  stampTime();
};

/**
 * Play a single synthesized countdown beep.
 *
 * Each tick uses a sharp, punchy sine burst — frequency rises on the final
 * beat so the listener hears the classic broadcast "4 low + 1 high" cadence.
 *
 * @param {number} n - Countdown value (5..1); 1 gets the high-pitched sting.
 */
const playCountdownBeep = async (n) => {
  await ensureAudio();
  if (!audioContext) {
    return;
  }

  const freq = n === 1 ? 1046.5 : 523.25; // WHY: C6 for final beat, C5 for others
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.28, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (n === 1 ? 0.38 : 0.18));

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + (n === 1 ? 0.4 : 0.2));
};

/**
 * Run the 5-second TV broadcast countdown then boot the main experience.
 *
 * WHY: Replacing the instant closeIntro() with a dramatic countdown
 * transforms the "Go Live" moment into a shareable, cinematic experience
 * akin to a real network broadcast launch — the single most memorable
 * interaction in the app.
 */
const runBroadcastCountdown = async () => {
  const overlay = domCache.countdownOverlay;
  const numEl = domCache.countdownNumber;
  const ringFill = domCache.countdownRingFill;

  // Immediately hide intro gate so the countdown fills the viewport
  getElement('introGate').classList.add('is-hidden');

  if (!overlay || !numEl || !ringFill) {
    // Fallback: skip countdown if DOM elements are missing
    closeIntroBootstrap();
    return;
  }

  // WHY: SVG circle circumference = 2πr = 2 * π * 82 ≈ 515
  const CIRCUMFERENCE = 515;

  overlay.hidden = false;
  // Tiny rAF delay lets the browser paint hidden→false before adding is-active
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  overlay.classList.add('is-active');

  // WHY: Use a local mutable ref so each tick points to the live DOM node.
  // Capturing numEl once at the top and then calling replaceChild detaches it,
  // making numEl.parentNode === null on the second tick and silently crashing
  // the async loop (the bug that caused the countdown to freeze at 5).
  let currentNumEl = numEl;

  for (let n = 5; n >= 1; n--) {
    // Update ring: offset goes from 0 (full) to CIRCUMFERENCE (empty)
    const offset = CIRCUMFERENCE * (1 - n / 5);
    ringFill.style.strokeDashoffset = String(offset);
    // Shift ring colour toward cool on the final beat for dramatic contrast
    ringFill.style.stroke = n === 1 ? 'var(--accent-cool)' : 'var(--accent-hot)';

    // Re-trigger the number pop animation via void-reflow trick.
    // WHY: Setting animation to 'none' + forcing a reflow + clearing it
    // restarts the keyframe on the same element — no DOM replacement needed,
    // and avoids the detached-node crash that came from cloneNode/replaceChild.
    currentNumEl.textContent = String(n);
    currentNumEl.style.animation = 'none';
    void currentNumEl.offsetWidth; // force reflow so the browser resets the keyframe
    currentNumEl.style.animation = '';

    playCountdownBeep(n);
    showCaption(n === 1 ? 'One — going live' : `${n}`);
    logEvent('countdown-tick', { n });

    await wait(950);
  }

  // "● LIVE" flash — brief full-screen red burst
  const liveFlash = document.createElement('div');
  liveFlash.className = 'countdown-live-flash';
  liveFlash.setAttribute('aria-hidden', 'true');
  liveFlash.textContent = '● LIVE';
  document.body.appendChild(liveFlash);
  showCaption('We are live');

  await wait(520);
  liveFlash.remove();

  // Fade out and hide the countdown overlay
  overlay.classList.remove('is-active');
  await wait(200);
  overlay.hidden = true;

  closeIntroBootstrap();
};

/**
 * Internal: boot the main broadcast after the intro sequence ends.
 *
 * Separated from closeIntro so both the countdown path and any fallback
 * path reach the same boot logic without duplication.
 */
const closeIntroBootstrap = () => {
  prependFeedItem('Go Live confirmed. Intro gate cleared for full broadcast.');
  blastParticles();
  refreshMetrics();
  stampTime();
  scheduleAdaptiveBeat();
  registerActivity();
};

/**
 * Close the intro gate and begin the main broadcast.
 */
const closeIntro = () => {
  getElement('introGate').classList.add('is-hidden');
  closeIntroBootstrap();
};

/**
 * Apply parallax effect based on pointer position.
 *
 * The stage rotates subtly to follow the mouse, creating a sense
 * of depth and engagement.
 */
const onPointerMove = (event) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const moveX = (event.clientX - centerX) / CONFIG.UI.pointerMoveSensitivity;
  const moveY = (event.clientY - centerY) / CONFIG.UI.pointerMoveSensitivity;

  getStageRef().style.setProperty('--mx', moveX.toFixed(2));
  getStageRef().style.setProperty('--my', moveY.toFixed(2));
  registerActivity();
};

// ============================================================================
// EASTER EGG GUIDE: Secret menu for advanced controls
// ============================================================================

/**
 * Open the easter egg guide overlay.
 */
const openEasterGuide = () => {
  isEasterGuideOpen = true;
  getElement('easterGuide').hidden = false;
  prependFeedItem('Easter egg guide opened.');
  stampTime();
};

/**
 * Close the easter egg guide overlay.
 */
const closeEasterGuide = () => {
  isEasterGuideOpen = false;
  getElement('easterGuide').hidden = true;
};

/**
 * Toggle easter egg guide open/closed.
 */
const toggleEasterGuide = () => {
  if (isEasterGuideOpen) {
    closeEasterGuide();
  } else {
    openEasterGuide();
  }
};

// ============================================================================
// INITIALIZATION & EVENT LISTENERS
// ============================================================================

/**
 * Initialize the application: cache DOM, set up event listeners, and bootstrap state.
 */
const initialize = () => {
  // Initialize DOM cache (fail-fast if required elements missing)
  initializeDOMCache();

  // Initialize map connections
  initializeMapConnections();

  // Set up button event listeners
  getElement('launchButton').addEventListener('click', () => runLaunchMoment());
  getElement('refreshButton').addEventListener('click', () => regenerateBuzz());
  getElement('timelineButton').addEventListener('click', runCinematicTimeline);
  getElement('replayButton').addEventListener('click', replayLastMoments);

  // Set up mode chip listeners
  domCache.modeChips.forEach((chip) => {
    chip.addEventListener('click', () => setMode(chip.dataset.mode));
  });

  // Set up effect toggle listeners
  getElement('stormModeButton').addEventListener('click', activateStormMode);
  getElement('gravityModeButton').addEventListener('click', activateZeroGravity);

  // Set up captions toggle
  getElement('captionsToggle').addEventListener('click', () => {
    captionsEnabled = !captionsEnabled;
    getElement('captionsToggle').textContent = captionsEnabled ? 'Audio Captions On' : 'Audio Captions Off';
    if (!captionsEnabled) {
      getAudioCaptionsRef().classList.remove('is-visible');
    }
  });

  // Set up intro gate — runs the broadcast countdown before booting the main UI
  getElement('goLiveButton').addEventListener('click', runBroadcastCountdown);

  // Set up easter egg guide
  getElement('easterGuideToggle').addEventListener('click', (event) => {
    registerActivity();
    event.stopPropagation();
    toggleEasterGuide();
  });

  getElement('easterGuideClose').addEventListener('click', (event) => {
    registerActivity();
    event.stopPropagation();
    closeEasterGuide();
  });

  getElement('secretStormButton').addEventListener('click', (event) => {
    registerActivity();
    event.stopPropagation();
    activateStormMode();
  });

  getElement('secretZeroButton').addEventListener('click', (event) => {
    registerActivity();
    event.stopPropagation();
    activateZeroGravity();
  });

  getElement('secretTimelineButton').addEventListener('click', (event) => {
    registerActivity();
    event.stopPropagation();
    runCinematicTimeline();
  });

  getElement('secretReplayButton').addEventListener('click', (event) => {
    registerActivity();
    event.stopPropagation();
    replayLastMoments();
  });

  if (domCache.secretViralButton) {
    domCache.secretViralButton.addEventListener('click', (event) => {
      registerActivity();
      event.stopPropagation();
      lastViralAlertTime = -Infinity; // bypass cooldown for manual trigger
      triggerViralAlert();
    });
  }

  // Set up global interaction listeners
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerdown', registerActivity);
  document.addEventListener('keydown', (event) => {
    registerActivity();
    if (event.key === 'Escape' && isEasterGuideOpen) {
      closeEasterGuide();
    }
  });
  document.addEventListener('touchstart', registerActivity, { passive: true });
  document.addEventListener('scroll', registerActivity, { passive: true });

  // Click-outside-guide to close easter guide
  document.addEventListener('click', (event) => {
    if (!isEasterGuideOpen) {
      return;
    }

    const easterGuide = getElement('easterGuide');
    const easterGuideToggle = getElement('easterGuideToggle');
    if (!easterGuide.contains(event.target) && !easterGuideToggle.contains(event.target)) {
      closeEasterGuide();
    }
  });

  // Unlock audio on first interaction
  document.addEventListener('pointerdown', () => {
    ensureAudio();
  }, { once: true });

  // Periodic feed refresh
  if (feedIntervalId !== null) {
    clearInterval(feedIntervalId);
  }
  feedIntervalId = setInterval(() => {
    prependFeedItem(CONTENT.feedPool[Math.floor(Math.random() * CONTENT.feedPool.length)]);
    stampTime();
  }, CONFIG.ANIMATION.feedRefreshIntervalMs);

  // Boot sequence
  if (prefersReducedMotion.matches) {
    prependFeedItem('Reduced motion mode is active with cinematic pacing preserved.');
  }

  // Bootstrap state
  renderHeadline(CONTENT.headlineVariants[0]);
  startGlyphDrift();
  refreshMetrics();
  regenerateBuzz(1);
  setMode('alert', true);
  refreshTicker();
  stampTime();
  resetIdleTimer();
};

// Boot the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
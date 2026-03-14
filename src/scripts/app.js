const headline = document.querySelector('#headline');
let headlineWords = [];
const eventMapNodes = Array.from(document.querySelectorAll('.map-node'));

const viewerCount = document.querySelector('#viewerCount');
const countryCount = document.querySelector('#countryCount');
const mentionCount = document.querySelector('#mentionCount');

const subhead = document.querySelector('#subhead');
const liveFeed = document.querySelector('#liveFeed');
const tickerTrack = document.querySelector('#tickerTrack');
const timestamp = document.querySelector('#timestamp');
const stage = document.querySelector('.stage');
const mapStatus = document.querySelector('#mapStatus');
const easterGuideToggle = document.querySelector('#easterGuideToggle');
const easterGuide = document.querySelector('#easterGuide');
const easterGuideClose = document.querySelector('#easterGuideClose');
const secretStormButton = document.querySelector('#secretStormButton');
const secretZeroButton = document.querySelector('#secretZeroButton');
const secretTimelineButton = document.querySelector('#secretTimelineButton');
const secretReplayButton = document.querySelector('#secretReplayButton');

const launchButton = document.querySelector('#launchButton');
const refreshButton = document.querySelector('#refreshButton');
const timelineButton = document.querySelector('#timelineButton');
const replayButton = document.querySelector('#replayButton');

const stormModeButton = document.querySelector('#stormModeButton');
const gravityModeButton = document.querySelector('#gravityModeButton');
const captionsToggle = document.querySelector('#captionsToggle');
const audioCaptions = document.querySelector('#audioCaptions');

const heatFill = document.querySelector('#heatFill');
const heatValue = document.querySelector('#heatValue');
const modeChips = Array.from(document.querySelectorAll('.mode-chip[data-mode]'));
const introGate = document.querySelector('#introGate');
const goLiveButton = document.querySelector('#goLiveButton');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const baseHeadlineVariants = [
    ['Hello', 'World', 'Breaks', 'The Feed'],
    ['Signal', 'Rises', 'Across', 'The Planet'],
    ['One Line', 'Of Code', 'Goes', 'Prime Time'],
    ['Broadcast', 'Level', 'Hello', 'World']
];

const subheads = [
    'The internet asked for a simple greeting. It got a full front-page moment.',
    'One line of code became a global broadcast in under 60 seconds.',
    'What started as a demo now feels like a season premiere.'
];

const feedPool = [
    'Commentators label this the first cinematic hello world rollout.',
    'Analysts report developers replaying the reveal sequence on loop.',
    'Crowd reaction remains unusually high for a single greeting.',
    'Breaking desks mention a 4x increase in hello world searches.',
    'Studios ask whether this app has a behind-the-scenes documentary.'
];

const tickerPool = [
    'Developers call this the loudest launch of the year.',
    'Realtime metrics confirm attention spikes worldwide.',
    'Press rooms agree this is not your average hello world.',
    'UI directors praise the bold editorial visual style.'
];

const modes = {
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

const metricTargets = {
    viewers: [18000, 45000],
    countries: [42, 132],
    mentions: [900, 5200]
};

const hoverScale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
const driftingGlyphs = [];
const eventLog = [];

let audioContext;
let masterGain;
let echoDelay;
let echoFeedback;
let musicLoopTimer;

let captionsEnabled = true;
let currentMode = 'alert';
let currentHeat = 0;
let activityLevel = 0;
let isTimelineRunning = false;
let isReplaying = false;

const idleTimeoutMs = 6500;
let idleTimer;
let idleAttentionInterval;
let idleModeActive = false;
let idleIndex = 0;

let isEasterGuideOpen = false;

const metricsState = {
    viewers: 0,
    countries: 0,
    mentions: 0
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const formatNumber = (value) => new Intl.NumberFormat('en-US').format(Math.round(value));
const randomInRange = ([min, max]) => Math.floor(Math.random() * (max - min + 1)) + min;

const showCaption = (text) => {
    if (!captionsEnabled) {
        return;
    }

    audioCaptions.textContent = text;
    audioCaptions.classList.add('is-visible');
    clearTimeout(showCaption.timeout);
    showCaption.timeout = setTimeout(() => {
        audioCaptions.classList.remove('is-visible');
    }, 1800);
};

const stampTime = () => {
    timestamp.textContent = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const prependFeedItem = (message) => {
    const item = document.createElement('li');
    item.textContent = message;
    liveFeed.prepend(item);

    while (liveFeed.children.length > 6) {
        liveFeed.removeChild(liveFeed.lastElementChild);
    }
};

const logEvent = (name, payload = {}) => {
    if (isReplaying) {
        return;
    }

    eventLog.push({ t: performance.now(), name, payload });
    while (eventLog.length > 140) {
        eventLog.shift();
    }
};

const ensureAudio = async () => {
    if (!audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) {
            return false;
        }

        audioContext = new AudioCtx();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.17;

        echoDelay = audioContext.createDelay(0.45);
        echoDelay.delayTime.value = 0.16;
        echoFeedback = audioContext.createGain();
        echoFeedback.gain.value = 0.2;

        echoDelay.connect(echoFeedback);
        echoFeedback.connect(echoDelay);

        masterGain.connect(audioContext.destination);
        echoDelay.connect(masterGain);
    }

    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }

    return true;
};

const noteFromLetter = (letter) => {
    const code = letter.toUpperCase().charCodeAt(0) || 65;
    return hoverScale[code % hoverScale.length];
};

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

const playHoverTone = async (letter, pan = 0) => {
    const base = noteFromLetter(letter);
    await playVoice({
        freq: base,
        gainPeak: 0.08,
        duration: 0.5,
        pan,
        caption: `Soft chime ${Math.round(base)}Hz`
    });
    await playVoice({ freq: base * 2, gainPeak: 0.03, duration: 0.42, pan: pan * 0.6, type: 'sine' });
};

const playClickChord = async (letter, pan = 0) => {
    const base = noteFromLetter(letter);
    const ratios = [1, 1.25, 1.5];
    ratios.forEach((ratio, index) => {
        playVoice({
            freq: base * ratio,
            gainPeak: 0.12 / (index + 1),
            duration: 0.72,
            pan: pan + (index - 1) * 0.18,
            type: index === 0 ? 'sawtooth' : 'triangle',
            caption: index === 0 ? 'Impact chord' : undefined
        });
    });
};

const playBeatPulse = async () => {
    const base = 92 + currentHeat * 0.7;
    await playVoice({ freq: base, gainPeak: 0.05, duration: 0.24, type: 'sine', caption: 'Adaptive pulse' });

    if (currentHeat > 74) {
        playVoice({ freq: base * 1.5, gainPeak: 0.035, duration: 0.2, pan: -0.2, type: 'triangle' });
        setTimeout(() => {
            playVoice({ freq: base * 2, gainPeak: 0.03, duration: 0.18, pan: 0.2, type: 'triangle' });
        }, 100);
    }
};

const scheduleAdaptiveBeat = () => {
    clearTimeout(musicLoopTimer);

    const tick = () => {
        const bpm = 68 + currentHeat * 0.65 + activityLevel * 12;
        const interval = Math.max(220, Math.round(60000 / bpm));

        playBeatPulse();
        activityLevel = Math.max(0, activityLevel - 0.12);
        musicLoopTimer = setTimeout(tick, interval);
    };

    musicLoopTimer = setTimeout(tick, 600);
};

const refreshTicker = (lead = 'Hello World now trending across every major feed.') => {
    const all = [lead, ...tickerPool.sort(() => Math.random() - 0.5).slice(0, 3)];
    tickerTrack.innerHTML = all.map((line) => `<span>${line}</span>`).join('');
};

const updateMapByMentions = (mentions) => {
    const activeCount = Math.max(1, Math.min(eventMapNodes.length, Math.round((mentions / metricTargets.mentions[1]) * eventMapNodes.length)));

    eventMapNodes.forEach((node, index) => {
        if (index < activeCount) {
            node.classList.remove('is-hot');
            void node.offsetWidth;
            node.classList.add('is-hot');
        }
    });

    const hotCity = eventMapNodes[Math.floor(Math.random() * activeCount)].dataset.city;
    mapStatus.textContent = `Hot signal near ${hotCity}`;
};

const cameraCue = (mode, duration = 700) => {
    const classMap = {
        zoom: 'camera-zoom',
        shake: 'camera-shake',
        headline: 'camera-focus-headline',
        metrics: 'camera-focus-metrics'
    };

    const className = classMap[mode];
    if (!className) {
        return;
    }

    document.body.classList.add(className);
    setTimeout(() => {
        document.body.classList.remove(className);
    }, duration);
};

const animateValue = (element, target, duration) => {
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

const refreshMetrics = (intensity = 1) => {
    const viewers = randomInRange(metricTargets.viewers);
    const countries = randomInRange(metricTargets.countries);
    const mentions = Math.min(metricTargets.mentions[1], Math.round(randomInRange(metricTargets.mentions) * intensity));

    animateValue(viewerCount, viewers, 900);
    animateValue(countryCount, countries, 850);
    animateValue(mentionCount, mentions, 920);

    metricsState.viewers = viewers;
    metricsState.countries = countries;
    metricsState.mentions = mentions;

    const viewerScore = (viewers - metricTargets.viewers[0]) / (metricTargets.viewers[1] - metricTargets.viewers[0]);
    const countryScore = (countries - metricTargets.countries[0]) / (metricTargets.countries[1] - metricTargets.countries[0]);
    const mentionScore = (mentions - metricTargets.mentions[0]) / (metricTargets.mentions[1] - metricTargets.mentions[0]);
    currentHeat = Math.min(100, Math.round((viewerScore * 0.42 + countryScore * 0.18 + mentionScore * 0.4) * 100));

    heatFill.style.width = `${currentHeat}%`;
    heatValue.textContent = String(currentHeat);
    updateMapByMentions(mentions);
};

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

    if (Math.random() < 0.35) {
        return baseHeadlineVariants[Math.floor(Math.random() * baseHeadlineVariants.length)];
    }

    return templates[Math.floor(Math.random() * templates.length)];
};

const createShockSparks = (x, y) => {
    for (let i = 0; i < 8; i += 1) {
        const spark = document.createElement('span');
        spark.className = 'shock-particle';
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;

        const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
        const radius = 25 + Math.random() * 55;
        spark.style.setProperty('--spark-x', `${Math.cos(angle) * radius}px`);
        spark.style.setProperty('--spark-y', `${Math.sin(angle) * radius}px`);

        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 560);
    }
};

const blastParticles = () => {
    const burst = document.createElement('div');
    burst.className = 'burst';

    for (let i = 0; i < 28; i += 1) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        const angle = (Math.PI * 2 * i) / 28;
        const radius = 100 + Math.random() * 260;
        particle.style.setProperty('--x', `${Math.cos(angle) * radius}px`);
        particle.style.setProperty('--y', `${Math.sin(angle) * radius}px`);
        particle.style.setProperty('--hue', String(12 + Math.floor(Math.random() * 40)));
        burst.appendChild(particle);
    }

    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1000);
};

const createQuantumBurst = (x, y, letter) => {
    const ripple = document.createElement('span');
    ripple.className = 'quantum-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 980);

    for (let i = 0; i < 7; i += 1) {
        const ghost = document.createElement('span');
        ghost.className = 'quantum-ghost';
        ghost.textContent = letter;
        ghost.style.left = `${x}px`;
        ghost.style.top = `${y}px`;

        const angle = (Math.PI * 2 * i) / 7 + Math.random() * 0.6;
        const distance = 90 + Math.random() * 160;
        ghost.style.setProperty('--ghost-x', `${Math.cos(angle) * distance}px`);
        ghost.style.setProperty('--ghost-y', `${Math.sin(angle) * distance}px`);
        ghost.style.setProperty('--ghost-r', `${(Math.random() * 2 - 1) * 220}deg`);

        document.body.appendChild(ghost);
        setTimeout(() => ghost.remove(), 980);
    }
};

const triggerHeadlineWave = (originGlyph) => {
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
        setTimeout(() => glyph.classList.remove('is-wave'), delay + 620);
    });
};

const renderHeadline = (lines) => {
    headline.innerHTML = lines.map((line) => `<span>${line}</span>`).join('');
    headlineWords = Array.from(headline.children);

    headlineWords.forEach((word, index) => {
        setTimeout(() => {
            word.classList.add('is-visible');
        }, index * 150);
    });

    driftingGlyphs.length = 0;
    installHeadlineHoverFx();
};

const setMode = (modeKey, silent = false) => {
    const mode = modes[modeKey];
    if (!mode) {
        return;
    }

    currentMode = modeKey;
    document.documentElement.style.setProperty('--accent-hot', mode.hot);
    document.documentElement.style.setProperty('--accent-warn', mode.warn);
    document.documentElement.style.setProperty('--accent-cool', mode.cool);

    modeChips.forEach((chip) => {
        chip.classList.toggle('active', chip.dataset.mode === modeKey);
    });

    if (!silent) {
        prependFeedItem(mode.line);
        stampTime();
        logEvent('mode', { mode: modeKey });
    }
};

const activateStormMode = () => {
    document.body.classList.toggle('storm-broadcast');
    prependFeedItem('Storm Broadcast mode toggled.');
    cameraCue('shake', 460);
    showCaption('Storm mode online');
    logEvent('storm');
};

const activateZeroGravity = () => {
    document.body.classList.toggle('zero-gravity');
    prependFeedItem('Zero Gravity letters activated.');
    showCaption('Zero gravity field engaged');
    logEvent('zero');
};

const regenerateBuzz = (intensity = 1, source = 'manual') => {
    refreshMetrics(intensity);

    const generated = buildGeneratedHeadline();
    renderHeadline(generated);

    const line = `Breaking: ${generated.join(' / ')}.`;
    refreshTicker(line);
    subhead.textContent = subheads[Math.floor(Math.random() * subheads.length)];
    prependFeedItem(feedPool[Math.floor(Math.random() * feedPool.length)]);
    stampTime();

    if (source !== 'replay') {
        logEvent('buzz', { intensity });
    }
};

const triggerIdleAttentionStep = () => {
    if (!driftingGlyphs.length) {
        return;
    }

    const glyph = driftingGlyphs[idleIndex % driftingGlyphs.length];
    idleIndex += 1;

    const rect = glyph.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    glyph.classList.remove('is-idle-call');
    void glyph.offsetWidth;
    glyph.classList.add('is-idle-call');

    createShockSparks(x, y);
    playHoverTone(glyph.textContent || 'A', 0);
    setTimeout(() => glyph.classList.remove('is-idle-call'), 1320);
};

const exitIdleMode = () => {
    if (!idleModeActive) {
        return;
    }

    idleModeActive = false;
    clearInterval(idleAttentionInterval);
    driftingGlyphs.forEach((glyph) => glyph.classList.remove('is-idle-call'));
};

const enterIdleMode = () => {
    if (idleModeActive || !introGate.classList.contains('is-hidden')) {
        return;
    }

    idleModeActive = true;
    prependFeedItem('Idle detected. Headline beacon sequence engaged.');
    stampTime();

    triggerIdleAttentionStep();
    idleAttentionInterval = setInterval(triggerIdleAttentionStep, 1900);
};

const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(enterIdleMode, idleTimeoutMs);
};

const registerActivity = () => {
    activityLevel = Math.min(2.6, activityLevel + 0.4);
    exitIdleMode();
    resetIdleTimer();
};

const startGlyphDrift = () => {
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

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
};

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
                    glyph.style.setProperty('--hover-x', `${relativeX * 0.09}px`);
                    glyph.style.setProperty('--hover-y', `${relativeY * 0.09}px`);
                    glyph.style.setProperty('--hover-z', '16px');
                    glyph.style.setProperty('--tilt-x', `${Math.max(-18, Math.min(18, -relativeY * 0.5))}deg`);
                    glyph.style.setProperty('--tilt-y', `${Math.max(-18, Math.min(18, relativeX * 0.45))}deg`);
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
                    glyph.style.setProperty('--hover-x', `${relativeX * 0.12}px`);
                    glyph.style.setProperty('--hover-y', `${relativeY * 0.12}px`);
                    glyph.style.setProperty('--hover-z', '18px');
                    glyph.style.setProperty('--tilt-x', `${Math.max(-20, Math.min(20, -relativeY * 0.56))}deg`);
                    glyph.style.setProperty('--tilt-y', `${Math.max(-20, Math.min(20, relativeX * 0.5))}deg`);
                    glyph.style.setProperty('--hover-scale', '1.14');

                    if (performance.now() - lastSpark > 90) {
                        createShockSparks(event.clientX, event.clientY);
                        lastSpark = performance.now();
                    }

                    if (performance.now() - lastTone > 140) {
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

const runLaunchMoment = (source = 'manual') => {
    refreshMetrics(1.15);
    cameraCue('headline', 900);
    blastParticles();
    prependFeedItem('Launch command received. Headline sequence now live.');
    stampTime();
    if (source !== 'replay') {
        logEvent('launch');
    }
};

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
            break;
    }
};

const replayLastMoments = () => {
    const now = performance.now();
    const recent = eventLog.filter((entry) => now - entry.t <= 8000);

    if (!recent.length) {
        prependFeedItem('No recent sequence captured yet. Create some action first.');
        stampTime();
        return;
    }

    isReplaying = true;
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

const runCinematicTimeline = async () => {
    if (isTimelineRunning) {
        return;
    }

    isTimelineRunning = true;
    timelineButton.disabled = true;
    showCaption('Cinematic timeline initiated');
    prependFeedItem('Director started a 20-second cinematic timeline.');
    logEvent('timeline');

    cameraCue('zoom', 1300);
    runLaunchMoment();
    await wait(2200);

    setMode('orbit');
    cameraCue('metrics', 1200);
    regenerateBuzz(1.2);
    await wait(2600);

    activateStormMode();
    await wait(2300);

    for (let i = 0; i < 3; i += 1) {
        const glyph = driftingGlyphs[Math.floor(Math.random() * driftingGlyphs.length)];
        if (glyph) {
            const rect = glyph.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            createQuantumBurst(x, y, glyph.textContent || 'A');
            triggerHeadlineWave(glyph);
            playClickChord(glyph.textContent || 'A', 0);
        }
        await wait(650);
    }

    await wait(1700);
    setMode('sunrise');
    regenerateBuzz(1.28);
    cameraCue('headline', 1200);
    prependFeedItem('Timeline finale reached maximum broadcast intensity.');
    showCaption('Finale crescendo');

    await wait(2400);
    isTimelineRunning = false;
    timelineButton.disabled = false;
    stampTime();
};

const closeIntro = () => {
    introGate.classList.add('is-hidden');
    prependFeedItem('Go Live confirmed. Intro gate cleared for full broadcast.');
    blastParticles();
    refreshMetrics();
    stampTime();
    scheduleAdaptiveBeat();
    registerActivity();
};

const onPointerMove = (event) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = (event.clientX - centerX) / 22;
    const moveY = (event.clientY - centerY) / 22;

    stage.style.setProperty('--mx', moveX.toFixed(2));
    stage.style.setProperty('--my', moveY.toFixed(2));
    registerActivity();
};

const openEasterGuide = () => {
    isEasterGuideOpen = true;
    easterGuide.hidden = false;
    prependFeedItem('Easter egg guide opened.');
    stampTime();
};

const closeEasterGuide = () => {
    isEasterGuideOpen = false;
    easterGuide.hidden = true;
};

const toggleEasterGuide = () => {
    if (isEasterGuideOpen) {
        closeEasterGuide();
    } else {
        openEasterGuide();
    }
};

launchButton.addEventListener('click', () => runLaunchMoment());
refreshButton.addEventListener('click', () => regenerateBuzz());
timelineButton.addEventListener('click', runCinematicTimeline);
replayButton.addEventListener('click', replayLastMoments);

modeChips.forEach((chip) => {
    chip.addEventListener('click', () => setMode(chip.dataset.mode));
});

stormModeButton.addEventListener('click', activateStormMode);
gravityModeButton.addEventListener('click', activateZeroGravity);

captionsToggle.addEventListener('click', () => {
    captionsEnabled = !captionsEnabled;
    captionsToggle.textContent = captionsEnabled ? 'Audio Captions On' : 'Audio Captions Off';
    if (!captionsEnabled) {
        audioCaptions.classList.remove('is-visible');
    }
});

easterGuideToggle.addEventListener('click', (event) => {
    registerActivity();
    event.stopPropagation();
    toggleEasterGuide();
});

easterGuideClose.addEventListener('click', (event) => {
    registerActivity();
    event.stopPropagation();
    closeEasterGuide();
});

secretStormButton.addEventListener('click', (event) => {
    registerActivity();
    event.stopPropagation();
    activateStormMode();
});

secretZeroButton.addEventListener('click', (event) => {
    registerActivity();
    event.stopPropagation();
    activateZeroGravity();
});

secretTimelineButton.addEventListener('click', (event) => {
    registerActivity();
    event.stopPropagation();
    runCinematicTimeline();
});

secretReplayButton.addEventListener('click', (event) => {
    registerActivity();
    event.stopPropagation();
    replayLastMoments();
});

goLiveButton.addEventListener('click', closeIntro);
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

document.addEventListener('click', (event) => {
    if (!isEasterGuideOpen) {
        return;
    }

    if (!easterGuide.contains(event.target) && !easterGuideToggle.contains(event.target)) {
        closeEasterGuide();
    }
});

document.addEventListener('pointerdown', () => {
    ensureAudio();
}, { once: true });

setInterval(() => {
    prependFeedItem(feedPool[Math.floor(Math.random() * feedPool.length)]);
    stampTime();
}, 5500);

if (prefersReducedMotion.matches) {
    prependFeedItem('Reduced motion mode is active with cinematic pacing preserved.');
}

renderHeadline(baseHeadlineVariants[0]);
startGlyphDrift();
refreshMetrics();
regenerateBuzz(1);
setMode('alert', true);
refreshTicker();
stampTime();
resetIdleTimer();
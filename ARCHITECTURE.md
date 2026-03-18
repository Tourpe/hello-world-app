# Hello World Application: Architecture & Design

## Module Overview

A broadcast-themed interactive experience with cinematic animations, adaptive audio synthesis, and responsive UI elements. The application orchestrates the full user experience from initialization through complex interactions to state replay and visual effects.

**Primary Responsibilities:**
- DOM caching and state management
- Web Audio API synthesis and scheduling
- Animation and visual effect orchestration with requestAnimationFrame
- Event logging and timeline-based replay
- Accessibility support (audio captions, reduced motion preferences)

**Dependencies:**
- Web Audio API (implemented with fallbacks)
- requestAnimationFrame and CSS animations
- DOM manipulation and event delegation
- Modern JS (ES6+)

---

## Architecture Principles

This application follows the Agent Constitution guidelines:

### 1. Minimal Footprint
- No external animation libraries; uses requestAnimationFrame and CSS animations
- Lightweight event logging (bounded ring buffer)
- Single responsibility functions

### 2. Prefer Edits Over Rewrites
- Code is modular and compartmentalized by concern
- State changes use event logging rather than direct mutation

### 3. Security First
- No sensitive data handled; all interactions are client-side
- HTTPS required in production
- Web Audio context requires user interaction (security requirement)

### 4. Simplicity & Structure
- **Single Responsibility**: Each function does one thing
  - `logEvent()`: Log only
  - `playVoice()`: Synthesize one sound primitive
  - `renderHeadline()`: Render text and attach handlers
  - `refreshMetrics()`: Update metrics and heat

- **Fail Fast**: `getElement()` throws immediately if DOM is missing
- **Config-driven**: All magic numbers extracted to `CONFIG` object
- **Pure Functions**: Audio synthesis and animation don't modify state unless explicitly passed

### 5. Observability
- **Event Log**: All user actions timestamped and bounded (140 entries max)
- **Structured Logging**: Events have consistent `{ t, name, payload }` shape
- **Replay System**: Past 8 seconds of events can be reconstructed
- **Audio Captions**: Accessibility feedback for audio synthesis

### 6. Error Handling
- **Explicit Guards**: DOM initialization validates all required elements
- **Graceful Degradation**: Audio context falls back if unavailable
- **Warning Logs**: Unknown modes or events logged to console

---

## Code Organization

### Constants & Configuration (Lines 1-150)
```javascript
CONFIG = {
  DOM: { /* query selectors */ },
  AUDIO: { /* synthesis parameters */ },
  ANIMATION: { /* timing values */ },
  METRICS: { /* heat engine weights */ },
  UI: { /* interaction sensitivity */ },
  ACTIVITY: { /* engagement mechanics */ }
}
```

**WHY:** Centralizing all tunable parameters makes the application portable and testable. Adjust responsive times, animation durations, or audio frequencies without editing function bodies.

### State (Lines 150-200)
- Runtime mutable state clearly separated from constants
- State reset possible via re-initialization

### Utilities (Lines 200-350)
- Primitives: `wait()`, `formatNumber()`, `randomInRange()`
- Primitives are pure and reusable

### Audio Engine (Lines 350-600)
- `ensureAudio()`: Lazy initialization, handles browser context requirements
- `playVoice()`: Core synthesis primitive
- Higher-level composers: `playHoverTone()`, `playClickChord()`, `playBeatPulse()`
- Scheduling: `scheduleAdaptiveBeat()` (adaptive BPM based on heat)

**WHY Lazy Initialization:** Browsers require user interaction before playing audio. `ensureAudio()` is called on first interaction (line ~900) and before playback.

### Visual Effects (Lines 600-900)
- Particle systems: `createShockSparks()`, `blastParticles()`, `createQuantumBurst()`
- Animation: `animateValue()`, `triggerHeadlineWave()`, `startGlyphDrift()`
- Camera effects: `cameraCue()` (uses transient CSS classes)

### Metrics Engine (Lines 900-1100)
- `refreshMetrics()`: Simulates engagement metrics
- Heat calculation: Weighted combination of viewers (42%), countries (18%), mentions (40%)
- `buildGeneratedHeadline()`: Data-driven or variant-based

### Headlines & Interaction (Lines 1100-1400)
- `renderHeadline()`: Render text and attach handlers
- `installHeadlineHoverFx()`: Pointer enter/move/leave and click handlers
- Per-glyph state: last spark time, last tone time (prevents overlap)

### Workflows & State Machines (Lines 1400-1700)
- `regenerateBuzz()`: Full content refresh
- `runLaunchMoment()`: High-intensity moment
- `replayLastMoments()`: Reconstruct past 8 seconds
- `runCinematicTimeline()`: Predefined 20-second sequence
- `enterIdleMode()` / `exitIdleMode()`: Retention mechanism

### Initialization & Event Listeners (Lines 1700-1850)
- `initialize()`: Boot sequence (DOM cache, handlers, state setup)
- DOM-ready guard: Runs on DOMContentLoaded or immediately if already loaded

---

## Key Design Patterns

### 1. Event Logging for Observability
```javascript
const logEvent = (name, payload = {}) => {
  if (isReplaying) return; // Prevent recursion
  eventLog.push({ t: performance.now(), name, payload });
  while (eventLog.length > CONFIG.UI.maxEventLogEntries) {
    eventLog.shift(); // Bounded ring buffer
  }
};
```

**WHY:** All interactions timestamped and bounded. Enables deterministic replay and debugging.

### 2. DOM Caching with Fail-Fast Validation
```javascript
const initializeDOMCache = () => {
  domCache.headline = document.querySelector(CONFIG.DOM.headline);
  // ... more caches
  ['headline', 'liveFeed', 'introGate'].forEach((key) => {
    if (!domCache[key]) throw new Error(`Element "${key}" not found`);
  });
};

const getElement = (key) => {
  const element = domCache[key];
  if (!element) throw new Error(`Required element "${key}" not found`);
  return element;
};
```

**WHY:** Prevents silent null-reference bugs. All DOM access goes through cache.

### 3. Configuration-Driven Responsiveness
All animation timings, audio parameters, and UI sensitivity values are in `CONFIG`. Updates propagate consistently:
- Change `CONFIG.ANIMATION.captionDisplayDuration` → captions stay visible longer everywhere
- Change `CONFIG.UI.glyphHoverSensitivity` → hover response scales uniformly

### 4. Adaptive Audio Scheduling
```javascript
const bpm = CONFIG.AUDIO.beatsPerMinuteBase +
           currentHeat * CONFIG.AUDIO.beatsPerMinuteHeatCoeff +
           activityLevel * CONFIG.AUDIO.beatsPerMinuteActivityCoeff;
```

Heat increases with metrics. Activity increases with user interaction. BPM = 68 + (heat × 0.65) + (activity × 12).

### 5. Bounded State for Replay
- Event log: max 140 entries
- Live feed: max 6 items
- Replay looks back 8 seconds (typical session is 2-5 minutes)

**WHY:** Bounded state keeps memory predictable and performance consistent.

---

## Critical Decisions & Trade-offs

### WHY Lazy-Init Audio but Not DOM
- **Audio:** Browsers forbid playback before user interaction (security). Must wait.
- **DOM:** Fails immediately if missing. Better to crash at boot than at interaction time.

### WHY Event Sourcing for Replay
- User can understand their own recent actions
- Enables exhibition/debugging workflows
- Lightweight (small event payloads)
- Deterministic and testable

### WHY CSS Classes Over Direct Styles
All visual effects use `classList` rather than `element.style`. This keeps state changes observable and preserves the separation between CSS (presentation) and JS (behavior).

### WHY CONFIG Object Instead of Inline Constants
Centralized tuning makes the app portable across contexts (different screen sizes, audio devices, interaction styles). Update one place, propagates everywhere.

---

## Testing & Debugging

### Event Log Inspection
```javascript
// In browser console:
console.log(eventLog.map(e => `${e.name} @ ${e.t.toFixed(0)}ms`));
// Output: buzz @ 1234ms, mode @ 2456ms, launch @ 3678ms, ...
```

### Metricsstate Inspector
```javascript
console.log(metricsState); // { viewers, countries, mentions }
console.log(currentHeat); // 0-100
```

### Audio Synthesis Debug
Set `CONFIG.AUDIO.masterGainValue` to 0 to silence while keeping event log intact.

---

## Extensions & Customization

### Adding a New Mode
1. Add entry to `MODES` object (color scheme + message)
2. Call `setMode('mymode')` → updates CSS variables and logs event

### Adding a New Effect
1. Create function that calls `playVoice()` primitives
2. Wire to button handler
3. Log event if needed

### Adjusting Responsiveness
Edit `CONFIG` values:
- Audio timing: `CONFIG.AUDIO.*`
- Animation speed: `CONFIG.ANIMATION.*`
- Interaction sensitivity: `CONFIG.UI.*`
- Heat weights: `CONFIG.METRICS.heat*Weight`

---

## Performance Considerations

- **requestAnimationFrame Loop:** Runs on every frame (~60fps). Only glyph drift updates per-frame; avoid major DOM mutations.
- **Event Log:** Bounded to 140 entries (≈8 seconds). Old entries are shifted out.
- **DOM Cache:** References stored, minimizing `querySelector()` calls.
- **Audio Synthesis:** Lazy-initialized. AudioContext created on first user interaction.
- **Particles:** Removed from DOM after animation completes (span is short-lived).

---

## Accessibility

- **Audio Captions:** All sounds have descriptive captions for accessibility
- **Image Alt Text:** Decorative elements marked `aria-hidden="true"`
- **Keyboard Support:** Escape closes easter guide, all buttons are keyboard-accessible
- **Reduced Motion:** App detects `prefers-reduced-motion` and logs
- **ARIA Labels:** Buttons have descriptive aria-labels for screen readers

---

## Future Enhancements

- Persist event log to localStorage for post-session analysis
- A/B test different config values (heat weights, animation timing)
- Support multi-touch interactions
- Add haptic feedback (vibration API)
- Mobile-responsive layout tweaks

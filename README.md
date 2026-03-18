# Hello World Application

A cinematic, interactive "Hello World" experience built with vanilla JavaScript, Web Audio API, and CSS animations. This is a broadcast-themed application showcasing modern web capabilities: dynamic metrics, adaptive audio synthesis, particle effects, and sophisticated user engagement mechanics.

## Getting Started

### Prerequisites
- Node.js >= 14.0.0
- npm or yarn

### Installation & Running

```bash
npm install
npm start
```

The app will open at `http://localhost:8080` with live-reload enabled.

## Features

### 🎬 Cinematic Interactions
- **Intro Gate:** Press "Go Live" to begin the broadcast
- **Cinematic Timeline:** 20-second curated sequence showcasing all effects
- **Replay System:** Relive the last 8 seconds of your interactions

### 🎵 Adaptive Audio
- Web Audio API synthesis with echo effects
- Tones, chords, and pulses that respond to interaction and engagement heat
- Audio captions for accessibility
- Graceful fallback if audio context unavailable

### ✨ Visual Effects
- Particle bursts and shock waves on glyph clicks
- Quantum ghost characters radiating from impact points
- Interactive headline with 3D perspective transforms
- Storm mode for visual intensity boost
- Zero gravity mode for playful deflection

### 📊 Engagement Metrics
- Real-time viewer, country, and mention counters
- Heat engine: weighted computation of engagement (viewers 42%, countries 18%, mentions 40%)
- Adaptive audio BPM tied to heat and activity level
- Heat bar visualization

### 🌈 Visual Modes
- **Alert:** Sharp, high-contrast color scheme
- **Orbit:** Satellite-themed colors with cooler tones
- **Sunrise:** Warm, dawn-inspired palette

### ⚙️ Advanced Mode
- Easter egg guide (top-right corner) for secret controls
- Storm Broadcast toggle
- Zero Gravity toggle
- Cinematic Timeline activation
- Manual replay trigger

### 🚫 Idle Detection
- If inactive for 6.5 seconds, the app engages with a beacon sequence
- Glyphs are highlighted and pinged with audio to re-engage the user

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed technical documentation, design patterns, and extension guidelines.

### Project Structure

```
hello-world-app/
├── src/
│   ├── index.html           # Main HTML structure
│   ├── scripts/
│   │   └── app.js           # Application logic (~1850 lines)
│   └── styles/
│       └── style.css        # Styling and animations
├── package.json             # Dependencies and scripts
├── README.md                # This file
├── ARCHITECTURE.md          # Technical deep-dive
└── .github/
    └── copilot-instructions.md  # AI agent guidelines
```

### Key Technologies

- **Vanilla JavaScript (ES6+):** No frameworks; pure Web APIs
- **Web Audio API:** Synthesis, routing, effects (echo delay)
- **CSS Animations:** Hardware-accelerated transforms, transitions
- **requestAnimationFrame:** Smooth 60fps glyph drift animation
- **Event Logging & Replay:** Deterministic state reconstruction
- **Accessibility:** ARIA labels, audio captions, reduced motion support

## How It Works

### Workflow
1. **Intro:** User presses "Go Live" (see `closeIntro()`)
2. **Main Loop:** Continuous glyph drift animation + event listeners
3. **Interaction:** User hovers, clicks, or triggers effects
4. **Logging:** All actions timestamped and stored (event sourcing)
5. **Audio/Visual:** Actions trigger synthesis, particles, and style changes
6. **Replay:** User can relive past 8 seconds via replay system

### State Management
- **event log:** Bounded ring buffer of timestamped events (max 140)
- **metrics state:** Current viewer count, countries, mentions
- **heat & activity:** Scalars that drive adaptive audio BPM
- **DOM cache:** Persistent references to key elements
- **mode:** Current visual theme (alert, orbit, sunrise)

## Customization

All tunable parameters are in the `CONFIG` object in `app.js`:

```javascript
const CONFIG = {
  ANIMATION: {
    idleTimeoutMs: 6500,           // Idle detection threshold
    captionDisplayDuration: 1800,  // How long captions stay visible
    // ...more animation timings
  },
  AUDIO: {
    masterGainValue: 0.17,         // Master volume
    beatPulseBaseFreq: 92,         // Base BPM frequency
    // ...more audio synthesis parameters
  },
  UI: {
    glyphHoverSensitivity: 0.09,   // Parallax response on hover
    // ...more UI parameters
  },
  // ...and more
};
```

Update values to tune responsiveness, animation speed, audio frequencies, etc.

## Debugging & Testing

### Event Log Inspection
```javascript
// In browser console:
console.log(eventLog.map(e => `${e.name} @ ${e.t.toFixed(0)}ms`));
```

### Metrics Inspector
```javascript
console.log({ currentHeat, metricsState, activityLevel, isTimelineRunning });
```

### Audio Debug
Set `CONFIG.AUDIO.masterGainValue` to `0` to silence while keeping interactions alive.

## Performance

- **Glyph Drift:** requestAnimationFrame loop; ~60 updates/sec
- **Event Log:** Bounded to 140 entries; old events shifted out
- **Particles:** Removed from DOM after animation completes
- **Audio:** Lazy-initialized on first user interaction
- **DOM Cache:** Minimizes querySelector calls

## Accessibility

- Audio captions for all sound effects
- Decorative elements marked `aria-hidden="true"`
- Full keyboard support (Escape to close menus)
- Reduced motion respect (`prefers-reduced-motion` media query)
- ARIA labels on all buttons

## Browser Support

- Modern browsers with ES6 support
- Web Audio API (Chrome, Firefox, Safari, Edge)
- CSS Grid & CSS Custom Properties
- Fallback for browsers without audio context

## License

MIT

## Future Enhancements

- Persist event log for session replay
- Mobile-responsive layout
- Multi-touch support
- Haptic feedback (vibration API)
- A/B testing of configuration values
- Analytics integration

## Features

- **Visually Stunning Layout**: The application includes a beautifully designed interface with animations and graphics that enhance the user experience.
- **Responsive Design**: The layout adapts to different screen sizes, ensuring a seamless experience on both desktop and mobile devices.
- **Interactive Elements**: JavaScript is used to add interactivity, making the "Hello World" message come alive with animations and user interactions.

## Project Structure

```
hello-world-app
├── src
│   ├── index.html        # Main HTML document
│   ├── styles
│   │   └── style.css     # Styles for the application
│   ├── scripts
│   │   └── app.js        # JavaScript for interactivity
├── package.json          # npm configuration file
└── README.md             # Project documentation
```

## Getting Started

To get started with the Hello World application, follow these steps:

1. **Clone the Repository**: 
   ```bash
   git clone <repository-url>
   cd hello-world-app
   ```

2. **Install Dependencies**: 
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run the Application**: 
   You can start the application using:
   ```bash
   npm start
   ```

4. **Open in Browser**: 
   Navigate to `http://localhost:3000` (or the specified port) to view the application in your web browser.

## Design Philosophy

The Hello World application aims to provide a delightful introduction to web development. It emphasizes the importance of aesthetics and user engagement, demonstrating how simple concepts can be transformed into visually appealing experiences. 

Feel free to explore the code, modify it, and make it your own! Happy coding!
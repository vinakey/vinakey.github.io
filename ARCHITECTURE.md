# VinaKey v3 Architecture

## Overview

VinaKey v3 evolves from legacy AVIM.js to a modern, cross-platform Vietnamese input system with extension capabilities.

## Key Requirements

1. **Cross-platform**: Works on all major browsers and platforms
2. **Extension-ready**: Can be packaged as browser extension
3. **Test-driven**: Full TDD approach with comprehensive testing
4. **Modern**: TypeScript, ES modules, clean architecture
5. **Performance**: Efficient input processing with minimal latency

## Architecture Components

### 1. Core Input Engine (`src/engine/`)

- **VietnameseInputProcessor**: Main processing engine
- **InputMethods**: TELEX, VNI, VIQR implementations
- **CharacterMap**: Vietnamese character mappings and transformations
- **SpellChecker**: Vietnamese spelling validation
- **StateManager**: Input state management

### 2. Platform Adapters (`src/adapters/`)

- **WebAdapter**: For web applications (current VinaKey)
- **ChromeExtensionAdapter**: For Chrome extension
- **ContentScriptAdapter**: For extension content scripts

### 3. Browser Extension (`extension/`)

- **manifest.json**: Extension configuration
- **background.js**: Service worker for extension
- **content-script.js**: Inject input processor into web pages
- **popup/**: Extension popup UI

### 4. API Layer (`src/api/`)

- **InputAPI**: Public API for input processing
- **EventEmitter**: Event system for input events
- **ConfigManager**: Configuration management

## Implementation Strategy

### Phase 1: Core Engine (TDD)

1. Vietnamese character processing engine
2. Input method implementations (TELEX, VNI, VIQR)
3. Comprehensive test suite

### Phase 2: Web Integration

1. DOM event handling
2. Content-editable integration
3. Virtual keyboard support

### Phase 3: Extension

1. Chrome extension manifest
2. Content script injection
3. Cross-site input support

### Phase 4: Advanced Features

1. Predictive text
2. Custom dictionaries
3. Multi-language support

## Technical Decisions

### Why Not chrome.input.ime?

- **Limited scope**: ChromeOS only, doesn't work in regular Chrome
- **Poor adoption**: Most users aren't on ChromeOS
- **Alternative**: Content script injection works everywhere

### Input Processing Flow

```
User Keypress → Platform Adapter → Input Engine → Character Processing → Output
```

### Extension Architecture

```
Background Script ← Content Script ← DOM Events
       ↓                 ↓
   Configuration    Input Processing
```

## File Structure

```
src/
├── engine/           # Core Vietnamese input engine
│   ├── processor.ts  # Main input processor
│   ├── methods/      # Input method implementations
│   ├── maps/         # Character mapping tables
│   └── state/        # State management
├── adapters/         # Platform-specific adapters
├── api/              # Public API
└── utils/            # Shared utilities

extension/            # Chrome extension
├── manifest.json
├── background/
├── content/
└── popup/

tests/                # Test suites
├── engine/
├── adapters/
└── integration/
```

## Testing Strategy

1. **Unit Tests**: Core engine components
2. **Integration Tests**: Adapter integrations
3. **E2E Tests**: Full user workflows
4. **Performance Tests**: Input latency benchmarks

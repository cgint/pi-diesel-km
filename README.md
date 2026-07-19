# pi-diesel-km

Pi extension that displays model-aware LLM energy as an equivalent 5L/100km diesel-car distance.

It uses Pi session usage metadata plus a TypeScript port of EcoLogits request-energy math. When EcoLogits model metadata is available, estimates use model architecture and deployment data; otherwise the extension falls back explicitly.

## Installation

```bash
pi install https://github.com/cgint/pi-diesel-km
```

Or during local development:

```bash
pi install /Users/cgint/dev-external/pi-diesel-km
```

## Usage

```text
/diesel-km       # Show detailed session energy and diesel-distance breakdown
```

The extension also updates a compact footer status entry such as `🚗~12cm` after turns with assistant token usage.

## Configuration

```bash
ECOLOGITS_MODELS_JSON=~/dev-external/ecologits/ecologits/data/models.json
```

If the metadata file is missing or cannot be parsed, the extension keeps working and marks unknown models as fallback estimates.

## What it estimates

- Generated-token energy uses the EcoLogits-derived request-energy formula.
- Provider PUE values are mirrored from EcoLogits provider config.
- Diesel distance is an energy-content comparison: `5L/100km × 9.8 kWh/L = 0.49 kWh/km`.
- Context-inclusive output is experimental and uses an Epoch-derived input-token heuristic.

This is not lifecycle CO₂ accounting and not tailpipe-emissions equivalence.

## Development

```bash
npm install
npm run precommit
```

The package structure mirrors the other local Pi extension packages:

```text
index.ts
src/
test/
README.md
LICENSE
AGENTS.md
NORTH-STAR.md
package.json
tsconfig.json
vitest.config.ts
```

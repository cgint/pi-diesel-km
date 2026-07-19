# pi-diesel-km

Pi extension that displays LLM energy consumption as an equivalent **5L/100km diesel-car distance**.

## Why

Running local or cloud LLMs costs real electricity — but the numbers in Pi's token counters don't translate well into something intuitive. This extension bridges that gap: after each turn, your Pi footer shows a compact `🚗~12cm` indicator. Run `/diesel-km` for a full session breakdown.

It makes the invisible visible: you can **compare models side-by-side**, see which ones are energy-heavy, and get a tangible sense of what your homelab inference is actually drawing.

## How It Works

The extension uses a TypeScript port of **[EcoLogits](https://github.com/genai-impact/ecologits)** request-energy math, backed by EcoLogits' `models.json` when available:

- **Model-aware estimates** — when EcoLogits metadata is found, energy is computed from model architecture (active/total parameters), deployment data (TPS, TTFT), and provider PUE
- **Fallback** — when model metadata is missing, falls back to a 2024 EcoLogits baseline and labels the estimate explicitly
- **Context-inclusive** — experimental Epoch-derived heuristic adds input-token energy (labeled as such)

Energy is then converted to diesel distance using: `5L/100km × 9.8 kWh/L = 0.49 kWh/km`.

### Data & Attribution

| Source | Role | Link |
|---|---|---|
| **[EcoLogits](https://github.com/genai-impact/ecologits)** | Request-energy formula, model architecture database, provider PUE values | `genai-impact/ecologits` |
| **[Epoch AI](https://epoch.ai/)** | Input-token energy heuristic (experimental context-inclusive adder) | epoch.ai |

The EcoLogits constants, provider PUE ranges, and energy formula are mirrored from the upstream project. This extension is **not** lifecycle CO₂ accounting or tailpipe-emissions equivalence — it is an energy-content comparison.

## Installation

```bash
pi install npm:pi-diesel-km
```

## Usage

```text
/diesel-km       # Full session energy and diesel-distance breakdown
```

Compact footer status (e.g. `🚗~12cm`) updates automatically after turns with assistant output.

## Configuration

```bash
export ECOLOGITS_MODELS_JSON=~/path/to/ecologits/ecologits/data/models.json
```

Default: `~/dev-external/ecologits/ecologits/data/models.json`. If the file is missing or unparsable, the extension continues with fallback estimates.

## Requirements

- pi >= 0.74.0

## License

MIT
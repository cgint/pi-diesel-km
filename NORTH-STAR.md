# NORTH-STAR

## Purpose

Diesel-KM makes LLM session energy visible by translating estimated request energy into a familiar diesel-car distance comparison.

It should help with:

1. **Visibility.** Show a compact footer signal for accumulated session energy.
2. **Inspection.** Provide `/diesel-km` for detailed model-aware breakdowns.
3. **Honesty.** Clearly distinguish EcoLogits-derived generated-token estimates from experimental context-token heuristics.

## Design Principles

- **Transparent assumptions.** Constants, PUE values, and heuristic inputs must be visible in command output or docs.
- **Model-aware when possible.** Prefer EcoLogits model metadata; fall back explicitly when a model is unknown.
- **No false precision.** Format tiny values readably and keep ranges where inputs are uncertain.
- **Non-invasive UI.** Use Pi status mechanisms instead of replacing core footer behavior.

## Scope

- Tracks assistant usage metadata from the current session branch.
- Estimates generated-token energy using the local EcoLogits TypeScript port.
- Adds an experimental context-inclusive estimate.
- Registers `/diesel-km` and updates a compact footer status entry.

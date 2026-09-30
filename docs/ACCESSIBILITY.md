# Accessibility Contract

The operational state must remain understandable without relying only on color.

## Implemented guarantees

- State glyphs provide non-color status cues.
- A keyboard skip link moves focus to the mission workspace.
- Primary workspaces use tab semantics with Arrow, Home, and End keyboard navigation.
- Toggle-like controls expose pressed state.
- The mission status bar is announced as a polite live region.
- The causal topology has a text equivalent describing current node status, capacity, and reserve.
- Native buttons, labels, and range inputs are used for interactive controls.
- Visible keyboard focus treatment is enforced.
- Reduced-motion preferences disable propagation animation.
- Forced-colors mode retains a visible focus outline.
- Audit views provide textual equivalents for important state transitions.
- Responsive layouts preserve reading order across narrower screens.

## Automated contract

`npm run a11y` prevents accidental removal of the core keyboard, semantic, text-equivalent, focus, and reduced-motion guarantees. It runs inside `npm run verify` on Linux and Windows CI.

This is a structural regression gate, not a claim of complete accessibility certification.

## Manual finalist evidence

Before presentation, perform a keyboard-only walkthrough and an assistive-technology pass on the actual presentation machine. Record any discovered issue and its disposition rather than converting automated checks into a certification claim.

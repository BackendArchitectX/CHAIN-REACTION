import React from 'react';

type State = { failed: boolean };

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[CHAIN//REACTION] Unhandled UI failure', {
      name: error.name,
      message: error.message,
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.failed) {
      return <main className="stack" role="alert">
        <section className="panel technical-note">
          <div>
            <b>SAFE UI RECOVERY MODE</b>
            <span>The presentation layer encountered an unexpected error. Simulation data is not being represented as current.</span>
            <span>Reload the application. If the failure repeats, run the repository diagnostics before continuing the demo.</span>
          </div>
          <button onClick={() => window.location.reload()}>RELOAD APPLICATION</button>
        </section>
      </main>;
    }
    return this.props.children;
  }
}

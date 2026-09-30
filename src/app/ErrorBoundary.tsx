import React from 'react';

type State = { failed: boolean; message?: string };

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(error: Error): State {
    return { failed: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[CHAIN//REACTION] Unhandled UI failure', error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return <main className="stack" role="alert">
        <section className="panel technical-note">
          <div>
            <b>SAFE UI RECOVERY MODE</b>
            <span>The presentation layer encountered an unexpected error. Simulation data has not been represented as current.</span>
            {this.state.message && <code>{this.state.message}</code>}
          </div>
          <button onClick={() => window.location.reload()}>RELOAD APPLICATION</button>
        </section>
      </main>;
    }
    return this.props.children;
  }
}

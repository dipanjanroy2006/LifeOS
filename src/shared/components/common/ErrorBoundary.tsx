import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in LifeOS application:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="w-full max-w-md bg-[#121215]/80 border border-rose-500/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl text-center space-y-5 relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Application Failure</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                An unexpected exception has crashed the runtime engine. We have logged the error details.
              </p>
              {this.state.error && (
                <pre className="text-[10px] font-mono bg-zinc-950 p-3 rounded-lg border border-white/5 text-rose-300 max-h-32 overflow-auto text-left">
                  {this.state.error.message}
                </pre>
              )}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset Application State
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

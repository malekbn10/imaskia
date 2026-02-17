"use client";

import React from "react";
import GlassCard from "./GlassCard";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <GlassCard className="p-6 text-center">
          <p className="mb-2 text-lg font-semibold text-danger">
            Something went wrong
          </p>
          <p className="mb-4 text-sm text-slate-gray">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-night-blue"
          >
            Retry
          </button>
        </GlassCard>
      );
    }

    return this.props.children;
  }
}

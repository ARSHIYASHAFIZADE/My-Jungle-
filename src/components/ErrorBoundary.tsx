'use client'

import React from 'react'

interface State {
  hasError: boolean
}

export class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#010508', color: 'rgba(255,255,255,0.5)',
            fontSize: 14, fontFamily: 'sans-serif',
          }}>
            WebGL failed to load. Try refreshing or use a different browser.
          </div>
        )
      )
    }
    return this.props.children
  }
}

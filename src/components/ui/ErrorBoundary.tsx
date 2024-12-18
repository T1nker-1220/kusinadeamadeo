"use client"

import React from 'react'
import { Button } from './Button'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to your preferred error monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h2 className="mb-4 font-display text-2xl font-bold">Something went wrong</h2>
          <p className="mb-6 text-text-secondary">We apologize for the inconvenience.</p>
          <Button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.href = '/'
            }}
          >
            Return to Home
          </Button>
        </div>
      )
    }

    return this.props.children
  }
} 
"use client";

import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryInnerProps extends ErrorBoundaryProps {
  onError?: (error: Error) => void;
}

class ErrorBoundaryInner extends React.Component<ErrorBoundaryInnerProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryInnerProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
          <div className="mx-auto max-w-max">
            <main className="sm:flex">
              <p className="text-4xl font-bold tracking-tight text-indigo-600 sm:text-5xl">Oops!</p>
              <div className="sm:ml-6">
                <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Something went wrong
                  </h1>
                  <p className="mt-1 text-base text-gray-500">
                    {this.state.error?.message || "An unexpected error occurred"}
                  </p>
                </div>
                <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                  <Button
                    onClick={() => {
                      this.setState({ hasError: false, error: null });
                      window.location.reload();
                    }}
                    className="bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    Try again
                  </Button>
                  <Link href="/">
                    <Button variant="outline">Go back home</Button>
                  </Link>
                </div>
              </div>
            </main>
          </div>

          <div className="mx-auto max-w-7xl mt-16 px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-gray-50 px-6 py-8">
              <div className="mx-auto max-w-prose text-center">
                <h2 className="text-lg font-semibold text-gray-900">Technical Details</h2>
                <div className="mt-4 rounded bg-gray-100 p-4">
                  <pre className="text-left text-sm text-gray-800 overflow-auto">
                    <code>
                      {this.state.error?.stack || "No stack trace available"}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const { toast } = useToast();

  const handleError = (error: Error) => {
    toast({
      title: "Something went wrong",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
  };

  return (
    <ErrorBoundaryInner onError={handleError}>
      {children}
    </ErrorBoundaryInner>
  );
}

// Higher-order component to wrap pages with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Custom hook for error handling
export function useErrorHandler() {
  const { toast } = useToast();

  return (error: Error) => {
    console.error("Error caught:", error);
    toast({
      title: "Error",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
  };
}
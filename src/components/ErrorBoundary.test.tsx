import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ErrorBoundary, { type ErrorFallbackProps } from './ErrorBoundary';

// Test component that throws errors
const ThrowError = ({ shouldError = false, message = 'Test error' }) => {
  if (shouldError) {
    throw new Error(message);
  }
  return <div>No error</div>;
};

// Test component that throws async errors
const AsyncThrowError = ({ shouldError = false }) => {
  if (shouldError) {
    // This simulates an async error that happens during render
    Promise.reject(new Error('Async error'));
  }
  return <div>No async error</div>;
};

// Custom fallback component for testing
const CustomFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <div data-testid="custom-fallback">
    <h2>Custom Error UI</h2>
    <p>Custom error: {error.message}</p>
    <button onClick={resetError}>Reset</button>
  </div>
);

describe('ErrorBoundary', () => {
  // Suppress console.error during tests to avoid noise
  let consoleSpy: ReturnType<typeof vi.spyOn>;
  
  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Normal Operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Normal content')).toBeInTheDocument();
    });

    it('should not show fallback UI when no error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldError={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Error Catching', () => {
    it('should catch errors and show default fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldError={true} message="Something broke" />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Error: Something broke')).toBeInTheDocument();
      expect(screen.getByText('Try again')).toBeInTheDocument();
    });

    it('should catch different types of errors', () => {
      const TestError = () => {
        throw new TypeError('Type error occurred');
      };

      render(
        <ErrorBoundary>
          <TestError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Error: Type error occurred')).toBeInTheDocument();
    });

    it('should catch errors from nested components', () => {
      const NestedError = () => (
        <div>
          <div>
            <ThrowError shouldError={true} message="Nested error" />
          </div>
        </div>
      );

      render(
        <ErrorBoundary>
          <NestedError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Error: Nested error')).toBeInTheDocument();
    });
  });

  describe('Custom Fallback UI', () => {
    it('should use custom fallback component when provided', () => {
      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldError={true} message="Custom error test" />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
      expect(screen.getByText('Custom error: Custom error test')).toBeInTheDocument();
    });

    it('should pass error and resetError to custom fallback', () => {
      const fallbackSpy = vi.fn();
      const CustomFallbackWithSpy: React.FC<ErrorFallbackProps> = (props) => {
        fallbackSpy(props);
        return <div>Custom fallback</div>;
      };

      render(
        <ErrorBoundary fallback={CustomFallbackWithSpy}>
          <ThrowError shouldError={true} message="Test message" />
        </ErrorBoundary>
      );

                    expect(fallbackSpy).toHaveBeenCalledWith({
         error: expect.any(Error),
         resetError: expect.any(Function)
       });
       expect(fallbackSpy.mock.calls[0][0].error.message).toBe('Test message');
    });
  });

  describe('Error Recovery', () => {
    it('should reset error state when retry button is clicked', () => {
      let shouldError = true;
      const DynamicError = () => {
        if (shouldError) {
          throw new Error('Dynamic error');
        }
        return <div>Recovered!</div>;
      };

      render(
        <ErrorBoundary>
          <DynamicError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Simulate fixing the error
      shouldError = false;
      fireEvent.click(screen.getByText('Try again'));

      expect(screen.getByText('Recovered!')).toBeInTheDocument();
    });

    it('should work with custom fallback reset', () => {
      let shouldError = true;
      const DynamicError = () => {
        if (shouldError) {
          throw new Error('Custom reset test');
        }
        return <div>Custom recovery!</div>;
      };

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <DynamicError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();

      shouldError = false;
      fireEvent.click(screen.getByText('Reset'));

      expect(screen.getByText('Custom recovery!')).toBeInTheDocument();
    });
  });

  describe('Error Callback', () => {
    it('should call onError callback when error occurs', () => {
      const onErrorSpy = vi.fn();

      render(
        <ErrorBoundary onError={onErrorSpy}>
          <ThrowError shouldError={true} message="Callback test" />
        </ErrorBoundary>
      );

      expect(onErrorSpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      );
      expect(onErrorSpy.mock.calls[0][0].message).toBe('Callback test');
    });

    it('should not call onError when no error occurs', () => {
      const onErrorSpy = vi.fn();

      render(
        <ErrorBoundary onError={onErrorSpy}>
          <ThrowError shouldError={false} />
        </ErrorBoundary>
      );

      expect(onErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('Integration with Real Components', () => {
    it('should catch errors from task components', () => {
      // Mock a task component that throws an error
      const BrokenTaskComponent = () => {
        throw new Error('Task rendering failed');
      };

      render(
        <ErrorBoundary>
          <div>
            <h1>Task Dashboard</h1>
            <BrokenTaskComponent />
          </div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Error: Task rendering failed')).toBeInTheDocument();
    });

    it('should isolate errors to specific boundaries', () => {
      const BrokenComponent = () => {
        throw new Error('Isolated error');
      };

      render(
        <div>
          <h1>App Header</h1>
          <ErrorBoundary>
            <BrokenComponent />
          </ErrorBoundary>
          <div>Other content</div>
        </div>
      );

      // Error boundary should catch the error
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      
      // Other content should still render
      expect(screen.getByText('App Header')).toBeInTheDocument();
      expect(screen.getByText('Other content')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null error messages', () => {
      const NullErrorComponent = () => {
        const error = new Error();
        error.message = '';
        throw error;
      };

      render(
        <ErrorBoundary>
          <NullErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Error:')).toBeInTheDocument(); // Empty message
    });

    it('should handle very long error messages', () => {
      const longMessage = 'This is a very long error message that should still be displayed correctly in the UI without breaking the layout or causing other issues';

      render(
        <ErrorBoundary>
          <ThrowError shouldError={true} message={longMessage} />
        </ErrorBoundary>
      );

      expect(screen.getByText(`Error: ${longMessage}`)).toBeInTheDocument();
    });

    it("should handle multiple consecutive errors", async () => {
      let shouldError = true;
      let errorMessage = "First error";
      
      const ConditionalErrorComponent = () => {
        if (shouldError) {
          throw new Error(errorMessage);
        }
        return <div>No error</div>;
      };

      render(
        <ErrorBoundary>
          <ConditionalErrorComponent />
        </ErrorBoundary>
      );

      // First error should be caught
      expect(screen.getByText('Error: First error')).toBeInTheDocument();

      // Change the error message and trigger another error
      errorMessage = "Second error";
      fireEvent.click(screen.getByText('Try again'));
      
      // Wait for the component to re-render and throw the second error
      await waitFor(() => {
        expect(screen.getByText('Error: Second error')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldError={true} message="Accessibility test" />
        </ErrorBoundary>
      );

      const alertElement = screen.getByRole('alert');
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveClass('error-boundary');
    });

    it('should have focusable retry button', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldError={true} message="Focus test" />
        </ErrorBoundary>
      );

      const retryButton = screen.getByText('Try again');
      expect(retryButton).toBeInTheDocument();
      retryButton.focus();
      expect(retryButton).toHaveFocus();
    });
  });
}); 
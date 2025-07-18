import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import ErrorBoundary from './ErrorBoundary';
import Dashboard from '../pages/app/dashboard';
import { useAuth } from '@/store/authContext';
import { useTasks } from '@/hooks/useTasks';
import api from '@/store/api';

// Mock the dependencies
vi.mock('@/store/authContext');
vi.mock('@/hooks/useTasks');
vi.mock('@/store/api');
vi.mock('@/layouts/app-layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock useTasks that can throw errors
const mockUseTasks = (shouldError = false) => {
  if (shouldError) {
    throw new Error('Failed to load tasks');
  }
  return {
    tasks: [],
    fetchTasks: vi.fn(),
    createTask: vi.fn(),
    toggleComplete: vi.fn(),
    loading: false,
    isTaskActionLoading: false,
  };
};

describe('Dashboard with Error Boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console errors during tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock useAuth
    (useAuth as any).mockReturnValue({
      user: { username: 'TestUser' },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Normal Operation', () => {
    it('should render dashboard normally when no errors', () => {
      (useTasks as any).mockReturnValue(mockUseTasks(false));

      render(
        <ErrorBoundary>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </ErrorBoundary>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome, TestUser')).toBeInTheDocument();
    });
  });

  describe('Error Scenarios', () => {
    it('should catch hook errors and show fallback UI', () => {
      (useTasks as any).mockImplementation(() => mockUseTasks(true));

      render(
        <ErrorBoundary>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Error: Failed to load tasks')).toBeInTheDocument();
      expect(screen.getByText('Try again')).toBeInTheDocument();
    });

    it('should handle API errors gracefully', () => {
      // Mock API to throw error
      (useTasks as any).mockImplementation(() => {
        throw new Error('Network connection failed');
      });

      render(
        <ErrorBoundary>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </ErrorBoundary>
      );

      expect(screen.getByText('Error: Network connection failed')).toBeInTheDocument();
    });

    it('should recover from errors when retry is clicked', () => {
      let shouldError = true;
      
      (useTasks as any).mockImplementation(() => {
        if (shouldError) {
          throw new Error('Temporary error');
        }
        return mockUseTasks(false);
      });

      render(
        <ErrorBoundary>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </ErrorBoundary>
      );

      expect(screen.getByText('Error: Temporary error')).toBeInTheDocument();

      // Simulate error being fixed
      shouldError = false;
      fireEvent.click(screen.getByText('Try again'));

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome, TestUser')).toBeInTheDocument();
    });
  });

  describe('Custom Error UI for Dashboard', () => {
    it('should use custom dashboard error fallback', () => {
      const DashboardErrorFallback = ({ error, resetError }: any) => (
        <div data-testid="dashboard-error">
          <h2>Dashboard Error</h2>
          <p>Could not load your tasks: {error.message}</p>
          <button onClick={resetError}>Reload Dashboard</button>
        </div>
      );

      (useTasks as any).mockImplementation(() => {
        throw new Error('Dashboard loading failed');
      });

      render(
        <ErrorBoundary fallback={DashboardErrorFallback}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('dashboard-error')).toBeInTheDocument();
      expect(screen.getByText('Dashboard Error')).toBeInTheDocument();
      expect(screen.getByText('Could not load your tasks: Dashboard loading failed')).toBeInTheDocument();
      expect(screen.getByText('Reload Dashboard')).toBeInTheDocument();
    });
  });

  describe('Error Isolation', () => {
    it('should isolate task errors from other dashboard parts', () => {
      const TaskComponent = ({ shouldError }: { shouldError: boolean }) => {
        if (shouldError) {
          throw new Error('Task component error');
        }
        return <div>Task component</div>;
      };

      render(
        <div>
          <h1>App Header</h1>
          <ErrorBoundary>
            <TaskComponent shouldError={true} />
          </ErrorBoundary>
          <div>Other dashboard content</div>
        </div>
      );

      // Error boundary should catch the error
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      
      // Other content should still render
      expect(screen.getByText('App Header')).toBeInTheDocument();
      expect(screen.getByText('Other dashboard content')).toBeInTheDocument();
    });
  });

  describe('Real World Error Scenarios', () => {
    it('should handle auth errors', () => {
      (useAuth as any).mockImplementation(() => {
        throw new Error('Authentication failed');
      });

      render(
        <ErrorBoundary>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </ErrorBoundary>
      );

      expect(screen.getByText('Error: Authentication failed')).toBeInTheDocument();
    });

    it('should handle render errors in task list', () => {
      (useTasks as any).mockReturnValue({
        tasks: [null, undefined, {}], // Malformed task data
        fetchTasks: vi.fn(),
        createTask: vi.fn(),
        toggleComplete: vi.fn(),
        loading: false,
        isTaskActionLoading: false,
      });

      // Mock Dashboard to throw error when rendering malformed tasks
      const ErrorProneComponent = () => {
        const tasks = [null, undefined, {}];
        return (
          <div>
            {tasks.map((task: any) => (
              <div key={task.id}>{task.title}</div> // This will throw
            ))}
          </div>
        );
      };

      render(
        <ErrorBoundary>
          <ErrorProneComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Production-like Error Logging', () => {
    it('should log errors for monitoring', () => {
      const errorLogger = vi.fn();
      
      (useTasks as any).mockImplementation(() => {
        throw new Error('Production error');
      });

      render(
        <ErrorBoundary onError={errorLogger}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </ErrorBoundary>
      );

      expect(errorLogger).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      );
      expect(errorLogger.mock.calls[0][0].message).toBe('Production error');
    });
  });
}); 
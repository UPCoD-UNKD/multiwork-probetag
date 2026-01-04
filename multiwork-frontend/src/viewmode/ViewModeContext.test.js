import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { ViewModeProvider, useViewMode } from './ViewModeContext';

const TestComponent = () => {
  const { viewMode, isDesktop, isMobile, isAutoDetect, toggleViewMode, setMode, toggleAutoDetect } = useViewMode();
  return (
    <div>
      <div data-testid="viewMode">{viewMode}</div>
      <div data-testid="isDesktop">{isDesktop.toString()}</div>
      <div data-testid="isMobile">{isMobile.toString()}</div>
      <div data-testid="isAutoDetect">{isAutoDetect.toString()}</div>
      <button onClick={toggleViewMode}>Toggle</button>
      <button onClick={() => setMode('desktop')}>Set Desktop</button>
      <button onClick={() => setMode('mobile')}>Set Mobile</button>
      <button onClick={toggleAutoDetect}>Toggle Auto</button>
    </div>
  );
};

describe('ViewModeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  test('detects desktop mode for wide screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    );

    expect(screen.getByTestId('viewMode')).toHaveTextContent('desktop');
    expect(screen.getByTestId('isDesktop')).toHaveTextContent('true');
    expect(screen.getByTestId('isMobile')).toHaveTextContent('false');
  });

  test('detects mobile mode for narrow screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    );

    expect(screen.getByTestId('viewMode')).toHaveTextContent('mobile');
    expect(screen.getByTestId('isDesktop')).toHaveTextContent('false');
    expect(screen.getByTestId('isMobile')).toHaveTextContent('true');
  });

  test('uses saved mode from localStorage', () => {
    localStorage.setItem('viewMode', 'mobile');
    localStorage.setItem('viewModeAutoDetect', 'false');

    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    );

    expect(screen.getByTestId('viewMode')).toHaveTextContent('mobile');
  });

  test('toggles view mode', () => {
    localStorage.setItem('viewModeAutoDetect', 'false');
    localStorage.setItem('viewMode', 'mobile');

    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    );

    expect(screen.getByTestId('viewMode')).toHaveTextContent('mobile');

    act(() => {
      screen.getByText('Toggle').click();
    });

    expect(screen.getByTestId('viewMode')).toHaveTextContent('desktop');
  });

  test('sets mode explicitly', () => {
    localStorage.setItem('viewModeAutoDetect', 'false');

    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    );

    act(() => {
      screen.getByText('Set Desktop').click();
    });

    expect(screen.getByTestId('viewMode')).toHaveTextContent('desktop');

    act(() => {
      screen.getByText('Set Mobile').click();
    });

    expect(screen.getByTestId('viewMode')).toHaveTextContent('mobile');
  });

  test('ignores invalid mode', () => {
    localStorage.setItem('viewModeAutoDetect', 'false');
    localStorage.setItem('viewMode', 'mobile');

    const InvalidModeComponent = () => {
      const { viewMode, setMode } = useViewMode();
      return (
        <div>
          <div data-testid="viewMode">{viewMode}</div>
          <button onClick={() => setMode('invalid')}>Invalid</button>
        </div>
      );
    };

    render(
      <ViewModeProvider>
        <InvalidModeComponent />
      </ViewModeProvider>
    );

    const initialMode = screen.getByTestId('viewMode').textContent;

    act(() => {
      screen.getByText('Invalid').click();
    });

    expect(screen.getByTestId('viewMode').textContent).toBe(initialMode);
  });

  test('toggles auto detect', () => {
    localStorage.setItem('viewModeAutoDetect', 'false');

    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    );

    expect(screen.getByTestId('isAutoDetect')).toHaveTextContent('false');

    act(() => {
      screen.getByText('Toggle Auto').click();
    });

    expect(screen.getByTestId('isAutoDetect')).toHaveTextContent('true');
  });

  test('updates mode on window resize when auto detect is enabled', async () => {
    localStorage.setItem('viewModeAutoDetect', 'true');
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    );

    expect(screen.getByTestId('viewMode')).toHaveTextContent('mobile');

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });
      fireEvent(window, new Event('resize'));
    });

    // Wait for resize handler using waitFor with reasonable timeout
    await waitFor(() => {
      expect(screen.getByTestId('viewMode')).toHaveTextContent('desktop');
    }, { timeout: 1000 });
  });

  test('adds desktop-body class when in desktop mode', () => {
    localStorage.setItem('viewModeAutoDetect', 'false');
    localStorage.setItem('viewMode', 'desktop');

    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    );

    expect(document.body.classList.contains('desktop-body')).toBe(true);
  });

  test('removes desktop-body class when in mobile mode', () => {
    localStorage.setItem('viewModeAutoDetect', 'false');
    localStorage.setItem('viewMode', 'mobile');

    render(
      <ViewModeProvider>
        <TestComponent />
      </ViewModeProvider>
    );

    expect(document.body.classList.contains('desktop-body')).toBe(false);
  });

  test('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    const ComponentWithoutProvider = () => {
      useViewMode();
      return <div>Test</div>;
    };

    expect(() => {
      render(<ComponentWithoutProvider />);
    }).toThrow('useViewMode must be used within ViewModeProvider');

    consoleError.mockRestore();
  });
});

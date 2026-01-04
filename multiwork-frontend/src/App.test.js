import { screen } from '@testing-library/react';
import App from './App';
import { renderWithProviders } from './test-utils/testHelpers';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  ToastContainer: () => null,
}));

// Mock Sentry
jest.mock('@sentry/react', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
}));

test('renders app without crashing', () => {
  renderWithProviders(<App />);
  // App should render without errors
  expect(document.body).toBeTruthy();
});

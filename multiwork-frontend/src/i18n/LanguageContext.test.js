import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';

// Mock translations
jest.mock('./translations', () => ({
  translations: {
    en: {
      auth: {
        login: 'Login',
        logout: 'Logout',
      },
    },
    ru: {
      auth: {
        login: 'Вход',
        logout: 'Выход',
      },
    },
    uk: {
      auth: {
        login: 'Вхід',
        logout: 'Вихід',
      },
    },
  },
}));

const TestComponent = () => {
  const { language, changeLanguage, t } = useLanguage();
  return (
    <div>
      <div data-testid="language">{language}</div>
      <div data-testid="translation">{t('auth.login')}</div>
      <button onClick={() => changeLanguage('ru')}>Change to RU</button>
      <button onClick={() => changeLanguage('en')}>Change to EN</button>
    </div>
  );
};

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'en-US',
    });
  });

  test('provides default language from browser', () => {
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'ru-RU',
    });

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('language')).toHaveTextContent('ru');
  });

  test('uses saved language from localStorage', () => {
    localStorage.setItem('appLanguage', 'uk');

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('language')).toHaveTextContent('uk');
  });

  test('changes language and saves to localStorage', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('language')).toHaveTextContent('en');

    act(() => {
      screen.getByText('Change to RU').click();
    });

    expect(screen.getByTestId('language')).toHaveTextContent('ru');
    expect(localStorage.getItem('appLanguage')).toBe('ru');
  });

  test('translates text correctly', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('translation')).toHaveTextContent('Login');

    act(() => {
      screen.getByText('Change to RU').click();
    });

    expect(screen.getByTestId('translation')).toHaveTextContent('Вход');
  });

  test('returns key when translation is missing', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const MissingTranslationComponent = () => {
      const { t } = useLanguage();
      return <div data-testid="missing">{t('missing.key')}</div>;
    };

    render(
      <LanguageProvider>
        <MissingTranslationComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('missing')).toHaveTextContent('missing.key');
    // Translation missing may or may not log a warning depending on implementation
    consoleSpy.mockRestore();
  });

  test('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    const ComponentWithoutProvider = () => {
      useLanguage();
      return <div>Test</div>;
    };

    expect(() => {
      render(<ComponentWithoutProvider />);
    }).toThrow('useLanguage must be used within LanguageProvider');

    consoleError.mockRestore();
  });

  test('ignores invalid language changes', () => {
    const InvalidLanguageComponent = () => {
      const { language, changeLanguage } = useLanguage();
      return (
        <div>
          <div data-testid="language">{language}</div>
          <button onClick={() => changeLanguage('invalid')}>Invalid</button>
        </div>
      );
    };

    render(
      <LanguageProvider>
        <InvalidLanguageComponent />
      </LanguageProvider>
    );

    const initialLanguage = screen.getByTestId('language').textContent;

    act(() => {
      screen.getByText('Invalid').click();
    });

    expect(screen.getByTestId('language').textContent).toBe(initialLanguage);
  });
});

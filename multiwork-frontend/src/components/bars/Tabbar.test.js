import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Tabbar from './Tabbar';
import { renderWithRouter } from '../../test-utils/testHelpers';

describe('Tabbar', () => {
  test('renders all navigation links', () => {
    renderWithRouter(<Tabbar show="flex" />);
    
    // Check that tabbar is rendered with links
    const tabbar = screen.getByRole('navigation') || document.querySelector('.tabbar');
    expect(tabbar).toBeInTheDocument();
    
    // Check for at least one navigation link
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  test('hides tabbar when show is none', () => {
    const { container } = renderWithRouter(<Tabbar show="none" />);
    const tabbar = container.querySelector('.tabbar');
    expect(tabbar).toHaveStyle({ display: 'none' });
  });

  test('shows tabbar when show is flex', () => {
    const { container } = renderWithRouter(<Tabbar show="flex" />);
    const tabbar = container.querySelector('.tabbar');
    expect(tabbar).toHaveStyle({ display: 'flex' });
  });

  test('renders navigation links', () => {
    renderWithRouter(<Tabbar show="flex" />, { initialEntries: ['/home'] });
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});

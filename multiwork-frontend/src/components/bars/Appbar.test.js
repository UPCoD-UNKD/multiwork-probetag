import React from 'react';
import { screen } from '@testing-library/react';
import Appbar from './Appbar';
import { renderWithRouter } from '../../test-utils/testHelpers';

describe('Appbar', () => {
  test('renders appbar with logo', () => {
    renderWithRouter(<Appbar show="flex" />);
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
  });

  test('hides appbar when show is none', () => {
    const { container } = renderWithRouter(<Appbar show="none" />);
    const appbar = container.querySelector('.appbar');
    expect(appbar).toHaveStyle({ display: 'none' });
  });

  test('shows appbar when show is flex', () => {
    const { container } = renderWithRouter(<Appbar show="flex" />);
    const appbar = container.querySelector('.appbar');
    expect(appbar).toHaveStyle({ display: 'flex' });
  });

  test('has back button', () => {
    const { container } = renderWithRouter(<Appbar show="flex" />);
    // Find back button by finding Link in left icons container
    const leftIcons = container.querySelector('.icons.left');
    expect(leftIcons).toBeInTheDocument();
    const backLink = leftIcons.querySelector('a');
    expect(backLink).toBeInTheDocument();
  });

  test('has navigation links', () => {
    renderWithRouter(<Appbar show="flex" />);
    // Check that appbar has links
    const allLinks = screen.getAllByRole('link');
    expect(allLinks.length).toBeGreaterThan(0);
  });
});

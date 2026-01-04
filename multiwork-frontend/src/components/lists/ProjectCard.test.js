import React from 'react';
import { screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';
import { renderWithRouter } from '../../test-utils/testHelpers';

describe('ProjectCard', () => {
  const defaultProps = {
    id: 1,
    title: 'Test Project',
    desc: 'Test Description',
    logo: '/test-logo.png',
    status: 'Active',
    color: '#00ff00',
    members: 5,
  };

  test('renders project card with all props', () => {
    renderWithRouter(<ProjectCard {...defaultProps} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText(/Members:/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('renders link when valid id is provided', () => {
    renderWithRouter(<ProjectCard {...defaultProps} id={1} />);
    
    const link = screen.getByRole('link', { name: /view/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/project/1');
  });

  test('renders disabled span when id is invalid', () => {
    renderWithRouter(<ProjectCard {...defaultProps} id={undefined} />);
    
    const viewElement = screen.getByText('View');
    expect(viewElement).toBeInTheDocument();
    expect(viewElement.tagName).toBe('SPAN');
  });

  test('renders disabled span when id is null', () => {
    renderWithRouter(<ProjectCard {...defaultProps} id={null} />);
    
    const viewElement = screen.getByText('View');
    expect(viewElement).toBeInTheDocument();
    expect(viewElement.tagName).toBe('SPAN');
  });

  test('displays project logo', () => {
    renderWithRouter(<ProjectCard {...defaultProps} />);
    
    const logo = screen.getByAltText('Test Project');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/test-logo.png');
  });
});

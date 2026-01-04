import React from 'react';
import { render } from '@testing-library/react';
import LoadingSkeleton from './LoadingSkeleton';

describe('LoadingSkeleton', () => {
  test('renders card variant by default', () => {
    const { container } = render(<LoadingSkeleton />);
    const cards = container.querySelectorAll('.card');
    expect(cards.length).toBe(1);
  });

  test('renders multiple card skeletons', () => {
    const { container } = render(<LoadingSkeleton count={3} />);
    const cards = container.querySelectorAll('.card');
    expect(cards.length).toBe(3);
  });
});

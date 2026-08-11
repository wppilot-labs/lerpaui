import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiquidProgressTank } from './LiquidProgressTank';

describe('LiquidProgressTank', () => {
  it('uses a finite default progress', () => {
    render(<LiquidProgressTank />);
    expect(screen.getByText('65')).toBeInTheDocument();
  });

  it('clamps out-of-range and non-finite progress', () => {
    const { rerender } = render(<LiquidProgressTank progress={140} />);
    expect(screen.getByText('100')).toBeInTheDocument();

    rerender(<LiquidProgressTank progress={Number.NaN} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

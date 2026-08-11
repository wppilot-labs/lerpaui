import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadialProgressDraggable } from './RadialProgressDraggable';

describe('RadialProgressDraggable', () => {
  it('exposes a keyboard-accessible slider', async () => {
    const user = userEvent.setup();
    const onProgressChange = vi.fn();
    render(
      <RadialProgressDraggable
        defaultProgress={40}
        step={5}
        ariaLabel="Completion"
        onProgressChange={onProgressChange}
      />
    );

    const slider = screen.getByRole('slider', { name: 'Completion' });
    expect(slider).toHaveAttribute('aria-valuenow', '40');
    await user.click(slider);
    await user.keyboard('{ArrowRight}{PageUp}{Home}{End}');
    expect(slider).toHaveAttribute('aria-valuenow', '100');
    expect(onProgressChange).toHaveBeenLastCalledWith(100);
  });

  it('normalizes a non-finite default', () => {
    render(<RadialProgressDraggable defaultProgress={Number.NaN} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0');
  });
});

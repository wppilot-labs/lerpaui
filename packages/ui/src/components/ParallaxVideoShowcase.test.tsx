import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ParallaxVideoShowcase } from './ParallaxVideoShowcase';

describe('ParallaxVideoShowcase', () => {
  it('does not fetch a third-party video by default', () => {
    const { container } = render(<ParallaxVideoShowcase />);
    expect(container.querySelector('video')).not.toBeInTheDocument();
    expect(screen.getByTestId('video-placeholder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play video' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Unmute video' })).toBeDisabled();
  });

  it('renders working mute state for a supplied video', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ParallaxVideoShowcase
        videoUrl="/demo.mp4"
        captionsUrl="/demo.vtt"
        autoPlay={false}
        title="Demo reel"
      />
    );
    const video = container.querySelector('video');
    expect(video).toHaveAttribute('src', '/demo.mp4');
    expect(container.querySelector('track[kind="captions"]')).toHaveAttribute('src', '/demo.vtt');
    expect(screen.getByLabelText('Demo reel')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Unmute video' }));
    expect(screen.getByRole('button', { name: 'Mute video' })).toBeInTheDocument();
    expect(video?.muted).toBe(false);
  });
});

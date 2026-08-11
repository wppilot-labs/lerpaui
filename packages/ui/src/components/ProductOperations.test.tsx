import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApiKeyField } from './ApiKeyField';
import { AsyncActionButton } from './AsyncActionButton';
import { ConflictResolutionPanel } from './ConflictResolutionPanel';
import { ConnectionStatusBanner } from './ConnectionStatusBanner';
import { DataRefreshControl } from './DataRefreshControl';
import { DestructiveConfirmationField } from './DestructiveConfirmationField';
import { FilterChipGroup } from './FilterChipGroup';
import { QueryStatePanel } from './QueryStatePanel';
import { UploadQueue, type UploadQueueItem } from './UploadQueue';
import { ValidationSummary } from './ValidationSummary';

describe('product operations controls', () => {
  it('reports async action completion without allowing duplicate clicks', async () => {
    const user = userEvent.setup();
    let resolveAction!: () => void;
    const onAction = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveAction = resolve;
        })
    );
    render(<AsyncActionButton onAction={onAction} resetAfterMs={0} />);

    const button = screen.getByRole('button', { name: 'Save changes' });
    await user.click(button);
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onAction).toHaveBeenCalledTimes(1);

    resolveAction();
    expect(await screen.findByRole('button', { name: 'Saved' })).toHaveAttribute(
      'data-state',
      'success'
    );
  });

  it('exposes offline state and runs connection retry', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn().mockResolvedValue(undefined);
    render(<ConnectionStatusBanner status="offline" onRetry={onRetry} />);

    expect(screen.getByRole('status')).toHaveAttribute('data-status', 'offline');
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('keeps connection retry failures inside the status surface', async () => {
    const user = userEvent.setup();
    render(
      <ConnectionStatusBanner
        status="offline"
        onRetry={vi.fn().mockRejectedValue(new Error('still offline'))}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(await screen.findByText(/Retry failed/)).toBeInTheDocument();
  });

  it('supports additive filter chips and clearing the selection', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FilterChipGroup onValueChange={onValueChange} />);

    const active = screen.getByRole('button', { name: /Active/ });
    const trial = screen.getByRole('button', { name: /Trial/ });
    await user.click(active);
    await user.click(trial);
    expect(active).toHaveAttribute('aria-pressed', 'true');
    expect(trial).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(['active', 'trial']);

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it('announces upload progress and exposes retry and remove actions', async () => {
    const user = userEvent.setup();
    const item: UploadQueueItem = {
      id: 'report',
      name: 'report.csv',
      status: 'error',
      error: 'Network interrupted',
    };
    const uploading: UploadQueueItem = {
      id: 'media',
      name: 'media.zip',
      status: 'uploading',
      progress: 48,
    };
    const onRetry = vi.fn();
    const onRemove = vi.fn();
    render(<UploadQueue items={[item, uploading]} onRetry={onRetry} onRemove={onRemove} />);

    expect(screen.getByRole('progressbar', { name: /media.zip upload progress/i })).toHaveAttribute(
      'aria-valuenow',
      '48'
    );
    await user.click(screen.getByRole('button', { name: 'Retry report.csv' }));
    await user.click(screen.getByRole('button', { name: 'Remove report.csv' }));
    expect(onRetry).toHaveBeenCalledWith(item);
    expect(onRemove).toHaveBeenCalledWith(item);
  });

  it('moves focus from a validation summary to its invalid field', async () => {
    const user = userEvent.setup();
    render(
      <>
        <label htmlFor="workspace-name">Workspace name</label>
        <input id="workspace-name" />
        <ValidationSummary
          errors={[
            {
              id: 'workspace-name-error',
              fieldId: 'workspace-name',
              message: 'Workspace name is required.',
            },
          ]}
        />
      </>
    );

    await user.click(screen.getByRole('button', { name: /Workspace name is required/i }));
    expect(screen.getByRole('textbox', { name: 'Workspace name' })).toHaveFocus();
  });

  it('runs an async data refresh and updates its status', async () => {
    const user = userEvent.setup();
    let resolveRefresh!: () => void;
    const onRefresh = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveRefresh = resolve;
        })
    );
    render(<DataRefreshControl onRefresh={onRefresh} />);

    const refresh = screen.getByRole('button', { name: 'Refresh data' });
    await user.click(refresh);
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(refresh).toHaveAttribute('aria-busy', 'true');
    resolveRefresh();
    await waitFor(() => expect(refresh).toHaveAttribute('aria-busy', 'false'));
    expect(screen.getByText('Updated just now')).toBeInTheDocument();
  });

  it('applies the selected conflict resolution', async () => {
    const user = userEvent.setup();
    const onResolutionChange = vi.fn();
    const onApply = vi.fn().mockResolvedValue(undefined);
    render(<ConflictResolutionPanel onResolutionChange={onResolutionChange} onApply={onApply} />);

    await user.click(screen.getByRole('radio', { name: 'Cloud version' }));
    expect(onResolutionChange).toHaveBeenCalledWith('remote');
    await user.click(screen.getByRole('button', { name: 'Apply selected version' }));
    expect(onApply).toHaveBeenCalledWith('remote');
  });

  it('reports conflict apply failures without discarding the selection', async () => {
    const user = userEvent.setup();
    render(<ConflictResolutionPanel onApply={vi.fn().mockRejectedValue(new Error('conflict'))} />);

    await user.click(screen.getByRole('button', { name: 'Apply selected version' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Nothing was changed');
    expect(screen.getByRole('radio', { name: 'This device' })).toBeChecked();
  });

  it('provides recovery actions for error and empty query states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const onClearFilters = vi.fn();
    const { rerender } = render(<QueryStatePanel state="error" onRetry={onRetry} />);

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(<QueryStatePanel state="empty" onClearFilters={onClearFilters} />);
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it('keeps an API key masked while copying the real value', async () => {
    const user = userEvent.setup();
    const originalClipboard = navigator.clipboard;
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const secret = 'lrp_test_1234567890abcdef';
    render(<ApiKeyField value={secret} />);
    const input = screen.getByRole('textbox', { name: 'API key' });
    expect(input).not.toHaveValue(secret);

    await user.click(screen.getByRole('button', { name: 'Show API key' }));
    expect(input).toHaveValue(secret);
    await user.click(screen.getByRole('button', { name: 'Copy API key' }));
    expect(writeText).toHaveBeenCalledWith(secret);
    expect(screen.getByText('Copied')).toBeInTheDocument();

    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    });
  });

  it('requires an exact confirmation phrase before a destructive action', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    render(<DestructiveConfirmationField onConfirm={onConfirm} />);

    const confirm = screen.getByRole('button', { name: 'Delete permanently' });
    expect(confirm).toBeDisabled();
    await user.type(screen.getByRole('textbox', { name: /Type DELETE to confirm/i }), 'delete');
    expect(confirm).toBeDisabled();
    await user.clear(screen.getByRole('textbox', { name: /Type DELETE to confirm/i }));
    await user.type(screen.getByRole('textbox', { name: /Type DELETE to confirm/i }), 'DELETE');
    expect(confirm).toBeEnabled();
    await user.click(confirm);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});

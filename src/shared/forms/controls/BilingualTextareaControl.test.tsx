import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BilingualTextareaControl } from './BilingualTextareaControl';

describe('BilingualTextareaControl', () => {
  it('renders textarea values and emits merged translation changes', () => {
    const onChange = vi.fn();

    render(
      <BilingualTextareaControl
        value={{ zh: '介绍', en: 'Intro' }}
        onChange={onChange}
        placeholder={{ zh: '中文介绍', en: 'English intro' }}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('English intro'), {
      target: { value: 'New intro' },
    });

    expect(screen.getByPlaceholderText('中文介绍')).toHaveValue('介绍');
    expect(onChange).toHaveBeenLastCalledWith({ zh: '介绍', en: 'New intro' });
  });
});

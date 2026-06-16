import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BilingualTextControl } from './BilingualTextControl';

describe('BilingualTextControl', () => {
  it('renders zh and en values and emits merged translation changes', () => {
    const onChange = vi.fn();

    render(
      <BilingualTextControl
        value={{ zh: '品牌', en: 'Brand' }}
        onChange={onChange}
        placeholder={{ zh: '中文名称', en: 'English name' }}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('中文名称'), {
      target: { value: '新品牌' },
    });

    expect(screen.getByPlaceholderText('English name')).toHaveValue('Brand');
    expect(onChange).toHaveBeenLastCalledWith({ zh: '新品牌', en: 'Brand' });
  });

  it('supports row layout for compact form sections', () => {
    const { container } = render(
      <BilingualTextControl
        value={{ zh: '', en: '' }}
        onChange={() => undefined}
        layout="row"
      />,
    );

    expect(container.querySelector('.flex-row')).toBeInTheDocument();
  });
});

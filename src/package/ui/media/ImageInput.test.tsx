import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { controllerMock } = vi.hoisted(() => ({
  controllerMock: {
    isUploading: false,
    error: null,
    duplicates: [],
    hasPendingUpload: false,
    selectFile: vi.fn(),
    reuseImage: vi.fn(),
    forceUpload: vi.fn(),
    clear: vi.fn(),
  },
}));

vi.mock('@/shared/media/model/useImageUploadController', () => ({
  useImageUploadController: vi.fn(() => controllerMock),
}));

import ImageInput from './ImageInput';

describe('ImageInput compatibility wrapper', () => {
  beforeEach(() => {
    controllerMock.selectFile.mockReset();
    controllerMock.reuseImage.mockReset();
    controllerMock.forceUpload.mockReset();
    controllerMock.clear.mockReset();
    controllerMock.error = null;
    controllerMock.duplicates = [];
    controllerMock.isUploading = false;
  });

  it('keeps the existing props and delegates file selection to the controller', async () => {
    const user = userEvent.setup();
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });

    render(
      <ImageInput
        label="上传图片"
        value=""
        onChange={() => undefined}
        aspectRatio="square"
        acceptType="image/*"
        maxWidth={400}
      />,
    );

    await user.upload(screen.getByLabelText('上传图片'), file);

    expect(controllerMock.selectFile).toHaveBeenCalledWith(file);
  });

  it('resets the file input after selection so the same file can be selected again', async () => {
    const user = userEvent.setup();
    const file = new File(['image'], 'image.jpg', { type: 'image/jpeg' });

    render(<ImageInput label="上传图片" value="" onChange={() => undefined} />);

    const input = screen.getByLabelText('上传图片') as HTMLInputElement;
    await user.upload(input, file);

    expect(input.value).toBe('');

    await user.upload(input, file);

    expect(controllerMock.selectFile).toHaveBeenCalledTimes(2);
  });

  it('renders controller errors', () => {
    controllerMock.error = '图片上传失败，请重试';

    render(<ImageInput value="" onChange={() => undefined} />);

    expect(screen.getByText('图片上传失败，请重试')).toBeInTheDocument();
  });
});

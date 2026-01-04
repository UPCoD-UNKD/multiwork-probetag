import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { useKeyboardNavigation, useFocusTrap } from './useKeyboardNavigation';

describe('useKeyboardNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls onEnter when Enter key is pressed', () => {
    const onEnter = jest.fn();
    const onEscape = jest.fn();

    renderHook(() => useKeyboardNavigation({ onEnter, onEscape }));

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(onEscape).not.toHaveBeenCalled();
  });

  test('calls onEscape when Escape key is pressed', () => {
    const onEnter = jest.fn();
    const onEscape = jest.fn();

    renderHook(() => useKeyboardNavigation({ onEnter, onEscape }));

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(onEnter).not.toHaveBeenCalled();
  });

  test('does not call callbacks when typing in input', () => {
    const onEnter = jest.fn();
    const onEscape = jest.fn();

    renderHook(() => useKeyboardNavigation({ onEnter, onEscape }));

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onEnter).not.toHaveBeenCalled();

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onEscape).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  test('does not call callbacks when typing in textarea', () => {
    const onEnter = jest.fn();
    const onEscape = jest.fn();

    renderHook(() => useKeyboardNavigation({ onEnter, onEscape }));

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();

    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onEnter).not.toHaveBeenCalled();

    document.body.removeChild(textarea);
  });

  test('does not attach listeners when disabled', () => {
    const onEnter = jest.fn();
    const onEscape = jest.fn();

    renderHook(() => useKeyboardNavigation({ onEnter, onEscape, enabled: false }));

    fireEvent.keyDown(window, { key: 'Enter' });
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onEnter).not.toHaveBeenCalled();
    expect(onEscape).not.toHaveBeenCalled();
  });

  test('cleans up event listeners on unmount', () => {
    const onEnter = jest.fn();
    const { unmount } = renderHook(() => useKeyboardNavigation({ onEnter }));

    unmount();

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onEnter).not.toHaveBeenCalled();
  });
});

describe('useFocusTrap', () => {
  test('focuses first element when modal opens', () => {
    const modalRef = { current: document.createElement('div') };
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    modalRef.current.appendChild(button1);
    modalRef.current.appendChild(button2);
    document.body.appendChild(modalRef.current);

    renderHook(() => useFocusTrap(true, modalRef));

    expect(document.activeElement).toBe(button1);

    document.body.removeChild(modalRef.current);
  });

  test('traps focus with Tab key', () => {
    const modalRef = { current: document.createElement('div') };
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    modalRef.current.appendChild(button1);
    modalRef.current.appendChild(button2);
    document.body.appendChild(modalRef.current);

    renderHook(() => useFocusTrap(true, modalRef));

    button2.focus();
    fireEvent.keyDown(modalRef.current, { key: 'Tab' });

    expect(document.activeElement).toBe(button1);

    document.body.removeChild(modalRef.current);
  });

  test('traps focus with Shift+Tab', () => {
    const modalRef = { current: document.createElement('div') };
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    modalRef.current.appendChild(button1);
    modalRef.current.appendChild(button2);
    document.body.appendChild(modalRef.current);

    renderHook(() => useFocusTrap(true, modalRef));

    button1.focus();
    fireEvent.keyDown(modalRef.current, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toBe(button2);

    document.body.removeChild(modalRef.current);
  });

  test('does not trap focus when modal is closed', () => {
    const modalRef = { current: document.createElement('div') };
    const button = document.createElement('button');
    modalRef.current.appendChild(button);
    document.body.appendChild(modalRef.current);

    renderHook(() => useFocusTrap(false, modalRef));

    expect(document.activeElement).not.toBe(button);

    document.body.removeChild(modalRef.current);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = () => {};
});

test('renderiza o cabeçalho com o texto FURIA Chat', () => {
  render(<App />);
  const header = screen.getByText(/FURIA Chat/i);
  expect(header).toBeInTheDocument();
});

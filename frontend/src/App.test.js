import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza o cabeçalho com o texto FURIA Chat', () => {
  render(<App />);
  // Procura pelo título que você definiu no <h1>
  const header = screen.getByText(/FURIA Chat/i);
  expect(header).toBeInTheDocument();
});

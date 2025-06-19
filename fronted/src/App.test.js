import { render, screen } from '@testing-library/react';
import App from './App';

test('renders chess heading', () => {
  render(<App />);
  const heading = screen.getByText(/Ajedrez/i);
  expect(heading).toBeInTheDocument();
});

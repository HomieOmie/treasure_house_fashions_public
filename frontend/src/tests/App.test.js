import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Sign in to THF Gift Certificates Manager/i);
  expect(linkElement).toBeInTheDocument();
  console.log("Delete this line");
});

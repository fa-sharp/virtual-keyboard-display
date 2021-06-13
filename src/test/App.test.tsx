import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../components/App';

test('toggle renders and works', () => {
  render(<App />);
  const toggle = screen.getByText(/Show note/i).nextSibling?.firstChild;
  
  toggle ? fireEvent.input(toggle, {checked: true}) : console.log("Toggle not found.");
  expect(toggle).toBeChecked();
});

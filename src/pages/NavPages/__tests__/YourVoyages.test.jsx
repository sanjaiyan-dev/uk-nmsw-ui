import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { YOUR_VOYAGES_PAGE_NAME } from '../../../constants/AppUrlConstants';
import YourVoyages from '../YourVoyages';

describe('Your voyages page tests', () => {
  it('should render the page with the Your Voyages as a H1', () => {
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(screen.getByText(YOUR_VOYAGES_PAGE_NAME)).toBeInTheDocument();
  });

  it('should display a "Report a voyage" button', () => {
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Report a voyage' })).toBeInTheDocument();
  });
});

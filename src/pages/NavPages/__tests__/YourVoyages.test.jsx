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

  it('should render voyages if voyages exist', () => {
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(screen.getByText('Select report type')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Drafts' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Submitted' })).toBeInTheDocument();
    expect(screen.getByText('All report types')).toBeInTheDocument();
  });

  // TODO: rewrite tests when BE endpoint is ready as the mocked voyage data will always be availiable
});

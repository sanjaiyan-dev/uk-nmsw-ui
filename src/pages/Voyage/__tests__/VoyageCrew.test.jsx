import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { VOYAGE_CREW_CONFIRMATION_URL, YOUR_VOYAGES_URL } from '../../../constants/AppUrlConstants';
import VoyageCrew from '../VoyageCrew';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage crew page', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page with state', async () => {
    mockUseLocationState.state = { declarationId: '123' };
    render(<MemoryRouter><VoyageCrew /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Upload the crew details including supernumeraries (FAL 5)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save and continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Save and continue</button>');
  });

  it('should render an error without state', async () => {
    mockUseLocationState.state = {};
    render(<MemoryRouter><VoyageCrew /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should go to the voyage task list page on button click', async () => {
    mockUseLocationState.state = { declarationId: '123' };
    const user = userEvent.setup();
    render(<MemoryRouter><VoyageCrew /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_CREW_CONFIRMATION_URL, { state: { fileType: 'Crew details' } });
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VOYAGE_PASSENGER_CONFIRMATION_URL } from '../../../constants/AppUrlConstants';
import VoyagePassengerUpload from '../VoyagePassengerUpload';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage passenger upload page', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page', async () => {
    render(<VoyagePassengerUpload />);
    expect(screen.getByRole('heading', { name: 'Upload the passenger details (FAL 6)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save and continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Save and continue</button>');
  });

  it('should go to the voyage task list page on button click', async () => {
    const user = userEvent.setup();
    render(<VoyagePassengerUpload />);
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_PASSENGER_CONFIRMATION_URL, { state: { fileType: 'Passenger details' } });
  });
});

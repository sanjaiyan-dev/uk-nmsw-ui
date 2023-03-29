import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { URL_DECLARATIONID_IDENTIFIER, VOYAGE_PASSENGER_UPLOAD_URL, YOUR_VOYAGES_URL } from '../../../constants/AppUrlConstants';
import { PASSENGER_DETAILS_TEMPLATE_NAME } from '../../../constants/AppConstants';
import VoyagePassengerUpload from '../VoyagePassengerUpload';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

const renderPage = () => {
  render(
    <MemoryRouter initialEntries={[`${VOYAGE_PASSENGER_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`]}>
      <VoyagePassengerUpload />
    </MemoryRouter>,
  );
};

describe('Voyage passenger page', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page with declarationId from params', async () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Upload the Passenger details (FAL 6)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check for errors' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Check for errors</button>');
  });

  it('should render an error without declarationId', async () => {
    render(
      <MemoryRouter initialEntries={[`${VOYAGE_PASSENGER_UPLOAD_URL}`]}>
        <VoyagePassengerUpload />
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should show error if no file is selected and submit clicked', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole('heading', { name: `Upload the ${PASSENGER_DETAILS_TEMPLATE_NAME}` })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Check for errors' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select a file' })).toBeInTheDocument();
    expect(screen.getAllByText('Select a file')).toHaveLength(2);
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { VOYAGE_TASK_LIST_URL, YOUR_VOYAGES_URL } from '../../../constants/AppUrlConstants';
import FileUploadConfirmation from '../FileUploadConfirmation';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('File upload success confirmation page', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page with state', async () => {
    mockUseLocationState.state = { fileType: 'FAL Name', declarationId: '123' };
    render(<MemoryRouter><FileUploadConfirmation /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'No errors found' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Success' }).outerHTML).toEqual('<h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">Success</h2>');
    expect(screen.getByText('FAL Name uploaded')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save and continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Save and continue</button>');
  });

  it('should render an error without state', async () => {
    mockUseLocationState.state = {};
    render(<MemoryRouter><FileUploadConfirmation /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should go to the voyage task list page on button click', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = { fileType: 'FAL Name', declarationId: '123' };
    render(<MemoryRouter><FileUploadConfirmation /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_TASK_LIST_URL, { state: { declarationId: '123' } });
  });
});

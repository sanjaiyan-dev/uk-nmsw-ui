import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL,
  VOYAGE_TASK_LIST_URL,
  YOUR_VOYAGES_URL,
} from '../../../constants/AppUrlConstants';
import FileUploadConfirmation from '../FileUploadConfirmation';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

// using Gen Dec as an example URL that calls the File Upload component
const renderPage = () => {
  render(
    <MemoryRouter initialEntries={[`${VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`]}>
      <FileUploadConfirmation />
    </MemoryRouter>,
  );
};

describe('File upload success confirmation page', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page with params', async () => {
    mockUseLocationState.state = { fileName: 'FAL Name' };
    renderPage();
    expect(screen.getByRole('heading', { name: 'No errors found' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Success' }).outerHTML).toEqual('<h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">Success</h2>');
    expect(screen.getByText('FAL Name uploaded')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save and continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Save and continue</button>');
  });

  it('should render an error without declarationId in params', async () => {
    render(
      <MemoryRouter initialEntries={[`${VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL}`]}>
        <FileUploadConfirmation />
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should render an error without fileName in state', async () => {
    mockUseLocationState.state = {};
    renderPage();
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should go to the voyage task list page on button click', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = { fileName: 'FAL Name' };
    renderPage();
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`);
  });
});

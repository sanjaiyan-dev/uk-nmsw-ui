import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { URL_DECLARATIONID_IDENTIFIER, VOYAGE_GENERAL_DECLARATION_UPLOAD_URL, YOUR_VOYAGES_URL } from '../../../constants/AppUrlConstants';
import VoyageGeneralDeclaration from '../VoyageGeneralDeclaration';
import { GENERAL_DECLARATION_TEMPLATE_NAME } from '../../../constants/AppConstants';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

const renderPage = () => {
  render(
    <MemoryRouter initialEntries={[`${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`]}>
      <VoyageGeneralDeclaration />
    </MemoryRouter>,
  );
};

describe('Voyage general declaration page', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page if declaration ID is in URL', async () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Upload the General Declaration (FAL 1)' })).toBeInTheDocument();
    expect(screen.getByTestId('paragraph').outerHTML).toEqual('<p class="govuk-body" data-testid="paragraph">You must use the <button class="govuk-button--text" type="button">General Declaration (FAL 1) template</button> to submit a report to NMSW.</p>');
    expect(screen.getByRole('button', { name: 'General Declaration (FAL 1) template' }).outerHTML).toEqual('<button class="govuk-button--text" type="button">General Declaration (FAL 1) template</button>');
    expect(screen.getByRole('button', { name: 'Check for errors' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Check for errors</button>');
  });

  it('should show error message if no declaration ID in URL', async () => {
    render(
      <MemoryRouter initialEntries={[VOYAGE_GENERAL_DECLARATION_UPLOAD_URL]}>
        <VoyageGeneralDeclaration />
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should show error if no file is selected and submit clicked', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole('heading', { name: `Upload the ${GENERAL_DECLARATION_TEMPLATE_NAME}` })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Check for errors' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select a file' })).toBeInTheDocument();
    expect(screen.getAllByText('Select a file')).toHaveLength(2);
  });

  /*
   * Note: API responses of 400 Missing file, 400 Invalid file type,
   * 401, 422, 500, and other non specified errors are
   * tested within the FileUploadForm.test.jsx test suite as they are
   * generic for any file upload
  */
});

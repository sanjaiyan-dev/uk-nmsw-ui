import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { YOUR_VOYAGES_URL } from '../../../constants/AppUrlConstants';
import VoyageGeneralDeclaration from '../VoyageGeneralDeclaration';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage general declaration page', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page if declaration ID is in state', async () => {
    mockUseLocationState.state = { fileType: 'FAL Name', declarationId: '123' };
    render(<MemoryRouter><VoyageGeneralDeclaration /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Upload the General Declaration (FAL 1)' })).toBeInTheDocument();
    expect(screen.getByTestId('paragraph').outerHTML).toEqual('<p class="govuk-body" data-testid="paragraph">You must use the new excel spreadsheet version of the <button class="govuk-button--text" type="button">FAL 1 general declaration</button>.</p>');
    expect(screen.getByRole('button', { name: 'FAL 1 general declaration' }).outerHTML).toEqual('<button class="govuk-button--text" type="button">FAL 1 general declaration</button>');
    expect(screen.getByRole('button', { name: 'Check for errors' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Check for errors</button>');
  });

  it('should show error message if no declaration ID in state', async () => {
    mockUseLocationState.state = {};
    render(<MemoryRouter><VoyageGeneralDeclaration /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should show error if no file is selected and submit clicked', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = { fileType: 'FAL Name', declarationId: '123' };
    render(<MemoryRouter><VoyageGeneralDeclaration /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Upload the General Declaration (FAL 1)' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Check for errors' }));
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select a FAL 1 - General Declaration' })).toBeInTheDocument();
    expect(screen.getAllByText('Select a FAL 1 - General Declaration')).toHaveLength(2);
  });

  /*
   * Note: API responses of 400 Missing file, 400 Invalid file type,
   * 401, 422, 500, and other non specified errors are
   * tested within the FileUploadForm.test.jsx test suite as they are
   * generic for any file upload
  */
});

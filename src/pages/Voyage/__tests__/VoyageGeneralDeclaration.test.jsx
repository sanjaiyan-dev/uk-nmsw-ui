import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { TOKEN_INVALID } from '../../../constants/AppAPIConstants';
import { SIGN_IN_URL, VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL, VOYAGE_GENERAL_DECLARATION_UPLOAD_URL } from '../../../constants/AppUrlConstants';
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

  it('should render the page', async () => {
    mockUseLocationState.state = { fileType: 'FAL Name' };
    render(<VoyageGeneralDeclaration />);
    expect(screen.getByRole('heading', { name: 'Upload the General Declaration (FAL 1)' })).toBeInTheDocument();
    expect(screen.getByTestId('paragraph').outerHTML).toEqual('<p class="govuk-body" data-testid="paragraph">You must use the new excel spreadsheet version of the <button class="govuk-button--text" type="button">FAL 1 general declaration</button>.</p>');
    expect(screen.getByRole('button', { name: 'FAL 1 general declaration' }).outerHTML).toEqual('<button class="govuk-button--text" type="button">FAL 1 general declaration</button>');
    expect(screen.getByRole('button', { name: 'Save and continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Save and continue</button>');
  });

  // TODO: Update tests to include the actual BE endpoint and responses

  it('should go to the voyage task list page on button click', async () => {
    const user = userEvent.setup();

    mockAxios
      .onPost('SOME-END-POINT')
      .reply(200);

    render(<VoyageGeneralDeclaration />);
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL, { state: { fileType: 'General Declaration' } });
  });

  it('should navigate to sign in when auth token is invalid', async () => {
    const user = userEvent.setup();

    mockAxios
      .onPost('SOME-END-POINT')
      .reply(401, {
        message: TOKEN_INVALID,
      });
    render(<VoyageGeneralDeclaration />);
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { declarationID: '123', redirectURL: VOYAGE_GENERAL_DECLARATION_UPLOAD_URL } });
  });

  // TODO: add test for file download
});

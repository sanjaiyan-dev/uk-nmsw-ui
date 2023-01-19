import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL } from '../../../constants/AppUrlConstants';
import VoyageGeneralDeclaration from '../VoyageGeneralDeclaration';

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

  it('should render the page', async () => {
    mockUseLocationState.state = { fileType: 'FAL Name' };
    render(<VoyageGeneralDeclaration />);
    expect(screen.getByRole('heading', { name: 'Upload the General Declaration (FAL 1)' })).toBeInTheDocument();
    expect(screen.getByTestId('paragraph').outerHTML).toEqual('<p class="govuk-body" data-testid="paragraph">You must use the new excel spreadsheet version of the <button class="govuk-button--text" type="button">FAL 1 general declaration</button>.</p>');
    expect(screen.getByRole('button', { name: 'FAL 1 general declaration' }).outerHTML).toEqual('<button class="govuk-button--text" type="button">FAL 1 general declaration</button>');
    expect(screen.getByRole('button', { name: 'Save and continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Save and continue</button>');
  });

  it('should go to the voyage task list page on button click', async () => {
    const user = userEvent.setup();
    render(<VoyageGeneralDeclaration />);
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL, { state: { fileType: 'General Declaration' } });
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL, YOUR_VOYAGES_URL } from '../../../constants/AppUrlConstants';
import VoyageGeneralDeclaration from '../VoyageGeneralDeclaration';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage general declaration page', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page if declaration ID is in state', async () => {
    mockUseLocationState.state = { fileType: 'FAL Name', declarationId: '123' };
    render(<MemoryRouter><VoyageGeneralDeclaration /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Upload the General Declaration (FAL 1)' })).toBeInTheDocument();
    expect(screen.getByTestId('paragraph').outerHTML).toEqual('<p class="govuk-body" data-testid="paragraph">You must use the new excel spreadsheet version of the <button class="govuk-button--text" type="button">FAL 1 general declaration</button>.</p>');
    expect(screen.getByRole('button', { name: 'FAL 1 general declaration' }).outerHTML).toEqual('<button class="govuk-button--text" type="button">FAL 1 general declaration</button>');
    expect(screen.getByRole('button', { name: 'Save and continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Save and continue</button>');
  });

  it('should show error message if no declaration ID in state', async () => {
    mockUseLocationState.state = {};
    render(<MemoryRouter><VoyageGeneralDeclaration /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should go to the confirmation of upload on save and continue', async () => {
    mockUseLocationState.state = { fileType: 'FAL Name', declarationId: '123' };
    const user = userEvent.setup();
    render(<MemoryRouter><VoyageGeneralDeclaration /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_GENERAL_DECLARATION_CONFIRMATION_URL, { state: { fileType: 'General Declaration', declarationId: '123' } });
  });
});

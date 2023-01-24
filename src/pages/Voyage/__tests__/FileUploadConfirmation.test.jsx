import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VOYAGE_TASK_LIST_URL } from '../../../constants/AppUrlConstants';
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

  it('should render the page', async () => {
    mockUseLocationState.state = { fileType: 'FAL Name' };
    render(<FileUploadConfirmation />);
    expect(screen.getByRole('heading', { name: 'No errors found' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Success' }).outerHTML).toEqual('<h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">Success</h2>');
    expect(screen.getByText('FAL Name uploaded')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save and continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Save and continue</button>');
  });

  it('should go to the voyage task list page on button click', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = { fileType: 'FAL Name' };
    render(<FileUploadConfirmation />);
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_TASK_LIST_URL);
  });
});

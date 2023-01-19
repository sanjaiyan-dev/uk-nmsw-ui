import { render, screen } from '@testing-library/react';
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

  it('should render the page correctly', async () => {
    mockUseLocationState.state = { fileType: 'FAL Name' };
    render(<FileUploadConfirmation />);
    expect(screen.getByText('No errors found')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('FAL Name uploaded')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
  });
});

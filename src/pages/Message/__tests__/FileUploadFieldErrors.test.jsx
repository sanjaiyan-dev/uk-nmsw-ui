import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { YOUR_VOYAGES_URL } from '../../../constants/AppUrlConstants';
import FileUploadFieldErrors from '../FileUploadFieldErrors';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

const errorState = {
  errorList: [
    {
      cell: '',
      message: 'Comes from api and does not show key in UI',
    },
    {
      cell: 'B1',
      message: 'words we put into UI',
    },
    {
      cell: 'B2',
      message: 'nice error message',
    },
  ],
  fileName: 'template.xlsx',
  returnURL: '/this-page/123',
};

describe('File upload field error tests', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the file upload field error component', () => {
    mockUseLocationState.state = { ...errorState };
    render(<MemoryRouter><FileUploadFieldErrors /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Errors found' })).toBeInTheDocument();
    expect(screen.getByText('Your file has errors. Check the file to fix any errors and re-upload your file.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Re-upload file' })).toBeInTheDocument();
  });

  it('should render the page even if state missing, but redirect back to your voyages', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = {};
    render(<MemoryRouter><FileUploadFieldErrors /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: 'Errors found' })).toBeInTheDocument();
    expect(screen.getByText('Your file has errors. Check the file to fix any errors and re-upload your file.')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'errors found' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Re-upload file' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(YOUR_VOYAGES_URL);
  });

  it('should show a count of the errors received and the filename', () => {
    mockUseLocationState.state = { ...errorState };
    render(<MemoryRouter><FileUploadFieldErrors /></MemoryRouter>);
    expect(screen.getByRole('table', { name: '3 errors found in template.xlsx' })).toBeInTheDocument();
  });

  it('should show a table of the errors received', () => {
    mockUseLocationState.state = { ...errorState };
    render(<MemoryRouter><FileUploadFieldErrors /></MemoryRouter>);

    expect(screen.getByRole('row', { name: 'Cell number Error' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Cell number' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Error' })).toBeInTheDocument();

    expect(screen.getByRole('row', { name: 'Comes from api and does not show key in UI' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Comes from api and does not show key in UI' })).toBeInTheDocument();

    expect(screen.getByRole('row', { name: 'B1 words we put into UI' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'B1' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'words we put into UI' })).toBeInTheDocument();

    expect(screen.getByRole('row', { name: 'B2 nice error message' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'B2' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'nice error message' })).toBeInTheDocument();
  });

  it('should return to the previous page if re-upload button clicked', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = { ...errorState };
    render(<MemoryRouter><FileUploadFieldErrors /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Re-upload file' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith('/this-page/123');
  });
});

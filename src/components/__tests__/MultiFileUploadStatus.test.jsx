import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { SIGN_IN_URL } from '../../constants/AppUrlConstants';
import MultiFileUploadForm from '../MultiFileUploadForm';

const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
}));

const renderPage = () => {
  render(
    <MemoryRouter>
      <MultiFileUploadForm
        endpoint="/upload-file-endpoint"
        pageHeading="Title from props"
        submitButtonLabel="Submit button label from props"
        urlNextPage="/next-page/123"
        urlThisPage="/this-page/123"
      />
    </MemoryRouter>,
  );
};

describe('Multi file upload status tests', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should change the status of a file to in progress while the POST is in progress', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    // Force a delay so we can test the file goes to an inprogress state
    mockAxios
      .onPost('/upload-file-endpoint')
      .reply(() => new Promise((resolve) => {
        setTimeout(() => {
          resolve([201, null]);
        }, 2000);
      }));

    renderPage();

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    expect(screen.getAllByText('Pending')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Upload files' }));
    expect(screen.getAllByText('Loading')).toHaveLength(1); // we can look for text of loading as it is in the DOM, altough hidden for visual users
    expect(screen.getAllByText('Pending')).toHaveLength(1);
  });

  it('should change the status of a file to success when the POST returns a success', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    mockAxios
      .onPost('/upload-file-endpoint')
      .reply(200, {
        message: 'success response',
      });

    renderPage();

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    expect(screen.getAllByText('Pending')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Upload files' }));
    await waitFor(() => {
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });
    expect(screen.getAllByText('has been uploaded')).toHaveLength(2);
  });

  it('should change the status of a file to error when the POST returns an error', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    mockAxios
      .onPost('/upload-file-endpoint')
      .reply(400, {
        message: 'error response',
      });

    renderPage();

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    expect(screen.getAllByText('Pending')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Upload files' }));
    await waitFor(() => {
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });
    expect(screen.getAllByText('error response')).toHaveLength(2);
  });

  it('should show a generic error message for the file if the response contains no error message', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    mockAxios
      .onPost('/upload-file-endpoint')
      .reply(500);

    renderPage();

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    expect(screen.getAllByText('Pending')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Upload files' }));
    expect(screen.getAllByText('There was a problem check file and try again')).toHaveLength(2);
  });

  it('should redirect user to sign in if auth token missing', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    mockAxios
      .onPost('/upload-file-endpoint')
      .reply(422);

    renderPage();

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    await user.click(screen.getByRole('button', { name: 'Upload files' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: '/this-page/123' } });
  });

  it('should redirect user to sign in if auth token invalid/expired', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    mockAxios
      .onPost('/upload-file-endpoint')
      .reply(401);

    renderPage();

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    await user.click(screen.getByRole('button', { name: 'Upload files' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: '/this-page/123' } });
  });
});

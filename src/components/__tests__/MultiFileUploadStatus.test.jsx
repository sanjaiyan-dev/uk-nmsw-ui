import {
  render, screen, waitFor, waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  API_URL,
  ENDPOINT_DECLARATION_ATTACHMENTS_PATH,
  ENDPOINT_DECLARATION_PATH,
} from '../../constants/AppAPIConstants';
import {
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
} from '../../constants/AppUrlConstants';
import MultiFileUploadForm from '../MultiFileUploadForm';

const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
}));

const renderPage = () => {
  render(
    <MemoryRouter initialEntries={[`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`]}>
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

  const mockedFAL1Response = {
    FAL1: {
      nameOfShip: 'Test ship name',
      imoNumber: '1234567',
      callSign: 'NA',
      signatory: 'Captain Name',
      flagState: 'GBR',
      departureFromUk: false,
      departurePortUnlocode: 'AUPOR',
      departureDate: '2023-02-12',
      departureTime: '09:23:00',
      arrivalPortUnlocode: 'GBDOV',
      arrivalDate: '2023-02-15',
      arrivalTime: '14:00:00',
      previousPortUnlocode: 'AUPOR',
      nextPortUnlocode: 'NLRTM',
      cargo: 'No cargo',
      passengers: false,
      creationDate: '2023-02-10',
      submissionDate: '2023-02-11',
    },
    FAL5: [],
    FAL6: [],
    supporting: [],
  };

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
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response)
      .onPost('/upload-file-endpoint')
      .reply(() => new Promise((resolve) => {
        setTimeout(() => {
          resolve([201, null]);
        }, 2000);
      }));

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

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
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response)
      .onPost('/upload-file-endpoint')
      .reply(200, {
        message: 'success response',
      });

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

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
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response)
      .onPost('/upload-file-endpoint')
      .reply(400, {
        message: 'error response',
      });

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

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
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response)
      .onPost('/upload-file-endpoint')
      .reply(500);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

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
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response)
      .onPost('/upload-file-endpoint')
      .reply(422);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

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
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response)
      .onPost('/upload-file-endpoint')
      .reply(401);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    await user.click(screen.getByRole('button', { name: 'Upload files' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: '/this-page/123' } });
  });
});

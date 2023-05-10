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
  ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH,
  FILE_TYPE_INVALID_PREFIX,
} from '../../constants/AppAPIConstants';
import {
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
} from '../../constants/AppUrlConstants';
import MultiFileUploadForm from '../MultiFileUploadForm';
import { MAX_SUPPORTING_FILE_SIZE, MAX_SUPPORTING_FILE_SIZE_DISPLAY } from '../../constants/AppConstants';

const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
}));

const renderPage = () => {
  render(
    <MemoryRouter initialEntries={[`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`]}>
      <MultiFileUploadForm
        endpoint={`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`}
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
  const mockedFAL1AndSupportingResponse = {
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
    supporting: [
      {
        id: 'supporting1',
        filename: 'supportingFile1',
        size: '118342',
        url: 'https://supporting2-link.com',
      },
      {
        id: 'supporting2',
        filename: 'supportingFile2',
        size: '118687',
        url: 'https://supporting2-link.com',
      },
    ],
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
      .onPost(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`)
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

  it('should disable action buttons while the POST is in progress', async () => {
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
      .onPost(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`)
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
    expect(screen.getByRole('button', { name: 'Upload files' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Submit button label from props' })).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Delete' })[1]).toBeDisabled();
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
      .onPost(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`)
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

  it('should change the status of a file to error when the POST returns an error starting with Invalid file type', async () => {
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
      .onPost(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`)
      .reply(400, {
        message: 'Invalid file type',
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
    expect(screen.getAllByText('The file must be a csv, doc, docm, docx, rtf, txt, xls, xlsm, xlsx, xltm, xltx, xlw or xml')).toHaveLength(2);
  });

  it('should change the status of a file to error when the selected file size is too large', async () => {
    const user = userEvent.setup();
    const file = new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    Object.defineProperty(file, 'size', { value: MAX_SUPPORTING_FILE_SIZE * MAX_SUPPORTING_FILE_SIZE + 1, configurable: true });

    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response)
      .onPost(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`)
      .reply(400, {
        message: FILE_TYPE_INVALID_PREFIX,
      });

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, file);
    expect(screen.getAllByText('Pending')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Upload files' }));
    await waitFor(() => {
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });
    expect(screen.getAllByText(`The file must be smaller than ${MAX_SUPPORTING_FILE_SIZE_DISPLAY}MB`)).toHaveLength(1);
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
      .onPost(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`)
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
      .onPost(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`)
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
      .onPost(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`)
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
      .onPost(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`)
      .reply(401);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    await user.click(screen.getByRole('button', { name: 'Upload files' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: '/this-page/123' } });
  });

  // -------------
  // DELETE
  // -------------
  it('should change the status of a file to in progress while the DELETE is in progress', async () => {
    const user = userEvent.setup();
    // Force a delay so we can test the file goes to an inprogress state
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1AndSupportingResponse)
      .onDelete(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`)
      .reply(() => new Promise((resolve) => {
        setTimeout(() => {
          resolve([200, null]);
        }, 2000);
      }));
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getAllByText('has been uploaded')).toHaveLength(2);

    // user clicks delete on one
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(screen.getAllByText('Loading')).toHaveLength(1);
    expect(screen.getAllByText('has been uploaded')).toHaveLength(1);

    expect(mockAxios.history.delete.length).toBe(1);
  });

  it('should disable action buttons while a DELETE is in progress', async () => {
    const user = userEvent.setup();
    // Force a delay so we can test the file goes to an inprogress state
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1AndSupportingResponse)
      .onDelete(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`)
      .reply(() => new Promise((resolve) => {
        setTimeout(() => {
          resolve([200, null]);
        }, 2000);
      }));
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    // user clicks delete on one
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(screen.getAllByText('Loading')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Upload files' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Submit button label from props' })).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Delete' })[1]).toBeDisabled();
  });

  it('should redirect user to sign in if auth token missing on DELETE', async () => {
    const user = userEvent.setup();
    // Force a delay so we can test the file goes to an inprogress state
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1AndSupportingResponse)
      .onDelete(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`)
      .reply(422);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getAllByText('has been uploaded')).toHaveLength(2);

    // user clicks delete on one
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: '/this-page/123' } });
  });

  it('should redirect user to sign in if auth token invalid/expired on DELETE', async () => {
    const user = userEvent.setup();
    // Force a delay so we can test the file goes to an inprogress state
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1AndSupportingResponse)
      .onDelete(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`)
      .reply(401);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getAllByText('has been uploaded')).toHaveLength(2);

    // user clicks delete on one
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: '/this-page/123' } });
  });
});

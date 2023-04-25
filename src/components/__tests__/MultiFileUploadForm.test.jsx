import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  API_URL,
  ENDPOINT_DECLARATION_ATTACHMENTS_PATH,
  ENDPOINT_DECLARATION_PATH,
  ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH,
} from '../../constants/AppAPIConstants';
import { URL_DECLARATIONID_IDENTIFIER, VOYAGE_SUPPORTING_DOCS_UPLOAD_URL } from '../../constants/AppUrlConstants';
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
        endpoint={`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_FILE_UPLOAD_SUPPORTING_DOCUMENTS_PATH}`}
        pageHeading="Title from props"
        submitButtonLabel="Submit button label from props"
        urlNextPage="/next-page/123"
        urlThisPage="/this-page/123"
      />
    </MemoryRouter>,
  );
};

describe('Multi file upload tests', () => {
  const mockAxios = new MockAdapter(axios);
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

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

  it('should render the multi file upload component', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    expect(screen.getByRole('heading', { name: 'Title from props' })).toBeInTheDocument();
    expect(screen.getByText('Drag and drop files here or')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument();
    expect(screen.getByTestId('multiFileUploadInput')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload files' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit button label from props' })).toBeInTheDocument();

    // By default the file section should not be shown
    expect(screen.queryByRole('heading', { name: 'Files added' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    expect(screen.queryByText('Pending')).not.toBeInTheDocument();
  });

  it('should display existing supporting document files if they exist', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1AndSupportingResponse);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    expect(screen.getByRole('heading', { name: 'Files added' })).toBeInTheDocument();
    expect(screen.getByText('supportingFile1')).toBeInTheDocument();
    expect(screen.getByText('supportingFile1')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2);
    expect(screen.getAllByText('has been uploaded')).toHaveLength(2);
  });

  it('should accept one file added and display it in the file list', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];

    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    expect(input.files).toHaveLength(1);
    expect(input.files[0]).toBe(files[0]);

    expect(screen.getByRole('heading', { name: 'Files added' })).toBeInTheDocument();
    expect(screen.getByText('template1.xlsx')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(1);
    expect(screen.getAllByText('Pending')).toHaveLength(1);
  });

  it('should accept multiple files added and display them in the file list', async () => {
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
      .reply(200, mockedFAL1Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    expect(input.files).toHaveLength(2);
    expect(input.files[0]).toBe(files[0]);
    expect(input.files[1]).toBe(files[1]);

    expect(screen.getByRole('heading', { name: 'Files added' })).toBeInTheDocument();
    expect(screen.getByText('template1.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template2.xlsx')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2);
    expect(screen.getAllByText('Pending')).toHaveLength(2);
  });

  it('should add additional files to the existing file list', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    const additionalFiles = [
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template3'], 'template3.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template4'], 'template4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];

    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    expect(input.files).toHaveLength(1);
    expect(input.files[0]).toBe(files[0]);

    expect(screen.getByRole('heading', { name: 'Files added' })).toBeInTheDocument();
    expect(screen.getByText('template1.xlsx')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(1);
    expect(screen.getAllByText('Pending')).toHaveLength(1);

    await user.upload(input, additionalFiles);

    expect(screen.getByRole('heading', { name: 'Files added' })).toBeInTheDocument();
    expect(screen.getByText('template1.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template2.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template3.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template4.xlsx')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(4);
    expect(screen.getAllByText('Pending')).toHaveLength(4);
  });

  it('should not re-upload files that have already been uploaded when upload is clicked twice', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];

    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    await user.click(screen.getByRole('button', { name: 'Upload files' }));
    await user.click(screen.getByRole('button', { name: 'Upload files' }));

    expect(mockAxios.history.post.length).toBe(1);
  });

  it('should remove a pre-uploaded file from the list if its delete button is clicked', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template3'], 'template3.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    // expect all three files to exist
    expect(screen.getByRole('heading', { name: 'Files added' })).toBeInTheDocument();
    expect(screen.getByText('template1.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template2.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template3.xlsx')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(3);
    expect(screen.getAllByText('Pending')).toHaveLength(3);

    // user clicks delete on one
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[1]);
    // expect only 1 & 3 to exist
    expect(screen.queryByText('template2.xlsx')).not.toBeInTheDocument();
    expect(screen.getByText('template1.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template3.xlsx')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2);
    expect(screen.getAllByText('Pending')).toHaveLength(2);
  });

  it('should call the delete function if a previously uploaded files delete button is clicked', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1AndSupportingResponse)
      .onDelete(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, { id: 'supporting1' }, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        message: 'File successfully deleted',
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    // user clicks delete on one
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    expect(mockAxios.history.delete.length).toBe(1);
  });

  it('should remove an already uploaded file from the list if its delete button is clicked', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1AndSupportingResponse)
      .onDelete(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, { id: 'supporting1' }, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        message: 'File successfully deleted',
      })
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
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
            id: 'supporting2',
            filename: 'supportingFile2',
            size: '118687',
            url: 'https://supporting2-link.com',
          },
        ],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    // user clicks delete on one
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    expect(screen.queryByText('supportingFile1')).not.toBeInTheDocument();
    expect(screen.getByText('supportingFile2')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(1);
  });

  it('should load the next page on submit button click', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    await user.click(screen.getByRole('button', { name: 'Submit button label from props' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith('/next-page/123');
  });

  it('should not leave buttons in a disabled state when actions are complete', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];

    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);

    await user.click(screen.getByRole('button', { name: 'Upload files' }));
    expect(screen.getByRole('button', { name: 'Upload files' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Submit button label from props' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Delete' })).not.toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Submit button label from props' }));
    expect(screen.getByRole('button', { name: 'Upload files' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Submit button label from props' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Delete' })).not.toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByRole('button', { name: 'Upload files' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Submit button label from props' })).not.toBeDisabled();
  });
});

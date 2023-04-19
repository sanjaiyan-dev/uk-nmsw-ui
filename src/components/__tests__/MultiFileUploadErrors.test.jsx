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

describe('Multi file upload error tests', () => {
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


  it('should only allow a max of eight files be selected for upload - more than 8 selected for add', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template3'], 'template3.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template4'], 'template4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template5'], 'template5.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template6'], 'template6.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template7'], 'template7.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template8'], 'template8.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template9'], 'template9.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
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
    expect(screen.getAllByText("You've selected too many files: you can only add 8")).toHaveLength(2);
  });

  it('should only allow a max of eight files be added for upload - more than 8 selected over multiple adds', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    const additionalFiles = [
      new File(['template3'], 'template3.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template4'], 'template4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template5'], 'template5.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template6'], 'template6.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template7'], 'template7.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template8'], 'template8.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template9'], 'template9.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
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
    expect(screen.getAllByText('Pending')).toHaveLength(2);

    await user.upload(input, additionalFiles);
    expect(screen.getAllByText('Pending')).toHaveLength(2); // it does not let user add the extra files, remains at 2
    expect(screen.getAllByText("You've selected too many files: you can add up to 6 more files")).toHaveLength(2);
  });

  it('should only allow a max of eight files be added for upload - 8 added and tries to add more', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template3'], 'template3.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template4'], 'template4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template5'], 'template5.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template6'], 'template6.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template7'], 'template7.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template8'], 'template8.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    const additionalFiles = [new File(['template9'], 'template9.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
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
    expect(screen.getAllByText('Pending')).toHaveLength(8);

    await user.upload(input, additionalFiles);
    expect(screen.getAllByText('Pending')).toHaveLength(8); // it does not let user add the extra files, remains at 2
    expect(screen.getAllByText("You've selected too many files: you can add up to 0 more files")).toHaveLength(2);
  });

  it('should only allow a max of eight files be added for upload - 2 already uploaded and tries to 7 add more', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template3'], 'template3.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template4'], 'template4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template5'], 'template5.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template6'], 'template6.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template7'], 'template7.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];

    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1AndSupportingResponse);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);

    expect(screen.getAllByText("You've selected too many files: you can add up to 6 more files")).toHaveLength(2);
  });

  it('should only allow a max of eight files be added for upload - 2 already uploaded, uploads 1 more and tries to 6 add more', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    const additionalFiles = [
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template3'], 'template3.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template4'], 'template4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template5'], 'template5.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template6'], 'template6.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template7'], 'template9.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];

    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1AndSupportingResponse);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);
    await user.click(screen.getByRole('button', { name: 'Upload files' }));
    await user.upload(input, additionalFiles);

    expect(screen.getAllByText("You've selected too many files: you can add up to 5 more files")).toHaveLength(2);
  });

  it('should not repeat error messages when too many files selected for upload - 8 added and tries to add more', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template3'], 'template3.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template4'], 'template4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template5'], 'template5.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template6'], 'template6.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template7'], 'template7.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template8'], 'template8.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    const additionalFiles = [
      new File(['template9'], 'template9.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    const additionalFilesTwo = [
      new File(['template9'], 'template9.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
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
    expect(screen.getAllByText('Pending')).toHaveLength(8);

    await user.upload(input, additionalFiles);
    expect(screen.getAllByText('Pending')).toHaveLength(8); // it does not let user add the extra files, remains at 2
    expect(screen.getAllByText("You've selected too many files: you can add up to 0 more files")).toHaveLength(2);

    await user.upload(input, additionalFilesTwo); // repeat and expect to still only have the 2 instance of error on screen
    expect(screen.getAllByText('Pending')).toHaveLength(8); // it does not let user add the extra files, remains at 2
    expect(screen.getAllByText("You've selected too many files: you can add up to 0 more files")).toHaveLength(2);
  });

  it('should reject a file with an error if a file of the same name is already in the file list', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'template1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template4'], 'template4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    const additionalFiles = [
      new File(['template2'], 'template2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template3'], 'template3.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template4'], 'template4.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      new File(['template5'], 'template5.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
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
    expect(input.files).toHaveLength(3);

    expect(screen.getByRole('heading', { name: 'Files added' })).toBeInTheDocument();
    expect(screen.getByText('template1.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template2.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template4.xlsx')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(3);
    expect(screen.getAllByText('Pending')).toHaveLength(3);

    await user.upload(input, additionalFiles);

    expect(screen.getByRole('heading', { name: 'Files added' })).toBeInTheDocument();
    expect(screen.getByText('template1.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template2.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template3.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template4.xlsx')).toBeInTheDocument();
    expect(screen.getByText('template5.xlsx')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(5);
    expect(screen.getAllByText('Pending')).toHaveLength(5);

    expect(screen.getByText('A file called template2.xlsx already exists in your list')).toBeInTheDocument();
    expect(screen.getByText('A file called template4.xlsx already exists in your list')).toBeInTheDocument();
  });

  it('should reject a file with an error if a file a previously uploaded file has the same name', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['template1'], 'supportingFile1', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    ];
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1AndSupportingResponse);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    const input = screen.getByTestId('multiFileUploadInput');
    await user.upload(input, files);

    expect(screen.getByText('A file called supportingFile1 already exists in your list')).toBeInTheDocument();
  });

  it('should show a file error if file type is not allowed', async () => {
    const user = userEvent.setup();
    const files = [
      new File(['image'], 'supportingImage1', { type: 'image/png' }),
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
    await user.click(screen.getByRole('button', { name: 'Upload files' }));

    expect(screen.getByText('The file must be a csv, doc, docm, docx, rtf, txt, xls, xlsm, xlsx, xltm, xltx, xlw or xml')).toBeInTheDocument();
  });
});
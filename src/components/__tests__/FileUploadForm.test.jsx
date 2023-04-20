import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { GENERAL_DECLARATION_TEMPLATE_NAME, MAX_FILE_SIZE, MAX_FILE_SIZE_DISPLAY } from '../../constants/AppConstants';
import {
  DUPLICATE_RECORDS,
  DUPLICATE_RECORDS_FAL5,
  FAL5_IS_EMPTY,
  FAL6_IS_EMPTY,
  FILE_MISSING,
  FILE_TYPE_INVALID_CSV_XLSX,
} from '../../constants/AppAPIConstants';
import {
  FILE_UPLOAD_FIELD_ERRORS_URL,
  LOGGED_IN_LANDING,
  MESSAGE_URL,
  SIGN_IN_URL,
} from '../../constants/AppUrlConstants';
import FileUploadForm from '../FileUploadForm';

const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
}));

const testErrorMappingFile = {
  B1: {
    'received from api - with mapping file': 'words we put into UI',
  },
  B2: {
    'received from api - with mapping file': 'nice error message',
  },
};
const testErrorMappingFileWithOrdering = {
  B1: {
    order: 'b',
    'received from api - with mapping file': 'words we put into UI',
  },
  B2: {
    order: 'a',
    'received from api - with mapping file': 'nice error message',
  },
};

const renderPage = () => {
  render(
    <MemoryRouter>
      <FileUploadForm
        endpoint="/specific-endpoint-path-for-filetype"
        fileNameRequired="File name from props for error display"
        fileTypesAllowed="File types from props for error display"
        formId="uploadFile"
        pageHeading="Title from props"
        submitButtonLabel="Submit text from props"
        urlSuccessPage="/success-page/123"
        urlThisPage="/this-page/123"
      />
    </MemoryRouter>,
  );
};

describe('File upload tests', () => {
  const mockAxios = new MockAdapter(axios);
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should render the file upload component', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Title from props' })).toBeInTheDocument();
    expect(screen.getByLabelText('Title from props')).toBeInTheDocument();
    expect(screen.getByTestId('fileUploadInput')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit text from props' })).toBeInTheDocument();
  });

  it('should choose a file', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    renderPage();
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    expect(input.files.item(0)).toStrictEqual(file);
    expect(input.files).toHaveLength(1);
  });

  it('should disable the input and submit buttons on submit click while processing', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    renderPage();
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(screen.getByRole('button', { name: 'Submit text from props' })).toHaveAttribute('disabled');
    expect(screen.getByLabelText('Title from props')).toHaveAttribute('disabled');
  });

  it('should enable input and submit buttons again if there are file level errors (and error messages show on the page)', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit text from props' })).not.toHaveAttribute('disabled');
    expect(screen.getByLabelText('Title from props')).not.toHaveAttribute('disabled');
  });

  it('should show an error if the user clicks submit button and no file provided', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select a file' })).toBeInTheDocument();
    expect(screen.getAllByText('Select a file')).toHaveLength(2);
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should show an error if the API returns a no file provided response', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        message: FILE_MISSING,
      });
    renderPage();
    // make sure file is recognised so the FE no the FE file error isn't triggered
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select a file' })).toBeInTheDocument();
    expect(screen.getAllByText('Select a file')).toHaveLength(2);
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should show an error if the API returns a FAL 5 is empty response', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        message: FAL5_IS_EMPTY,
      });
    renderPage();
    // make sure file is recognised so the FE no the FE file error isn't triggered
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Template is empty' })).toBeInTheDocument();
    expect(screen.getAllByText('Template is empty')).toHaveLength(2);
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should show an error if the API returns a FAL 6 is empty response', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        message: FAL6_IS_EMPTY,
      });
    renderPage();
    // make sure file is recognised so the FE no the FE file error isn't triggered
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Template is empty' })).toBeInTheDocument();
    expect(screen.getAllByText('Template is empty')).toHaveLength(2);
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should show an error if the API returns a duplicate records response after FAL5 upload', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        message: DUPLICATE_RECORDS_FAL5,
      });
    renderPage();
    // make sure file is recognised so the FE no the FE file error isn't triggered
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Details listed on this file are not allowed, because they're the same as details you've already uploaded. Check the details in your file and try uploading again." })).toBeInTheDocument();
    expect(screen.getAllByText("Details listed on this file are not allowed, because they're the same as details you've already uploaded. Check the details in your file and try uploading again.")).toHaveLength(2);
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should show an error if the API returns a duplicate records response after FAL 6 upload', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        message: DUPLICATE_RECORDS,
      });
    renderPage();
    // make sure file is recognised so the FE no the FE file error isn't triggered
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Details listed on this file are not allowed, because they're the same as details you've already uploaded. Check the details in your file and try uploading again." })).toBeInTheDocument();
    expect(screen.getAllByText("Details listed on this file are not allowed, because they're the same as details you've already uploaded. Check the details in your file and try uploading again.")).toHaveLength(2);
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should show an error if API returns a file is invalid type response', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'image.png', { type: 'image/png' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        message: FILE_TYPE_INVALID_CSV_XLSX,
      });
    renderPage();
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'The file must be a File types from props for error display' })).toBeInTheDocument();
    expect(screen.getAllByText('The file must be a File types from props for error display')).toHaveLength(2);
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should show an error if filetype is too large and submit button clicked', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE + 1 });
    renderPage();
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    await screen.findByRole('heading', { name: 'There is a problem' });
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `The file must be smaller than ${MAX_FILE_SIZE_DISPLAY}MB` })).toBeInTheDocument();
    expect(screen.getAllByText(`The file must be smaller than ${MAX_FILE_SIZE_DISPLAY}MB`)).toHaveLength(2);
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should scroll to the error if user clicks on error link', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    await user.click(screen.getByRole('button', { name: 'Select a file' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should clear the error message when a new file is added', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(screen.getAllByText('Select a file')).toHaveLength(2);
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(screen.queryByText('Select a file')).not.toBeInTheDocument();
  });

  it('should redirect user to sign in with this page and declaration id if missing bearer token', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'image.png', { type: 'image/png' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(401);
    renderPage();
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: '/this-page/123' } });
  });

  it('should redirect user to message page with state of your voyages page and declaration id if 404 error', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'image.png', { type: 'image/png' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(404);
    renderPage();
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { redirectURL: LOGGED_IN_LANDING, title: 'Something has gone wrong' } });
  });

  it('should redirect user to message page with state of this page and declaration id if 500 error', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'image.png', { type: 'image/png' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(500);
    renderPage();
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { redirectURL: '/this-page/123', title: 'Something has gone wrong' } });
  });

  it('should include FAL 1 related message if filename is fal 1 and then redirect user to message page with state of this page and declaration id if 500 error', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'image.png', { type: 'image/png' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(500);
    render(
      <MemoryRouter>
        <FileUploadForm
          endpoint="/specific-endpoint-path-for-filetype"
          fileNameRequired={GENERAL_DECLARATION_TEMPLATE_NAME}
          fileTypesAllowed="File types from props for error display"
          formId="uploadFile"
          pageHeading="Title from props"
          submitButtonLabel="Submit text from props"
          urlSuccessPage="/success-page/123"
          urlThisPage="/this-page/123"
        />
      </MemoryRouter>,
    );
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, {
      state: {
        redirectURL: '/this-page/123',
        title: 'Upload failed',
        message: 'There are formatting errors in the excel file that we cannot identify. These errors may be incorrect date or time formats: you need to use dd/mm/yyyy and HH:MM. You can re-upload the file when you have fixed these errors.',
        button: {
          buttonLabel: 'Re-upload file',
          buttonNavigateTo: '/this-page/123',
        },
      },
    });
  });

  it('should navigate to the error component if the API returns any other 400 error - and we have a mapping file', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        B1: 'received from api - with mapping file',
        B2: 'received from api - with mapping file',
        __root__: 'Comes from api and does not show key in UI',
      });
    render(
      <MemoryRouter>
        <FileUploadForm
          endpoint="/specific-endpoint-path-for-filetype"
          errorMessageMapFile={testErrorMappingFile}
          fileNameRequired="File name from props for error display"
          fileTypesAllowed="File types from props for error display"
          formId="uploadFile"
          pageHeading="Title from props"
          submitButtonLabel="Submit text from props"
          urlSuccessPage="/success-page/123"
          urlThisPage="/this-page/123"
        />
      </MemoryRouter>,
    );
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(FILE_UPLOAD_FIELD_ERRORS_URL, {
      state: {
        errorList: [
          {
            cell: 'B1',
            message: 'words we put into UI',
            order: 'zz',
          },
          {
            cell: 'B2',
            message: 'nice error message',
            order: 'zz',
          },
          {
            cell: '',
            message: 'Comes from api and does not show key in UI',
            order: 'zz',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should navigate to the error component if the API returns any other 400 error AND order based on specified order - and we have a mapping file with ordering', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        B1: 'received from api - with mapping file',
        B2: 'received from api - with mapping file',
        __root__: 'Comes from api and does not show key in UI',
      });
    render(
      <MemoryRouter>
        <FileUploadForm
          endpoint="/specific-endpoint-path-for-filetype"
          errorMessageMapFile={testErrorMappingFileWithOrdering}
          fileNameRequired="File name from props for error display"
          fileTypesAllowed="File types from props for error display"
          formId="uploadFile"
          pageHeading="Title from props"
          submitButtonLabel="Submit text from props"
          urlSuccessPage="/success-page/123"
          urlThisPage="/this-page/123"
        />
      </MemoryRouter>,
    );
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(FILE_UPLOAD_FIELD_ERRORS_URL, {
      state: {
        errorList: [
          {
            cell: 'B2',
            message: 'nice error message',
            order: 'a',
          },
          {
            cell: 'B1',
            message: 'words we put into UI',
            order: 'b',
          },
          {
            cell: '',
            message: 'Comes from api and does not show key in UI',
            order: 'zz',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should navigate to the error component if the API returns any other 400 error - and we DO NOT have a mapping file', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        B1: 'received from api for B1 no mapping file',
        B2: 'received from api for B2 no mapping file',
        __root__: 'Comes from api and does not show key in UI',
      });
    renderPage();
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(FILE_UPLOAD_FIELD_ERRORS_URL, {
      state: {
        errorList: [
          {
            cell: 'B1',
            message: 'received from api for B1 no mapping file',
            order: 'zz',
          },
          {
            cell: 'B2',
            message: 'received from api for B2 no mapping file',
            order: 'zz',
          },
          {
            cell: '',
            message: 'Comes from api and does not show key in UI',
            order: 'zz',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should navigate to the error component if the API returns any other 400 error - and the response does NOT look like field level errors', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        message: 'this is an unexpected 400 error',
      });
    renderPage();
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(FILE_UPLOAD_FIELD_ERRORS_URL, {
      state: {
        errorList: [
          {
            cell: 'message',
            message: 'this is an unexpected 400 error',
            order: 'zz',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should show the error component if the API returns any other 400 error - and the response does NOT look like field level errors BUT we do have a mapping file', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        message: 'this is an unexpected 400 error',
      });
    render(
      <MemoryRouter>
        <FileUploadForm
          endpoint="/specific-endpoint-path-for-filetype"
          errorMessageMapFile={testErrorMappingFile}
          fileNameRequired="File name from props for error display"
          fileTypesAllowed="File types from props for error display"
          formId="uploadFile"
          pageHeading="Title from props"
          submitButtonLabel="Submit text from props"
          urlSuccessPage="/success-page/123"
          urlThisPage="/this-page/123"
        />
      </MemoryRouter>,
    );
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(FILE_UPLOAD_FIELD_ERRORS_URL, {
      state: {
        errorList: [
          {
            cell: 'message',
            message: 'this is an unexpected 400 error',
            order: 'zz',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should show the confirmation of upload page on 200 success', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'image.png', { type: 'image/png' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(200, {
        message: 'File successfully uploaded',
      });
    renderPage();
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith('/success-page/123', { state: { fileName: 'image.png' } });
  });

  /* The below should not happen, we have a fallback in the code in case it does */
  it('should show the error message page if we get a success with a status that is NOT 200', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'image.png', { type: 'image/png' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(201, {
        message: 'File successfully uploaded',
      });
    renderPage();
    const input = screen.getByLabelText('Title from props');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { redirectURL: '/this-page/123', title: 'Something has gone wrong' } });
  });
});

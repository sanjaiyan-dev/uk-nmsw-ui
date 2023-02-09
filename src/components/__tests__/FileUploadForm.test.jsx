import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_DISPLAY } from '../../constants/AppConstants';
// import { FILE_MISSING, FILE_TYPE_INVALID_PREFIX } from '../../constants/AppAPIConstants';
// import { LOGGED_IN_LANDING, MESSAGE_URL, SIGN_IN_URL } from '../../constants/AppUrlConstants';
import FileUploadForm from '../FileUploadForm';

const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
}));

const renderPage = () => {
  render(
    <MemoryRouter>
      <FileUploadForm
        declarationId="123"
        endpoint="/specific-endpoint-path-for-filetype"
        fileNameRequired="File name from props for error display"
        fileTypesAllowed="File types from props for error display"
        formId="uploadFile"
        pageHeading="Title from props"
        submitButtonLabel="Submit text from props"
        urlSuccessPage="/success-page"
        urlThisPage="/this-page"
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
    expect(screen.getByLabelText('Upload a file')).toBeInTheDocument();
    expect(screen.getByTestId('fileUploadInput')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit text from props' })).toBeInTheDocument();
  });

  it('should upload a file', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    renderPage();
    const input = screen.getByLabelText('Upload a file');
    await user.upload(input, file);
    expect(input.files[0]).toStrictEqual(file);
    expect(input.files.item(0)).toStrictEqual(file);
    expect(input.files).toHaveLength(1);
  });

  it('should show an error if the user clicks submit button and no file provided', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select a File name from props for error display' })).toBeInTheDocument();
    expect(screen.getAllByText('Select a File name from props for error display')).toHaveLength(2);
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  // it('should show an error if the API returns a no file provided response', async () => {
  //   const user = userEvent.setup();
  //   const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   mockAxios
  //     .onPost('/specific-endpoint-path-for-filetype')
  //     .reply(400, {
  //       message: FILE_MISSING,
  //     });
  //   renderPage();
  //   // make sure file is recognised so the FE no the FE file error isn't triggered
  //   const input = screen.getByLabelText('Upload a file');
  //   await user.upload(input, file);
  //   expect(input.files[0]).toStrictEqual(file);
  //   await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
  //   expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
  //   expect(screen.getByRole('button', { name: 'Select a File name from props for error display' })).toBeInTheDocument();
  //   expect(screen.getAllByText('Select a File name from props for error display')).toHaveLength(2);
  //   expect(scrollIntoViewMock).toHaveBeenCalled();
  // });

  // it('should show an error if API returns a file is invalid type response', async () => {
  //   const user = userEvent.setup();
  //   const file = new File(['template'], 'image.png', { type: 'image/png' });
  //   mockAxios
  //     .onPost('/specific-endpoint-path-for-filetype')
  //     .reply(400, {
  //       message: `${FILE_TYPE_INVALID_PREFIX}: Not a ['xlsx', 'csv']`,
  //     });
  //   renderPage();
  //   const input = screen.getByLabelText('Upload a file');
  //   await user.upload(input, file);
  //   expect(input.files[0]).toStrictEqual(file);
  //   await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
  //   expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
  //   expect(screen.getByRole('button', { name: 'The selected file must be a File types from props for error display' })).toBeInTheDocument();
  //   expect(screen.getAllByText('The selected file must be a File types from props for error display')).toHaveLength(2);
  //   expect(scrollIntoViewMock).toHaveBeenCalled();
  // });

  it('should show an error if filetype is too large and submit button clicked', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE + 1 });
    renderPage();
    const input = screen.getByLabelText('Upload a file');
    await user.upload(input, file);
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(screen.getByRole('alert', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `The file must be smaller than ${MAX_FILE_SIZE_DISPLAY}MB` })).toBeInTheDocument();
    expect(screen.getAllByText(`The file must be smaller than ${MAX_FILE_SIZE_DISPLAY}MB`)).toHaveLength(2);
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should scroll to the error if user clicks on error link', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    await user.click(screen.getByRole('button', { name: 'Select a File name from props for error display' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should clear the error message when a new file is added', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
    expect(screen.getAllByText('Select a File name from props for error display')).toHaveLength(2);
    const input = screen.getByLabelText('Upload a file');
    await user.upload(input, file);
    expect(screen.queryByText('Select a File name from props for error display')).not.toBeInTheDocument();
  });

  // it('should redirect user to sign in with this page and declaration id if missing bearer token', async () => {
  //   const user = userEvent.setup();
  //   const file = new File(['template'], 'image.png', { type: 'image/png' });
  //   mockAxios
  //     .onPost('/specific-endpoint-path-for-filetype')
  //     .reply(401);
  //   renderPage();
  //   const input = screen.getByLabelText('Upload a file');
  //   await user.upload(input, file);
  //   expect(input.files[0]).toStrictEqual(file);
  //   await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
  //   expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: '/this-page', declarationId: '123' } });
  // });

  // it('should redirect user to message page with state of your voyages page and declaration id if 404 error', async () => {
  //   const user = userEvent.setup();
  //   const file = new File(['template'], 'image.png', { type: 'image/png' });
  //   mockAxios
  //     .onPost('/specific-endpoint-path-for-filetype')
  //     .reply(404);
  //   renderPage();
  //   const input = screen.getByLabelText('Upload a file');
  //   await user.upload(input, file);
  //   expect(input.files[0]).toStrictEqual(file);
  //   await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
  //   expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { redirectURL: LOGGED_IN_LANDING, title: 'Something has gone wrong', declarationId: '123' } });
  // });

  // it('should redirect user to message page with state of this page and declaration id if 500 error', async () => {
  //   const user = userEvent.setup();
  //   const file = new File(['template'], 'image.png', { type: 'image/png' });
  //   mockAxios
  //     .onPost('/specific-endpoint-path-for-filetype')
  //     .reply(500);
  //   renderPage();
  //   const input = screen.getByLabelText('Upload a file');
  //   await user.upload(input, file);
  //   expect(input.files[0]).toStrictEqual(file);
  //   await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
  //   expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { redirectURL: '/this-page', title: 'Something has gone wrong', declarationId: '123' } });
  // });

  // it('should show the confirmation of upload page on success', async () => {
  //   const user = userEvent.setup();
  //   const file = new File(['template'], 'image.png', { type: 'image/png' });
  //   mockAxios
  //     .onPost('/specific-endpoint-path-for-filetype')
  //     .reply(200, {
  //       message: 'File successfully uploaded',
  //     });
  //   renderPage();
  //   const input = screen.getByLabelText('Upload a file');
  //   await user.upload(input, file);
  //   expect(input.files[0]).toStrictEqual(file);
  //   await user.click(screen.getByRole('button', { name: 'Submit text from props' }));
  //   expect(mockedUseNavigate).toHaveBeenCalledWith('/success-page', { state: { declarationId: '123' } });
  // });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { FILE_UPLOAD_FIELD_ERRORS_URL } from '../../../constants/AppUrlConstants';
import ErrorMappingFal1 from '../../../constants/ErrorMappingFal1';
import FileUploadForm from '../../../components/FileUploadForm';

const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
}));

const renderPage = () => {
  render(
    <MemoryRouter>
      <FileUploadForm
        endpoint="/specific-endpoint-path-for-filetype"
        errorMessageMapFile={ErrorMappingFal1}
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

describe('Error mapping for General Declaration FAL 1 tests', () => {
  const mockAxios = new MockAdapter(axios);
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should map the mandatory fields missing General Declaration FAL 1 errors, in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        B3: 'none is not an allowed value',
        D3: 'none is not an allowed value',
        F3: 'none is not an allowed value',
        B4: 'none is not an allowed value',
        D4: 'none is not an allowed value',
        B2: 'none is not an allowed value',
        B6: 'none is not an allowed value',
        D6: 'none is not an allowed value',
        F6: 'none is not an allowed value',
        B5: 'none is not an allowed value',
        D5: 'none is not an allowed value',
        F5: 'none is not an allowed value',
        D7: 'none is not an allowed value',
        F7: 'none is not an allowed value',
        B13: 'none is not an allowed value',
        __root__: 'Enter a date of arrival',
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
            cell: 'B2',
            message: "You must select either 'arrival in the UK' or 'departure from the UK'",
            order: 'a',
          },
          {
            cell: 'B3',
            message: 'You must enter the name of the ship',
            order: 'b',
          },
          {
            cell: 'D3',
            message: 'Enter the IMO number',
            order: 'c',
          },
          {
            cell: 'F3',
            message: 'Enter the call sign',
            order: 'd',
          },
          {
            cell: 'B4',
            message: 'Enter the name of master or authorised officer on board',
            order: 'e',
          },
          {
            cell: 'D4',
            message: 'Enter the 3-letter code for the flag state or the country where the vessel is usually based',
            order: 'f',
          },
          {
            cell: 'B5',
            message: 'Enter a LOCODE for the arrival port',
            order: 'g',
          },
          {
            cell: 'D5',
            message: 'Enter a date of arrival',
            order: 'h',
          },
          {
            cell: 'F5',
            message: 'Enter an arrival time',
            order: 'i',
          },
          {
            cell: 'B6',
            message: 'Enter a LOCODE for the departure port',
            order: 'j',
          },
          {
            cell: 'D6',
            message: 'Enter a date of departure',
            order: 'k',
          },
          {
            cell: 'F6',
            message: 'Enter a departure time',
            order: 'l',
          },
          {
            cell: 'D7',
            message: 'Enter a last port of call LOCODE',
            order: 'm',
          },
          {
            cell: 'F7',
            message: 'Enter a next port of call LOCODE',
            order: 'n',
          },
          {
            cell: 'B13',
            message: "Enter a brief description of the cargo, or put 'No cargo'",
            order: 'o',
          },
          {
            cell: '',
            message: 'Enter a date of arrival',
            order: 'zz',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should map the too many characters General Declaration FAL 1 errors, in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        B3: 'ensure this value has at most 35 characters',
        B4: 'ensure this value has at most 35 characters',
        B13: 'ensure this value has at most 35 characters',
        D4: 'Enter the code for the country using 3 letters as given in the ISO list of 3166-1 alpha 3 codes',
        F3: 'ensure this value has at most 35 characters',
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
            cell: 'B3',
            message: 'Enter the name of the ship using 35 characters or less',
            order: 'b',
          },
          {
            cell: 'F3',
            message: 'Enter the call sign using 35 characters or less',
            order: 'd',
          },
          {
            cell: 'B4',
            message: 'Enter the name of the master using 35 characters or less',
            order: 'e',
          },
          {
            cell: 'D4',
            message: 'Enter the code for the country using 3 letters as given in the ISO list of 3166-1 alpha 3 codes ',
            order: 'f',
          },
          {
            cell: 'B13',
            message: 'Enter the cargo details using 35 characters or less',
            order: 'o',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should map the invalid characters General Declaration FAL 1 errors, in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        B3: 'Enter the value using English letters instead of special characters not recognised',
        B4: 'Enter the value using English letters instead of special characters not recognised',
        B13: 'Enter the value using English letters instead of special characters not recognised',
        F3: 'Enter the call sign using only letters and numbers',
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
            cell: 'B3',
            message: 'Enter the ship\'s name using English letters instead of special characters not recognised',
            order: 'b',
          },
          {
            cell: 'F3',
            message: 'Enter the call sign using only letters and numbers',
            order: 'd',
          },
          {
            cell: 'B4',
            message: 'Enter the name of the master using English letters instead of special characters not recognised',
            order: 'e',
          },
          {
            cell: 'B13',
            message: 'Enter the description using English letters instead of special characters not recognised',
            order: 'o',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should map the invalid format for IMO or LOCODE General Declaration FAL 1 errors, in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        B5: 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter NOXXX',
        B6: 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter NOXXX',
        D3: 'Enter 7 numbers for the IMO number',
        D7: 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter NOXXX',
        F7: 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter NOXXX',
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
            cell: 'D3',
            message: 'Enter 7 numbers for the IMO number',
            order: 'c',
          },
          {
            cell: 'B5',
            message: 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter the country code and then XXX',
            order: 'g',
          },
          {
            cell: 'B6',
            message: 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter the country code and then XXX',
            order: 'j',
          },
          {
            cell: 'D7',
            message: 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter the country code and then XXX',
            order: 'm',
          },
          {
            cell: 'F7',
            message: 'Enter a LOCODE that contains 5 letters, for example NL RTM or NLRTM. If no LOCODE exists for the location, enter the country code and then XXX',
            order: 'n',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should map the arrival related General Declaration FAL 1 errors, in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        B5: 'You selected arrival in the UK. Enter an arrival LOCODE that starts with GB',
        B6: 'You selected arrival in the UK. Enter a departure LOCODE for the last port of call and not a GB port',
        D7: 'Enter a last port of call that matches the last port of call you gave in cell B6',
        F7: 'Enter a LOCODE that does not start with GB for the last port of call',
        __root__: 'You selected arrival in the UK. Enter an arrival date and time that is after the departure from the previous port',
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
            cell: 'B5',
            message: 'You selected arrival in the UK. Enter an arrival LOCODE that starts with GB',
            order: 'g',
          },
          {
            cell: 'B6',
            message: 'You selected arrival in the UK. Enter a departure LOCODE for the last port of call and not a GB port',
            order: 'j',
          },
          {
            cell: 'D7',
            message: 'Enter a last port of call that matches the last port of call you gave in cell B6',
            order: 'm',
          },
          {
            cell: 'F7',
            message: 'Enter a LOCODE that does not start with GB for the next port of call',
            order: 'n',
          },
          {
            cell: '',
            message: 'You selected arrival in the UK. Enter an arrival date and time that is after the departure from the previous port',
            order: 'zz',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should map the departure related General Declaration FAL 1 errors, in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        B5: 'You selected departure in the UK. Enter an arrival LOCODE for the next port of call and not a GB port',
        B6: 'You selected departure from the UK. Enter an departure LOCODE that starts with GB',
        D7: 'Enter a LOCODE that does not start with GB for the last port of call',
        F7: 'Enter a last port of call that matches the last port of call you gave in cell B5',
        __root__: 'You selected departure from the UK. Enter a departure date and time that is before the arrival at the next port',
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
            cell: 'B5',
            message: 'You selected departure from the UK. Enter an arrival LOCODE for the next port of call and not a GB port',
            order: 'g',
          },
          {
            cell: 'B6',
            message: 'You selected departure from the UK. Enter a departure LOCODE that starts with GB',
            order: 'j',
          },
          {
            cell: 'D7',
            message: 'Enter a LOCODE that does not start with GB for the last port of call',
            order: 'm',
          },
          {
            cell: 'F7',
            message: 'Enter a next port of call that matches the next port of call you gave in cell B5',
            order: 'n',
          },
          {
            cell: '',
            message: 'You selected departure from the UK. Enter a departure date and time that is before the arrival at the next port',
            order: 'zz',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should error if departure is more than 24 hours in the future on General Declaration FAL 1', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        __root__: 'Enter a departure date from the UK that is not more than 24 hours in the future',
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
            cell: '',
            message: 'Enter a departure date from the UK that is not more than 24 hours in the future',
            order: 'zz',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });
});

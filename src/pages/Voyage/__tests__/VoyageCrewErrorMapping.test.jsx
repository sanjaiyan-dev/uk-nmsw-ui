import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { FILE_UPLOAD_FIELD_ERRORS_URL } from '../../../constants/AppUrlConstants';
import ErrorMappingFal5 from '../../../constants/ErrorMappingFal5';
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
        errorMessageMapFile={ErrorMappingFal5}
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

describe('Error mapping for Crew Details (FAL 5) tests', () => {
  const mockAxios = new MockAdapter(axios);
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should map the mandatory fields missing Crew Details (FAL 5) errors, in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        F5: 'none is not an allowed value',
        A5: 'none is not an allowed value',
        C5: 'none is not an allowed value',
        H5: 'Enter M for male, F for female, or X for gender neutral if this is in the Travel Document',
        D5: 'none is not an allowed value',
        E5: 'none is not an allowed value',
        G5: 'none is not an allowed value',
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
            cell: 'A5',
            message: 'Enter P, I or O, or you may enter the full word: P - Passport, I - ID card - for a national ID card or O - Other - for any other document',
            order: 'a',
          },
          {
            cell: 'C5',
            message: 'Enter the 3-letter ISO country code for the issuing country; for example, GBR, SWE, NLD',
            order: 'c',
          },
          {
            cell: 'D5',
            message: 'Enter the number of the travel document',
            order: 'd',
          },
          {
            cell: 'E5',
            message: 'Enter the rank, rating or job title; for supernumeraries just put SN or supernumerary, not the job title',
            order: 'e',
          },
          {
            cell: 'F5',
            message: 'Enter family name or surname as it appears in the travel document',
            order: 'f',
          },
          {
            cell: 'G5',
            message: 'Enter all forenames or given names as they appear in the travel document - if the crew member has no forename recorded enter UNKNOWN',
            order: 'g',
          },
          {
            cell: 'H5',
            message: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document',
            order: 'h',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should map correctly if there is an error for other document type field', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        B5: "You entered 'Other' as the travel document type. You must enter the type of travel document, for example SID for Seafarer's Identity Document",
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
            message: "You entered 'Other' as the travel document type. You must enter the type of travel document, for example SID for Seafarer's Identity Document",
            order: 'b',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should map the too many characters Crew Details (FAL 5) errors, in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        C5: 'Enter the country as a 3-letter ISO country code; for example, GBR, SWE, NLD',
        F6: 'Value must be 35 characters or less',
        K5: 'Enter the country as a 3-letter ISO country code; for example, GBR, SWE, NLD',
        D13: 'ensure this value has at most 35 characters',
        G9: 'Value must be 35 characters or less',
        E5: 'Value must be 35 characters or less',
        J10: 'Value must be 35 characters or less',
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
            cell: 'C5',
            message: 'Enter the issuing country as a 3-letter ISO country code; for example, GBR, SWE, NLD',
            order: 'c',
          },
          {
            cell: 'D13',
            message: 'Enter the number of the travel document in 35 characters or less',
            order: 'd',
          },
          {
            cell: 'E5',
            message: 'Enter the rank, rating or job title in 35 characters or less',
            order: 'e',
          },
          {
            cell: 'F6',
            message: 'Enter family name or surname in 35 characters or less',
            order: 'f',
          },
          {
            cell: 'G9',
            message: 'Enter all forenames or given names in 35 characters or less',
            order: 'g',
          },
          {
            cell: 'J10',
            message: 'Enter the place of birth in 35 characters or less',
            order: 'j',
          },
          {
            cell: 'K5',
            message: 'Enter the nationality as a 3-letter ISO country code; for example, GBR, SWE, NLD',
            order: 'k',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should map the invalid characters and incorrect values Crew Details (FAL 5) errors, in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        A5: 'Enter travel document as P, I, O or as Passport, ID card, Other',
        E12: 'Value must use English letters instead of special characters not recognised',
        D8: 'Number of the travel document must be only numbers',
        G9: 'Value must use English letters instead of special characters not recognised',
        F6: 'Value must use English letters instead of special characters not recognised',
        J22: 'Value must use English letters instead of special characters not recognised',
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
            cell: 'A5',
            message: 'Enter travel document as P, I, O or as Passport, ID card, Other',
            order: 'a',
          },
          {
            cell: 'D8',
            message: 'Enter the number of the travel document using only numbers',
            order: 'd',
          },
          {
            cell: 'E12',
            message: 'Enter the rank, rating or job title using English letters instead of special characters not recognised',
            order: 'e',
          },
          {
            cell: 'F6',
            message: 'Enter family name or surname using English letters instead of special characters not recognised',
            order: 'f',
          },
          {
            cell: 'G9',
            message: 'Enter forenames using English letters instead of special characters not recognised',
            order: 'g',
          },
          {
            cell: 'J22',
            message: 'Enter place of birth using English letters instead of special characters not recognised',
            order: 'j',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should map the dates in the wrong format for Crew Details (FAL 5) errors, in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        L8: 'Date must be in the dd/mm/yyyy format, for example, 22/02/2002',
        I6: 'Date must be in the dd/mm/yyyy format, for example, 22/02/2002',
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
            cell: 'I6',
            message: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022',
            order: 'i',
          },
          {
            cell: 'L8',
            message: 'Enter the travel document expiry date in the dd/mm/yyyy format, for example, 12/02/2022',
            order: 'l',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });
});

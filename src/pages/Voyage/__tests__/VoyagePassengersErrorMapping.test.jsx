import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { FILE_UPLOAD_FIELD_ERRORS_URL } from '../../../constants/AppUrlConstants';
import ErrorMappingFal6 from '../../../constants/ErrorMappingFal6';
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
        errorMessageMapFile={ErrorMappingFal6}
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

describe('Error mapping for Passenger details (FAL 6) tests', () => {
  const mockAxios = new MockAdapter(axios);
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should map the mandatory fields missing Passenger details (FAL 6), in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        F5: 'field required',
        A5: 'field required',
        C5: 'field required',
        G5: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document',
        D5: 'field required',
        E5: 'field required',
        M5: 'field required',
        O5: 'field required',
        N5: 'field required',
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
            message: 'Enter family name or surname as it appears in the travel document',
            order: 'e',
          },
          {
            cell: 'F5',
            message: 'Enter all forenames or given names as they appear in the travel document - if the crew member has no forename recorded enter UNKNOWN',
            order: 'f',
          },
          {
            cell: 'G5',
            message: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document',
            order: 'g',
          },
          {
            cell: 'M5',
            message: 'Enter the name of the port or the LOCODE for the port; for example, Southampton, GBSOU or GB SOU',
            order: 'm',
          },
          {
            cell: 'N5',
            message: 'Enter the name of the port or the LOCODE for the port; for example, Southampton, GBSOU or GB SOU',
            order: 'n',
          },
          {
            cell: 'O5',
            message: 'Enter Yes or Y if this passenger is in transit and No or N if this passenger is disembarking or embarking in the UK',
            order: 'o',
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

  it('should map the too many characters Passenger details (FAL 6), in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        C5: 'Enter the country as a 3-letter ISO country code; for example, GBR, SWE, NLD',
        F6: 'forenames must be 35 characters or less',
        J20: 'Enter the country as a 3-letter ISO country code; for example, GBR, SWE, NLD',
        D13: 'travel document number must be 35 characters or less',
        L97: 'cabin must be 35 characters or less',
        E28: 'surname must be 35 characters or less',
        I123: 'place of birth must be 35 characters or less',
        G45: 'ensure this value has at most 6 characters',
        M7: 'port of embarkation must be 35 characters or less',
        N55: 'port of disembarkation must be 35 characters or less',
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
            cell: 'E28',
            message: 'Enter family name or surname in 35 characters or less',
            order: 'e',
          },
          {
            cell: 'F6',
            message: 'Enter all forenames or given names in 35 characters or less',
            order: 'f',
          },
          {
            cell: 'G45',
            message: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document',
            order: 'g',
          },
          {
            cell: 'I123',
            message: 'Enter the place of birth in 35 characters or less',
            order: 'i',
          },
          {
            cell: 'J20',
            message: 'Enter the nationality as a 3-letter ISO country code; for example, GBR, SWE, NLD',
            order: 'j',
          },
          {
            cell: 'L97',
            message: 'Enter the cabin number in 35 characters or less',
            order: 'l',
          },
          {
            cell: 'M7',
            message: 'Enter the name of the port in 35 characters or less',
            order: 'm',
          },
          {
            cell: 'N55',
            message: 'Enter the name of the port in 35 characters or less',
            order: 'n',
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
        D8: 'Number of the travel document must be only numbers',
        E45: 'Enter the surname using English letters instead of special characters not recognised',
        F87: 'Enter the forenames using English letters instead of special characters not recognised',
        G54: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document',
        I9: 'Enter the place of birth using English letters instead of special characters not recognised',
        L16: 'Enter the cabin using only letters and numbers',
        M23: 'Enter the port of embarkation using only letters and numbers',
        N54: 'Enter the port of disembarkation using only letters and numbers',
        O12: 'Enter Yes or Y if this passenger is in transit and No or N if this passenger is disembarking or embarking in the UK',
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
            cell: 'E45',
            message: 'Enter family name or surname using English letters instead of special characters not recognised',
            order: 'e',
          },
          {
            cell: 'F87',
            message: 'Enter forenames using English letters instead of special characters not recognised',
            order: 'f',
          },
          {
            cell: 'G54',
            message: 'Enter M for male, F for female, or X for gender neutral if this is in the travel document',
            order: 'g',
          },
          {
            cell: 'I9',
            message: 'Enter place of birth using English letters instead of special characters not recognised',
            order: 'i',
          },
          {
            cell: 'L16',
            message: 'Enter the cabin number using letters and numbers only and omit any other characters',
            order: 'l',
          },
          {
            cell: 'M23',
            message: 'Enter the name of the port using English letters instead of special characters not recognised',
            order: 'm',
          },
          {
            cell: 'N54',
            message: 'Enter the name of the port using English letters instead of special characters not recognised',
            order: 'n',
          },
          {
            cell: 'O12',
            message: 'Enter Yes or Y if this passenger is in transit and No or N if this passenger is disembarking or embarking in the UK',
            order: 'o',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });

  it('should map the dates in the wrong format for Passenger details (FAL 6) errors, in the specified order', async () => {
    const user = userEvent.setup();
    const file = new File(['template'], 'template.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    mockAxios
      .onPost('/specific-endpoint-path-for-filetype')
      .reply(400, {
        K8: 'Date must be in the dd/mm/yyyy format, for example, 22/02/2002',
        H6: 'Date must be in the dd/mm/yyyy format, for example, 22/02/2002',
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
            cell: 'H6',
            message: 'Enter the date of birth in the dd/mm/yyyy format, for example, 12/02/2022',
            order: 'h',
          },
          {
            cell: 'K8',
            message: 'Enter the travel document expiry date in the dd/mm/yyyy format, for example, 12/02/2022',
            order: 'k',
          },
        ],
        fileName: 'template.xlsx',
        returnURL: '/this-page/123',
      },
    });
  });
});

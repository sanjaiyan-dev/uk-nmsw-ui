import { MemoryRouter } from 'react-router-dom';
import {
  render,
  screen,
  // waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { DECLARATION_STATUS_PRECANCELLED, DECLARATION_STATUS_PRESUBMITTED } from '../../../constants/AppConstants';
import {
  MESSAGE_URL,
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_CHECK_YOUR_ANSWERS,
  // VOYAGE_CREW_UPLOAD_URL,
  // VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  // VOYAGE_PASSENGERS_URL,
  // VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
  YOUR_VOYAGES_URL,
} from '../../../constants/AppUrlConstants';
import {
  API_URL, ENDPOINT_DECLARATION_ATTACHMENTS_PATH, ENDPOINT_DECLARATION_PATH, TOKEN_EXPIRED,
} from '../../../constants/AppAPIConstants';
import VoyageCheckYourAnswers from '../VoyageCheckYourAnswers';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage check your answers page', () => {
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  const mockAxios = new MockAdapter(axios);
  const mockedFAL1And5Response = {
    FAL1: {
      nameOfShip: 'Test ship name',
      status: 'Draft',
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
      submissionDate: null,
    },
    FAL5: [
      {
        filename: 'Crew details including supernumeraries FAL 5.xlsx',
        id: 'FAL5',
        size: '118385',
        url: 'https://fal5-report-link.com',
      },
    ],
    FAL6: [],
    supporting: [],
  };

  const mockedAllResponse = {
    FAL1: {
      nameOfShip: 'Test ship name',
      status: 'Draft',
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
      passengers: true,
      creationDate: '2023-02-10',
      submissionDate: null,
    },
    FAL5: [
      {
        filename: 'Crew details including supernumeraries FAL 5.xlsx',
        id: 'FAL5',
        size: '118385',
        url: 'https://fal5-report-link.com',
      },
    ],
    FAL6: [
      {
        filename: 'Passenger details FAL 6.xlsx',
        id: 'FAL6',
        size: '118385',
        url: 'https://fal6-report-link.com',
      },
    ],
    supporting: [
      {
        id: '123abc',
        filename: 'MyFirstDocument.xlsx',
        size: '90610',
        url: 'https://first-doc-link.com',
      },
      {
        id: '123def',
        filename: 'My-second-doc.xlsx',
        size: '90610',
        url: 'https://second-doc-link.com',
      },
    ],
  };

  const mockedFAL1Only = {
    FAL1: {
      nameOfShip: 'Test ship name',
      status: 'Draft',
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
      passengers: null,
      creationDate: '2023-02-10',
      submissionDate: null,
    },
    FAL5: [],
    FAL6: [],
    supporting: [],
  };

  const mockedPassengerYesButNoFAL6 = {
    FAL1: {
      nameOfShip: 'Test ship name',
      status: 'Draft',
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
      passengers: true,
      creationDate: '2023-02-10',
      submissionDate: null,
    },
    FAL5: [
      {
        filename: 'Crew details including supernumeraries FAL 5.xlsx',
        id: 'FAL5',
        size: '118385',
        url: 'https://fal5-report-link.com',
      },
    ],
    FAL6: [],
    supporting: [],
  };

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  const renderPage = () => {
    render(
      <MemoryRouter initialEntries={[`${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=123`]}>
        <VoyageCheckYourAnswers />
      </MemoryRouter>,
    );
  };

  // ==========================
  // RENDER TESTS
  // ==========================
  it('should render an error without declarationId params', async () => {
    render(
      <MemoryRouter initialEntries={[`${VOYAGE_CHECK_YOUR_ANSWERS}`]}>
        <VoyageCheckYourAnswers />
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a class="govuk-link" href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should redirect to Sign In if GET call returns a 401 response', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: '',
        },
      })
      .reply(401);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=123` } });
  });

  it('should redirect to Sign In if GET call returns a 422 response', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: '',
        },
      })
      .reply(422);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=123` } });
  });

  it('should redirect to message page if GET call returns a 500 response', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(500);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, {
      state: {
        title: 'Something has gone wrong',
        message: undefined,
        redirectURL: YOUR_VOYAGES_URL,
      },
    });
  });

  it('should render the headings the page', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('heading', { name: 'Check your answers' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Voyage details' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Uploaded documents' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Now send your application' })).toBeInTheDocument();
    expect(screen.getByText('By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.')).toBeInTheDocument();
  });

  it('should render the submit button on the page', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('button', { name: 'Save and submit' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Save and submit</button>');
  });

  it('should render the list titles on the page', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Voyage type').outerHTML).toEqual('<dt class="govuk-summary-list__key">Voyage type</dt>');
    expect(screen.getByText('Ship name').outerHTML).toEqual('<dt class="govuk-summary-list__key">Ship name</dt>');
    expect(screen.getByText('IMO number').outerHTML).toEqual('<dt class="govuk-summary-list__key">IMO number</dt>');
    expect(screen.getByText('Call sign').outerHTML).toEqual('<dt class="govuk-summary-list__key">Call sign</dt>');
    expect(screen.getByText('Flag state of ship').outerHTML).toEqual('<dt class="govuk-summary-list__key">Flag state of ship</dt>');
    expect(screen.getByText('Departure details').outerHTML).toEqual('<dt class="govuk-summary-list__key">Departure details</dt>');
    expect(screen.getByText('Next port of call').outerHTML).toEqual('<dt class="govuk-summary-list__key">Next port of call</dt>');
    expect(screen.getByText('Brief description of the cargo').outerHTML).toEqual('<dt class="govuk-summary-list__key">Brief description of the cargo</dt>');
    expect(screen.getByText('Crew details').outerHTML).toEqual('<dt id="crewDetails" class="govuk-summary-list__key">Crew details</dt>');
    expect(screen.getByText('Passenger details').outerHTML).toEqual('<dt id="passengerDetails" class="govuk-summary-list__key">Passenger details</dt>');
    expect(screen.getByText('Supporting documents').outerHTML).toEqual('<dt id="supportingDocuments" class="govuk-summary-list__key">Supporting documents</dt>');
  });

  it('should fallback to displaying the alphaCode if we do not find a match in the country name lookup on flagState', async () => {
    mockAxios
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
          flagState: 'HON',
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
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('HON').outerHTML).toEqual('<dd class="govuk-summary-list__value">HON</dd>');
  });

  // ==========================
  // UPLOADED DOCUMENT TESTS
  // ==========================
  // To view the CYA page the FAL 5 file much be present
  it('should render the General Declaration values and a Crew Details FAL 5 link', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Arrival to the UK').outerHTML).toEqual('<dd class="govuk-summary-list__value">Arrival to the UK</dd>');
    expect(screen.getByText('Test ship name').outerHTML).toEqual('<dd class="govuk-summary-list__value">Test ship name</dd>');
    expect(screen.getByText('1234567').outerHTML).toEqual('<dd class="govuk-summary-list__value">1234567</dd>');
    expect(screen.getByText('NA').outerHTML).toEqual('<dd class="govuk-summary-list__value">NA</dd>');
    expect(screen.getByText('United Kingdom of Great Britain and Northern Ireland').outerHTML).toEqual('<dd class="govuk-summary-list__value">United Kingdom of Great Britain and Northern Ireland</dd>');
    // departure block
    expect(screen.getByText('Departure port LOCODE').outerHTML).toEqual('<span>Departure port LOCODE</span>');
    expect(screen.getByText('AU POR').outerHTML).toEqual('<p class="govuk-!-margin-bottom-2 govuk-!-margin-top-0">AU POR</p>');
    expect(screen.getByText('Date of departure').outerHTML).toEqual('<span>Date of departure</span>');
    expect(screen.getByText('12 February 2023').outerHTML).toEqual('<p class="govuk-!-margin-bottom-2 govuk-!-margin-top-0">12 February 2023</p>');
    expect(screen.getByText('Time of departure').outerHTML).toEqual('<span>Time of departure</span>');
    expect(screen.getByText('09:23').outerHTML).toEqual('<p class="govuk-!-margin-bottom-2 govuk-!-margin-top-0">09:23</p>');
    // arrival block
    expect(screen.getByText('Arrival port LOCODE').outerHTML).toEqual('<span>Arrival port LOCODE</span>');
    expect(screen.getByText('GB DOV').outerHTML).toEqual('<p class="govuk-!-margin-bottom-2 govuk-!-margin-top-0">GB DOV</p>');
    expect(screen.getByText('Date of arrival').outerHTML).toEqual('<span>Date of arrival</span>');
    expect(screen.getByText('15 February 2023').outerHTML).toEqual('<p class="govuk-!-margin-bottom-2 govuk-!-margin-top-0">15 February 2023</p>');
    expect(screen.getByText('Time of arrival').outerHTML).toEqual('<span>Time of arrival</span>');
    expect(screen.getByText('14:00').outerHTML).toEqual('<p class="govuk-!-margin-bottom-2 govuk-!-margin-top-0">14:00</p>');

    expect(screen.getByText('NL RTM').outerHTML).toEqual('<dd class="govuk-summary-list__value">NL RTM</dd>');
    expect(screen.getByText('No cargo').outerHTML).toEqual('<dd class="govuk-summary-list__value">No cargo</dd>');
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries FAL 5.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">Crew details including supernumeraries FAL 5.xlsx</a>');
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByText('No supporting documents provided')).toBeInTheDocument();
  });

  it('should render none present text if no passengers and/or no supporting docs', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByText('No supporting documents provided')).toBeInTheDocument();
  });

  it('should render link for Passenger details if a file is present', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedAllResponse);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries FAL 5.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">Crew details including supernumeraries FAL 5.xlsx</a>');
    expect(screen.getByRole('link', { name: 'Passenger details FAL 6.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal6-report-link.com" download="">Passenger details FAL 6.xlsx</a>');
  });

  it('should render link(s) for supporting documents if present', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedAllResponse);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    expect(screen.getByRole('link', { name: 'MyFirstDocument.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://first-doc-link.com" download="">MyFirstDocument.xlsx</a>');
    expect(screen.getByRole('link', { name: 'My-second-doc.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://second-doc-link.com" download="">My-second-doc.xlsx</a>');
  });

  // ==========================
  // CHANGE LINK TESTS
  // ==========================
  /*
   * This click not working with react-router-dom, ticket open to investigate and improve tests
   * for now in the tests below we're testing the a href is correct
   * and in the Cypress tests that the correct looking page loads
  */

  it('should show change links if status is Draft', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('link', { name: 'Change change Supporting documents' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change change Supporting documents' }).outerHTML).toEqual('<a class="govuk-link" aria-describedby="supportingDocuments" href="/report-voyage/upload-supporting-documents?report=123">Change<span class="govuk-visually-hidden"> change Supporting documents</span></a>');
    expect(screen.getByRole('link', { name: 'Change change voyage details' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change change voyage details' }).outerHTML).toEqual('<a class="govuk-link" aria-describedby="voyageDetails" href="/report-voyage/upload-general-declaration?report=123">Change<span class="govuk-visually-hidden"> change voyage details</span></a>');
    expect(screen.getByRole('link', { name: 'Change change Crew details' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change change Crew details' }).outerHTML).toEqual('<a class="govuk-link" aria-describedby="crewDetails" href="/report-voyage/upload-crew-details?report=123">Change<span class="govuk-visually-hidden"> change Crew details</span></a>');
    expect(screen.getByRole('link', { name: 'Change change Passenger details' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change change Passenger details' }).outerHTML).toEqual('<a class="govuk-link" aria-describedby="passengerDetails" href="/report-voyage/passenger-details?report=123">Change<span class="govuk-visually-hidden"> change Passenger details</span></a>');
    expect(screen.getByRole('link', { name: 'Change change Supporting documents' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change change Supporting documents' }).outerHTML).toEqual('<a class="govuk-link" aria-describedby="supportingDocuments" href="/report-voyage/upload-supporting-documents?report=123">Change<span class="govuk-visually-hidden"> change Supporting documents</span></a>');
  });

  it('should NOT show change links if status is PreSubmitted', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'PreSubmitted',
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
          passengers: true,
          creationDate: '2023-02-10',
          submissionDate: null,
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [
          {
            filename: 'Passenger details FAL 6.xlsx',
            id: 'FAL6',
            size: '118385',
            url: 'https://fal6-report-link.com',
          },
        ],
        supporting: [
          {
            id: '123abc',
            filename: 'MyFirstDocument.xlsx',
            size: '90610',
            url: 'https://first-doc-link.com',
          },
          {
            id: '123def',
            filename: 'My-second-doc.xlsx',
            size: '90610',
            url: 'https://second-doc-link.com',
          },
        ],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change voyage details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Crew details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Passenger details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
  });

  it('should NOT show change links if status is Submitted', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Submitted',
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
          passengers: true,
          creationDate: '2023-02-10',
          submissionDate: null,
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [
          {
            filename: 'Passenger details FAL 6.xlsx',
            id: 'FAL6',
            size: '118385',
            url: 'https://fal6-report-link.com',
          },
        ],
        supporting: [
          {
            id: '123abc',
            filename: 'MyFirstDocument.xlsx',
            size: '90610',
            url: 'https://first-doc-link.com',
          },
          {
            id: '123def',
            filename: 'My-second-doc.xlsx',
            size: '90610',
            url: 'https://second-doc-link.com',
          },
        ],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change voyage details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Crew details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Passenger details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
  });

  it('should NOT show change links if status is PreCancelled', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'PreCancelled',
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
          passengers: true,
          creationDate: '2023-02-10',
          submissionDate: null,
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [
          {
            filename: 'Passenger details FAL 6.xlsx',
            id: 'FAL6',
            size: '118385',
            url: 'https://fal6-report-link.com',
          },
        ],
        supporting: [
          {
            id: '123abc',
            filename: 'MyFirstDocument.xlsx',
            size: '90610',
            url: 'https://first-doc-link.com',
          },
          {
            id: '123def',
            filename: 'My-second-doc.xlsx',
            size: '90610',
            url: 'https://second-doc-link.com',
          },
        ],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change voyage details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Crew details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Passenger details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
  });

  it('should NOT show change links if status is Cancelled', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Cancelled',
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
          passengers: true,
          creationDate: '2023-02-10',
          submissionDate: null,
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [
          {
            filename: 'Passenger details FAL 6.xlsx',
            id: 'FAL6',
            size: '118385',
            url: 'https://fal6-report-link.com',
          },
        ],
        supporting: [
          {
            id: '123abc',
            filename: 'MyFirstDocument.xlsx',
            size: '90610',
            url: 'https://first-doc-link.com',
          },
          {
            id: '123def',
            filename: 'My-second-doc.xlsx',
            size: '90610',
            url: 'https://second-doc-link.com',
          },
        ],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change voyage details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Crew details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Passenger details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
  });

  it('should NOT show change links if status is Failed', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Failed',
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
          passengers: true,
          creationDate: '2023-02-10',
          submissionDate: null,
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [
          {
            filename: 'Passenger details FAL 6.xlsx',
            id: 'FAL6',
            size: '118385',
            url: 'https://fal6-report-link.com',
          },
        ],
        supporting: [
          {
            id: '123abc',
            filename: 'MyFirstDocument.xlsx',
            size: '90610',
            url: 'https://first-doc-link.com',
          },
          {
            id: '123def',
            filename: 'My-second-doc.xlsx',
            size: '90610',
            url: 'https://second-doc-link.com',
          },
        ],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change voyage details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Crew details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Passenger details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
  });

  it('should load the General Declarations upload page if Change next to Voyage Details is clicked', async () => {
    // const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('link', { name: 'Change change voyage details' })).toBeInTheDocument();
    // await user.click(screen.getByRole('link', { name: 'Change change voyage details' }));
    // await waitFor(() => {
    //   expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`, {
    //     preventScrollReset: undefined, relative: undefined, replace: false,
    //   }); // params on Link generated links by default
    // });
  });

  it('should load the Crew upload page if Change next to Crew is clicked', async () => {
    // const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('link', { name: 'Change change Crew details' })).toBeInTheDocument();
    // await user.click(screen.getByRole('link', { name: 'Change change Crew details' }));
    // await waitFor(() => {
    //   expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_CREW_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`, {
    //     preventScrollReset: undefined, relative: undefined, replace: false,
    //   }); // params on Link generated links by default
    // });
  });

  it('should load the Passenger check page if Change next to Passenger is clicked', async () => {
    // const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('link', { name: 'Change change Passenger details' })).toBeInTheDocument();
    // await user.click(screen.getByRole('link', { name: 'Change change Passenger details' }));
    // await waitFor(() => {
    //   expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_PASSENGERS_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`, {
    //     preventScrollReset: undefined, relative: undefined, replace: false,
    //   }); // params on Link generated links by default
    // });
  });

  it('should load the Supporting docs check page if Change next to Supporting documents is clicked', async () => {
    // const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('link', { name: 'Change change Supporting documents' })).toBeInTheDocument();
    // await user.click(screen.getByRole('link', { name: 'Change change Supporting documents' }));
    // await waitFor(() => {
    //   expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`, {
    //     preventScrollReset: undefined, relative: undefined, replace: false,
    //   }); // params on Link generated links by default
    // });
  });

  // =============
  // SUBMIT TESTS
  // =============

  it('should show an error if there is no FAL5 and/or answer to passenger question', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Only);
    mockAxios
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, { status: DECLARATION_STATUS_PRESUBMITTED }, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(500);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await screen.findByRole('heading', { name: 'Check your answers' });
    await user.click(screen.getByRole('button', { name: 'Save and submit' }));
    expect(screen.getByRole('heading', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crew details (FAL 5) upload is required' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'You need to provide passenger details, even if the ship is carrying no passengers' })).toBeInTheDocument();
  });

  it('should show an error if the passenger question was answered YES but there is no passenger file', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedPassengerYesButNoFAL6);
    mockAxios
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, { status: DECLARATION_STATUS_PRESUBMITTED }, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(500);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await screen.findByRole('heading', { name: 'Check your answers' });
    await user.click(screen.getByRole('button', { name: 'Save and submit' }));
    expect(screen.getByRole('heading', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Passenger details (FAL 6) upload is required for ships carrying passengers' })).toBeInTheDocument();
  });

  it('should scroll to document area if user clicks on a required error', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Draft',
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
          passengers: true,
          creationDate: '2023-02-10',
          submissionDate: null,
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await user.click(screen.getByRole('button', { name: 'Save and submit' }));

    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Passenger details (FAL 6) upload is required for ships carrying passengers' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Passenger details (FAL 6) upload is required for ships carrying passengers' }));
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should redirect to message page if Submit returns a 500 response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response);
    mockAxios
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, { status: DECLARATION_STATUS_PRESUBMITTED }, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(500);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await screen.findByRole('heading', { name: 'Check your answers' });
    await user.click(screen.getByRole('button', { name: 'Save and submit' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, {
      state: {
        title: 'Something has gone wrong',
        message: undefined,
        redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=123`,
      },
    });
  });

  it('should redirect to signin page if Submit returns a 422 response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response)
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { status: DECLARATION_STATUS_PRESUBMITTED })
      .reply(422, { msg: 'Not enough segments' });

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await screen.findByRole('heading', { name: 'Check your answers' });
    await user.click(screen.getByRole('button', { name: 'Save and submit' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, {
      state: { redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=123` },
    });
  });

  it('should redirect to signin page if Submit returns a 401 token expired response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response)
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { status: DECLARATION_STATUS_PRESUBMITTED })
      .reply(401, { msg: TOKEN_EXPIRED });

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await screen.findByRole('heading', { name: 'Check your answers' });
    await user.click(screen.getByRole('button', { name: 'Save and submit' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, {
      state: { redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=123` },
    });
  });

  it('should show confirmation message if Submit returns success', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1And5Response)
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { status: DECLARATION_STATUS_PRESUBMITTED })
      .reply(202, {
        id: '123',
        status: 'PreSubmitted',
        creationDate: '2023-04-17',
        submissionDate: '2023-04-17',
        nameOfShip: 'Test Ship',
        imoNumber: '1234567',
        callSign: 'NA',
        signatory: 'Bob Smith',
        flagState: 'GBR',
        departureFromUk: false,
        departurePortUnlocode: 'AU POR',
        departureDate: '2023-02-12',
        departureTime: '09:32:00',
        arrivalPortUnlocode: 'GB DOV',
        arrivalDate: '2023-02-15',
        arrivalTime: '14:00:00',
        previousPortUnlocode: 'AU POR',
        nextPortUnlocode: 'NL RTM',
        cargo: 'No cargo',
        passengers: false,
        cbpId: null,
      });

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await screen.findByRole('heading', { name: 'Check your answers' });
    await user.click(screen.getByRole('button', { name: 'Save and submit' }));

    await screen.findByRole('heading', { name: 'Voyage details submitted' });
    expect(screen.getByRole('heading', { name: 'Voyage details submitted' }).outerHTML).toEqual('<h1 class="govuk-panel__title govuk-!-margin-bottom-6">Voyage details submitted</h1>');
    expect(screen.getByRole('heading', { name: 'What happens next' })).toBeInTheDocument();
    expect(screen.getByText('We will send you an email that you can show to Border Force officers as proof that you have sent these reports.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to your voyages' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to your voyages' }).outerHTML).toEqual('<a href="/your-voyages">Return to your voyages</a>');
  });

  // ==========================
  // STATUS TESTS
  // ==========================
  it('should render no status line and the cta as submit and the h1 as check your answers if status is draft', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Draft',
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
          submissionDate: null,
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Check your answers')).toBeInTheDocument();
    expect(screen.getByText('Now send your application')).toBeInTheDocument();
    expect(screen.getByText('By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save and submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save and submit' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Save and submit</button>');
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });

  it('should render the status as submitted, submission date, h1 of review your report, and a cancel CTA if status is submitted', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Submitted',
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
          submissionDate: '2023-02-10',
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Review your report')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Submitted').outerHTML).toEqual('<strong class="govuk-tag govuk-tag--green">Submitted</strong>');
    expect(screen.getByText('10 February 2023')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' }).outerHTML).toEqual('<button type="button" class="govuk-button govuk-button--warning" data-module="govuk-button">Cancel</button>');
    expect(screen.queryByRole('button', { name: 'Save and submit' })).not.toBeInTheDocument();
    expect(screen.queryByText('Now send your application')).not.toBeInTheDocument();
    expect(screen.queryByText('By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.')).not.toBeInTheDocument();
  });

  it('should render the status as submitted, submission date, h1 of review your report, and a cancel CTA if status is presubmitted', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'PreSubmitted',
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
          submissionDate: '2023-02-10',
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Review your report')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Submitted').outerHTML).toEqual('<strong class="govuk-tag govuk-tag--green">Submitted</strong>');
    expect(screen.getByText('10 February 2023')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' }).outerHTML).toEqual('<button type="button" class="govuk-button govuk-button--warning" data-module="govuk-button">Cancel</button>');
    expect(screen.queryByRole('button', { name: 'Save and submit' })).not.toBeInTheDocument();
    expect(screen.queryByText('Now send your application')).not.toBeInTheDocument();
    expect(screen.queryByText('By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.')).not.toBeInTheDocument();
  });

  it('should render the status as cancelled, submission date, h1 of review your report, and a no CTA if status is canceled', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Cancelled',
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
          submissionDate: '2023-02-10',
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Review your report')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Cancelled').outerHTML).toEqual('<strong class="govuk-tag govuk-tag--orange">Cancelled</strong>');
    expect(screen.getByText('10 February 2023')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save and submit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByText('Now send your application')).not.toBeInTheDocument();
    expect(screen.queryByText('By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.')).not.toBeInTheDocument();
  });

  it('should render the status as cancelled, submission date, h1 of review your report, and a no CTA if status is precanceled', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'PreCancelled',
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
          submissionDate: '2023-02-10',
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Review your report')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Cancelled').outerHTML).toEqual('<strong class="govuk-tag govuk-tag--orange">Cancelled</strong>');
    expect(screen.getByText('10 February 2023')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save and submit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByText('Now send your application')).not.toBeInTheDocument();
    expect(screen.queryByText('By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.')).not.toBeInTheDocument();
  });

  it('should render the status as failed, submission date, h1 of review your report, and a no CTA if status is failed', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Failed',
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
          submissionDate: '2023-02-10',
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Review your report')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Failed').outerHTML).toEqual('<strong class="govuk-tag govuk-tag--red">Failed</strong>');
    expect(screen.getByText('10 February 2023')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save and submit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByText('Now send your application')).not.toBeInTheDocument();
    expect(screen.queryByText('By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.')).not.toBeInTheDocument();
  });

  it('should render the status as null, submission date, and a no CTA if status is unknown', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: null,
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
          submissionDate: '2023-02-10',
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('10 February 2023')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save and submit' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByText('Now send your application')).not.toBeInTheDocument();
    expect(screen.queryByText('By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.')).not.toBeInTheDocument();
  });

  // ==========================
  // CANCEL TESTS
  // ==========================

  it('should show the are you sure question if cancel button clicked', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Submitted',
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
          submissionDate: '2023-02-10',
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await screen.findByRole('heading', { name: 'Are you sure you want to cancel the voyage report?' });
    expect(screen.getByRole('radio', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'No' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('should return to CYA page if no is selected', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Submitted',
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
          submissionDate: '2023-02-10',
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await screen.findByRole('heading', { name: 'Are you sure you want to cancel the voyage report?' });

    await user.click(screen.getByRole('radio', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    await screen.findByRole('heading', { name: 'Review your report' });
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should send status to PreCancelled and on success go to your voyages if yes is selected', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Submitted',
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
          submissionDate: '2023-02-10',
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      })
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { status: DECLARATION_STATUS_PRECANCELLED })
      .reply(202, {
        id: '123',
        status: 'PreSubmitted',
        creationDate: '2023-04-17',
        submissionDate: '2023-04-17',
        nameOfShip: 'Test Ship',
        imoNumber: '1234567',
        callSign: 'NA',
        signatory: 'Bob Smith',
        flagState: 'GBR',
        departureFromUk: false,
        departurePortUnlocode: 'AU POR',
        departureDate: '2023-02-12',
        departureTime: '09:32:00',
        arrivalPortUnlocode: 'GB DOV',
        arrivalDate: '2023-02-15',
        arrivalTime: '14:00:00',
        previousPortUnlocode: 'AU POR',
        nextPortUnlocode: 'NL RTM',
        cargo: 'No cargo',
        passengers: false,
        cbpId: null,
      });

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await screen.findByRole('heading', { name: 'Are you sure you want to cancel the voyage report?' });

    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith(YOUR_VOYAGES_URL, { state: { confirmationBanner: { message: 'Report for Test ship name cancelled.' } } });
  });

  it('should redirect to message page if Cancel Yes returns a 500 response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Submitted',
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
          submissionDate: '2023-02-10',
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      })
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { status: DECLARATION_STATUS_PRECANCELLED })
      .reply(500);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await screen.findByRole('heading', { name: 'Are you sure you want to cancel the voyage report?' });
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, {
      state: {
        title: 'Something has gone wrong',
        message: undefined,
        redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=123`,
      },
    });
  });

  it('should redirect to signin page if Cancel Yes returns a 422 response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Submitted',
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
          submissionDate: '2023-02-10',
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      })
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { status: DECLARATION_STATUS_PRECANCELLED })
      .reply(422, { message: 'Not enough segments' });

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await screen.findByRole('heading', { name: 'Are you sure you want to cancel the voyage report?' });
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, {
      state: { redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=123` },
    });
  });

  it('should redirect to signin page if Cancel Yes returns a 401 token expired response', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, {
        FAL1: {
          nameOfShip: 'Test ship name',
          status: 'Submitted',
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
          submissionDate: '2023-02-10',
        },
        FAL5: [
          {
            filename: 'Crew details including supernumeraries FAL 5.xlsx',
            id: 'FAL5',
            size: '118385',
            url: 'https://fal5-report-link.com',
          },
        ],
        FAL6: [],
        supporting: [],
      })
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { status: DECLARATION_STATUS_PRECANCELLED })
      .reply(401, { msg: TOKEN_EXPIRED });

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await screen.findByRole('heading', { name: 'Are you sure you want to cancel the voyage report?' });
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, {
      state: { redirectURL: `${VOYAGE_CHECK_YOUR_ANSWERS}?${URL_DECLARATIONID_IDENTIFIER}=123` },
    });
  });
});

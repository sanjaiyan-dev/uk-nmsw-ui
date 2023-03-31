import { MemoryRouter } from 'react-router-dom';
import {
  render,
  screen,
  // waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
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
import { API_URL, ENDPOINT_DECLARATION_ATTACHMENTS_PATH, ENDPOINT_DECLARATION_PATH } from '../../../constants/AppAPIConstants';
import VoyageCheckYourAnswers from '../VoyageCheckYourAnswers';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage check your answers page', () => {
  const mockAxios = new MockAdapter(axios);
  const mockedFAL1And5Response = {
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
    },
    FAL5: 'https://fal5-report-link.com',
    FAL6: null,
  };

  const mockedAllFALResponse = {
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
    },
    FAL5: 'https://fal5-report-link.com',
    FAL6: 'https://fal6-report-link.com',
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

  it('should render an error without declarationId params', async () => {
    render(
      <MemoryRouter initialEntries={[`${VOYAGE_CHECK_YOUR_ANSWERS}`]}>
        <VoyageCheckYourAnswers />
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
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
    expect(screen.getByRole('link', { name: 'fal5-report-link.com' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">fal5-report-link.com</a>');
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByText('No supporting documents provided')).toBeInTheDocument();
  });

  it('should render link for Passenger details a file is present', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedAllFALResponse);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    expect(screen.getByRole('link', { name: 'fal5-report-link.com' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">fal5-report-link.com</a>');
    expect(screen.getByRole('link', { name: 'fal6-report-link.com' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal6-report-link.com" download="">fal6-report-link.com</a>');
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
        },
        FAL5: 'https://fal5-report-link.com',
        FAL6: null,
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('HON').outerHTML).toEqual('<dd class="govuk-summary-list__value">HON</dd>');
  });

  /*
   * This click not working with react-router-dom, ticket open to investigate and improve tests
   * for now in the tests below we're testing the a href is correct
   * and in the Cypress tests that the correct looking page loads
  */
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
    expect(screen.getByRole('link', { name: 'Change change voyage details' }).outerHTML).toEqual('<a aria-describedby="voyageDetails" href="/report-voyage/upload-general-declaration?report=123">Change<span class="govuk-visually-hidden"> change voyage details</span></a>');
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
    expect(screen.getByRole('link', { name: 'Change change Crew details' }).outerHTML).toEqual('<a aria-describedby="crewDetails" href="/report-voyage/upload-crew-details?report=123">Change<span class="govuk-visually-hidden"> change Crew details</span></a>');
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
    expect(screen.getByRole('link', { name: 'Change change Passenger details' }).outerHTML).toEqual('<a aria-describedby="passengerDetails" href="/report-voyage/passenger-details?report=123">Change<span class="govuk-visually-hidden"> change Passenger details</span></a>');
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
    expect(screen.getByRole('link', { name: 'Change change Supporting documents' }).outerHTML).toEqual('<a aria-describedby="supportingDocuments" href="/report-voyage/upload-supporting-documents?report=123">Change<span class="govuk-visually-hidden"> change Supporting documents</span></a>');
    // await user.click(screen.getByRole('link', { name: 'Change change Supporting documents' }));
    // await waitFor(() => {
    //   expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`, {
    //     preventScrollReset: undefined, relative: undefined, replace: false,
    //   }); // params on Link generated links by default
    // });
  });

  // it('should submit the report if submit is clicked', async () => {
  //   const user = userEvent.setup();
  //   renderPage();
  //   expect(screen.getByRole('button', { name: 'Save and submit' })).toBeInTheDocument();
  //   await user.click(screen.getByRole('button', { name: 'Save and submit' }));
  //   // something here
  // });
});

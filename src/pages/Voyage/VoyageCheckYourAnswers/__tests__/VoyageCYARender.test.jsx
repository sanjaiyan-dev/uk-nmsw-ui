import { MemoryRouter } from 'react-router-dom';
import {
  render,
  screen,
  // waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  MESSAGE_URL,
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_CHECK_YOUR_ANSWERS,
  YOUR_VOYAGES_URL,
} from '../../../../constants/AppUrlConstants';
import {
  API_URL,
  ENDPOINT_DECLARATION_ATTACHMENTS_PATH,
  ENDPOINT_DECLARATION_PATH,
  TOKEN_EXPIRED,
} from '../../../../constants/AppAPIConstants';
import Fal1 from '../../__tests__/fixtures/getVoyage-Fal1';
import VoyageCheckYourAnswers from '../../VoyageCheckYourAnswers';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage CYA - initial render', () => {
  const scrollIntoViewMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
  const mockAxios = new MockAdapter(axios);

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
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a class="govuk-link" href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should redirect to Sign In if GET call returns a 401 response', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: '',
        },
      })
      .reply(401, { TOKEN_EXPIRED });

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
      .reply(200, Fal1);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('heading', { name: 'Check your answers' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Voyage details' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Uploaded documents' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Now send your application' })).toBeInTheDocument();
    expect(screen.getByText('By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.')).toBeInTheDocument();
  });

  it('should render the list titles on the page', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1);
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
          flagState: 'HON', // changed field from Fal1 fixture
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
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('HON').outerHTML).toEqual('<dd class="govuk-summary-list__value">HON</dd>');
  });
});

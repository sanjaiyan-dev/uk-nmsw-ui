import { MemoryRouter } from 'react-router-dom';
import {
  render,
  screen,
  // waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { URL_DECLARATIONID_IDENTIFIER, VOYAGE_CHECK_YOUR_ANSWERS } from '../../../../constants/AppUrlConstants';
import { API_URL, ENDPOINT_DECLARATION_ATTACHMENTS_PATH, ENDPOINT_DECLARATION_PATH } from '../../../../constants/AppAPIConstants';
import Cancelled from '../../__tests__/fixtures/getVoyage-Cancelled';
import Failed from '../../__tests__/fixtures/getVoyage-Failed';
import Fal1 from '../../__tests__/fixtures/getVoyage-Fal1';
import Fal1Fal5 from '../../__tests__/fixtures/getVoyage-Fal1Fal5';
import PreCancelled from '../../__tests__/fixtures/getVoyage-PreCancelled';
import PreSubmitted from '../../__tests__/fixtures/getVoyage-PreSubmitted';
import Submitted from '../../__tests__/fixtures/getVoyage-Submitted';
import VoyageCheckYourAnswers from '../VoyageCheckYourAnswers';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage CYA - change links', () => {
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
      .reply(200, Fal1);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('link', { name: 'Change change Supporting documents' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change change Supporting documents' }).outerHTML).toEqual('<a class="govuk-link" aria-describedby="supportingDocuments" href="/report-voyage/upload-supporting-documents?report=123">Change<span class="govuk-visually-hidden"> change Supporting documents</span></a>');
    expect(screen.getByRole('link', { name: 'Change change voyage details' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change change voyage details' }).outerHTML).toEqual('<a class="govuk-link" aria-describedby="voyageDetails" href="/report-voyage/upload-general-declaration?report=123">Change<span class="govuk-visually-hidden"> change voyage details</span></a>');
    expect(screen.getByRole('link', { name: 'Change change Crew details' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change change Crew details' }).outerHTML).toEqual('<a class="govuk-link" aria-describedby="crewDetails" href="/report-voyage/upload-crew-details?report=123">Change<span class="govuk-visually-hidden"> change Crew details</span></a>');
    expect(screen.getByRole('link', { name: 'Change change Passenger details including supernumeraries' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Change change Passenger details including supernumeraries' }).outerHTML).toEqual('<a class="govuk-link" aria-describedby="passengerDetails" href="/report-voyage/passenger-details?report=123">Change<span class="govuk-visually-hidden"> change Passenger details including supernumeraries</span></a>');
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
      .reply(200, PreSubmitted);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change voyage details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Crew details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Passenger details including supernumeraries' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
  });

  it('should NOT show change links if status is Submitted', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Submitted);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change voyage details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Crew details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Passenger details including supernumeraries' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
  });

  it('should NOT show change links if status is PreCancelled', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, PreCancelled);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change voyage details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Crew details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Passenger details including supernumeraries' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
  });

  it('should NOT show change links if status is Cancelled', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Cancelled);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change voyage details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Crew details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Passenger details including supernumeraries' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
  });

  it('should NOT show change links if status is Failed', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Failed);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change voyage details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Crew details' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Passenger details including supernumeraries' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Change change Supporting documents' })).not.toBeInTheDocument();
  });

  it('should link to the General Declaration page from the change voyage details section', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('link', { name: 'Change change voyage details' })).toBeInTheDocument();
  });

  it('should link to the Crew page from the crew section', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('link', { name: 'Change change Crew details' })).toBeInTheDocument();
  });

  it('should link to the passenger page from the passenger section', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Fal5);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('link', { name: 'Change change Passenger details including supernumeraries' })).toBeInTheDocument();
  });

  it('should should link to the Supporting docs page from the supporting docs section', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Fal5);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByRole('link', { name: 'Change change Supporting documents' })).toBeInTheDocument();
  });
});

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
import Fal1 from '../../__tests__/fixtures/getVoyage-Fal1';
import Fal1Fal5 from '../../__tests__/fixtures/getVoyage-Fal1Fal5';
import Fal1Fal5Fal6 from '../../__tests__/fixtures/getVoyage-Fal1Fal5Fal6';
import Fal1Fal5Fal6Supporting from '../../__tests__/fixtures/getVoyage-Fal1Fal5Fal6Supporting';
import Fal1Fal5PassengersFalse from '../../__tests__/fixtures/getVoyage-Fal1Fal5PassengersFalse';
import Fal1Fal5PassengersFalseSupporting from '../../__tests__/fixtures/getVoyage-Fal1Fal5PassengersFalseSupporting';
import Fal1Fal5PassengersTrue from '../../__tests__/fixtures/getVoyage-Fal1Fal5PassengersTrue';
import Fal1Fal5PassengersTrueSupporting from '../../__tests__/fixtures/getVoyage-Fal1Fal5PassengersTrueSupporting';
import Fal1Fal5Supporting from '../../__tests__/fixtures/getVoyage-Fal1Fal5Supporting';
import Fal1Fal6 from '../../__tests__/fixtures/getVoyage-Fal1Fal6';
import Fal1Fal6Supporting from '../../__tests__/fixtures/getVoyage-Fal1Fal6Supporting';
import Fal1PassengersFalse from '../../__tests__/fixtures/getVoyage-Fal1PassengersFalse';
import Fal1PassengersTrue from '../../__tests__/fixtures/getVoyage-Fal1PassengersTrue';
import Fal1Supporting from '../../__tests__/fixtures/getVoyage-Fal1Supporting';
import Fal1SupportingPassengersFalse from '../../__tests__/fixtures/getVoyage-Fal1SupportingPassengersFalse';
import Fal1SupportingPassengersTrue from '../../__tests__/fixtures/getVoyage-Fal1SupportingPassengersTrue';
import VoyageCheckYourAnswers from '../../VoyageCheckYourAnswers';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage CYA - uploaded files', () => {
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

  /* declarations don't exist for view without a FAL 1 */

  // FAL 1 ONLY
  it('should render a page if FAL1 only and passengers NULL', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByText('No supporting documents provided')).toBeInTheDocument();

    // test for FAL 1 blocks
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
  });

  it('should render a page if FAL1 only and passengers FALSE', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1PassengersFalse);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByText('No supporting documents provided')).toBeInTheDocument();
    // test for FAL 1 blocks
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
  });

  it('should render a page if FAL1 only and passengers TRUE', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1PassengersTrue);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByText('No supporting documents provided')).toBeInTheDocument();

    // test for FAL 1 blocks
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
  });

  // FAL 1 and 5
  it('should render a page if FAL 1 & FAL 5 and passengers NULL', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Fal5);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries FAL 5.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">Crew details including supernumeraries FAL 5.xlsx</a>');
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByText('No supporting documents provided')).toBeInTheDocument();

    // test for FAL 1 blocks
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
  });

  it('should render a page if FAL 1 & FAL 5 and passengers FALSE', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Fal5PassengersFalse);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries FAL 5.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">Crew details including supernumeraries FAL 5.xlsx</a>');
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByText('No supporting documents provided')).toBeInTheDocument();

    // test for FAL 1 blocks
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
  });

  it('should render a page if FAL 1 & FAL 5 and passengers TRUE', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Fal5PassengersTrue);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries FAL 5.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">Crew details including supernumeraries FAL 5.xlsx</a>');
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByText('No supporting documents provided')).toBeInTheDocument();

    // test for FAL 1 blocks
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
  });

  // FAL 1 and 6 (no passenger FALSE or NULL as it is impossible to have passenger false and fal 6 exists)
  it('should render a page if FAL 1 & FAL 6 and passengers TRUE', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Fal6);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByRole('link', { name: 'Passenger details FAL 6.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal6-report-link.com" download="">Passenger details FAL 6.xlsx</a>');
    expect(screen.getByText('No supporting documents provided')).toBeInTheDocument();

    // test for FAL 1 blocks
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
  });

  // FAL 1 and supporting docs
  it('should render a page if FAL 1 & supporting docs and passengers NULL', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Supporting);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'MyFirstDocument.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://first-doc-link.com" download="">MyFirstDocument.xlsx</a>');
    expect(screen.getByRole('link', { name: 'My-second-doc.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://second-doc-link.com" download="">My-second-doc.xlsx</a>');

    // test for FAL 1 blocks
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
  });

  it('should render a page if FAL 1 & supporting docs and passengers FALSE', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1SupportingPassengersFalse);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'MyFirstDocument.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://first-doc-link.com" download="">MyFirstDocument.xlsx</a>');
    expect(screen.getByRole('link', { name: 'My-second-doc.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://second-doc-link.com" download="">My-second-doc.xlsx</a>');

    // test for FAL 1 blocks
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
  });

  it('should render a page if FAL 1 & supporting docs and passengers TRUE', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1SupportingPassengersTrue);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'MyFirstDocument.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://first-doc-link.com" download="">MyFirstDocument.xlsx</a>');
    expect(screen.getByRole('link', { name: 'My-second-doc.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://second-doc-link.com" download="">My-second-doc.xlsx</a>');

    // test for FAL 1 blocks
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
  });

  // // FAL 1, 5 and supporting
  it('should render a page if FAL 1 & FAL 5 & supporting and passengers NULL', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Fal5Supporting);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries FAL 5.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">Crew details including supernumeraries FAL 5.xlsx</a>');
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'MyFirstDocument.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://first-doc-link.com" download="">MyFirstDocument.xlsx</a>');
    expect(screen.getByRole('link', { name: 'My-second-doc.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://second-doc-link.com" download="">My-second-doc.xlsx</a>');

    // test for FAL 1 blocks
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
  });

  it('should render a page if FAL 1 & FAL 5 & supporting and passengers FALSE', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Fal5PassengersFalseSupporting);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries FAL 5.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">Crew details including supernumeraries FAL 5.xlsx</a>');
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'MyFirstDocument.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://first-doc-link.com" download="">MyFirstDocument.xlsx</a>');
    expect(screen.getByRole('link', { name: 'My-second-doc.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://second-doc-link.com" download="">My-second-doc.xlsx</a>');

    // test for FAL 1 blocks
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
  });

  it('should render a page if FAL 1 & FAL 5 & supporting and passengers TRUE', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Fal5PassengersTrueSupporting);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries FAL 5.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">Crew details including supernumeraries FAL 5.xlsx</a>');
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'MyFirstDocument.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://first-doc-link.com" download="">MyFirstDocument.xlsx</a>');
    expect(screen.getByRole('link', { name: 'My-second-doc.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://second-doc-link.com" download="">My-second-doc.xlsx</a>');

    // test for FAL 1 blocks
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
  });

  // // FAL 1, 6, and supporting docs
  it('should render a page if FAL 1 & FAL 6 & supporting and passengers TRUE', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Fal6Supporting);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries FAL 5.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">Crew details including supernumeraries FAL 5.xlsx</a>');
    expect(screen.getByText('No passenger details provided')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'MyFirstDocument.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://first-doc-link.com" download="">MyFirstDocument.xlsx</a>');
    expect(screen.getByRole('link', { name: 'My-second-doc.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://second-doc-link.com" download="">My-second-doc.xlsx</a>');

    // test for FAL 1 blocks
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
  });

  // // FAL 1, 5 and 6
  it('should render a page if FAL 1 & FAL 5 & FAL 6 and passengers TRUE', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Fal5Fal6);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries FAL 5.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">Crew details including supernumeraries FAL 5.xlsx</a>');
    expect(screen.getByRole('link', { name: 'Passenger details FAL 6.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal6-report-link.com" download="">Passenger details FAL 6.xlsx</a>');
    expect(screen.getByText('No supporting documents provided')).toBeInTheDocument();

    // test for FAL 1 blocks
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
  });

  // // FAL 1, 5, 6 and supporting docs
  it('should render a page if FAL 1 & FAL 5 & FAL 6 & supporting and passengers TRUE', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1Fal5Fal6Supporting);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    // test for files uploaded block
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries FAL 5.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal5-report-link.com" download="">Crew details including supernumeraries FAL 5.xlsx</a>');
    expect(screen.getByRole('link', { name: 'Passenger details FAL 6.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://fal6-report-link.com" download="">Passenger details FAL 6.xlsx</a>');
    expect(screen.getByRole('link', { name: 'MyFirstDocument.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://first-doc-link.com" download="">MyFirstDocument.xlsx</a>');
    expect(screen.getByRole('link', { name: 'My-second-doc.xlsx' }).outerHTML).toEqual('<a class="govuk-link" href="https://second-doc-link.com" download="">My-second-doc.xlsx</a>');

    // test for FAL 1 blocks
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
  });
});

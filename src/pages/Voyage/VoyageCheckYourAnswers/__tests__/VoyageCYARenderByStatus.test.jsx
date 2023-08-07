import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { URL_DECLARATIONID_IDENTIFIER, VOYAGE_CHECK_YOUR_ANSWERS } from '../../../../constants/AppUrlConstants';
import { API_URL, ENDPOINT_DECLARATION_ATTACHMENTS_PATH, ENDPOINT_DECLARATION_PATH } from '../../../../constants/AppAPIConstants';
import Cancelled from '../../__tests__/fixtures/getVoyage-Cancelled';
import Failed from '../../__tests__/fixtures/getVoyage-Failed';
import Fal1 from '../../__tests__/fixtures/getVoyage-Fal1';
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

describe('Voyage CYA - render by status', () => {
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

  it('should render no status line and the cta as submit and the h1 as check your answers if status is draft', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Check your answers')).toBeInTheDocument();
    expect(screen.getByText('Send the report')).toBeInTheDocument();
    expect(screen.getByText('By sending this voyage report, you are confirming that to the best of your knowledge, the details you are sending are correct.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm and send' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm and send' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Confirm and send</button>');
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
      .reply(200, Submitted);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Review your report')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Submitted').outerHTML).toEqual('<strong class="govuk-tag govuk-tag--green">Submitted</strong>');
    expect(screen.getByText('10 February 2023')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' }).outerHTML).toEqual('<button type="button" class="govuk-button govuk-button--warning" data-module="govuk-button">Cancel</button>');
    expect(screen.queryByRole('button', { name: 'Confirm and send' })).not.toBeInTheDocument();
    expect(screen.queryByText('Send the report')).not.toBeInTheDocument();
    expect(screen.queryByText('By sending this voyage report, you are confirming that to the best of your knowledge, the details you are sending are correct.')).not.toBeInTheDocument();
  });

  it('should render the status as submitted, submission date, h1 of review your report, and a cancel CTA if status is presubmitted', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, PreSubmitted);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Review your report')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Submitted').outerHTML).toEqual('<strong class="govuk-tag govuk-tag--green">Submitted</strong>');
    expect(screen.getByText('10 February 2023')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' }).outerHTML).toEqual('<button type="button" class="govuk-button govuk-button--warning" data-module="govuk-button">Cancel</button>');
    expect(screen.queryByRole('button', { name: 'Confirm and send' })).not.toBeInTheDocument();
    expect(screen.queryByText('Send the report')).not.toBeInTheDocument();
    expect(screen.queryByText('By sending this voyage report, you are confirming that to the best of your knowledge, the details you are sending are correct.')).not.toBeInTheDocument();
  });

  it('should render the status as cancelled, submission date, h1 of review your report, and a no CTA if status is canceled', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Cancelled);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Review your report')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Cancelled').outerHTML).toEqual('<strong class="govuk-tag govuk-tag--orange">Cancelled</strong>');
    expect(screen.getByText('10 February 2023')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirm and send' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByText('Send the report')).not.toBeInTheDocument();
    expect(screen.queryByText('By sending this voyage report, you are confirming that to the best of your knowledge, the details you are sending are correct.')).not.toBeInTheDocument();
  });

  it('should render the status as cancelled, submission date, h1 of review your report, and a no CTA if status is precanceled', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, PreCancelled);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Review your report')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Cancelled').outerHTML).toEqual('<strong class="govuk-tag govuk-tag--orange">Cancelled</strong>');
    expect(screen.getByText('10 February 2023')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirm and send' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByText('Send the report')).not.toBeInTheDocument();
    expect(screen.queryByText('By sending this voyage report, you are confirming that to the best of your knowledge, the details you are sending are correct.')).not.toBeInTheDocument();
  });

  it('should render the status as failed, submission date, h1 of review your report, and a no CTA if status is failed', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Failed);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Review your report')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Failed').outerHTML).toEqual('<strong class="govuk-tag govuk-tag--red">Failed</strong>');
    expect(screen.getByText('10 February 2023')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirm and send' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByText('Send the report')).not.toBeInTheDocument();
    expect(screen.queryByText('By sending this voyage report, you are confirming that to the best of your knowledge, the details you are sending are correct.')).not.toBeInTheDocument();
  });

  it('should render the status as null, no submission date, and a no CTA if status is unknown', async () => {
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
          submissionDate: null,
        },
        FAL5: [],
        FAL6: [],
        supporting: [],
      });
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirm and send' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByText('Send the report')).not.toBeInTheDocument();
    expect(screen.queryByText('By sending this voyage report, you are confirming that to the best of your knowledge, the details you are sending are correct.')).not.toBeInTheDocument();
  });
});

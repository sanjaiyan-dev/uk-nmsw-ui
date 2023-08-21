import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { DECLARATION_STATUS_PRESUBMITTED } from '../../../../constants/AppConstants';
import {
  MESSAGE_URL,
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_CHECK_YOUR_ANSWERS,
} from '../../../../constants/AppUrlConstants';
import {
  API_URL,
  ENDPOINT_DECLARATION_ATTACHMENTS_PATH,
  ENDPOINT_DECLARATION_PATH,
  TOKEN_EXPIRED,
} from '../../../../constants/AppAPIConstants';
import Fal1 from '../../__tests__/fixtures/getVoyage-Fal1';
import Fal1PassengersTrue from '../../__tests__/fixtures/getVoyage-Fal1PassengersTrue';
import Fal1Fal5Fal6Supporting from '../../__tests__/fixtures/getVoyage-Fal1Fal5Fal6Supporting';
import VoyageCheckYourAnswers from '../VoyageCheckYourAnswers';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage CYA - submit', () => {
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

  it('should show an error if there is no FAL5 and/or answer to passenger question', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1);
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
    await user.click(screen.getByRole('button', { name: 'Confirm and send' }));
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
      .reply(200, Fal1PassengersTrue);
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
    await user.click(screen.getByRole('button', { name: 'Confirm and send' }));
    expect(screen.getByRole('heading', { name: 'There is a problem' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Passenger details including supernumeraries (FAL 6) upload is required for ships carrying passengers' })).toBeInTheDocument();
  });

  it('should scroll to document area if user clicks on a required error', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Fal1PassengersTrue);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await user.click(screen.getByRole('button', { name: 'Confirm and send' }));

    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Passenger details including supernumeraries (FAL 6) upload is required for ships carrying passengers' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Passenger details including supernumeraries (FAL 6) upload is required for ships carrying passengers' }));
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
      .reply(200, Fal1Fal5Fal6Supporting)
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, { status: DECLARATION_STATUS_PRESUBMITTED }, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(500);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await screen.findByRole('heading', { name: 'Check your answers' });
    await user.click(screen.getByRole('button', { name: 'Confirm and send' }));

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
      .reply(200, Fal1Fal5Fal6Supporting)
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { status: DECLARATION_STATUS_PRESUBMITTED })
      .reply(422, { msg: 'Not enough segments' });

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await screen.findByRole('heading', { name: 'Check your answers' });
    await user.click(screen.getByRole('button', { name: 'Confirm and send' }));

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
      .reply(200, Fal1Fal5Fal6Supporting)
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { status: DECLARATION_STATUS_PRESUBMITTED })
      .reply(401, { msg: TOKEN_EXPIRED });

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await screen.findByRole('heading', { name: 'Check your answers' });
    await user.click(screen.getByRole('button', { name: 'Confirm and send' }));

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
      .reply(200, Fal1Fal5Fal6Supporting)
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { status: DECLARATION_STATUS_PRESUBMITTED })
      .reply(200, {
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
    await user.click(screen.getByRole('button', { name: 'Confirm and send' }));

    await screen.findByRole('heading', { name: 'Voyage details sent' });
    expect(screen.getByRole('heading', { name: 'Voyage details sent' }).outerHTML).toEqual('<h1 class="govuk-panel__title govuk-!-margin-bottom-6">Voyage details sent</h1>');
    expect(screen.getByRole('heading', { name: 'What happens next' })).toBeInTheDocument();
    expect(screen.getByText('We will send you an email to confirm when your voyage report has been received.')).toBeInTheDocument();
    expect(screen.getByText("You'll be able to show the email to Border Force officers as proof that you have sent us your report.")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to your voyages' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to your voyages' }).outerHTML).toEqual('<a href="/your-voyages">Return to your voyages</a>');
  });
});

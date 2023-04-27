import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { DECLARATION_STATUS_PRECANCELLED } from '../../../../constants/AppConstants';
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
import Submitted from '../../__tests__/fixtures/getVoyage-Submitted';
import VoyageCheckYourAnswers from '../../VoyageCheckYourAnswers';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage CYA - cancellations', () => {
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

  it('should show the are you sure question if cancel button clicked', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, Submitted);
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
      .reply(200, Submitted);
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
      .reply(200, Submitted)
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { status: DECLARATION_STATUS_PRECANCELLED })
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
      .reply(200, Submitted)
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
      .reply(200, Submitted)
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
      .reply(200, Submitted)
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

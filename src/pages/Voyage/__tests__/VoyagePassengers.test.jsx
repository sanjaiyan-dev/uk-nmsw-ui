import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_PASSENGERS_URL,
  VOYAGE_PASSENGER_UPLOAD_URL,
  VOYAGE_TASK_LIST_URL,
  YOUR_VOYAGES_URL,
} from '../../../constants/AppUrlConstants';
import VoyagePassengers from '../VoyagePassengers';
import { API_URL, ENDPOINT_DECLARATION_PATH, TOKEN_EXPIRED } from '../../../constants/AppAPIConstants';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

const renderPage = () => {
  render(
    <MemoryRouter initialEntries={[`${VOYAGE_PASSENGERS_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`]}>
      <VoyagePassengers />
    </MemoryRouter>,
  );
};

describe('Voyage passengers page', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page with declarationId in params', async () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Is the ship carrying any passengers?' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Yes' }).outerHTML).toEqual('<input class="govuk-radios__input" id="passengers-input[0]" name="passengers" type="radio" value="passengersYes">');
    expect(screen.getByRole('radio', { name: 'No' }).outerHTML).toEqual('<input class="govuk-radios__input" id="passengers-input[1]" name="passengers" type="radio" value="passengersNo">');
    expect(screen.getByRole('button', { name: 'Save and continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Save and continue</button>');
  });

  it('should render an error without declarationId', async () => {
    render(
      <MemoryRouter initialEntries={[`${VOYAGE_PASSENGERS_URL}`]}>
        <VoyagePassengers />
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should go to the upload passenger details page if user selects YES', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { passengers: true })
      .reply(200, {
        id: '123',
        status: 'Draft',
        creationDate: '2023-04-05',
        submissionDate: null,
        nameOfShip: 'Ship 1',
        imoNumber: '1234567',
        callSign: 'NA',
        signatory: 'John Doe',
        flagState: 'GBR',
        departureFromUk: false,
        departurePortUnlocode: 'AU XXX',
        departureDate: '2023-02-12',
        departureTime: '14:00:00',
        arrivalPortUnlocode: 'GB POR',
        arrivalDate: '2023-02-15',
        arrivalTime: '14:00:00',
        previousPortUnlocode: 'AU XXX',
        nextPortUnlocode: 'NL RTM',
        cargo: 'No cargo',
        passengers: true,
      });
    renderPage();
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_PASSENGER_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`);
  });

  it('should go to the task details page if user selects NO', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { passengers: false })
      .reply(200, {
        id: '123',
        status: 'Draft',
        creationDate: '2023-04-05',
        submissionDate: null,
        nameOfShip: 'Ship 1',
        imoNumber: '1234567',
        callSign: 'NA',
        signatory: 'John Doe',
        flagState: 'GBR',
        departureFromUk: false,
        departurePortUnlocode: 'AU XXX',
        departureDate: '2023-02-12',
        departureTime: '14:00:00',
        arrivalPortUnlocode: 'GB POR',
        arrivalDate: '2023-02-15',
        arrivalTime: '14:00:00',
        previousPortUnlocode: 'AU XXX',
        nextPortUnlocode: 'NL RTM',
        cargo: 'No cargo',
        passengers: false,
      });
    renderPage();
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`);
  });

  it('should redirect to sign in if Save and continue button click returns a 422', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { passengers: false })
      .reply(422, { msg: 'Not enough segments' });

    renderPage();
    await user.click(screen.getByRole('radio', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_PASSENGERS_URL}?${URL_DECLARATIONID_IDENTIFIER}=123` } });
  });

  it('should redirect to sign in if Save and continue button click returns a 401 token expired', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { passengers: false })
      .reply(401, { msg: TOKEN_EXPIRED });

    renderPage();
    await user.click(screen.getByRole('radio', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_PASSENGERS_URL}?${URL_DECLARATIONID_IDENTIFIER}=123` } });
    expect(sessionStorage.getItem('token')).toBe(null);
  });

  it('should redirect to sign in if Save and continue button click returns a 500', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPatch(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, { passengers: false })
      .reply(500);

    renderPage();
    await user.click(screen.getByRole('radio', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });
});

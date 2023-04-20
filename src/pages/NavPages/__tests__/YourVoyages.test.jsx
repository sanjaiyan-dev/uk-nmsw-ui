import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { CREATE_VOYAGE_ENDPOINT, TOKEN_EXPIRED } from '../../../constants/AppAPIConstants';
import {
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  YOUR_VOYAGES_PAGE_NAME,
  YOUR_VOYAGES_URL,
} from '../../../constants/AppUrlConstants';
import YourVoyages from '../YourVoyages';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Your voyages page tests', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should render the page with the Your Voyages as a H1', async () => {
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        results: [],
      });
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(await screen.findByText(YOUR_VOYAGES_PAGE_NAME)).toBeInTheDocument();
  });

  it('should display a "Report a voyage" button', async () => {
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        results: [],
      });
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(await screen.findByRole('button', { name: 'Report a voyage' })).toBeInTheDocument();
  });

  it('should show a no voyages message if no voyages', async () => {
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        results: [],
      });
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(await screen.findByRole('button', { name: 'Report a voyage' })).toBeInTheDocument();
    expect(await screen.getByText('You have not reported any voyages yet')).toBeInTheDocument();
  });

  it('should render a draft voyage if one exists', async () => {
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        results: [
          {
            id: '1',
            status: 'Draft',
            submissionDate: null,
            nameOfShip: 'Ship 1',
            imoNumber: '1234567',
            callSign: 'NA',
            signatory: 'John Smith',
            flagState: 'GBR',
            departureFromUk: false,
            departurePortUnlocode: 'AU XXX',
            departureDate: '2023-03-16',
            departureTime: '14:00:00',
            arrivalPortUnlocode: 'GB POR',
            arrivalDate: '2023-02-15',
            arrivalTime: '14:00:00',
            previousPortUnlocode: 'AU XXX',
            nextPortUnlocode: 'NL RTM',
            cargo: 'No cargo',
          },
        ],
      });

    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(await screen.findByText('All report types')).toBeInTheDocument();
    expect(await screen.findByText('Ship 1')).toBeInTheDocument();
    expect(await screen.findByText('draft')).toBeInTheDocument();
    expect(await screen.findByText('Continue')).toBeInTheDocument();
  });

  it('should render submitted and preSumbitted reports if they exist', async () => {
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        results: [
          {
            id: '2',
            status: 'Submitted',
            submissionDate: '2023-02-11',
            nameOfShip: 'Ship 2',
            imoNumber: '123',
            callSign: 'NA',
            signatory: 'John Doe',
            flagState: 'GBR',
            departureFromUk: true,
            departurePortUnlocode: 'AU XXX',
            departureDate: '2023-02-12',
            departureTime: '14:00:00',
            arrivalPortUnlocode: 'GB POR',
            arrivalDate: '2023-02-19',
            arrivalTime: '14:00:00',
            previousPortUnlocode: 'AU XXX',
            nextPortUnlocode: 'NL RTM',
            cargo: 'No cargo',
          },
          {
            id: '3',
            status: 'PreSubmitted',
            submissionDate: '2023-02-11',
            nameOfShip: 'Ship 3',
            imoNumber: '123',
            callSign: 'NA',
            signatory: 'John Doe',
            flagState: 'GBR',
            departureFromUk: true,
            departurePortUnlocode: 'AU XXX',
            departureDate: '2023-02-12',
            departureTime: '14:00:00',
            arrivalPortUnlocode: 'GB POR',
            arrivalDate: '2023-02-19',
            arrivalTime: '14:00:00',
            previousPortUnlocode: 'AU XXX',
            nextPortUnlocode: 'NL RTM',
            cargo: 'No cargo',
          },
        ],
      });
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(await screen.findByText('Ship 2')).toBeInTheDocument();
    expect(await screen.findByText('Ship 3')).toBeInTheDocument();
    expect(await screen.findAllByText('submitted')).toHaveLength(2);
    expect(await screen.findAllByText('Review or cancel')).toHaveLength(2);
  });

  it('should render cancelled and preCancelled reports if they exist', async () => {
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        results: [
          {
            id: '4',
            status: 'Cancelled',
            submissionDate: '2023-02-11',
            nameOfShip: 'Ship 4',
            imoNumber: '123',
            callSign: 'NA',
            signatory: 'John Doe',
            flagState: 'GBR',
            departureFromUk: true,
            departurePortUnlocode: 'AU XXX',
            departureDate: '2023-02-12',
            departureTime: '14:00:00',
            arrivalPortUnlocode: 'GB POR',
            arrivalDate: '2023-02-19',
            arrivalTime: '14:00:00',
            previousPortUnlocode: 'AU XXX',
            nextPortUnlocode: 'NL RTM',
            cargo: 'No cargo',
          },
          {
            id: '5',
            status: 'PreCancelled',
            submissionDate: '2023-02-11',
            nameOfShip: 'Ship 5',
            imoNumber: '123',
            callSign: 'NA',
            signatory: 'John Doe',
            flagState: 'GBR',
            departureFromUk: true,
            departurePortUnlocode: 'AU XXX',
            departureDate: '2023-02-12',
            departureTime: '14:00:00',
            arrivalPortUnlocode: 'GB POR',
            arrivalDate: '2023-02-19',
            arrivalTime: '14:00:00',
            previousPortUnlocode: 'AU XXX',
            nextPortUnlocode: 'NL RTM',
            cargo: 'No cargo',
          },
        ],
      });
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(await screen.findByText('Ship 5')).toBeInTheDocument();
    expect(await screen.findByText('Ship 5')).toBeInTheDocument();
    expect(await screen.findAllByText('cancelled')).toHaveLength(2);
    expect(await screen.findAllByText('Review')).toHaveLength(2);
  });

  it('should render failed reports if they exist', async () => {
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        results: [
          {
            id: '6',
            status: 'Failed',
            submissionDate: '2023-02-11',
            nameOfShip: 'Ship 6',
            imoNumber: '123',
            callSign: 'NA',
            signatory: 'John Doe',
            flagState: 'GBR',
            departureFromUk: true,
            departurePortUnlocode: 'AU XXX',
            departureDate: '2023-02-12',
            departureTime: '14:00:00',
            arrivalPortUnlocode: 'GB POR',
            arrivalDate: '2023-02-19',
            arrivalTime: '14:00:00',
            previousPortUnlocode: 'AU XXX',
            nextPortUnlocode: 'NL RTM',
            cargo: 'No cargo',
          },
        ],
      });
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(await screen.findByText('Ship 6')).toBeInTheDocument();
    expect(await screen.findByText('failed')).toBeInTheDocument();
    expect(await screen.findByText('Review and re-submit')).toBeInTheDocument();
  });

  it('should redirect to sign in if getting the declarations returns a 422', async () => {
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(422, { msg: 'Not enough segments' });
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: YOUR_VOYAGES_URL } });
    });
  });

  it('should redirect to sign in if getting the declarations returns a 401 token expired', async () => {
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(401, { msg: TOKEN_EXPIRED });
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: YOUR_VOYAGES_URL } });
    });
  });

  it('should continue to General Declaration page if Report a voyage button click successful', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        results: [],
      })
      .onPost(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        id: '123',
        status: 'Draft',
        submissionDate: null,
        nameOfShip: null,
        imoNumber: null,
        callSign: null,
        signatory: null,
        flagState: null,
        departureFromUk: null,
        departurePortUnlocode: null,
        departureDate: null,
        departureTime: null,
        arrivalPortUnlocode: null,
        arrivalDate: null,
        arrivalTime: null,
        previousPortUnlocode: null,
        nextPortUnlocode: null,
        cargo: null,
      });

    render(<MemoryRouter><YourVoyages /></MemoryRouter>);

    expect(await screen.findByRole('button', { name: 'Report a voyage' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Report a voyage' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`);
  });

  it('should redirect to sign in if Report a voyage button click returns a 422', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        results: [],
      })
      .onPost(CREATE_VOYAGE_ENDPOINT)
      .reply(422, { msg: 'Not enough segments' });

    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    await screen.findByRole('button', { name: 'Report a voyage' });
    await user.click(screen.getByRole('button', { name: 'Report a voyage' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: YOUR_VOYAGES_URL } });
  });

  it('should redirect to sign in if Report a voyage button click returns a 401 token expired', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        results: [],
      })
      .onPost(CREATE_VOYAGE_ENDPOINT)
      .reply(401, { msg: TOKEN_EXPIRED });

    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    await screen.findByRole('button', { name: 'Report a voyage' });
    await user.click(screen.getByRole('button', { name: 'Report a voyage' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: YOUR_VOYAGES_URL } });
    expect(sessionStorage.getItem('token')).toBe(null);
  });

  it('should show error message is 500 response received', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        results: [],
      })
      .onPost(CREATE_VOYAGE_ENDPOINT)
      .reply(500);

    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    await screen.findByRole('button', { name: 'Report a voyage' });
    await user.click(screen.getByRole('button', { name: 'Report a voyage' }));
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a class="govuk-link" href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });
});

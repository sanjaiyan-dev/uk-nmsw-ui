import { MemoryRouter } from 'react-router-dom';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import VoyageTaskList from '../VoyageTaskList';
import {
  MESSAGE_URL,
  SIGN_IN_URL,
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_DELETE_DRAFT_CHECK_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  VOYAGE_TASK_LIST_URL,
  YOUR_VOYAGES_URL,
} from '../../../constants/AppUrlConstants';
import { API_URL, ENDPOINT_DECLARATION_ATTACHMENTS_PATH, ENDPOINT_DECLARATION_PATH } from '../../../constants/AppAPIConstants';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage task list page', () => {
  const mockAxios = new MockAdapter(axios);
  const mockedResponseFal1Only = {
    FAL1: {
      nameOfShip: 'Test ship name',
      imoNumber: '1234567',
      callSign: 'NA',
      signatory: 'Captain Name',
      flagState: 'GBR',
      departureFromUk: false,
      departurePortUnlocode: 'AUXXX',
      departureDate: '2023-02-12',
      departureTime: '14:00:00',
      arrivalPortUnlocode: 'GBPOR',
      arrivalDate: '2023-02-15',
      arrivalTime: '14:00:00',
      previousPortUnlocode: 'AUXXX',
      nextPortUnlocode: 'NLRTM',
      cargo: 'No cargo',
      passengers: null,
      creationDate: '2023-02-10',
      submissionDate: '2023-02-11',
    },
    FAL5: null,
    FAL6: null,
  };

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  const renderPage = () => {
    render(
      <MemoryRouter initialEntries={[`${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`]}>
        <VoyageTaskList />
      </MemoryRouter>,
    );
  };

  it('should show the error message if no declaration ID in params', async () => {
    render(
      <MemoryRouter initialEntries={[`${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}`]}>
        <VoyageTaskList />
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
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=123` } });
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
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=123` } });
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

  it('should render the static content on the page with default statuses and styles', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedResponseFal1Only);

    renderPage();

    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByRole('heading', { name: '1. Upload documents' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2. Submit the report' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Report a voyage' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'General Declaration (FAL 1) Completed' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'General Declaration (FAL 1) Completed' }).outerHTML).toBe('<a href="/report-voyage/upload-general-declaration?report=123"><span>General Declaration (FAL 1)</span><strong class="govuk-tag app-task-list__tag">Completed</strong></a>');
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries (FAL 5) Required' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries (FAL 5) Required' }).outerHTML).toBe('<a href="/report-voyage/upload-crew-details?report=123"><span>Crew details including supernumeraries (FAL 5)</span><strong class="govuk-tag govuk-tag--pink app-task-list__tag">Required</strong></a>');
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Required' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Required' }).outerHTML).toBe('<a href="/report-voyage/passenger-details?report=123"><span>Any passenger details (FAL 6)</span><strong class="govuk-tag govuk-tag--pink app-task-list__tag">Required</strong></a>');
    expect(screen.getByRole('link', { name: 'Supporting documents Optional' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Supporting documents Optional' }).outerHTML).toBe('<a href="/report-voyage/upload-supporting-documents?report=123"><span>Supporting documents</span><strong class="govuk-tag govuk-tag--blue app-task-list__tag">Optional</strong></a>');
    expect(screen.getByText('Check answers and submit')).toBeInTheDocument();
    expect(screen.getByText('Cannot start yet')).toBeInTheDocument();
    expect(screen.getByTestId('checkYourAnswers').outerHTML).toBe('<div data-testid="checkYourAnswers"><span>Check answers and submit</span><strong class="govuk-tag govuk-tag--grey app-task-list__tag">Cannot start yet</strong></div>');
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Ship name:')).toBeInTheDocument();
    expect(screen.getByText('Voyage type:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete draft' }).outerHTML).toEqual('<button type="button" class="govuk-button govuk-button--warning" data-module="govuk-button">Delete draft</button>');
  });

  it('should render the FAL1 details received from the GET request when departureFromUk is false', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedResponseFal1Only);

    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByText('Test ship name')).toBeInTheDocument();
    expect(screen.getByText('Arrival to the UK')).toBeInTheDocument();
    await screen.findByTestId('completedSections');
    expect(screen.getByTestId('completedSections')).toHaveTextContent('0');
  });

  it('should render the FAL1 details received from the GET request when departureFromUk is true', async () => {
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
          flagState: 'GBR',
          departureFromUk: true,
          departurePortUnlocode: 'AUXXX',
          departureDate: '2023-02-12',
          departureTime: '14:00:00',
          arrivalPortUnlocode: 'GBPOR',
          arrivalDate: '2023-02-15',
          arrivalTime: '14:00:00',
          previousPortUnlocode: 'AUXXX',
          nextPortUnlocode: 'NLRTM',
          cargo: 'No cargo',
          passengers: null,
          creationDate: '2023-02-10',
          submissionDate: '2023-02-11',
        },
      });

    renderPage();
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByText('Test ship name')).toBeInTheDocument();
    expect(screen.getByText('Departure from the UK')).toBeInTheDocument();
    expect(screen.getByTestId('completedSections')).toHaveTextContent('0');
  });

  it('should show Crew Details link as complete if response received has a link for FAL5', async () => {
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
          flagState: 'GBR',
          departureFromUk: true,
          departurePortUnlocode: 'AUXXX',
          departureDate: '2023-02-12',
          departureTime: '14:00:00',
          arrivalPortUnlocode: 'GBPOR',
          arrivalDate: '2023-02-15',
          arrivalTime: '14:00:00',
          previousPortUnlocode: 'AUXXX',
          nextPortUnlocode: 'NLRTM',
          cargo: 'No cargo',
          passengers: null,
          creationDate: '2023-02-10',
          submissionDate: '2023-02-11',
        },
        FAL5: 'https://fal5-report-link.com',
        FAL6: null,
      });

    renderPage();
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries (FAL 5) Completed' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries (FAL 5) Completed' }).outerHTML).toBe('<a href="/report-voyage/upload-crew-details?report=123"><span>Crew details including supernumeraries (FAL 5)</span><strong class="govuk-tag app-task-list__tag">Completed</strong></a>');
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Required' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Required' }).outerHTML).toBe('<a href="/report-voyage/passenger-details?report=123"><span>Any passenger details (FAL 6)</span><strong class="govuk-tag govuk-tag--pink app-task-list__tag">Required</strong></a>');
    expect(screen.getByTestId('completedSections')).toHaveTextContent('0');
  });

  it('should show Passenger Details link as complete if response received has a link for FAL6 and passengers is true', async () => {
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
          flagState: 'GBR',
          departureFromUk: true,
          departurePortUnlocode: 'AUXXX',
          departureDate: '2023-02-12',
          departureTime: '14:00:00',
          arrivalPortUnlocode: 'GBPOR',
          arrivalDate: '2023-02-15',
          arrivalTime: '14:00:00',
          previousPortUnlocode: 'AUXXX',
          nextPortUnlocode: 'NLRTM',
          cargo: 'No cargo',
          passengers: true,
          creationDate: '2023-02-10',
          submissionDate: '2023-02-11',
        },
        FAL5: null,
        FAL6: 'https://fal6-report-link.com',
      });

    renderPage();
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries (FAL 5) Required' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries (FAL 5) Required' }).outerHTML).toBe('<a href="/report-voyage/upload-crew-details?report=123"><span>Crew details including supernumeraries (FAL 5)</span><strong class="govuk-tag govuk-tag--pink app-task-list__tag">Required</strong></a>');
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Completed' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Completed' }).outerHTML).toBe('<a href="/report-voyage/passenger-details?report=123"><span>Any passenger details (FAL 6)</span><strong class="govuk-tag app-task-list__tag">Completed</strong></a>');
    expect(screen.getByTestId('completedSections')).toHaveTextContent('0');
  });

  it('should show Passenger Details link as required if passengers is true but no link is present', async () => {
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
          flagState: 'GBR',
          departureFromUk: true,
          departurePortUnlocode: 'AUXXX',
          departureDate: '2023-02-12',
          departureTime: '14:00:00',
          arrivalPortUnlocode: 'GBPOR',
          arrivalDate: '2023-02-15',
          arrivalTime: '14:00:00',
          previousPortUnlocode: 'AUXXX',
          nextPortUnlocode: 'NLRTM',
          cargo: 'No cargo',
          passengers: true,
          creationDate: '2023-02-10',
          submissionDate: '2023-02-11',
        },
        FAL5: null,
        FAL6: null,
      });

    renderPage();
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Required' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Required' }).outerHTML).toBe('<a href="/report-voyage/passenger-details?report=123"><span>Any passenger details (FAL 6)</span><strong class="govuk-tag govuk-tag--pink app-task-list__tag">Required</strong></a>');
    expect(screen.getByTestId('completedSections')).toHaveTextContent('0');
  });

  it('should show Passenger Details link as complete if response received for passengers is false', async () => {
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
          flagState: 'GBR',
          departureFromUk: true,
          departurePortUnlocode: 'AUXXX',
          departureDate: '2023-02-12',
          departureTime: '14:00:00',
          arrivalPortUnlocode: 'GBPOR',
          arrivalDate: '2023-02-15',
          arrivalTime: '14:00:00',
          previousPortUnlocode: 'AUXXX',
          nextPortUnlocode: 'NLRTM',
          cargo: 'No cargo',
          passengers: false,
          creationDate: '2023-02-10',
          submissionDate: '2023-02-11',
        },
        FAL5: null,
        FAL6: null,
      });

    renderPage();
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Completed' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Completed' }).outerHTML).toBe('<a href="/report-voyage/passenger-details?report=123"><span>Any passenger details (FAL 6)</span><strong class="govuk-tag app-task-list__tag">Completed</strong></a>');
    expect(screen.getByTestId('completedSections')).toHaveTextContent('0');
  });

  it('should show completed sections as 1 and Passenger & Crew Details link as complete if response received has a link for FAL5 & FAL6', async () => {
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
          flagState: 'GBR',
          departureFromUk: true,
          departurePortUnlocode: 'AUXXX',
          departureDate: '2023-02-12',
          departureTime: '14:00:00',
          arrivalPortUnlocode: 'GBPOR',
          arrivalDate: '2023-02-15',
          arrivalTime: '14:00:00',
          previousPortUnlocode: 'AUXXX',
          nextPortUnlocode: 'NLRTM',
          cargo: 'No cargo',
          passengers: true,
          creationDate: '2023-02-10',
          submissionDate: '2023-02-11',
        },
        FAL5: 'https://fal5-report-link.com',
        FAL6: 'https://fal6-report-link.com',
      });

    renderPage();
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries (FAL 5) Completed' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries (FAL 5) Completed' }).outerHTML).toBe('<a href="/report-voyage/upload-crew-details?report=123"><span>Crew details including supernumeraries (FAL 5)</span><strong class="govuk-tag app-task-list__tag">Completed</strong></a>');
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Completed' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Completed' }).outerHTML).toBe('<a href="/report-voyage/passenger-details?report=123"><span>Any passenger details (FAL 6)</span><strong class="govuk-tag app-task-list__tag">Completed</strong></a>');
    expect(screen.getByTestId('completedSections')).toHaveTextContent('1');
  });

  /*
   * This click not working with react-router-dom, ticket open to investigate and improve tests
   * for now in the tests below we're testing the a href is correct
   * and in the Cypress tests that the correct looking page loads
  */
  it('should load the General Declaration upload page if General Declaration is clicked', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedResponseFal1Only);

    render(
      <MemoryRouter initialEntries={[`${VOYAGE_GENERAL_DECLARATION_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`]}>
        <VoyageTaskList />
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByRole('link', { name: 'General Declaration (FAL 1) Completed' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'General Declaration (FAL 1) Completed' }).outerHTML).toEqual('<a href="/report-voyage/upload-general-declaration?report=123"><span>General Declaration (FAL 1)</span><strong class="govuk-tag app-task-list__tag">Completed</strong></a>');
  });

  it('should load the Crew Details upload page if Crew is clicked', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedResponseFal1Only);

    renderPage();
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries (FAL 5) Required' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Crew details including supernumeraries (FAL 5) Required' }).outerHTML).toEqual('<a href="/report-voyage/upload-crew-details?report=123"><span>Crew details including supernumeraries (FAL 5)</span><strong class="govuk-tag govuk-tag--pink app-task-list__tag">Required</strong></a>');
  });

  it('should load the Passenger Details yes/no page if Passenger is clicked', async () => {
    // const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedResponseFal1Only);

    renderPage();
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Required' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Required' }).outerHTML).toEqual('<a href="/report-voyage/passenger-details?report=123"><span>Any passenger details (FAL 6)</span><strong class="govuk-tag govuk-tag--pink app-task-list__tag">Required</strong></a>');

    // await user.click(screen.getByRole('link', { name: 'Any passenger details (FAL 6) Required' }));
    // await waitFor(() => {
    //   expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_PASSENGERS_URL}?=${URL_DECLARATIONID_IDENTIFIER}=123`, {
    //     preventScrollReset: undefined, relative: undefined, replace: false,
    //   }); // params on Link generated links by default
    // });
  });

  it('should load the Supporting Documents page if Support Documents is clicked', async () => {
    // const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedResponseFal1Only);

    renderPage();
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByRole('link', { name: 'Supporting documents Optional' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Supporting documents Optional' }).outerHTML).toEqual('<a href="/report-voyage/upload-supporting-documents?report=123"><span>Supporting documents</span><strong class="govuk-tag govuk-tag--blue app-task-list__tag">Optional</strong></a>');

    // await user.click(screen.getByRole('link', { name: 'Supporting documents Optional' }));
    // await waitFor(() => {
    //   expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?=${URL_DECLARATIONID_IDENTIFIER}=123`, {
    //     preventScrollReset: undefined, relative: undefined, replace: false,
    //   }); // params on Link generated links by default
    // });
  });

  it('should load the Check your answers page if Check answers and submit is clicked', async () => {
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
          flagState: 'GBR',
          departureFromUk: true,
          departurePortUnlocode: 'AUXXX',
          departureDate: '2023-02-12',
          departureTime: '14:00:00',
          arrivalPortUnlocode: 'GBPOR',
          arrivalDate: '2023-02-15',
          arrivalTime: '14:00:00',
          previousPortUnlocode: 'AUXXX',
          nextPortUnlocode: 'NLRTM',
          cargo: 'No cargo',
        },
        FAL5: 'https://fal5-report-link.com',
        FAL6: 'https://fal6-report-link.com',
      });

    renderPage();
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByRole('link', { name: 'Check answers and submit Not started' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Check answers and submit Not started' }).outerHTML).toEqual('<a href="/report-voyage/check-your-answers?report=123"><span>Check answers and submit</span><strong class="govuk-tag govuk-tag--grey app-task-list__tag">Not started</strong></a>');
  });

  it('should load the delete draft page if delete draft is clicked', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedResponseFal1Only);

    renderPage();
    await screen.findByRole('heading', { name: 'Report a voyage' });
    expect(screen.getByRole('button', { name: 'Delete draft' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete draft' }).outerHTML).toEqual('<button type="button" class="govuk-button govuk-button--warning" data-module="govuk-button">Delete draft</button>');
    await user.click(screen.getByRole('button', { name: 'Delete draft' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_DELETE_DRAFT_CHECK_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`, { state: { shipName: 'Test ship name' } });
    });
  });
});

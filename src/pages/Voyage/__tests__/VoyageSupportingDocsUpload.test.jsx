import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  URL_DECLARATIONID_IDENTIFIER,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
  VOYAGE_TASK_LIST_URL,
  YOUR_VOYAGES_URL,
} from '../../../constants/AppUrlConstants';
import {
  API_URL,
  ENDPOINT_DECLARATION_ATTACHMENTS_PATH,
  ENDPOINT_DECLARATION_PATH
} from '../../../constants/AppAPIConstants';
import VoyageSupportingDocsUpload from '../VoyageSupportingDocsUpload';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

const renderPage = () => {
  render(
    <MemoryRouter initialEntries={[`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`]}>
      <VoyageSupportingDocsUpload />
    </MemoryRouter>,
  );
};

describe('Voyage supporting docs page', () => {
  const mockAxios = new MockAdapter(axios);

  const mockedFAL1Response = {
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
      passengers: false,
      creationDate: '2023-02-10',
      submissionDate: '2023-02-11',
    },
    FAL5: [],
    FAL6: [],
    supporting: [],
  };

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page with declarationId in url params', async () => {
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    expect(screen.getByRole('heading', { name: 'Upload supporting documents' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload files' }).outerHTML).toEqual('<button class="govuk-button govuk-button--secondary" type="button">Upload files</button>');
    expect(screen.getByRole('button', { name: 'Save and continue' }).outerHTML).toEqual('<button class="govuk-button govuk-button--primary" type="button">Save and continue</button>');
  });

  it('should render an error without declarationId', async () => {
    render(
      <MemoryRouter initialEntries={[`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}`]}>
        <VoyageSupportingDocsUpload />
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a class="govuk-link" href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should go to task details on save and continue click', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(200, mockedFAL1Response);
    renderPage();
    await waitForElementToBeRemoved(() => screen.queryByText('Loading'));

    expect(screen.getByRole('heading', { name: 'Upload supporting documents' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`);
  });
});

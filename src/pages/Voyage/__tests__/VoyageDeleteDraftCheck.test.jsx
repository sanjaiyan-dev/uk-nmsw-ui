import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  URL_DECLARATIONID_IDENTIFIER,
  YOUR_VOYAGES_URL,
  VOYAGE_TASK_LIST_URL,
  VOYAGE_DELETE_DRAFT_CHECK_URL,
  SIGN_IN_URL,
  MESSAGE_URL,
} from '../../../constants/AppUrlConstants';
import VoyageDeleteDraftCheck from '../VoyageDeleteDraftCheck';
import { API_URL, ENDPOINT_DECLARATION_PATH } from '../../../constants/AppAPIConstants';

let mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

const renderPage = () => {
  render(
    <MemoryRouter initialEntries={[`${VOYAGE_DELETE_DRAFT_CHECK_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`]}>
      <VoyageDeleteDraftCheck />
    </MemoryRouter>,
  );
};

describe('Voyage delete draft check are you sure page', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page with declarationId from params & ship name in state', async () => {
    mockUseLocationState = { state: { shipName: 'My ship name' } };
    renderPage();
    expect(screen.getByRole('heading', { name: 'Are you sure you want to delete the draft?' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Yes' }).outerHTML).toEqual('<input class="govuk-radios__input" id="deleteDraft-input[0]" name="deleteDraft" type="radio" value="deleteDraftYes">');
    expect(screen.getByRole('radio', { name: 'No' }).outerHTML).toEqual('<input class="govuk-radios__input" id="deleteDraft-input[1]" name="deleteDraft" type="radio" value="deleteDraftNo">');
    expect(screen.getByRole('button', { name: 'Confirm' }).outerHTML).toEqual('<button type="submit" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Confirm</button>');
  });

  it('should render an error if no declarationId in params', async () => {
    mockUseLocationState = { state: { shipName: 'My ship name' } };
    render(
      <MemoryRouter initialEntries={[`${VOYAGE_DELETE_DRAFT_CHECK_URL}`]}>
        <VoyageDeleteDraftCheck />
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a class="govuk-link" href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should go to the task details page if user selects NO', async () => {
    mockUseLocationState = { state: { shipName: 'My ship name' } };
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_TASK_LIST_URL}?${URL_DECLARATIONID_IDENTIFIER}=123`);
  });

  it('should go to the your voyages details page, with details for confirmation banner, if user selects YES & DELETE success', async () => {
    mockUseLocationState = { state: { shipName: 'My ship name' } };
    const user = userEvent.setup();
    mockAxios
      .onDelete(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(204);

    renderPage();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(YOUR_VOYAGES_URL, { state: { confirmationBanner: { message: 'Report for My ship name deleted.' } } });
  });

  it('should redirect to sign in if user selects YES but token invalid/expired (401)', async () => {
    mockUseLocationState = { state: { shipName: 'My ship name' } };
    const user = userEvent.setup();
    mockAxios
      .onDelete(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(401);

    renderPage();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_TASK_LIST_URL}?report=123` } });
  });

  it('should redirect to sign in if user selects YES but token invalid/expired (422)', async () => {
    mockUseLocationState = { state: { shipName: 'My ship name' } };
    const user = userEvent.setup();
    mockAxios
      .onDelete(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(422);

    renderPage();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: `${VOYAGE_TASK_LIST_URL}?report=123` } });
  });

  it('should redirect to message page on any other error', async () => {
    mockUseLocationState = { state: { shipName: 'My ship name' } };
    const user = userEvent.setup();
    mockAxios
      .onDelete(`${API_URL}${ENDPOINT_DECLARATION_PATH}/123`, {
        headers: {
          Authorization: 'Bearer 123',
        },
      })
      .reply(500);

    renderPage();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(MESSAGE_URL, { state: { title: 'Something has gone wrong', message: undefined, redirectURL: `${VOYAGE_TASK_LIST_URL}?report=123` } });
  });
});

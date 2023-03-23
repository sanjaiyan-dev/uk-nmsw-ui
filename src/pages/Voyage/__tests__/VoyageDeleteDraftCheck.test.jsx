import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { YOUR_VOYAGES_URL, VOYAGE_TASK_LIST_URL, VOYAGE_DELETE_DRAFT_CHECK_URL } from '../../../constants/AppUrlConstants';
import VoyageDeleteDraftCheck from '../VoyageDeleteDraftCheck';

let mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

const renderPage = () => {
  render(
    <MemoryRouter initialEntries={[`${VOYAGE_DELETE_DRAFT_CHECK_URL}/123`]}>
      <Routes>
        <Route path={`${VOYAGE_DELETE_DRAFT_CHECK_URL}/:declarationId`} element={<VoyageDeleteDraftCheck />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('Voyage delete draft check are you sure page', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page with declarationId from params & ship name in state', async () => {
    mockUseLocationState = { state: { shipName: 'My ship name' } };
    renderPage();
    expect(screen.getByRole('heading', { name: 'Are you sure you want to delete the draft?' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Yes' }).outerHTML).toEqual('<input class="govuk-radios__input" id="deleteDraft-input[0]" name="deleteDraft" type="radio" value="deleteDraftYes">');
    expect(screen.getByRole('radio', { name: 'No' }).outerHTML).toEqual('<input class="govuk-radios__input" id="deleteDraft-input[1]" name="deleteDraft" type="radio" value="deleteDraftNo">');
    expect(screen.getByRole('button', { name: 'Confirm' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Confirm</button>');
  });

  it('should render an error if no state', async () => {
    mockUseLocationState.state = {};
    renderPage();
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should render an error if no declarationId in params', async () => {
    mockUseLocationState = { state: { shipName: 'My ship name' } };
    render(
      <MemoryRouter initialEntries={[`${VOYAGE_DELETE_DRAFT_CHECK_URL}`]}>
        <Routes>
          <Route path={`${VOYAGE_DELETE_DRAFT_CHECK_URL}`} element={<VoyageDeleteDraftCheck />} />
        </Routes>
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should go to the your voyages details page, with details for confirmation banner, if user selects YES', async () => {
    mockUseLocationState = { state: { shipName: 'My ship name' } };
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(YOUR_VOYAGES_URL, { state: { confirmationBanner: { message: 'Report for My ship name deleted.' } } });
  });

  it('should go to the task details page if user selects NO', async () => {
    mockUseLocationState = { state: { shipName: 'My ship name' } };
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_TASK_LIST_URL}/123`);
  });
});

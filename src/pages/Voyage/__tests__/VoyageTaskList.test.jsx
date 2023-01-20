import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoyageTaskList from '../VoyageTaskList';
import {
  VOYAGE_CHECK_YOUR_ANSWERS,
  VOYAGE_CREW_UPLOAD_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  VOYAGE_PASSENGERS_URL,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
} from '../../../constants/AppUrlConstants';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Voyage task list page', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the static content on the page', () => {
    render(<MemoryRouter><VoyageTaskList /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Report a voyage' })).toBeInTheDocument();
    expect(screen.getByText('Ship name:')).toBeInTheDocument();
    expect(screen.getByText('Voyage type:')).toBeInTheDocument();
    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByText('Upload documents')).toBeInTheDocument();
    expect(screen.getByText('2.')).toBeInTheDocument();
    expect(screen.getByText('Submit the report')).toBeInTheDocument();
    expect(screen.getByText('General Declaration (FAL 1)')).toBeInTheDocument();
    expect(screen.getByText('Crew details including supernumeraries (FAL 5)')).toBeInTheDocument();
    expect(screen.getByText('Any passenger details (FAL 6)')).toBeInTheDocument();
    expect(screen.getByText('Supporting documents')).toBeInTheDocument();
    expect(screen.getByText('Check answers and submit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete draft' }).outerHTML).toEqual('<button type="button" class="govuk-button govuk-button--warning" data-module="govuk-button">Delete draft</button>');
  });

  it('should load the General Declaration upload page if General Declaration is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><VoyageTaskList /></MemoryRouter>);
    expect(screen.getByText('General Declaration (FAL 1)')).toBeInTheDocument();
    await user.click(screen.getByText('General Declaration (FAL 1)'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_GENERAL_DECLARATION_UPLOAD_URL, {
        preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
      }); // params on Link generated links by default
    });
  });

  it('should load the Crew Details upload page if Crew is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><VoyageTaskList /></MemoryRouter>);
    expect(screen.getByText('Crew details including supernumeraries (FAL 5)')).toBeInTheDocument();
    await user.click(screen.getByText('Crew details including supernumeraries (FAL 5)'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_CREW_UPLOAD_URL, {
        preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
      }); // params on Link generated links by default
    });
  });

  it('should load the Passenger Details yes/no page if Passenger is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><VoyageTaskList /></MemoryRouter>);
    expect(screen.getByText('Any passenger details (FAL 6)')).toBeInTheDocument();
    await user.click(screen.getByText('Any passenger details (FAL 6)'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_PASSENGERS_URL, {
        preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
      }); // params on Link generated links by default
    });
  });

  it('should load the Supporting Documents page if Support Documents is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><VoyageTaskList /></MemoryRouter>);
    expect(screen.getByText('Supporting documents')).toBeInTheDocument();
    await user.click(screen.getByText('Supporting documents'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_SUPPORTING_DOCS_UPLOAD_URL, {
        preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
      }); // params on Link generated links by default
    });
  });

  it('should load the Check your answers page if Check answers and submit is clicked', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><VoyageTaskList /></MemoryRouter>);
    expect(screen.getByText('Check answers and submit')).toBeInTheDocument();
    await user.click(screen.getByText('Check answers and submit'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_CHECK_YOUR_ANSWERS, {
        preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
      }); // params on Link generated links by default
    });
  });
});

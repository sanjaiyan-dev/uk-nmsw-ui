import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  VOYAGE_CREW_UPLOAD_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  VOYAGE_PASSENGERS_URL,
  VOYAGE_SUPPORTING_DOCS_UPLOAD_URL,
  YOUR_VOYAGES_URL,
} from '../../../constants/AppUrlConstants';
import VoyageCheckYourAnswers from '../VoyageCheckYourAnswers';

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

  it('should render an error without state', async () => {
    mockUseLocationState.state = {};
    render(<MemoryRouter><VoyageCheckYourAnswers /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should render the headings the page', () => {
    mockUseLocationState.state = { declarationId: '123' };
    render(<MemoryRouter><VoyageCheckYourAnswers /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Check your answers' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Voyage details' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Uploaded documents' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Now send your application' })).toBeInTheDocument();
    expect(screen.getByText('By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.')).toBeInTheDocument();
  });

  it('should render the submit button on the page', () => {
    mockUseLocationState.state = { declarationId: '123' };
    render(<MemoryRouter><VoyageCheckYourAnswers /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Save and submit' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button">Save and submit</button>');
  });

  it('should render the list titles on the page', () => {
    mockUseLocationState.state = { declarationId: '123' };
    render(<MemoryRouter><VoyageCheckYourAnswers /></MemoryRouter>);
    expect(screen.getByText('Voyage type').outerHTML).toEqual('<dt class="govuk-summary-list__key">Voyage type</dt>');
    expect(screen.getByText('Ship name').outerHTML).toEqual('<dt class="govuk-summary-list__key">Ship name</dt>');
    expect(screen.getByText('IMO number').outerHTML).toEqual('<dt class="govuk-summary-list__key">IMO number</dt>');
    expect(screen.getByText('Call sign').outerHTML).toEqual('<dt class="govuk-summary-list__key">Call sign</dt>');
    expect(screen.getByText('Flag state of ship').outerHTML).toEqual('<dt class="govuk-summary-list__key">Flag state of ship</dt>');
    expect(screen.getByText('Departure details').outerHTML).toEqual('<dt class="govuk-summary-list__key">Departure details</dt>');
    expect(screen.getByText('Next port of call').outerHTML).toEqual('<dt class="govuk-summary-list__key">Next port of call</dt>');
    expect(screen.getByText('Brief description of the cargo').outerHTML).toEqual('<dt class="govuk-summary-list__key">Brief description of the cargo</dt>');
    expect(screen.getByText('Crew details').outerHTML).toEqual('<dt id="crewDetails" class="govuk-summary-list__key">Crew details</dt>');
    expect(screen.getByText('Passenger details').outerHTML).toEqual('<dt id="passengerDetails" class="govuk-summary-list__key">Passenger details</dt>');
    expect(screen.getByText('Supporting documents').outerHTML).toEqual('<dt id="supportingDocuments" class="govuk-summary-list__key">Supporting documents</dt>');
  });

  it('should load the General Declarations upload page if Change next to Voyage Details is clicked', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = { declarationId: '123' };
    render(<MemoryRouter><VoyageCheckYourAnswers /></MemoryRouter>);
    expect(screen.getByTestId('changeGeneralDeclarationLink')).toBeInTheDocument();
    await user.click(screen.getByTestId('changeGeneralDeclarationLink'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_GENERAL_DECLARATION_UPLOAD_URL, {
        preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
      }); // params on Link generated links by default
    });
  });

  it('should load the Crew upload page if Change next to Crew is clicked', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = { declarationId: '123' };
    render(<MemoryRouter><VoyageCheckYourAnswers /></MemoryRouter>);
    expect(screen.getByTestId('changecrewDetails')).toBeInTheDocument();
    await user.click(screen.getByTestId('changecrewDetails'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_CREW_UPLOAD_URL, {
        preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
      }); // params on Link generated links by default
    });
  });

  it('should load the Passenger check page if Change next to Passenger is clicked', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = { declarationId: '123' };
    render(<MemoryRouter><VoyageCheckYourAnswers /></MemoryRouter>);
    expect(screen.getByTestId('changepassengerDetails')).toBeInTheDocument();
    await user.click(screen.getByTestId('changepassengerDetails'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_PASSENGERS_URL, {
        preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
      }); // params on Link generated links by default
    });
  });

  it('should load the Supporting docs check page if Change next to Supporting documents is clicked', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = { declarationId: '123' };
    render(<MemoryRouter><VoyageCheckYourAnswers /></MemoryRouter>);
    expect(screen.getByTestId('changesupportingDocuments')).toBeInTheDocument();
    await user.click(screen.getByTestId('changesupportingDocuments'));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_SUPPORTING_DOCS_UPLOAD_URL, {
        preventScrollReset: undefined, relative: undefined, replace: false, state: undefined,
      }); // params on Link generated links by default
    });
  });

  // it('should submit the report if submit is clicked', async () => {
  //   const user = userEvent.setup();
  //   render(<MemoryRouter><VoyageCheckYourAnswers /></MemoryRouter>);
  //   expect(screen.getByRole('button', { name: 'Save and submit' })).toBeInTheDocument();
  //   await user.click(screen.getByRole('button', { name: 'Save and submit' }));
  //   // something here
  // });
});

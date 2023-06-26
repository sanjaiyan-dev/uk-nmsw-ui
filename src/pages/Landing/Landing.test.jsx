import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SERVICE_NAME } from '../../constants/AppConstants';
import { DownloadFile } from '../../utils/DownloadFile';
import Landing from './Landing';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

let mockedUserIsPermitted = false;
jest.mock('../../hooks/useUserIsPermitted', () => jest.fn(() => (mockedUserIsPermitted)));

jest.mock('../../utils/DownloadFile', () => ({
  DownloadFile: jest.fn(),
}));

describe('Landing page tests', () => {
  it('should render the page with the service name as a H1', async () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByText('National Maritime Single Window')).toBeInTheDocument();
  });

  it('should render the service name text from the constants file', async () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByText(SERVICE_NAME)).toBeInTheDocument();
  });

  it('should tell the user what the service is used for', async () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByText('Use this service to tell Border Force about your crew and passengers, each time your vessel will depart from or arrive in the UK.')).toBeInTheDocument();
  });

  it('should display the FAL templates', async () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    expect(screen.getByText('General Declaration (FAL 1) template (xlsx, 31kb)')).toBeInTheDocument();
    expect(screen.getByText('Crew details including supernumeraries (FAL 5) template (xlsx, 118kb)')).toBeInTheDocument();
    expect(screen.getByText('Passenger details (FAL 6) template (xlsx, 90kb)')).toBeInTheDocument();
  });

  it('should download General declaration (FAL1) on click', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Landing /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: 'General Declaration (FAL 1) template (xlsx, 31kb)' }));
    expect(DownloadFile).toHaveBeenCalled();
    expect(DownloadFile).toHaveBeenCalledWith('assets/files/General declaration FAL 1.xlsx', 'General declaration FAL 1.xlsx');
  });

  it('should download Crew details (FAL5) on click', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Landing /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: 'Crew details including supernumeraries (FAL 5) template (xlsx, 118kb)' }));
    expect(DownloadFile).toHaveBeenCalled();
    expect(DownloadFile).toHaveBeenCalledWith('assets/files/Crew details including supernumeraries FAL 5.xlsx', 'Crew details including supernumeraries FAL 5.xlsx');
  });

  it('should download Passenger details (FAL 6) on click', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Landing /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: 'Passenger details (FAL 6) template (xlsx, 90kb)' }));
    expect(DownloadFile).toHaveBeenCalled();
    expect(DownloadFile).toHaveBeenCalledWith('assets/files/Passenger details FAL 6.xlsx', 'Passenger details FAL 6.xlsx');
  });

  // We will not show the link during closed beta testing
  // it('should include a link to create an account', async () => {
  //   render(<MemoryRouter><Landing /></MemoryRouter>);
  //   // eslint-disable-next-line max-len
  //   expect(screen.getByTestId('createAccountParagraph').outerHTML).toEqual('<p class="govuk-body" data-testid="createAccountParagraph">You\'ll also need to sign in or <a href="/create-account/email-address">create an account</a> to use this service</p>');
  // });

  it('should should have a start now button that includes the > and links to the sign-in page', async () => {
    render(<MemoryRouter><Landing /></MemoryRouter>);
    const checkStartNowButton = screen.getByRole('button', { name: 'Start now' });
    expect(checkStartNowButton).toBeInTheDocument();
    // eslint-disable-next-line max-len
    expect(checkStartNowButton.outerHTML).toEqual('<a role="button" draggable="false" class="govuk-button govuk-button--start" data-module="govuk-button" href="/sign-in">Start now<svg class="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false"><path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z"></path></svg></a>');
  });

  it('should have a start now button that links to /your-voyages page if user IS signed in', async () => {
    mockedUserIsPermitted = true;
    render(<MemoryRouter><Landing /></MemoryRouter>);
    const checkStartNowButton = screen.getByRole('button', { name: 'Start now' });
    // eslint-disable-next-line max-len
    expect(checkStartNowButton.outerHTML).toEqual('<a role="button" draggable="false" class="govuk-button govuk-button--start" data-module="govuk-button" href="/your-voyages">Start now<svg class="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false"><path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z"></path></svg></a>');
  });
});

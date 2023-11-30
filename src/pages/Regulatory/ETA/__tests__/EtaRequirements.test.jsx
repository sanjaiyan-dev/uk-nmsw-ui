import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import EtaRequirements from '../EtaRequirements';
import { ETA_GUIDANCE_ON_GOVUK_URL, EXAMINING_IDENTITY_DOCS_URL, NATIONALITIES_REQ_CLEARANCE_URL, VISAS_AND_IMMIGRATION_URL, YOUR_VOYAGES_URL } from '../../../../constants/AppUrlConstants';
import { UPT_CONTACT_EMAIL } from '../../../../constants/AppConstants';

const findCookie = (cookieName) => {
  const cookieArray = document.cookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    const cookiePair = cookieArray[i].split('=');
    if (cookieName === cookiePair[0].trim()) {
      if (cookiePair[1] === 'true') {
        return true;
      }
      return false;
    }
  }
  return null;
};

let mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
  useNavigate: () => mockedUseNavigate,
}));

describe('ETA requirements content tests', () => {
  beforeEach(() => {
    mockUseLocationState = {};
    document.cookie = 'etaCookie=; Max-Age=0;';
  });

  it('should render the heading and intro', () => {
    render(<MemoryRouter><EtaRequirements /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'New: Permission to travel status' })).toBeInTheDocument();
    expect(screen.getByText('We are introducing permission to travel status to the National Maritime Single Window service.')).toBeInTheDocument();
    expect(screen.getByText('When reporting an arrival, we will use the passenger details to check if they have valid permission to travel. We will show you a status for each passenger. The statuses will confirm if a passenger has valid permission to travel or if you must verify their visa.')).toBeInTheDocument();
  });

  it('should render the statuses section', () => {
    render(<MemoryRouter><EtaRequirements /></MemoryRouter>);
    expect(screen.getByText('Valid permission to travel')).toBeInTheDocument();
    expect(screen.getAllByText('Passengers with this result can board.')).toHaveLength(2); // valid and auth sections
    expect(screen.getAllByText('You must still check if these passengers have a valid passport or travel document that is acceptable in the UK.')).toHaveLength(2); // valid and auth sections
    expect(screen.getByText('Authority to carry granted')).toBeInTheDocument();
    expect(screen.getByText('For passengers from countries who need a visa to enter the UK, you must check their visa or exemption documents.')).toBeInTheDocument();
    expect(screen.getByText('Do not board')).toBeInTheDocument();
    expect(screen.getByText('Passengers with this result must not board.')).toBeInTheDocument();
    expect(screen.getByText('We will contact you by phone and email with further instructions.')).toBeInTheDocument();
    expect(screen.getByText('No further action needed.')).toBeInTheDocument();
  });

  it('should render the link section', () => {
    render(<MemoryRouter><EtaRequirements /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Help and information' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'examining identity documents guidance on GOV.UK (opens in new tab)' })).toHaveAttribute('href', EXAMINING_IDENTITY_DOCS_URL);
    expect(screen.getByRole('link', { name: 'nationalities requiring entry clearance on GOV.UK (opens in new tab)' })).toHaveAttribute('href', NATIONALITIES_REQ_CLEARANCE_URL);
    expect(screen.getByRole('link', { name: 'ETA guidance on GOV.UK (opens in new tab)' })).toHaveAttribute('href', ETA_GUIDANCE_ON_GOVUK_URL);
    expect(screen.getByRole('link', { name: 'Visas and immigration (opens in new tab)' })).toHaveAttribute('href', VISAS_AND_IMMIGRATION_URL);

    const emailText = `If you need more help, email ${UPT_CONTACT_EMAIL}`;
    expect(screen.getByText(emailText)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('should set a cookie on continue click', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><EtaRequirements /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(findCookie('etaCookie')).toEqual(true);
  });

  it('should redirect to redirectURL on continue click if one is in state, and pass the state through', async () => {
    const user = userEvent.setup();
    mockUseLocationState.state = {
      redirectURL: '/thisurl',
      otherState: 'another piece of state',
    };
    render(<MemoryRouter><EtaRequirements /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith('/thisurl', { state: { redirectURL: '/thisurl', otherState: 'another piece of state' } });
  });

  it('should redirect to dashboard on continue click', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><EtaRequirements /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(mockedUseNavigate).toHaveBeenCalledWith(YOUR_VOYAGES_URL);
  });

  it('should render not main heading, statuses section or contunue button if the condensedInfo prop is passed in', () => {
    render(<MemoryRouter><EtaRequirements condensedInfo /></MemoryRouter>);
    expect(screen.queryByRole('heading', { name: 'New: Electronic Travel Authorisation (ETA) requirement' })).not.toBeInTheDocument();
    expect(screen.queryByText('Valid permission to travel')).not.toBeInTheDocument();
    expect(screen.queryByText('Check documents')).not.toBeInTheDocument();
    expect(screen.queryByText('Do not board')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterEmailCheck from '../RegisterEmailCheck';

let mockUseLocationState = {};
const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Register email check your email tests', () => {
  beforeEach(() => {
    mockUseLocationState = {};
  });

  it('should render page with content', () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><RegisterEmailCheck /></MemoryRouter>);
    expect(screen.getByText('Check your email')).toBeInTheDocument();
    expect(screen.getByText('We have sent an email to')).toBeInTheDocument();
  });

  it('should show the email address from state in the page', () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><RegisterEmailCheck /></MemoryRouter>);
    expect(screen.getByText('testemail@email.com')).toBeInTheDocument();
  });

  it('should include a link to resend your verificaiton email', () => {
    render(<MemoryRouter><RegisterEmailCheck /></MemoryRouter>);
    expect(screen.getByText('Not received an email?').outerHTML).toEqual('<a class="govuk-body govuk-link" href="/create-account/request-new-verification-link">Not received an email?</a>');
  });
});

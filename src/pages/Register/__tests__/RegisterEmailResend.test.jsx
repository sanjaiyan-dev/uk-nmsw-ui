import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterEmailResend from '../RegisterEmailResend';

let mockUseLocationState = {};
const mockedUseNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('Resend registration email verification email', () => {
  beforeEach(() => {
    mockUseLocationState = {};
  });

  it('should render page with content', () => {
    mockUseLocationState = { state: { dataToSubmit: { emailAddress: 'testemail@email.com' } } };
    render(<MemoryRouter><RegisterEmailResend /></MemoryRouter>);
    expect(screen.getByText('Request a new verification link')).toBeInTheDocument();
    expect(screen.getByText('Emails sometimes take a few minutes to arrive. If you didn\'t receive the link, you can request a new one.')).toBeInTheDocument();
    expect(screen.getByTestId('details-component').outerHTML).toEqual('<details class="govuk-details" data-module="govuk-details" data-testid="details-component"><summary class="govuk-details__summary"><span class="govuk-details__summary-text">Change where the email was sent</span></summary><div class="govuk-details__text"><label class="govuk-label" for="emailAddress-input">Email address</label><div id="emailAddress-hint" class="govuk-hint"></div><p id="emailAddress-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> </p><input class="govuk-input" id="emailAddress-input" name="emailAddress" type="email" autocomplete="email" value=""></div></details>');
    expect(screen.getByRole('button', { name: 'Send confirmation email' })).toBeInTheDocument('');
  });
});

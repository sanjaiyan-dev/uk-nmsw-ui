import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { REGISTER_CHECK_TOKEN_ENDPOINT } from '../../../constants/AppAPIConstants';
// import { REGISTER_DETAILS_URL } from '../../../constants/AppUrlConstants';
import RegisterEmailVerified from '../RegisterEmailVerified';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Verify email address tests', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should render the page', () => {
    render(<MemoryRouter><RegisterEmailVerified /></MemoryRouter>);
    expect(screen.getByText('Your email address has been verified')).toBeInTheDocument();
  });

  it('should load the email verified successfully message if token is valid', async () => {
    mockAxios
      .onGet(REGISTER_CHECK_TOKEN_ENDPOINT)
      .reply(204, {
        email: 'testemail@email.com'
      });

    render(<MemoryRouter><RegisterEmailVerified /></MemoryRouter>);
    expect(screen.getByRole('heading', {name: 'Your email address has been verified'})).toBeInTheDocument();
    expect(screen.getByText('You can continue creating your account')).toBeInTheDocument();
  });

  // it('should link user to your details page if token is valid', async () => {
  //   const user = userEvent.setup();
  //   // mockAxios
  //   //   .onGet(CHECK_VERIFY_TOKEN_ENDPOINT)
  //   //   .reply(200, {
  //   //     email: 'testemail@email.com'
  //   //   });

  //   render(<MemoryRouter><RegisterEmailVerified /></MemoryRouter>);
  //   const nextButton = screen.getByRole('button', { name: 'Continue' });
  //   expect(nextButton).toBeInTheDocument();
  //   expect(nextButton.outerHTML).toEqual('<button class="govuk-button" data-module="govuk-button" type="button">Continue</button>');
  //   await user.click(nextButton);
  //   await waitFor(() => {
  //     expect(mockedUseNavigate).toHaveBeenCalledWith(REGISTER_DETAILS_URL, { 'state': { 'dataToSubmit': { 'emailAddress': 'testemail@email.com' } } });
  //   });
  // });
});

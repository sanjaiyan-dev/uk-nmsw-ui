import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { CREATE_VOYAGE_ENDPOINT } from '../../../constants/AppAPIConstants';
import {
  SIGN_IN_URL,
  VOYAGE_GENERAL_DECLARATION_UPLOAD_URL,
  YOUR_VOYAGES_PAGE_NAME,
  YOUR_VOYAGES_URL,
} from '../../../constants/AppUrlConstants';
import YourVoyages from '../YourVoyages';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Your voyages page tests', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should render the page with the Your Voyages as a H1', () => {
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(screen.getByText(YOUR_VOYAGES_PAGE_NAME)).toBeInTheDocument();
  });

  it('should display a "Report a voyage" button', () => {
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Report a voyage' })).toBeInTheDocument();
  });

  // add when we mock the GET api and return 0 results
  // it('should show a no voyages message if no voyages', () => {
  //   render(<MemoryRouter><YourVoyages /></MemoryRouter>);
  //   expect(screen.getByRole('button', { name: 'Report a voyage' })).toBeInTheDocument();
  // });

  it('should render voyages if voyages exist', () => {
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(screen.getByText('Select report type')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Drafts' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Submitted' })).toBeInTheDocument();
    expect(screen.getByText('All report types')).toBeInTheDocument();
  });

  it('should continue to General Declaration page if Report a voyage button click successful', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(CREATE_VOYAGE_ENDPOINT)
      .reply(200, {
        id: '123',
        status: {
          name: 'Draft',
        },
      });

    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'Report a voyage' })).toBeInTheDocument();
    user.click(screen.getByRole('button', { name: 'Report a voyage' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_GENERAL_DECLARATION_UPLOAD_URL, { state: { declarationId: '123' } });
    });
  });

  it('should redirect to sign in if Report a voyage button click returns a 422', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(CREATE_VOYAGE_ENDPOINT)
      .reply(422, { msg: 'Not enough segments' });

    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    await screen.findByRole('button', { name: 'Report a voyage' });
    user.click(screen.getByRole('button', { name: 'Report a voyage' }));
    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith(SIGN_IN_URL, { state: { redirectURL: YOUR_VOYAGES_URL } });
    });
  });

  it('should show error message is 500 response received', async () => {
    const user = userEvent.setup();
    mockAxios
      .onPost(CREATE_VOYAGE_ENDPOINT)
      .reply(500);

    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    await screen.findByRole('button', { name: 'Report a voyage' });
    user.click(screen.getByRole('button', { name: 'Report a voyage' }));
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  // TODO: rewrite tests when BE endpoint is ready as the mocked voyage data will always be availiable
});

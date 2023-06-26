import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ELLIPSIS, PAGINATION_NEXT_LABEL, PAGINATION_PREVIOUS_LABEL } from '../../../constants/AppConstants';
import { CREATE_VOYAGE_ENDPOINT } from '../../../constants/AppAPIConstants';
import { YOUR_VOYAGES_PAGE_NAME } from '../../../constants/AppUrlConstants';
import YourVoyages from '../../../pages/NavPages/YourVoyages/YourVoyages';

// Using YourVoyages to test the pagination rendering after a click as this
// is the only parent page using pagination

describe('Pagination clicks', () => {
  const mockedResponse = {
    results: [
      {
        id: 'e759592a-0126-4c3c-8515-cfe6c93f659c',
        status: 'Draft',
        creationDate: '2023-05-05T08:44:14.776324',
        submissionDate: null,
        nameOfShip: 'NMSW Test Ship',
        imoNumber: '9999990',
        callSign: 'C1234',
        signatory: 'Auto Tester',
        flagState: 'CAN',
        departureFromUk: false,
        departurePortUnlocode: 'USXXX',
        departureDate: '2023-02-12',
        departureTime: '13:00:00',
        arrivalPortUnlocode: 'GBXXX',
        arrivalDate: '2023-02-15',
        arrivalTime: '12:00:00',
        previousPortUnlocode: 'USXXX',
        nextPortUnlocode: 'JPNXX',
        cargo: 'No cargo',
        passengers: true,
        cbpId: null,
        cbpResponse: null,
        userId: '82a35d7f-9533-468f-aed8-34af107dde20',
      },
    ],
    pagination: {
      count: 639,
      page: 1,
      per_page: 100,
      pages: 7,
    },
  };

  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    mockAxios.reset();
    window.sessionStorage.clear();
  });

  it('should render the pagination section of the page', async () => {
    mockAxios
      .onGet(`${CREATE_VOYAGE_ENDPOINT}?page=1`)
      .reply(200, mockedResponse);
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(await screen.findByText(YOUR_VOYAGES_PAGE_NAME)).toBeInTheDocument();
    await screen.findByRole('button', { name: '1' });
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  });

  it('should go to the next page on next click', async () => {
    const user = userEvent.setup();
    mockAxios
      .onGet(`${CREATE_VOYAGE_ENDPOINT}?page=1`)
      .reply(200, mockedResponse);
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(await screen.findByText(YOUR_VOYAGES_PAGE_NAME)).toBeInTheDocument();
    await screen.findByRole('button', { name: '1' });
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: PAGINATION_NEXT_LABEL }));
    await screen.findByRole('button', { name: '3' });
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('1');
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('2');
    expect(screen.getAllByRole('listitem')[2]).toHaveTextContent('3');
  });

  it('should go to the page clicked', async () => {
    window.sessionStorage.setItem('Page', 5);
    const user = userEvent.setup();
    mockAxios
      .onGet(`${CREATE_VOYAGE_ENDPOINT}?page=5`)
      .reply(200, mockedResponse);
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(await screen.findByText(YOUR_VOYAGES_PAGE_NAME)).toBeInTheDocument();
    await screen.findByRole('button', { name: '1' });
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '4' }));
    await screen.findByRole('button', { name: '3' });
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('1');
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent(ELLIPSIS);
    expect(screen.getAllByRole('listitem')[2]).toHaveTextContent('3');
    expect(screen.getAllByRole('listitem')[3]).toHaveTextContent('4');
    expect(screen.getAllByRole('listitem')[3].outerHTML).toEqual('<li class="govuk-pagination__item govuk-pagination__item--current"><button type="button" class="govuk-link govuk-button--text govuk-pagination__link">4</button></li>');
    expect(screen.getAllByRole('listitem')[4]).toHaveTextContent('5');
    expect(screen.getAllByRole('listitem')[5]).toHaveTextContent(ELLIPSIS);
    expect(screen.getAllByRole('listitem')[6]).toHaveTextContent('7');
  });

  it('should go to previous page when previous clicked', async () => {
    window.sessionStorage.setItem('Page', 7);
    const user = userEvent.setup();
    mockAxios
      .onGet(`${CREATE_VOYAGE_ENDPOINT}?page=7`)
      .reply(200, mockedResponse);
    render(<MemoryRouter><YourVoyages /></MemoryRouter>);
    expect(await screen.findByText(YOUR_VOYAGES_PAGE_NAME)).toBeInTheDocument();
    await screen.findByRole('button', { name: '1' });
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: PAGINATION_PREVIOUS_LABEL }));
    await screen.findByRole('button', { name: '5' });
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('1');
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent(ELLIPSIS);
    expect(screen.getAllByRole('listitem')[2]).toHaveTextContent('5');
    expect(screen.getAllByRole('listitem')[3]).toHaveTextContent('6');
    expect(screen.getAllByRole('listitem')[3].outerHTML).toEqual('<li class="govuk-pagination__item govuk-pagination__item--current"><button type="button" class="govuk-link govuk-button--text govuk-pagination__link">6</button></li>');
    expect(screen.getAllByRole('listitem')[4]).toHaveTextContent('7');
  });
});

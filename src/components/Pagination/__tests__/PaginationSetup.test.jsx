import { render, screen } from '@testing-library/react';
import { ELLIPSIS, PAGINATION_NEXT_LABEL, PAGINATION_PREVIOUS_LABEL } from '../../../constants/AppConstants';
import Pagination from '../Pagination';

describe('Pagination setup', () => {
  const setPageStartNumberMock = jest.fn();

  it('should render single page if only 1 returned', async () => {
    const paginationData = {
      per_page: 1,
      total_records: 1,
    };

    render(
      <Pagination
        paginationData={paginationData}
        updatePaginationPageNumber="update"
        setPageStartNumber={setPageStartNumberMock}
      />,
    );

    await screen.findByRole('button', { name: '1' });
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: PAGINATION_NEXT_LABEL })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: PAGINATION_PREVIOUS_LABEL })).not.toBeInTheDocument();
  });

  it('should render multiple pages, 1, 2, max page number, and a next link if multiple returned', async () => {
    const paginationData = {
      per_page: 1,
      total_records: 3,
    };

    render(
      <Pagination
        paginationData={paginationData}
        updatePaginationPageNumber="update"
        setPageStartNumber={setPageStartNumberMock}
      />,
    );

    await screen.findByRole('button', { name: '1' });
    expect(screen.getAllByRole('listitem').length).toBe(3);
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('1');
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('2'); // current page is 1, we always show + & - 1 of current
    expect(screen.getAllByRole('listitem')[2]).toHaveTextContent('3');
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: PAGINATION_NEXT_LABEL })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: PAGINATION_PREVIOUS_LABEL })).not.toBeInTheDocument();
  });

  it('should render ellipses for skipped pages', async () => {
    const paginationData = {
      per_page: 1,
      total_records: 10,
    };

    render(
      <Pagination
        paginationData={paginationData}
        updatePaginationPageNumber="update"
        setPageStartNumber={setPageStartNumberMock}
      />,
    );

    await screen.findByRole('button', { name: '1' });
    expect(screen.getAllByRole('listitem').length).toBe(4);
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('1');
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('2'); // current page is 1, we always show + & - 1 of current
    expect(screen.getAllByRole('listitem')[2]).toHaveTextContent(ELLIPSIS);
    expect(screen.getAllByRole('listitem')[3]).toHaveTextContent('10');
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByText(ELLIPSIS)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: PAGINATION_NEXT_LABEL })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: PAGINATION_PREVIOUS_LABEL })).not.toBeInTheDocument();
  });

  it('should render current page from session if exists on initial render', async () => {
    window.sessionStorage.setItem('Page', 4);
    const paginationData = {
      per_page: 1,
      total_records: 10,
    };

    render(
      <Pagination
        paginationData={paginationData}
        updatePaginationPageNumber="update"
        setPageStartNumber={setPageStartNumberMock}
      />,
    );

    await screen.findByRole('button', { name: '1' });
    expect(screen.getAllByRole('listitem').length).toBe(7);
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('1');
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent(ELLIPSIS);
    expect(screen.getAllByRole('listitem')[2]).toHaveTextContent('4');
    expect(screen.getAllByRole('listitem')[3]).toHaveTextContent('5');
    expect(screen.getAllByRole('listitem')[4]).toHaveTextContent('6');
    expect(screen.getAllByRole('listitem')[5]).toHaveTextContent(ELLIPSIS);
    expect(screen.getAllByRole('listitem')[6]).toHaveTextContent('10');
    expect(screen.getByRole('button', { name: PAGINATION_NEXT_LABEL })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: PAGINATION_PREVIOUS_LABEL })).toBeInTheDocument();
  });
});

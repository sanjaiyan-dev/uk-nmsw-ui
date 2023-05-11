import { render, screen } from '@testing-library/react';
import { ELLIPSIS, PAGINATION_NEXT_LABEL, PAGINATION_PREVIOUS_LABEL } from '../../../constants/AppConstants';
import Pagination from '../Pagination';

describe('Pagination setup', () => {
  const setPageNumber = jest.fn();

  it('should render single page if only 1 returned', async () => {
    const maxPageNumber = 1;
    render(
      <Pagination
        maxPageNumber={maxPageNumber}
        updatePagination="update"
        setPageNumber={setPageNumber}
      />,
    );

    await screen.findByRole('button', { name: '1' });
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: PAGINATION_NEXT_LABEL })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: PAGINATION_PREVIOUS_LABEL })).not.toBeInTheDocument();
  });

  it('should render multiple pages, 1, 2, max page number, and a next link if multiple returned', async () => {
    const maxPageNumber = 10;
    render(
      <Pagination
        maxPageNumber={maxPageNumber}
        updatePagination="update"
        setPageNumber={setPageNumber}
      />,
    );

    await screen.findByRole('button', { name: '1' });
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument(); // current page is 1, + 1 is 2
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: PAGINATION_NEXT_LABEL })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: PAGINATION_PREVIOUS_LABEL })).not.toBeInTheDocument();
  });

  it('should render ellipses for skipped pages', async () => {
    const maxPageNumber = 10;
    render(
      <Pagination
        maxPageNumber={maxPageNumber}
        updatePagination="update"
        setPageNumber={setPageNumber}
      />,
    );

    await screen.findByRole('button', { name: '1' });
    expect(screen.getAllByRole('listitem').length).toBe(4);
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('1');
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('2'); // current page is 1, we always show + & - 1 of current
    expect(screen.getAllByRole('listitem')[2]).toHaveTextContent(ELLIPSIS);
    expect(screen.getAllByRole('listitem')[3]).toHaveTextContent('10');
    expect(screen.queryByRole('button', { name: PAGINATION_NEXT_LABEL })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: PAGINATION_PREVIOUS_LABEL })).not.toBeInTheDocument();
  });
});

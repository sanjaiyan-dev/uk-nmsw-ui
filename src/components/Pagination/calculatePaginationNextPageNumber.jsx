import { PAGINATION_NEXT_LABEL, PAGINATION_PAGE_LABEL, PAGINATION_PREVIOUS_LABEL } from '../../constants/AppConstants';

const calculatePaginationNextPageNumber = ({ clickType, clickedOnPageNumber, currentPage }) => {
  let nextPage;

  switch (clickType) {
    case PAGINATION_PAGE_LABEL: nextPage = clickedOnPageNumber;
      break;
    case PAGINATION_PREVIOUS_LABEL: nextPage = currentPage - 1;
      break;
    case PAGINATION_NEXT_LABEL: nextPage = currentPage + 1;
      break;
    default: nextPage = 1;
  }

  sessionStorage.setItem(PAGINATION_PAGE_LABEL, nextPage);
  return nextPage;
};

export default calculatePaginationNextPageNumber;

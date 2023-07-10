import {
  PAGINATION_DEFAULT_PAGE_START_NUMBER,
  PAGINATION_NEXT_LABEL,
  PAGINATION_PAGE_LABEL,
  PAGINATION_PREVIOUS_LABEL,
} from '../../constants/AppConstants';

const calculatePaginationNextPageNumber = ({
  clickType, clickedOnPageNumber, currentPage, resultPerPage,
}) => {
  let nextPage;

  switch (clickType) {
    case PAGINATION_PAGE_LABEL: nextPage = clickedOnPageNumber;
      break;
    case PAGINATION_PREVIOUS_LABEL: nextPage = currentPage - resultPerPage;
      break;
    case PAGINATION_NEXT_LABEL: nextPage = currentPage + resultPerPage;
      break;
    default: nextPage = PAGINATION_DEFAULT_PAGE_START_NUMBER;
  }

  sessionStorage.setItem(PAGINATION_PAGE_LABEL, nextPage);
  return nextPage;
};

export default calculatePaginationNextPageNumber;

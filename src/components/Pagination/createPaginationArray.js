import {
  PAGINATION_DEFAULT_PAGE_START_NUMBER,
  PAGINATION_DISPLAYABLE_PAGE_NUMBER_INCREMENTOR,
} from '../../constants/AppConstants';

const createPaginationArray = ({ selectedPage, totalPages, resultPerPage }) => {
  const pageArray = [];
  let ellipsesSet = false;

  for (let i = PAGINATION_DEFAULT_PAGE_START_NUMBER; i <= totalPages; i += resultPerPage) {
    const isCurrentPage = selectedPage === i;
    const displayablePageNumber = Math.ceil(i / resultPerPage);

    if (i === PAGINATION_DEFAULT_PAGE_START_NUMBER || i === totalPages) {
      pageArray.push({
        displayablePageNumber,
        pageStartNumber: i,
        isCurrentPage,
      });
    } else if (
      i === selectedPage
          || i === selectedPage - PAGINATION_DISPLAYABLE_PAGE_NUMBER_INCREMENTOR
          || i === selectedPage + PAGINATION_DISPLAYABLE_PAGE_NUMBER_INCREMENTOR
    ) {
      pageArray.push({
        displayablePageNumber,
        pageStartNumber: i,
        isCurrentPage,
      });
      ellipsesSet = false;
    } else if (!ellipsesSet) {
      pageArray.push({
        displayablePageNumber,
        pageStartNumber: i,
        ellipses: true,
        isCurrentPage,
      });
      ellipsesSet = true;
    }
  }

  return pageArray;
};

export default createPaginationArray;

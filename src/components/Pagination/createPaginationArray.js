import {
  PAGINATION_DEFAULT_PAGE_START_NUMBER,
  PAGINATION_DISPLAYABLE_PAGE_NUMBER_INCREMENTOR,
} from '../../constants/AppConstants';

const createPaginationArray = ({ selectedPage, totalPages, resultPerPage }) => {
  let ellipsesSet = false;
  const pageArray = [];
  let displayablePageNumber = PAGINATION_DISPLAYABLE_PAGE_NUMBER_INCREMENTOR;

  for (let i = PAGINATION_DEFAULT_PAGE_START_NUMBER; i <= totalPages; i += resultPerPage) {
    if (i === PAGINATION_DEFAULT_PAGE_START_NUMBER || i === totalPages) {
      pageArray.push({
        displayablePageNumber,
        pageStartNumber: i,
        isCurrentPage: selectedPage === i,
      });
    } else if (i !== PAGINATION_DEFAULT_PAGE_START_NUMBER && i !== totalPages) {
      if (i === selectedPage || i === (selectedPage - resultPerPage) || i === (selectedPage + resultPerPage)) {
        pageArray.push({
          displayablePageNumber,
          pageStartNumber: i,
          isCurrentPage: selectedPage === i,
        });
        ellipsesSet = false;
      } else if (!ellipsesSet) {
        pageArray.push({
          displayablePageNumber,
          pageStartNumber: i,
          ellipses: true,
          isCurrentPage: selectedPage === i,
        });
        ellipsesSet = true;
      }
    }
    displayablePageNumber += PAGINATION_DISPLAYABLE_PAGE_NUMBER_INCREMENTOR;
  }

  return pageArray;
};

export default createPaginationArray;

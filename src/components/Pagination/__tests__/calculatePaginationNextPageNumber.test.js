import calculatePaginationNextPageNumber from '../calculatePaginationNextPageNumber';
import {
  PAGINATION_DEFAULT_PAGE_START_NUMBER,
  PAGINATION_NEXT_LABEL,
  PAGINATION_PAGE_LABEL,
  PAGINATION_PREVIOUS_LABEL,
} from '../../../constants/AppConstants';

describe('calculatePaginationNextPageNumber', () => {
  it.each`
    clickType                 | clickedOnPageNumber | currentPage | resultPerPage | expectedNextPage
    ${PAGINATION_PAGE_LABEL}   | ${3}                | ${2}        | ${10}         | ${3}
    ${PAGINATION_PREVIOUS_LABEL} | ${1}                | ${21}       | ${10}         | ${11}
    ${PAGINATION_NEXT_LABEL}     | ${1}                | ${11}       | ${10}         | ${21}
    ${undefined}               | ${1}                | ${0}        | ${10}         | ${PAGINATION_DEFAULT_PAGE_START_NUMBER}
  `('should return $expectedNextPage when clickType is $clickType', ({
    clickType, clickedOnPageNumber, currentPage, resultPerPage, expectedNextPage,
  }) => {
    const paginationData = {
      clickType,
      clickedOnPageNumber,
      currentPage,
      resultPerPage,
    };
    const result = calculatePaginationNextPageNumber(paginationData);
    expect(result).toBe(expectedNextPage);
    expect(sessionStorage.getItem(PAGINATION_PAGE_LABEL)).toBe(`${expectedNextPage}`);
  });
});

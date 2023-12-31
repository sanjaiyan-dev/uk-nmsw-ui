import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ELLIPSIS, PAGINATION_DEFAULT_PAGE_START_NUMBER,
  PAGINATION_NEXT_LABEL,
  PAGINATION_PAGE_LABEL,
  PAGINATION_PREVIOUS_LABEL,
} from '../../constants/AppConstants';
import { scrollToTop } from '../../utils/ScrollToElement';
import calculatePaginationNextPageNumber from './calculatePaginationNextPageNumber';
import createPaginationArray from './createPaginationArray';
import calculateMaxPageStartNumber from './calculateMaxPageStartNumber';

const Pagination = ({
  paginationData,
  updatePaginationPageNumber,
  setPageStartNumber,
}) => {
  const pageOnLoad = parseInt(sessionStorage.getItem(PAGINATION_PAGE_LABEL), 10) || PAGINATION_DEFAULT_PAGE_START_NUMBER;
  const resultPerPage = paginationData?.per_page;
  const maxPageStartNumber = calculateMaxPageStartNumber(paginationData);

  const [currentPage, setCurrentPage] = useState();
  const [pages, setPages] = useState();

  const createPagination = async () => {
    const nextPageNumber = currentPage || pageOnLoad;
    const pageArray = createPaginationArray({
      selectedPage: nextPageNumber,
      totalPages: maxPageStartNumber,
      resultPerPage,
    });

    setCurrentPage(nextPageNumber);
    setPages(pageArray);
  };

  const handlePaginationClick = async (e, { clickType, clickedOnPageNumber }) => {
    e.preventDefault();
    const calculatedNextPage = await calculatePaginationNextPageNumber({
      clickType, clickedOnPageNumber, currentPage, resultPerPage,
    });

    setPageStartNumber(calculatedNextPage);
    setCurrentPage(calculatedNextPage);
    sessionStorage.setItem(PAGINATION_PAGE_LABEL, calculatedNextPage);

    scrollToTop();
  };

  useEffect(() => {
    createPagination();
  }, [updatePaginationPageNumber]);

  if (!pages || pages.length <= 0) { return null; }
  return (
    <nav className="govuk-pagination" role="navigation" aria-label="results">
      {currentPage !== PAGINATION_DEFAULT_PAGE_START_NUMBER
        && (
          <div className="govuk-pagination__prev">
            <button
              type="button"
              className="govuk-link govuk-button--text govuk-pagination__link"
              onClick={(e) => handlePaginationClick(e, { clickType: PAGINATION_PREVIOUS_LABEL })}
            >
              <svg className="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
                <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z" />
              </svg>
              <span className="govuk-pagination__link-title">{PAGINATION_PREVIOUS_LABEL}</span>
            </button>
          </div>
        )}
      <ul className="govuk-pagination__list">
        {pages.map((page) => (
          <React.Fragment key={page.displayablePageNumber}>
            {!page.ellipses
              && (
                <li className={page.isCurrentPage ? 'govuk-pagination__item govuk-pagination__item--current' : 'govuk-pagination__item'}>
                  <button
                    type="button"
                    className="govuk-link govuk-button--text govuk-pagination__link"
                    onClick={(e) => handlePaginationClick(e, { clickType: PAGINATION_PAGE_LABEL, clickedOnPageNumber: page.pageStartNumber })}
                  >
                    {page.displayablePageNumber}
                  </button>
                </li>
              )}
            {page.ellipses
              && (
                <li className="govuk-pagination__item govuk-pagination__item--ellipses">{ELLIPSIS}</li>
              )}
          </React.Fragment>
        ))}
      </ul>
      {currentPage < maxPageStartNumber
        && (
          <div className="govuk-pagination__next">
            <button
              type="button"
              className="govuk-link govuk-button--text govuk-pagination__link"
              onClick={(e) => handlePaginationClick(e, { clickType: PAGINATION_NEXT_LABEL })}
            >
              <span className="govuk-pagination__link-title">{PAGINATION_NEXT_LABEL}</span>
              <svg className="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13">
                <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z" />
              </svg>
            </button>
          </div>
        )}
    </nav>
  );
};

export default Pagination;

Pagination.propTypes = {
  paginationData: PropTypes.shape({
    per_page: PropTypes.number.isRequired,
    total_records: PropTypes.number.isRequired,
  }),
  updatePaginationPageNumber: PropTypes.number.isRequired,
  setPageStartNumber: PropTypes.func.isRequired,
};

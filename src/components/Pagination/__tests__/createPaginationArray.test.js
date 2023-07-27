import createPaginationArray from '../createPaginationArray';

describe('createPaginationArray', () => {
  it('should return the correct pageArray when selectedPage is 0, totalPages is 10, and resultPerPage is 50', () => {
    const selectedPage = 0;
    const totalPages = 10;
    const resultPerPage = 50;
    const expectedPageArray = [
      { displayablePageNumber: 1, pageStartNumber: 0, isCurrentPage: true },
    ];
    const result = createPaginationArray({ selectedPage, totalPages, resultPerPage });
    expect(result).toEqual(expectedPageArray);
  });

  it('should return the correct pageArray when selectedPage is 0, totalPages is 10, and resultPerPage is 3', () => {
    const selectedPage = 0;
    const totalPages = 10;
    const resultPerPage = 3;
    const expectedPageArray = [
      { displayablePageNumber: 1, pageStartNumber: 0, isCurrentPage: true },
      {
        displayablePageNumber: 2, pageStartNumber: 3, isCurrentPage: false,
      },
      {
        displayablePageNumber: 3, pageStartNumber: 6, ellipses: true, isCurrentPage: false,
      },
    ];
    const result = createPaginationArray({ selectedPage, totalPages, resultPerPage });
    expect(result).toEqual(expectedPageArray);
  });

  it('should return the correct pageArray when selectedPage is 2, totalPages is 10, and resultPerPage is 2', () => {
    const selectedPage = 2;
    const totalPages = 10;
    const resultPerPage = 2;
    const expectedPageArray = [
      { displayablePageNumber: 1, pageStartNumber: 0, isCurrentPage: false },
      { displayablePageNumber: 2, pageStartNumber: 2, isCurrentPage: true },
      {
        displayablePageNumber: 3, pageStartNumber: 4, isCurrentPage: false,
      },
      {
        displayablePageNumber: 4, ellipses: true, pageStartNumber: 6, isCurrentPage: false,
      },
      {
        displayablePageNumber: 6, pageStartNumber: 10, isCurrentPage: false,
      },
    ];
    const result = createPaginationArray({ selectedPage, totalPages, resultPerPage });
    expect(result).toEqual(expectedPageArray);
  });

  it('should return the correct pageArray when selectedPage is 5, totalPages is 20, and resultPerPage is 5', () => {
    const selectedPage = 10;
    const totalPages = 20;
    const resultPerPage = 5;
    const expectedPageArray = [
      { displayablePageNumber: 1, pageStartNumber: 0, isCurrentPage: false },
      {
        displayablePageNumber: 2, pageStartNumber: 5, isCurrentPage: false,
      },
      { displayablePageNumber: 3, pageStartNumber: 10, isCurrentPage: true },
      {
        displayablePageNumber: 4, pageStartNumber: 15, isCurrentPage: false,
      },
      { displayablePageNumber: 5, pageStartNumber: 20, isCurrentPage: false },
    ];
    const result = createPaginationArray({ selectedPage, totalPages, resultPerPage });
    expect(result).toEqual(expectedPageArray);
  });
});

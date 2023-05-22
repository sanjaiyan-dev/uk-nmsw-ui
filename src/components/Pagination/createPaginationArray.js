const createPaginationArray = ({ selectedPage, totalPages }) => {
  let ellipsesSet = false;
  const pageArray = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages) {
      pageArray.push({
        pageNumber: i,
        isCurrentPage: selectedPage === i,
      });
    } else if (i !== 1 && i !== totalPages) {
      if (i === selectedPage || i === (selectedPage - 1) || i === (selectedPage + 1)) {
        pageArray.push({
          pageNumber: i,
          isCurrentPage: selectedPage === i,
        });
        ellipsesSet = false;
      } else if (!ellipsesSet) {
        pageArray.push({
          pageNumber: i,
          ellipses: true,
          isCurrentPage: selectedPage === i,
        });
        ellipsesSet = true;
      }
    }
  }

  return pageArray;
};

export default createPaginationArray;

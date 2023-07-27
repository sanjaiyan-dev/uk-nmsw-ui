const calculateMaxPageStartNumber = (paginationData) => {
  const { total_records: totalRecords = 0, per_page: perPage = 0 } = paginationData || {};

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalRecords / perPage);

  // If there are no records or perPage is 0, page_start should be 0;
  // otherwise calculate the maximum page_start value
  return totalPages === 0 || perPage === 0 ? 0 : (totalPages - 1) * perPage;
};

export default calculateMaxPageStartNumber;

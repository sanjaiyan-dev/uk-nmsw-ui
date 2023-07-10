import calculateMaxPageStartNumber from '../calculateMaxPageStartNumber';

describe('calculateMaxPageStartNumber', () => {
  it.each`
    totalRecords | perPage | expected
    ${10}        | ${3}    | ${9}
    ${10}        | ${2}    | ${8}
    ${10}        | ${6}    | ${6}
    ${10}        | ${5}    | ${5}
    ${0}         | ${3}    | ${0}
    ${0}         | ${0}    | ${0}
    ${15}        | ${5}    | ${10}
    ${17}        | ${4}    | ${16}
    ${20}        | ${10}   | ${10}
    ${25}        | ${50}   | ${0}
    ${100}       | ${50}   | ${50}
    ${976}       | ${50}   | ${950}
  `('should return $expected when totalRecords=$totalRecords and perPage=$perPage', ({ totalRecords, perPage, expected }) => {
    const paginationData = { total_records: totalRecords, per_page: perPage };
    const result = calculateMaxPageStartNumber(paginationData);
    expect(result).toBe(expected);
  });
});

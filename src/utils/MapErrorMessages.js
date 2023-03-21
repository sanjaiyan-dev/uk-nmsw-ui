const MapErrorMessages = ({ errData, errorMessageMapFile }) => {
  const mappedErrorWording = Object.entries(errData).reduce((result, fieldError) => {
    if (errorMessageMapFile && errorMessageMapFile[fieldError[0]]) {
      result.push({
        cell: fieldError[0],
        message: errorMessageMapFile[fieldError[0]][fieldError[1]] ? errorMessageMapFile[fieldError[0]][fieldError[1]] : fieldError[1],
        order: errorMessageMapFile[fieldError[0]].order ? errorMessageMapFile[fieldError[0]].order : 'zz',
      });
    } else if (errorMessageMapFile && errorMessageMapFile[fieldError[0].charAt(0)]) {
      result.push({
        cell: fieldError[0],
        message: errorMessageMapFile[fieldError[0].charAt(0)][fieldError[1]] ? errorMessageMapFile[fieldError[0].charAt(0)][fieldError[1]] : fieldError[1],
        order: errorMessageMapFile[fieldError[0].charAt(0)].order ? errorMessageMapFile[fieldError[0].charAt(0)].order : 'zz',
      });
    } else {
      result.push({
        cell: fieldError[0] === '__root__' ? '' : fieldError[0],
        message: fieldError[1],
        order: 'zz', // need to set order here to account for anything that falls into the else due to missing from mapping tables
      });
    }
    return result;
  }, []);

  const sortedErrorList = mappedErrorWording.sort((a, b) => a.order.localeCompare(b.order));
  return sortedErrorList;
};

export default MapErrorMessages;

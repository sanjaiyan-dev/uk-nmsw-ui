// eslint-disable-next-line import/prefer-default-export
export const { DownloadFile } = (file, fileName) => {
  fetch(file, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(
        new Blob([blob]),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        fileName,
      );
      link.click();
      URL.revokeObjectURL(url);
    });
};

/* NOTE on disabling the linting rule here:
 * mocking the download file function for RTL/Jest
 * testing has proved to be quite difficult
 * when we use export default here and then import
 * as a component on the other end
 */

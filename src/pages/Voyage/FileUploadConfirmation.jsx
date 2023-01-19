import PropTypes from 'prop-types';

const FileUploadConfirmation = ({ title }) => {
  document.title = title;

  return (
    <h1 className="govuk-heading-xl">No errors found</h1>
  );
};

export default FileUploadConfirmation;

FileUploadConfirmation.propTypes = {
  title: PropTypes.string.isRequired,
};

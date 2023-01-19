import { useLocation } from 'react-router-dom';

const FileUploadConfirmation = () => {
  const { state } = useLocation();
  document.title = state.title;

  console.log(state);

  return (
    <h1 className="govuk-heading-xl">No errors found</h1>
  );
};

export default FileUploadConfirmation;

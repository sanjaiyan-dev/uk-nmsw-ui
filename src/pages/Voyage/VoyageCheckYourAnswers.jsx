import { useLocation } from 'react-router-dom';

const VoyageCheckYourAnswers = () => {
  const { state } = useLocation();

  return (
    <h1>{state?.voyageId}</h1>
  );
};

export default VoyageCheckYourAnswers;

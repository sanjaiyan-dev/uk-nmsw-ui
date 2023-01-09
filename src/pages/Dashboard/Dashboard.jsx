import { SERVICE_NAME } from '../../constants/AppConstants';

const Dashboard = () => {
  document.title = SERVICE_NAME;
  return (
    <>
      <h1 className="govuk-heading-l">Dashboard</h1>
    </>
  );
};

export default Dashboard;

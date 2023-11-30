import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  DECLARATION_UPT_STATUS_BOARD,
  DECLARATION_UPT_STATUS_CHECK,
  DECLARATION_UPT_STATUS_NO_BOARD,
  UPT_CONTACT_EMAIL,
} from '../../../constants/AppConstants';
import {
  ETA_GUIDANCE_ON_GOVUK_URL,
  EXAMINING_IDENTITY_DOCS_URL,
  NATIONALITIES_REQ_CLEARANCE_URL,
  VISAS_AND_IMMIGRATION_URL,
  YOUR_VOYAGES_URL,
} from '../../../constants/AppUrlConstants';
import StatusTag from '../../../components/StatusTag';
import cookieToFind from '../../../utils/cookieToFind';
import '../../../assets/css/eta.scss';

const EtaRequirements = ({ condensedInfo }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const etaCookie = cookieToFind('etaCookie');

  const addEtaCookie = () => {
    if (!etaCookie) {
      document.cookie = 'etaCookie=true';
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    addEtaCookie();
    if (state?.redirectURL) {
      navigate(state.redirectURL, { state });
    } else {
      navigate(YOUR_VOYAGES_URL);
    }
  };

  return (
    <>
      <div className="govuk-grid-row">
        <div className={!condensedInfo ? 'govuk-grid-column-three-quarters' : 'govuk-grid-column-full'}>
          {!condensedInfo && <h1 className="govuk-heading-l">New: Permission to travel status</h1>}
          <p className="govuk-body">
            We are introducing permission to travel status to the National Maritime Single Window service.
          </p>
          <p className="govuk-body">
            When reporting an arrival, we will use the passenger details to check if they have valid permission to travel.
            We will show you a status for each passenger. The statuses will confirm if a passenger has valid permission to travel or if you must verify their visa.
          </p>
        </div>
      </div>
      {!condensedInfo
        && (
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
              <table className="govuk-table">
                <caption className="govuk-table__caption govuk-table__caption--m" />
                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    <th scope="col" className="govuk-table__header">Status</th>
                    <th scope="col" className="govuk-table__header">What you need to do</th>
                  </tr>
                </thead>
                <tbody className="govuk-table__body">
                  <tr className="govuk-table__row">
                    <th scope="row" className="govuk-table__header govuk-!-width-one-third">
                      <StatusTag status={DECLARATION_UPT_STATUS_BOARD} />
                    </th>
                    <td className="govuk-table__cell">
                      <p className="govuk-body">Passengers with this result can board.</p>
                      <p className="govuk-body">You must still check if these passengers have a valid passport or travel document that is acceptable in the UK.</p>
                    </td>
                  </tr>
                  <tr className="govuk-table__row">
                    <th scope="row" className="govuk-table__header govuk-!-width-one-third">
                      <StatusTag status={DECLARATION_UPT_STATUS_CHECK} />
                    </th>
                    <td className="govuk-table__cell">
                      <p className="govuk-body">Passengers with this result can board.</p>
                      <p className="govuk-body">You must still check if these passengers have a valid passport or travel document that is acceptable in the UK.</p>
                      <p className="govuk-body">For passengers from countries who need a visa to enter the UK, you must check their visa or exemption documents.</p>
                    </td>
                  </tr>
                  <tr className="govuk-table__row">
                    <th scope="row" className="govuk-table__header govuk-!-width-one-third">
                      <StatusTag status={DECLARATION_UPT_STATUS_NO_BOARD} />
                    </th>
                    <td className="govuk-table__cell">
                      <p className="govuk-body">Passengers with this result must not board.</p>
                      <p className="govuk-body">We will contact you by phone and email with further instructions.</p>
                      <p className="govuk-body">No further action needed.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h2 className="govuk-heading-s">Help and information</h2>
              <p className="govuk-body">Read the <a href={EXAMINING_IDENTITY_DOCS_URL} target="_blank" rel="noreferrer">examining identity documents guidance on GOV.UK (opens in new tab)</a></p>
              <p className="govuk-body">Check the list of <a href={NATIONALITIES_REQ_CLEARANCE_URL} target="_blank" rel="noreferrer">nationalities requiring entry clearance on GOV.UK (opens in new tab)</a></p>
              <p className="govuk-body">Read the <a href={ETA_GUIDANCE_ON_GOVUK_URL} target="_blank" rel="noreferrer">ETA guidance on GOV.UK (opens in new tab)</a></p>
              <p className="govuk-body"><a href={VISAS_AND_IMMIGRATION_URL} target="_blank" rel="noreferrer">Visas and immigration (opens in new tab)</a></p>
              <p className="govuk-body">{`If you need more help, email ${UPT_CONTACT_EMAIL}`}</p>
              <button type="submit" className="govuk-button govuk-!-margin-top-5" data-module="govuk-button" onClick={handleClick}>Continue</button>
            </div>
          </div>
        )}
    </>
  );
};

export default EtaRequirements;

EtaRequirements.propTypes = {
  condensedInfo: PropTypes.bool,
};

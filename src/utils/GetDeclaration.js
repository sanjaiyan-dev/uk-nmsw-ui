import axios from 'axios';
import { API_URL, ENDPOINT_DECLARATION_ATTACHMENTS_PATH, ENDPOINT_DECLARATION_PATH } from '../constants/AppAPIConstants';
import Auth from './Auth';

async function GetDeclaration({ declarationId }) {
  let resultsToReturn;

  try {
    resultsToReturn = await axios.get(`${API_URL}${ENDPOINT_DECLARATION_PATH}/${declarationId}${ENDPOINT_DECLARATION_ATTACHMENTS_PATH}`, {
      headers: {
        Authorization: `Bearer ${Auth.retrieveToken()}`,
      },
    });
  } catch (error) {
    resultsToReturn = { status: error?.response?.status, message: error?.response?.message };
  }

  return resultsToReturn;
}

export default GetDeclaration;

import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

/* Create context with user and auth state
 * in future this can be extended to also include roles: [] so we can store the users
 * roles in the context and use for displaying pages actions etc.
*/
const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const storeToken = (token) => {
    sessionStorage.setItem('token', token);
  };

  const retrieveToken = () => {
    return sessionStorage.getItem('token');
  };

  const isAuthorized = () => {
    return retrieveToken();
  };

  // Login updates the user data with a name & roles
  // will replace this with the authentication components later
  const signIn = ({ name }) => {
    if (isAuthorized()) {
      setUser(() => ({
        name: name,
        auth: true,
      }));
    }
  };

  // Logout updates the user data to default
  // will replace this with the authentication components later
  const signOut = () => {
    setUser(() => ({
      name: '',
      auth: false,
    }));
    sessionStorage.clear();
  };



  return (
    <UserContext.Provider value={{ user, signIn, signOut, storeToken, retrieveToken, isAuthorized }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

UserProvider.propTypes = {
  children: PropTypes.node, // allows any renderable object
};

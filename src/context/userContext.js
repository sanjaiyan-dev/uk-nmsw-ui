import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

/* Create context with user and auth state
 * in future this can be extended to also include roles: [] so we can store the users
 * roles in the context and use for displaying pages actions etc.
*/
const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('isAuthenticated')) || {});

  // Login updates the user data with a name & roles
  // will replace this with the authentication components later
  // Here is where we will make the api call to get the token

  // Will take email and password as props
  const signIn = () => {
    // Make an api call to sign in with email and password
    // api returns 200 a name a group and a token

    const response = {
      token: '123',
      name: 'Bob',
      group: 'Disney Cruises',
    };
    
    sessionStorage.setItem('isAuthenticated', JSON.stringify(response));
    setUser(() => (response));

    // api returns error and we show error in UI
  };

  // Logout updates the user data to default
  // will replace this with the authentication components later
  const signOut = () => {
    setUser(() => ({}));
    sessionStorage.removeItem('isAuthenticated');
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

UserProvider.propTypes = {
  children: PropTypes.node, // allows any renderable object
};

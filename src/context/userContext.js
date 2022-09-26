import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

/* Create context with user and auth state
 * in future this can be extended to also include roles: [] so we can store the users
 * roles in the context and use for displaying pages actions etc.
*/
const UserContext = createContext({
  name: '',
  auth: false
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ name: '', auth: false });
  console.log('user', user)

  // Login updates the user data with a name & roles
  // will replace this with the authentication  components later
  const login = ({ name }) => {
    setUser(() => ({
      name: name,
      auth: true,
    }));
  };

  // Logout updates the user data to default
  // will replace this with the authentication components later
  const logout = () => {
    setUser(() => ({
      name: '',
      auth: false,
    }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

UserProvider.propTypes = {
  children: PropTypes.node, // allows any renderable object
};

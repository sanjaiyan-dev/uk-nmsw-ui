import { useEffect } from 'react';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';

const ScrollToTop = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.activeElement.blur(); // deselect the link so it doesn't remain in the focus state when page loads
  }, [location.pathname]);

  return <>{children}</>;
};

export default ScrollToTop;

ScrollToTop.propTypes = {
  children: PropTypes.node, // allows any renderable object
};

import { render, screen } from '@testing-library/react';
import CookiePolicy from '../CookiePolicy';

describe('Cookie policy tests', () => {

  it('should render a title of Cookies', async () => {
    render(<CookiePolicy />);
    expect(screen.getByText('Cookies')).toBeInTheDocument();
  });
});

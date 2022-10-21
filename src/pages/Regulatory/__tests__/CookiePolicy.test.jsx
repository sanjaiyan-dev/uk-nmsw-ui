import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CookiePolicy from '../CookiePolicy';

describe('Cookie policy tests', () => {

  it('should render a title of Cookies', async () => {
    render(<MemoryRouter><CookiePolicy /></MemoryRouter>);
    expect(screen.getByText('Cookies')).toBeInTheDocument();
  });
});

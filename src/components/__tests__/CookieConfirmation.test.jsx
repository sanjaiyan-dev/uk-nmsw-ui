import { render, screen } from '@testing-library/react';
import CookieConfirmation from '../CookieConfirmation';

describe('Cookie confirmation tests', () => {

  it('should render cookie confirmation banner', () => {
    render(<CookieConfirmation />);

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('You\'ve set your cookie preferences.')).toBeInTheDocument();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import SignIn from './SignIn';

describe('Sign in page tests', () => {

  it('should render the page with a H1', async () => {
    await waitFor(() => { render(<SignIn />); });
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

});

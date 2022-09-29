import { render, screen } from '@testing-library/react';
import PrivacyNotice from '../PrivacyNotice';

describe('Privacy notice tests', () => {

  it('should render a title of Privacy notice', async () => {
    render(<PrivacyNotice />);
    expect(screen.getByText('Privacy notice for National Maritime Single Window')).toBeInTheDocument();
  });
});

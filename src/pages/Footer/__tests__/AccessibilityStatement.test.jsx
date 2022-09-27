import { render, screen } from '@testing-library/react';
import AccessibilityStatement from '../AccessibilityStatement';

describe('Cookie policy tests', () => {

  it('should render a title of Cookies', async () => {
    render(<AccessibilityStatement />);
    expect(screen.getByText('Accessibility statement for National Maritime Single Window')).toBeInTheDocument();
  });
});

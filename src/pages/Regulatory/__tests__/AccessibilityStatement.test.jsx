import { render, screen } from '@testing-library/react';
import AccessibilityStatement from '../AccessibilityStatement';

describe('Accessibility statement tests', () => {
  it('should render accessibility statement title', async () => {
    render(<AccessibilityStatement />);
    expect(screen.getByText('Accessibility statement for National Maritime Single Window')).toBeInTheDocument();
  });
});

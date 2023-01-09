import { render, screen } from '@testing-library/react';
import ErrorsCrewUpload from '../ErrorsCrewUpload';

describe('Crew upload error tests', () => {

  it('should render the page correctly', async () => {
    render(<ErrorsCrewUpload />);
    expect(screen.getByText('Errors found')).toBeInTheDocument();
    expect(screen.getByText('Your file has errors. Check the file to fix any errors and re-upload your file.')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Re-upload file'})).toBeInTheDocument();
  });

  // TODO: Once api is in place, mock it's response to test that errors show correctly as currently the hardcoded errors are always returned in the render
});

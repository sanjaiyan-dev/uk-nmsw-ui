import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { TEMPLATE_PAGE_NAME } from '../../../constants/AppUrlConstants';
import Templates from '../Templates';
import { DownloadFile } from '../../../utils/DownloadFile';

jest.mock('../../../utils/DownloadFile', () => ({
  DownloadFile: jest.fn(),
}));

describe('Template page tests', () => {
  it('should render the page with the Templates as a H1', () => {
    render(<MemoryRouter><Templates /></MemoryRouter>);
    expect(screen.getByText(TEMPLATE_PAGE_NAME)).toBeInTheDocument();
  });

  // Will need to update below tests with new template names and file size when new templates are ready
  it('should tell the user about the templates and display them', () => {
    render(<MemoryRouter><Templates /></MemoryRouter>);
    expect(screen.getByText('Use the templates provided:')).toBeInTheDocument();
    expect(screen.getByText('General Declaration (FAL 1) template (xls)')).toBeInTheDocument();
    expect(screen.getByText('Crew details including supernumeraries (FAL 5) template (xls)')).toBeInTheDocument();
    expect(screen.getByText('Passenger details (FAL 6) template (xls)')).toBeInTheDocument();
  });

  it('should download General declaration (FAL1) on click', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Templates /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: 'General Declaration (FAL 1) template (xls)' }));
    expect(DownloadFile).toHaveBeenCalled();
    expect(DownloadFile).toHaveBeenCalledWith('assets/files/NMSW-FAL-1.xlsx', 'FAL1.xlsx');
  });

  it('should download Crew details (FAL5) on click', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Templates /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: 'Crew details including supernumeraries (FAL 5) template (xls)' }));
    expect(DownloadFile).toHaveBeenCalled();
    expect(DownloadFile).toHaveBeenCalledWith('assets/files/NMSW-FAL-5-and-6.xlsx', 'FAL5.xlsx');
  });

  it('should download Passenger details (FAL 6) on click', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Templates /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: 'Passenger details (FAL 6) template (xls)' }));
    expect(DownloadFile).toHaveBeenCalled();
    expect(DownloadFile).toHaveBeenCalledWith('assets/files/NMSW-FAL-5-and-6.xlsx', 'FAL6.xlsx');
  });
});

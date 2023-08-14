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

  it('should tell the user about the templates and display them', () => {
    render(<MemoryRouter><Templates /></MemoryRouter>);
    expect(screen.getByText('Use the templates provided:')).toBeInTheDocument();
    expect(screen.getByText('General Declaration (FAL 1) template (xlsx, 31kb)')).toBeInTheDocument();
    expect(screen.getByText('Crew details (FAL 5) template (xlsx, 118kb)')).toBeInTheDocument();
    expect(screen.getByText('Passenger details including supernumeraries (FAL 6) template (xlsx, 90kb)')).toBeInTheDocument();
  });

  it('should download General declaration (FAL 1) on click', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Templates /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: 'General Declaration (FAL 1) template (xlsx, 31kb)' }));
    expect(DownloadFile).toHaveBeenCalled();
    expect(DownloadFile).toHaveBeenCalledWith('assets/files/General declaration (FAL 1).xlsx', 'General declaration (FAL 1).xlsx');
  });

  it('should download Crew details (FAL 5) on click', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Templates /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: 'Crew details (FAL 5) template (xlsx, 118kb)' }));
    expect(DownloadFile).toHaveBeenCalled();
    expect(DownloadFile).toHaveBeenCalledWith('assets/files/Crew details (FAL 5).xlsx', 'Crew details (FAL 5).xlsx');
  });

  it('should download Passenger details (FAL 6) on click', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Templates /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: 'Passenger details including supernumeraries (FAL 6) template (xlsx, 90kb)' }));
    expect(DownloadFile).toHaveBeenCalled();
    expect(DownloadFile).toHaveBeenCalledWith('assets/files/Passenger details including supernumeraries (FAL 6).xlsx', 'Passenger details including supernumeraries (FAL 6).xlsx');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DownloadFile } from '../../../utils/DownloadFile';
import Help from '../Help';

jest.mock('../../../utils/DownloadFile', () => ({
  DownloadFile: jest.fn(),
}));

describe('Contact us page tests', () => {
  it('should render a title of Contact us page', async () => {
    render(<Help />);
    expect(screen.getByRole('heading', { name: 'Help and support for the National Maritime Single Window' })).toBeInTheDocument();
  });

  it('should render link to service email', async () => {
    render(<Help />);
    expect(screen.getByRole('link', { name: 'nmsw@homeoffice.gov.uk' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'nmsw@homeoffice.gov.uk' }).outerHTML).toBe('<a class="govuk-link" href="mailto: nmsw@homeoffice.gov.uk">nmsw@homeoffice.gov.uk</a>');
  });

  it('should render link to upt email', async () => {
    render(<Help />);
    expect(screen.getByRole('link', { name: 'UPTqueries@homeoffice.gov.uk' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'UPTqueries@homeoffice.gov.uk' }).outerHTML).toBe('<a class="govuk-link" href="mailto: UPTqueries@homeoffice.gov.uk">UPTqueries@homeoffice.gov.uk</a>');
  });

  it('should display the FAL templates', async () => {
    render(<Help />);
    expect(screen.getByText('General Declaration (FAL 1) template (xlsx, 31kb)')).toBeInTheDocument();
    expect(screen.getByText('Crew details (FAL 5) template (xlsx, 118kb)')).toBeInTheDocument();
    expect(screen.getByText('Passenger details including supernumeraries (FAL 6) template (xlsx, 90kb)')).toBeInTheDocument();
  });

  it('should download General declaration (FAL1) on click', async () => {
    const user = userEvent.setup();
    render(<Help />);

    await user.click(screen.getByRole('button', { name: 'General Declaration (FAL 1) template (xlsx, 31kb)' }));
    expect(DownloadFile).toHaveBeenCalled();
    expect(DownloadFile).toHaveBeenCalledWith('assets/files/General declaration (FAL 1).xlsx', 'General declaration (FAL 1).xlsx');
  });

  it('should download Crew details (FAL5) on click', async () => {
    const user = userEvent.setup();
    render(<Help />);

    await user.click(screen.getByRole('button', { name: 'Crew details (FAL 5) template (xlsx, 118kb)' }));
    expect(DownloadFile).toHaveBeenCalled();
    expect(DownloadFile).toHaveBeenCalledWith('assets/files/Crew details (FAL 5).xlsx', 'Crew details (FAL 5).xlsx');
  });

  it('should download Passenger details (FAL 6) on click', async () => {
    const user = userEvent.setup();
    render(<Help />);

    await user.click(screen.getByRole('button', { name: 'Passenger details including supernumeraries (FAL 6) template (xlsx, 90kb)' }));
    expect(DownloadFile).toHaveBeenCalled();
    expect(DownloadFile).toHaveBeenCalledWith('assets/files/Passenger details including supernumeraries (FAL 6).xlsx', 'Passenger details including supernumeraries (FAL 6).xlsx');
  });

  it('should render link to email for Central region contact', async () => {
    render(<Help />);
    expect(screen.getByRole('link', { name: 'BFCentralRCCGMteam@homeoffice.gov.uk' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'BFCentralRCCGMteam@homeoffice.gov.uk' }).outerHTML).toBe('<a class="govuk-link" href="mailto: BFCentralRCCGMteam@homeoffice.gov.uk">BFCentralRCCGMteam@homeoffice.gov.uk</a>');
  });

  it('should render link to email for North region contact', async () => {
    render(<Help />);
    expect(screen.getByRole('link', { name: 'NorthGeneralAviationandMaritime@homeoffice.gov.uk' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'NorthGeneralAviationandMaritime@homeoffice.gov.uk' }).outerHTML).toBe('<a class="govuk-link" href="mailto: NorthGeneralAviationandMaritime@homeoffice.gov.uk">NorthGeneralAviationandMaritime@homeoffice.gov.uk</a>');
  });

  it('should render link to email for South region contact', async () => {
    render(<Help />);
    expect(screen.getByRole('link', { name: 'BorderForceSouthGMteam@homeoffice.gov.uk' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'BorderForceSouthGMteam@homeoffice.gov.uk' }).outerHTML).toBe('<a class="govuk-link" href="mailto: BorderForceSouthGMteam@homeoffice.gov.uk">BorderForceSouthGMteam@homeoffice.gov.uk</a>');
  });

  it('should render link to email for South East region contact', async () => {
    render(<Help />);
    expect(screen.getByRole('link', { name: 'BorderForceSouthEastGMteam@homeoffice.gov.uk' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'BorderForceSouthEastGMteam@homeoffice.gov.uk' }).outerHTML).toBe('<a class="govuk-link" href="mailto: BorderForceSouthEastGMteam@homeoffice.gov.uk">BorderForceSouthEastGMteam@homeoffice.gov.uk</a>');
  });
});

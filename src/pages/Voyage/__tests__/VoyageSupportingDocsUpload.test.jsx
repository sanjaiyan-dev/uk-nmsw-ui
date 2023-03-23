import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { VOYAGE_SUPPORTING_DOCS_UPLOAD_URL, VOYAGE_TASK_LIST_URL, YOUR_VOYAGES_URL } from '../../../constants/AppUrlConstants';
import VoyageSupportingDocsUpload from '../VoyageSupportingDocsUpload';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

const renderPage = () => {
  render(
    <MemoryRouter initialEntries={[`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}/123`]}>
      <Routes>
        <Route path={`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}/:declarationId`} element={<VoyageSupportingDocsUpload />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('Voyage supporting docs page', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page with declarationId in url params', async () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Upload supporting documents' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload files' }).outerHTML).toEqual('<button class="govuk-button govuk-button--secondary" type="button">Upload files</button>');
    expect(screen.getByRole('button', { name: 'Save and continue' }).outerHTML).toEqual('<button class="govuk-button govuk-button--primary" type="button">Save and continue</button>');
  });

  it('should render an error without declarationId', async () => {
    render(
      <MemoryRouter initialEntries={[`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}`]}>
        <Routes>
          <Route path={`${VOYAGE_SUPPORTING_DOCS_UPLOAD_URL}`} element={<VoyageSupportingDocsUpload />} />
        </Routes>
      </MemoryRouter>,
    );
    await screen.findByRole('heading', { name: 'Something has gone wrong' });
    expect(screen.getByRole('heading', { name: 'Something has gone wrong' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Click here to continue' }).outerHTML).toEqual(`<a href="${YOUR_VOYAGES_URL}">Click here to continue</a>`);
  });

  it('should go to task details on save and continue click', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole('heading', { name: 'Upload supporting documents' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(`${VOYAGE_TASK_LIST_URL}/123`);
  });
});

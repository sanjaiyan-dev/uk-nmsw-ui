import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VOYAGE_PASSENGER_UPLOAD_URL, VOYAGE_TASK_LIST_URL } from '../../../constants/AppUrlConstants';
import VoyagePassengers from '../VoyagePassengers';

const mockUseLocationState = { state: {} };
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedUseNavigate,
  useLocation: jest.fn().mockImplementation(() => mockUseLocationState),
}));

describe('File upload success confirmation page', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    mockUseLocationState.state = {};
  });

  it('should render the page', async () => {
    render(<VoyagePassengers />);
    expect(screen.getByRole('heading', { name: 'Is the ship carrying any passengers?' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Yes' }).outerHTML).toEqual('<input class="govuk-radios__input" id="passengers-input[0]" name="passengers" type="radio" value="passengersYes">');
    expect(screen.getByRole('radio', { name: 'No' }).outerHTML).toEqual('<input class="govuk-radios__input" id="passengers-input[1]" name="passengers" type="radio" value="passengersNo">');
    expect(screen.getByRole('button', { name: 'Save and continue' }).outerHTML).toEqual('<button type="button" class="govuk-button" data-module="govuk-button" data-testid="submit-button">Save and continue</button>');
  });

  it('should go to the upload passenger details page if user selects YES', async () => {
    const user = userEvent.setup();
    render(<VoyagePassengers />);
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Yes' }));
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_PASSENGER_UPLOAD_URL);
  });

  it('should go to the task details page if user selects NO', async () => {
    const user = userEvent.setup();
    render(<VoyagePassengers />);
    expect(screen.getByRole('button', { name: 'Save and continue' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'No' }));
    await user.click(screen.getByRole('button', { name: 'Save and continue' }));
    expect(mockedUseNavigate).toHaveBeenCalledWith(VOYAGE_TASK_LIST_URL);
  });
});

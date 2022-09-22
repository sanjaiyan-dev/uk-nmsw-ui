/* eslint-disable no-useless-escape */
import { render, screen, waitFor } from '@testing-library/react';
import { SERVICE_NAME } from '../../constants/AppConstants';
import Landing from './Landing';

describe('Landing page tests', () => {

  it('should render the page with the service name as a H1', async () => {
    await waitFor(() => { render(<Landing />); });
    expect(screen.getByText('National Maritime Single Window')).toBeInTheDocument();
  });

  it('should render the service name text from the constants file', async () => {
    await waitFor(() => { render(<Landing />); });
    expect(screen.getByText(SERVICE_NAME)).toBeInTheDocument();
  });

  it('should tell the user what the service is used for', async () => {
    await waitFor(() => { render(<Landing />); });
    expect(screen.getByText('Use this service to:')).toBeInTheDocument();
  });

  it('should should have a start now button that includes the > and links to the sign-in page', async () => {
    await waitFor(() => { render(<Landing />); });
    const checkStartNowButton = screen.getByRole('button');
    expect(checkStartNowButton).toBeInTheDocument();
    expect(checkStartNowButton.outerHTML).toEqual('<a href=\"/sign-in\" role=\"button\" draggable=\"false\" class=\"govuk-button govuk-button--start\" data-module=\"govuk-button\">Start now<svg class=\"govuk-button__start-icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"17.5\" height=\"19\" viewBox=\"0 0 33 40\" aria-hidden=\"true\" focusable=\"false\"><path fill=\"currentColor" d="M0 0h13l20 20-20 20H0l20-20z\"></path></svg></a>');
  });

});

const Submitted = {
  declaration: {
    nameOfShip: 'Test ship name',
    status: 'Submitted',
    imoNumber: '1234567',
    callSign: 'NA',
    signatory: 'Captain Name',
    flagState: 'GBR',
    departureFromUk: false,
    departurePortUnlocode: 'AUPOR',
    departureDate: '2023-02-12',
    departureTime: '09:23:00',
    arrivalPortUnlocode: 'GBDOV',
    arrivalDate: '2023-02-15',
    arrivalTime: '14:00:00',
    previousPortUnlocode: 'AUPOR',
    nextPortUnlocode: 'NLRTM',
    cargo: 'No cargo',
    passengers: true,
    creationDate: '2023-02-09',
    submissionDate: '2023-02-10',
  },
  FAL1: [
    {
      filename: 'General Declaration (FAL 1)',
      id: 'FAL1',
      size: '118385',
      url: 'https://fal1-report-link.com',
    },
  ],
  FAL5: [
    {
      filename: 'Crew details FAL 5.xlsx',
      id: 'FAL5',
      size: '118385',
      url: 'https://fal5-report-link.com',
    },
  ],
  FAL6: [
    {
      filename: 'Passenger details including supernumeraries (FAL 6).xlsx',
      id: 'FAL6',
      size: '118385',
      url: 'https://fal6-report-link.com',
    },
  ],
  supporting: [
    {
      id: '123abc',
      filename: 'MyFirstDocument.xlsx',
      size: '90610',
      url: 'https://first-doc-link.com',
    },
    {
      id: '123def',
      filename: 'My-second-doc.xlsx',
      size: '90610',
      url: 'https://second-doc-link.com',
    },
  ],
};

export default Submitted;

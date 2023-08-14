const Fal1Fal6Supporting = {
  declaration: {
    nameOfShip: 'Test ship name',
    status: 'Draft',
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
    creationDate: '2023-02-10',
    submissionDate: null,
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
  FAL6: [],
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

export default Fal1Fal6Supporting;

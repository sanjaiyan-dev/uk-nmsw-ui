import { countries } from '../../constants/CountryData';

const formatCountry = (code) => {
  const result = countries.find((country) => country.alphaCode === code);
  const countryName = result?.countryName ? result.countryName : code;
  return countryName;
};

export default formatCountry;

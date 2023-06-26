/* until we have a unlocode lookup API we need to format it here */
const formatUnlocode = (code) => {
  const formattedCode = `${code.substr(0, 2)} ${code.substr(2)}`;
  return formattedCode;
};

export default formatUnlocode;

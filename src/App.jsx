const App = () => {
  return (
    <>
      <h1 className="govuk-heading-l">Basic setup</h1>
      <p className="govuk-body">With a test paragraph so we can prove GovUK frontend style are working</p>
      <button className="govuk-button" data-module="govuk-button">
        And a test button
      </button>
      <br />
      <span>and a span where we forget to add the class, but should default to GDS font</span>
    </>
  );
};

export default App;

import Footer from './layout/Footer';
import Header from './layout/Header';

const App = () => {
  return (
    <>
      <Header />
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing" id="content" role="main">
          <h1 className="govuk-heading-l">Basic setup</h1>
          <p className="govuk-body">With a test paragraph so we can prove GovUK frontend style are working</p>
          <button className="govuk-button" data-module="govuk-button">
            And a test button
          </button>
          <br />
          <span>and a span where we forget to add the class, but should default to GDS font</span>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default App;

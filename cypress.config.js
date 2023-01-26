const {defineConfig} = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const preprocessor = require('@badeball/cypress-cucumber-preprocessor');
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild');

async function setupNodeEvents(on, config) {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await preprocessor.addCucumberPreprocessorPlugin(on, config);

  on(
      'file:preprocessor',
      createBundler({
        plugins: [createEsbuildPlugin.default(config)],
      }),
  );
  on(
      'task',
      {
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message);

          return null;
        },
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message);

          return null;
        },
      },
  );
  config.env.MAIL_API_KEY = process.env.DEV_NMSW_MAILSLURP_API_KEY;
  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

module.exports = defineConfig({
  e2e: {
    video: false,
    specPattern: '**/*.feature',
    step_definitions: 'cypress/support/step_definitions/',
    watchForFileChanges: false,
    setupNodeEvents,
  }
});

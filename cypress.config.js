const {defineConfig} = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const preprocessor = require('@badeball/cypress-cucumber-preprocessor');
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const {downloadFile} = require('cypress-downloadfile/lib/addPlugin')
const fs = require('fs');

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
        //validate file
        filePresent(filePath) {
          if (fs.existsSync(`${process.env.PWD}/${filePath}`)) {
            return true
          }
          return false
        },
  downloadFile
      }
  );
  config.env.MAIL_API_KEY = process.env.CYPRESS_MAILSLURP_API_KEY;
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

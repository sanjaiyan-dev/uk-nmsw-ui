// eslint-disable-next-line import/no-extraneous-dependencies
const report = require('multiple-cucumber-html-reporter');

report.generate({
  theme: 'bootstrap',
  jsonDir: 'reports',
  reportPath: 'reports/multiple-html-reports',
  metadata: {
    browser: {
      name: 'chrome',
      version: '60',
    },
    device: 'Local test machine',
    platform: {
      name: 'Windows',
    },
  },
});

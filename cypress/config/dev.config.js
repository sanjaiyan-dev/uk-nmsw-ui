const { defineConfig } = require('cypress')
const defaultConfig = require('../../cypress.config')

module.exports = defineConfig({
      ...defaultConfig,

      env: {
        "baseUrl": "https://nmsw-ui.dev.nmsw.homeoffice.gov.uk/",
        "envName": "development",
        "api_server": "https://nmsw-api.dev.nmsw.homeoffice.gov.uk//v1"
      }
    }
)

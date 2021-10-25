const getScreenParams = require("./config/geScreenParams");

const DESKTOP = false;
const HEADLESS = true;
const JSON = true;

module.exports = {
    extends: "lighthouse:default",
    settings: {
      ...getScreenParams(DESKTOP),
        // throttling: {
        //   cpuSlowdownMultiplier: 1,
        // },
        onlyCategories: ['performance'],
        // onlyAudits: [
          // 'largest-contentful-paint',
        //   'cumulative-layout-shift',
        //   'interactive'
        // ],

    },
    headless: HEADLESS,
    json: JSON,
    device: DESKTOP ? 'desktop': 'mobile',
    runs: 15
  };
  

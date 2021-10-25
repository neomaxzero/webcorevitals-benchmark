

const getScreenParams = (desktop = false) => {
    let EMULATION_METRICS, USERAGENT;

    if (desktop) {
        EMULATION_METRICS = {
            mobile: false,
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
            disabled: false,
           };
    
           USERAGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4590.2 Safari/537.36 Chrome-Lighthouse';
    }
  return {
    formFactor: desktop ? "desktop" : "mobile",
    screenEmulation: EMULATION_METRICS,
    emulatedUserAgent: USERAGENT,
  };
};

module.exports = getScreenParams;

const fs = require('fs');
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

const config = require("./config.js");


const logRun = require("./helper/logRun.js");
const percentile = require('./helper/percentile.js');

const PAGE = "";

const statsOutput = {
  scores: [],
}

const checkPage = async () => {
  console.log("Checking...");
  const chrome = await chromeLauncher.launch({ chromeFlags: [config.headless ? "--headless": ''] });
  const options = {
    // logLevel: "info",
    output: "json",
    port: chrome.port,
  };

  const runnerResult = await lighthouse(PAGE, options, config);

  

  if (config.json) {
    const report = runnerResult.report;
    fs.writeFileSync(`lhreport-${config.device}-${new Date().toString()}.json`, report);
  
  } else  {
    const lcp = runnerResult.lhr.audits["largest-contentful-paint"].numericValue;
    const cls = runnerResult.lhr.audits["cumulative-layout-shift"].score;
    const interactive = runnerResult.lhr.audits["first-interactive"].numericValue;
    logRun(`${lcp}, ${cls}, ${interactive}`);

  }

  const performanceScore = runnerResult.lhr.categories.performance.score * 100

  console.log(
    "Performance score was",
    performanceScore
  );


  statsOutput.scores.push(performanceScore) 

  await chrome.kill();
};

(async () => {
  for (let index = 0; index < config.runs; index++) {
    await checkPage();
  }

  console.log('---------------Batch run stats:-------------');
  console.log(`P75 score: ${percentile(statsOutput.scores, 75)}`);

})();



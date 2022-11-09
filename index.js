const fs = require("fs");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

const config = require("./config.js");

const logRun = require("./helper/logRun.js");
const percentile = require("./helper/percentile.js");

const PAGE = "https://lvh.me:3000";

const statsOutput = {
  scores: {},
};

const checkPage = async () => {
  console.log("Checking...");
  const chrome = await chromeLauncher.launch({
    chromeFlags: [config.headless ? "--headless" : ""],
  });
  const options = {
    // logLevel: "info",
    output: "json",
    port: chrome.port,
  };

  const runnerResult = await lighthouse(PAGE, options, config);

  if (config.json) {
    const report = runnerResult.report;
    fs.writeFileSync(
      `lhreport-${config.device}-${new Date().toString()}.json`,
      report
    );
  } else {
    // console.log(runnerResult)
    const lcp =
      runnerResult.lhr.audits["largest-contentful-paint"].numericValue;
    const cls = runnerResult.lhr.audits["cumulative-layout-shift"].score;
    const fcp = runnerResult.lhr.audits["first-contentful-paint"].numericValue;
    const totalBlockingTime =
      runnerResult.lhr.audits["total-blocking-time"].numericValue;
    const tti = runnerResult.lhr.audits["interactive"].numericValue;
    const bootupTime = runnerResult.lhr.audits["bootup-time"].numericValue;

    logRun(
      `${lcp}, ${cls}, ${fcp}, ${totalBlockingTime}, ${tti}, ${bootupTime}`
    );

    // console.log(statsOutput.scores);
    statsOutput.scores = {
      lcp: statsOutput.scores["lcp"]
        ? [...statsOutput.scores["lcp"], lcp]
        : [lcp],
      cls: statsOutput.scores["cls"]
        ? [...statsOutput.scores["cls"], cls]
        : [cls],
      fcp: statsOutput.scores["fcp"]
        ? [...statsOutput.scores["fcp"], fcp]
        : [fcp],
      totalBlockingTime: statsOutput.scores["totalBlockingTime"]
        ? [...statsOutput.scores["totalBlockingTime"], totalBlockingTime]
        : [totalBlockingTime],
      tti: statsOutput.scores["tti"]
        ? [...statsOutput.scores["tti"], tti]
        : [tti],
      bootupTime: statsOutput.scores["bootupTime"]
        ? [...statsOutput.scores["bootupTime"], bootupTime]
        : [bootupTime],
    };
  }

  // const performanceScore = runnerResult.lhr.categories.performance.score * 100

  // console.log(
  //   "Performance score was",
  //   performanceScore
  // );

  await chrome.kill();
};

(async () => {
  for (let index = 0; index < config.runs; index++) {
    await checkPage();
  }

  console.log("---------------Batch run stats:-------------");
  // console.log(statsOutput.scores);

  for (const [metric, valuesMetric] of Object.entries(statsOutput.scores)) {
    console.log(`${metric} - P75: ${percentile(valuesMetric, 0.75)}`);
  }
})();

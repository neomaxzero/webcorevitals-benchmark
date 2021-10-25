const fs = require("fs");
const os = require("os");

const FILE = "results/logs.csv";

function logRun(text, file = FILE) {
  fs.open(file, "a", 666, function (e, id) {
    fs.write(id, text + os.EOL, null, "utf8", function () {
      fs.close(id, function () {
        console.log("file is updated");
      });
    });
  });
}

module.exports = logRun;

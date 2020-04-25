'use strict';

const PARSE_WRITE_DIR_NAME = 'parse';

const validateCommandLineArgs = () => {
    // remove node and command from args list
  var cliArgs = process.argv.slice(2);

  // quit if no directory name was supplied as arg
  if (cliArgs.length !== 1) {
    console.error('Missing command line argument.');
    process.exit();
  }
}


module.exports = {
  PARSE_WRITE_DIR_NAME,

  validateCommandLineArgs,
};

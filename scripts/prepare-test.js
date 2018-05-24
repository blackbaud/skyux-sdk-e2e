const fs = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');

const dest = path.resolve(process.cwd(), 'node_modules', '@blackbaud', 'skyux-lib-e2e');

rimraf.sync(dest);

fs.ensureDirSync(dest);

fs.copySync(
  path.resolve(process.cwd(), 'dist'),
  dest
);

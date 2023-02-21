const fs = require('fs');
const fse = require('fs-extra');

let PROJECT_PATH = process.argv[2];
let SCHELETON_PATH = "./_scheleton";

console.log('[CREATING] ', PROJECT_PATH);
if( fs.existsSync(PROJECT_PATH) ){
    console.log(`[FATAL ERROR] Path "${PROJECT_PATH}" already exists` );
    process.exit(1);
} else {
    fse.copySync(SCHELETON_PATH, PROJECT_PATH);
}



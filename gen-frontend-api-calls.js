const fs = require('fs');
const ApiCall = require("./Frontend/Builder/ApiCall");

let TARGET_FOLDER = process.argv[2];
let CONFIG_PATH = process.argv[3];
console.log('[BULDING INSIDE] ', TARGET_FOLDER);
if( !fs.existsSync(TARGET_FOLDER) ){
    console.log(`[FATAL ERROR] Path "${TARGET_FOLDER}" does NOT exists. intialize it before` );
    process.exit(1);
}
if( !fs.existsSync(CONFIG_PATH) ){
    console.log(`[FATAL ERROR] Config Path "${CONFIG_PATH}" does NOT exists. create it` );
    process.exit(1);
}

const config = require( CONFIG_PATH );
ApiCall.buildFromConfig( TARGET_FOLDER, config );


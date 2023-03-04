const fs = require('fs');
const Builder = require('./Backend/Builder');
let MODELS_PATH = process.argv[2];

if( !fs.existsSync(MODELS_PATH) ){
    console.log(`[FATAL ERROR] Cannot find models at folder "${MODELS_PATH}" ` );
    process.exit(1);
} else {
    Builder.buildJsonSchemaFromMongoose(MODELS_PATH);
}



const Builder = require("./Frontend/Builder");

const fs = require('fs');
const fse = require('fs-extra');
var path = require('path');
const Utils = require("./Utils/Utils");


let PROJECT_PATH = process.argv[2];
let CONFIG_FILE = process.argv[3];
let SCHELETON_PATH = "./_scheleton";

console.log('[BULDING INSIDE] ', PROJECT_PATH);
if( !fs.existsSync(PROJECT_PATH) ){
    console.log(`[FATAL ERROR] Path "${PROJECT_PATH}" does NOT exists. intialize it before` );
    process.exit(1);
}
if( !fs.existsSync(CONFIG_FILE) ){
    console.log(`[FATAL ERROR] Config Path "${CONFIG_FILE}" does NOT exists. create it` );
    process.exit(1);
}

// clone over main components
fse.copySync( 
    path.join( SCHELETON_PATH, Builder.REAL_PATH_COMPONENTS_DIR), 
    path.join( PROJECT_PATH, Builder.REAL_PATH_COMPONENTS_DIR)
);

let navLinks = {};
let components = {};
let pagesEnum = {};
let pagesCusotmizations = {};

Builder.setProjectPath( PROJECT_PATH );



let filePath = CONFIG_FILE;
console.log('[BUILDING]', filePath);
const routes = require( filePath );
for( let route in routes ){
    let { component, customizations } = Builder.buildReactComponent( route, routes[route] );
    components[routes[route].path] = component;
    navLinks[route] = routes[route].path;

    let IDENTIFIER = Builder.makeIdentifier(routes[route].path);
    pagesCusotmizations[IDENTIFIER] = customizations;
}




for ( let componentPath in components ){
    let IDENTIFIER = Builder.makeIdentifier(componentPath);
    pagesEnum[ IDENTIFIER ] = componentPath;

    let component = Builder.addNavbar( components[componentPath], navLinks );
    let customizations = pagesCusotmizations[IDENTIFIER];
    Builder.writeComponent(componentPath, component);
    Builder.writePage(componentPath, IDENTIFIER, customizations);
}

Builder.writePagesEnum(pagesEnum);




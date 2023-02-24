const Builder = require("./Builder");

const fs = require('fs');
const fse = require('fs-extra');
var path = require('path');
const Utils = require("./Utils/Utils");


let PROJECT_PATH = process.argv[2];
let ROUTES_PATH = "./routes";
let SCHELETON_PATH = "./_scheleton";

console.log('[BULDING INSIDE] ', PROJECT_PATH);
if( !fs.existsSync(PROJECT_PATH) ){
    console.log(`[FATAL ERROR] Path "${PROJECT_PATH}" does NOT exists` );
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
for( let file of Utils.dirWalk(ROUTES_PATH) ){

    let filePath = './' + file;
    console.log('[BUILDING]', filePath, file);
    const routes = require( filePath );

    for( let route in routes ){
        let { component, customizations } = Builder.buildReactComponent( route, routes[route] );
        components[routes[route].path] = component;
        navLinks[route] = routes[route].path;

        let IDENTIFIER = Builder.makeIdentifier(routes[route].path);
        pagesCusotmizations[IDENTIFIER] = customizations;
    }

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




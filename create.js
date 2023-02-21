const Builder = require("./Builder");

const fs = require('fs');
const fse = require('fs-extra');
var path = require('path');
const Utils = require("./Utils/Utils");


let PROJECT_PATH = process.argv[2];
let ROUTES_PATH = "./routes";


console.log('[BULDING INSIDE] ', PROJECT_PATH);
if( !fs.existsSync(PROJECT_PATH) ){
    console.log(`[FATAL ERROR] Path "${PROJECT_PATH}" does NOT exists` );
    process.exit(1);
}

let navLinks = {};
let components = {};

Builder.setProjectPath( PROJECT_PATH );
for( let file of Utils.dirWalk(ROUTES_PATH) ){

    let filePath = './' + file;
    console.log('[BUILDING]', filePath, file);
    const routes = require( filePath );

    for( let route in routes ){
        let component = Builder.buildReactComponent( route, routes[route] );
        components[routes[route].path] = component;
        navLinks[route] = routes[route].path;
    }

}

for ( let componentPath in components ){
    let component = Builder.addNavbar( components[componentPath], navLinks );
    Builder.writeComponent(componentPath, component);
    Builder.writePage(componentPath);
}


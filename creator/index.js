const Builder = require("./Builder");

const fs = require('fs');
const fse = require('fs-extra');
var path = require('path');


let projectName = process.argv[2];
let PROJECT_PATH = "../" + projectName;
let SCHELETON_PATH = "../app";
let ROUTES_PATH = "./routes";

function walk(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else { 
            /* Is a file */
            results.push(file);
        }
    });
    return results;
}




console.log('[CREATING] ' + projectName + ' - TO FOLDER: ', PROJECT_PATH);
if( fs.existsSync(PROJECT_PATH) ){
    console.log(`[FATAL ERROR] Folder named "${projectName}" already exists` );
    process.exit(1);
} else {
    fse.copySync(SCHELETON_PATH, PROJECT_PATH);
}


let navLinks = {};
let components = {};

Builder.setProjectPath( PROJECT_PATH );
for( let file of walk(ROUTES_PATH) ){

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


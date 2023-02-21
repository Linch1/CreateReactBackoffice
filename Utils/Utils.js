const fs = require('fs');
const path = require('path');

module.exports = new class {
    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    dirWalk(dir) {
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
    makeDirRecursive( root, folders ){
        let routeDir = root;
        for( let folder of folders ){
            routeDir = path.join( routeDir, folder )
            if( !fs.existsSync( routeDir ) ){
                fs.mkdirSync( routeDir )
            }
        }
    }
}()
const prettier = require("prettier");
const fs = require("fs");
const path = require('path');

function createProperty( obj, propKeys ){ // from a key path as string ('obj.prop1.prop2.prop3') it creates the property in te passed obj
    let keys = propKeys.split('.');
    let nested = obj;
    for( let key of keys ){
        if(!nested[key]) nested[key] = {};
        nested = nested[key]
    }
}
function schemaKeysToObj( keys ){ // from a mongoose model it creates a json.
    let obj = {};
    for( let key of keys ){
        if( key.startsWith('_') ) continue;
        createProperty(obj, key);
    }
    return obj;
}
function getInstance( info ){
    let instance = info.instance;
    if( instance == 'ObjectID') instance = 'String';
    return instance.toLowerCase();
}
function getPathSchema( toPopulate, info ){
    toPopulate.type = getInstance( info ) ;
    if( toPopulate.type == 'array') {
        if( info.caster.schema ){ // is an array of objects
            toPopulate.contains = 'object';
            toPopulate.paths = {};
            for( let pathKey in info.caster.schema.paths ){ // populate the info about each field in the object
                toPopulate.paths[pathKey] = {};
                getPathSchema( toPopulate.paths[pathKey], info.caster.schema.paths[pathKey] );
            }
        } else { // is a normal array
            toPopulate.contains = getInstance( info.caster );
        }
    }
}
function traverseSchema( toPopulate, keysPath, schemaReference ) { // remove from toEquilize all the keys that are not present in source
    for( let key in toPopulate ){
        let path = keysPath.length == 0 ? keysPath + key : keysPath + '.' + key; // get current path
        if( typeof(toPopulate[key]) == 'object' && Object.keys(toPopulate[key]).length ){
            traverseSchema( toPopulate[key], path, schemaReference );
            continue;
        }
        // else get the instance type of the property at the calculated path
        let keyInfo = schemaReference[path];
        toPopulate[key] = {};
        getPathSchema( toPopulate[key], keyInfo );
        
    }
}
function modelToSchema( model ){
    let paths = model.schema.paths;
    let schema = schemaKeysToObj(Object.keys(paths));
    traverseSchema( schema, '', paths );
    return schema;
}

module.exports = new class{
    buildJsonSchemaFromMongoose( modelsPath ){

        const modelFiles = fs.readdirSync( modelsPath );
        const schemasPath = path.join(modelsPath, 'schemas');
        if(!fs.existsSync(schemasPath)) fs.mkdirSync( schemasPath );

        console.log('[SCHEMAS GENERATION] Started');

        modelFiles.forEach((fn) => {
            let splitted = fn.split(".");
            if( splitted.length == 1) return;
            const name = splitted[0];
            const model = require( path.join(modelsPath, fn) );
            const schema = modelToSchema(model);
            const schemaFile = prettier.format(
              `
            /**
             * Note: this is a generated file
             */
               
            const ${name} = ${JSON.stringify(schema)}
            
            module.exports = ${name}
            `,
              { parser: "babel" }
            );

            let schemaPath = path.join(schemasPath, fn);
            fs.writeFileSync( schemaPath, schemaFile);

            console.log('[SCHEMA GENERATION]  W: ', schemaPath)
        });

        console.log('[SCHEMAS GENERATION] Complete');
          
    }
}
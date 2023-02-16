module.exports = new class {
    constructor(){}

    getRouteParams( fx ){
        let fxCode = fx.toString();
        let params = [...fxCode.matchAll( /params\.require\('(.*)'\)/gm )];
        let paramNames = [];
        for( let param of params ){
            let paramName = param[1];
            paramNames.push( paramName );
        }
        return paramNames;

    }
}();
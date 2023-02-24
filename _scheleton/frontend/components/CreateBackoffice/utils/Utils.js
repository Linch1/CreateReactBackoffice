export default new class {
    getObjectKey( obj, keysPath ){
        if(typeof keysPath == 'string') keysPath = keysPath.split(".");
        if( !obj ) return false;
        if( !keysPath.length ) return false ;
        let nested = null;
        for( let prop of keysPath ){
            if( !nested ) nested = obj; // initialization
            if( !nested[prop] ) return false;
            nested = nested[prop];
        }
        return nested;
    }
    createProperty( obj, keysPath, val ){
        if(typeof keysPath == 'string') keysPath = keysPath.split('.');
        let nested = obj;
        for( let i = 0; i < keysPath.length; i++ ){
            let key = keysPath[i];
            if(!nested[key]) nested[key] = {};
            if( i == keysPath.length - 1 ){ nested[key] = val }
            nested = nested[key]
        }
    }
    isAsync( fx ){
        const AsyncFunction = (async () => {}).constructor;
        return fx instanceof AsyncFunction === true
    }

    
}
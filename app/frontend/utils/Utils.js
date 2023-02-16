export default new class {
    getObjectKey( obj, keysPath ){

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
}
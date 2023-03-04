import Utils from "./utils/Utils";

export default new class Customizer {
    constructor() {
        this.components = {};
        this.callbacks = {};
    }
    addFunction( page, customizationType, cb ){
        if(!this.callbacks[page]) this.callbacks[page] = {};
        this.callbacks[page][customizationType] = cb;
    }
    getFunction( page, customizationType ){
        if(!this.callbacks[page]) return;
        return this.callbacks[page][customizationType];
    }
    removeFunction( page, customizationType ){
        if(!this.callbacks[page]) return;
        delete this.callbacks[page][customizationType];
    }

    addComponent( page, customizationType, component ){
        if(!this.components[page]) this.components[page] = {};
        this.components[page][customizationType] = component;
    }
    getComponent(page, customizationType) {
        if(!this.components[page]) return;
        return this.components[page][customizationType];
    }
    removeComponent( page, customizationType ){
        if(!this.components[page]) return;
        delete this.components[page][customizationType];
    }


    async callCustomizedFunction(pageIdentifier, type, args){
        let fx = this.getFunction(pageIdentifier, type);
        if(!fx) return true;
        let cbRes;
        if( Utils.isAsync(fx) ) cbRes = await fx( ...args );
        else cbRes = fx( ...args );
        return cbRes;
    }

}

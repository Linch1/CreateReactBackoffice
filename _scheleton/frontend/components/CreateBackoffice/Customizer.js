export default new class Customizer {
    constructor() {
        this.components = {};
    }
    add( page, type, part, component ){
        if(!this.components[page]) this.components[page] = {};
        if(!this.components[page][type]) this.components[page][type] = {};
        this.components[page][type][part] = component;
    }
    getComponent(page, type, part) {
        if(!this.components[page]) return;
        if(!this.components[page][type]) return;
        return this.components[page][type][part];
    }

}

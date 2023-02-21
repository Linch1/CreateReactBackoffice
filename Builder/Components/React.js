const ETypes = require('../../Enum/types.js');
const EAxiosRequestsType = require('../../Enum/axiosRequestTypes.js');
const EPlaceholders = require('../../Enum/placeholders.js');
const Utils = require('../../Utils/Utils.js');

module.exports = new class{

    

    _paramTypeToComponent = {
        [ETypes.STRING]: {
            component:`<InputText name={"${EPlaceholders.name}"} required={${EPlaceholders.required}} />`,
            import: {
                component: 'InputText',
            },
            build: this._getInputTextComponent.bind(this)
        },
        [ETypes.NUMBER]: {
            component: `<InputNumber name={"${EPlaceholders.name}"} required={${EPlaceholders.required}} />`,
            import: {
                component: 'InputNumber',
            },
            build: this._getInputNumberComponent.bind(this)
        },
        [ETypes.SELECT]: {
            component: `<Select name={"${EPlaceholders.name}"} required={${EPlaceholders.required}} selectValues={${EPlaceholders.values}} />`,
            import: {
                component: 'Select',
            },
            build: this._getSelectComponent.bind(this)
        },
        [ETypes.SELECT_SEARCH]: {
            component: `<SelectSearch axiosReqType={"${EPlaceholders.axiosReqType}"} responseKeys={"${EPlaceholders.responseKeys}"} url={"${EPlaceholders.url}"}  displayKeys={"${EPlaceholders.displayKeys}"} valueKeys={"${EPlaceholders.valueKeys}"} name={"${EPlaceholders.name}"} /> `,
            import: {
                component: 'SelectSearch',
            },
            build: this._getSelectSearchComponent.bind(this)
        },
        [ETypes.SUBMIT_BUTTON]: {
            component: `<SubmitButton />`,
            import: {
                component: 'SubmitButton',
            },
            build: this._getSubmitButtonComponent.bind(this)
        },
        [ETypes.TEXTAREA]: {
            component: `<InputTextArea name={"${EPlaceholders.name}"} required={${EPlaceholders.required}} /> `,
            import: {
                component: 'InputTextArea',
            },
            build: this._getInputTextAreaComponent.bind(this)
        },
        [ETypes.FILE]: {
            component: `<InputFile name={"${EPlaceholders.name}"} required={${EPlaceholders.required}} /> `,
            import: {
                component: 'InputFile',
            },
            build: this._getInputFileComponent.bind(this)
        },
        [ETypes.CHECKBOX]:{
            component: `<InputCheckbox name={"${EPlaceholders.name}"} /> `,
            import: {
                component: 'InputCheckbox',
            },
            build: this._getInputCheckboxComponent.bind(this)
        },
        [ETypes.SELECT_ARRAY]:{
            component: `<SelectArray name={"${EPlaceholders.name}"} selectValues={${EPlaceholders.values}} /> `,
            import: {
                component: 'SelectArray',
            },
            build: this._getSelectArrayComponent.bind(this)
        }
    }
    getComponent( paramName, paramInfos ){
        let componentType = paramInfos.type;
        let componentOptions = {...paramInfos, name: paramName};
        return this._paramTypeToComponent[componentType].build(componentOptions);
    }
    
    _getInputTextComponent( options ){
        let obj = this._paramTypeToComponent[ETypes.STRING];
        return {
            component: obj.component.replace( EPlaceholders.name, options.name ).replace( EPlaceholders.required, options.required || false  ),
            import: obj.import
        }
    }
    _getInputNumberComponent( options ){
        let obj = this._paramTypeToComponent[ETypes.NUMBER];
        return {
            component: obj.component.replace( EPlaceholders.name, options.name ).replace( EPlaceholders.required, options.required || false  ),
            import: obj.import
        }
    }
    _getInputTextAreaComponent( options ){
        let obj = this._paramTypeToComponent[ETypes.TEXTAREA];
        return {
            component: obj.component.replace( EPlaceholders.name, options.name ).replace( EPlaceholders.required, options.required || false  ),
            import: obj.import
        }
    }
    _getInputFileComponent( options ){
        let obj = this._paramTypeToComponent[ETypes.FILE];
        return {
            component: obj.component.replace( EPlaceholders.name, options.name ).replace( EPlaceholders.required, options.required || false  ),
            import: obj.import
        }
    }
    _getInputCheckboxComponent( options ){
        let obj = this._paramTypeToComponent[ETypes.CHECKBOX];
        return {
            component: obj.component.replace( EPlaceholders.name, options.name ),
            import: obj.import
        }
    }
    _getSelectArrayComponent( options ){
        let obj = this._paramTypeToComponent[ETypes.SELECT_ARRAY];
        return {
            component: obj.component
            .replace( EPlaceholders.name, options.name )
            .replace( EPlaceholders.values, JSON.stringify(options.values) ),
            import: obj.import
        }
    }
    _getSelectSearchComponent( options ){
        let obj = this._paramTypeToComponent[ETypes.SELECT_SEARCH];
        return {
            component: obj.component
            .replace( EPlaceholders.name, options.name )
            .replace( EPlaceholders.url, options.url)
            .replace( EPlaceholders.valueKeys, options.valueKeys)
            .replace( EPlaceholders.displayKeys, options.displayKeys)
            .replace( EPlaceholders.responseKeys, options.responseKeys)
            .replace( EPlaceholders.axiosReqType, options.axiosReqType),
            import: obj.import
        }
    }
    _getSelectComponent( options ){
        let obj = this._paramTypeToComponent[ETypes.SELECT];
        return {
            component: obj.component
            .replace( EPlaceholders.name, options.name )
            .replace( EPlaceholders.required, options.required || false )
            .replace( EPlaceholders.values, JSON.stringify(options.values) ),
            import: obj.import
        }
    }
    _getSubmitButtonComponent(){
        let obj = this._paramTypeToComponent[ETypes.SUBMIT_BUTTON];
        return {
            component: obj.component,
            import: obj.import
        }
    }


    declareUseStateVar( name, intialVal ){
        return `let [${name}, set${Utils.capitalize(name)}] = useState(${ typeof intialVal == 'object' ? JSON.stringify(intialVal) : intialVal})`;
    }
    getUseStateVarSetter( name ){
        return `set${Utils.capitalize(name)}`;
    }
   
   
}();
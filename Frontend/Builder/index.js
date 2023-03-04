const ReactComponents = require('./Components/React');
const path = require('path');
const EAxiosRequestsType = require('../../Enum/axiosRequestTypes');
const ETypes = require('../../Enum/types');
const EPlaceholders = require('../../Enum/placeholders');
const fs = require('fs');
const Utils = require('../../Utils/Utils');
const EC = require('../../Enum/EC');

module.exports = new class{

    REAL_PATH_COMPONENTS_DIR = 'frontend/components/CreateBackoffice';
    OUTPUT_DIR = path.join( this.REAL_PATH_COMPONENTS_DIR, 'Routes');
    REAL_ENUMS_DIR = path.join( this.REAL_PATH_COMPONENTS_DIR, 'enum' );
    PAGES_DIR = 'pages';


    COMPONENTS_DIR = "@/Components/CreateBackoffice/";
    ROUTES_COMPONENTS_DIR = path.join( this.COMPONENTS_DIR, 'Routes' );
    FORM_COMPONENTS_DIR = path.join( this.COMPONENTS_DIR, 'Form' );
    LIST_COMPONENTS_DIR = path.join( this.COMPONENTS_DIR, 'List' );
    NAVBAR_COMPONENTS_DIR = path.join( this.COMPONENTS_DIR, 'Navbar' );
    ALIAS_ENUMS_DIR = path.join( this.COMPONENTS_DIR, 'enum' );

    PAGE_IDENTIFIERS_ENUM_FILE_NAME = 'EPI.js';
    PAGE_CUSTOMIZATIONS_ENUM_FILE_NAME = 'EC.js';
    
    PROJECT_PATH = null;

    setProjectPath( path ){
        this.PROJECT_PATH = path;
    }

    resolveFormComponentPath( componentName ){
        return `${path.join(this.FORM_COMPONENTS_DIR, componentName)}`;
    }
    resolveListComponentPath( componentName ){
        return `${path.join(this.LIST_COMPONENTS_DIR, componentName)}`;
    }


    writeComponent( routePath, componentText, force ){

        if( fs.existsSync(routePath) ) {
            return console.log(`[ exists ]`, routePath);
        }

        let routeDir = path.join( this.PROJECT_PATH );
        let folders = [ this.OUTPUT_DIR, ...routePath.split('/')]
        for( let folder of folders ){
            routeDir = path.join( routeDir, folder )
            if( !fs.existsSync( routeDir ) ){
                fs.mkdirSync( routeDir )
            }
        }
        
        fs.writeFileSync(
            path.join( routeDir, 'index.js' ),
            componentText
        )
    }


    makeIdentifier( pagePath ){
        return path.join('PAGE', pagePath).split('/').join('_').toUpperCase();
    }
    writePage( routePath, IdentifierKey, customizations ){

        let splittedRoute = routePath.split('/');

        // creates the page file
        let folders = [ this.PAGES_DIR, ...splittedRoute];
        Utils.makeDirRecursive(this.PROJECT_PATH, folders);

        let componentImport = path.join( this.ROUTES_COMPONENTS_DIR, routePath );
    
        let pagePath = path.join( this.PROJECT_PATH, this.PAGES_DIR, routePath, 'index.js' );

        if( fs.existsSync(pagePath) ) return console.log(`[!][ exists ]`, pagePath); // avoid overwriting page if present

        let declareCustomizations = this._buildCustomizations(customizations);

        fs.writeFileSync(
            pagePath,
            `
import Component from "${componentImport}";

import EPI from "${path.join(this.ALIAS_ENUMS_DIR, this.PAGE_IDENTIFIERS_ENUM_FILE_NAME)}";
import EC from "${path.join(this.ALIAS_ENUMS_DIR, this.PAGE_CUSTOMIZATIONS_ENUM_FILE_NAME)}";
import Customizer from "${path.join(this.COMPONENTS_DIR, 'Customizer.js')}";
const  PAGE_ID = EPI.${IdentifierKey};

${declareCustomizations}

export default function PageComponent() {
    return  <div className="container mx-auto"> <Component IDENTIFIER={PAGE_ID} /> </div>
}
            `
        )
    }

    _buildCustomizations( customizations ){
        let builtCustomizations = [];
        for( let c of customizations.callbacks ){
            builtCustomizations.push(`//Customizer.addFunction(PAGE_ID, ${c}, ()=>{})`)
        }
        for( let c of customizations.components ){
            builtCustomizations.push(`//Customizer.addComponent(PAGE_ID, ${c}, <></>)`)
        }
        return builtCustomizations.join('\n');
    }

    writePagesEnum( content ){
        fs.writeFileSync(
            path.join( this.PROJECT_PATH, this.REAL_ENUMS_DIR, this.PAGE_IDENTIFIERS_ENUM_FILE_NAME),
            `let EPI = ${JSON.stringify(content)};\nexport default EPI; // EnumPagesIdentifiers
            `
        )
    }

    execImports( component, parts, cb ){
        for( let part of parts ){
            if ( part.import ){
                let componentName = part.import.component;
                let importStr = `import ${componentName} from "${cb(componentName)}"`;
                if( component.indexOf(importStr) == -1 ) {
                    component.unshift(importStr);
                }
            }
            component.push(part.component)
        }
    }

    buildReactComponent( routeName, routeInfos ){
        let customizations = { callbacks: [], components: []};
        let component = [ this.getReactCommonImports(), this.getReactComponentStart( routeName ) ];
        if( routeInfos.form ){
            let { form } = this._buildComponentForm( routeName, routeInfos.form.url, routeInfos.form.body, routeInfos.form.hasFile, routeInfos.form.reqType, routeInfos.form.responseKeys, routeInfos.form.bodyAsParams, routeInfos.form.query, customizations);
            this.execImports( component, form, this.resolveFormComponentPath.bind(this) );
            customizations.callbacks.push(EC.FUNCTIONS.FORM.ON_SUBMIT);
        }
        if( routeInfos.list ){
            let list = this._buildComponentList( routeInfos.path, routeInfos.list.url, routeInfos.list.propertiesMapping, routeInfos.list.reqType, routeInfos.list.responseKeys, routeInfos.list.edit, routeInfos.list.delete, customizations );
            this.execImports( component, list, this.resolveListComponentPath.bind(this) );
            customizations.components.push(EC.COMPONENTS.LIST.TABLE_ROW);
        }
        component.push( this.getReactComponentEnd( routeName ) );
        let builtComponent = component.join('\n');
        return {
            component: builtComponent,
            customizations: customizations
        };
    }
    buildNavbar( links ){
        return `<Navbar links={${JSON.stringify(links)}} />`
    }

    addNavbar( component, links ){
        return component.replace( EPlaceholders.NAVBAR, this.buildNavbar(links) )
    }

    getReactCommonImports(){
        return [
            `import { useState, useEffect, useRef } from "react"`, 
            `import CustomToast from "@/Components/CreateBackoffice/General/CustomToast"`,
            `import { ToastContextProvider } from "@/Components/CreateBackoffice/context/ToastContext"`,
            `import Navbar from "${path.join(this.NAVBAR_COMPONENTS_DIR, 'Navbar')}"`
        ].join(";\n");
    }

    getReactComponentStart( componentName ){
        return `
        export default ({IDENTIFIER}) => {
            ${EPlaceholders.BEFORE_RETURN}
            const [formikCtx, setFormikCtx] = useState(null);
            const [overwriteFormInfo, setOverwriteFormInfo] = useState({ formActionUrl: '', formReqType: ''});
            ${EPlaceholders.BEFORE_RETURN}
            return(
                <ToastContextProvider>
                <CustomToast />
                ${EPlaceholders.NAVBAR}
        `;
    }
    getReactComponentEnd( componentName ){
        return '</ToastContextProvider>)\n}';
    }



    _buildComponentForm( formId, url, body, hasFile, reqType, responseKeys, bodyAsParams, queryParams, customizations){
        let formParts = [];
        formParts.push( this._componentFromString(`<h1 className="mt-4">Form ${formId}</h1>`) );
        formParts.push( this._componentFromString(`<Form pageIdentifier={IDENTIFIER} formId="${formId}" overwriteFormInfo={overwriteFormInfo} formResPath="${responseKeys}" formReqType="${reqType}" formActionUrl="${url}" hasFile={${hasFile}} queryActionUrl={${JSON.stringify(queryParams)}} setFormikCtx={setFormikCtx} >`, 'Form' ) );
        
        for( let paramName in body ){
            let paramInfos = body[paramName];
            formParts.push(this._getInputFromParam( paramName, paramInfos ));
        }

        formParts.push( this._getInputFromParam('submitButton', { type: ETypes.SUBMIT_BUTTON }) );
        formParts.push( this._componentFromString('</Form>') );

        return { 
            form: formParts
        };
    }

    _buildComponentList( routePath, url, propertiesMapping, reqType, responseKeys, editInfo, deleteInfo, customizations ){
        let formParts = [];
        formParts.push( this._componentFromString(`<h1 className="mt-4">List</h1>`) );
        formParts.push( this._componentFromString(`<List pageIdentifier={IDENTIFIER} deleteInfo={${JSON.stringify(deleteInfo)}} editInfo={${JSON.stringify(editInfo)}} mapping={${JSON.stringify(propertiesMapping)}} formResPath="${responseKeys}" url="${url}" formReqType="${reqType}" formikCtx={formikCtx} setOverwriteFormInfo={setOverwriteFormInfo} />`, 'List' ) );
        return formParts;
    }

    _getInputFromParam( paramName, paramInfos ){
        return ReactComponents.getComponent( paramName, paramInfos );
    }

    _componentFromString( str, importPath ){
        let comp = { component: str }
        if( importPath ) comp.import = { component: importPath };
        return comp
    }

    _insertBeforeReturn( current, toInsert ){
        let arr = current.split(EPlaceholders.BEFORE_RETURN);
        let lastItem = arr.pop();
        let beforeReturnText = arr.pop();
        beforeReturnText = beforeReturnText + '\n' + toInsert;
        arr.push( beforeReturnText  );
        arr.push( lastItem );
        return arr.join( '\n' + EPlaceholders.BEFORE_RETURN );
    }
}();
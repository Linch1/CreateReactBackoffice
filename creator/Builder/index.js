const ReactComponents = require('./Components/React');
const path = require('path');
const EAxiosRequestsType = require('../Enum/axiosRequestTypes');
const ETypes = require('../Enum/types');
const EPlaceholders = require('../Enum/placeholders');
const fs = require('fs');

module.exports = new class{

    OUTPUT_DIR = 'frontend/components/Routes';
    COMPONENTS_DIR = "@/Components/";
    FORM_COMPONENTS_DIR = "@/Components/Form";
    LIST_COMPONENTS_DIR = "@/Components/List";
    NAVBAR_COMPONENTS_DIR = "@/Components/Navbar";
    PAGES_DIR = 'pages';
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


    writeComponent( routePath, componentText ){
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
    writePage( routePath ){
        let routeDir = path.join( this.PROJECT_PATH );
        let folders = [ this.PAGES_DIR, ...routePath.split('/')]
        for( let folder of folders ){
            routeDir = path.join( routeDir, folder )
            if( !fs.existsSync( routeDir ) ){
                fs.mkdirSync( routeDir )
            }
        }

        let componentImport = path.join( '@/Components/Routes', routePath );
        fs.writeFileSync(
            path.join( routeDir, 'index.js' ),
            `
            import Component from "${componentImport}";
            export default function PageComponent() {
              return  <div className="container mx-auto"> <Component /> </div>
            }`
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
        
        let component = [ this.getReactCommonImports(), this.getReactComponentStart( routeName ) ];
        if( routeInfos.form ){
            let form = this._buildComponentForm( routeName, routeInfos.form.path, routeInfos.form.body, routeInfos.form.hasFile, routeInfos.form.reqType, routeInfos.form.responseKeys, routeInfos.form.bodyAsParams);
            this.execImports( component, form, this.resolveFormComponentPath.bind(this) );
        }
        if( routeInfos.list ){
            let list = this._buildComponentList( routeInfos.list.url, routeInfos.list.propertiesMapping, routeInfos.list.reqType, routeInfos.form.responseKeys );
            this.execImports( component, list, this.resolveListComponentPath.bind(this) );
        }
        component.push( this.getReactComponentEnd( routeName ) );
        let builtComponent = component.join('\n');
        return builtComponent;
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
            `import Navbar from "${path.join(this.NAVBAR_COMPONENTS_DIR, 'Navbar')}"`
        ].join(";\n");
    }

    getReactComponentStart( componentName ){
        return `
        export default () => {
            ${EPlaceholders.BEFORE_RETURN}
            
            ${EPlaceholders.BEFORE_RETURN}
            return(
                <>
                ${EPlaceholders.NAVBAR}
        `;
    }
    getReactComponentEnd( componentName ){
        return '</>)\n}';
    }



    _buildComponentForm( formId, url, body, hasFile, reqType, responseKeys, bodyAsParams){
        let formParts = [];
        formParts.push( this._componentFromString(`<h1 className="mt-4">Form ${formId}</h1>`) );
        formParts.push( this._componentFromString(`<Form formId="${formId}" formResPath="${responseKeys}" formReqType="${reqType}" formActionUrl="${url}" hasFile={${hasFile}} params={${JSON.stringify(body)}} >`, 'Form' ) );
        
        for( let paramName in body ){
            let paramInfos = body[paramName];
            formParts.push(this._getInputFromParam( paramName, paramInfos ));
        }

        formParts.push( this._getInputFromParam('submitButton', { type: ETypes.SUBMIT_BUTTON }) );
        formParts.push( this._componentFromString('</Form>') );
        return formParts;
    }

    _buildComponentList( url, propertiesMapping, reqType, responseKeys ){
        let formParts = [];
        formParts.push( this._componentFromString(`<h1 className="mt-4">List</h1>`) );
        formParts.push( this._componentFromString(`<List mapping={${JSON.stringify(propertiesMapping)}} formResPath="${responseKeys}" url="${url}" formReqType="${reqType}" />`, 'List' ) );
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
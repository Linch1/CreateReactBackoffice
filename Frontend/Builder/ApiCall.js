const Utils = require('../../Utils/Utils');
const prettier = require("prettier");
const EAxiosRequestsType = require('../../Enum/axiosRequestTypes');
const pathLib = require('path');
const fs = require('fs');

module.exports = new class {
    constructor(  ){}

    buildFromConfig( targetFolder, config ){
        
        for( let endpointGroup in config ){
            for ( let endpoint in config[endpointGroup] ){
                
                let ednpointFolder = endpoint.startsWith('/api') ? endpoint.replace('/api', '') : endpoint;
                Utils.makeDirRecursive(targetFolder, ednpointFolder );
                this.currentFileTarget = pathLib.join(targetFolder, ednpointFolder, endpointGroup + '.js' );
                this.builtFunctionsNames = [];

                fs.appendFileSync( this.currentFileTarget, this.axiosApiInitalize( endpoint ), 'utf-8');

                let apiCallsInfo = config[endpointGroup][endpoint];
                if( apiCallsInfo.isRest ){
                    if( !apiCallsInfo.body ) { 
                        console.log('[fatal] missing body');
                        continue;
                    }
                    this.buildDefaultRestApiCalls( endpoint, apiCallsInfo.body, apiCallsInfo );
                } else {
                    for( let reqType in apiCallsInfo ){
                        let reqInfo = apiCallsInfo[reqType];
                        this.buildApiCall(endpoint, reqType, reqInfo);
                    }
                }

                fs.appendFileSync( this.currentFileTarget, this.axiosApiExport( ednpointFolder ), 'utf-8');
                
            }
        }
    }
    isMethodWithBody( method ){
        return [
            EAxiosRequestsType.POST, 
            EAxiosRequestsType.PUT 
        ].includes(method)
    }
    buildDefaultRestApiCalls( endpoint, body, apiCallsInfo ){
        console.log('\n\n');
        this.checkMethodDeclarationOrBuildCb( endpoint, EAxiosRequestsType.GET, apiCallsInfo, 
            () => this.buildApiCall( endpoint, EAxiosRequestsType.GET, { query: ['page'] } ) 
        );
        this.checkMethodDeclarationOrBuildCb( endpoint, EAxiosRequestsType.POST, apiCallsInfo, 
            () => this.buildApiCall( endpoint, EAxiosRequestsType.POST, { body: body } )
        );
        this.checkMethodDeclarationOrBuildCb( endpoint, EAxiosRequestsType.PUT, apiCallsInfo,
            () => this.buildApiCall( endpoint, EAxiosRequestsType.PUT, { params: ['id'], body: body } )
        );
        this.checkMethodDeclarationOrBuildCb( endpoint, EAxiosRequestsType.DELETE, apiCallsInfo,
            () => this.buildApiCall( endpoint, EAxiosRequestsType.DELETE, { params: ['id'] } )
        );
    }
    /*Check if the passed method is already declared in apiCallsInfo. otherwise build it from default parameters*/
    checkMethodDeclarationOrBuildCb( endpoint, method, apiCallsInfo, defaultCb ){
        if( apiCallsInfo[method] ){
            return this.buildApiCall( endpoint, method, apiCallsInfo[method] );
        } else {
            return defaultCb();
        }
    }
    buildApiCall( endpoint, method, info ){
        let fxDeclarationSource;

        console.log(endpoint, method);
        if( this.isMethodWithBody(method) ){
            fxDeclarationSource = this.axiosBodyCall( endpoint, method, info.body, info.query, info.params );
        } else {
            fxDeclarationSource = this.axiosNoBodyCall( endpoint, method, info.query, info.params );
        }

        fs.appendFileSync( this.currentFileTarget, fxDeclarationSource, 'utf-8');
        return fxDeclarationSource;
    }
    buildFxName(method, path){
        /*
        let fxName = path.split('/');
        for(let i in fxName ) fxName[i] = Utils.capitalize(fxName[i]);
        fxName = fxName.join('') + method;
        this.builtFunctionsNames.push(fxName);
        return fxName;
        */
       return method + 'Call';
    }
    buildApiServiceName(path){
        let serviceName = path.split('/');
        for(let i in serviceName ) serviceName[i] = Utils.capitalize(serviceName[i]);
        serviceName = 'ApiService' + serviceName.join('');
        return serviceName;
    }

    axiosApiExport(path){
        let serviceName = this.buildApiServiceName(path);
        return prettier.format(
            `
            let ${serviceName} = { ${this.builtFunctionsNames.join()} };
            export default ${serviceName};
            `
            , { parser: "babel" });
    }
    axiosApiInitalize( basePath ){
        if( !basePath.startsWith('/') ) basePath = '/' + basePath;
        return prettier.format(
        `
        import axios from 'axios';
        const BASE_URL = axios.create({
            baseURL: process.env.REACT_APP_SERVER_URL + '${basePath}',
        });
        `
        , { parser: "babel" });
    }
    axiosNoBodyCall( path, method, query, params ){

        let queryArgs = query ? query.join() + ',' : '';
        let paramsArgs = params ? params.join() : '';
        

        for( let i in params ){
            params[i] = '${'+params[i]+'}';
        }
        let urlParams = params ? params.join('/') : '';
        let fullUrl = path + ( path.endsWith('/') ? '' : '/' ) + urlParams;

        return prettier.format(
        `
        async function ${this.buildFxName(method, path)}( ${queryArgs} ${paramsArgs} ){
            let queryStringParams = { ${queryArgs} };
            let res = await BASE_URL.${method}( \`${fullUrl}\`, {
                params: queryStringParams,
                //withCredentials: true
            })
                .catch((err) => {
                    return err.response;
                })
                .then((res) => {
                    return res.data;
                });
            return res;
        }
        `
        , { parser: "babel" });
    }
    axiosBodyCall( path, method, body, query, params ){

        let bodyArgs = body ? body.join() + ',' : '';
        let paramsArgs = params ? params.join() + ',' : '';
        let queryArgs = query ? query.join() : '';

        for( let i in params ){
            params[i] = '${'+params[i]+'}';
        }
        let urlParams = params ? params.join('/') : '';
        let fullUrl = path + ( path.endsWith('/') ? '' : '/' ) + urlParams;
        

        return prettier.format(
        `
        async function ${this.buildFxName(method,path)}( ${bodyArgs} ${queryArgs} ${paramsArgs} ){
            let body = {${bodyArgs}};
            let queryStringParams = { ${queryArgs} };

            let res = await BASE_URL.${method}( \`${fullUrl}\`, body, { 
                params: queryStringParams,
                //withCredentials: true 
            })
                .catch((err) => {
                    return err.response;
                })
                .then((res) => {
                    if (!res) return { error: { msg: 'unknown' } };
                    return res.data;
                });
            return res;
        }
        `
        , { parser: "babel" });
    }
}
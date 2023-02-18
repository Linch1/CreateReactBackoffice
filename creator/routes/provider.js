const EAxiosRequestsType = require("../Enum/axiosRequestTypes")
const path = require('path');
const SERVER_URL = 'http://localhost:3000';
function url(path){ return path.join(SERVER_URL, path) }
module.exports = {
    
    createProvider: {

        path: '/endpoint/providers',

        form: {
            path: url('/api/providers'),
            body: {
                name: {
                    type: 'string',
                    required: true
                },
                desc: {
                    type: 'textarea',
                    required: true
                },
                chains: {
                    type: 'select_array',
                    values: { 'bsc': 56, 'eth': 1 }
                },
                badges: {
                    type: 'select_array',
                    values: { 'provably_fair': 1, 'tournaments': 2 }
                },
                tokens: {
                    type: 'select_array',
                    values: { 'usdt': 1, 'usdc': 2, 'busd': 3 }
                },
                provablyFair: {
                    type: 'checkbox'
                },
                'safu.active': {
                    type: 'checkbox'
                },
                'safu.address': {
                    type: 'string'
                },
                file: {
                    type: 'file',
                    required: true
                },
                
            },
            hasFile: true,
            reqType: EAxiosRequestsType.POST,
            bodyAsParams: false,
            responseKeys: 'sucess.data'
        },
    
        list: {
            path: url('/api/providers'),
            propertiesMapping: {
                'name': 'name',
            },
            edit: false,
            reqType: EAxiosRequestsType.GET,
            responseKeys: ''
        }
    },


    ads: {
        path: 'ads',
        form: {
            path: 'ads',
            body: {
                'name': {
                    type: 'string',
                    required: true
                },
                'desc': {
                    type: 'textarea',
                    required: true
                },
                'file': {
                    type: 'file',
                    required: true
                },
                'name': {
                    type: 'string',
                    required: true
                },
                'id': {
                    type: 'select_search',
                    url: 'http://localhost:3000/api/providers',
                    responseKeys: 'success.data',
                    displayKeys: 'name',
                    valueKeys: '_id',
                    axiosReqType: EAxiosRequestsType.GET,
                },
            },
            hasFile: true,
            reqType: EAxiosRequestsType.POST,
            bodyAsParams: false,
            responseKeys: ''
        },
    
        list: {
            path: 'ads',
            propertiesMapping: {
                'owner': 'owner',
            },
            edit: true,
            reqType: EAxiosRequestsType.GET,
            responseKeys: ''
        }
    },
    
}
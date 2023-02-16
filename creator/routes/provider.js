const EAxiosRequestsType = require("../Enum/axiosRequestTypes")

module.exports = {
    
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
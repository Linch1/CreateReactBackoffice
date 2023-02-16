import Utils from "frontend/utils/Utils";
import { useState } from "react";
import axios from 'axios';

export default ({
    children,

    hasFile,
    params,

    formId,
    formActionUrl,
    formReqType,
    formResPath

}) => {

    let [submitFormRes, setSubmitFormRes] = useState(null);
    
    
    
    async function submitForm( e ){
        e.preventDefault();
        var form = document.getElementById( formId );
        var formData = new FormData(form);
        const config = {
            headers: hasFile ? { 'content-type': 'multipart/form-data' } : {},
            params: params ?  { ...params } : {}
        }
        let res = await axios[formReqType](formActionUrl, formData, config)
        .then( res => {
          console.log( '[AXIOS RES]', res );
        })
        .catch( err => {
          console.log( '[AXIOS ERR]', err );
        });
        if(!res) return;
        
        let responseNested = Utils.getObjectKey(res.data, formResPath ? formResPath.split('.') : []);
        if( res.data && responseNested ){
            setSubmitFormRes( responseNested );
        }
    }
    


    return <form className="grid grid-cols-2 gap-4" id={formId} onSubmit={submitForm}>
        {children}
    </form>


}
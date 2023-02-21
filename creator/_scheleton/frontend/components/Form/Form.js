import Utils from "frontend/utils/Utils";
import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Formik } from 'formik';

const FormikCtx = ({
  ctx, formId, children, setFormikCtx
}) => {

    useEffect( () => {
      console.log('INSIDE', ctx);
      setFormikCtx(ctx);
    }, []);

    return  <form className="grid grid-cols-2 gap-4" id={formId} onSubmit={ctx.handleSubmit}>
        {children}
    </form>
}

export default ({
    children,

    hasFile,
    params,

    formId,
    formActionUrl,
    formReqType,
    formResPath,

    initialValues,

    setFormikCtx,
    overwriteFormInfo

}) => {

    let [submitFormRes, setSubmitFormRes] = useState(null);
  
    async function onSubmit(values, { setSubmitting }){
      
        const config = {
            headers: hasFile ? { 'content-type': 'multipart/form-data' } : {},
            params: params ?  { ...params } : {}
        }
        let res = await axios[overwriteFormInfo.formReqType ? overwriteFormInfo.formReqType : formReqType](
          overwriteFormInfo.formActionUrl ? overwriteFormInfo.formActionUrl : formActionUrl, 
          values, 
          config
        )
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

    return  <Formik
    initialValues={ initialValues ? initialValues : {} }
    validate={()=>{}}
    onSubmit={onSubmit}
  >
    {(ctx) => <FormikCtx formId={formId} setFormikCtx={setFormikCtx} ctx={ctx} > {children} </FormikCtx> }
  </Formik>
  


}
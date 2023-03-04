import Utils from "../utils/Utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { Formik } from 'formik';
import Customizer from "../Customizer"; 
import EC from "../enum/EC";
import ToastContext from "../context/ToastContext";

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
  pageIdentifier,

  children,

  hasFile,
  params,
  queryActionUrl,

  formId,
  formActionUrl,
  formReqType,
  formResPath,

  initialValues,

  setFormikCtx,
  overwriteFormInfo,

}) => {

    let [submitFormRes, setSubmitFormRes] = useState(null);
    let { setMessage: setToastMessage } = useContext(ToastContext)

    async function onSubmit(values, { setSubmitting }){
        
      if( 
        !( await Customizer.callCustomizedFunction(pageIdentifier, EC.FUNCTIONS.FORM.ON_SUBMIT, [values, { setSubmitting }] ) ) 
      ) return;

      const config = {
          headers: hasFile ? { 'content-type': 'multipart/form-data' } : {},
          params: params ?  { ...params } : {}
      }
      if( queryActionUrl ){
        if( queryActionUrl.body ){
          for( let key of queryActionUrl.body ){
            config.params[key] = Utils.getObjectKey(values, key);
          }
        }
      }
      if( overwriteFormInfo.query ){
        config.params = {...config.params, ...overwriteFormInfo.query};
      }

      let res = await axios[overwriteFormInfo.formReqType ? overwriteFormInfo.formReqType : formReqType](
        overwriteFormInfo.formActionUrl ? overwriteFormInfo.formActionUrl : formActionUrl, 
        values, 
        config
      )
      .then( res => {
        console.log( '[AXIOS RESAA]', res );
        setToastMessage(res.data);
      })
      .catch( err => {
        console.log( '[AXIOS ERR aaa]', err );
        setToastMessage(err.response.data);
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
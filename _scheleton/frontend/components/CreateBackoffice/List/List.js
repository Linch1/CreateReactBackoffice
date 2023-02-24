import { useEffect, useState } from "react"
import { Table } from "flowbite-react"
import Pagination from "./Pagination"
import Utils from "../utils/Utils";
import axios from 'axios';
import { useFormikContext } from "formik";
import useCustomComponent from "../hooks/useCustomComponent";
import EC from "../enum/EC";

export default ({

    pageIdentifier,

    mapping, // { headName: propertyPath, ... }
    url,
    params,
    formReqType,
    formResPath,

    editInfo,
    deleteInfo,
    formikCtx,

    setOverwriteFormInfo
}) => {

    let [page, setPage] = useState(0);
    let [toggler, setToggler] = useState(0);
    let [submitNoPayloadRes, setSubmitNoPayloadRes] = useState([]);

    let [editing, setEditing] = useState(false);

    async function submitNoPayload(){
        const config = {
            params: params ?  { ...params } : {}
        }
        config.params.page = page;
        
        let res = await axios[formReqType](url, config)
        .then( res => {
          console.log( '[AXIOS RES]', res );
          return res;
        })
        .catch( err => {
          console.log( '[AXIOS ERR]', err );
        });
        if(!res) return;

        let responseNested = Utils.getObjectKey(res.data, formResPath ? formResPath.split('.') : []);
        if( res.data && responseNested ){
            
            setSubmitNoPayloadRes( responseNested );
        }
    }
    async function submitDelete( obj ){
        let body = {};
        for( let key of deleteInfo.body ){
            let val = Utils.getObjectKey(obj, key);
            Utils.createProperty(body, key, val);
        }
        let res = await axios.delete(url, { params: body })
        .then( res => {
          console.log( '[AXIOS RES]', res );
          setToggler( toggler + 1 );
          return res;
        })
        .catch( err => {
          console.log( '[AXIOS ERR]', err );
        });
        
    }

    useEffect( () => {
        submitNoPayload();
    }, [page, toggler]);

    function populateEditForm( obj, i ){
        formikCtx.setValues( obj );
        setOverwriteFormInfo({ 
            formActionUrl: editInfo.url,
            formReqType: 'put'
        });
        setEditing(i);
    }
    function cancelEditing(){
        formikCtx.setValues({});
        setOverwriteFormInfo({});
        setEditing(false);
    }
    function deleteRequest( obj ){
        submitDelete( obj );
        console.log('DELETING:', obj)
    }



    function renderEditButton(obj, i){
        if( editing !== false && editing == i ){
            return <Table.HeadCell > <button onClick={()=>{cancelEditing()}}>cancel edit</button> </Table.HeadCell>;
        } else {
            return <Table.HeadCell > <button onClick={()=>{populateEditForm(obj, i)}}>edit</button> </Table.HeadCell>
        }
    }
    return <section className="mt-4 container mx-auto" id="home-table-container">
    <Table id="home-table" >
        
        <Table.Head>
            {Object.keys(mapping).map((e,i) => {
                return <Table.HeadCell key={i}> {e} </Table.HeadCell>
            })}
            { editInfo ? <Table.HeadCell > Edit </Table.HeadCell> : <></> }
            { deleteInfo ? <Table.HeadCell > Delete </Table.HeadCell> : <></> }
        </Table.Head>
        <Table.Body className="divide-y">
            {
            submitNoPayloadRes.map( (obj,i) => {
                let c =  useCustomComponent(pageIdentifier, EC.COMPONENTS.LIST.TABLE_ROW, { obj }) 
                return (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={i} >
                    {
                        c? 
                        c
                        :
                        Object.values(mapping).map( (e,i) => {
                            return <Table.Cell className={"whitespace-nowrap font-medium text-gray-900 dark:text-white "} key={i}>
                                {Utils.getObjectKey(obj, e.split("."))}
                            </Table.Cell> 
                        })
                    }
                    {renderEditButton(obj,i)}
                    { deleteInfo ? <Table.HeadCell > <button onClick={()=>{deleteRequest(obj)}}>delete</button> </Table.HeadCell> : <></> }
                </Table.Row>
                )
            })
            }
            
        </Table.Body>
    </Table>
    <Pagination page={page} setPage={setPage} />

    </section>
}
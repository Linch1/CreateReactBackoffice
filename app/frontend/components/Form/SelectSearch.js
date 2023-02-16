import { TextInput, Select, Label } from "flowbite-react"
import Utils from "frontend/utils/Utils";
import { useEffect, useRef, useState } from "react";
import axios from 'axios';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ url, name, axiosReqType, displayKeys, valueKeys, responseKeys }) => {

    let [search, setSearch] = useState("");
    let [response, setResponse] = useState([]);
    let [value, setValue] = useState("");

    let typeInterval = 100;//ms
    let timeout = useRef();
    timeout.current = 0; // time of last input typing

    async function submitNoPayload(){
        if(!search) return;
        if(Date.now() - timeout.current < typeInterval ) return;

        const config = {
            params: {search: search}
        }
        let res = await axios[axiosReqType](url, config)
        .then( res => {
          console.log( '[AXIOS RES]', res );
          return res;
        })
        .catch( err => {
          console.log( '[AXIOS ERR]', err );
        });
        if(!res) return;

        let responseNested = Utils.getObjectKey(res.data, responseKeys ? responseKeys.split('.') : []);
        if( res.data && responseNested ){
            setResponse( responseNested );
        }
    }

    useEffect( () => {
        submitNoPayload(); 
    }, [search])

    return <div className="mb-3 block">

        <Label
        htmlFor={name + '-search'}
        value={"Search " + name} 
        />
        <TextInput
            id={name + '-search'}
            type={'text'}
            placeholder={"Insert " + name + "..."}
            addon="🔍"
            value={search}
            onChange={(e)=>{ setSearch(e.target.value); timeout.current = Date.now();}}
        />

        {
            response.map( (obj,i) => {
                return <div key={i} onClick={ () => { setValue( Utils.getObjectKey(obj, valueKeys.split(".")) )}}>
                    {Utils.getObjectKey(obj, displayKeys.split("."))}
                </div>
            })
        }

        <TextInput
            id={name}
            type={'hidden'}
            value={value}
        />
        
    </div>
}
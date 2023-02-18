import { TextInput, Select, Label } from "flowbite-react"
import Utils from "frontend/utils/Utils";
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ url, name, axiosReqType, displayKeys, valueKeys, responseKeys }) => {

    let [search, setSearch] = useState("");
    let [response, setResponse] = useState([]);
    let [value, setValue] = useState("");
    let [showRes, setShowRes] = useState(false);

    
    let [selected, setSelected] = useState(null);



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
            setShowRes( true );
        }
    }

    useEffect( () => {
        submitNoPayload(); 
    }, [search])

    return <div className="mb-3 block ">

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

        <div className="relative">
            {
                showRes &&
                <div className="absolute top-0 left-0 max-h-80 w-full bg-slate-100 z-10 overflow-y-auto p-3 shadow-lg">
                    <div className="ml-auto w-fit cursor-pointer" onClick={() => { setShowRes(false) }}> <FontAwesomeIcon icon={faClose} /> </div>
                    {
                        response.map( (obj,i) => {
                            return <div key={i} onClick={ () => { 
                                let v = Utils.getObjectKey(obj, valueKeys.split("."));
                                setSelected(v);
                                setValue(v);
                                setShowRes(false);
                            }}
                                className="px-2 rounded-lg bg-white w-fit cursor-pointer" >
                                {Utils.getObjectKey(obj, displayKeys.split("."))}
                            </div>
                        })
                    }
                </div>
            }
        </div>

        <div className="">
            {
                selected &&
                <div className="max-h-80 w-full bg-slate-100 overflow-y-auto p-3">
                    <div className="mb-2 w-fit cursor-pointer" > Selected <FontAwesomeIcon icon={faCheck} /> </div>
                    <div className="px-2 rounded-lg bg-white w-fit " >
                        {selected} 
                        <span className="ml-3 cursor-pointer" onClick={() => { setSelected("") }}><FontAwesomeIcon icon={faClose} /></span>
                    </div>
                </div>
            }
        </div>

        <TextInput
            id={name}
            type={'hidden'}
            value={value}
        />
        
    </div>
}
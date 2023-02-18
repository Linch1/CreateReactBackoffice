import { Select, Label } from "flowbite-react"
import Utils from "frontend/utils/Utils";
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useField, useFormikContext } from "formik";

// eslint-disable-next-line import/no-anonymous-default-export
function SelectArrayWithDynamicValues({ name, url, axiosReqType, displayKeys, valueKeys, responseKeys }) {

    let [search, setSearch] = useState("");
    let [response, setResponse] = useState([]);
    let [value, setValue] = useState("");
    let [showRes, setShowRes] = useState(false);

    
    let [selected, setSelected] = useState([]);



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
    
}

export default function SelectArray ({
    selectValues, /* { displayName: valueToSend }*/
    name,
}) {

    const [ field, meta, helpers ] = useField(name);
    const { setFieldValue, values } = useFormikContext();
    
    let selectLabel = 'Select Option';
    let [reversedValues, setReversedValues] = useState({});
    let [updatedValues, setUpdatedValues] = useState({});
    let [selected, setSelected] = useState([]);
    
    function removeSelected( e ) {
        setSelected( oldSelected => oldSelected.filter( v => v != e ))
    };
    function includes( arr, e ){
        for( let elem of arr ) {
            if( elem == e ) return true;
        }
    }

    useEffect( () => { 
        let rev = {};
        for( let v in selectValues) rev[selectValues[v]] = v;
        setReversedValues( rev );
    }, []);
    useEffect( () => {
        if(!Object.keys(reversedValues).length) return;
        let allValues = Object.values(selectValues);
        let newValues = allValues.filter( v => !includes(selected, v) );
        let options = {};
        for( let v of newValues ){
            options[reversedValues[v]] = v;
        }
        setUpdatedValues(options);
        setFieldValue(name, selected);
    }, [selected, reversedValues]);

    useEffect( () => {
        console.log( values );
        setSelected(values[name] ? values[name] : []);
    }, [values])

    

    return <div className="mb-3 block ">

        <Label
        htmlFor={name + '-search'}
        value={"Select " + name} 
        />
        <Select
        id={name + '-search'}
        defaultValue={selectLabel}
        onChange={ (e) => {
            console.log(e, e.target.value);
            let v = e.target.value;
            setSelected( old => [...old, v]);
            e.target.value = selectLabel;
        }}
        >
            <option >{selectLabel}</option>
            {Object.keys(updatedValues).map( (e,i) => <option value={updatedValues[e]} key={i} > {e} </option> )}
        </Select>

        <div className="">
            {
                selected && selected.length ?
                <div className="max-h-80 w-full bg-slate-100 overflow-y-auto p-3">
                    <div className="mb-2 w-fit cursor-pointer flex" > Selected <FontAwesomeIcon icon={faCheck} /> </div>
                    <div className="flex">
                    {
                        selected.map( (e,i) => {
                            return <div className="px-2 mr-2 rounded-lg bg-white w-fit " key={i} >
                                {reversedValues[e]} 
                                <span className="ml-3 cursor-pointer" onClick={() => { removeSelected(e) }}><FontAwesomeIcon icon={faClose} /></span>
                            </div>
                        })
                    }
                    </div>
                    
                </div>
                : <></>
            }
        </div>

    </div>
}
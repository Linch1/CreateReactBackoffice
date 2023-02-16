import { useEffect, useState } from "react"
import { Table } from "flowbite-react"
import Pagination from "./Pagination"
import Utils from "frontend/utils/Utils";
import axios from 'axios';

export default ({
    mapping, // { headName: propertyPath, ... }
    url,
    params,
    formReqType,
    formResPath
}) => {

    let [page, setPage] = useState(0);
    let [submitNoPayloadRes, setSubmitNoPayloadRes] = useState([]);

    async function submitNoPayload(){
        const config = {
            params: params ?  { page: page, ...params } : {}
        }
        let res = await axios[formReqType](url, config)
        .then( res => {
          console.log( '[AXIOS RES]', res );
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

    useEffect( () => {
        submitNoPayload();
    }, [page])

    return <section className="mt-4 container mx-auto" id="home-table-container">
    <Table id="home-table" >
        
        <Table.Head>
            {Object.keys(mapping).map((e,i) => {
                return <Table.HeadCell key={i}> {e} </Table.HeadCell>
            })}
        </Table.Head>
        <Table.Body className="divide-y">
            {
            submitNoPayloadRes.map( (obj,i) => {
                
                return (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={i} >
                    {
                        Object.values(mapping).map( (e,i) => {
                            return <Table.Cell className={"whitespace-nowrap font-medium text-gray-900 dark:text-white "} key={i}>
                                {Utils.getObjectKey(obj, e.split("."))}
                            </Table.Cell> 
                        })
                    }
                </Table.Row>
                )
            })
            }
            
        </Table.Body>
    </Table>
    <Pagination page={page} setPage={setPage} />

    </section>
}
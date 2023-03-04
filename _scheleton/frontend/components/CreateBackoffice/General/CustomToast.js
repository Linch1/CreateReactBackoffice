import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faHelicopterSymbol } from "@fortawesome/free-solid-svg-icons";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toast } from "flowbite-react";
import { useContext, useEffect } from "react";
import ToastContext from "../context/ToastContext";

export default function CustomToast() {
    let {message, setMessage} = useContext(ToastContext);

    useEffect( () => {
        console.log('Toast message: ', message);
    }, [message]);

    function renderStatus(){
        if( !Object.keys(message) ){ 
            return <span className="cursor-pointer ml-2 text-green-500">
                <FontAwesomeIcon icon={faHelicopterSymbol} />
            </span>
        } else if( message.success ){
            return <span className="cursor-pointer ml-2 text-green-500">
                <FontAwesomeIcon icon={faCheck} />
            </span>
        } else {
            return <span className="cursor-pointer ml-2 text-red-600">
                <FontAwesomeIcon icon={faWarning} />
            </span>
        }
    }
    function renderMessage(){
        if( !Object.keys(message) ) return "none";
        if( message.success ) return message.success.msg
        if( message.error ) return message.error.msg + " " + message.error?.data
    }

    return <Toast className={ (Object.keys(message).length ? 'absolute top-2 left-2' : 'hidden')}>
        
        { renderStatus() }
        <div className="ml-3 text-sm font-normal">
            {renderMessage()}
        </div>
        <span onClick={() => { setMessage({}) }} className="cursor-pointer ml-2"><FontAwesomeIcon icon={faClose} /></span>
    </Toast>
}
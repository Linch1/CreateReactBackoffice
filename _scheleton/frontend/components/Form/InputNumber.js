import { TextInput, Label } from "flowbite-react"
import { useField, useFormikContext } from "formik";
import Utils from "frontend/utils/Utils";
import { useEffect } from "react";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ name, required }) => {
    const [ field, meta, helpers ] = useField(name);
    const { setFieldValue, values } = useFormikContext();

    useEffect(() => {
        let v =  Utils.getObjectKey(values, field.name);
        if( v === undefined ) setFieldValue(field.name, 0) ;
    }, [values])

    return <div className="mb-3 block">
        <div className="mb-2 block">
            <Label
                htmlFor={name}
                value={name}
            />
        </div>
        <TextInput
        id={name}
        type={"number"}
        name={name}
        placeholder={"Insert " + name + "..."}
        required={required}
        {...field}
        />
    </div>
}
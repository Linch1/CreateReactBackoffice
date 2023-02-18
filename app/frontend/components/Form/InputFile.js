import { FileInput, Label } from "flowbite-react"
import { useField, useFormikContext } from "formik";
import { useEffect, useState } from "react";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ name, required }) => {

    const [ field, meta, helpers ] = useField(name);
    const { setFieldValue, values } = useFormikContext();
    const [preview, setPreview] = useState()
    useEffect(() => {
        // create the preview
        if( !values[field.name] ) return;
        const objectUrl = URL.createObjectURL(values[field.name]);
        setPreview(objectUrl)
     
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
     }, [values])

    return <div id="fileUpload">
        <div className="mb-2 block">
            <Label
                htmlFor="file"
                value="Upload file"
            />
        </div>
        <div className="flex justify-between">
            <div>
            <FileInput
            id="file"
            name={name}
            required={required}
            helperText="A profile picture is useful to confirm your are logged into your account"
            onChange={(event) => {
                setFieldValue("file", event.currentTarget.files[0]);
            }}
            className="mr-3"
            />
            </div>
            {preview && <img  src={preview} width={60} height={60} /> }
        </div>
  </div>
}
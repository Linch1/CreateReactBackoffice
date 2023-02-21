import { ToggleSwitch } from "flowbite-react"
import { useField, useFormikContext } from "formik";
import Utils from "frontend/utils/Utils";
import { useEffect, useState } from "react"

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ name }) => {
    const [ field, meta, helpers ] = useField(name);
    const { setFieldValue, values } = useFormikContext();
    let [checked, setChecked] = useState(Utils.getObjectKey(values, name));
    useEffect( () => {
        let v = Utils.getObjectKey(values, name.split("."));
        if( v != checked ) setChecked(v);
    }, [values])
    return <div id="checkbox-switch">
        <ToggleSwitch
            label={"Switch: " + name}
            onChange={(s)=>{setFieldValue(name,s)}}
            checked={checked}
        />
    </div>
}
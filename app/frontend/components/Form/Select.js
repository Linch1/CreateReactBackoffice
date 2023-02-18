import { Select, Label } from "flowbite-react"
import { useField, useFormikContext } from "formik";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ name, required, values }) => {
    const [ field, meta, helpers ] = useField(name);
    const { setFieldValue, values } = useFormikContext();

    return <div className="mb-3 block">
        <div id="select">
            <div className="mb-2 block">
                <Label
                htmlFor={name}
                value={"Select " + name} 
                />
            </div>
            <Select
            id={name}
            required={required}
            name={name}
            {...field}
            >
                {Object.keys(values).map( e => <option value={values[e]} >{e}</option> )}
            </Select>
        </div>
    </div>
}
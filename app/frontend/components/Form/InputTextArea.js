import { Textarea, Label } from "flowbite-react"
import { useField, useFormikContext } from "formik";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ name, required }) => {
    const [ field, meta, helpers ] = useField(name);
    const { setFieldValue, values } = useFormikContext();

    return <div className="mb-3 block">
        <div className="mb-2 block">
            <Label
                htmlFor={name}
                value={name}
            />
        </div>
        <Textarea
        id={name}
        placeholder={"Insert " + name + "..."}
        required={required}
        {...field}
        />
    </div>
}
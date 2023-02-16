import { TextInput, Label } from "flowbite-react"

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ name, required }) => {
    return <div className="mb-3 block">
        <div className="mb-2 block">
            <Label
                htmlFor={name}
                value={name}
            />
        </div>
        <TextInput
        id={name}
        type={name}
        name={name}
        placeholder={"Insert " + name + "..."}
        required={required}
        />
    </div>
}
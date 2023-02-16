import { Select, Label } from "flowbite-react"

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ name, required, options }) => {
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
            >
                {options.map( e => <option>{e}</option> )}
                
            </Select>
        </div>
    </div>
}
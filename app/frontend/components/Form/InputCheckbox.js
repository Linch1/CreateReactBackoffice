import { ToggleSwitch } from "flowbite-react"
import { useState } from "react"

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ name }) => {
    let [checked, setChecked] = useState(false);
    return <div id="checkbox-switch">
        <ToggleSwitch
            label={"Switch: " + name}
            name={name}
            onChange={(s)=>{setChecked(s)}}
            checked={checked}
        />
  </div>
}
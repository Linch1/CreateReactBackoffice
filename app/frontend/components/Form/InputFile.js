import { FileInput, Label } from "flowbite-react"

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ name, required }) => {
    return <div id="fileUpload">
        <div className="mb-2 block">
            <Label
                htmlFor="file"
                value="Upload file"
            />
        </div>
        <FileInput
        id="file"
        name={name}
        required={required}
        helperText="A profile picture is useful to confirm your are logged into your account"
        />
  </div>
}
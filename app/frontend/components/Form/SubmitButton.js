import { Button } from "flowbite-react"

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ name, required }) => {
    return <div className="mb-3 block">
        <Button type="submit">
            Submit
        </Button>
    </div>
}
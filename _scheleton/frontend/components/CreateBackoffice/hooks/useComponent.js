import Customizer from "../Customizer";
function useComponent (page, type, part, props = {}) {
    const Component = Customizer.getComponent(page, type, part);
    if(!Component) return <></>;
    return <Component {...props} />;
};
export default useComponent;
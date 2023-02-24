import Customizer from "../Customizer";
function useCustomComponent (page, customizationType, props = {}) {
    const Component = Customizer.getComponent(page, customizationType);
    if(!Component) return <></>;
    return <Component {...props} />;
};
export default useCustomComponent;
import React from "react";

const RenderClientOnly = ({ children, ...delegated }: any) => {

    const [hasMounted, setHasMounted] = React.useState(false);

    React.useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null

    return (
        <React.Fragment {...delegated}>
            {children}
        </React.Fragment>
    );
}

export default RenderClientOnly
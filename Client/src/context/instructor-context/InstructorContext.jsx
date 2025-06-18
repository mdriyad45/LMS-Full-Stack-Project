import { createContext } from "react";


export const instructorContext = createContext(null)

const InstructorContext = ({children}) => {
    return (
        <instructorContext.provider 
        value={{}}
        >
            {children}
        </instructorContext.provider>
    );
};

export default InstructorContext;
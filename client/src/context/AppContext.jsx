import react, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props)=>{

    const value = {

    }



    return(

        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>

    )

} 

const useAppContext = () => {
    const context = react.useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within a AppContextProvider");
    }
    return context;
};

export default useAppContext;
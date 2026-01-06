import React, { createContext, useState } from "react";

export const ThemeContext = createContext(); 

export const ThemeProvider = ({ children }) => {
    //estados para los colores, se pueden poner los que qiiera
    const [bgColor, setBgColor] = useState('#ffffff');
    const [textColor, setTextColor] = useState('#000000');

    return (
        <ThemeContext.Provider value={{ bgColor, setBgColor, textColor, setTextColor }}>
            {children}
        </ThemeContext.Provider>
    )
}
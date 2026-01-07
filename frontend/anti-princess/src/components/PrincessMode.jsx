//este file es para romper la app aproposito 
import React from "react";

export default function PricessMode() {
    //apenas el usuario entra aca, se dispara el error 
    throw new Error("Princess detected!");
    return null;
}
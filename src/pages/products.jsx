import { useEffect } from "react"

export default function Products({setActiveMenu}){
    useEffect(
            ()=>{
                setActiveMenu("Products")
            },[]
        )
    return(
        <div>
            Products
        </div>
    )
}
import { useEffect } from "react"

export default function Cards({setActiveMenu}){
    useEffect(
            ()=>{
                setActiveMenu("Card")
            },[]
        )
    return(
        <div>
            Card
        </div>
    )
}
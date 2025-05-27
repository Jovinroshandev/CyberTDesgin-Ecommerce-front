import { useEffect } from "react"

export default function Profile({setActiveMenu}){
    useEffect(
            ()=>{
                setActiveMenu("Profile")
            },[]
        )
    return (
        <div>
            Profile
        </div>
    )
}
import { useEffect } from "react"

export function SubmitButton({children , disabled , type, classname , onClick}:{children:React.ReactNode, disabled:boolean, type:string , classname:string , onClick:()=>void}){
    useEffect(()=>{
        console.log(disabled)
    },[disabled])
    return <button className={`${classname} ${disabled ? "cursor-wait " : "cursor-pointer" }`} onClick={disabled ? undefined : onClick} disabled={disabled} >
        {children}
    </button>
}
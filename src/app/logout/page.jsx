"use client";


import { useRouter} from "next/navigation"


const LOGOUT_URL = "/api/logout/"


export default function Page() {
    const router = useRouter()

    async function handleClick(event) {
        event.preventDefault(); // Prevents default form submission
        const requestOptions = {
            method: "POST",
            headers: {
              
                "Content-Type": "appplication/json"
            },
            body: ""

        }
        const response = await fetch(LOGOUT_URL,requestOptions)
        if (response.ok){
            console.log("Logged Out")
            router.replace("/login")
            

        }
    }

    return (
        <div className="h-[95vh]">
            <div className="max-w-md mx-auto py-5"> 
                <h1>Are you sure you want to logout?</h1>
                <button 
                    className="bg-red-500 text-white hover:bg-red-300 px-3 py-2"
                    onClick={handleClick}
                >
                    Yes, LogOut
                </button>
            </div>
        </div>
    );
}

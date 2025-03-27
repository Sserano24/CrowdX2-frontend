"use client";

const SIGNUP_URL = "http://127.0.0.1:8001/api/accounts/signup"

export default function Page() {
    async function handleSubmit(event) {
        event.preventDefault(); // Prevents default form submission
        console.log(event, event.target);

        const formData = new FormData(event.target)
        const objectFormForm = Object.fromEntries(formData)
        const jsonData = JSON.stringify(objectFormForm)
        const requestOptions = {
            method: "POST",
            headers: {
              
                "Content-Type": "application/json"
            },
            body: jsonData

        }
        const response = await fetch(SIGNUP_URL,requestOptions)
        const data = await response.json()
        if (response.ok){
            console.log("Account Created")
            //auth.login()
            

        }
    }
  return (

    <div className="h-[95vh]">
  <div className="max-w-md mx-auto py-5">
    <h1 className="text-2xl font-bold mb-4">Signup Here</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        required
        name="username"
        placeholder="Your Username"
      />
      <input
        type="email"
        required
        name="email"
        placeholder="Your Email"
      />
      <input
        type="password"
        required
        name="password"
        placeholder="Your Password"
      />
      <input
        type="text"
        required
        name="first_name"
        placeholder="Your First Name"
      />
      <input
        type="text"
        required
        name="last_name"
        placeholder="Your Last Name"
      />
      <input
        type="text"
        required
        name="phone_number"
        placeholder="Your Phone Number"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Sign Up
      </button>
    </form>
  </div>
</div>

  );
}

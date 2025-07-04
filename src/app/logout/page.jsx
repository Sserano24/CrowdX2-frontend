"use client";

export default function Page() {
  async function handleClick(event) {
    event.preventDefault();

    const response = await fetch("/api/logout", {
      method: "POST",
    });

    if (response.ok) {
      console.log("Logged Out");
      window.location.href = "/login"; // redirect after logout
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

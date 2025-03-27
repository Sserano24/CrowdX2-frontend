"use client"
import {useState} from 'react'
import Image from "next/image";
import useSWR from 'swr';
import { useAuth } from "@/components/authProvider";
import { ThemeToggleButton } from '@/components/themeToggleButton';

import Link from "next/link";



const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Home() {
  const auth = useAuth()
  const {data, error, isLoading} = useSWR("http://127.0.0.1:8001/api/hello",
    fetcher)
    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>


  return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <div>
//           {auth.isAuthenticated ? "Hello User": "Hello guest"}
//         </div>
//         <div>
//           {JSON.stringify(data)}
//         </div>
//         <div>
//           <ThemeToggleButton/>
//         </div>
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//               src/app/page.js
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }

<div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md dark:bg-black dark:text-white">
        <h1 className="text-2xl font-bold text-primary">CrowdX</h1>
        <div className="flex gap-6">
          <Link href="/signup" className="hover:underline">Sign Up</Link>
          <Link href="/login" className="hover:underline">Login</Link>
          <Link href="/about" className="hover:underline">About</Link>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-grow p-8 space-y-20">
        {/* Features Section */}
        <section className="features text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose CrowdX?</h2>
          <div className="grid gap-10 sm:grid-cols-3">
            <div className="feature flex flex-col items-center gap-3">
              <Image src="/secure.svg" alt="Secure" width={64} height={64} />
              <h3 className="text-xl font-semibold">Secure & Reliable</h3>
              <p className="text-sm text-muted-foreground">
                We prioritize security and reliability to protect your data.
              </p>
            </div>
            <div className="feature flex flex-col items-center gap-3">
              <Image src="/collaboration.svg" alt="Collaboration" width={64} height={64} />
              <h3 className="text-xl font-semibold">Effortless Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Work with your team in real-time with powerful tools.
              </p>
            </div>
            <div className="feature flex flex-col items-center gap-3">
              <Image src="/innovation.svg" alt="Innovation" width={64} height={64} />
              <h3 className="text-xl font-semibold">Innovate with Ease</h3>
              <p className="text-sm text-muted-foreground">
                Our intuitive platform makes project management a breeze.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works text-center">
          <h2 className="text-3xl font-bold mb-10">How It Works</h2>
          <div className="grid gap-10 sm:grid-cols-3">
            <div className="step flex flex-col gap-2">
              <h3 className="text-xl font-semibold">1. Create a Project</h3>
              <p>Tell funders what you are trying to build.</p>
              <p>Set funding goals and payout milestones.</p>
            </div>
            <div className="step flex flex-col gap-2">
              <h3 className="text-xl font-semibold">2. Connect with Backers</h3>
              <p>Engage with a community of supporters.</p>
              <p>View comments and concerns from potential supporters.</p>
            </div>
            <div className="step flex flex-col gap-2">
              <h3 className="text-xl font-semibold">3. Achieve Your Goals</h3>
              <p>Receive your funds and bring your project to life!</p>
              <p>Continue to update your project to keep supporters engaged.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} CrowdX. All rights reserved.
      </footer>
    </div>
  );
}

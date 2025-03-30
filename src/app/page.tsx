import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen overflow-auto font-[Montserrat]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-[#0c0151] text-white flex justify-between p-4 z-10">
        <Link href="/">
          <h1 className="text-3xl font-bold cursor-pointer">AEGIS</h1>
        </Link>
        <div className="space-x-20 pt-2">
          <Link href="#home" className="hover:underline">HOME</Link>
          <Link href="/about" className="hover:underline">ABOUT</Link>  
          <Link href="/login" className="hover:underline">LOG IN</Link>
        </div>
      </nav>
      
      {/* Oble Pic */}
      <section
        id="home"
        className="relative h-screen w-full flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/oble.png')" }}
        >
        <h2 className="text-4xl font-bold text-[#0C0151] font-montserrat leading-relaxed absolute top-[20%]">
            ALUMNI ENGAGEMENT GATEWAY <br /> AND INFORMATION SYSTEM
        </h2>
        </section>
      
   {/* News and Updates */}
    <section className="p-16 bg-[#0C0151] text-white min-h-[90vh] flex flex-col justify-center">
      <h3 className="text-2xl font-montserrat font-semibold mb-8">News and Updates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-300 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-300 rounded-lg"></div>
          <div className="h-24 bg-gray-300 rounded-lg"></div>
          <div className="h-24 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </section>

          
    {/* Events */}
    <section className="bg-white text-[#0C0151] p-16 min-h-[90vh] flex flex-col justify-center">
      <h3 className="text-2xl font-semibold mb-4">Events</h3>
      <p className="text-sm opacity-80">Secret muna</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="h-80 bg-gray-600 rounded-lg"></div>
        <div className="h-80 bg-gray-600 rounded-lg"></div>
        <div className="h-80 bg-gray-600 rounded-lg"></div>
      </div>
    </section>


      
      {/* Footer */}
      <footer className="bg-[#0C0151] p-4 text-center text-sm text-white flex flex-col items-center space-y-4">
        {/* CAS & UPLB Logos */}
        <div className="flex space-x-4">
          <Image src="/assets/cas.png" alt="CAS Logo" width={50} height={50} />
          <Image src="/assets/uplb.png" alt="UPLB Logo" width={50} height={50} />
        </div>
      
        {/* Contact Info */}
        <div className="text-center">
          <p className="font-bold">College of Arts and Sciences, UPLB, Laguna, Philippines 4031</p>
          <p>(049) 536-2021 | +63-49-536-2322</p>
          <p>ics.uplb@up.edu.ph</p>
        </div>
      </footer>
    </div>
  ); 
}

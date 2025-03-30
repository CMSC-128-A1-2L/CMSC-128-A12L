import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen overflow-auto font-[Montserrat]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-[#0c0151] text-white flex justify-between p-4 z-10">
        <Link href="/" className="text-3xl font-bold cursor-pointer">AEGIS</Link>
        <div className="space-x-20 pt-2">
          <Link href="/" className="hover:underline">HOME</Link> 
          <Link href="/login" className="hover:underline">LOG IN</Link>
        </div>
      </nav>

      {/* Pegaraw Section with Background */}
      <section
        id="home"
        className="relative h-[80vh] w-full flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/pegaraw.png')" }}
      >
        <div className="absolute top-[-15%] relative text-[#0C0151]">
          <h2 className="text-3xl md:text-4xl font-bold">
            Alumni Engagement Gateway <br /> and Information System
          </h2>
          <div className="mt-2 flex justify-center items-center space-x-8">
            <Link href="#vision" className="cursor-pointer hover:underline block text-lg md:text-xl">Vision</Link>
            <Link href="#mission" className="cursor-pointer hover:underline block text-lg md:text-xl">Mission</Link>
            <Link href="#values" className="cursor-pointer hover:underline block text-lg md:text-xl">Values</Link>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section
        id="vision"
        className="relative h-[60vh] bg-[#0C0151] text-white flex flex-col items-center justify-center text-center p-10"
      >
        <h3 className="text-2xl font-semibold">VISION</h3>
        <p className="mt-10 text-lg max-w-6xl leading-[2]">
          AEGIS envisions a strong and thriving ICS community where alumni, students, and faculty collaborate
          to advance computing, innovation, and leadership. Rooted in Honor, Excellence, and Integrity, we strive
          to create a lifelong network of mentorship, knowledge-sharing, and professional growth—ensuring that ICS
          remains a leading force in technological and academic excellence.
        </p>
      </section>

      {/* Mission Section with Background */}
      <section
        id="mission"
        className="relative h-[60vh] w-full flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/pc.png')" }}
        >
        <div className="relative max-w-6xl p-6">
            <h3 className="text-2xl font-semibold text-[#0C0151]">MISSION</h3>
            <p className="mt-10 text-lg text-[#0C0151] leading-[2]">
            AEGIS unites ICS alumni, students, and faculty in a collaborative network that fosters mentorship, career
            growth, and academic excellence. We empower students with industry insights, strengthen alumni engagement,
            and promote faculty collaboration in research and innovation—upholding Honor, Excellence, and Integrity in all our endeavors.
            </p>
        </div>
        </section>

      {/* Values Section */}
      <section
        id="values"
        className="relative h-[60vh] bg-[#F3F3F3] text-[#0C0151] flex flex-col items-center justify-center text-center p-10"
      >
        <h3 className="text-2xl font-semibold">VALUES</h3>
        <p className="mt-10 text-lg max-w-6xl leading-[2]">
          At AEGIS, we uphold Honor, Excellence, and Integrity as our core values. We believe in fostering a culture
          of inclusivity, collaboration, and lifelong learning. Through shared knowledge, mentorship, and ethical leadership,
          we aim to create a supportive and innovative community for all members of ICS.
        </p>
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

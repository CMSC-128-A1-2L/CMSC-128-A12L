export default function AdminLogin() {

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
      style={{
        backgroundImage: "url('/assets/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-4xl flex flex-col md:flex-row shadow-lg overflow-hidden">
        
        {/* Left Section */}
        <div
          className="flex flex-col items-center justify-center p-6 w-full md:w-[50%] h-[510px] relative"
          style={{ backgroundColor: "rgba(11, 1, 67, 0.8)" }}
        >
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="w-[90%] md:w-[110%] h-auto mb-0.5 md:mb-0.5"
          />
          <h2
            className="text-lg md:text-xl font-bold text-center mt-4 md:mt-6 md:w-4/5 "
            style={{ fontFamily: "Montserrat, sans-serif", fontSize: "25px" }}
          >
            Lorem Ipsum Dolor Sit Amet
          </h2>
        </div>

        {/* Right Section */}
        <div
        className="w-full md:w-[65%] p-10 text-[#0C0051] flex flex-col justify-center pt-10 md:pt-20"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}  
      >
          {/* Welcome Heading */}
          <h2
            className="text-xl md:text-3xl font-extrabold text-center md:text-left mt-[-10px] md:mt-[-50px] ml-4 md:ml-10 mb-4 md:mb-8"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Welcome to the ICS Alumni Tracker!
          </h2>

          {/* Description */}
          <p
            className="mt-4 text-xs md:text-sm text-center md:text-left w-full md:w-5/5 mt-[-10px] md:mt-[-1px] ml-4 md:ml-10 "
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: "400", color: "#0C0051", fontSize:"12px" }}
          >
            Sign in with your Google account to connect with fellow alumni, explore career opportunities, and stay engaged with the ICS community.
          </p>

          {/* Google Login Button */}
          <div className="flex justify-center md:justify-start">
            <button
              className="w-3/4 md:w-2/5 bg-[#0C0051] text-white py-3 px-2 rounded-full flex items-center justify-center shadow-md hover:bg-[#0A0041] transition md:text-left ml-4 md:ml-10 mt-10 md:mt-25 "
              style={{ fontFamily: "Montserrat, sans-serif", fontSize: "12px" }}
            >
              <img src="/assets/google.png" alt="Google" className="w-4 h-4 mr-2" />
              Sign in with Google
            </button>
          </div>


          {/* Support Text */}
          <p
            className="mt-20 md:mt-16 text-xs md:text-sm text-center md:text-left text-gray-500 md:w-4.5/5 ml-4 md:ml-10"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#0C0051", fontSize: "10px" }}
          >
            If you are unable to log in using your Google account, please fill out this support form to notify us: [Insert Support Form Link].
          </p>

        </div>
      </div>
    </div>
  );
}

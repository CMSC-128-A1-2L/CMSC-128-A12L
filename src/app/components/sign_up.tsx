"use client";
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import SignIn from './sign_in';

// Used motion components here, install motion from npm, u can probably use framer-motion for this, but I think that motion can also do this
// Constellation background component
const ConstellationBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById('constellation-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // only use the canvas for the left panel
    const resizeCanvas = () => {
      canvas.width = window.innerWidth / 2; 
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle configuration
    const particles: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    const particleCount = 50;
    const connectionDistance = 100;
    const particleSpeed = 0.5;

    // Create particles (this loop adds random particles to the canvas)
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * particleSpeed,
        vy: (Math.random() - 0.5) * particleSpeed,
      });
    }

    // Animation loop
    const animate = () => {
      // ctx is the rendering component for the canvas
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();

        // Connect nearby particles
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / connectionDistance)})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      id="constellation-canvas"
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  );
};

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
<<<<<<< HEAD
    return (
        <div className="h-screen flex items-center justify-center" style={{
            backgroundImage: "url('/assets/bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
            <div className="card w-110" style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
                <div className="card-body items-center">
                    <h2 className="text-info-content text-xl md:text-2xl font-extrabold" style={{ fontFamily: "Montserrat, sans-serif" }}>Create Alumni Account</h2>
                    <form onSubmit={validateInput}>
                        <div className="card-body">
                            <div className="join mb-2 gap-2 w-84">
                                <input type="text" className="input" placeholder="First Name" required />
                                <input type="text" className="input" placeholder="Last Name" required />
                            </div>
=======
>>>>>>> 0fd4ef0b245b65730032f179e9880fae507286e8

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

<<<<<<< HEAD
                        </div>
                        <div className="card-actions justify-center">
                            <button className="btn btn-wide bg-[#0C0051] text-white" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}>Sign Up</button>
                        </div>
                    </form>
                </div>
                <button onClick={() => redirect("/login")} className="btn bg-[#0C0051] text-white btn-block" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer" }}>Cancel</button>
=======
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // this function is used to handle the change of the input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      redirect('/login');
    } catch (error) {
      console.error('Sign up failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Dark Blue */}
      <div className="w-full lg:w-1/2 bg-[#1a1f4d] flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden min-h-[300px] lg:min-h-screen">
        <ConstellationBackground />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center relative z-10"
        >
          {/* Logo */}
          {/* This logo uses the SVG logo from the assets folder, I just used the d attribute to create the shape of the logo (which is also the same SVG contents if you view @AEGIS.svg) */}
          <div className="w-32 h-32 lg:w-64 lg:h-32 mx-auto">
            <svg viewBox="0 14.3 135.35 32.5" className="w-full h-full text-white">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, ease: "easeInOut" }}
                d="M11.50 28.30L21.80 28.30L22.15 29.25L10.75 29.25L11.50 28.30M34.85 45.60Q35.05 45.60 35.05 45.90Q35.05 46.20 34.85 46.20Q33.95 46.20 31.95 46.10Q30.05 46 29.15 46Q28.10 46 26.40 46.10Q24.80 46.20 24 46.20Q23.80 46.20 23.80 45.90Q23.80 45.60 24 45.60Q26.05 45.60 26.95 45.23Q27.85 44.85 27.85 43.95Q27.85 43.25 27.30 42L16 17.70L16.95 16.85L7.30 40.05Q6.60 41.75 6.60 42.85Q6.60 44.30 7.80 44.95Q9 45.60 11.55 45.60Q11.80 45.60 11.80 45.90Q11.80 46.20 11.55 46.20Q10.65 46.20 8.95 46.10Q7.05 46 5.65 46Q4.40 46 2.70 46.10Q1.20 46.20 0.25 46.20Q0 46.20 0 45.90Q0 45.60 0.25 45.60Q1.65 45.60 2.63 45.10Q3.60 44.60 4.48 43.30Q5.35 42 6.35 39.60L16.80 14.45Q16.90 14.30 17.13 14.30Q17.35 14.30 17.40 14.45L29 39.35Q30.15 41.90 31.05 43.23Q31.95 44.55 32.83 45.08Q33.70 45.60 34.85 45.60ZM37.25 46.20Q37.15 46.20 37.15 45.90Q37.15 45.60 37.25 45.60Q39.20 45.60 40.13 45.35Q41.05 45.10 41.38 44.38Q41.70 43.65 41.70 42.15L41.70 19Q41.70 17.50 41.38 16.80Q41.05 16.10 40.13 15.83Q39.20 15.55 37.25 15.55Q37.15 15.55 37.15 15.25Q37.15 14.95 37.25 14.95L57.05 14.95Q57.50 14.95 57.50 15.40L57.60 21.45Q57.60 21.60 57.33 21.60Q57.05 21.60 57.05 21.45Q57.05 18.90 55.70 17.40Q54.35 15.90 52.15 15.90L48.70 15.90Q46.80 15.90 45.90 16.15Q45 16.40 44.67 17.10Q44.35 17.80 44.35 19.30L44.35 41.95Q44.35 43.40 44.67 44.08Q45 44.75 45.88 45Q46.75 45.25 48.70 45.25L53.30 45.25Q55.30 45.25 56.72 43.50Q58.15 41.75 58.55 38.90Q58.55 38.75 58.85 38.78Q59.15 38.80 59.15 38.95Q58.70 42.10 58.70 45.45Q58.70 45.85 58.52 46.03Q58.35 46.20 57.90 46.20L37.25 46.20M55.10 34.45Q55.10 32.20 54.15 31.30Q53.20 30.40 50.80 30.40L43.10 30.40L43.10 29.45L50.95 29.45Q53.25 29.45 54.15 28.68Q55.05 27.90 55.05 26Q55.05 25.90 55.35 25.90Q55.65 25.90 55.65 26L55.60 29.95Q55.60 31.40 55.65 32.10L55.70 34.45Q55.70 34.55 55.40 34.55Q55.10 34.55 55.10 34.45ZM81.90 46.80Q76.45 46.80 72.43 44.70Q68.40 42.60 66.28 39Q64.15 35.40 64.15 30.95Q64.15 26.10 66.63 22.35Q69.10 18.60 73.43 16.50Q77.75 14.40 83.20 14.40Q85.65 14.40 87.83 14.90Q90 15.40 91.45 16.30Q91.80 16.55 91.88 16.73Q91.95 16.90 91.98 17.13Q92 17.35 92 17.45L92.60 22.70Q92.60 22.85 92.33 22.88Q92.05 22.90 92 22.75Q91.05 19.20 88.25 17.33Q85.45 15.45 81.15 15.45Q74.55 15.45 70.90 19.10Q67.25 22.75 67.25 29.20Q67.25 34 69.30 37.83Q71.35 41.65 74.98 43.80Q78.60 45.95 83.10 45.95Q85.80 45.95 87.28 45.50Q88.75 45.05 89.43 43.75Q90.10 42.45 90.10 39.90Q90.10 37.30 89.75 36.28Q89.40 35.25 88.25 34.90Q87.10 34.55 84.25 34.55Q83.95 34.55 83.95 34.15Q83.95 34 84.03 33.88Q84.10 33.75 84.20 33.75Q88.05 34 90.40 34Q92.65 34 95.20 33.85Q95.30 33.85 95.38 33.98Q95.45 34.10 95.45 34.20Q95.45 34.55 95.20 34.55Q93.90 34.50 93.35 34.88Q92.80 35.25 92.65 36.40Q92.50 37.55 92.50 40.40Q92.50 42.65 92.68 43.60Q92.85 44.55 92.85 44.80Q92.85 45.10 92.75 45.20Q92.65 45.30 92.30 45.40Q86.45 46.80 81.90 46.80ZM106.95 42.15Q106.95 43.70 107.27 44.40Q107.60 45.10 108.50 45.35Q109.40 45.60 111.40 45.60Q111.50 45.60 111.50 45.90Q111.50 46.20 111.40 46.20Q109.90 46.20 109.05 46.15L105.55 46.10L102.20 46.15Q101.30 46.20 99.75 46.20Q99.60 46.20 99.60 45.90Q99.60 45.60 99.75 45.60Q101.70 45.60 102.63 45.35Q103.55 45.10 103.90 44.38Q104.25 43.65 104.25 42.15L104.25 19Q104.25 17.50 103.90 16.80Q103.55 16.10 102.63 15.83Q101.70 15.55 99.75 15.55Q99.60 15.55 99.60 15.25Q99.60 14.95 99.75 14.95L102.20 15Q104.30 15.10 105.55 15.10Q106.95 15.10 109.05 15L111.40 14.95Q111.50 14.95 111.50 15.25Q111.50 15.55 111.40 15.55Q109.45 15.55 108.52 15.85Q107.60 16.15 107.27 16.88Q106.95 17.60 106.95 19.10L106.95 42.15ZM120.75 21Q120.75 23 121.70 24.45Q122.65 25.90 124.02 26.88Q125.40 27.85 127.85 29.30Q130.45 30.85 131.88 31.88Q133.30 32.90 134.32 34.50Q135.35 36.10 135.35 38.35Q135.35 40.70 134.20 42.63Q133.05 44.55 130.78 45.68Q128.50 46.80 125.20 46.80Q123.45 46.80 121.88 46.43Q120.30 46.05 118.40 45.10Q118.15 44.95 118.07 44.75Q118 44.55 117.95 44.15L117.20 37.65L117.20 37.60Q117.20 37.40 117.45 37.38Q117.70 37.35 117.75 37.55Q118.25 41 120.40 43.55Q122.55 46.10 126.30 46.10Q128.95 46.10 130.78 44.65Q132.60 43.20 132.60 40.10Q132.60 37.85 131.60 36.23Q130.60 34.60 129.17 33.53Q127.75 32.45 125.30 31Q122.90 29.60 121.52 28.55Q120.15 27.50 119.17 25.93Q118.20 24.35 118.20 22.15Q118.20 19.65 119.47 17.90Q120.75 16.15 122.80 15.28Q124.85 14.40 127.20 14.40Q129.95 14.40 132.90 15.60Q133.65 15.90 133.65 16.45L134.10 21.75Q134.10 21.95 133.82 21.95Q133.55 21.95 133.50 21.75Q133.30 19.15 131.55 17.10Q129.80 15.05 126.55 15.05Q123.55 15.05 122.15 16.80Q120.75 18.55 120.75 21Z"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 lg:mb-4 ml-5 mr-5" >Alumni Engagement and Guidance Interaction System</h1>
          <p className="text-white/70 text-sm lg:text-base">Connect with your alma mater.</p>
        </motion.div>
      </div>

      {/* Right Panel - Light */}
      <div className="w-full lg:w-1/2 bg-[#f8f9fc] flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-md"
        >
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1 lg:mb-2">Create Account</h2>
          <p className="text-gray-600 text-xs lg:text-sm mb-4 lg:mb-6">Join our alumni community and stay connected.</p>
          
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-xs lg:text-sm font-medium text-gray-700 mb-0.5">
                  First Name
                </label>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <input
                  tabIndex={3}
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } focus:border-[#1a1f4d] focus:ring-1 focus:ring-[#1a1f4d] transition-all text-gray-800 placeholder-gray-500 text-xs lg:text-sm`}
                    placeholder="Enter your first name"
                    required
                  />
                </motion.div>
                {errors.firstName && (
                  <p className="mt-0.5 text-xs text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-xs lg:text-sm font-medium text-gray-700 mb-0.5">
                  Last Name
                </label>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <input
                    tabIndex={3}
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } focus:border-[#1a1f4d] focus:ring-1 focus:ring-[#1a1f4d] transition-all text-gray-800 placeholder-gray-500 text-xs lg:text-sm`}
                    placeholder="Enter your last name"
                    required
                  />
                </motion.div>
                {errors.lastName && (
                  <p className="mt-0.5 text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
>>>>>>> 0fd4ef0b245b65730032f179e9880fae507286e8
            </div>

            <div>
              <label htmlFor="email" className="block text-xs lg:text-sm font-medium text-gray-700 mb-0.5">
                Email Address
              </label>
              <motion.div whileTap={{ scale: 0.98 }}>
                <input
                  tabIndex={3}
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:border-[#1a1f4d] focus:ring-1 focus:ring-[#1a1f4d] transition-all text-gray-800 placeholder-gray-500 text-xs lg:text-sm`}
                  placeholder="Enter your email"
                  required
                />
              </motion.div>
              {errors.email && (
                <p className="mt-0.5 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs lg:text-sm font-medium text-gray-700 mb-0.5">
                Password
              </label>
              <motion.div whileTap={{ scale: 0.98 }}>
                <div className="relative">
                  <input
                    tabIndex={3}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:border-[#1a1f4d] focus:ring-1 focus:ring-[#1a1f4d] transition-all text-gray-800 placeholder-gray-500 text-xs lg:text-sm pr-10`}
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xs"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </motion.div>
              {errors.password && (
                <p className="mt-0.5 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs lg:text-sm font-medium text-gray-700 mb-0.5">
                Confirm Password
              </label>
              <motion.div whileTap={{ scale: 0.98 }}>
                <div className="relative">
                  <input
                    tabIndex={3}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 lg:py-2.5 rounded-lg border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } focus:border-[#1a1f4d] focus:ring-1 focus:ring-[#1a1f4d] transition-all text-gray-800 placeholder-gray-500 text-xs lg:text-sm pr-10`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xs"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </motion.div>
              {errors.confirmPassword && (
                <p className="mt-0.5 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2 lg:space-y-3">
              <motion.button
                tabIndex={3}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2 lg:py-2.5 bg-[#1a1f4d] hover:bg-[#2a2f5d] text-white rounded-lg font-semibold transition-all shadow-md text-xs lg:text-sm flex items-center justify-center ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                style={{ cursor: "pointer" }}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </motion.button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#f8f9fc] text-gray-500">Or continue with</span>
                </div>
              </div>

              <SignIn />

              <motion.button
                tabIndex={3}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 lg:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-all text-xs lg:text-sm"
                type="button"
                onClick={() => redirect('/login')}
              >
                Already have an account? Sign in
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

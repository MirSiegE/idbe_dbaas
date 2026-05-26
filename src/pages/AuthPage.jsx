import { useState } from 'react'
import Navbar from '../components/auth/Navbar'
import LeftSection from '../components/auth/LeftSection'
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'
import Footer from '../components/auth/Footer'

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 px-8 gap-12 items-center max-w-6xl mx-auto w-full">
        
        {/* Left Side */}
        <LeftSection />

        {/* Right Side - Auth Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {isLogin ? (
            <LoginForm onSwitch={() => setIsLogin(false)} />
          ) : (
            <SignupForm onSwitch={() => setIsLogin(true)} />
          )}
        </div>

      </div>

      {/* Footer */}
      <Footer />

    </div>
  )
}

export default AuthPage
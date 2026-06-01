import { useNavigate } from 'react-router-dom'
import { resetNewUserProjects, setDemoUserMode } from '../../data/demoProjects'

function SignupForm({ onSwitch }) {
  const navigate = useNavigate()

  const handleSignup = () => {
    setDemoUserMode('new')
    resetNewUserProjects()
    navigate('/dashboard')
  }

  return (
    <div className="space-y-4">

      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
        <p className="text-gray-500 text-sm mt-1">
          Get started with InteliDB Enterprise
        </p>
      </div>

      {/* Username */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Username
        </label>
        <input
          type="text"
          placeholder="Choose a username"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Email address
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Create Password */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Create password
        </label>
        <input
          type="password"
          placeholder="Create a password"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Confirm password
        </label>
        <input
          type="password"
          placeholder="Confirm your password"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Create Account Button */}
      <button
        onClick={handleSignup}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        Create account
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs text-gray-400">or continue with</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Google Button */}
      <button className="w-full border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
        <span className="font-bold text-blue-500">G</span>
        Continue with Google
      </button>

      {/* Microsoft Button */}
      <button className="w-full border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
        <span>⊞</span>
        Continue with Microsoft
      </button>

      {/* Switch to Login */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-blue-600 font-semibold hover:underline"
        >
          Sign in
        </button>
      </p>

    </div>
  )
}

export default SignupForm

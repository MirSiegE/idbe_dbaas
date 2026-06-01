import { useNavigate } from 'react-router-dom'
import { setDemoUserMode } from '../../data/demoProjects'

function LoginForm({ onSwitch }) {
  const navigate = useNavigate()

  const handleLogin = () => {
    setDemoUserMode('existing')
    navigate('/dashboard')
  }

  return (
    <div className="space-y-4">

      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-500 text-sm mt-1">
          Sign in to your InteliDB Enterprise account
        </p>
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

      {/* Password */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Remember me and Forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" className="rounded" />
          Remember me
        </label>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Sign in Button */}
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        Sign in
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

      {/* Switch to Signup */}
      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-blue-600 font-semibold hover:underline"
        >
          Sign up
        </button>
      </p>

    </div>
  )
}

export default LoginForm

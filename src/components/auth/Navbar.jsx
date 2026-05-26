import logo from '../../assets/logo.png'

function Navbar() {
  return (
    <nav className="flex items-center px-8 py-4">
      <div className="flex items-center gap-2">
        <img 
          src={logo} 
          alt="InteliDB Logo" 
          className="w-10 h-10 rounded-full"
        />
        <span className="font-bold text-gray-800 text-lg">InteliDB</span>
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full ml-1">
          Enterprise
        </span>
      </div>
    </nav>
  )
}

export default Navbar
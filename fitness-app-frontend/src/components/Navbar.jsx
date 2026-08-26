import { Link, useNavigate } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

const Navbar = () => {
  const { token, logIn, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-white px-6 py-3.5 flex items-center justify-between shadow-lg">
      <Link to="/" className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
        FITNESS.AI
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
        <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
        {token && <Link to="/activities" className="hover:text-cyan-400 transition">Activities</Link>}
        <Link to="/about" className="hover:text-cyan-400 transition">About</Link>
        <Link to="/contact" className="hover:text-cyan-400 transition">Contact</Link>
      </div>

      <div className="flex items-center gap-3">
        {token ? (
          <button
            onClick={logOut}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md transition"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => logIn()}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => logIn()}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg transition"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
import { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { Link } from 'react-router';

const HomePage = () => {
  const { token, logIn } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4">
      <span className="px-3.5 py-1 text-xs font-semibold tracking-wide text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 rounded-full mb-4">
        AI-Powered Fitness Microservices
      </span>
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
        Track Your Workouts with <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">Smart Intelligence</span>
      </h1>
      <p className="mt-4 text-slate-400 max-w-xl text-base">
        Real-time Kafka streaming, automated calorie metrics, and intelligent recommendation engine.
      </p>

      <div className="mt-8 flex gap-4">
        {token ? (
          <Link to="/activities" className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition">
            View My Activities &rarr;
          </Link>
        ) : (
          <button onClick={() => logIn()} className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition">
            Get Started Free
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
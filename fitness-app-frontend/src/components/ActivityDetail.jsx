import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import AiLoader from './AiLoader';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(true);
  const pollingRef = useRef(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15; // 15 attempts * 1.5s = ~22 seconds timeout

    // 1. Fetch Activity Details
    const fetchActivity = async () => {
      try {
        const actRes = await axios.get(`http://localhost:8080/api/activities/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        });
        setActivity(actRes.data);
      } catch (err) {
        console.error('Failed to load activity:', err);
      } finally {
        setLoading(false);
      }
    };

    // 2. Poll for Recommendation until generated
    const fetchRecommendation = async () => {
      try {
        const recRes = await axios.get(`http://localhost:8080/api/recommendations/activity/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        });

        if (recRes.data && (recRes.data.recommendation || recRes.data.improvements?.length > 0)) {
          setRecommendation(recRes.data);
          setRecLoading(false);
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      } catch (err) {
        attempts++;
        if (attempts >= maxAttempts) {
          setRecLoading(false);
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      }
    };

    fetchActivity();
    setRecLoading(true);
    fetchRecommendation();

    // Start auto-retry polling every 1.5s
    pollingRef.current = setInterval(() => {
      if (attempts < maxAttempts) {
        fetchRecommendation();
      } else {
        clearInterval(pollingRef.current);
      }
    }, 1500);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [id]);

  if (loading) return <AiLoader message="Loading activity details..." />;

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-slate-400 mb-4 text-base">Activity could not be loaded.</p>
        <button
          onClick={() => navigate('/activities')}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
        >
          &larr; Back to Activities
        </button>
      </div>
    );
  }

  const rawText = recommendation?.recommendation || recommendation?.analysis || '';
  const formattedAnalysis = rawText.replace(/\\n/g, '\n').trim();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <button
        onClick={() => navigate('/activities')}
        className="text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition cursor-pointer"
      >
        &larr; Back to Activities
      </button>

      {/* Activity Overview Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <h2 className="text-2xl font-black text-white tracking-wide">{activity.type}</h2>
          <span className="text-xs text-slate-400">
            {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'Recent Activity'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400 uppercase font-semibold">Duration</span>
            <p className="text-xl font-bold text-cyan-400 mt-1">{activity.duration} Mins</p>
          </div>
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400 uppercase font-semibold">Calories Burned</span>
            <p className="text-xl font-bold text-rose-400 mt-1">{activity.caloriesBurned} kcal</p>
          </div>
        </div>
      </div>

      {/* AI Insights & Recommendation Section */}
      <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${recLoading ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`}></div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
            AI Recommendation & Insights
          </h3>
        </div>

        {recLoading ? (
          /* Prominent Large AI Loader */
          <div className="py-14 px-6 flex flex-col items-center justify-center space-y-6 bg-slate-950/60 rounded-2xl border border-indigo-500/20 shadow-inner text-center">
            <div className="relative flex items-center justify-center w-20 h-20">
              {/* Outer Glowing Pulsing Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping"></div>
              {/* Spinning Ring */}
              <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-400 border-r-indigo-500 rounded-full animate-spin"></div>
              {/* Center Tech Core */}
              <div className="absolute w-6 h-6 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></div>
            </div>

            <div className="space-y-1.5">
              <p className="text-base font-bold bg-gradient-to-r from-cyan-300 via-indigo-200 to-white bg-clip-text text-transparent">
                Analyzing Workout & Generating Insights
              </p>
              <p className="text-xs text-slate-400">
                Streaming personalized metrics via Kafka & Google AI...
              </p>
            </div>
          </div>
        ) : recommendation ? (
          <div className="space-y-5">
            {formattedAnalysis && (
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-5 text-slate-300 text-sm leading-relaxed whitespace-pre-line shadow-inner">
                {formattedAnalysis}
              </div>
            )}

            {recommendation.improvements?.length > 0 && (
              <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Target Improvements
                </h4>
                <ul className="space-y-2">
                  {recommendation.improvements.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-2.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendation.suggestions?.length > 0 && (
              <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Workout Suggestions
                </h4>
                <ul className="space-y-2">
                  {recommendation.suggestions.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-2.5">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendation.safety?.length > 0 && (
              <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Safety & Recovery Guidelines
                </h4>
                <ul className="space-y-2">
                  {recommendation.safety.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-2.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            Recommendation taking longer than expected. Please check back shortly.
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityDetail;
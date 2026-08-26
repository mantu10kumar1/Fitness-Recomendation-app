import React, { useState } from 'react';
import { addActivity } from '../services/api';

const ActivityForm = ({ onActivitiesAdded }) => {
  const [activity, setActivity] = useState({
    type: 'RUNNING',
    duration: '',
    caloriesBurned: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addActivity(activity);
      if (onActivitiesAdded) onActivitiesAdded();
      setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '' });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Activity Type */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
            Activity Type
          </label>
          <select
            value={activity.type}
            onChange={(e) => setActivity({ ...activity, type: e.target.value })}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          >
            <option value="RUNNING" className="bg-slate-900">🏃 Running</option>
            <option value="WALKING" className="bg-slate-900">🚶 Walking</option>
            <option value="CYCLING" className="bg-slate-900">🚴 Cycling</option>
          </select>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
            Duration (Mins)
          </label>
          <input
            type="number"
            required
            placeholder="e.g. 45"
            value={activity.duration}
            onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          />
        </div>

        {/* Calories Burned */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
            Calories Burned
          </label>
          <input
            type="number"
            required
            placeholder="e.g. 320"
            value={activity.caloriesBurned}
            onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-md shadow-cyan-500/20 active:scale-[0.98] transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Adding Activity...' : '+ Add Activity'}
      </button>
    </form>
  );
};

export default ActivityForm;
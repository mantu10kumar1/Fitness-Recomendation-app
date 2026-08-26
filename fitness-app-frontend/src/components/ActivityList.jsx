import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getActivities } from '../services/api';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'RUNNING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'CYCLING':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-400 animate-pulse">Loading activities...</p>;
  }

  if (activities.length === 0) {
    return <p className="text-sm text-slate-500">No activities recorded yet. Add your first one above!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          onClick={() => navigate(`/activities/${activity.id}`)}
          className="group relative bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(activity.type)}`}>
                {activity.type}
              </span>
              <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition">
                View &rarr;
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Duration:</span>
                <span className="font-semibold text-slate-200">{activity.duration} mins</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Calories:</span>
                <span className="font-semibold text-rose-400">{activity.caloriesBurned} kcal</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
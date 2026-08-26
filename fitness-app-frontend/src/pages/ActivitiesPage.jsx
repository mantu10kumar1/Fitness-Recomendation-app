import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";

const ActivitiesPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-4">Log New Activity</h2>
        <ActivityForm onActivitiesAdded={() => window.location.reload()} />
      </div>
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-4">Your Recorded Activities</h2>
        <ActivityList />
      </div>
    </div>
  );
};

export default ActivitiesPage;
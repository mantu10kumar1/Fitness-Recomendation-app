import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  CircularProgress,
  Button
} from '@mui/material';

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
    const maxAttempts = 30; // 30 attempts * 2s = 60s timeout

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

    // 2. Poll for Recommendation from AI Service
    const fetchRecommendation = async () => {
      try {
        const recRes = await axios.get(`http://localhost:8080/api/recommendations/activity/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        });

        if (recRes.status === 200 && recRes.data) {
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

    pollingRef.current = setInterval(() => {
      if (attempts < maxAttempts) {
        fetchRecommendation();
      } else {
        setRecLoading(false);
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
    }, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 2 }}>
        <CircularProgress color="primary" />
        <Typography variant="body1">Loading activity details...</Typography>
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>Activity not found.</Typography>
        <Button variant="contained" onClick={() => navigate('/activities')}>Back to Activities</Button>
      </Box>
    );
  }

  // Format analysis text properly
  const rawText = recommendation?.recommendation || recommendation?.analysis || '';
  const formattedAnalysis = rawText.replace(/\\n/g, '\n').trim();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Button
        variant="text"
        onClick={() => navigate('/activities')}
        sx={{ mb: 2 }}
      >
        &larr; Back to Activities
      </Button>

      {/* Activity Details Card */}
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            Activity Details
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}><strong>Type:</strong> {activity.type}</Typography>
          <Typography variant="body1"><strong>Duration:</strong> {activity.duration} minutes</Typography>
          <Typography variant="body1"><strong>Calories Burned:</strong> {activity.caloriesBurned} kcal</Typography>
          <Typography variant="body1">
            <strong>Date:</strong> {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'Recent Activity'}
          </Typography>
        </CardContent>
      </Card>

      {/* AI Recommendation Card */}
      <Card sx={{ boxShadow: 4, border: '1px solid rgba(0, 150, 255, 0.2)' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            AI Recommendation & Insights
          </Typography>

          {recLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5, gap: 2 }}>
              <CircularProgress size={45} color="secondary" />
              <Typography variant="body2" color="text.secondary">
                Analyzing workout data & generating personalized AI feedback...
              </Typography>
            </Box>
          ) : recommendation ? (
            <Box sx={{ mt: 2 }}>
              {/* Overall Analysis */}
              {formattedAnalysis && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Analysis</Typography>
                  <Typography paragraph sx={{ whiteSpace: 'pre-line', color: 'text.secondary', mt: 1 }}>
                    {formattedAnalysis}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Target Improvements */}
              {recommendation?.improvements?.length > 0 && (
                <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Target Improvements
                  </h4>
                  <ul className="space-y-2">
                    {recommendation.improvements.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start gap-2.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>
                          {typeof item === 'string'
                            ? item
                            : `${item.area || item.improvement || ''}: ${item.recommendation || ''}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Workout Suggestions */}
              {recommendation?.suggestions?.length > 0 && (
                <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Workout Suggestions
                  </h4>
                  <ul className="space-y-2">
                    {recommendation.suggestions.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start gap-2.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>
                          {typeof item === 'string'
                            ? item
                            : `${item.workout || item.suggestion || ''}: ${item.description || ''}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
                  <Divider sx={{ my: 2 }} />
                </>
              )}

              {/* Safety */}
              {recommendation.safety?.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                    Safety & Recovery Guidelines
                  </Typography>
                  {recommendation.safety.map((safetyItem, index) => (
                    <Typography key={index} paragraph sx={{ mb: 1, pl: 1 }}>
                      • {typeof safetyItem === 'string' ? safetyItem : safetyItem.description || JSON.stringify(safetyItem)}
                    </Typography>
                  ))}
                </>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Recommendation is currently being processed or unavailable. Please check back in a few moments.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityDetail;
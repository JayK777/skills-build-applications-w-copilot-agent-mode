import React, { useState, useEffect } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
        console.log('Fetching workouts from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts data received:', data);
        
        // Handle both paginated and plain array responses
        const workoutsData = data.results || data;
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const getDifficultyColor = (difficulty) => {
    const level = difficulty ? difficulty.toLowerCase() : 'medium';
    if (level === 'easy') return 'success';
    if (level === 'medium') return 'warning';
    if (level === 'hard') return 'danger';
    return 'info';
  };

  const getWorkoutIcon = (type) => {
    const workoutType = type ? type.toLowerCase() : '';
    if (workoutType.includes('cardio')) return '🏃';
    if (workoutType.includes('strength')) return '💪';
    if (workoutType.includes('yoga')) return '🧘';
    if (workoutType.includes('flexibility')) return '🤸';
    return '🏋️';
  };

  return (
    <div className="container-fluid py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-5 fw-bold">💪 Workouts</h1>
          <p className="lead text-muted">Personalized workout suggestions and programs</p>
        </div>
      </div>

      {loading && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info d-flex align-items-center" role="alert">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div>Loading workouts...</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error!</strong> {error}
              <button type="button" className="btn-close" onClick={() => window.location.reload()} aria-label="Close"></button>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="row mb-4">
            <div className="col-12">
              <button className="btn btn-primary">+ Schedule Workout</button>
            </div>
          </div>

          {workouts.length > 0 ? (
            <div className="row">
              {workouts.map((workout) => (
                <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-header bg-primary text-white">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">{getWorkoutIcon(workout.workout_type)} {workout.name}</h5>
                        <span className="badge bg-light text-dark">#{workout.id}</span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <strong>Type:</strong>
                        <p className="card-text">{workout.workout_type}</p>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <strong>Duration</strong>
                          <p className="card-text text-primary">{workout.duration} min</p>
                        </div>
                        <div className="col-6">
                          <strong>Difficulty</strong>
                          <div className="mt-1">
                            <span className={`badge bg-${getDifficultyColor(workout.difficulty)}`}>
                              {workout.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-light">
                      <button className="btn btn-sm btn-primary w-100">Start Workout</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                <div className="alert alert-warning" role="alert">
                  No workouts available. <a href="#" className="alert-link">Check back soon for personalized suggestions</a>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Workouts;

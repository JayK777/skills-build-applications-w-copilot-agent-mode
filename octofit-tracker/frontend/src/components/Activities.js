import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
        console.log('Fetching activities from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities data received:', data);
        
        // Handle both paginated and plain array responses
        const activitiesData = data.results || data;
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="container-fluid py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-5 fw-bold">🏃 Activities</h1>
          <p className="lead text-muted">Track and view all fitness activities</p>
        </div>
      </div>

      {loading && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info d-flex align-items-center" role="alert">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div>Loading activities...</div>
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
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="card-title mb-0">Total Activities: {activities.length}</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover table-striped mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-bold">ID</th>
                        <th className="fw-bold">User</th>
                        <th className="fw-bold">Activity Type</th>
                        <th className="fw-bold">Duration (min)</th>
                        <th className="fw-bold">Date</th>
                        <th className="fw-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.length > 0 ? (
                        activities.map((activity) => (
                          <tr key={activity.id}>
                            <td><span className="badge bg-secondary">{activity.id}</span></td>
                            <td className="fw-medium">{activity.user}</td>
                            <td><span className="badge bg-info">{activity.activity_type}</span></td>
                            <td>{activity.duration}</td>
                            <td>{new Date(activity.date).toLocaleDateString()}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-success">Detail</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-muted">
                            <p className="mb-0">No activities found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;

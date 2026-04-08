import React, { useState, useEffect } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
        console.log('Fetching teams from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Teams data received:', data);
        
        // Handle both paginated and plain array responses
        const teamsData = data.results || data;
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="container-fluid py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-5 fw-bold">👨‍👩‍👧‍👦 Teams</h1>
          <p className="lead text-muted">Create and manage your fitness teams</p>
        </div>
      </div>

      {loading && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info d-flex align-items-center" role="alert">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div>Loading teams...</div>
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
              <button className="btn btn-primary">+ Create Team</button>
            </div>
          </div>

          {teams.length > 0 ? (
            <div className="row">
              {teams.map((team) => (
                <div key={team.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card shadow-sm h-100">
                    <div className="card-header bg-warning">
                      <h5 className="card-title mb-0">{team.name}</h5>
                    </div>
                    <div className="card-body">
                      <p className="card-text text-muted">{team.description}</p>
                      <div className="mb-3">
                        <strong>Members:</strong>
                        <span className="badge bg-primary ms-2">{team.members ? team.members.length : 0}</span>
                      </div>
                    </div>
                    <div className="card-footer bg-light">
                      <button className="btn btn-sm btn-outline-warning">Edit</button>
                      <button className="btn btn-sm btn-outline-danger ms-2">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                <div className="alert alert-warning" role="alert">
                  No teams found. <a href="#" className="alert-link">Create your first team</a>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Teams;

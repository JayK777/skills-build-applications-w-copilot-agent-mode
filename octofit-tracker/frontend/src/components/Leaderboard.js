import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
        console.log('Fetching leaderboard from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Leaderboard data received:', data);
        
        // Handle both paginated and plain array responses
        const leaderboardData = data.results || data;
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="container-fluid py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-5 fw-bold">🏆 Leaderboard</h1>
          <p className="lead text-muted">Compete and climb to the top</p>
        </div>
      </div>

      {loading && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info d-flex align-items-center" role="alert">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div>Loading leaderboard...</div>
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
              <div className="card-header bg-danger text-white">
                <h5 className="card-title mb-0">Top {leaderboard.length} Athletes</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="fw-bold">Rank</th>
                        <th className="fw-bold">User</th>
                        <th className="fw-bold text-end">Points</th>
                        <th className="fw-bold text-end">Activities</th>
                        <th className="fw-bold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.length > 0 ? (
                        leaderboard.map((entry, index) => {
                          const rank = index + 1;
                          return (
                            <tr key={entry.id || index} className={rank <= 3 ? 'table-warning' : ''}>
                              <td className="fw-bold" style={{ fontSize: '1.25rem' }}>
                                {getRankMedal(rank)}
                              </td>
                              <td>
                                <strong>{entry.user}</strong>
                              </td>
                              <td className="text-end">
                                <span className="badge bg-success" style={{ fontSize: '0.9rem' }}>
                                  {entry.points}
                                </span>
                              </td>
                              <td className="text-end">
                                <span className="badge bg-info">
                                  {entry.activities_count}
                                </span>
                              </td>
                              <td className="text-center">
                                {rank === 1 && <span className="badge bg-danger">Leading</span>}
                                {rank === 2 && <span className="badge bg-secondary">Close</span>}
                                {rank > 2 && <span className="badge bg-light text-dark">Active</span>}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted">
                            <p className="mb-0">No leaderboard data found</p>
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

export default Leaderboard;

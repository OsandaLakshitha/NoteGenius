import React from "react";
import {
  useAllusersQuery,
  useGetAdminStatsQuery,
} from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useAllusersQuery();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useGetAdminStatsQuery();

  if (usersLoading || statsLoading) {
    return <Loader />;
  }

  if (usersError || statsError) {
    return (
      <div className="admin-error">
        <h2>Error loading admin data</h2>
        <p>
          {usersError?.data?.message ||
            statsError?.data?.message ||
            "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and view system statistics</p>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <h2>System Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>Total Notes</h3>
              <p className="stat-number">{stats?.totalNotes || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✍️</div>
            <div className="stat-info">
              <h3>Handwritten Notes</h3>
              <p className="stat-number">{stats?.handwrittenNotes || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎤</div>
            <div className="stat-info">
              <h3>Voice Notes</h3>
              <p className="stat-number">{stats?.voiceNotes || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-info">
              <h3>Structured Text</h3>
              <p className="stat-number">{stats?.structuredText || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-info">
              <h3>Folders</h3>
              <p className="stat-number">{stats?.folders || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏷️</div>
            <div className="stat-info">
              <h3>Tags</h3>
              <p className="stat-number">{stats?.tags || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="users-section">
        <h2>All Users</h2>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-users">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

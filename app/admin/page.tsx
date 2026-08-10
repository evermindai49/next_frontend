"use client";

import React, { useEffect, useState } from "react";
import { generateExercise, getUsersList, getAdminAnalytics, deleteUser } from "@/lib/api";
import { User, AdminAnalytics } from "@/lib/types";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [usersData, analyticsData] = await Promise.all([
          getUsersList(),
          getAdminAnalytics(),
        ]);
        setUsers(usersData);
        setAnalytics(analyticsData);
      } catch (err: any) {
        setError(err.message || "Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert("Failed to delete user: " + err.message);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading Admin Dashboard...</div>;
  }

  return (
    <main style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#0f172a", marginBottom: "24px" }}>Admin Console</h1>

      {error && (
        <div style={{ padding: "12px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "6px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {analytics && (
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
          <div style={{ padding: "20px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
            <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Total Users</span>
            <p style={{ fontSize: "1.8rem", fontWeight: 700, margin: "8px 0 0 0", color: "#2563eb" }}>
              {analytics.totalUsers}
            </p>
          </div>
          <div style={{ padding: "20px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
            <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Total Paths Generated</span>
            <p style={{ fontSize: "1.8rem", fontWeight: 700, margin: "8px 0 0 0", color: "#059669" }}>
              {analytics.totalPaths}
            </p>
          </div>
        </section>
      )}

      <section style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "24px" }}>
        <h2 style={{ marginTop: 0, color: "#1e293b" }}>Registered Users</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "12px 8px" }}>ID</th>
              <th style={{ padding: "12px 8px" }}>Name</th>
              <th style={{ padding: "12px 8px" }}>Email</th>
              <th style={{ padding: "12px 8px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 8px", color: "#64748b" }}>{user.id}</td>
                <td style={{ padding: "12px 8px", fontWeight: 500 }}>{user.name}</td>
                <td style={{ padding: "12px 8px", color: "#334155" }}>{user.email}</td>
                <td style={{ padding: "12px 8px", textAlign: "right" }}>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#fee2e2",
                      color: "#991b1b",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
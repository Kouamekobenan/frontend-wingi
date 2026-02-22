"use client";

import { FindAllUserUseCase } from "@/app/backend/module/users/application/usecases/findAll.user";
import { User } from "@/app/backend/module/users/domain/entities/user.entity";
import { UserRepository } from "@/app/backend/module/users/infrastructure/user-repository.impl";
import React, { useEffect, useState } from "react";

// ── Bootstrap ──────────────────────────────────────────────────────────────────
const userRepo = new UserRepository();
const findAllUsersUseCase = new FindAllUserUseCase(userRepo);

// ── Icons ──────────────────────────────────────────────────────────────────────
const Icon = {
  Search: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      width={16}
      height={16}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  ),
  User: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={22}
      height={22}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  ),
  Mail: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={14}
      height={14}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" strokeLinecap="round" />
    </svg>
  ),
  Pin: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={14}
      height={14}
    >
      <path d="M12 21s-7-6.5-7-11a7 7 0 0114 0c0 4.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  Shield: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={13}
      height={13}
    >
      <path d="M12 3L4 7v5c0 5 4 9 8 10 4-1 8-5 8-10V7l-8-4z" />
    </svg>
  ),
  Spinner: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      width={20}
      height={20}
      className="ua-spin"
    >
      <path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        strokeLinecap="round"
      />
    </svg>
  ),
  Users: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={18}
      height={18}
    >
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21v-1a7 7 0 0114 0v1" strokeLinecap="round" />
      <path
        d="M22 21v-1a5 5 0 00-4-4.9M16 3.1a5 5 0 010 7.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  Filter: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      width={15}
      height={15}
    >
      <path
        d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ── Role badge config ──────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  ADMIN: { label: "Admin", color: "#c9a96e", bg: "#2a1e0a" },
  USER: { label: "Client", color: "#6eb5c9", bg: "#0a1e2a" },
  MANAGER: { label: "Manager", color: "#a06ec9", bg: "#1e0a2a" },
};
const roleFor = (role: string) =>
  ROLE_CONFIG[role?.toUpperCase()] ?? {
    label: role ?? "—",
    color: "#888",
    bg: "#1a1a1a",
  };

// ── Avatar initials ────────────────────────────────────────────────────────────
const initials = (u: User) =>
  `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase() || "?";

const AVATAR_COLORS = [
  ["#c9a96e", "#3a2510"],
  ["#6ec9a0", "#0a2a1e"],
  ["#6eb5c9", "#0a1e2a"],
  ["#c96e6e", "#2a0a0a"],
  ["#a06ec9", "#1e0a2a"],
];
const avatarColor = (id: string) => {
  const idx = (id?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await findAllUsersUseCase.execute();
      setUsers(allUsers);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const roles = [
    "ALL",
    ...Array.from(
      new Set(users.map((u) => u.role?.toUpperCase()).filter(Boolean)),
    ),
  ];

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.address?.toLowerCase().includes(q);
    const matchRole =
      roleFilter === "ALL" || u.role?.toUpperCase() === roleFilter;
    return matchSearch && matchRole;
  });

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ua-root {
          font-family: 'DM Sans', sans-serif;
          background: #0d0d0f;
          min-height: 100vh;
          color: #e8e4dc;
          padding: 32px 24px 80px;
        }

        /* ── Header ── */
        .ua-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 36px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .ua-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #e8e4dc 0%, #a09888 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ua-subtitle {
          font-size: 13px;
          color: #6b6458;
          margin-top: 2px;
          letter-spacing: 0.04em;
        }

        /* ── Stats row ── */
        .ua-stats {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .ua-stat {
          background: #161618;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 140px;
        }
        .ua-stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ua-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #f0e8d8;
          line-height: 1;
        }
        .ua-stat-lbl {
          font-size: 11px;
          color: #6b6458;
          margin-top: 2px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* ── Toolbar ── */
        .ua-toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .ua-search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
        }
        .ua-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #555;
          pointer-events: none;
        }
        .ua-search {
          width: 100%;
          background: #161618;
          border: 1px solid #222;
          border-radius: 10px;
          color: #e8e4dc;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 11px 14px 11px 40px;
          outline: none;
          transition: border-color 0.15s;
        }
        .ua-search:focus { border-color: #3a3530; }
        .ua-search::placeholder { color: #444; }

        .ua-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }
        .ua-filter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 9px;
          border: 1px solid #222;
          background: #161618;
          color: #6b6458;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .ua-filter-btn:hover { border-color: #3a3530; color: #aaa; }
        .ua-filter-btn.active {
          border-color: #c9a96e44;
          background: #1e1a12;
          color: #c9a96e;
        }

        /* ── Count ── */
        .ua-count {
          font-size: 12px;
          color: #4a4540;
          margin-bottom: 16px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── Table wrapper ── */
        .ua-table-wrap {
          background: #161618;
          border: 1px solid #222;
          border-radius: 16px;
          overflow: hidden;
        }

        /* ── Table ── */
        .ua-table {
          width: 100%;
          border-collapse: collapse;
        }
        .ua-table thead tr {
          border-bottom: 1px solid #1e1e1e;
        }
        .ua-table th {
          padding: 13px 20px;
          text-align: left;
          font-size: 11px;
          font-weight: 500;
          color: #4a4540;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .ua-table tbody tr {
          border-bottom: 1px solid #1a1a1a;
          transition: background 0.12s;
        }
        .ua-table tbody tr:last-child { border-bottom: none; }
        .ua-table tbody tr:hover { background: #1a1a1c; }
        .ua-table td {
          padding: 14px 20px;
          font-size: 14px;
          vertical-align: middle;
        }

        /* ── Avatar ── */
        .ua-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          flex-shrink: 0;
        }
        .ua-user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ua-user-name {
          font-weight: 500;
          color: #e8e4dc;
          font-size: 14px;
        }
        .ua-user-id {
          font-size: 11px;
          color: #3a3530;
          margin-top: 1px;
          font-family: monospace;
        }

        /* ── Email cell ── */
        .ua-email {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #7a7060;
          font-size: 13px;
        }

        /* ── Address cell ── */
        .ua-address {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #6b6458;
          font-size: 13px;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Role badge ── */
        .ua-role {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-family: 'Syne', sans-serif;
          white-space: nowrap;
        }

        /* ── Mobile cards ── */
        .ua-cards {
          display: none;
          flex-direction: column;
          gap: 12px;
        }
        .ua-card {
          background: #161618;
          border: 1px solid #222;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: border-color 0.15s;
        }
        .ua-card:hover { border-color: #2e2e2e; }
        .ua-card-body { flex: 1; min-width: 0; }
        .ua-card-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: #f0e8d8;
          margin-bottom: 6px;
        }
        .ua-card-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6b6458;
          margin-bottom: 3px;
        }
        .ua-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }

        /* ── Loading / Empty ── */
        .ua-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 14px;
          color: #4a4540;
          font-size: 14px;
        }
        .ua-empty {
          text-align: center;
          padding: 60px 20px;
          color: #3a3530;
        }
        .ua-empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #4a4540;
          margin-bottom: 6px;
        }

        @keyframes ua-spin { to { transform: rotate(360deg); } }
        .ua-spin { animation: ua-spin 0.8s linear infinite; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .ua-table-wrap { display: none; }
          .ua-cards { display: flex; }
          .ua-stat { min-width: 0; flex: 1; }
        }
        @media (max-width: 480px) {
          .ua-root { padding: 20px 14px 60px; }
          .ua-stats { gap: 8px; }
        }
      `}</style>

      <div className="ua-root">
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="ua-header">
          <div>
            <h1 className="ua-title">Utilisateurs</h1>
            <p className="ua-subtitle">Gestion des comptes</p>
          </div>
        </div>

        {loading ? (
          <div className="ua-loading">
            <Icon.Spinner />
            Chargement des utilisateurs…
          </div>
        ) : (
          <>
            {/* ── Stats ──────────────────────────────────────────────────────── */}
            <div className="ua-stats">
              <div className="ua-stat">
                <div className="ua-stat-icon" style={{ background: "#1e1a12" }}>
                  <Icon.Users />
                </div>
                <div>
                  <div className="ua-stat-val">{users.length}</div>
                  <div className="ua-stat-lbl">Total</div>
                </div>
              </div>
              {Object.entries(ROLE_CONFIG).map(([role, cfg]) => {
                const count = users.filter(
                  (u) => u.role?.toUpperCase() === role,
                ).length;
                if (!count) return null;
                return (
                  <div className="ua-stat" key={role}>
                    <div
                      className="ua-stat-icon"
                      style={{ background: cfg.bg }}
                    >
                      <Icon.Shield />
                    </div>
                    <div>
                      <div className="ua-stat-val" style={{ color: cfg.color }}>
                        {count}
                      </div>
                      <div className="ua-stat-lbl">{cfg.label}s</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Toolbar ────────────────────────────────────────────────────── */}
            <div className="ua-toolbar">
              <div className="ua-search-wrap">
                <span className="ua-search-icon">
                  <Icon.Search />
                </span>
                <input
                  className="ua-search"
                  placeholder="Rechercher par nom, email, adresse…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="ua-filters">
                <Icon.Filter />
                {roles.map((r) => (
                  <button
                    key={r}
                    className={`ua-filter-btn ${roleFilter === r ? "active" : ""}`}
                    onClick={() => setRoleFilter(r)}
                  >
                    {r === "ALL" ? "Tous" : (ROLE_CONFIG[r]?.label ?? r)}
                  </button>
                ))}
              </div>
            </div>

            <p className="ua-count">
              {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}
            </p>

            {filtered.length === 0 ? (
              <div className="ua-empty">
                <p className="ua-empty-title">Aucun résultat</p>
                <p style={{ fontSize: 13 }}>
                  Essayez un autre filtre ou terme de recherche.
                </p>
              </div>
            ) : (
              <>
                {/* ── Desktop table ─────────────────────────────────────────── */}
                <div className="ua-table-wrap">
                  <table className="ua-table">
                    <thead>
                      <tr>
                        <th>Utilisateur</th>
                        <th>Email</th>
                        <th>Adresse</th>
                        <th>Rôle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((user) => {
                        const [fg, bg] = avatarColor(user.id ?? user.email);
                        const role = roleFor(user.role);
                        return (
                          <tr key={user.id ?? user.email}>
                            <td>
                              <div className="ua-user-cell">
                                <div
                                  className="ua-avatar"
                                  style={{ background: bg, color: fg }}
                                >
                                  {initials(user)}
                                </div>
                                <div>
                                  <div className="ua-user-name">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  {user.id && (
                                    <div className="ua-user-id">
                                      #{user.id.slice(0, 8)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="ua-email">
                                <Icon.Mail />
                                {user.email ?? "—"}
                              </div>
                            </td>
                            <td>
                              <div className="ua-address">
                                {user.address ? (
                                  <>
                                    <Icon.Pin />
                                    {user.address}
                                  </>
                                ) : (
                                  "—"
                                )}
                              </div>
                            </td>
                            <td>
                              <span
                                className="ua-role"
                                style={{
                                  color: role.color,
                                  background: role.bg,
                                }}
                              >
                                <Icon.Shield />
                                {role.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ── Mobile cards ──────────────────────────────────────────── */}
                <div className="ua-cards">
                  {filtered.map((user) => {
                    const [fg, bg] = avatarColor(user.id ?? user.email);
                    const role = roleFor(user.role);
                    return (
                      <div key={user.id ?? user.email} className="ua-card">
                        <div
                          className="ua-avatar"
                          style={{
                            background: bg,
                            color: fg,
                            width: 42,
                            height: 42,
                            fontSize: 15,
                          }}
                        >
                          {initials(user)}
                        </div>
                        <div className="ua-card-body">
                          <div className="ua-card-name">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="ua-card-row">
                            <Icon.Mail />
                            {user.email ?? "—"}
                          </div>
                          {user.address && (
                            <div className="ua-card-row">
                              <Icon.Pin />
                              {user.address}
                            </div>
                          )}
                          <div className="ua-card-footer">
                            {user.id && (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "#3a3530",
                                  fontFamily: "monospace",
                                }}
                              >
                                #{user.id.slice(0, 8)}
                              </span>
                            )}
                            <span
                              className="ua-role"
                              style={{ color: role.color, background: role.bg }}
                            >
                              <Icon.Shield />
                              {role.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

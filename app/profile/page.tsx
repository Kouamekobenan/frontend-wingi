"use client";
import React from "react";
import Profile from "./UserInfo";
import ProfileOrdersPage from "./Profile";

export default function ProfilePage() {
  return (
    <>
      <style>{`
        .pp-root {
          display: flex;
          min-height: 100vh;
          background: #0b0b0f;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Left sidebar (profile info) ── */
        .pp-sidebar {
          width: 380px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          border-right: 1px solid #1e1c24;
          background: #0f0e11;
          scrollbar-width: thin;
          scrollbar-color: #2e2b35 transparent;
        }
        .pp-sidebar::-webkit-scrollbar { width: 4px; }
        .pp-sidebar::-webkit-scrollbar-track { background: transparent; }
        .pp-sidebar::-webkit-scrollbar-thumb { background: #2e2b35; border-radius: 2px; }

        /* ── Right main (orders) ── */
        .pp-main {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          background: #0b0b0f;
          scrollbar-width: thin;
          scrollbar-color: #2e2b35 transparent;
        }
        .pp-main::-webkit-scrollbar { width: 4px; }
        .pp-main::-webkit-scrollbar-track { background: transparent; }
        .pp-main::-webkit-scrollbar-thumb { background: #2e2b35; border-radius: 2px; }

        /* ── Override profile card to fit sidebar ── */
        .pp-sidebar .profile-root {
          padding: 0 !important;
          background: transparent !important;
          min-height: unset !important;
        }
        .pp-sidebar .profile-card {
          max-width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        .pp-sidebar .profile-banner {
          height: 100px;
        }

        /* ── Override orders page to fit main area ── */
        .pp-main .bg-gray-900 {
          background: transparent !important;
          min-height: unset !important;
        }

        /* ── Divider decoration ── */
        .pp-divider-line {
          width: 1px;
          background: linear-gradient(to bottom, transparent, #2e2b35 20%, #2e2b35 80%, transparent);
          flex-shrink: 0;
        }

        /* ── Mobile: stack vertically ── */
        @media (max-width: 768px) {
          .pp-root { flex-direction: column; }
          .pp-sidebar {
            width: 100%;
            height: auto;
            position: static;
            border-right: none;
            border-bottom: 1px solid #1e1c24;
          }
          .pp-divider-line { display: none; }
          .pp-main { overflow-y: unset; }
        }
      `}</style>

      <div className="pp-root">
        {/* ── Sidebar: profile info ── */}
        <aside className="pp-sidebar">
          <Profile />
        </aside>

        <div className="pp-divider-line" />

        {/* ── Main: order history ── */}
        <main className="pp-main">
          <ProfileOrdersPage />
        </main>
      </div>
    </>
  );
}

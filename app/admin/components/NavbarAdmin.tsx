"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  ChefHat,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "../../../images/logo.png";

const NAV_ITEMS = [
  {
    section: "Principal",
    links: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      {
        href: "/admin/orders",
        label: "Commandes",
        icon: ShoppingBag,
        badge: 4,
      },
    ],
  },
  {
    section: "Catalogue",
    links: [
      {
        href: "/admin/dish",
        label: "Gestion des plats",
        icon: UtensilsCrossed,
      },
      { href: "/admin/#", label: "Gestion traiteurs", icon: ChefHat },
    ],
  },
  {
    section: "Gestion",
    links: [{ href: "/admin/users", label: "Utilisateurs", icon: Users }],
  },
];

export default function NavbarAdmin() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "A";

  // ── shared link renderer ────────────────────────────────────────────────────
  const renderLinks = (onLinkClick?: () => void) =>
    NAV_ITEMS.map((section) => (
      <div key={section.section}>
        <div className="nav-section-label">{section.section}</div>
        {section.links.map(({ href, label, icon: Icon, badge }) => {
          const isActive =
            pathname === href ||
            (href !== "/admin" && pathname.startsWith(href));
          return (
            <div className="nav-link-wrapper" key={href}>
              <Link
                href={href}
                className={cn("nav-link", isActive && "active")}
                onClick={onLinkClick}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{label}</span>
                {badge && <span className="nav-badge">{badge}</span>}
              </Link>
              {/* Tooltip — only shown when sidebar is collapsed on desktop */}
              <span className="tooltip">{label}</span>
            </div>
          );
        })}
      </div>
    ));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:wght@300;400;500;600&display=swap');

        /* ─────────────────────────────────────────────
           DESKTOP SIDEBAR
        ───────────────────────────────────────────── */
        .admin-sidebar {
          font-family: 'Instrument Sans', sans-serif;
          width: ${collapsed ? "72px" : "260px"};
          min-height: 100vh;
          background: #0b0b0f;
          border-right: 1px solid #1c1c24;
          display: flex;
          flex-direction: column;
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          flex-shrink: 0;
          overflow: hidden;
        }

        .admin-sidebar::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
          z-index: 0;
        }
        .admin-sidebar > * { position: relative; z-index: 1; }

        /* Brand */
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px 20px;
          border-bottom: 1px solid #1c1c24;
          overflow: hidden;
          white-space: nowrap;
        }
        .brand-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #e8b86d 0%, #c17f2a 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(232,184,109,0.3);
        }
        .brand-text {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 700; color: #f0ece5; letter-spacing: 0.3px;
          opacity: ${collapsed ? 0 : 1}; transition: opacity 0.15s;
        }
        .brand-sub {
          font-size: 10px; font-weight: 500; letter-spacing: 2px;
          text-transform: uppercase; color: #e8b86d;
          opacity: ${collapsed ? 0 : 1}; transition: opacity 0.15s;
        }

        /* Collapse toggle */
        .collapse-btn {
          position: absolute; right: -12px; top: 68px;
          width: 24px; height: 24px; border-radius: 50%;
          background: #1c1c24; border: 1px solid #2a2a36;
          color: #6b6880;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; z-index: 10;
        }
        .collapse-btn:hover { background: #252530; color: #e8b86d; border-color: #e8b86d44; }

        /* Topbar */
        .sidebar-topbar {
          display: flex;
          align-items: center;
          justify-content: ${collapsed ? "center" : "flex-end"};
          padding: 12px 16px; gap: 8px;
        }
        .back-link {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: #5a5870; text-decoration: none;
          padding: 7px 12px; border-radius: 8px;
          border: 1px solid #1c1c24; background: #111118;
          transition: all 0.18s; white-space: nowrap;
          opacity: ${collapsed ? 0 : 1}; pointer-events: ${collapsed ? "none" : "auto"};
        }
        .back-link:hover { color: #e8b86d; border-color: rgba(232,184,109,0.25); }

        .sidebar-divider { height: 1px; background: #1c1c24; margin: 0 16px; }

        /* Nav */
        .sidebar-nav {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 16px 0; scrollbar-width: none;
        }
        .sidebar-nav::-webkit-scrollbar { display: none; }

        .nav-section-label {
          font-size: 9px; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; color: #3a3a4a;
          padding: 12px 20px 6px; white-space: nowrap; overflow: hidden;
          opacity: ${collapsed ? 0 : 1}; transition: opacity 0.1s;
        }

        .nav-link-wrapper { position: relative; }
        .nav-link-wrapper:hover .tooltip { opacity: 1; transform: translateX(-50%) translateY(-50%) translateX(0); pointer-events: auto; }

        .nav-link {
          display: flex; align-items: center; gap: 12px;
          padding: 0 12px; margin: 2px 8px; height: 42px;
          border-radius: 10px; color: #5a5870;
          text-decoration: none; transition: all 0.18s;
          white-space: nowrap; overflow: hidden; position: relative;
        }
        .nav-link:hover { background: #141420; color: #b8b4c8; }
        .nav-link.active {
          background: linear-gradient(135deg, rgba(232,184,109,0.12), rgba(193,127,42,0.08));
          color: #e8b86d;
          border: 1px solid rgba(232,184,109,0.15);
        }
        .nav-link.active::before {
          content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 20px; background: #e8b86d; border-radius: 0 2px 2px 0;
        }
        .nav-icon { width: 18px; height: 18px; flex-shrink: 0; }
        .nav-label {
          font-size: 13.5px; font-weight: 500; flex: 1;
          opacity: ${collapsed ? 0 : 1}; transition: opacity 0.1s;
        }
        .nav-badge {
          background: #e8b86d; color: #0b0b0f;
          font-size: 10px; font-weight: 700;
          min-width: 18px; height: 18px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center; padding: 0 5px;
          opacity: ${collapsed ? 0 : 1}; transition: opacity 0.1s;
        }

        /* Tooltip (collapsed desktop) */
        .tooltip {
          position: absolute; left: calc(100% + 12px); top: 50%;
          transform: translateY(-50%) translateX(-6px);
          background: #1c1c24; border: 1px solid #2a2a36;
          color: #d4cfdf; font-size: 12px; font-weight: 500;
          padding: 6px 10px; border-radius: 8px; white-space: nowrap;
          opacity: 0; transition: opacity 0.15s, transform 0.15s;
          pointer-events: none; z-index: 100;
          display: ${collapsed ? "block" : "none"};
        }

        /* Footer */
        .sidebar-footer { padding: 16px 12px; border-top: 1px solid #1c1c24; }
        .user-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px; border-radius: 12px;
          background: #111118; border: 1px solid #1c1c24;
          overflow: hidden; white-space: nowrap;
        }
        .user-avatar {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, #e8b86d, #c17f2a);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
          color: #fff; flex-shrink: 0;
        }
        .user-info {
          flex: 1; min-width: 0;
          opacity: ${collapsed ? 0 : 1}; transition: opacity 0.1s;
        }
        .user-name { font-size: 12.5px; font-weight: 600; color: #d4cfdf; overflow: hidden; text-overflow: ellipsis; }
        .user-role { font-size: 10px; color: #e8b86d; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
        .logout-btn {
          width: 28px; height: 28px; border-radius: 7px;
          background: transparent; border: none; color: #3a3a4a;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: color 0.18s, background 0.18s, opacity 0.1s;
          flex-shrink: 0;
          opacity: ${collapsed ? 0 : 1};
        }
        .logout-btn:hover { background: rgba(239,68,68,0.1); color: #ef4444; }

        /* ─────────────────────────────────────────────
           MOBILE TOP BAR
        ───────────────────────────────────────────── */
        .mobile-topbar {
          display: none;
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          height: 58px;
          background: #0b0b0f;
          border-bottom: 1px solid #1c1c24;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          font-family: 'Instrument Sans', sans-serif;
        }
        .mobile-logo {
          display: flex; align-items: center; gap: 10px;
        }
        .mobile-logo-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, #e8b86d 0%, #c17f2a 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(232,184,109,0.25);
        }
        .mobile-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700; color: #f0ece5;
        }
        .mobile-right {
          display: flex; align-items: center; gap: 10px;
        }
        .mobile-avatar {
          width: 30px; height: 30px; border-radius: 7px;
          background: linear-gradient(135deg, #e8b86d, #c17f2a);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
          color: #fff;
        }
        .burger-btn {
          width: 36px; height: 36px; border-radius: 9px;
          background: #141420; border: 1px solid #1c1c24;
          color: #b8b4c8;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.18s;
        }
        .burger-btn:hover { border-color: rgba(232,184,109,0.3); color: #e8b86d; }

        /* Mobile drawer overlay */
        .mobile-overlay {
          display: none;
          position: fixed; inset: 0; z-index: 300;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }
        .mobile-overlay.open { display: block; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        /* Mobile drawer */
        .mobile-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 400;
          width: 280px;
          background: #0b0b0f;
          border-right: 1px solid #1c1c24;
          display: flex; flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
          font-family: 'Instrument Sans', sans-serif;
        }
        .mobile-drawer.open { transform: translateX(0); }

        .drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 18px 16px;
          border-bottom: 1px solid #1c1c24;
        }
        .drawer-close {
          width: 32px; height: 32px; border-radius: 8px;
          background: #141420; border: 1px solid #1c1c24;
          color: #5a5870;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s;
        }
        .drawer-close:hover { color: #e8b86d; border-color: rgba(232,184,109,0.25); }

        .drawer-nav {
          flex: 1; overflow-y: auto; padding: 12px 0;
          scrollbar-width: none;
        }
        .drawer-nav::-webkit-scrollbar { display: none; }

        /* Inside drawer — always show labels */
        .mobile-drawer .nav-section-label { opacity: 1 !important; }
        .mobile-drawer .nav-label         { opacity: 1 !important; }
        .mobile-drawer .nav-badge         { opacity: 1 !important; }
        .mobile-drawer .tooltip           { display: none !important; }

        .drawer-footer {
          padding: 14px;
          border-top: 1px solid #1c1c24;
        }
        .drawer-user {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 12px;
          background: #111118; border: 1px solid #1c1c24;
        }
        .drawer-user-info { flex: 1; min-width: 0; }
        .drawer-user-name { font-size: 13px; font-weight: 600; color: #d4cfdf; }
        .drawer-user-role { font-size: 10px; color: #e8b86d; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
        .drawer-logout {
          width: 30px; height: 30px; border-radius: 7px;
          background: transparent; border: 1px solid #2a2a36;
          color: #3a3a4a;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.18s;
        }
        .drawer-logout:hover { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.2); }

        /* ── Responsive breakpoints ── */
        @media (max-width: 768px) {
          .admin-sidebar   { display: none; }
          .mobile-topbar   { display: flex; }
        }
        @media (min-width: 769px) {
          .mobile-topbar   { display: none; }
          .mobile-overlay  { display: none !important; }
          .mobile-drawer   { display: none; }
        }
      `}</style>

      {/* ── DESKTOP SIDEBAR ──────────────────────────────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Link href="/">
              <Image
                src={logo}
                alt="logo"
                width={90}
                height={90}
                className="h-13 w-20"
              />
            </Link>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div className="brand-text">Wingi</div>
            <div className="brand-sub">Administrateur</div>
          </div>
        </div>

        <button
          className="collapse-btn"
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Développer" : "Réduire"}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        <div className="sidebar-topbar">
          <Link href="/" className="back-link">
            ← Retour à l'accueil
          </Link>
        </div>
        <div className="sidebar-divider" />

        <nav className="sidebar-nav">{renderLinks()}</nav>

        <div className="sidebar-divider" />
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="user-role">{user?.role ?? "Admin"}</div>
            </div>
            <button
              className="logout-btn"
              onClick={() => logout?.()}
              title="Se déconnecter"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ───────────────────────────────────────────────────── */}
      <div className="mobile-topbar">
        <div className="mobile-logo">
          <div className="mobile-logo-icon">
            <Image src={logo} alt="logo" width={28} height={28} />
          </div>
          <span className="mobile-logo-text">Wingi</span>
        </div>

        <div className="mobile-right">
          <div className="mobile-avatar">{initials}</div>
          <button
            className="burger-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* ── MOBILE OVERLAY ───────────────────────────────────────────────────── */}
      <div
        className={`mobile-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── MOBILE DRAWER ───────────────────────────────────────────────────── */}
      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="mobile-logo">
            <div className="mobile-logo-icon">
              <Image src={logo} alt="logo" width={28} height={28} />
            </div>
            <span className="mobile-logo-text">Wingi</span>
          </div>
          <button
            className="drawer-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="drawer-nav">
          {renderLinks(() => setMobileOpen(false))}
        </nav>

        <div className="drawer-footer">
          <div className="drawer-user">
            <div className="user-avatar">{initials}</div>
            <div className="drawer-user-info">
              <div className="drawer-user-name">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="drawer-user-role">{user?.role ?? "Admin"}</div>
            </div>
            <button
              className="drawer-logout"
              onClick={() => {
                logout?.();
                setMobileOpen(false);
              }}
              title="Se déconnecter"
            >
              <LogOut size={14} />
            </button>
          </div>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 10,
              fontSize: 13,
              color: "#5a5870",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: 8,
              background: "#111118",
              border: "1px solid #1c1c24",
            }}
            onClick={() => setMobileOpen(false)}
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </>
  );
}

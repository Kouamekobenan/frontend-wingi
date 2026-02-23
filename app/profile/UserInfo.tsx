"use client";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UserRepository } from "../backend/module/users/infrastructure/user-repository.impl";
import { UpdateUserUseCase } from "../backend/module/users/application/usecases/update-user.usecase";
import Link from "next/link";
import { UserRole } from "../backend/module/users/domain/enums/role.enum";

const userRepository = new UserRepository();
const updateUserUseCase = new UpdateUserUseCase(userRepository);

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserUseCase.execute(user.id, form);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
    });
    setIsEditing(false);
  };

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "?";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .profile-root {
          min-height: 100vh;
          background: #0f0e11;
          font-family: 'DM Sans', sans-serif;
          color: #e8e4df;
          padding: 48px 24px;
        }

        .profile-card {
          max-width: 720px;
          margin: 0 auto;
          background: #19171d;
          border: 1px solid #2e2b35;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
        }

        /* Header Banner */
        .profile-banner {
          height: 140px;
          background: linear-gradient(135deg, #c8a97e 0%, #8b6a3e 40%, #3d2b1a 100%);
          position: relative;
        }

        .profile-banner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(255,255,255,0.03) 20px,
            rgba(255,255,255,0.03) 40px
          );
        }

        /* Avatar */
        .profile-avatar-wrap {
          position: relative;
          padding: 0 36px;
          margin-top: -44px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .profile-avatar {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8a97e, #8b6a3e);
          border: 4px solid #19171d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: #fff;
          letter-spacing: 1px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          flex-shrink: 0;
        }

        .profile-role-badge {
          margin-bottom: 8px;
          padding: 4px 12px;
          background: rgba(200, 169, 126, 0.12);
          border: 1px solid rgba(200, 169, 126, 0.3);
          border-radius: 99px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #c8a97e;
        }

        /* Body */
        .profile-body {
          padding: 0 36px 36px;
        }

        .profile-name {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: #f0ece6;
          margin: 0 0 4px;
          line-height: 1.2;
        }

        .profile-email-sub {
          font-size: 13px;
          color: #6b6675;
          margin: 0 0 28px;
        }

        .profile-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: ${user?.isActive ? "#5dbe8a" : "#be5d5d"};
          margin-bottom: 32px;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: ${user?.isActive ? "#5dbe8a" : "#be5d5d"};
          box-shadow: 0 0 8px ${user?.isActive ? "#5dbe8a" : "#be5d5d"};
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Divider */
        .profile-divider {
          height: 1px;
          background: #2e2b35;
          margin-bottom: 28px;
        }

        /* Section title */
        .section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #4e4a57;
          margin-bottom: 20px;
        }

        /* Fields grid */
        .fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 28px;
        }

        .field-full {
          grid-column: 1 / -1;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #6b6675;
        }

        .field-value {
          font-size: 15px;
          color: #d4cfc9;
          padding: 10px 0;
          border-bottom: 1px solid #2e2b35;
          min-height: 40px;
        }

        .field-input {
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #e8e4df;
          background: #111018;
          border: 1px solid #3a3645;
          border-radius: 10px;
          padding: 10px 14px;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .field-input:focus {
          border-color: #c8a97e;
        }

        /* Meta info */
        .profile-meta {
          display: flex;
          gap: 24px;
          margin-bottom: 32px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-label {
          font-size: 11px;
          color: #4e4a57;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .meta-value {
          font-size: 13px;
          color: #6b6675;
        }

        /* Buttons */
        .btn-row {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn {
          padding: 10px 22px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid #2e2b35;
          color: #6b6675;
        }

        .btn-ghost:hover {
          border-color: #4e4a57;
          color: #a09aaa;
        }

        .btn-primary {
          background: linear-gradient(135deg, #c8a97e, #8b6a3e);
          color: #fff;
          box-shadow: 0 4px 16px rgba(200,169,126,0.25);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(200,169,126,0.35);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-edit {
          background: rgba(200,169,126,0.1);
          border: 1px solid rgba(200,169,126,0.25);
          color: #c8a97e;
        }

        .btn-edit:hover {
          background: rgba(200,169,126,0.18);
        }

        .toast-success {
          position: fixed;
          bottom: 32px;
          right: 32px;
          background: #1a2e22;
          border: 1px solid #2d5a3d;
          color: #5dbe8a;
          padding: 14px 22px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: slideUp 0.3s ease;
          z-index: 1000;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="profile-root">
        {/* <Header /> */}
        <div className="profile-card">
          <div className="profile-banner" />

          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-role-badge">{user?.role}</div>
            <div className="profile-role-badge">
              {user?.role === UserRole.CLIENT ? (
                <Link href="/" className="btn btn-edit">
                  Accueil
                </Link>
              ) : (
                <Link href="/admin">Dashboard</Link>
              )}
            </div>
          </div>
          <div className="profile-body">
            <h1 className="profile-name">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="profile-email-sub">{user?.email}</p>

            <div className="profile-status">
              <span className="status-dot" />
              {user?.isActive ? "Compte actif" : "Compte inactif"}
            </div>

            <div className="profile-divider" />

            <p className="section-label">Informations personnelles</p>

            <div className="fields-grid">
              <div className="field-group">
                <span className="field-label">Prénom</span>
                {isEditing ? (
                  <input
                    className="field-input"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{user?.firstName || "—"}</div>
                )}
              </div>

              <div className="field-group">
                <span className="field-label">Nom</span>
                {isEditing ? (
                  <input
                    className="field-input"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{user?.lastName || "—"}</div>
                )}
              </div>

              <div className="field-group">
                <span className="field-label">Nom d'utilisateur</span>
                {isEditing ? (
                  <input
                    className="field-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{user?.name || "—"}</div>
                )}
              </div>

              <div className="field-group">
                <span className="field-label">Téléphone</span>
                {isEditing ? (
                  <input
                    className="field-input"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{user?.phone || "—"}</div>
                )}
              </div>

              <div className="field-group field-full">
                <span className="field-label">Email</span>
                {isEditing ? (
                  <input
                    className="field-input"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{user?.email || "—"}</div>
                )}
              </div>
              <div className="field-group field-full">
                <span className="field-label">Adresse</span>
                {isEditing ? (
                  <input
                    className="field-input"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{user?.address || "—"}</div>
                )}
              </div>
            </div>

            <div className="profile-divider" />

            <div className="profile-meta">
              <div className="meta-item">
                <span className="meta-label">Membre depuis</span>
                <span className="meta-value">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Dernière mise à jour</span>
                <span className="meta-value">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>

            <div className="btn-row">
              {isEditing ? (
                <>
                  <button className="btn btn-ghost" onClick={handleCancel}>
                    Annuler
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  Modifier le profil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="toast-success">✓ Profil mis à jour avec succès</div>
      )}
    </>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import NavbarAdmin from "./components/NavbarAdmin";
import { OrderRepository } from "../backend/module/orders/infrastructure/order.repository";
import { OrderService } from "../backend/module/orders/application/usecases/order.service";
import { UserRepository } from "../backend/module/users/infrastructure/user-repository.impl";
import { FindAllUserUseCase } from "../backend/module/users/application/usecases/findAll.user";
import { User } from "../backend/module/users/domain/entities/user.entity";
import { Order } from "../backend/module/orders/domain/entities/order.entity";
import { OrderStatus } from "../backend/module/orders/domain/enums/order-status.enum";

const orderRepository = new OrderRepository();
const ordersService = new OrderService(orderRepository);
const userRepository = new UserRepository();
const findAllUserUsecase = new FindAllUserUseCase(userRepository);

// ── Config statuts ──
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  [OrderStatus.PENDING]: { label: "En attente", color: "#e8b86d" },
  [OrderStatus.CONFIRMED]: { label: "Confirmée", color: "#6dd4e8" },
  [OrderStatus.PREPARING]: { label: "En prépa.", color: "#b08be8" },
  [OrderStatus.DELIVERED]: { label: "Livré", color: "#8be88d" },
  [OrderStatus.CANCELLED]: { label: "Annulé", color: "#e88d8d" },
};

function getStatusCfg(status: string) {
  return STATUS_CONFIG[status] ?? { label: status, color: "#6b6880" };
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Skeleton card ──
function SkeletonCard() {
  return (
    <div
      style={{
        background: "#111118",
        border: "1px solid #1c1c24",
        borderRadius: "16px",
        padding: "24px",
        height: "110px",
        animation: "skeletonPulse 1.6s ease-in-out infinite",
      }}
    />
  );
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          ordersService.findAll(),
          findAllUserUsecase.execute(),
        ]);
        setOrders(ordersRes ?? []);
        setUsers(usersRes ?? []);
      } catch (err) {
        console.error("Erreur chargement données:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Calculs stats ──
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt) >= today,
  ).length;
  const pendingCount = orders.filter(
    (o) => o.status === OrderStatus.PENDING,
  ).length;
  const activeUsers = users.filter((u) => u.isActive).length;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const revenueMonth = orders
    .filter(
      (o) =>
        new Date(o.createdAt) >= startOfMonth &&
        o.status !== OrderStatus.CANCELLED,
    )
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    {
      label: "Commandes du jour",
      value: String(ordersToday),
      delta: `${pendingCount} en attente`,
      color: "#e8b86d",
    },
    {
      label: "Commandes totales",
      value: String(orders.length),
      delta: "Toutes périodes",
      color: "#6dd4e8",
    },
    {
      label: "Utilisateurs actifs",
      value: String(activeUsers),
      delta: `${users.length} inscrits`,
      color: "#8be88d",
    },
    {
      label: "Revenus (mois)",
      value: formatAmount(revenueMonth),
      delta: "Hors annulées",
      color: "#e88d8d",
    },
  ];

  // 5 commandes les plus récentes
  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <>
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>

      <div
        style={{ display: "flex", minHeight: "100vh", background: "#0b0b0f" }}
      >
        <NavbarAdmin />

        <main
          style={{
            flex: 1,
            padding: "40px 48px",
            fontFamily: "'Instrument Sans', sans-serif",
            color: "#e8e4df",
            overflowY: "auto",
          }}
        >
          {/* ── Header ── */}
          <div style={{ marginBottom: "40px" }}>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#e8b86d",
                marginBottom: "8px",
              }}
            >
              Vue d'ensemble
            </p>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "32px",
                fontWeight: 700,
                color: "#f0ece5",
                margin: 0,
              }}
            >
              Admin Dashboard
            </h1>
            <p style={{ color: "#5a5870", marginTop: "8px", fontSize: "14px" }}>
              Bienvenue dans le panneau d'administration. Gérez vos commandes et
              utilisateurs.
            </p>
          </div>

          {/* ── Stats cards ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            {loading
              ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
              : stats.map(({ label, value, delta, color }) => (
                  <div
                    key={label}
                    style={{
                      background: "#111118",
                      border: "1px solid #1c1c24",
                      borderRadius: "16px",
                      padding: "24px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: color,
                        opacity: 0.7,
                      }}
                    />
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "#3a3a4a",
                        marginBottom: "12px",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#f0ece5",
                        margin: "0 0 6px",
                      }}
                    >
                      {value}
                    </p>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color,
                        background: `${color}18`,
                        padding: "2px 8px",
                        borderRadius: "99px",
                      }}
                    >
                      {delta}
                    </span>
                  </div>
                ))}
          </div>

          {/* ── Deux colonnes ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              gap: "20px",
            }}
          >
            {/* Tableau commandes récentes */}
            <div
              style={{
                background: "#111118",
                border: "1px solid #1c1c24",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #1c1c24",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#d4cfdf",
                    margin: 0,
                  }}
                >
                  Commandes récentes
                </h2>
                <a
                  href="/admin/orders"
                  style={{
                    fontSize: "12px",
                    color: "#e8b86d",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Voir tout →
                </a>
              </div>

              {loading ? (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#3a3a4a",
                    fontSize: "13px",
                  }}
                >
                  Chargement…
                </div>
              ) : recentOrders.length === 0 ? (
                <div
                  style={{
                    padding: "48px",
                    textAlign: "center",
                    color: "#3a3a4a",
                    fontSize: "13px",
                  }}
                >
                  Aucune commande pour le moment
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {[
                        "N° Commande",
                        "Client",
                        "Montant",
                        "Date",
                        "Statut",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 20px",
                            textAlign: "left",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            color: "#3a3a4a",
                            borderBottom: "1px solid #1c1c24",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => {
                      const cfg = getStatusCfg(order.status);
                      const clientName = order.user
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : "Client #" + order.userId.slice(0, 6);
                      return (
                        <tr
                          key={order.id}
                          style={{
                            borderBottom: "1px solid #1c1c24",
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#141420")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                          onClick={() =>
                            (window.location.href = "/admin/orders")
                          }
                        >
                          <td
                            style={{
                              padding: "14px 20px",
                              fontSize: "12px",
                              color: "#5a5870",
                              fontWeight: 600,
                            }}
                          >
                            #{order.orderNumber}
                          </td>
                          <td
                            style={{
                              padding: "14px 20px",
                              fontSize: "13px",
                              color: "#b8b4c8",
                            }}
                          >
                            {clientName}
                          </td>
                          <td
                            style={{
                              padding: "14px 20px",
                              fontSize: "13px",
                              color: "#d4cfdf",
                              fontWeight: 600,
                            }}
                          >
                            {formatAmount(order.totalAmount)}
                          </td>
                          <td
                            style={{
                              padding: "14px 20px",
                              fontSize: "12px",
                              color: "#4e4a57",
                            }}
                          >
                            {formatDate(order.createdAt)}
                          </td>
                          <td style={{ padding: "14px 20px" }}>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                color: cfg.color,
                                background: `${cfg.color}18`,
                                padding: "4px 10px",
                                borderRadius: "99px",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {cfg.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Colonne droite */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Répartition statuts */}
              <div
                style={{
                  background: "#111118",
                  border: "1px solid #1c1c24",
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#d4cfdf",
                    margin: "0 0 20px",
                  }}
                >
                  Statuts commandes
                </h2>
                {loading ? (
                  <div style={{ color: "#3a3a4a", fontSize: "13px" }}>
                    Chargement…
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    {Object.entries(STATUS_CONFIG).map(
                      ([status, { label, color }]) => {
                        const count = orders.filter(
                          (o) => o.status === status,
                        ).length;
                        const pct =
                          orders.length > 0
                            ? Math.round((count / orders.length) * 100)
                            : 0;
                        return (
                          <div key={status}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "6px",
                              }}
                            >
                              <span
                                style={{ fontSize: "12px", color: "#6b6880" }}
                              >
                                {label}
                              </span>
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color,
                                }}
                              >
                                {count}
                              </span>
                            </div>
                            <div
                              style={{
                                height: "4px",
                                background: "#1c1c24",
                                borderRadius: "2px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: `${pct}%`,
                                  background: color,
                                  borderRadius: "2px",
                                }}
                              />
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>

              {/* Résumé utilisateurs */}
              <div
                style={{
                  background: "#111118",
                  border: "1px solid #1c1c24",
                  borderRadius: "16px",
                  padding: "24px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#d4cfdf",
                    margin: "0 0 20px",
                  }}
                >
                  Utilisateurs
                </h2>
                {loading ? (
                  <div style={{ color: "#3a3a4a", fontSize: "13px" }}>
                    Chargement…
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {[
                      {
                        label: "Total inscrits",
                        value: users.length,
                        color: "#d4cfdf",
                      },
                      { label: "Actifs", value: activeUsers, color: "#8be88d" },
                      {
                        label: "Inactifs",
                        value: users.length - activeUsers,
                        color: "#e88d8d",
                      },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
                          background: "#0f0f17",
                          borderRadius: "10px",
                          border: "1px solid #1c1c24",
                        }}
                      >
                        <span style={{ fontSize: "12px", color: "#6b6880" }}>
                          {label}
                        </span>
                        <span
                          style={{ fontSize: "16px", fontWeight: 700, color }}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

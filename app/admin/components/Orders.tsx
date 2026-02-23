"use client";

import { useEffect, useState } from "react";
import NavbarAdmin from "../components/NavbarAdmin";
import { OrderItemsService } from "@/app/backend/module/orderItems/application/usecases/order-items.usecase";
import { OrderItem } from "@/app/backend/module/orderItems/domain/entities/orderItem.entity";
import { OrderItemRepository } from "@/app/backend/module/orderItems/infrastructure/orderItem.repository";
import { OrderService } from "@/app/backend/module/orders/application/usecases/order.service";
import { Order } from "@/app/backend/module/orders/domain/entities/order.entity";
import { OrderRepository } from "@/app/backend/module/orders/infrastructure/order.repository";
import { OrderStatus } from "@/app/backend/module/orders/domain/enums/order-status.enum";
import {
  X,
  Package,
  MapPin,
  FileText,
  Clock,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react";

const ordersItemRepository = new OrderItemRepository();
const orderItemsService = new OrderItemsService(ordersItemRepository);
const orderRepository = new OrderRepository();
const ordersService = new OrderService(orderRepository);

// ── Config statuts ──
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  [OrderStatus.PENDING]: { label: "En attente", color: "#e8b86d" },
  [OrderStatus.CONFIRMED]: { label: "Confirmée", color: "#6dd4e8" },
  [OrderStatus.PREPARING]: { label: "En prépa.", color: "#b08be8" },
  [OrderStatus.READY]: { label: "Prête", color: "#e8d96d" },
  [OrderStatus.DELIVERED]: { label: "Livré", color: "#8be88d" },
  [OrderStatus.CANCELLED]: { label: "Annulé", color: "#e88d8d" },
};

// ── Transitions autorisées (miroir du VO backend) ──
const ALLOWED_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
  [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
  [OrderStatus.READY]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

function getAllowedTransitions(status: OrderStatus): OrderStatus[] {
  return ALLOWED_TRANSITIONS[status] ?? [];
}

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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrdersPageComponent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  // ── Status update state ──
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ordersService.findAll();
        setOrders(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Erreur chargement commandes:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const openOrderDetail = async (order: Order) => {
    setSelectedOrder(order);
    setOrderItems([]);
    setLoadingItems(true);
    setStatusError(null);
    setStatusDropdownOpen(false);
    try {
      const items = await orderItemsService.findById(order.id);
      setOrderItems(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Erreur chargement items:", err);
      setOrderItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const closeDetail = () => {
    setSelectedOrder(null);
    setOrderItems([]);
    setStatusDropdownOpen(false);
    setStatusError(null);
  };

  // ── Handler mise à jour statut ──
  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setStatusDropdownOpen(false);
    setUpdatingStatus(true);
    setStatusError(null);
    try {
      const updated = await ordersService.updateStatus(
        selectedOrder.id,
        newStatus,
      );
      // Mettre à jour dans la liste principale
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      // Mettre à jour le panel
      setSelectedOrder(updated);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Erreur lors de la mise à jour du statut";
      setStatusError(msg);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filtres
  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "ALL" || o.status === filterStatus;
    const matchSearch =
      search === "" ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (o.user &&
        `${o.user.firstName} ${o.user.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const allowedNext = selectedOrder
    ? getAllowedTransitions(selectedOrder.status as OrderStatus)
    : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

        .orders-search::placeholder { color: #3a3a4a; }
        .orders-search:focus { border-color: #e8b86d44; outline: none; }
        .order-row { transition: background 0.15s; cursor: pointer; }
        .order-row:hover { background: #141420; }

        .detail-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.55);
          backdrop-filter: blur(2px); z-index: 50;
          animation: fadeIn 0.2s ease;
        }
        .detail-panel {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 480px; background: #0f0f17;
          border-left: 1px solid #1c1c24;
          display: flex; flex-direction: column;
          z-index: 51; animation: slideIn 0.25s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

        .item-row { transition: background 0.12s; }
        .item-row:hover { background: #141420; }

        .panel-body::-webkit-scrollbar { width: 4px; }
        .panel-body::-webkit-scrollbar-track { background: transparent; }
        .panel-body::-webkit-scrollbar-thumb { background: #2a2a36; border-radius: 2px; }

        /* Status dropdown */
        .status-option { transition: background 0.12s; cursor: pointer; }
        .status-option:hover { background: #1c1c28; }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .status-dropdown { animation: dropIn 0.15s ease; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
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
          <div style={{ marginBottom: "32px" }}>
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
              Administration
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
              Commandes
            </h1>
            <p style={{ color: "#5a5870", marginTop: "8px", fontSize: "14px" }}>
              {orders.length} commande{orders.length > 1 ? "s" : ""} au total ·
              cliquez sur une ligne pour voir les détails
            </p>
          </div>

          {/* ── Filtres ── */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <input
              className="orders-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par n° ou client…"
              style={{
                background: "#111118",
                border: "1px solid #1c1c24",
                borderRadius: "10px",
                padding: "9px 16px",
                fontSize: "13px",
                color: "#d4cfdf",
                width: "260px",
                transition: "border-color 0.2s",
              }}
            />
            {[
              { key: "ALL", label: "Toutes" },
              ...Object.entries(STATUS_CONFIG).map(([key, { label }]) => ({
                key,
                label,
              })),
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background:
                    filterStatus === key ? "rgba(232,184,109,0.12)" : "#111118",
                  border:
                    filterStatus === key
                      ? "1px solid rgba(232,184,109,0.3)"
                      : "1px solid #1c1c24",
                  color: filterStatus === key ? "#e8b86d" : "#4e4a57",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Table ── */}
          <div
            style={{
              background: "#111118",
              border: "1px solid #1c1c24",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    "N° Commande",
                    "Client",
                    "Adresse livraison",
                    "Montant",
                    "Date",
                    "Statut",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "13px 20px",
                        textAlign: "left",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#3a3a4a",
                        borderBottom: "1px solid #1c1c24",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingOrders ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "48px",
                        textAlign: "center",
                        color: "#3a3a4a",
                        fontSize: "13px",
                      }}
                    >
                      Chargement…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "48px",
                        textAlign: "center",
                        color: "#3a3a4a",
                        fontSize: "13px",
                      }}
                    >
                      Aucune commande trouvée
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => {
                    const cfg = getStatusCfg(order.status);
                    const clientName = order.user
                      ? `${order.user.firstName} ${order.user.lastName}`
                      : "Client #" + order.userId.slice(0, 6);
                    return (
                      <tr
                        key={order.id}
                        className="order-row"
                        style={{ borderBottom: "1px solid #1c1c24" }}
                        onClick={() => openOrderDetail(order)}
                      >
                        <td
                          style={{
                            padding: "15px 20px",
                            fontSize: "12px",
                            color: "#5a5870",
                            fontWeight: 700,
                          }}
                        >
                          #{order.orderNumber}
                        </td>
                        <td
                          style={{
                            padding: "15px 20px",
                            fontSize: "13px",
                            color: "#b8b4c8",
                          }}
                        >
                          {clientName}
                        </td>
                        <td
                          style={{
                            padding: "15px 20px",
                            fontSize: "12px",
                            color: "#4e4a57",
                            maxWidth: "180px",
                          }}
                        >
                          <span
                            style={{
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {order.deliveryAddress ?? "—"}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "15px 20px",
                            fontSize: "13px",
                            color: "#d4cfdf",
                            fontWeight: 600,
                          }}
                        >
                          {formatAmount(order.totalAmount)}
                        </td>
                        <td
                          style={{
                            padding: "15px 20px",
                            fontSize: "12px",
                            color: "#4e4a57",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(order.createdAt)}
                        </td>
                        <td style={{ padding: "15px 20px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: cfg.color,
                              background: `${cfg.color}18`,
                              padding: "4px 10px",
                              borderRadius: "99px",
                            }}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td style={{ padding: "15px 20px" }}>
                          <ChevronRight size={14} color="#3a3a4a" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* ── Detail Panel ── */}
      {selectedOrder && (
        <>
          <div className="detail-overlay" onClick={closeDetail} />
          <aside className="detail-panel">
            {/* Panel header */}
            <div
              style={{
                padding: "24px 28px",
                borderBottom: "1px solid #1c1c24",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#4e4a57",
                    margin: "0 0 4px",
                  }}
                >
                  Détail commande
                </p>
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#f0ece5",
                    margin: 0,
                  }}
                >
                  #{selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={closeDetail}
                style={{
                  background: "#1c1c24",
                  border: "none",
                  borderRadius: "8px",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#6b6880",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Panel body */}
            <div
              className="panel-body"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* ── Bloc statut avec sélecteur ── */}
              <div
                style={{
                  background: "#111118",
                  border: "1px solid #1c1c24",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#3a3a4a",
                    margin: "0 0 12px",
                  }}
                >
                  Statut de la commande
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Badge statut actuel */}
                  {(() => {
                    const cfg = getStatusCfg(selectedOrder.status);
                    return (
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: cfg.color,
                          background: `${cfg.color}18`,
                          padding: "5px 12px",
                          borderRadius: "99px",
                          border: `1px solid ${cfg.color}30`,
                        }}
                      >
                        {cfg.label}
                      </span>
                    );
                  })()}

                  {/* Sélecteur de transition */}
                  {allowedNext.length > 0 && (
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => setStatusDropdownOpen((v) => !v)}
                        disabled={updatingStatus}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          background: updatingStatus ? "#1a1a24" : "#1c1c28",
                          border: "1px solid #2a2a36",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: updatingStatus ? "#3a3a4a" : "#b8b4c8",
                          cursor: updatingStatus ? "not-allowed" : "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {updatingStatus ? (
                          <>
                            <Loader2 size={12} className="spin" /> Mise à jour…
                          </>
                        ) : (
                          <>
                            <ChevronDown size={12} /> Changer le statut
                          </>
                        )}
                      </button>

                      {statusDropdownOpen && (
                        <div
                          className="status-dropdown"
                          style={{
                            position: "absolute",
                            top: "calc(100% + 6px)",
                            left: 0,
                            background: "#13131c",
                            border: "1px solid #2a2a36",
                            borderRadius: "10px",
                            overflow: "hidden",
                            zIndex: 60,
                            minWidth: "180px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                          }}
                        >
                          {allowedNext.map((status) => {
                            const cfg = getStatusCfg(status);
                            return (
                              <div
                                key={status}
                                className="status-option"
                                onClick={() => handleStatusChange(status)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  padding: "11px 14px",
                                  borderBottom: "1px solid #1c1c24",
                                }}
                              >
                                <span
                                  style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: cfg.color,
                                    flexShrink: 0,
                                  }}
                                />
                                <span
                                  style={{ fontSize: "13px", color: "#d4cfdf" }}
                                >
                                  {cfg.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Terminal states */}
                  {allowedNext.length === 0 && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#3a3a4a",
                        fontStyle: "italic",
                      }}
                    >
                      Statut final — aucune transition possible
                    </span>
                  )}
                </div>

                {/* Message d'erreur */}
                {statusError && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "9px 12px",
                      background: "rgba(232,141,141,0.08)",
                      border: "1px solid rgba(232,141,141,0.2)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#e88d8d",
                    }}
                  >
                    {statusError}
                  </div>
                )}
              </div>

              {/* Infos client */}
              {selectedOrder.user && (
                <div
                  style={{
                    background: "#111118",
                    border: "1px solid #1c1c24",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "#3a3a4a",
                      marginBottom: "12px",
                    }}
                  >
                    Client
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#d4cfdf",
                      margin: "0 0 2px",
                    }}
                  >
                    {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                  </p>
                  <p style={{ fontSize: "12px", color: "#4e4a57", margin: 0 }}>
                    {selectedOrder.user.email}
                  </p>
                  {selectedOrder.user.phone && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#4e4a57",
                        margin: "2px 0 0",
                      }}
                    >
                      {selectedOrder.user.phone}
                    </p>
                  )}
                </div>
              )}

              {/* Méta infos */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    background: "#111118",
                    border: "1px solid #1c1c24",
                    borderRadius: "12px",
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "6px",
                    }}
                  >
                    <Clock size={12} color="#4e4a57" />
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "#3a3a4a",
                      }}
                    >
                      Date
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#6b6880", margin: 0 }}>
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>

                {selectedOrder.deliveryAddress && (
                  <div
                    style={{
                      background: "#111118",
                      border: "1px solid #1c1c24",
                      borderRadius: "12px",
                      padding: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "6px",
                      }}
                    >
                      <MapPin size={12} color="#4e4a57" />
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          color: "#3a3a4a",
                        }}
                      >
                        Livraison
                      </span>
                    </div>
                    <p
                      style={{ fontSize: "12px", color: "#6b6880", margin: 0 }}
                    >
                      {selectedOrder.deliveryAddress}
                    </p>
                  </div>
                )}

                {selectedOrder.notes && (
                  <div
                    style={{
                      background: "#111118",
                      border: "1px solid #1c1c24",
                      borderRadius: "12px",
                      padding: "14px",
                      gridColumn: "1/-1",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "6px",
                      }}
                    >
                      <FileText size={12} color="#4e4a57" />
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          color: "#3a3a4a",
                        }}
                      >
                        Notes
                      </span>
                    </div>
                    <p
                      style={{ fontSize: "12px", color: "#6b6880", margin: 0 }}
                    >
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Plats commandés */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "14px",
                  }}
                >
                  <Package size={14} color="#e8b86d" />
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "#3a3a4a",
                      margin: 0,
                    }}
                  >
                    Plats commandés
                  </p>
                </div>

                {loadingItems ? (
                  <div
                    style={{
                      padding: "24px",
                      textAlign: "center",
                      color: "#3a3a4a",
                      fontSize: "13px",
                      background: "#111118",
                      borderRadius: "12px",
                      border: "1px solid #1c1c24",
                    }}
                  >
                    Chargement des plats…
                  </div>
                ) : orderItems.length === 0 ? (
                  <div
                    style={{
                      padding: "24px",
                      textAlign: "center",
                      color: "#3a3a4a",
                      fontSize: "13px",
                      background: "#111118",
                      borderRadius: "12px",
                      border: "1px solid #1c1c24",
                    }}
                  >
                    Aucun plat trouvé
                  </div>
                ) : (
                  <div
                    style={{
                      background: "#111118",
                      border: "1px solid #1c1c24",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    {orderItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="item-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "14px 16px",
                          borderBottom:
                            idx < orderItems.length - 1
                              ? "1px solid #1c1c24"
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <span
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "8px",
                              background: "rgba(232,184,109,0.1)",
                              border: "1px solid rgba(232,184,109,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#e8b86d",
                              flexShrink: 0,
                            }}
                          >
                            {item.quantity}
                          </span>
                          <div>
                            <p
                              style={{
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "#d4cfdf",
                                margin: "0 0 2px",
                              }}
                            >
                              {item.dish?.name ??
                                `Plat #${item.dishId.slice(0, 6)}`}
                            </p>
                            {item.notes && (
                              <p
                                style={{
                                  fontSize: "11px",
                                  color: "#4e4a57",
                                  margin: 0,
                                }}
                              >
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#f0ece5",
                          }}
                        >
                          {formatAmount(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Panel footer */}
            <div
              style={{
                padding: "20px 28px",
                borderTop: "1px solid #1c1c24",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{ fontSize: "13px", fontWeight: 600, color: "#6b6880" }}
              >
                Total commande
              </span>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#e8b86d",
                }}
              >
                {formatAmount(selectedOrder.totalAmount)}
              </span>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

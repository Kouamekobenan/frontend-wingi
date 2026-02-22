"use client";

import React, { useEffect, useState } from "react";
import { OrderItemRepository } from "../backend/module/orderItems/infrastructure/orderItem.repository";
import { OrderItemsService } from "../backend/module/orderItems/application/usecases/order-items.usecase";
import { OrderRepository } from "../backend/module/orders/infrastructure/order.repository";
import { OrderService } from "../backend/module/orders/application/usecases/order.service";
import { Order } from "../backend/module/orders/domain/entities/order.entity";
import { OrderItem } from "../backend/module/orderItems/domain/entities/orderItem.entity";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

// ── Bootstrap ──────────────────────────────────────────────────────────────────
const ordersItemRepository = new OrderItemRepository();
const orderItemsService = new OrderItemsService(ordersItemRepository);
const orderRepository = new OrderRepository();
const ordersService = new OrderService(orderRepository);

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; text: string; bg: string }
> = {
  PENDING: {
    label: "En attente",
    dot: "bg-yellow-400",
    text: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  CONFIRMED: {
    label: "Confirmée",
    dot: "bg-blue-400",
    text: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  PREPARING: {
    label: "En cuisine",
    dot: "bg-orange-400",
    text: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  READY: {
    label: "Prête",
    dot: "bg-green-400",
    text: "text-green-400",
    bg: "bg-green-400/10",
  },
  DELIVERED: {
    label: "Livrée",
    dot: "bg-emerald-500",
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  CANCELLED: {
    label: "Annulée",
    dot: "bg-red-500",
    text: "text-red-500",
    bg: "bg-red-500/10",
  },
};
const statusFor = (s: string) =>
  STATUS_CONFIG[s?.toUpperCase()] ?? {
    label: s ?? "—",
    dot: "bg-gray-500",
    text: "text-gray-400",
    bg: "bg-gray-500/10",
  };

// ── Format date ────────────────────────────────────────────────────────────────
const fmtDate = (d: string | Date | undefined) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ── Order row component ────────────────────────────────────────────────────────
function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const status = statusFor(order.status);

  const loadItems = async () => {
    if (fetched) {
      setOpen((v) => !v);
      return;
    }
    setOpen(true);
    setLoading(true);
    try {
      const res = await orderItemsService.findById(order.id);
      setItems(res);
      setFetched(true);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-700/60 rounded-2xl overflow-hidden transition-all duration-200 hover:border-gray-600/60">
      {/* ── Order header ── */}
      <button
        onClick={loadItems}
        className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-700/20 transition-colors"
      >
        {/* Status dot */}
        <span
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${status.dot}`}
        />

        {/* Order info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-white font-semibold text-sm">
              Commande #{order.id.slice(0, 8).toUpperCase()}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${status.text} ${status.bg}`}
            >
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <span className="text-gray-500 text-xs">
              {fmtDate(order.createdAt)}
            </span>
            {order.totalAmount != null && (
              <span className="text-gray-400 text-xs font-medium">
                {Number(order.totalAmount).toFixed(2)} €
              </span>
            )}
          </div>
        </div>

        {/* Total + chevron */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-white font-bold text-base hidden sm:block">
            {Number(order.totalAmount ?? 0).toFixed(2)} €
          </span>
          <span
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              width={18}
              height={18}
            >
              <path
                d="M6 9l6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </button>

      {/* ── Order items detail ── */}
      {open && (
        <div className="border-t border-gray-700/50 bg-gray-800/40 px-5 py-4">
          {loading ? (
            <div className="flex items-center gap-3 py-4 text-gray-500 text-sm">
              <svg
                className="animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                width={16}
                height={16}
              >
                <path
                  d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                  strokeLinecap="round"
                />
              </svg>
              Chargement des articles…
            </div>
          ) : items.length === 0 ? (
            <p className="text-gray-500 text-sm py-2">Aucun article trouvé.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Items list */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-gray-700/30 rounded-xl px-4 py-3"
                >
                  {/* Dish image */}
                  {item.dish?.imageUrl ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-700">
                      <Image
                        src={item.dish.imageUrl}
                        alt={item.dish.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-700/60 flex items-center justify-center flex-shrink-0">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        width={20}
                        height={20}
                        className="text-gray-500"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}

                  {/* Dish info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {item.dish?.name ?? `Plat #${item.dishId.slice(0, 8)}`}
                    </p>
                    {item.notes && (
                      <p className="text-gray-500 text-xs mt-0.5 italic truncate">
                        Note : {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Qty + price */}
                  <div className="flex items-center gap-4 flex-shrink-0 text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500 text-xs">×</span>
                      <span className="text-gray-300 text-sm font-semibold">
                        {item.quantity}
                      </span>
                    </div>
                    <span className="text-white text-sm font-bold min-w-[60px] text-right">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                </div>
              ))}

              {/* Subtotal */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-700/40 mt-1">
                <span className="text-gray-500 text-sm">
                  Total de la commande
                </span>
                <span className="text-white font-bold text-base">
                  {Number(order.totalAmount ?? 0).toFixed(2)} €
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ProfileOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const fetched = await ordersService.findByUserId(userId);
        // Plus récentes en premier
        setOrders(
          [...fetched].sort(
            (a, b) =>
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime(),
          ),
        );
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalSpent = orders.reduce(
    (acc, o) => acc + Number(o.totalAmount ?? 0),
    0,
  );
  const delivered = orders.filter(
    (o) => o.status?.toUpperCase() === "DELIVERED",
  ).length;

  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-6">
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Mes commandes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Historique et détail de vos commandes
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
            <svg
              className="animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              width={24}
              height={24}
            >
              <path
                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-sm">Chargement de vos commandes…</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                width={28}
                height={28}
                className="text-gray-600"
              >
                <path
                  d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">
              Aucune commande pour l&apos;instant
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Vos commandes apparaîtront ici.
            </p>
          </div>
        ) : (
          <>
            {/* ── Stats cards ── */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-800 rounded-2xl p-4 text-center">
                <p className="text-white text-xl font-bold">{orders.length}</p>
                <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">
                  Commandes
                </p>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 text-center">
                <p className="text-white text-xl font-bold">{delivered}</p>
                <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">
                  Livrées
                </p>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 text-center">
                <p className="text-white text-xl font-bold">
                  {totalSpent.toFixed(0)} €
                </p>
                <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">
                  Dépensé
                </p>
              </div>
            </div>

            {/* ── Orders list ── */}
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

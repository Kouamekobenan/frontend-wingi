"use client";

import { CategorieService } from "@/app/backend/module/categories/application/usecases/category.service";
import { Category } from "@/app/backend/module/categories/domain/entities/category";
import { CategoryRepository } from "@/app/backend/module/categories/infrastructure/category.repository";
import { CreateDishDto } from "@/app/backend/module/dishes/application/dtos/create-dish.dto";
import { UpdateDishDto } from "@/app/backend/module/dishes/application/dtos/update-dish.dto";
import { DishService } from "@/app/backend/module/dishes/application/usecases/dish.service";
import { FindAllDishUseCase } from "@/app/backend/module/dishes/application/usecases/find-all-dish.usecase";
import { Dish } from "@/app/backend/module/dishes/entities/dish.entity";
import { DishRepositorty } from "@/app/backend/module/dishes/infrastructure/dish.repository";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

// ── Bootstrap ──────────────────────────────────────────────────────────────────
const dishesRepository = new DishRepositorty();
const dishService = new DishService(dishesRepository);
const findAllDishes = new FindAllDishUseCase(dishesRepository);
const categoriesRepository = new CategoryRepository();
const categoriesService = new CategorieService(categoriesRepository);

// ── Types ──────────────────────────────────────────────────────────────────────
type ModalMode = "create" | "edit" | null;

const EMPTY_FORM: Omit<CreateDishDto, "id" | "imageUrl"> = {
  name: "",
  description: "",
  price: 0,
  preparationTime: 0,
  categoryId: "",
  isAvailable: true,
};

// ── Icons (inline SVG, no extra deps) ─────────────────────────────────────────
const Icon = {
  Plus: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      width={18}
      height={18}
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Edit: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      width={16}
      height={16}
    >
      <path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        strokeLinecap="round"
      />
      <path
        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        strokeLinecap="round"
      />
    </svg>
  ),
  Trash: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      width={16}
      height={16}
    >
      <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
      <path
        d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Close: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      width={20}
      height={20}
    >
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  ),
  Image: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={32}
      height={32}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" strokeLinecap="round" />
    </svg>
  ),
  Clock: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={14}
      height={14}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" />
    </svg>
  ),
  Spinner: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      width={18}
      height={18}
      className="dish-spin"
    >
      <path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DishAdminPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [form, setForm] =
    useState<Omit<CreateDishDto, "id" | "imageUrl">>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // ── Data ───────────────────────────────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      const data = await categoriesService.findAll();
      setCategories(data);
    } catch (err) {
      showToast("Erreur lors du chargement des catégories.", "err");
    }
  };
  const fetchDishes = async () => {
    setLoading(true);
    try {
      const data = await findAllDishes.execute();
      setDishes(data);
    } catch {
      showToast("Erreur lors du chargement des plats.", "err");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchDishes();
  }, []);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg: string, type: "ok" | "err") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingDish(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview(null);
    setModalMode("create");
  };

  const openEdit = (dish: Dish) => {
    setEditingDish(dish);
    setForm({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      preparationTime: dish.preparationTime,
      categoryId: dish.categoryId,
      isAvailable: true,
    });
    setFile(null);
    setPreview(dish.imageUrl ?? null);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingDish(null);
    setFile(null);
    setPreview(null);
  };

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Le nom est requis.", "err");
    setSaving(true);
    try {
      if (modalMode === "create") {
        const created = await dishService.create(
          { ...form } as CreateDishDto,
          file,
        );
        console.log("Created dish:", created);
        setDishes((prev) => [created, ...prev]);
        showToast("Plat créé avec succès !", "ok");
      } else if (editingDish) {
        const updated = await dishService.update(
          editingDish.id,
          { ...form } as UpdateDishDto,
          file,
        );
        setDishes((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d)),
        );
        showToast("Plat mis à jour !", "ok");
      }
      closeModal();
    } catch {
      showToast("Une erreur est survenue.", "err");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await dishesRepository.deleteOne(id);
      setDishes((prev) => prev.filter((d) => d.id !== id));
      showToast("Plat supprimé.", "ok");
    } catch {
      showToast("Erreur lors de la suppression.", "err");
    } finally {
      setDeletingId(null);
      setDeleteConfirm(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .da-root {
          font-family: 'DM Sans', sans-serif;
          background: #0d0d0f;
          min-height: 100vh;
          color: #e8e4dc;
          padding: 32px 24px 80px;
        }

        /* ── Header ── */
        .da-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .da-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #f5e6c8 0%, #c9a96e 60%, #8b6914 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .da-subtitle {
          font-size: 13px;
          color: #6b6458;
          margin-top: 2px;
          letter-spacing: 0.04em;
        }
        .da-btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #c9a96e, #8b6914);
          color: #0d0d0f;
          border: none;
          border-radius: 10px;
          padding: 11px 22px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .da-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        /* ── Count badge ── */
        .da-count {
          font-size: 12px;
          color: #6b6458;
          margin-bottom: 20px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── Grid ── */
        .da-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
          gap: 20px;
        }

        /* ── Card ── */
        .da-card {
          background: #161618;
          border: 1px solid #232323;
          border-radius: 16px;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
          display: flex;
          flex-direction: column;
        }
        .da-card:hover { border-color: #3a3020; transform: translateY(-2px); }

        .da-card-img {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: #1c1c1e;
          overflow: hidden;
        }
        .da-card-img img { object-fit: cover; }
        .da-card-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3a3a3a;
          background: repeating-linear-gradient(
            45deg, #1a1a1a 0px, #1a1a1a 10px, #1c1c1e 10px, #1c1c1e 20px
          );
        }

        .da-card-body {
          padding: 18px 20px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .da-card-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 17px;
          color: #f0e8d8;
          line-height: 1.2;
        }
        .da-card-desc {
          font-size: 13px;
          color: #6b6458;
          line-height: 1.5;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .da-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }
        .da-card-price {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #c9a96e;
        }
        .da-card-time {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #5a5550;
        }

        .da-card-actions {
          display: flex;
          border-top: 1px solid #222;
        }
        .da-action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 12px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: background 0.15s;
        }
        .da-action-edit { color: #c9a96e; border-right: 1px solid #222; }
        .da-action-edit:hover { background: #1e1a12; }
        .da-action-delete { color: #c0442a; }
        .da-action-delete:hover { background: #1e1010; }
        .da-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── Loading ── */
        .da-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 16px;
          color: #6b6458;
          font-size: 14px;
        }
        @keyframes dish-spin { to { transform: rotate(360deg); } }
        .dish-spin { animation: dish-spin 0.8s linear infinite; }

        /* ── Empty ── */
        .da-empty {
          text-align: center;
          padding: 80px 20px;
          color: #3a3530;
        }
        .da-empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #4a4540;
          margin-bottom: 8px;
        }

        /* ── Modal overlay ── */
        .da-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.82);
          backdrop-filter: blur(6px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ── Modal ── */
        .da-modal {
          background: #161618;
          border: 1px solid #2a2a2a;
          border-radius: 20px;
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.22s ease;
        }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .da-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px 0;
        }
        .da-modal-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 20px;
          color: #f0e8d8;
        }
        .da-modal-close {
          background: #222;
          border: none;
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          color: #777;
          display: flex;
          transition: background 0.15s;
        }
        .da-modal-close:hover { background: #2e2e2e; color: #ccc; }

        .da-modal-body {
          padding: 24px 28px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* ── Form fields ── */
        .da-field { display: flex; flex-direction: column; gap: 7px; }
        .da-label {
          font-size: 12px;
          font-weight: 500;
          color: #7a7060;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .da-input, .da-textarea {
          background: #0d0d0f;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          color: #e8e4dc;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 11px 14px;
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
        }
        .da-input:focus, .da-textarea:focus { border-color: #c9a96e; }
        .da-textarea { resize: vertical; min-height: 80px; }

        .da-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        /* ── Drop zone ── */
        .da-dropzone {
          border: 2px dashed #2a2a2a;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: #0d0d0f;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .da-dropzone:hover { border-color: #c9a96e; background: #11100d; }
        .da-dropzone-label { font-size: 13px; color: #6b6458; }
        .da-dropzone-hint { font-size: 11px; color: #3a3530; }
        .da-preview {
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
          aspect-ratio: 16/9;
          position: relative;
          background: #0d0d0f;
        }
        .da-preview img { object-fit: cover; }
        .da-preview-change {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0,0,0,0.7);
          color: #c9a96e;
          border: 1px solid #c9a96e33;
          border-radius: 6px;
          padding: 5px 10px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .da-preview-change:hover { background: rgba(201,169,110,0.15); }

        /* ── Modal footer ── */
        .da-modal-footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding: 0 28px 28px;
        }
        .da-btn-secondary {
          background: #222;
          border: 1px solid #2a2a2a;
          color: #888;
          border-radius: 10px;
          padding: 11px 22px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .da-btn-secondary:hover { background: #2a2a2a; color: #bbb; }
        .da-btn-save {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #c9a96e, #8b6914);
          color: #0d0d0f;
          border: none;
          border-radius: 10px;
          padding: 11px 26px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .da-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .da-btn-save:not(:disabled):hover { opacity: 0.9; }

        /* ── Confirm dialog ── */
        .da-confirm {
          background: #1a1a1c;
          border: 1px solid #2e2018;
          border-radius: 16px;
          padding: 28px;
          width: 100%;
          max-width: 380px;
          text-align: center;
          animation: slideUp 0.2s ease;
        }
        .da-confirm-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #f0e8d8;
          margin-bottom: 10px;
        }
        .da-confirm-text { font-size: 14px; color: #6b6458; margin-bottom: 24px; line-height: 1.5; }
        .da-confirm-btns { display: flex; gap: 12px; justify-content: center; }
        .da-btn-danger {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #c0442a;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 10px 22px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .da-btn-danger:hover { opacity: 0.85; }

        /* ── Toast ── */
        .da-toast {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 22px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          z-index: 999;
          animation: slideUp 0.22s ease;
          white-space: nowrap;
          max-width: calc(100vw - 40px);
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .da-toast-ok { background: #1a3020; border: 1px solid #2a5030; color: #6ecf8a; }
        .da-toast-err { background: #2e1010; border: 1px solid #5a2020; color: #e07070; }
      `}</style>

      <div className="da-root">
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="da-header">
          <div>
            <h1 className="da-title">Gestion des plats</h1>
            <p className="da-subtitle">Administration du menu</p>
          </div>
          <button className="da-btn-primary" onClick={openCreate}>
            <Icon.Plus /> Nouveau plat
          </button>
        </div>

        {/* ── Content ───────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="da-loading">
            <Icon.Spinner />
            Chargement des plats…
          </div>
        ) : dishes.length === 0 ? (
          <div className="da-empty">
            <p className="da-empty-title">Aucun plat pour l&apos;instant</p>
            <p style={{ fontSize: 14 }}>Commencez par en créer un !</p>
          </div>
        ) : (
          <>
            <p className="da-count">
              {dishes.length} plat{dishes.length > 1 ? "s" : ""}
            </p>
            <div className="da-grid">
              {dishes.map((dish) => (
                <div key={dish.id} className="da-card">
                  {/* Image */}
                  <div className="da-card-img">
                    {dish.imageUrl ? (
                      <Image
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="da-card-img-placeholder">
                        <Icon.Image />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="da-card-body">
                    <h2 className="da-card-name">{dish.name}</h2>
                    <p className="da-card-desc">{dish.description}</p>
                    <div className="da-card-meta">
                      <span className="da-card-price">
                        {dish.price.toFixed(2)} €
                      </span>
                      <span className="da-card-time">
                        <Icon.Clock /> {dish.preparationTime} min
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="da-card-actions">
                    <button
                      className="da-action-btn da-action-edit"
                      onClick={() => openEdit(dish)}
                    >
                      <Icon.Edit /> Modifier
                    </button>
                    <button
                      className="da-action-btn da-action-delete"
                      onClick={() => setDeleteConfirm(dish.id)}
                      disabled={deletingId === dish.id}
                    >
                      {deletingId === dish.id ? (
                        <Icon.Spinner />
                      ) : (
                        <Icon.Trash />
                      )}
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Create / Edit Modal ──────────────────────────────────────────────── */}
      {modalMode && (
        <div
          className="da-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="da-modal">
            <div className="da-modal-header">
              <h2 className="da-modal-title">
                {modalMode === "create" ? "Nouveau plat" : "Modifier le plat"}
              </h2>
              <button className="da-modal-close" onClick={closeModal}>
                <Icon.Close />
              </button>
            </div>

            <div className="da-modal-body">
              {/* Image upload */}
              {preview ? (
                <div className="da-preview">
                  <Image
                    src={preview}
                    alt="preview"
                    fill
                    sizes="520px"
                    style={{ objectFit: "cover" }}
                  />
                  <button
                    className="da-preview-change"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Changer l&apos;image
                  </button>
                </div>
              ) : (
                <div
                  className="da-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Icon.Image />
                  <span className="da-dropzone-label">
                    Glissez une image ou cliquez pour choisir
                  </span>
                  <span className="da-dropzone-hint">
                    PNG, JPG, WEBP — max 5 Mo
                  </span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onFileChange}
              />

              {/* Name */}
              <div className="da-field">
                <label className="da-label">Nom du plat *</label>
                <input
                  className="da-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex : Poulet rôti aux herbes"
                />
              </div>

              {/* Description */}
              <div className="da-field">
                <label className="da-label">Description</label>
                <textarea
                  className="da-textarea"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Décrivez le plat…"
                />
              </div>

              {/* Price & Prep time */}
              <div className="da-row">
                <div className="da-field">
                  <label className="da-label">Prix (€) *</label>
                  <input
                    className="da-input"
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="da-field">
                  <label className="da-label">Préparation (min) *</label>
                  <input
                    className="da-input"
                    type="number"
                    min={0}
                    value={form.preparationTime}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        preparationTime: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="da-field">
                <label className="da-label">Catégorie *</label>
                <select
                  className="da-input"
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  style={{ cursor: "pointer", appearance: "auto" }}
                >
                  <option value="" disabled>
                    — Sélectionner une catégorie —
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="da-modal-footer">
              <button className="da-btn-secondary" onClick={closeModal}>
                Annuler
              </button>
              <button
                className="da-btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                {saving && <Icon.Spinner />}
                {saving
                  ? "Enregistrement…"
                  : modalMode === "create"
                    ? "Créer le plat"
                    : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ───────────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div
          className="da-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteConfirm(null);
          }}
        >
          <div className="da-confirm">
            <p className="da-confirm-title">Supprimer ce plat ?</p>
            <p className="da-confirm-text">
              Cette action est irréversible. Le plat sera définitivement retiré
              du menu.
            </p>
            <div className="da-confirm-btns">
              <button
                className="da-btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Annuler
              </button>
              <button
                className="da-btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                {deletingId ? <Icon.Spinner /> : <Icon.Trash />} Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`da-toast ${toast.type === "ok" ? "da-toast-ok" : "da-toast-err"}`}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}

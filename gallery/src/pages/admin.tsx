import { FormEvent, useEffect, useState } from "react";
import {
  useListPaintings,
  useCreatePainting,
  useUpdatePainting,
  useDeletePainting,
  useGetArtist,
  useUpdateArtist,
  getListPaintingsQueryKey,
  getGetArtistQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, Trash2, X, Image as ImageIcon, Lock, LogOut, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;
const SESSION_KEY = "gallery-admin-auth";

function AdminGate({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setPassword("");
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] px-4">
      <div className={`w-full max-w-sm ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-foreground mb-2">{t.adminGateTitle}</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">{t.adminGateSubtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.adminGatePasswordLabel}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder={t.adminGatePasswordPlaceholder}
                autoFocus
                className={`w-full bg-background border rounded-md px-4 py-3 pe-12 focus:outline-none focus:ring-2 transition-colors ${
                  error ? "border-destructive focus:ring-destructive/30" : "border-border focus:ring-primary/40"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-sm text-destructive">{t.adminGateError}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-primary text-black font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {t.adminGateSubmit}
          </button>
        </form>
      </div>
    </div>
  );
}

function Admin() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [activeTab, setActiveTab] = useState<"paintings" | "artist">("paintings");
  const { t } = useLanguage();

  if (!unlocked) {
    return <AdminGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{t.adminTitle}</h1>
          <p className="text-muted-foreground">{t.adminSubtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-card border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("paintings")}
              className={`px-6 py-2 rounded-md transition-colors text-sm font-medium ${
                activeTab === "paintings" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.tabPaintings}
            </button>
            <button
              onClick={() => setActiveTab("artist")}
              className={`px-6 py-2 rounded-md transition-colors text-sm font-medium ${
                activeTab === "artist" ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.tabArtist}
            </button>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY);
              setUnlocked(false);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-white/10 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            {t.adminGateLogout}
          </button>
        </div>
      </div>

      {activeTab === "paintings" ? <PaintingsManager /> : <ArtistManager />}
    </div>
  );
}

function PaintingsManager() {
  const { data: paintings, isLoading } = useListPaintings();
  const deletePainting = useDeletePainting();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm(t.confirmDelete)) {
      deletePainting.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListPaintingsQueryKey() });
            toast({ title: t.deleteSuccess, description: t.deleteSuccessDesc });
          },
          onError: () => toast({ title: t.deleteError, description: t.deleteErrorDesc }),
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {!isCreating && !editingId && (
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-primary/30 rounded-xl text-primary hover:bg-primary/5 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{t.addPainting}</span>
        </button>
      )}

      {(isCreating || editingId) && (
        <div className="bg-card border border-white/10 rounded-xl p-6 relative">
          <button
            onClick={() => {
              setIsCreating(false);
              setEditingId(null);
            }}
            className="absolute top-4 end-4 p-2 text-muted-foreground hover:text-foreground rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold mb-6 text-primary">{isCreating ? t.addPainting : t.editPainting}</h2>
          <PaintingForm
            paintingId={editingId}
            onSuccess={() => {
              setIsCreating(false);
              setEditingId(null);
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paintings?.map((painting) => (
          <div key={painting.id} className="bg-card border border-white/5 rounded-xl overflow-hidden group">
            <div className="aspect-video relative overflow-hidden bg-black/50">
              {painting.imageUrl ? (
                <img src={painting.imageUrl} alt={painting.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 opacity-20 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                <h3 className="text-lg font-bold text-white">{painting.title}</h3>
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{painting.year ?? t.noDate}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(painting.id);
                    setIsCreating(false);
                  }}
                  className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(painting.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaintingForm({ paintingId, onSuccess }: { paintingId: number | null; onSuccess: () => void }) {
  const { data: paintings } = useListPaintings();
  const createPainting = useCreatePainting();
  const updatePainting = useUpdatePainting();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();

  const existing = paintingId ? paintings?.find((p) => p.id === paintingId) : null;
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    year: "",
    medium: "",
    dimensions: "",
    sortOrder: "0",
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        description: existing.description || "",
        imageUrl: existing.imageUrl,
        year: existing.year?.toString() || "",
        medium: existing.medium || "",
        dimensions: existing.dimensions || "",
        sortOrder: existing.sortOrder?.toString() || "0",
      });
    }
  }, [existing]);

  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const inputCls = "w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description || undefined,
      imageUrl: form.imageUrl,
      year: form.year ? parseInt(form.year, 10) : undefined,
      medium: form.medium || undefined,
      dimensions: form.dimensions || undefined,
      sortOrder: parseInt(form.sortOrder, 10) || 0,
    };

    if (paintingId) {
      updatePainting.mutate(
        { id: paintingId, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListPaintingsQueryKey() });
            toast({ title: t.updateSuccess, description: t.updateSuccessDesc });
            onSuccess();
          },
          onError: () => toast({ title: t.updateError, description: t.updateErrorDesc }),
        }
      );
    } else {
      createPainting.mutate(
        { data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListPaintingsQueryKey() });
            toast({ title: t.createSuccess, description: t.createSuccessDesc });
            onSuccess();
          },
          onError: () => toast({ title: t.createError, description: t.createErrorDesc }),
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className={inputCls}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder={t.fieldTitle}
          required
        />
        <input
          className={inputCls}
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder={t.fieldImageUrl}
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <input
          className={inputCls}
          value={form.year}
          onChange={(e) => set("year", e.target.value)}
          placeholder={t.fieldYear}
        />
        <input
          className={inputCls}
          value={form.sortOrder}
          onChange={(e) => set("sortOrder", e.target.value)}
          placeholder={t.fieldOrder}
          type="number"
          min="0"
        />
        <input
          className={inputCls}
          value={form.dimensions}
          onChange={(e) => set("dimensions", e.target.value)}
          placeholder={t.fieldDimensionsPlaceholder}
        />
      </div>
      <input
        className={inputCls}
        value={form.medium}
        onChange={(e) => set("medium", e.target.value)}
        placeholder={t.fieldMediumPlaceholder}
      />
      <textarea
        className={`${inputCls} min-h-[120px] resize-none`}
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        placeholder={t.fieldDescription}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="px-6 py-3 rounded-md bg-primary text-black font-semibold hover:bg-primary/90 transition-colors">
          {paintingId ? t.saveChanges : t.addButton}
        </button>
        <button type="button" onClick={onSuccess} className="px-6 py-3 rounded-md border border-white/10 text-muted-foreground hover:text-foreground transition-colors">
          {t.cancel}
        </button>
      </div>
    </form>
  );
}

function ArtistManager() {
  const { data: artist, isLoading } = useGetArtist();
  const updateArtist = useUpdateArtist();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-white/10 rounded-3xl p-8">
      <h2 className="text-2xl font-bold text-primary mb-4">{t.tabArtist}</h2>
      <p className="text-muted-foreground mb-6">{t.artistSpecialtyPlaceholder}</p>
      <button
        onClick={() => {
          updateArtist.mutate(
            { data: artist || {} },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetArtistQueryKey() });
                toast({ title: t.artistSaveSuccess, description: t.artistSaveSuccessDesc });
              },
              onError: () => toast({ title: t.artistSaveError, description: t.artistSaveErrorDesc }),
            }
          );
        }}
        className="px-6 py-3 rounded-md bg-primary text-black font-semibold hover:bg-primary/90 transition-colors"
      >
        {t.saveArtist}
      </button>
    </div>
  );
}

export default Admin;

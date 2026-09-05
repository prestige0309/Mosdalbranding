import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  onAdminAuthStateChange, adminLogout,
  getPortfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem, uploadPortfolioImage,
  getTestimonials, approveTestimonial, rejectTestimonial,
  getQuoteRequests, updateQuoteStatus,
  getOrders, updateOrderStatus,
} from "@/lib/storage";
import type { PortfolioItem, Testimonial, QuoteRequest, Order } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Printer, LogOut, Image, Star, FileText, ShoppingBag,
  Plus, Trash2, Check, X, BarChart2, Pencil, Upload, Loader2
} from "lucide-react";

type Tab = "analytics" | "portfolio" | "testimonials" | "quotes" | "orders";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "portfolio", label: "Portfolio", icon: Image },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "quotes", label: "Quote Requests", icon: FileText },
  { id: "orders", label: "Orders", icon: ShoppingBag },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewed: "bg-yellow-100 text-yellow-700",
  quoted: "bg-green-100 text-green-700",
  pending: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const EMPTY_ITEM = { title: "", category: "branding", description: "", imageUrl: "", featured: false };

const Admin = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [loadingData, setLoadingData] = useState(true);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState(EMPTY_ITEM);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingItem, setSavingItem] = useState(false);

  // Real auth guard: redirects to /admin/login whenever there's no active
  // Supabase session (on load, and immediately if the session ever expires
  // or the admin logs out in another tab).
  useEffect(() => {
    const unsubscribe = onAdminAuthStateChange((loggedIn) => {
      setAuthChecked(true);
      if (!loggedIn) navigate("/admin/login");
    });
    return unsubscribe;
  }, [navigate]);

  const loadAll = useCallback(async () => {
    setLoadingData(true);
    try {
      const [p, t, q, o] = await Promise.all([
        getPortfolioItems(),
        getTestimonials(),
        getQuoteRequests(),
        getOrders(),
      ]);
      setPortfolio(p);
      setTestimonials(t);
      setQuotes(q);
      setOrders(o);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (authChecked) loadAll();
  }, [authChecked, loadAll]);

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin/login");
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.imageUrl) {
      toast.error("Please upload an image or paste an image URL.");
      return;
    }
    setSavingItem(true);
    try {
      const payload = {
        title: newItem.title,
        category: newItem.category as PortfolioItem["category"],
        description: newItem.description,
        imageUrl: newItem.imageUrl,
        featured: newItem.featured,
      };
      if (editingId) {
        const updated = await updatePortfolioItem(editingId, payload);
        setPortfolio((prev) => prev.map((i) => (i.id === editingId ? updated : i)));
        setEditingId(null);
        toast.success("Portfolio item updated!");
      } else {
        const created = await addPortfolioItem(payload);
        setPortfolio((prev) => [created, ...prev]);
        toast.success("Portfolio item added!");
      }
      setNewItem(EMPTY_ITEM);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save portfolio item.");
    } finally {
      setSavingItem(false);
    }
  };

  const handleEditPortfolio = (item: PortfolioItem) => {
    setEditingId(item.id);
    setNewItem({
      title: item.title,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      featured: item.featured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewItem(EMPTY_ITEM);
  };

  const handleImageFile = async (file: File) => {
    setUploadingImage(true);
    try {
      const url = await uploadPortfolioImage(file);
      setNewItem((p) => ({ ...p, imageUrl: url }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    try {
      await deletePortfolioItem(id);
      setPortfolio((prev) => prev.filter((i) => i.id !== id));
      if (editingId === id) handleCancelEdit();
      toast.success("Item deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete item.");
    }
  };

  const handleApproveTestimonial = async (id: string) => {
    try {
      await approveTestimonial(id);
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, approved: true } : t)));
      toast.success("Testimonial approved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve testimonial.");
    }
  };

  const handleRejectTestimonial = async (id: string) => {
    try {
      await rejectTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast.success("Testimonial removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove testimonial.");
    }
  };

  const handleUpdateQuote = async (id: string, status: "new" | "reviewed" | "quoted") => {
    try {
      await updateQuoteStatus(id, status);
      setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update quote.");
    }
  };

  const handleUpdateOrder = async (id: string, status: "pending" | "in_progress" | "completed" | "cancelled") => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update order.");
    }
  };

  const pending = testimonials.filter((t) => !t.approved);
  const approved = testimonials.filter((t) => t.approved);

  if (!authChecked || loadingData) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand-black border-r border-white/10 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 bg-brand-orange rounded flex items-center justify-center">
            <Printer className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white">
            Mosdal<span className="text-brand-orange">Branding Solution</span>
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-brand-orange text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {id === "testimonials" && pending.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {pending.length}
                </span>
              )}
              {id === "quotes" && quotes.filter((q) => q.status === "new").length > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {quotes.filter((q) => q.status === "new").length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          <a href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            View Website ↗
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-brand-black border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-white/70 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h1 className="font-display font-bold text-white capitalize">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>
          <span className="text-white/40 text-xs hidden sm:block">
            {new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </header>

        <div className="flex-1 p-6 overflow-auto">

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Portfolio Items", value: portfolio.length, color: "text-brand-orange" },
                  { label: "Quote Requests", value: quotes.length, color: "text-blue-400" },
                  { label: "Total Orders", value: orders.length, color: "text-green-400" },
                  { label: "Pending Reviews", value: pending.length, color: "text-yellow-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className={`font-display font-bold text-3xl ${color}`}>{value}</div>
                    <div className="text-white/50 text-sm mt-1">{label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Recent Quote Requests</h3>
                  {quotes.length === 0 ? (
                    <p className="text-white/40 text-sm">No quote requests yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {quotes.slice(0, 5).map((q) => (
                        <div key={q.id} className="flex items-center justify-between">
                          <div>
                            <div className="text-white text-sm font-medium">{q.name}</div>
                            <div className="text-white/40 text-xs">{q.service}</div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[q.status]}`}>
                            {q.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-4">Recent Orders</h3>
                  {orders.length === 0 ? (
                    <p className="text-white/40 text-sm">No orders yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((o) => (
                        <div key={o.id} className="flex items-center justify-between">
                          <div>
                            <div className="text-white text-sm font-medium">{o.name}</div>
                            <div className="text-white/40 text-xs">{o.service}</div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status]}`}>
                            {o.status.replace("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === "portfolio" && (
            <div className="space-y-6">
              {/* Add / Edit Form */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  {editingId ? (
                    <><Pencil className="w-4 h-4 text-brand-orange" /> Edit Portfolio Item</>
                  ) : (
                    <><Plus className="w-4 h-4 text-brand-orange" /> Add Portfolio Item</>
                  )}
                </h3>
                <form onSubmit={handleAddPortfolio} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70 text-xs">Title *</Label>
                    <Input
                      required
                      value={newItem.title}
                      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                      placeholder="Project title"
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-brand-orange text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs">Category *</Label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="mt-1 w-full border border-white/20 rounded-md px-3 py-2 text-sm bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    >
                      {["branding", "print", "merchandise", "signage", "apparel", "packaging", "cladding", "pouch", "flex", "sav", "screen printing"].map((c) => (
                        <option key={c} value={c} className="bg-brand-black">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-white/70 text-xs">Image *</Label>
                    <div className="mt-1 flex flex-col sm:flex-row gap-3">
                      <label className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg py-2.5 px-3 cursor-pointer transition-colors text-sm ${uploadingImage ? "border-brand-orange text-brand-orange" : "border-white/20 hover:border-brand-orange text-white/60"}`}>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFile(file);
                          }}
                        />
                        {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploadingImage ? "Uploading..." : "Upload image"}
                      </label>
                      <span className="text-white/30 text-xs self-center">or</span>
                      <Input
                        value={newItem.imageUrl.startsWith("data:") ? "" : newItem.imageUrl}
                        onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                        placeholder="Paste an image URL"
                        className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-brand-orange text-sm"
                      />
                    </div>
                    {newItem.imageUrl && (
                      <img
                        src={newItem.imageUrl}
                        alt="Preview"
                        className="mt-2 h-20 w-32 object-cover rounded-lg border border-white/10"
                      />
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-white/70 text-xs">Description</Label>
                    <Textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      placeholder="Short description of the project..."
                      rows={2}
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-brand-orange text-sm resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured-check"
                      checked={newItem.featured}
                      onChange={(e) => setNewItem({ ...newItem, featured: e.target.checked })}
                      className="accent-brand-orange"
                    />
                    <label htmlFor="featured-check" className="text-white/70 text-sm">Featured on homepage</label>
                  </div>
                  <div className="flex justify-end gap-3">
                    {editingId && (
                      <Button type="button" variant="ghost" onClick={handleCancelEdit} className="text-white/60 hover:text-white hover:bg-white/10">
                        Cancel
                      </Button>
                    )}
                    <Button type="submit" disabled={savingItem || uploadingImage} className="bg-brand-orange hover:bg-orange-600 text-white">
                      {savingItem ? "Saving..." : editingId ? "Save Changes" : "Add Item"}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.map((item) => (
                  <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
                    <div className="aspect-video overflow-hidden">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-medium text-brand-orange uppercase tracking-wide">{item.category}</span>
                          <div className="text-white text-sm font-medium mt-0.5 line-clamp-1">{item.title}</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleEditPortfolio(item)}
                            className="w-7 h-7 bg-white/10 hover:bg-brand-orange text-white/70 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePortfolio(item.id)}
                            className="w-7 h-7 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {item.featured && (
                        <span className="inline-block mt-1.5 bg-brand-orange/20 text-brand-orange text-xs px-2 py-0.5 rounded-full">Featured</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              {pending.length > 0 && (
                <div>
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full" /> Pending Approval ({pending.length})
                  </h3>
                  <div className="space-y-3">
                    {pending.map((t) => (
                      <div key={t.id} className="bg-white/5 border border-red-500/20 rounded-xl p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="text-white font-medium">{t.name} <span className="text-white/50 text-sm font-normal">— {t.company}</span></div>
                            <div className="text-brand-orange text-xs mt-0.5">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                            <p className="text-white/65 text-sm mt-2 leading-relaxed">{t.message}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => { handleApproveTestimonial(t.id); }}
                              className="w-8 h-8 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { handleRejectTestimonial(t.id); }}
                              className="w-8 h-8 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg flex items-center justify-center transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-white mb-3">Approved Reviews ({approved.length})</h3>
                <div className="space-y-3">
                  {approved.map((t) => (
                    <div key={t.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-white font-medium text-sm">{t.name} <span className="text-white/50 font-normal">— {t.company}</span></div>
                        <p className="text-white/50 text-xs mt-1 line-clamp-2">{t.message}</p>
                      </div>
                      <button
                        onClick={() => { handleRejectTestimonial(t.id); }}
                        className="w-7 h-7 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg flex items-center justify-center transition-colors shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quotes Tab */}
          {activeTab === "quotes" && (
            <div className="space-y-4">
              {quotes.length === 0 ? (
                <div className="text-center py-16 text-white/30">No quote requests yet.</div>
              ) : (
                quotes.map((q) => (
                  <div key={q.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-white">{q.name}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[q.status]}`}>
                            {q.status}
                          </span>
                        </div>
                        <div className="text-white/50 text-sm mt-1">{q.email} · {q.phone}</div>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/70">
                          <span><strong className="text-white/90">Service:</strong> {q.service}</span>
                          {q.budget && <span><strong className="text-white/90">Budget:</strong> {q.budget}</span>}
                          {q.deadline && <span><strong className="text-white/90">Deadline:</strong> {q.deadline}</span>}
                        </div>
                        <p className="text-white/50 text-xs mt-2 line-clamp-2">{q.details}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {(["new", "reviewed", "quoted"] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleUpdateQuote(q.id, s)}
                            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                              q.status === s
                                ? "bg-brand-orange border-brand-orange text-white"
                                : "border-white/20 text-white/50 hover:border-brand-orange hover:text-white"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-white/30 text-xs mt-2">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-16 text-white/30">No orders yet.</div>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-white">{o.name}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status]}`}>
                            {o.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="text-white/50 text-sm mt-1">{o.email} · {o.phone}</div>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/70">
                          <span><strong className="text-white/90">Service:</strong> {o.service}</span>
                          <span><strong className="text-white/90">Qty:</strong> {o.quantity}</span>
                          <span><strong className="text-white/90">Specs:</strong> {o.specifications}</span>
                        </div>
                        {o.deliveryAddress && (
                          <p className="text-white/50 text-xs mt-1">📍 {o.deliveryAddress}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        {(["pending", "in_progress", "completed", "cancelled"] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => handleUpdateOrder(o.id, s)}
                            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                              o.status === s
                                ? "bg-brand-orange border-brand-orange text-white"
                                : "border-white/20 text-white/50 hover:border-brand-orange hover:text-white"
                            }`}
                          >
                            {s.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-white/30 text-xs mt-2">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Admin;
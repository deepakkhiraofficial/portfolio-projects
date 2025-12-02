import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from "../utils/api.js";

const STORAGE_KEY = "dk_portfolio_materials_v1";

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function useLocalStorageState(key, initial) {
    const [state, setState] = useState(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : initial;
        } catch {
            return initial;
        }
    });

    React.useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch { }
    }, [key, state]);

    return [state, setState];
}

/* ----------------- Header ----------------- */
function Header({ onOpenAdd, activeTab, setActiveTab }) {
    return (
        <header className="bg-white shadow sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 flex justify-between h-16 items-center">
                <div className="font-bold text-2xl">Deepak's Library</div>
                <nav className="flex gap-3">
                    <button
                        onClick={() => setActiveTab("home")}
                        className={`px-3 py-2 rounded-md ${activeTab === "home" ? "bg-indigo-100" : "hover:bg-gray-100"}`}
                    >
                        Home
                    </button>
                    <button
                        onClick={() => setActiveTab("materials")}
                        className={`px-3 py-2 rounded-md ${activeTab === "materials" ? "bg-indigo-100" : "hover:bg-gray-100"}`}
                    >
                        Materials
                    </button>
                </nav>
                <button
                    onClick={onOpenAdd}
                    className="px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    + Add Material
                </button>
            </div>
        </header>
    );
}

/* ----------------- Hero ----------------- */
function Hero({ setActiveTab }) {
    return (
        <section className="bg-indigo-50 py-12">
            <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-2 gap-6 items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Organize & Share Your Study Materials</h1>
                    <p className="mt-4 text-gray-700">Create subject-wise notes, attach files or links, and share them easily.</p>
                    <button
                        onClick={() => setActiveTab("materials")}
                        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded"
                    >
                        Browse Materials
                    </button>
                </div>
                <div>
                    <img src="/study.jpg" className="rounded-lg shadow-lg w-full h-56 object-cover" alt="study" />
                </div>
            </div>
        </section>
    );
}

/* ----------------- Material Card ----------------- */
function MaterialCard({ m, onEdit, onDelete, onShare }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-5 rounded-xl shadow-md border flex flex-col justify-between"
        >
            <div>
                <h3 className="font-semibold text-lg">{m.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{m.subject}</p>
                <p className="mt-3 text-gray-700 text-sm">{m.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {m.tags?.slice(0, 3).map((t, i) => (
                        <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">{t}</span>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm">
                <div className="flex gap-2">
                    {m.fileDataUrl && (
                        <a download={m.fileName} href={m.fileDataUrl} className="underline text-indigo-600">Download</a>
                    )}
                    {m.externalLink && (
                        <a target="_blank" rel="noreferrer" href={m.externalLink} className="underline text-indigo-600">Open Link</a>
                    )}
                </div>

                <div className="flex gap-2">
                    <button onClick={() => onShare(m)} className="px-2 py-1 border rounded text-xs hover:bg-gray-100">🔗 Share</button>
                    <button onClick={() => onEdit(m)} className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs hover:bg-yellow-300">✏️ Edit</button>
                    <button onClick={() => onDelete(m.id)} className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs hover:bg-red-300">🗑️ Delete</button>
                </div>
            </div>
        </motion.div>
    );
}

/* ----------------- Add/Edit Modal ----------------- */
function AddEditModal({ open, onClose, initial, onSave }) {
    const [form, setForm] = useState({
        subject: "",
        title: "",
        description: "",
        tags: "",
        externalLink: "",
        fileName: "",
        fileDataUrl: null,
    });

    React.useEffect(() => {
        if (initial) {
            setForm({
                ...initial,
                // If tags is an array, convert to comma-separated string
                tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : initial.tags || "",
            });
        } else {
            setForm({
                subject: "",
                title: "",
                description: "",
                tags: "",
                externalLink: "",
                fileName: "",
                fileDataUrl: null,
            });
        }
    }, [initial]);

    function handleFile(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => setForm(p => ({ ...p, fileDataUrl: reader.result, fileName: f.name }));
        reader.readAsDataURL(f);
    }

    const submit = e => {
        e.preventDefault();
        onSave({
            ...form,
            // Convert tags string to array safely
            tags: typeof form.tags === "string"
                ? form.tags.split(",").map(t => t.trim()).filter(Boolean)
                : form.tags,
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-5 z-40">
            <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="font-semibold mb-4">{initial ? "Edit Material" : "Add Material"}</h2>

                <input required placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="border p-2 rounded w-full mb-3" />
                <input required placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="border p-2 rounded w-full mb-3" />
                <textarea required placeholder="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border p-2 rounded w-full mb-3" />
                <input placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="border p-2 rounded w-full mb-3" />
                <input placeholder="External Link" value={form.externalLink} onChange={e => setForm({ ...form, externalLink: e.target.value })} className="border p-2 rounded w-full mb-3" />

                <label className="block text-sm text-gray-600 mb-2">Attach small file (optional)</label>
                <input type="file" onChange={handleFile} className="mb-4" />
                {form.fileName && <div className="text-xs text-gray-500 mb-3">Attached: {form.fileName}</div>}

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} type="button" className="border px-3 py-2 rounded">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-3 py-2 rounded">Save</button>
                </div>
            </form>
        </div>
    );
}
  

/* ----------------- Main App ----------------- */
export default function App() {
    const [localMaterials, setLocalMaterials] = useLocalStorageState(STORAGE_KEY, []);
    const [openAdd, setOpenAdd] = useState(false);
    const [editing, setEditing] = useState(null);
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState("home");

    const queryClient = useQueryClient();

    // ----------------- Fetch materials -----------------
    const { data: materials = [], isLoading, isError } = useQuery({
        queryKey: ["materials"],
        queryFn: async () => {
            const res = await getMaterials();
            const list = (res?.data ?? res ?? []).map(m => ({ ...m, id: m.id || m._id }));
            // Save to localStorage as fallback
            setLocalMaterials(list);
            return list;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // ----------------- Mutations -----------------
    const saveMutation = useMutation({
        mutationFn: async ({ id, payload }) =>
            id ? await updateMaterial(id, payload) : await createMaterial(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => await deleteMaterial(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materials"] }),
    });

    // ----------------- Filtered list -----------------
    const filtered = materials.filter(m => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return [m.title, m.subject, m.description, (m.tags || []).join(" ")].join(" ").toLowerCase().includes(q);
    });

    // ----------------- Handlers -----------------
    const handleSave = async (payload) => {
        try {
            await saveMutation.mutateAsync({ id: editing?.id, payload });
            setEditing(null);
            setOpenAdd(false);
        } catch (err) {
            alert("Operation failed. Try again.");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this material?")) return;
        try {
            await deleteMutation.mutateAsync(id);
        } catch {
            alert("Delete failed");
        }
    };

    const handleShare = async (m) => {
        const url = new URL(window.location.href);
        url.searchParams.set("share", m.id);
        try {
            await navigator.clipboard.writeText(url.toString());
            alert("Share link copied!");
        } catch {
            prompt("Copy this link:", url.toString());
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                onOpenAdd={() => { setEditing(null); setOpenAdd(true); }}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <main className="max-w-6xl mx-auto p-6">
                {activeTab === "home" && <Hero setActiveTab={setActiveTab} />}

                {activeTab === "materials" && (
                    <>
                        <input
                            placeholder="Search..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="border p-2 rounded w-full mb-4"
                        />

                        {isLoading && <div className="text-center text-sm text-gray-600">Loading...</div>}
                        {isError && <div className="text-sm text-yellow-700">Could not fetch from server — using local cache.</div>}

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                            {filtered.length === 0 && !isLoading && (
                                <div className="col-span-full text-center py-12 text-slate-500">
                                    No materials yet — add one using the Add button.
                                </div>
                            )}

                            <AnimatePresence>
                                {filtered.map(m => (
                                    <MaterialCard
                                        key={m.id}
                                        m={m}
                                        onEdit={x => { setEditing(x); setOpenAdd(true); }}
                                        onDelete={handleDelete}
                                        onShare={handleShare}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </main>

            <AddEditModal
                open={openAdd}
                onClose={() => { setOpenAdd(false); setEditing(null); }}
                initial={editing}
                onSave={handleSave}
            />
        </div>
    );
}

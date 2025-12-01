import React, { useEffect, useState } from "react";

const STORAGE_KEY = "dk_portfolio_materials_v1";

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function useLocalStorageState(key, initial) {
    const [state, setState] = useState(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : initial;
        } catch (e) {
            console.error(e);
            return initial;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (e) {
            console.error(e);
        }
    }, [key, state]);

    return [state, setState];
}

function Header({ onOpenAdd, activeTab, setActiveTab }) {
    return (
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                    <div className="text-2xl font-extrabold tracking-tight text-slate-900">Deepak's Library</div>
                    <nav className="hidden sm:flex gap-2">
                        <button
                            onClick={() => setActiveTab("home")}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "home" ? "bg-slate-100" : "hover:bg-slate-50"}`}>
                            Home
                        </button>
                        <button
                            onClick={() => setActiveTab("materials")}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === "materials" ? "bg-slate-100" : "hover:bg-slate-50"}`}>
                            Materials
                        </button>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setActiveTab("materials")}
                        className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
                        Browse Materials
                    </button>
                    <button
                        onClick={onOpenAdd}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50">
                        + Add Material
                    </button>
                </div>
            </div>
        </header>
    );
}

function Hero({ setActiveTab }) {
    return (
        <section className="bg-gradient-to-r from-indigo-50 to-sky-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 grid gap-8 lg:grid-cols-2 items-center">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Organize & Share Your Study Materials</h1>
                    <p className="mt-4 text-slate-700 max-w-xl">
                        Create subject-wise study materials, attach files or links, and share them instantly. Mobile-friendly,
                        SEO-ready layout and fast performance for learners and peers.
                    </p>

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => setActiveTab("materials")}
                            className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700">
                            Browse Materials
                        </button>
                        <a href="mailto:example@email.com" className="px-4 py-2 rounded-md border border-slate-200 text-sm text-slate-700 hover:bg-slate-50">
                            Quick Contact
                        </a>
                    </div>

                    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                        <li>• Add subject, title, description, file or external link</li>
                        <li>• Fast search & filters</li>
                        <li>• Share via generated link</li>
                        <li>• Files stored in browser for quick demos (use a backend for production)</li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <img src="/study.jpg" alt="study" className="w-full h-56 object-cover rounded-lg" />
                </div>
            </div>
        </section>
    );
}

import { motion } from "framer-motion";

function MaterialCard({ m, onEdit, onDelete, onShare }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl flex flex-col justify-between max-w-md mx-auto"
        >
            {/* Top Section */}
            <div>
                <div className="flex items-start justify-between gap-3">

                    {/* Title & Subject */}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                            {m.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {m.subject} • {new Date(m.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 justify-end">
                        {m.tags?.slice(0, 3).map((t, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 text-[11px] font-medium
                             bg-indigo-100 text-indigo-800 rounded-full
                             hover:bg-indigo-200 transition"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-gray-700 text-sm line-clamp-4 leading-relaxed">
                    {m.description}
                </p>
            </div>

            {/* Bottom Section */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                {/* File / Link Section */}
                <div className="flex items-center gap-3 text-sm font-medium flex-wrap">
                    {m.fileDataUrl && (
                        <a
                            download={m.fileName || `material_${m.id}.bin`}
                            href={m.fileDataUrl}
                            className="underline text-indigo-600 hover:text-indigo-800 transition"
                        >
                            Download
                        </a>
                    )}
                    {m.externalLink && (
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={m.externalLink}
                            className="underline text-indigo-600 hover:text-indigo-800 transition"
                        >
                            Open Link
                        </a>
                    )}
                </div>

                {/* Buttons Section */}
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => onShare(m)}
                        className="px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition font-medium"
                    >
                        Share
                    </button>

                    <button
                        onClick={() => {
                            const key = prompt("Enter Admin Key (Edit):");
                            if (key === "9109") onEdit(m);
                            else if (key !== null) alert("Invalid Key!");
                        }}
                        className="px-3 py-1.5 text-xs rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition font-medium"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => {
                            const key = prompt("Enter Admin Key (Delete):");
                            if (key === "9109") onDelete(m.id);
                            else if (key !== null) alert("Invalid Key!");
                        }}
                        className="px-3 py-1.5 text-xs rounded-md bg-red-100 text-red-800 hover:bg-red-200 transition font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </motion.article>
    );
  }


function AddEditModal({ open, onClose, initial, onSave }) {
    const [form, setForm] = useState(() => initial || {
        subject: "",
        title: "",
        description: "",
        tags: "",
        externalLink: "",
        fileName: "",
        fileDataUrl: null,
    });

    useEffect(() => setForm(initial || { subject: "", title: "", description: "", tags: "", externalLink: "", fileName: "", fileDataUrl: null }), [initial]);

    function handleFile(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
            setForm(prev => ({ ...prev, fileDataUrl: reader.result, fileName: f.name }));
        };
        reader.readAsDataURL(f);
    }

    function submit(e) {
        e.preventDefault();
        const payload = {
            ...form,
            tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        };
        onSave(payload);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <form onSubmit={submit} className="bg-white max-w-2xl w-full rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{initial ? "Edit Material" : "Add Material"}</h2>
                    <button type="button" onClick={onClose} className="text-slate-500">Close</button>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex flex-col">
                        <span className="text-sm text-slate-600">Subject</span>
                        <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="mt-1 p-2 border rounded" />
                    </label>

                    <label className="flex flex-col">
                        <span className="text-sm text-slate-600">Title</span>
                        <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1 p-2 border rounded" />
                    </label>
                </div>

                <label className="flex flex-col mt-3">
                    <span className="text-sm text-slate-600">Description</span>
                    <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="mt-1 p-2 border rounded" />
                </label>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex flex-col">
                        <span className="text-sm text-slate-600">Tags (comma separated)</span>
                        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="mt-1 p-2 border rounded" />
                    </label>

                    <label className="flex flex-col">
                        <span className="text-sm text-slate-600">External Link</span>
                        <input value={form.externalLink} onChange={e => setForm({ ...form, externalLink: e.target.value })} className="mt-1 p-2 border rounded" />
                    </label>

                    <label className="flex flex-col">
                        <span className="text-sm text-slate-600">Attach File</span>
                        <input type="file" onChange={handleFile} className="mt-1" />
                        {form.fileName && <span className="text-xs mt-1 text-slate-500">Attached: {form.fileName}</span>}
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
                    <button type="submit" className="px-3 py-2 rounded bg-indigo-600 text-white">Save</button>
                </div>
            </form>
        </div>
    );
}

export default function App() {
    const [materials, setMaterials] = useLocalStorageState(STORAGE_KEY, []);
    const [openAdd, setOpenAdd] = useState(false);
    const [editing, setEditing] = useState(null);
    const [query, setQuery] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("");
    const [activeTab, setActiveTab] = useState("home");

    useEffect(() => {
        // If the page was loaded with a share link (e.g. ?share=<id>), open the item quickly
        const params = new URLSearchParams(window.location.search);
        const shareId = params.get("share");
        if (shareId) {
            const found = materials.find(m => m.id === shareId);
            if (found) {
                setActiveTab("materials");
                setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 200);
            }
        }
    }, [materials]);

    function handleSave(payload) {
        if (editing) {
            setMaterials(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload } : p));
            setEditing(null);
        } else {
            const item = { id: uid(), ...payload, createdAt: Date.now() };
            setMaterials(prev => [item, ...prev]);
        }
        setOpenAdd(false);
    }

    function handleEdit(m) {
        setEditing(m);
        setOpenAdd(true);
    }

    function handleDelete(id) {
        if (!confirm("Delete this material?")) return;
        setMaterials(prev => prev.filter(p => p.id !== id));
    }

    function handleShare(m) {
        // Create a shareable URL with query param (works on same site)
        const url = new URL(window.location.href);
        url.searchParams.set("share", m.id);
        navigator.clipboard?.writeText(url.toString()).then(() => {
            alert("Share link copied to clipboard!");
        }).catch(() => {
            prompt("Copy this share link:", url.toString());
        });
    }

    const subjects = Array.from(new Set(materials.map(m => m.subject))).filter(Boolean);

    const filtered = materials.filter(m => {
        const q = query.trim().toLowerCase();
        if (subjectFilter && m.subject !== subjectFilter) return false;
        if (!q) return true;
        return [m.title, m.subject, m.description, (m.tags || []).join(" ")].join(" ").toLowerCase().includes(q);
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Header onOpenAdd={() => { setEditing(null); setOpenAdd(true); }} activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
                {activeTab === "home" && <Hero setActiveTab={setActiveTab} />}

                <section className={`mt-8 ${activeTab === "materials" ? "block" : "hidden"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <input placeholder="Search materials, titles, tags..." value={query} onChange={e => setQuery(e.target.value)} className="w-full sm:w-96 p-2 border rounded" />
                            <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="p-2 border rounded">
                                <option value="">All subjects</option>
                                {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={() => { setEditing(null); setOpenAdd(true); }} className="px-3 py-2 rounded bg-indigo-600 text-white">+ Add</button>
                            <button onClick={() => { setMaterials([]); }} className="px-3 py-2 rounded border">Clear All</button>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-500">No materials yet — add one using the Add button.</div>
                        )}

                        {filtered.map(m => (
                            <MaterialCard key={m.id} m={m} onEdit={handleEdit} onDelete={handleDelete} onShare={handleShare} />
                        ))}
                    </div>
                </section>

                <section className="mt-12">
                    <h2 className="text-xl font-semibold">About this site</h2>
                    <p className="mt-3 text-slate-700">This is a simple, client-side-first portfolio & materials manager. For production usage: move files to a backend (S3), add authentication, and server-side rendering to improve SEO and sharing previews.</p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border">
                            <h3 className="font-semibold">SEO tips</h3>
                            <ul className="mt-2 text-sm text-slate-700">
                                <li>• Add meta tags & structured data (JSON-LD) via react-helmet or server-side templates.</li>
                                <li>• Use server-side rendering (Next.js) for crawling and link previews.</li>
                                <li>• Use descriptive file names and alt text for images.</li>
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded-lg border">
                            <h3 className="font-semibold">Next steps</h3>
                            <ul className="mt-2 text-sm text-slate-700">
                                <li>• Add backend + authentication for private / public materials.</li>
                                <li>• Add categories, comments, and download analytics.</li>
                                <li>• Add proper shareable preview images (Open Graph / Twitter cards).</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-200 mt-12 bg-white/60">
                <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-sm text-slate-600">© {new Date().getFullYear()} Deepak Kushwah — Portfolio & Study Materials</div>
                    <div className="flex items-center gap-3">
                        <a href="#" className="text-sm underline">Privacy</a>
                        <a href="#" className="text-sm underline">Terms</a>
                    </div>
                </div>
            </footer>

            <AddEditModal
                open={openAdd}
                onClose={() => { setOpenAdd(false); setEditing(null); }}
                initial={editing}
                onSave={handleSave}
            />
        </div>
    );
}

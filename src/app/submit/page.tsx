"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { EUROPEAN_COUNTRIES } from "@/lib/types";

export default function SubmitPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    city: "",
    country: "",
    caption: "",
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File too large. Max 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fileInputRef.current?.files?.[0]) {
      setError("Please select an image");
      return;
    }

    if (!form.city.trim() || !form.country || !form.caption.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("image", fileInputRef.current.files[0]);
      formData.append("city", form.city);
      formData.append("country", form.country);
      formData.append("caption", form.caption);

      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">🗑️</div>
          <h1 className="text-4xl font-black text-lime-400 mb-4">
            Trash Submitted!
          </h1>
          <p className="text-zinc-400 text-lg">
            Your contribution to the trash leaderboard has been recorded.
          </p>
          <p className="text-zinc-600 mt-2">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-100">
            📸 Submit Your Trash
          </h1>
          <p className="mt-3 text-zinc-400 text-lg">
            Found some exceptionally trashy scenery? Share it with the world!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">
              Trash Photo *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                preview
                  ? "border-lime-500/50 bg-lime-500/5"
                  : "border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800/50"
              }`}
            >
              {preview ? (
                <div className="space-y-3">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg object-cover"
                  />
                  <p className="text-zinc-500 text-sm">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-5xl">📷</div>
                  <p className="text-zinc-400 font-medium">
                    Click to upload your trashiest photo
                  </p>
                  <p className="text-zinc-600 text-sm">
                    JPG, PNG, WebP — Max 10MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-bold text-zinc-300 mb-2"
            >
              City Name *
            </label>
            <input
              id="city"
              type="text"
              placeholder="e.g., Naples, Paris, Athens..."
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all"
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-bold text-zinc-300 mb-2"
            >
              Country *
            </label>
            <select
              id="country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all"
            >
              <option value="">Select a country</option>
              {EUROPEAN_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Caption */}
          <div>
            <label
              htmlFor="caption"
              className="block text-sm font-bold text-zinc-300 mb-2"
            >
              Caption *
            </label>
            <textarea
              id="caption"
              placeholder="Describe the scene of the crime..."
              rows={3}
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-lime-500 text-zinc-900 font-black text-lg rounded-xl hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-lime-500/25"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting trash...
              </span>
            ) : (
              "🗑️ Submit This Trash"
            )}
          </button>
        </form>

        <div className="mt-8 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
          <h3 className="font-bold text-zinc-300 mb-3">📋 Submission Guidelines</h3>
          <ul className="space-y-2 text-zinc-500 text-sm">
            <li>• Photos must show actual trash/litter in a European city</li>
            <li>• No personal information or identifiable faces</li>
            <li>• Keep captions fun but respectful</li>
            <li>• One city per submission — submit multiple for different cities!</li>
            <li>• Your submission helps your city climb the trash rankings 📈</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../lib/axios";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", price: "", category: "", stock: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      const p = res.data;
      setForm({ title: p.title, price: p.price, category: p.category, stock: p.stock });
      setFetching(false);
    });
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.price || form.price <= 0) errs.price = "Enter a valid price";
    if (!form.category.trim()) errs.category = "Category is required";
    if (!form.stock || form.stock < 0) errs.stock = "Enter valid stock";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await api.put(`/products/${id}`, form);
      router.push("/products");
    } catch {
      setErrors({ form: "Failed to update product" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <input
            className="border p-2 rounded w-full"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        <div>
          <input
            className="border p-2 rounded w-full"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        <div>
          <input
            className="border p-2 rounded w-full"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        <div>
          <input
            className="border p-2 rounded w-full"
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
        </div>

        {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../lib/axios";
import { Suspense } from "react";

export default function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const latestRequestId = useRef(0);

  let page = parseInt(searchParams.get("page")) || 1;
  if (page < 1) page = 1;
  let limit = parseInt(searchParams.get("limit")) || 10;
  if (![10, 20, 50].includes(limit)) limit = 10;
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";

  const [searchInput, setSearchInput] = useState(query);
  const skip = (page - 1) * limit;

  const [categories, setCategories] = useState([]);

useEffect(() => {
  api.get("/products/categories").then((res) => setCategories(res.data));
}, []);

const changeCategory = (cat) => {
  router.push(`/products?page=1&limit=${limit}&category=${cat}`);
};

const changeSort = (sort) => {
  router.push(`/products?page=1&limit=${limit}&q=${query}&category=${category}&sortBy=${sort}`);
};

  // Debounce: wait 500ms after typing stops, then update the URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== query) {
        router.push(`/products?page=1&limit=${limit}&q=${searchInput}`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch products whenever page, limit, or query changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    const requestId = ++latestRequestId.current; // unique id for this request

    let url;
if (category) {
  url = `/products/category/${category}?limit=${limit}&skip=${skip}`;
} else if (query) {
  url = `/products/search?q=${query}&limit=${limit}&skip=${skip}`;
} else {
  url = `/products?limit=${limit}&skip=${skip}${sortBy ? `&sortBy=${sortBy}&order=asc` : ""}`;
}

    api
      .get(url)
      .then((res) => {
        if (requestId !== latestRequestId.current) return; // ignore stale/slow response
        setProducts(res.data.products);
        setTotal(res.data.total);
      })
      .catch(() => {
        if (requestId === latestRequestId.current) {
          setError("Failed to load products");
        }
      })
      .finally(() => {
        if (requestId === latestRequestId.current) setLoading(false);
      });
  }, [page, limit, query, category, sortBy]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  const [deleteTarget, setDeleteTarget] = useState(null);

const handleDeleteClick = (product) => {
  setDeleteTarget(product);
};

const confirmDelete = async () => {
  try {
    await api.delete(`/products/${deleteTarget.id}`);
  } catch (e) {
    // DummyJSON doesn't really persist deletes, so we still remove it visually
  }
  setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
  setDeleteTarget(null);
};

  const goToPage = (newPage) => {
    router.push(`/products?page=${newPage}&limit=${limit}&q=${query}`);
  };

  const changeLimit = (newLimit) => {
    router.push(`/products?page=1&limit=${newLimit}&q=${query}`);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
  <h1 className="text-2xl font-bold">Products</h1>
  <div className="flex gap-2">
    <button onClick={() => router.push("/products/new")} className="bg-black text-white px-3 py-1 rounded">
      + New Product
    </button>
    <button onClick={handleLogout} className="border px-3 py-1 rounded">
      Logout
    </button>
  </div>
</div>


      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Search products..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className="flex gap-2 mb-4">
  <select value={category} onChange={(e) => changeCategory(e.target.value)} className="border p-2 rounded">
    <option value="">All Categories</option>
    {categories.map((c) => (
      <option key={c.slug} value={c.slug}>{c.name}</option>
    ))}
  </select>

  <select value={sortBy} onChange={(e) => changeSort(e.target.value)} className="border p-2 rounded">
    <option value="">Sort by</option>
    <option value="price">Price</option>
    <option value="rating">Rating</option>
    <option value="title">Title</option>
  </select>
</div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-500">No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Title</th>
                <th className="p-2">Category</th>
                <th className="p-2">Price</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b cursor-pointer hover:bg-gray-50 text-gray-900" onClick={() => router.push(`/products/${p.id}`)}>
                  <td className="p-2">{p.title}</td>
                  <td className="p-2">{p.category}</td>
                  <td className="p-2">${p.price}</td>
                  <td className="p-2">{p.rating}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2" onClick={(e) => e.stopPropagation()}>
  <button
    onClick={() => router.push(`/products/${p.id}/edit`)}
    className="text-blue-600 mr-2"
  >
    Edit
  </button>
  <button
    onClick={() => handleDeleteClick(p)}
    className="text-red-600"
  >
    Delete
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between">
            <p className="text-sm">
              Showing {skip + 1}-{Math.min(skip + limit, total)} of {total}
            </p>

            <div className="flex items-center gap-2">
              <select
                value={limit}
                onChange={(e) => changeLimit(Number(e.target.value))}
                className="border p-1 rounded"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              <button
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="border px-3 py-1 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                className="border px-3 py-1 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      {deleteTarget && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded shadow-lg">
      <p className="mb-4 text-black">Delete "{deleteTarget.title}"?</p>
      <div className="flex gap-2 justify-end">
        <button onClick={() => setDeleteTarget(null)} className="border px-3 py-1 rounded text-black">
          Cancel
        </button>
        <button onClick={confirmDelete} className="bg-red-600 text-white px-3 py-1 rounded text-black">
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="p-8">Loading...</p>}>
      <ProductsContent />
    </Suspense>
  );
}


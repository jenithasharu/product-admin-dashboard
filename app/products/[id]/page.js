"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../lib/axios";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-8">Loading...</p>;

  if (notFound) {
    return (
      <div className="p-8">
        <p className="text-red-500 mb-4">Product not found.</p>
        <button onClick={() => router.push("/products")} className="border px-3 py-1 rounded">
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button onClick={() => router.push("/products")} className="mb-4 border px-3 py-1 rounded">
        ← Back
      </button>

      <div className="flex gap-6">
        <img src={product.thumbnail} alt={product.title} className="w-64 h-64 object-cover rounded" />

        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="text-xl font-semibold">${product.price}</p>
          <p>Rating: {product.rating}</p>

          <h2 className="text-lg font-bold mt-6 mb-2">Reviews</h2>
          {product.reviews?.length ? (
            product.reviews.map((r, i) => (
              <div key={i} className="border-b py-2">
                <p className="font-semibold">{r.reviewerName} — {r.rating}★</p>
                <p className="text-sm">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
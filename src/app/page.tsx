"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  seller_email: string;
  category: string;
  image_url: string;
};

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    "Vehicles",
    "Property Rentals",
    "Apparel",
    "Classifieds",
    "Electronics",
    "Entertainment",
    "Family",
    "Free Stuff",
    "Garden & Outdoor",
    "Hobbies",
    "Home Goods",
    "Home Improvement",
    "Home Sales",
    "Musical Instruments",
    "Office Supplies",
    "Pet Supplies",
    "Sporting Goods",
    "Toys & Games",
    "Buy and sell groups",
  ];

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      let query = supabase.from("listings").select("*");

      if (search) query = query.ilike("title", `%${search}%`);
      if (category) query = query.eq("category", category);

      const { data, error } = await query;
      if (!error) setListings(data as Listing[]);
      else console.error("Error fetching listings:", error);

      setLoading(false);
    };

    fetchListings();
  }, [search, category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          🛍️ Mini Marketplace
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-64 bg-white p-4 rounded-lg shadow">
            <Link
              href="/create"
              className="block bg-blue-600 hover:bg-blue-700 text-white text-center mb-6 py-2 rounded"
            >
              + Create Listing
            </Link>

            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left px-3 py-2 rounded ${
                    category === ""
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setCategory("")}
                >
                  All
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded ${
                      category === cat
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex mb-6">
              <input
                type="text"
                className="w-full border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="🔍 Search listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Listings */}
            {loading ? (
              <div className="text-center text-gray-500">Loading listings...</div>
            ) : listings.length === 0 ? (
              <div className="text-center text-gray-500">No listings found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {listings.map((item) => (
                  <Link
                    key={item.id}
                    href={`/listing/${item.id}`}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-white"
                  >
                    <div>

                    <img
                      src={item.image_url || "/placeholder.png"}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    

                      <div className="p-4">
                        <h2 className="text-lg font-semibold">{item.title}</h2>
                        <p className="text-blue-600 font-bold">${item.price}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

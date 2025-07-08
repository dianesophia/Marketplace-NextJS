"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaTags } from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-10 drop-shadow">
          🛍️ DealnGo Marketplace
        </h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <aside className="md:w-64 bg-white/60 backdrop-blur-lg border border-blue-100 p-5 rounded-xl shadow-md">
            <Link
              href="/create"
              className="block bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-center font-semibold mb-6 py-2 rounded-lg shadow"
            >
              + Create Listing
            </Link>

            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <FaTags /> Categories
            </h2>

            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    category === ""
                      ? "bg-blue-100 text-blue-700 font-medium shadow"
                      : "hover:bg-blue-50 text-gray-700"
                  }`}
                  onClick={() => setCategory("")}
                >
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      category === cat
                        ? "bg-blue-100 text-blue-700 font-medium shadow"
                        : "hover:bg-blue-50 text-gray-700"
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
            {/* Search Bar */}
            <div className="relative mb-8">
              <FaSearch className="absolute left-4 top-3 text-gray-400" />
              <input
                type="text"
                className="w-full border border-gray-300 px-12 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-sky-300"
                placeholder="Search for listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Listings */}
            {loading ? (
              <div className="text-center text-gray-500 animate-pulse">
                Loading listings...
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center text-gray-500">No listings found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {listings.map((item) => (
                  <Link
                    key={item.id}
                    href={`/listing/${item.id}`}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl bg-white transition-all duration-200 group"
                  >
                    <div className="relative">
                      <Image
                        src={item.image_url || "/placeholder.png"}
                        alt={item.title}
                        className="w-full h-48 object-cover transition group-hover:scale-105"
                        width={300}
                        height={200}
                      />
                      <span className="absolute top-2 right-2 bg-white/90 text-xs px-2 py-1 rounded-full shadow text-gray-600">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-bold text-gray-800 truncate">
                        {item.title}
                      </h2>
                      <p className="text-sky-600 font-semibold text-lg">
                        ${item.price}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.description.slice(0, 50)}...
                      </p>
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

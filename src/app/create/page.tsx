"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

export default function CreateListing() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    email: "",
    category: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("listing-images").getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("listings").insert([
        {
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          seller_email: form.email,
          category: form.category,
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;

      router.push("/");
    } catch (err) {
      console.error("Create listing error:", err);
      alert("Error creating listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Back Button */}
        <button
  onClick={() => router.back()}
  className="mb-6 inline-flex items-center text-sm text-blue-600 hover:underline"
>
  ← Back
</button>


        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          🛍️ Create New Listing
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* --- FORM --- */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="title"
              placeholder="Title"
              onChange={handleChange}
              required
              className="w-full border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              rows={4}
              required
              className="w-full border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="price"
                type="number"
                placeholder="Price ($)"
                onChange={handleChange}
                required
                className="w-full border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                onChange={handleChange}
                required
                className="w-full border px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <select
              name="category"
              onChange={handleChange}
              value={form.category}
              required
              className="w-full border px-4 py-3 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div>
  <label
    htmlFor="image-upload"
    className="flex items-center justify-center w-full px-4 py-3 border rounded-md bg-white text-gray-700 cursor-pointer hover:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-300"
  >
    📁 {image ? "Change Image" : "Upload Image"}
  </label>
  <input
    id="image-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />
  {image && (
    <p className="mt-2 text-sm text-gray-500 truncate">Selected: {image.name}</p>
  )}
</div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
            >
              {loading ? "Creating..." : "Create Listing"}
            </button>
          </form>

          {/* --- PREVIEW --- */}
          <div className="bg-gray-50 border rounded-lg p-6 shadow-inner">
            <h2 className="text-xl font-semibold mb-4 text-blue-700 text-center">🖼️ Live Preview</h2>
            <div className="flex flex-col gap-3">
              <div className="w-full aspect-video bg-white rounded-lg overflow-hidden border">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={300}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No Image Selected
                  </div>
                )}
              </div>

              <div className="space-y-1 mt-2 text-sm">
                <h3 className="text-lg font-bold text-gray-800">{form.title || "Item Title"}</h3>
                <p className="text-gray-600">{form.description || "Item description goes here..."}</p>
                <p className="text-blue-600 font-bold text-lg">
                  {form.price ? `$${form.price}` : "$0.00"}
                </p>
                <p className="text-gray-500">{form.category || "No category selected"}</p>
                <p className="text-gray-400">
                  Posted by: {form.email || "email@example.com"}
                </p>
                <p className="text-gray-400">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

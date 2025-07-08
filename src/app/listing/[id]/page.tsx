import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import MessageForm from "./MessageForm";
import Link from "next/link";

export default async function ListingPage({ params }: { params: any }) {
  const id = params.id;

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (!listing || error) {
    console.error("Error loading listing:", error);
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-5xl mx-auto mb-4">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
        >
          ← Back to listings
        </Link>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-200">
        <div className="md:w-1/2 bg-blue-100 flex items-center justify-center p-6">
          <img
            src={listing.image_url || "/placeholder.png"}
            alt={listing.title}
            className="w-full h-[500px] object-cover rounded-xl border shadow-md"
          />
        </div>

        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-blue-700">{listing.title}</h1>
            <p className="text-2xl text-blue-600 font-semibold">${listing.price}</p>

            <div className="mt-4">
              <h2 className="text-md font-semibold text-gray-700 mb-1">🧑 Seller</h2>
              <p className="text-sm text-gray-600">{listing.seller_email}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-md font-semibold text-gray-700 mb-1">📄 Description</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-md font-semibold text-gray-700 mb-2">✉️ Send a message</h2>
              <MessageForm listingId={listing.id} sellerEmail={listing.seller_email} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

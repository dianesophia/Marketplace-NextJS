import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import MessageForm from "./MessageForm";

type Props = {
  params: { id: string };
};

export default async function ListingDetail({ params }: Props) {
  const { id } = params;

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
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-6">
        {/* Image */}
        <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={listing.image_url || "/placeholder.png"}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Listing Info */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-blue-700">{listing.title}</h1>
          <p className="text-gray-500 text-sm">{listing.category}</p>
          <p className="text-2xl text-blue-600 font-semibold">${listing.price}</p>
          <p className="text-gray-700 leading-relaxed mt-4">{listing.description}</p>
          <p className="text-sm text-gray-500 mt-1">Seller: {listing.seller_email}</p>
        </div>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Message Form */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">📩 Contact Seller</h2>
          <MessageForm listingId={listing.id} sellerEmail={listing.seller_email} />
        </div>
      </div>
    </div>
  );
}

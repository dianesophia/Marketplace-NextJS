import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MessageForm from "./MessageForm";
import { Lens } from "@/components/magicui/lens";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (!listing || error) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-50 py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
        >
          ← Back to listings
        </Link>
      </div>

      <div className="max-w-6xl mx-auto rounded-3xl shadow-2xl overflow-hidden border border-gray-200 bg-white/80 backdrop-blur-md flex flex-col md:flex-row transition-all duration-300 hover:shadow-blue-100">
        {/* Image Section */}
        <div className="md:w-1/2 relative bg-gradient-to-tr from-blue-100 to-sky-50 p-6 flex items-center justify-center">
          <Lens zoomFactor={2} lensSize={150} isStatic={false} ariaLabel="Zoom Area">
            <Image
              src={listing.image_url || "/placeholder.png"}
              alt={listing.title}
              width={500}
              height={500}
              className="w-full h-[500px] object-cover rounded-xl border shadow-lg transition-transform duration-300 hover:scale-[1.01]"
              priority
            />
          </Lens>
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-10 flex flex-col justify-between space-y-6">
          {/* Title & Price */}
          <div>
            <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow-sm mb-2">
              {listing.title}
            </h1>
            <p className="text-2xl font-semibold text-blue-600 bg-blue-100 inline-block px-4 py-1 rounded-md">
              ${listing.price}
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Seller Info */}
          <div>
            <h2 className="text-md font-semibold text-gray-700 mb-1">🧑 Seller Information</h2>
            <p className="text-sm text-gray-600">{listing.seller_email}</p>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-md font-semibold text-gray-700 mb-1">📄 Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Message Form */}
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-md font-semibold text-gray-700 mb-2">✉️ Send a Message</h2>
            <MessageForm listingId={listing.id} sellerEmail={listing.seller_email} />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  listingId: string;
  sellerEmail: string;
};

export default function MessageForm({ listingId }: Props) {
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    console.log("Sending message with:", {
      listing_id: listingId,
      buyer_email: buyerEmail,
      message,
    });

    const { error } = await supabase.from("messages").insert({
      listing_id: listingId,
      buyer_email: buyerEmail,
      message: message,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      setStatus("error");
    } else {
      setStatus("sent");
      setBuyerEmail("");
      setMessage("");
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h2 className="text-xl font-semibold mb-2">Message Seller</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Your email"
          value={buyerEmail}
          onChange={(e) => setBuyerEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          required
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
        {status === "sent" && <p className="text-green-600">Message sent successfully ✅</p>}
        {status === "error" && <p className="text-red-600">Failed to send message ❌</p>}
      </form>
    </div>
  );
}

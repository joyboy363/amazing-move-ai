import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, x-client-info",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { name, email, phone, from, to, date, size, services, slotTime } =
      await req.json();

    // Validate required fields
    if (!name || !email || !from || !to || !date) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: name, email, from, to, and date are required.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // --- 1. Save to Supabase Database ---
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: booking, error: dbError } = await supabase
      .from("bookings")
      .insert({
        name,
        email,
        phone: phone || null,
        pickup_address: from,
        destination_address: to,
        move_date: date,
        home_size: size || null,
        additional_services: services && services.length > 0 ? services : null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database insert error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save booking to database." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Booking saved to DB:", booking.id);

    // --- 2. Create Cal.com Booking ---
    const calApiKey = Deno.env.get("CAL_API_KEY");

    if (!calApiKey) {
      console.error("CAL_API_KEY secret is not set.");
      return new Response(
        JSON.stringify({
          success: true,
          booking_id: booking.id,
          calendar_synced: false,
          message: "Booking saved but Cal.com API key not configured.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Look up the numeric eventTypeId from the slug — required by Cal.com v2 booking API
    const eventTypesRes = await fetch(
      "https://api.cal.com/v2/event-types?username=santiago-salas-xrvcym&eventSlug=moving-service-bookings",
      {
        headers: {
          Authorization: `Bearer ${calApiKey}`,
          "cal-api-version": "2024-09-04",
        },
      }
    );
    const eventTypesData = await eventTypesRes.json();
    console.log("Cal.com event types response:", JSON.stringify(eventTypesData));

    const eventTypeId: number | undefined =
      eventTypesData?.data?.[0]?.id ?? eventTypesData?.data?.eventType?.id;

    if (!eventTypeId) {
      console.error("Could not resolve Cal.com eventTypeId from slug. Response:", JSON.stringify(eventTypesData));
      return new Response(
        JSON.stringify({
          success: true,
          booking_id: booking.id,
          calendar_synced: false,
          message: "Booking saved but could not resolve Cal.com event type.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Resolved Cal.com eventTypeId:", eventTypeId);

    // Build the start time — use the slot time from Cal.com availability, fallback to 9 AM
    const startTime = slotTime || `${date}T09:00:00Z`;

    const calPayload = {
      start: startTime,
      eventTypeId,
      attendee: {
        name,
        email,
        timeZone: "America/New_York",
        language: "en",
      },
      metadata: {
        pickup: from,
        destination: to,
        homeSize: size || "Not specified",
        services:
          services && services.length > 0 ? services.join(", ") : "None",
        phone: phone || "Not provided",
        source: "amazing-moving-website",
        bookingDbId: booking.id,
      },
    };

    console.log("Calling Cal.com API with payload:", JSON.stringify(calPayload));

    const calResponse = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${calApiKey}`,
        "cal-api-version": "2024-08-13",
      },
      body: JSON.stringify(calPayload),
    });

    const calData = await calResponse.json();

    if (!calResponse.ok) {
      console.error(
        "Cal.com API error:",
        calResponse.status,
        JSON.stringify(calData)
      );

      // Booking is saved to DB even if Cal.com fails
      return new Response(
        JSON.stringify({
          success: true,
          booking_id: booking.id,
          calendar_synced: false,
          message:
            "Booking saved successfully! Calendar sync encountered an issue but your booking is confirmed.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // --- 3. Update booking with Cal.com UID ---
    const calBookingUid = calData?.data?.uid;
    if (calBookingUid) {
      const { error: updateError } = await supabase
        .from("bookings")
        .update({ cal_booking_uid: calBookingUid, status: "confirmed" })
        .eq("id", booking.id);

      if (updateError) {
        console.error("Failed to update booking with Cal UID:", updateError);
      }
    }

    console.log("Cal.com booking created:", calBookingUid);

    return new Response(
      JSON.stringify({
        success: true,
        booking_id: booking.id,
        calendar_synced: true,
        cal_booking_uid: calBookingUid,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

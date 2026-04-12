import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, x-client-info",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const calApiKey = Deno.env.get("CAL_API_KEY");
    if (!calApiKey) {
      console.error("CAL_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Cal.com API key not configured." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Support both GET (query params) and POST (body params)
    let startDate: string | null = null;
    let endDate: string | null = null;

    if (req.method === "GET") {
      const url = new URL(req.url);
      startDate = url.searchParams.get("start");
      endDate = url.searchParams.get("end");
    } else if (req.method === "POST") {
      try {
        const body = await req.json();
        startDate = body.start || null;
        endDate = body.end || null;
      } catch {
        // If body parsing fails, try query params as fallback
        const url = new URL(req.url);
        startDate = url.searchParams.get("start");
        endDate = url.searchParams.get("end");
      }
    }

    // Default dates if not provided: today -> 1 year from now
    if (!startDate) {
      startDate = new Date().toISOString().split("T")[0];
    }
    if (!endDate) {
      const end = new Date();
      end.setFullYear(end.getFullYear() + 1);
      endDate = end.toISOString().split("T")[0];
    }

    // Fetch available slots from Cal.com
    const calUrl = new URL("https://api.cal.com/v2/slots");
    calUrl.searchParams.set("eventTypeSlug", "moving-service-bookings");
    calUrl.searchParams.set("username", "santiago-salas-xrvcym");
    calUrl.searchParams.set("start", startDate);
    calUrl.searchParams.set("end", endDate);
    calUrl.searchParams.set("timeZone", "America/New_York");

    console.log("Fetching Cal.com slots:", calUrl.toString());

    const calResponse = await fetch(calUrl.toString(), {
      headers: {
        Authorization: `Bearer ${calApiKey}`,
        "cal-api-version": "2024-09-04",
      },
    });

    const calData = await calResponse.json();

    if (!calResponse.ok) {
      console.error(
        "Cal.com slots error:",
        calResponse.status,
        JSON.stringify(calData)
      );
      return new Response(
        JSON.stringify({
          error: "Failed to fetch available dates from Cal.com.",
          details: calData,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Cal.com returns { data: { slots: { "2026-04-10": [...], ... } } }
    const slots = calData?.data?.slots || calData?.data || {};

    // Extract dates that have at least one available slot
    const availableDates: Record<string, string> = {};
    for (const [date, dateSlots] of Object.entries(slots)) {
      if (Array.isArray(dateSlots) && dateSlots.length > 0) {
        const firstSlot = dateSlots[0];
        const slotTime =
          typeof firstSlot === "string"
            ? firstSlot
            : firstSlot?.time || firstSlot?.start;
        availableDates[date] = slotTime;
      }
    }

    console.log(
      `Found ${Object.keys(availableDates).length} available dates out of ${Object.keys(slots).length} total date entries`
    );

    return new Response(
      JSON.stringify({
        success: true,
        availableDates,
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

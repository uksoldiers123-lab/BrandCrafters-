// js/supportForm.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://vekoulqehexqosgwacwa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZla291bHFlaGV4cW9zZ3dhY3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTYxNTUsImV4cCI6MjA3ODczMjE1NX0.B9gSHAb_cLCcjCzXM5FegDIKsuQwHCqAFXslfAzzrQ4"
);

const form = document.getElementById("supportForm");
const msg = document.getElementById("supportMsg");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Sending…";

    const fd = new FormData(form);
    const name = fd.get("name")?.toString().trim() || "";
    const email = fd.get("email")?.toString().trim() || "";
    const business = fd.get("business")?.toString().trim() || "";
    const siteUrl = fd.get("site_url")?.toString().trim() || "";
    const requestType = fd.get("request_type")?.toString() || "";
    const urgency = fd.get("urgency")?.toString() || "";
    const detailsRaw = fd.get("details")?.toString().trim() || "";

    const details = (siteUrl ? `Site: ${siteUrl}\n\n` : "") + detailsRaw;

    if (!name || !email) {
      msg.textContent = "Name and email are required.";
      return;
    }

    // 1) Insert into support_requests
    const { data, error } = await supabase.from("support_requests").insert([
      {
        name,
        email,
        business,
        request_type: requestType,
        urgency,
        details,
        status: "new"
      }
    ])
    .select("*")
    .single();

    if (error) {
      console.error(error);
      msg.textContent = "Something went wrong. Please try again.";
      return;
    }

    // 2) Email you via Edge Function
    try {
      await supabase.functions.invoke("admin-notify", {
        body: {
          type: "support",
          data
        }
      });
    } catch (err) {
      console.warn("notify error (non-fatal):", err);
    }

    msg.textContent = "Request received. We'll follow up by email.";
    form.reset();
  });
}

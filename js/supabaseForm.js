// js/supabaseForm.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://vekoulqehexqosgwacwa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZla291bHFlaGV4cW9zZ3dhY3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTYxNTUsImV4cCI6MjA3ODczMjE1NX0.B9gSHAb_cLCcjCzXM5FegDIKsuQwHCqAFXslfAzzrQ4"
);

const form = document.getElementById("inquiryForm");
const msg = document.getElementById("formMsg");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Submitting…";

    const fd = new FormData(form);
    const name = fd.get("name")?.toString().trim() || "";
    const email = fd.get("email")?.toString().trim() || "";
    const company = fd.get("company")?.toString().trim() || "";
    const service = fd.get("service")?.toString() || "";
    const dashboard = fd.get("dashboard")?.toString() || "None";
    const details = fd.get("details")?.toString().trim() || "";

    const addons = fd.getAll("addons").map(v => v.toString());

    if (!name || !email || !service) {
      msg.textContent = "Name, email, and service are required.";
      return;
    }

    let pages = [];
    if (service === "Starter Craft") {
      pages = ["Home", "About", "Contact"];
    } else if (service === "Business Builder") {
      pages = ["Home", "About", "Services", "Gallery/Work", "Contact"];
    } else if (service === "E-Commerce Store") {
      pages = ["Home", "Shop", "Product", "Cart", "Checkout"];
    }

    // 1) Insert into onboarding_submissions
    const { data, error } = await supabase.from("onboarding_submissions").insert([
      {
        name,
        email,
        business_name: company,
        package_name: service,
        dashboard_plan: dashboard,
        addons,
        pages,
        extra_notes: details,
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

    // 2) Call Edge Function to email you
    try {
      await supabase.functions.invoke("admin-notify", {
        body: {
          type: "onboarding",
          data
        }
      });
    } catch (err) {
      console.warn("notify error (non-fatal):", err);
    }

    msg.textContent = "Request received. We'll email you your setup plan.";
    form.reset();
  });
}

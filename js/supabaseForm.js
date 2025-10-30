import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 🧠 PLACEHOLDERS — add your real credentials here once site is live
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("inquiryForm");
const msg = document.getElementById("formMsg");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Submitting…";

  // Convert multi-selects
  const addons = Array.from(form.querySelector('[name="addons"]').selectedOptions).map(o => o.value).join(", ");
  
  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    company: form.company.value.trim(),
    service: form.service.value,
    dashboard: form.dashboard.value,
    addons,
    details: form.details.value.trim(),
    created_at: new Date().toISOString()
  };

  try {
    // Insert into Supabase table
    const { error } = await supabase.from("inquiries").insert(payload);
    if (error) throw error;

    // ✅ OPTIONAL: Supabase Edge Function or Email Trigger
    // - Create a function in Supabase called "notify_inquiry"
    // - It can email the admin (you) and the customer automatically

    msg.textContent = "✅ Inquiry received! We'll reach out soon.";
    form.reset();
  } catch (err) {
    console.error(err);
    msg.textContent = "❌ Could not submit right now. Please try again later.";
  }
});

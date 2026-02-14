// Simple debug script that can be run in the browser console
// Copy and paste this into the browser console to debug the database

const debugRelatedProducts = async () => {
  console.log("🔍 Starting RelatedProducts debug...");

  try {
    // Check if supabase is available
    if (typeof window.supabase === "undefined") {
      console.log("⚠️ Supabase not found on window object");
      console.log("Trying to import from modules...");

      // Try to access from React components
      const reactRoot = document.querySelector("#root");
      if (reactRoot) {
        console.log("✅ React root found, app is running");
      }
      return;
    }

    // Check products table
    const { data: products, error } = await window.supabase
      .from("products")
      .select("*")
      .limit(5);

    if (error) {
      console.error("❌ Error fetching products:", error);
      return;
    }

    console.log("📦 Products found:", products?.length || 0);

    if (products && products.length > 0) {
      products.forEach((product) => {
        console.log(`  - ${product.name} (Category: ${product.category_id})`);
      });
    } else {
      console.log("⚠️ No products found in database");
      console.log("💡 Try seeding some sample data");
    }

    // Check categories
    const { data: categories, error: catError } = await window.supabase
      .from("categories")
      .select("*");

    if (!catError) {
      console.log("🏷️ Categories found:", categories?.length || 0);
    }
  } catch (error) {
    console.error("❌ Debug error:", error);
  }
};

// Make it available globally
window.debugRelatedProducts = debugRelatedProducts;

console.log(
  "🔧 Debug function loaded! Run 'debugRelatedProducts()' in console to test database connection."
);

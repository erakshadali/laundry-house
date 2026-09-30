// Contact details come from environment variables (Vercel > Settings > Environment Variables).
// NEXT_PUBLIC_* values are baked in at build time, so redeploy after changing them.
// Defaults below are the head-office details published on thelaundryhouseindia.com.
const digits = (s: string) => s.replace(/\D/g, "");
const PHONE = process.env.NEXT_PUBLIC_PHONE || "+91 92746 69278";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "919274669278"; // country code first, digits only

export const BUSINESS = {
  name: "The Laundry House",
  tagline: "Garment Care for Important People",
  phone: PHONE,
  phoneRaw: "+" + digits(PHONE),
  whatsapp: digits(WHATSAPP),
  email: process.env.NEXT_PUBLIC_EMAIL || "info@thelaundryhouseindia.com",
  address:
    process.env.NEXT_PUBLIC_ADDRESS ||
    "Head office: Shop No. 1, Parshwa Darshan Complex, Near Gaay Circle, Shrenik Park Crossing, Akota, Vadodara – 390020",
  hours: process.env.NEXT_PUBLIC_HOURS || "Daily, 9:00 am – 8:00 pm",
  instagram: "https://www.instagram.com/the_laundry_house_official",
  youtube: "https://youtube.com/@thelaundryhouse",
};

/** Noida stores, as listed on thelaundryhouseindia.com/stores. */
export const STORES = [
  { id: "sector-27", name: "Noida (Sector 27)", address: "Shop No. 2, D-Block Market, Sector 27", hours: "9:00 am – 8:00 pm", phone: "8800010102", map: "https://maps.app.goo.gl/QwGgqCkcGrt5eksS6" },
  { id: "sector-75", name: "Noida (Sector 75)", address: "Shop No. 14, Plot-9 Gardenia Gateway, Sector 75", hours: "9:00 am – 8:00 pm", phone: "9650096200", map: "https://maps.app.goo.gl/KhsLcokTDHqU9vtx8" },
  { id: "sector-104", name: "Noida (Sector 104)", address: "Main Road, Hazipur Market Service Lane, Sector 104", hours: "9:00 am – 8:00 pm", phone: "8800010100", map: "https://maps.app.goo.gl/5eEY2dDrh7Gayjkq6" },
  { id: "sector-137", name: "Noida (Sector 137)", address: "Shop No. 08, 1st Floor, Commercial-2, Paras Tierea", hours: "9:00 am – 8:00 pm", phone: "8800000286", map: "" },
  { id: "sector-150", name: "Noida (Sector 150)", address: "Shop No. LG-09, Antriksh Golf City, Sector 150", hours: "9:00 am – 8:00 pm", phone: "8090001500", map: "" },
  { id: "sector-12", name: "Noida (Sector 12)", address: "Shop No. 6, Block I 25, Sector 12 Noida", hours: "10:00 am – 8:00 pm", phone: "8120000822", map: "" },
] as const;

/** The booking form asks for the nearest store; stored on the order as `city`. */
export const CITIES = STORES.map((s) => s.name) as unknown as readonly [string, ...string[]];

export const CATEGORIES = [
  { id: "garment", name: "Garment Care", blurb: "Premium care for daily wear, delicate fabrics and designer outfits: dry cleaning, stain removal and steam press.", image: "/images/drycleaning.jpg", caption: "Steaming a shirt", pos: "50% 60%" },
  { id: "couture", name: "Wedding Couture", blurb: "Specialised bridal and couture garment care that preserves intricate details, delicate fabrics and embellishments.", image: "/images/couture.jpg", caption: "Bridal lehenga", pos: "50% 55%" },
  { id: "sneakers", name: "Sneakers & Bags", blurb: "Expert cleaning, conditioning and restoration for premium shoes, handbags and leather goods.", image: "/images/sneakers.jpg", caption: "White sneakers", pos: "50% 50%" },
  { id: "home", name: "Home & Auto Fabrics", blurb: "Professional cleaning for upholstery, curtains, carpets and car interiors to remove deep stains, dust and allergens.", image: "/images/home.jpg", caption: "Curtains and sofa", pos: "50% 60%" },
] as const;

export const STEPS = [
  { title: "Inspection & stain mapping", text: "Each garment is inspected and stains are identified for safe, effective treatment." },
  { title: "Fabric-safe cleaning", text: "Specialised dry and wet cleaning methods tailored to protect every fabric type." },
  { title: "Finishing & steaming", text: "Expert finishing and steaming restore shape, softness and pristine appearance." },
  { title: "QC & premium packaging", text: "Thorough quality checks followed by hygienic packaging for lasting freshness." },
];

export const FEATURES = [
  { title: "Doorstep convenience", text: "Convenient pickup and delivery from your home, with your garments handled with care from start to finish." },
  { title: "Fabric-safe cleaning", text: "Advanced stain removal and cleaning techniques customised for each fabric to maintain colour, texture and durability." },
  { title: "Advanced cleaning services", text: "Innovative cleaning techniques combined with careful fabric handling for superior, long-lasting freshness." },
  { title: "Inspection & stain mapping", text: "Every garment is inspected and stains are identified before any treatment begins." },
  { title: "Eco-friendly processes", text: "State-of-the-art equipment and eco-friendly processes for superior results." },
  { title: "Quality check & packaging", text: "Each order is quality checked and hygienically packed for lasting freshness." },
];

export const REVIEWS = [
  { text: "TLH have genuinely excellent services. Now I don't worry about stains on my clothes as I am confident that TLH will remove them.", who: "Ravi Choksi" },
  { text: "A very nice and modern unit-cum-store for dry cleaning. Qualitative work, attentive and decent staff. A well-managed place.", who: "Keshav Mitra" },
  { text: "Overall excellent service from start to finish. Proper professionals with great knowledge of fabrics, cleaning and customer service.", who: "Uzair Delair" },
];

export const FAQS = [
  { q: "How does pickup and delivery work?", a: "Book a slot online or on WhatsApp. Our executive collects your garments from your door in that slot and delivers them back once cleaned." },
  { q: "How are prices calculated?", a: "Rates are per item and are starting prices, exclusive of GST. Designer and bridal apparel is charged based on quality and specific requirements." },
  { q: "What is steam press?", a: "Steam press is finishing only (no cleaning) at a lower rate, for garments that just need to look crisp and ready to wear." },
  { q: "What if a stain does not come out?", a: "Every garment is inspected and stains are mapped before treatment. If a stain is permanent we tell you before returning the item." },
  { q: "Can I pay on delivery?", a: "Yes, you can pay on delivery. Online payment is coming soon." },
];

export const SLOT_CAPACITY = 10;

export const SLOTS = [
  { id: "s10", label: "10 AM to 12 PM", startHour: 10 },
  { id: "s12", label: "12 to 2 PM", startHour: 12 },
  { id: "s14", label: "2 to 4 PM", startHour: 14 },
  { id: "s16", label: "4 to 6 PM", startHour: 16 },
  { id: "s18", label: "6 to 8 PM", startHour: 18 },
] as const;

export const STATUSES = [
  { id: "scheduled", label: "Scheduled" },
  { id: "picked_up", label: "Picked up" },
  { id: "washing", label: "In process" },
  { id: "ready", label: "Ready for delivery" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
] as const;

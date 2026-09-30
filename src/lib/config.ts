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
  hours: process.env.NEXT_PUBLIC_HOURS || "9:00 am – 8:00 pm",
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

/** The four pillars, from the client's FAQ page. */
export const FEATURES = [
  { title: "Safe & clean", text: "Skin-friendly, European-standard detergents with soft water for colour retention and gentle care." },
  { title: "Unmatched quality", text: "Carefully designed processes for every fabric type, on professional-grade machines imported from Germany." },
  { title: "Transparency", text: "Open-store layouts (the Live Laundry experience) that let you see our care standards." },
  { title: "Convenience", text: "Easy pickup, delivery and scheduling, online or on WhatsApp." },
  { title: "Inspection & stain mapping", text: "Every garment is inspected and stains are identified before any treatment begins." },
  { title: "Re-clean guarantee", text: "Not satisfied with the result? We offer a complimentary re-cleaning in line with our service guidelines." },
];

/** All nine services listed on thelaundryhouseindia.com/services. */
export const MORE_SERVICES = [
  { name: "Garment Care", text: "Professional cleaning that preserves fabric quality, colour and freshness for daily and premium wear." },
  { name: "Shoe & Bags", text: "Specialised cleaning that restores hygiene, appearance and material integrity without damage." },
  { name: "Home & Auto Fabrics", text: "Deep cleaning for home and car fabrics that removes dust, stains and allergens while protecting texture." },
  { name: "Wedding Couture", text: "Expert care for bridal and designer outfits with delicate fabrics, detailed embroidery and precision finishing." },
  { name: "Curtains & Drapes", text: "Removes dust and pollutants using safe steam or deep wash methods." },
  { name: "Carpet & Rugs", text: "Eliminates deep dirt, stains and odours while restoring softness." },
  { name: "Luxury Leather Care", text: "Premium leather cleaning and restoration to enhance shine, repair wear and extend lifespan." },
  { name: "Silk & Satin Wear", text: "Gentle cleaning that preserves softness, sheen and delicate detailing." },
  { name: "Kids Wear", text: "Safe, hygienic cleaning using gentle detergents suitable for sensitive fabrics." },
];

/** Customer reviews from thelaundryhouseindia.com. */
export const REVIEWS = [
  { text: "TLH have genuinely excellent services. Now I don't worry about stains on my clothes as I am confident that TLH will remove them.", who: "Ravi Choksi" },
  { text: "A very nice and modern unit-cum-store for dry cleaning. Qualitative work, attentive and decent staff. A well-managed place.", who: "Keshav Mitra" },
  { text: "Overall excellent service from start to finish. Proper professionals with great knowledge of fabrics, cleaning and customer service.", who: "Uzair Delair" },
  { text: "Best place to get your laundry done. Not just dry cleaning, but also curtains, carpets, soft toys, house and car cleaning, and even sneaker cleaning.", who: "Sagar Sharma" },
  { text: "The laundry services are great. Their packing and delivery options are really nice. The best service around here.", who: "Akshara Tarkas" },
];

export const ABOUT = {
  lead: "At The Laundry House, garment care goes beyond cleaning. We focus on preserving fabric quality, extending garment life, and delivering a consistently premium experience through advanced technology, expert processes, and attention to detail.",
  safeTitle: "Safe for your body's largest organ",
  safe: "We use only premium, skin-friendly European detergents that meet strict regulatory standards. Choosing them reduces the skin irritation and health risks linked to unregulated detergents, and reflects our commitment to responsible garment care.",
  techTitle: "Where technology, skill & service merge",
  tech: "State-of-the-art technology, eco-friendly processes and highly trained professionals make sure each piece of clothing is treated with the utmost care. From delicate silks to sturdy denims, stubborn stains to intricate embroideries, nothing is too challenging for our master cleaners.",
};

export const FAQS = [
  { q: "How do I schedule a pickup?", a: "Pickups can be scheduled through our website or on WhatsApp by selecting your preferred time slot. We offer doorstep pickup and delivery." },
  { q: "How long does cleaning take?", a: "Standard turnaround is typically 3–4 days. Restoration and delicate items may need additional time. Express service is available in select locations." },
  { q: "Do I need to pay in advance?", a: "Individual orders can be paid at the time of delivery. Membership plans require advance payment. We accept UPI, credit/debit cards and digital wallets." },
  { q: "Which chemicals do you use?", a: "Eco-friendly, mild, skin-friendly European-standard detergents along with soft water, for garment safety and colour retention." },
  { q: "Is it suitable for couture and wedding wear?", a: "Yes. High-value garments undergo fabric inspection and customised cleaning for delicate embroidery, silks and luxury fabrics, including manual stain treatment and pH-neutral cleaning." },
  { q: "What if a garment is damaged?", a: "Every garment is inspected before processing. If a fabric is high-risk we consult you first. In rare cases of damage, resolution is handled transparently based on garment age and value." },
  { q: "What if I am not satisfied?", a: "We offer a complimentary re-cleaning in line with our service guidelines." },
  { q: "What machines do you use?", a: "Professional-grade machines imported from Germany, with specialised programs for different fabric and garment types." },
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

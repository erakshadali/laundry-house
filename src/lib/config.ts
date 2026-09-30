// Contact details come from environment variables (set them in Vercel > Settings > Environment Variables).
// NEXT_PUBLIC_* values are baked in at build time, so redeploy after changing them.
const digits = (s: string) => s.replace(/\D/g, "");
const PHONE = process.env.NEXT_PUBLIC_PHONE || "+91 00000 00000";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "910000000000"; // country code first, digits only

export const BUSINESS = {
  name: "The Laundry House",
  tagline: "Premium laundry & dry cleaning, picked up and delivered.",
  phone: PHONE,
  phoneRaw: "+" + digits(PHONE),
  whatsapp: digits(WHATSAPP),
  email: process.env.NEXT_PUBLIC_EMAIL || "hello@thelaundryhouse.example",
  address: process.env.NEXT_PUBLIC_ADDRESS || "[Head office address]",
  hours: process.env.NEXT_PUBLIC_HOURS || "Mon to Sun, 9 AM to 9 PM",
};

// TODO: replace with the client's real store cities.
export const CITIES = [
  "Delhi NCR",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Vadodara",
  "Jaipur",
  "Chandigarh",
] as const;

export const CATEGORIES = [
  { id: "wash", name: "Wash & Fold", blurb: "Everyday laundry washed, dried and neatly folded, priced per kg.", image: "/images/washfold.jpg", caption: "Freshly folded laundry", pos: "60% 50%" },
  { id: "dryclean", name: "Dry Cleaning", blurb: "Suits, sarees, jackets and delicates cleaned with expert care.", image: "/images/drycleaning.jpg", caption: "Steaming a shirt", pos: "50% 60%" },
  { id: "iron", name: "Ironing & Steam Press", blurb: "Crisp, wrinkle-free clothes, pressed and delivered on hangers.", image: "/images/ironing.jpg", caption: "Steam ironing", pos: "50% 50%" },
  { id: "couture", name: "Wedding Couture", blurb: "Bridal and couture care that protects embroidery and delicate fabrics.", image: "/images/couture.jpg", caption: "Bridal lehenga", pos: "50% 55%" },
  { id: "sneakers", name: "Sneakers & Bags", blurb: "Cleaning, conditioning and restoration for shoes, handbags and leather.", image: "/images/sneakers.jpg", caption: "White sneakers", pos: "50% 50%" },
  { id: "home", name: "Home & Fabrics", blurb: "Curtains, sofas, carpets and car interiors, deep cleaned and refreshed.", image: "/images/home.jpg", caption: "Curtains and sofa", pos: "50% 60%" },
] as const;

export const STEPS = [
  { title: "Schedule a pickup", text: "Book online or on WhatsApp and choose a time slot that suits you." },
  { title: "We collect", text: "Our executive arrives at your door in your chosen slot, free of charge." },
  { title: "We clean", text: "Inspected, stain-mapped and cleaned with fabric-safe methods." },
  { title: "We deliver", text: "Finished, packed and delivered back within 24 to 48 hours." },
];

export const FEATURES = [
  { title: "Free pickup & delivery", text: "Doorstep service in every city we serve, at no extra cost." },
  { title: "Fabric-safe cleaning", text: "Methods matched to each fabric to protect colour, texture and shape." },
  { title: "Inspection & stain mapping", text: "Every garment is checked and stains are identified before treatment." },
  { title: "Eco-friendly processes", text: "Gentle, responsible detergents and efficient modern equipment." },
  { title: "Quality check & packaging", text: "Each order is quality checked and hygienically packed." },
  { title: "Track your order", text: "Know exactly where your garments are, from pickup to delivery." },
];

export const FAQS = [
  { q: "How does pickup and delivery work?", a: "Book a slot online or on WhatsApp. Our executive collects your garments from your door in that slot and delivers them back, usually within 24 to 48 hours." },
  { q: "Is pickup and delivery free?", a: "Yes. Pickup and delivery are free in all our service cities. [Confirm minimum order value with the client.]" },
  { q: "How are prices calculated?", a: "Wash & Fold is charged per kg. Dry cleaning, pressing and specialist services are charged per item. See our rate list for details." },
  { q: "What if a stain does not come out?", a: "Every garment is inspected and stains are mapped before treatment. If a stain is permanent we tell you before returning the item." },
  { q: "Can I pay on delivery?", a: "Yes, you can pay on delivery. Online payment is coming soon." },
];

export const SLOT_CAPACITY = 10;

export const SLOTS = [
  { id: "s8", label: "8 to 10 AM", startHour: 8 },
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

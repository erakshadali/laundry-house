import { ImageResponse } from "next/og";

export const alt = "The Laundry House - Garment Care for Important People";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The preview picture shown when the site link is shared on WhatsApp, Facebook, etc.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0f2a5c", color: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 88, height: 88, borderRadius: 24, background: "#ffc629", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#0f2a5c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c3 4.2 6 6.6 6 10.2a6 6 0 0 1-12 0C6 9.6 9 7.2 12 3z" />
            </svg>
          </div>
          <div style={{ fontSize: 44, fontWeight: 800 }}>The Laundry House</div>
        </div>
        <div style={{ marginTop: 48, fontSize: 76, fontWeight: 800, lineHeight: 1.08, display: "flex", flexWrap: "wrap" }}>
          Premium laundry &amp; dry cleaning, <span style={{ color: "#ffc629", marginLeft: 16 }}>picked up &amp; delivered</span>
        </div>
        <div style={{ marginTop: 36, fontSize: 32, color: "#cbd5e8" }}>6 stores across Noida · Book online or on WhatsApp</div>
      </div>
    ),
    size,
  );
}

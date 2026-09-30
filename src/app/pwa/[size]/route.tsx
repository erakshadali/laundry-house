import { ImageResponse } from "next/og";

// App icon for "Add to Home Screen": navy square with a yellow drop.
export async function GET(_req: Request, ctx: { params: Promise<{ size: string }> }) {
  const { size } = await ctx.params;
  const px = Math.min(512, Math.max(64, Number(size) || 192));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f2a5c" }}>
        <div style={{ width: px * 0.62, height: px * 0.62, borderRadius: px * 0.16, background: "#ffc629", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={px * 0.36} height={px * 0.36} viewBox="0 0 24 24" fill="none" stroke="#0f2a5c" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c3 4.2 6 6.6 6 10.2a6 6 0 0 1-12 0C6 9.600 9 7.200 12 3z" />
          </svg>
        </div>
      </div>
    ),
    { width: px, height: px },
  );
}

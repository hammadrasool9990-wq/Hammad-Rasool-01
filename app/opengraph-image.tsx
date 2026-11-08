import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/content";

export const runtime = "nodejs";
export const alt = `${profile.name} — Web Developer & Digital Marketing Learner`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social card built from the hero portrait, in the site's duotone night palette. */
export default async function OpengraphImage() {
  const [photo, anton] = await Promise.all([
    readFile(join(process.cwd(), "public/images/me/hero.jpg")),
    readFile(join(process.cwd(), "node_modules/@fontsource/anton/files/anton-latin-400-normal.woff")),
  ]);
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "radial-gradient(80% 90% at 80% 40%, #2B1E3F 0%, #07070B 70%)",
          color: "#EDEBE6",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: 40, top: 0, width: 470, height: 630, display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            width={470}
            height={630}
            style={{ objectFit: "cover", filter: "grayscale(1) contrast(1.2)", opacity: 0.9 }}
            alt=""
          />
          <div style={{ position: "absolute", inset: 0, background: "#35E0E8", mixBlendMode: "multiply", display: "flex" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, #07070B 0%, rgba(7,7,11,0) 45%)",
              display: "flex",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: "100%" }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#35E0E8", display: "flex" }}>
            {profile.brand.toUpperCase()} · FROM NOISE TO SIGNAL
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Anton", fontSize: 170, lineHeight: 0.86, textTransform: "uppercase" }}>
              {profile.firstName}
            </div>
            <div style={{ fontFamily: "Anton", fontSize: 170, lineHeight: 0.86, textTransform: "uppercase" }}>
              {profile.lastName}
            </div>
            <div style={{ marginTop: 28, fontSize: 26, color: "#8C82A8", display: "flex" }}>
              {profile.roles.join(" · ")} — {profile.location}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Anton", data: anton, weight: 400, style: "normal" }] },
  );
}

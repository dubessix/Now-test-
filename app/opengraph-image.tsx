import { ImageResponse } from "next/og";

export const alt = "Challan — WhatsApp quote to GST invoice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#E7EDF3",
          color: "#0B1C2C",
          padding: 64,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#C41E3A",
          }}
        >
          CHALLAN · GST BILL BOOK
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 0.95,
              fontWeight: 600,
              color: "#1E3A5F",
              maxWidth: 900,
            }}
          >
            Paste the chat. Stamp the invoice.
          </div>
          <div style={{ marginTop: 24, fontSize: 28, color: "#4A5D73" }}>
            WhatsApp quote → GST tax invoice · ₹1,999 founding year
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

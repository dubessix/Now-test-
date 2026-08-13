import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Challan — GST invoice from WhatsApp",
    short_name: "Challan",
    description: "Paste a WhatsApp quote. Get a GST tax invoice.",
    start_url: "/make",
    display: "standalone",
    background_color: "#E7EDF3",
    theme_color: "#1E3A5F",
    lang: "en-IN",
    categories: ["business", "finance", "productivity"],
  };
}

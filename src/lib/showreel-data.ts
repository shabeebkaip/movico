export interface VideoItem {
  id: string; // Google Drive file ID
  title: string;
  client?: string;
  category: string;
}

export const HIGHLIGHTS: VideoItem[] = [
  { id: "1R4ByejlmrlOI4HK2BLB-w9Xh6J2soDtZ", title: "ESPORTS 2025",      client: "Esports World Cup",  category: "Event"      },
  { id: "1rTXbyWMgkFsEXaRTjzcJ0v57EnfUCWQa", title: "LEAP Movico",        client: "LEAP",               category: "Event"      },
  { id: "1pRR61R2uJybLfToxzQEvg-FfAZn3xD7G", title: "Movico Cityscape",   client: "Cityscape",          category: "Brand Film" },
  { id: "1JIZK5_E1_KwEXOmh-WzdObINaE9dPD89", title: "Movico Promo",       client: "Movico",             category: "Promo"      },
  { id: "1v6zsrYitmw-WvGzRzfxX5gHZTh_6bWW9", title: "Movico Reeis",       client: "Movico",             category: "Brand Film" },
  { id: "1-UW3ETzs52Vbn4sfHd3fVFVWYYsXgp_X", title: "Movico Reel V7",     client: "Movico",             category: "Showreel"   },
  { id: "11TnKCdp_Vjz9vQeKQZhNTCN957e5fSl9", title: "Movico Projects",    client: "Movico",             category: "Portfolio"  },
];

export const VIDEO_WORKS: VideoItem[] = [
  { id: "1RcWVcd-Nz8WamPCvgQT15gmoInJZk6xq", title: "AAML Documentary",             client: "AAML",               category: "Documentary" },
  { id: "1gSSDIFYyrYlOA8DUfsJV9PNjYvdMdwOH", title: "Extreme E Highlight",          client: "Extreme E",          category: "Sport"       },
  { id: "1vqE5axQYURcc2158Icx8gjSy4Gt1GXvc", title: "King Saud",                    client: "King Saud",          category: "Corporate"   },
  { id: "1YjGcxjl1u8xmyauezlWPZkCZMBhlDCgn", title: "KUDMI — Alfanar",              client: "Alfanar",            category: "Corporate"   },
  { id: "1NbZ8CLMk5nULlNx-pOrQYCqh4Ju0P9V7", title: "LEAP Movico",                  client: "LEAP",               category: "Event"       },
  { id: "1LVJd5D61PCZucn4OcAApc6DlJGEg8wvN", title: "LG StanbyME",                  client: "LG",                 category: "Commercial"  },
  { id: "1jqc4mKQ-r5I6phzfWKj3uZZjnydbz_vL", title: "LG XBOOM",                     client: "LG",                 category: "Commercial"  },
  { id: "1lPkGGcsVmkEL-rP-lLCOjnRpgJ1d_xeT", title: "MECC Closing Ceremony",        client: "MECC",               category: "Event"       },
  { id: "1awitn_5RUN5e3wdsvKhvklgGaj1ci8RJ", title: "Ministry of Energy — Day",     client: "Ministry of Energy", category: "Corporate"   },
  { id: "1w27rWacHLfg9Wm5tM8ds2eL6ZAzzYTd6", title: "Ministry of Energy — Recap",   client: "Ministry of Energy", category: "Corporate"   },
  { id: "1OwYUgIPQati8q-4GaSx-zGSNyzhJA0Kt", title: "Brand Campaign",               category: "Brand Film"  },
  { id: "1I0-Oq4rHisArUbc6_2-WN3p4cSL7GyNL", title: "Corporate Film",               category: "Corporate"   },
  { id: "1l32kvknfFTn7hDVyiaSTNCeEqyRseOen", title: "Event Highlights",             category: "Event"       },
  { id: "1y91C7FKtvOPZZ8y_cNI3-spO7RzyuoRd", title: "Commercial Spot",              category: "Commercial"  },
  { id: "1AugbA0gm3Q4C1q7EMZrOMkfYg-XtwPIR", title: "Documentary Feature",         category: "Documentary" },
  { id: "1xXyhDh_FH_6I7Xdb9Rg17qImNsAbxKcf", title: "Product Film",                category: "Commercial"  },
  { id: "1bQQNlt5UHCFOjhlfObgKkj-zq6XwtRdT", title: "Corporate Highlights",        category: "Corporate"   },
  { id: "10LVf716SDDUPi5HFLw-zoGxN6BAtewff", title: "Live Event Production",        category: "Event"       },
  { id: "1W71MmNYxaXLlNUnzezhI63oQE5imxiDH", title: "Brand Story",                  category: "Brand Film"  },
  { id: "1aX-wwixpqXeEs9ETGV97aUTL34Ai1D69", title: "Campaign Video",               category: "Commercial"  },
];

export function driveThumb(id: string) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w800-h450`;
}

export function driveEmbed(id: string) {
  return `https://drive.google.com/file/d/${id}/preview`;
}

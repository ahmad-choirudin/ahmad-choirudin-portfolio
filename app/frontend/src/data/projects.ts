export type Project = {
  image: string;
  /** Dipakai untuk URL halaman case study: /work/<slug>. Harus unik, huruf kecil, tanpa spasi. */
  slug: string;
  title: string;
  category: string;
  period: string;
  text: string;
  tools: string;
  demo: string;
  github: string;
  /** Opsional — tampil di halaman case study hanya jika diisi. */
  role?: string;
  /** Opsional — daftar poin hasil/fitur utama. */
  highlights?: string[];
  /** Opsional — gambar tambahan (letakkan file di public/projects/). */
  gallery?: { src: string; alt: string }[];
};

export const projects: Project[] = [
  {
    image: "/projects/cubbie-nft-marketplace.webp",
    slug: "cubbie-nft-marketplace",
    title: "CUBBIE NFT Marketplace",
    category: "Marketplace",
    period: "NFT Marketplace · Frontend",
    text: "A bold exploration of digital ownership and collectible culture. CUBBIE NFT Marketplace pairs distinctive visual identity with a refined marketplace experience, bringing digital collectibles into a clean, modern Web3 environment.",
    tools: "React, TypeScript, Tailwind CSS",
    demo: "https://www.cubbienft.my.id/",
    github: "https://github.com/ahmad-choirudin/cubbie-nft-market",
  },
  {
    image: "/projects/web3-research-os.webp",
    slug: "web3-research-os",
    title: "CUBBIE Web3 Research OS",
    category: "Dashboard",
    period: "Web3 Analytics · Research Dashboard",
    text: "A unified command center for exploring the crypto ecosystem. Track live market data, analyze price movements, discover DeFi protocol insights, follow crypto news, monitor wallet balances, and manage research workflows all in one purpose-built Web3 workspace.",
    tools: "React, Vite, TypeScript, Tailwind CSS, CoinGecko, DefiLlama",
    demo: "https://www.web3os.my.id/",
    github: "https://github.com/ahmad-choirudin/Web3-Research-OS",
  },
  {
    image: "/projects/airdrop-tracker.webp",
    slug: "airdrop-tracker",
    title: "CUBBIE Airdrop Tracker",
    category: "Dashboard",
    period: "Web3 Tracker · Dashboard",
    text: "A clean and simple web3 dashboard that helps you track, manage, and stay updated on airdrop opportunities across multiple projects, all in one place.",
    tools: "React, Vite, Tailwind CSS, Lucide React, Python",
    demo: "https://www.dropwatch.web.id/",
    github: "https://github.com/ahmad-choirudin/airdrop-tracker",
  },
];

export type Project = {
  image: string;
  slug: string;
  title: string;
  category: string;
  period: string;
  text: string;
  tools: string;
  demo: string;
  github: string;
  role?: string;
  highlights?: string[];
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
    highlights: [
      "Digital collectibles marketplace concept focused on ownership and collectible culture.",
      "Distinctive visual identity designed for a modern Web3 environment.",
      "Clean marketplace experience with a refined interface.",
      "Frontend technology stack built with React, TypeScript, and Tailwind CSS.",
    ],
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
    highlights: [
      "Live cryptocurrency market data and price movement monitoring.",
      "DeFi protocol insights to support ecosystem research.",
      "Crypto news discovery in one centralized workspace.",
      "Wallet balance monitoring.",
      "Unified research workflow for exploring the Web3 ecosystem.",
      "Integration with CoinGecko and DefiLlama.",
    ],
  },
  {
    image: "/projects/airdrop-tracker.webp",
    slug: "airdrop-tracker",
    title: "CUBBIE Airdrop Tracker",
    category: "Dashboard",
    period: "Web3 Tracker · Dashboard",
    text: "A clean and simple Web3 dashboard that helps users track, manage, and stay updated on airdrop opportunities across multiple projects, all in one place.",
    tools: "React, Vite, Tailwind CSS, Lucide React, Python",
    demo: "https://www.dropwatch.web.id/",
    github: "https://github.com/ahmad-choirudin/airdrop-tracker",
    highlights: [
      "Centralized tracking of airdrop opportunities across multiple projects.",
      "A dashboard interface designed to organize airdrop information.",
      "A simple workflow for managing and following opportunities.",
      "Built with React, Vite, Tailwind CSS, Lucide React, and Python.",
    ],
  },
];

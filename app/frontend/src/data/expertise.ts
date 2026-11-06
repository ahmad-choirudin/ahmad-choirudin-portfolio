export type IconName = "Hexagon" | "Network" | "Users" | "Code2" | "Bot" | "FileText";
export type ExpertiseItem = { icon: IconName; name: string; level: string };

export const expertise: ExpertiseItem[] = [
  {
    icon: "Hexagon",
    name: "Web3 Research",
    level: "Research & Analysis",
  },
  {
    icon: "Network",
    name: "Crypto & DeFi",
    level: "Ecosystem Research",
  },
  {
    icon: "Users",
    name: "Community Operations",
    level: "Moderation & Support",
  },
  {
    icon: "Code2",
    name: "Frontend Development",
    level: "Project-Based Practice",
  },
  {
    icon: "Bot",
    name: "AI Evaluation",
    level: "Evaluation & Annotation",
  },
  {
    icon: "FileText",
    name: "Content & Documentation",
    level: "Research-Based Writing",
  },
];

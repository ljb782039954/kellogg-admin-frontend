import { Music2, Globe, MessageSquare } from "lucide-react";
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import type { SocialMediaType } from "@/cms/types";

interface SocialLinksViewProps {
  socialLinks: SocialMediaType;
}

const SOCIAL_ICONS: Record<string, IconType> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaTwitter,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
  tiktok: Music2,
  whatsapp: FaWhatsapp,
  wechat: MessageSquare,
  weibo: Globe,
};

export default function SocialLinksView({ socialLinks }: SocialLinksViewProps) {
  const links = Object.entries(socialLinks).filter(([, url]) => Boolean(url));

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      {links.map(([name, url]) => {
        const Icon = SOCIAL_ICONS[name] || Globe;

        return (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center transition-all hover:scale-110 text-gray-400 hover:text-white hover:border-white"
            title={name}
          >
            <Icon size={20} />
          </a>
        );
      })}
    </div>
  );
}

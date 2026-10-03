import { ArrowUpRight } from 'lucide-react';

export default function CampaignButton({ href, label, variant = 'orange', external = false }: { href: string; label: string; variant?: 'orange' | 'light' | 'outline'; external?: boolean }) {
  return <a className={`button button-${variant} campaign-button`} href={href} aria-label={label} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
    <span className="button-face"><span>{label}</span><ArrowUpRight size={17} /></span>
    <span className="button-face button-face-back" aria-hidden="true"><span>{label}</span><ArrowUpRight size={17} /></span>
  </a>;
}

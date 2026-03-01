'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative z-[2] px-[16px] lg:px-[32px] pt-[24px] pb-[80px] border-t border-glass-border bg-bg-elevated">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-[12px]">
        <div className="flex flex-wrap justify-center gap-x-[20px] gap-y-[8px] text-text-muted text-[16px] mb-[8px]">
          <a href="https://www.instagram.com/ouvalargent" target="_blank" rel="noopener noreferrer" className="hover:text-accent-electric transition-colors">
            Instagram
          </a>
          <a href="https://www.tiktok.com/@ouvalargentfr" target="_blank" rel="noopener noreferrer" className="hover:text-accent-electric transition-colors">
            TikTok
          </a>
          <a href="https://www.linkedin.com/company/ouvalargent" target="_blank" rel="noopener noreferrer" className="hover:text-accent-electric transition-colors">
            LinkedIn
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-x-[24px] gap-y-[8px] text-text-primary text-[18px]">
          <Link href="/mentions-legales" className="hover:text-accent-electric transition-colors">
            Mentions légales & Confidentialité
          </Link>
          <a href="mailto:contact@ouvalargent.com" className="hover:text-accent-electric transition-colors">
            Contact
          </a>
        </div>
        <div className="text-text-secondary text-[18px] text-center">
          © {new Date().getFullYear()} Où Va l&apos;Argent ? — Emmanuel Blézès
        </div>
      </div>
    </footer>
  )
}

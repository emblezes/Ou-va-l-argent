'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="relative z-[2] px-[16px] lg:px-[32px] pt-[24px] pb-[80px] border-t border-glass-border bg-bg-elevated">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-[16px]">
        <p className="text-text-muted text-[15px] text-center max-w-2xl leading-relaxed">
          Où Va l&apos;Argent ? est un média indépendant fondé par Emmanuel Blézès, diplômé de HEC Paris et Sciences Po. Passé par la banque d&apos;investissement, le conseil en stratégie et la recherche macroéconomique, il publie régulièrement des analyses et intervient dans les médias sur les questions économiques et de finances publiques. Voix d&apos;une génération qui exige la transparence sur l&apos;utilisation de l&apos;argent public, il est disponible pour des interventions média, conférences et interviews.
        </p>
        <div className="flex flex-wrap justify-center gap-x-[20px] gap-y-[8px] text-text-muted text-[16px]">
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

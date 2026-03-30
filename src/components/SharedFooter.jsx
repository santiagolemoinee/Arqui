import React from 'react';

const FOOTER_T = {
    es: {
        brandDesc: 'Arqy es la infraestructura digital para el ciclo de vida completo de los activos inmobiliarios. Conectamos a cada actor de la cadena —inversores, constructores, compradores, residentes y administradores— en una única fuente de verdad compartida.',
        productCol: 'Producto', companyCol: 'Compañía', downloadsCol: 'Descargas',
        ourStory: 'Nuestra Historia', blog: 'Blog', contact: 'Contáctanos',
        copyright: '© 2026 Arqy. Todos los derechos reservados.',
        privacy: 'Política de Privacidad', terms: 'Términos de Servicio',
    },
    en: {
        brandDesc: 'Arqy is the digital infrastructure for the complete lifecycle of real estate assets. We connect every stakeholder in the chain — investors, builders, buyers, residents, and administrators — in a single shared source of truth.',
        productCol: 'Product', companyCol: 'Company', downloadsCol: 'Downloads',
        ourStory: 'Our Story', blog: 'Blog', contact: 'Contact Us',
        copyright: '© 2026 Arqy. All rights reserved.',
        privacy: 'Privacy Policy', terms: 'Terms of Service',
    },
};

export default function SharedFooter({ lang = 'es' }) {
    const t = FOOTER_T[lang] || FOOTER_T.es;

    return (
        <footer className="bg-[#0a0f1e] text-white pt-20 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Top grid */}
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-14 border-b border-white/10">

                    {/* Brand column */}
                    <div className="flex flex-col gap-6">
                        <img
                            src="/images/Arqy_logo.png"
                            alt="Arqy Logo"
                            className="h-10 w-52 object-contain object-left"
                        />
                        <p className="text-white/60 text-[15px] leading-relaxed max-w-[340px]">
                            {t.brandDesc}
                        </p>
                        {/* Social icons */}
                        <div className="flex items-center gap-4 mt-1">
                            {/* LinkedIn */}
                            <a href="#" aria-label="LinkedIn" className="opacity-70 hover:opacity-100 transition-opacity" style={{ color: '#0A66C2' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" aria-label="Instagram" className="opacity-70 hover:opacity-100 transition-opacity" style={{ color: '#E1306C' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                </svg>
                            </a>
                            {/* X (Twitter) */}
                            <a href="#" aria-label="X" className="opacity-70 hover:opacity-100 transition-opacity text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            {/* YouTube */}
                            <a href="#" aria-label="YouTube" className="opacity-70 hover:opacity-100 transition-opacity" style={{ color: '#FF0000' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Columna 1 — Producto */}
                    <div className="flex flex-col gap-4">
                        <span className="text-white/30 text-[11px] font-bold uppercase tracking-widest mb-1">{t.productCol}</span>
                        <a href="/build" className="text-white/60 hover:text-white transition-colors text-[15px]">Arqy Build</a>
                        <a href="#" className="text-white/60 hover:text-white transition-colors text-[15px]">Arqy State</a>
                        <a href="#" className="text-white/60 hover:text-white transition-colors text-[15px]">Arqy Home</a>
                        <a href="#" className="text-white/60 hover:text-white transition-colors text-[15px]">Arqy Management</a>
                        <a href="#" className="text-white/60 hover:text-white transition-colors text-[15px]">Arqy Capital</a>
                    </div>

                    {/* Columna 2 — Compañía */}
                    <div className="flex flex-col gap-4">
                        <span className="text-white/30 text-[11px] font-bold uppercase tracking-widest mb-1">{t.companyCol}</span>
                        <a href="#" className="text-white/60 hover:text-white transition-colors text-[15px]">{t.ourStory}</a>
                        <a href="#" className="text-white/60 hover:text-white transition-colors text-[15px]">{t.blog}</a>
                        <a href="/contact" className="text-white/60 hover:text-white transition-colors text-[15px]">{t.contact}</a>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[13px] text-white/30">
                    <span>{t.copyright}</span>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white/60 transition-colors">{t.privacy}</a>
                        <a href="#" className="hover:text-white/60 transition-colors">{t.terms}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

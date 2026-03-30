import React, { useRef, useState } from 'react';
import { useLang } from '../LangContext.jsx';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    Shield, Eye, Zap, TrendingUp, CheckCircle2, ArrowRight,
    Building2, Globe, Home, Settings, Wallet,
} from 'lucide-react';
import SharedNavbar from '../components/SharedNavbar';
import SharedFooter from '../components/SharedFooter';
import { Link } from 'react-router-dom';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const PRIMARY  = '#20316d';
const BG       = '#FBFBFE';

// ─── Data ──────────────────────────────────────────────────────────────────────
const FOUNDERS = [
    {
        name:    'Juan Devera',
        role:    'Fundador & CEO',
        bg:      'Finanzas',
        img:     '/images/Juan_devera_ceo.jpeg',
        quote:   '"Creamos Arqy porque el real estate necesitaba una infraestructura digital que conecte capital, construcción y comunidad en una única fuente de verdad."',
    },
    {
        name:    'Luciano Reca',
        role:    'Co-Fundador',
        bg:      'Finanzas',
        img:     '/images/Luciano_Reca.jpeg',
        quote:   '"Nuestra misión es profesionalizar una industria que durante décadas operó con herramientas del siglo pasado. Arqy es el sistema operativo que lo cambia todo."',
    },
];

const VALUES = [
    { icon: Shield,     title: 'Trazabilidad',   desc: 'Cada dato tiene origen. Cada decisión tiene respaldo.' },
    { icon: Eye,        title: 'Transparencia',  desc: 'Sin opacidad. El dueño sabe todo, siempre.' },
    { icon: Zap,        title: 'Eficiencia',     desc: 'Menos fricción. Más control. Mismo equipo.' },
    { icon: TrendingUp, title: 'Impacto',        desc: 'No construimos software. Construimos infraestructura.' },
];

const MODULES = [
    { id: 'build',      label: 'Arqy Build',      icon: Building2, active: true  },
    { id: 'state',      label: 'Arqy State',       icon: Globe,     active: false },
    { id: 'home',       label: 'Arqy Home',        icon: Home,      active: false },
    { id: 'management', label: 'Arqy Management',  icon: Settings,  active: false },
    { id: 'capital',    label: 'Arqy Capital',     icon: Wallet,    active: false },
];

// ─── Translations ─────────────────────────────────────────────────────────────
const PAGE_T = {
    es: {
        hero: {
            chip:  'EL EQUIPO',
            h1:    ['El equipo detrás del', 'sistema operativo del real estate'],
            desc:  'Somos un equipo de fundadores que vio de cerca el caos de la industria y decidió construir la infraestructura que siempre faltó.',
        },
        manifesto: {
            eyebrow: 'POR QUÉ EXISTIMOS',
            headline: 'El real estate siempre fue grande. Nunca fue eficiente.',
            body: 'Constructoras perdiendo márgenes en Excel. Inversores sin trazabilidad real. Comunidades incomunicadas. La industria más grande del mundo operando como si fuera 1995. Arqy existe para cambiarlo.',
        },
        story: {
            chip:  'NUESTRA HISTORIA',
            h2:    'Lo vimos de cerca. Decidimos construirlo.',
            body:  'Trabajando dentro y alrededor del real estate, vimos cómo proyectos millonarios se gestionaban con planillas, WhatsApp y reuniones sin fin. Los datos existían, pero nadie los conectaba. El problema no era de tecnología: era de infraestructura. Así nació Arqy.',
            bullets: [
                'Una sola fuente de verdad para todo el ciclo de vida',
                'Conectar capital, construcción y comunidad',
                'Infraestructura digital, no otra herramienta aislada',
            ],
        },
        founders: {
            chip:       'LOS FUNDADORES',
            h2:         'Las personas detrás del sistema.',
            bgLabel:    'Formación',
        },
        values: {
            chip: 'LO QUE CREEMOS',
            h2:   'Cuatro principios que guían cada decisión.',
        },
        roadmap: {
            chip: 'LO QUE CONSTRUIMOS',
            h2:   'Un ecosistema completo, módulo a módulo.',
            desc: 'Arrancamos con Arqy Build porque es donde el caos empieza. Cada módulo que viene conecta más capas del ciclo de vida del real estate.',
            available: 'Disponible',
            soon: 'Próximamente',
        },
        cta: {
            h2:   'Sé parte del cambio desde el primer día.',
            desc: 'Arqy Build ya está disponible. Únete a los primeros que están transformando la industria.',
            btn1: 'Solicitar Acceso',
            btn2: 'Conocer Build',
        },
    },
    en: {
        hero: {
            chip:  'THE TEAM',
            h1:    ['The team behind the', 'real estate operating system'],
            desc:  'We are a team of founders who saw the chaos of the industry up close and decided to build the infrastructure that was always missing.',
        },
        manifesto: {
            eyebrow: 'WHY WE EXIST',
            headline: 'Real estate has always been big. Never efficient.',
            body: 'Construction firms losing margins in Excel. Investors with no real traceability. Disconnected communities. The world\'s largest industry operating as if it were 1995. Arqy exists to change that.',
        },
        story: {
            chip:  'OUR STORY',
            h2:    'We saw it up close. We decided to build it.',
            body:  'Working inside and around real estate, we saw how million-dollar projects were managed with spreadsheets, WhatsApp, and endless meetings. The data existed, but nobody connected it. The problem wasn\'t technology — it was infrastructure. That\'s how Arqy was born.',
            bullets: [
                'A single source of truth for the entire lifecycle',
                'Connect capital, construction, and community',
                'Digital infrastructure, not another isolated tool',
            ],
        },
        founders: {
            chip:    'THE FOUNDERS',
            h2:      'The people behind the system.',
            bgLabel: 'Background',
        },
        values: {
            chip: 'WHAT WE BELIEVE',
            h2:   'Four principles that guide every decision.',
        },
        roadmap: {
            chip: 'WHAT WE\'RE BUILDING',
            h2:   'A complete ecosystem, module by module.',
            desc: 'We started with Arqy Build because that\'s where the chaos begins. Each module connects more layers of the real estate lifecycle.',
            available: 'Available',
            soon: 'Coming Soon',
        },
        cta: {
            h2:   'Be part of the change from day one.',
            desc: 'Arqy Build is now available. Join the first ones transforming the industry.',
            btn1: 'Request Access',
            btn2: 'Explore Build',
        },
    },
};

// ─── Chip badge shared ─────────────────────────────────────────────────────────
function Chip({ label }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full px-4 py-1.5 mb-6"
        >
            <span className="text-[11px] font-bold text-[#20316d] uppercase tracking-[2px]">{label}</span>
        </motion.div>
    );
}

// ─── Section 1: Hero ───────────────────────────────────────────────────────────
function AboutHero({ lang }) {
    const t = PAGE_T[lang]?.hero || PAGE_T.es.hero;

    return (
        <section className="relative w-full overflow-hidden" style={{ minHeight: '145vh' }}>
            {/* Background image — identical to home */}
            <img
                src="/images/High_Hero.png"
                alt="Arqy Hero Background"
                className="absolute inset-0 w-full h-full object-cover object-top select-none hero-bg-img"
                loading="eager"
                decoding="sync"
                fetchpriority="high"
                style={{ zIndex: 0 }}
            />

            {/* Blue glow — identical to home */}
            <div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: '613px',
                    height: '613px',
                    left: '-163px',
                    top: '-237px',
                    background: 'rgba(0, 81, 255, 0.05)',
                    borderRadius: '9999px',
                    filter: 'blur(60px)',
                    zIndex: 1,
                }}
            />

            {/* Content */}
            <div className="relative z-10 w-full flex justify-center pt-[200px] pb-[100px]" style={{ minHeight: '100vh' }}>
                <div className="container mx-auto px-6 md:px-12 text-center max-w-[1100px]">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center"
                    >
                        {/* Chip badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 mb-8"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                            <span className="text-white text-[12px] font-bold tracking-[2px] uppercase">{t.chip}</span>
                        </motion.div>

                        {/* H1 */}
                        <h1
                            className="font-black text-white tracking-tight mb-4 max-w-[700px]"
                            style={{
                                fontSize: 'clamp(28px, 8vw, 54.4px)',
                                lineHeight: '1.1',
                                fontWeight: '800',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                        >
                            <span className="lg:whitespace-nowrap">{t.h1[0]}</span>
                            <br />
                            <span style={{ color: '#aebfff' }}>{t.h1[1]}</span>
                        </h1>

                        {/* Description */}
                        <p
                            className="text-white max-w-[587px] mb-[26px]"
                            style={{
                                fontSize: '19px',
                                lineHeight: '32px',
                                fontWeight: '800',
                                opacity: '0.8',
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            {t.desc}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
                                className="px-8 py-4 bg-[#20316d] text-white font-bold rounded-full text-[16px] transition-all hover:brightness-110 active:scale-95 whitespace-nowrap"
                                style={{ boxShadow: '0 4px 14px rgba(32,49,109,0.25)' }}
                            >
                                Hablar con un Experto
                            </button>
                            <Link
                                to="/#build"
                                className="px-8 py-4 text-white font-bold rounded-full text-[16px] transition-all active:scale-95 whitespace-nowrap"
                                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.4)' }}
                            >
                                Explora el Ecosistema
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ─── Section 2: Manifiesto ─────────────────────────────────────────────────────
function Manifesto({ lang }) {
    const t = PAGE_T[lang]?.manifesto || PAGE_T.es.manifesto;
    return (
        <section className="relative pt-28 pb-12 px-6 overflow-hidden" style={{ background: '#F9FAFB' }}>
            <div className="relative max-w-4xl mx-auto text-center">
                {/* Eyebrow */}
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="text-[11px] font-bold uppercase tracking-[3px] mb-6"
                    style={{ color: '#20316d' }}
                >
                    {t.eyebrow}
                </motion.p>

                {/* Headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.08 }}
                    className="font-extrabold leading-[1.1] mb-8"
                    style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#111827' }}
                >
                    {t.headline}
                </motion.h2>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-16 h-[2px] rounded-full mx-auto mb-8"
                    style={{ background: '#20316d' }}
                />

                {/* Body */}
                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.25 }}
                    className="leading-[1.8] max-w-2xl mx-auto"
                    style={{ fontSize: '18px', color: '#6B7280' }}
                >
                    {t.body}
                </motion.p>
            </div>
        </section>
    );
}

// ─── Section 3: Impact (two-column blocks) ─────────────────────────────────────
const IMPACT_BLOCKS = {
    es: [
        {
            img: '/images/about_city_aerial.jpeg',
            imgRight: false,
            headline: 'Transformamos el real estate con infraestructura digital',
            desc: 'Desarrollamos e iteramos nuestra plataforma sin parar para cubrir las necesidades actuales y futuras de la industria. Desde gestión de obra en tiempo real hasta trazabilidad de capital e inteligencia comunitaria, nunca paramos de construir.',
            features: [
                { title: 'Trazabilidad total', desc: 'Cada decisión respaldada con datos en tiempo real.' },
                { title: 'Ecosistema conectado', desc: 'Capital, construcción y comunidad en una sola plataforma.' },
            ],
            link: { label: 'Conocer la plataforma', href: '/build' },
        },
        {
            img: '/images/about_people_building.jpeg',
            imgRight: true,
            headline: 'Mejoramos la vida de todos en el ecosistema inmobiliario',
            desc: 'El real estate afecta a millones de personas: inversores, constructores, compradores y residentes. Arqy existe para que cada actor del ciclo tenga las herramientas que merece.',
            features: [
                { title: 'Democratizamos el capital', desc: 'Inversión accesible, transparente y trazable para todos.' },
                { title: 'Profesionalizamos la gestión', desc: 'Herramientas de clase mundial para equipos de cualquier tamaño.' },
                { title: 'Conectamos comunidades', desc: 'Residentes con voz, datos y control sobre su entorno.' },
            ],
            link: { label: 'Explorar módulos', href: '/build' },
        },
    ],
    en: [
        {
            img: '/images/about_city_aerial.jpeg',
            imgRight: false,
            headline: 'We transform real estate with digital infrastructure',
            desc: 'We develop and iterate our platform non-stop to meet the current and future needs of the industry. From real-time construction management to capital traceability and community intelligence.',
            features: [
                { title: 'Full traceability', desc: 'Every decision backed by real-time data.' },
                { title: 'Connected ecosystem', desc: 'Capital, construction and community on one platform.' },
            ],
            link: { label: 'Explore the platform', href: '/build' },
        },
        {
            img: '/images/about_people_building.jpeg',
            imgRight: true,
            headline: 'We improve the lives of everyone in the real estate ecosystem',
            desc: 'Real estate affects millions: investors, builders, buyers and residents. Arqy exists so every actor in the cycle has the tools they deserve.',
            features: [
                { title: 'We democratize capital', desc: 'Accessible, transparent and traceable investment for everyone.' },
                { title: 'We professionalize management', desc: 'World-class tools for teams of any size.' },
                { title: 'We connect communities', desc: 'Residents with a voice, data and control over their environment.' },
            ],
            link: { label: 'Explore modules', href: '/build' },
        },
    ],
};

function ImpactSection({ lang }) {
    const blocks = IMPACT_BLOCKS[lang] || IMPACT_BLOCKS.es;
    return (
        <section className="pt-0 pb-20 bg-white">
            {blocks.map((block, bi) => (
                <div
                    key={bi}
                    className="max-w-7xl mx-auto"
                    style={{ minHeight: '520px', paddingLeft: bi === 0 ? '1.5rem' : '1.5rem', paddingRight: bi === 0 ? '0' : '1.5rem' }}
                >
                    <div
                        className={`flex flex-col ${block.imgRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} ${bi === 0 ? 'items-start' : 'items-stretch'} ${bi === 0 ? 'gap-12' : 'gap-8'}`}
                        style={{ minHeight: bi === 0 ? '420px' : '520px' }}
                    >
                    {/* Image (desktop only in flow) */}
                    <motion.div
                        initial={{ opacity: 0, x: block.imgRight ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className={`hidden lg:block overflow-hidden ${bi === 0 ? 'flex-1' : 'flex-shrink-0'}`}
                        style={{
                            width: bi === 0 ? undefined : '50%',
                            minHeight: bi === 0 ? '340px' : '400px',
                            maxHeight: bi === 0 ? '420px' : 'none',
                            marginTop: bi === 0 ? '4rem' : '0',
                        }}
                    >
                        <img
                            src={block.img}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, x: block.imgRight ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className={`flex items-center ${bi === 0 ? 'lg:w-[38%] flex-shrink-0' : 'flex-1'}`}
                    >
                        <div
                            className={`py-8 lg:py-16 w-full ${bi === 1 ? 'lg:max-w-[520px] lg:ml-auto lg:mr-0 lg:pl-4' : ''}`}
                        >
                            <h2
                                className="font-extrabold text-[#111827] leading-tight mb-5"
                                style={{ fontSize: 'clamp(24px, 2.8vw, 38px)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                {block.headline}
                            </h2>
                            <p className="text-[#6B7280] text-[16px] leading-[1.75] mb-8">
                                {block.desc}
                            </p>
                            <div className="flex flex-col gap-5 mb-8">
                                {block.features.map((f, fi) => (
                                    <motion.div
                                        key={fi}
                                        initial={{ opacity: 0, y: 12 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.2 + fi * 0.1 }}
                                    >
                                        <p className="text-[15px] font-bold text-[#111827] mb-0.5">{f.title}</p>
                                        <p className="text-[14px] text-[#6B7280] leading-snug">{f.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Image (mobile/tablet: below content, full width) */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:hidden w-full overflow-hidden -mx-6"
                        style={{ width: 'calc(100% + 3rem)' }}
                    >
                        <img
                            src={block.img}
                            alt=""
                            className="w-full h-auto object-cover"
                        />
                    </motion.div>
                    </div>
                </div>
            ))}
        </section>
    );
}

// ─── Section 4 (prev 3): Nuestra Historia ──────────────────────────────────────
function OurStory({ lang }) {
    const t = PAGE_T[lang]?.story || PAGE_T.es.story;
    return (
        <section className="pt-12 pb-28 px-6" style={{ background: BG }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Left: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -32 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65 }}
                        className="flex-1"
                    >
                        <Chip label={t.chip} />
                        <h2
                            className="font-extrabold text-[#111827] leading-tight mb-6"
                            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            {t.h2}
                        </h2>
                        <p className="text-[#6B7280] text-[17px] leading-[1.75] mb-8">
                            {t.body}
                        </p>
                        <div className="flex flex-col gap-4">
                            {t.bullets.map((bullet, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.45, delay: 0.1 + i * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-5 h-5 rounded-full bg-[#20316d] flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-[15px] font-medium text-[#374151]">{bullet}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 32 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, delay: 0.1 }}
                        className="flex-1 w-full"
                    >
                        <div className="relative overflow-hidden aspect-[4/3]">
                            <img
                                src="/images/Juan_Lucho.png"
                                alt="Juan Devera y Luciano Reca"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}


// ─── Section 5: Valores ────────────────────────────────────────────────────────
function Values({ lang }) {
    const t = PAGE_T[lang]?.values || PAGE_T.es.values;
    return (
        <section className="py-28 px-6" style={{ background: BG }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <Chip label={t.chip} />
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="text-[32px] md:text-[44px] font-extrabold text-[#111827]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {t.h2}
                    </motion.h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                    {VALUES.map(({ icon: Icon, title, desc }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -5, boxShadow: '0 20px 48px rgba(0,0,0,0.08)' }}
                            className="bg-white border border-[#E5E7EB] rounded-2xl p-8 cursor-default transition-shadow duration-300"
                            style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#20316d]/10 flex items-center justify-center mb-5">
                                <Icon className="w-5 h-5 text-[#20316d]" strokeWidth={2} />
                            </div>
                            <h3 className="text-[18px] font-bold text-[#111827] mb-2">{title}</h3>
                            <p className="text-[14px] text-[#6B7280] leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Section 6: Roadmap de módulos ─────────────────────────────────────────────
function ModuleRoadmap({ lang }) {
    const t = PAGE_T[lang]?.roadmap || PAGE_T.es.roadmap;
    return (
        <section className="py-28 px-6 bg-white border-t border-[#E5E7EB]">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <Chip label={t.chip} />
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="text-[32px] md:text-[44px] font-extrabold text-[#111827] mb-4"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {t.h2}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.16 }}
                        className="text-[16px] text-[#6B7280] max-w-xl mx-auto leading-relaxed"
                    >
                        {t.desc}
                    </motion.p>
                </div>

                {/* Módulos con línea conectora */}
                <div className="relative flex flex-wrap justify-center items-center gap-4 md:gap-0">
                    {/* Connecting line — visible only on md+ */}
                    <div className="absolute top-1/2 left-[5%] right-[5%] h-px bg-[#E5E7EB] -translate-y-1/2 hidden md:block pointer-events-none" />

                    {MODULES.map((mod, i) => {
                        const Icon = mod.icon;
                        return (
                            <motion.div
                                key={mod.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45, delay: i * 0.1 }}
                                className="relative z-10 flex flex-col items-center gap-3 md:flex-1"
                            >
                                <div
                                    className={`flex flex-col items-center gap-2.5 px-6 py-5 rounded-2xl border-2 transition-all duration-300 min-w-[140px] ${
                                        mod.active
                                            ? 'bg-[#20316d] border-[#20316d] shadow-[0_8px_32px_rgba(32,49,109,0.3)]'
                                            : 'bg-white border-dashed border-[#D1D5DB]'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mod.active ? 'bg-white/15' : 'bg-[#F3F4F6]'}`}>
                                        <Icon className={`w-5 h-5 ${mod.active ? 'text-white' : 'text-[#9CA3AF]'}`} />
                                    </div>
                                    <span className={`text-[13px] font-bold text-center leading-tight ${mod.active ? 'text-white' : 'text-[#9CA3AF]'}`}>
                                        {mod.label}
                                    </span>
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                        mod.active
                                            ? 'bg-[#22C55E]/20 text-[#22C55E]'
                                            : 'bg-[#F3F4F6] text-[#9CA3AF]'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${mod.active ? 'bg-[#22C55E]' : 'bg-[#D1D5DB]'}`} />
                                        {mod.active ? t.available : t.soon}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ─── Section 7: CTA Final ──────────────────────────────────────────────────────
function CTAFinal({ lang }) {
    const t = PAGE_T[lang]?.cta || PAGE_T.es.cta;
    return (
        <section className="py-28 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #0d0da9 100%)` }}>
            <motion.div
                className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
                style={{ background: '#7B61FF', filter: 'blur(100px)' }}
                animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
                style={{ background: '#aebfff', filter: 'blur(100px)' }}
                animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative max-w-3xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2
                        className="text-white font-extrabold leading-[1.12] mb-5"
                        style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {t.h2}
                    </h2>
                    <p className="text-white/65 text-[17px] mb-10 leading-relaxed">{t.desc}</p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <motion.a
                            href="#"
                            className="inline-flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-colors duration-200"
                            style={{ color: PRIMARY }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            {t.btn1} <ArrowRight size={16} />
                        </motion.a>
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                            <Link
                                to="/build"
                                className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-colors duration-200"
                            >
                                {t.btn2}
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
    const { lang, setLang } = useLang();

    React.useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-[#FBFBFE] text-[#111827] overflow-x-clip">
            <SharedNavbar lang={lang} setLang={setLang} />
            <AboutHero lang={lang} />
            <Manifesto lang={lang} />
            <OurStory lang={lang} />
            <Values lang={lang} />
            <ImpactSection lang={lang} />
            <ModuleRoadmap lang={lang} />
            <CTAFinal lang={lang} />
            <SharedFooter lang={lang} />
        </div>
    );
}

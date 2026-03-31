import React, { useRef, useEffect, useState, useMemo, memo } from 'react';
import { useLang } from '../LangContext.jsx';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import {
    TrendingUp, LayoutDashboard, Package, Users, DollarSign,
    FolderOpen, BarChart3, ArrowRight, Link2, Eye, Zap,
    HardHat, ChevronRight, Building2, Wrench, CheckCircle2,
    Database, Globe, Wallet, Home, Settings,
    FileText, Search, Shield, GitBranch,
} from 'lucide-react';
import SharedNavbar from '../components/SharedNavbar';
import SharedFooter from '../components/SharedFooter';
import SharedAboutSection from '../components/SharedAboutSection';
import { Link } from 'react-router-dom';

// ─── Design tokens ────────────────────────────────────────────────────────────
const PRIMARY  = '#20316d';
const VIOLET   = '#7B61FF';
const BG       = '#FBFBFE';
const DOCS_BLUE = '#0051FF';

// ─── Translations ─────────────────────────────────────────────────────────────
const PAGE_T = {
    es: {
        hero: {
            chip: 'Módulo de Documentos · Arqy Build',
            title: 'Todos los documentos\nde la obra. Siempre encontrables.',
            description: 'Planos, contratos, permisos y especificaciones en un solo lugar. La versión correcta, siempre disponible para quien la necesita.',
            cta1: 'Solicitar Demo',
            cta2: 'Ver Soluciones',
        },
        metrics: {
            chip: 'Impacto real',
            title: 'Documentos bajo control, siempre.',
            description: 'Los números que cambian cuando dejás de buscar archivos en emails.',
            items: [
                { label: 'Documentos trazables', sub: 'versión, autor y fecha de cada cambio' },
                { label: 'Documentos perdidos en emails', sub: 'todo centralizado por proyecto' },
                { label: 'Más rápido para encontrar un archivo', sub: 'búsqueda instantánea vs carpetas' },
            ],
        },
        steps: {
            chip: 'Cómo funciona',
            title: 'Del archivo suelto al repositorio de obra.\nEn tres pasos.',
            description: 'El ciclo completo de gestión documental para una constructora. Sin emails, sin versiones perdidas.',
            items: [
                { title: 'Cargá', desc: 'Subí cualquier tipo de archivo desde tu computadora o celular. Planos, contratos, fotos de obra. Todo en segundos.' },
                { title: 'Organizá', desc: 'El sistema lo clasifica por proyecto, categoría y tipo. Con versiones, fechas y responsable asignado automáticamente.' },
                { title: 'Encontrá', desc: 'Búsqueda instantánea por nombre, proyecto, tipo o fecha. El documento correcto en segundos, sin buscar en carpetas.' },
            ],
        },
        solutions: {
            chip: 'Funcionalidades',
            title: 'Todo lo que necesita tu gestión documental.',
            description: 'Desde el primer archivo hasta la auditoría. Sin cambiar de herramienta.',
            items: [
                { title: 'Repositorio por proyecto', desc: 'Todos los documentos de cada obra en un solo lugar. Planos, contratos, permisos y fotos organizados por proyecto y categoría.' },
                { title: 'Control de versiones', desc: 'Cada archivo mantiene su historial completo. Siempre sabés cuál es la versión vigente, quién la subió y cuándo.' },
                { title: 'Búsqueda inteligente', desc: 'Encontrá cualquier documento en segundos. Filtrá por nombre, proyecto, tipo, fecha o responsable.' },
                { title: 'Control de accesos', desc: 'Definí quién puede ver, editar o descargar cada documento. Accesos por rol, por obra o por tipo de archivo.' },
                { title: 'Documentos vinculados a tareas', desc: 'Adjuntá planos y specs directamente a las tareas de obra. El equipo tiene el documento correcto sin buscarlo.' },
                { title: 'Alertas de vencimiento', desc: 'Certificados, seguros y permisos con fechas de vencimiento automáticamente monitoreados. Cero renovaciones perdidas.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'El costo real de una versión desactualizada.',
        },
        actors: {
            chip: 'Para quién',
            items: [
                { chip: 'Director / Dueño', desc: 'Control total: qué documentos existen, quién los tiene y cuáles están por vencer. Sin depender de que alguien te mande el archivo.' },
                { chip: 'Arquitecto / Jefe de Obra', desc: 'Planos actualizados, contratos y permisos en un clic. Desde el celular en obra, sin llamar a la oficina.' },
                { chip: 'Capataz / Operario', desc: 'El plano del día, disponible desde el celular. Sin llamadas para conseguir la versión correcta.' },
            ],
        },
        whyArqui: {
            chip: 'Por qué Arqy Docs',
            description: 'Diseñado para constructoras que necesitan orden documental real, no una carpeta compartida con otro nombre.',
            items: [
                { title: 'Todo centralizado.', desc: 'Un solo repositorio para todas las obras. Sin carpetas de Drive desorganizadas, sin "mandame el plano por WhatsApp".' },
                { title: 'Control de versiones.', desc: 'Cada cambio tiene registro. Siempre sabés cuál es la versión vigente y quién la modificó por última vez.' },
                { title: 'Búsqueda instantánea.', desc: 'Por nombre, proyecto, tipo o fecha. El documento correcto en segundos, sin abrir 10 carpetas.' },
                { title: 'Accesos controlados.', desc: 'Cada persona ve solo lo que necesita. Sin documentos sensibles expuestos, sin accesos innecesarios.' },
            ],
        },
        ecosystem: { title: 'El Ecosistema que lo Une Todo', desc: 'Cinco módulos interconectados que cubren el ciclo de vida completo del real estate.' },
        about: {
            chip: 'El equipo',
            title: 'Quiénes somos',
            desc: 'Conocé al equipo detrás de la transformación digital del real estate',
            yearsLabel: 'años de experiencia',
            studyLabel: 'Formación',
        },
        cta: {
            title: 'Todos tus documentos, organizados desde hoy.',
            description: 'Empezá con Arqy Docs y eliminá la búsqueda de archivos para siempre.',
        },
    },
    en: {
        hero: {
            chip: 'Document Management Module · Arqy Build',
            title: 'All project documents.\nAlways findable.',
            description: 'Drawings, contracts, permits, and specs in one place. The correct version, always available to whoever needs it.',
            cta1: 'Request Demo',
            cta2: 'View Solutions',
        },
        metrics: {
            chip: 'Real impact',
            title: 'Documents under control, always.',
            description: 'The numbers that change when you stop searching for files in emails.',
            items: [
                { label: 'Traceable documents', sub: 'version, author and date of every change' },
                { label: 'Documents lost in emails', sub: 'everything centralized by project' },
                { label: 'Faster to find a file', sub: 'instant search vs folders' },
            ],
        },
        steps: {
            chip: 'How it works',
            title: 'From loose file to project repository.\nIn three steps.',
            description: 'The complete document management cycle for a construction firm. No emails, no lost versions.',
            items: [
                { title: 'Upload', desc: 'Upload any file type from your computer or phone. Plans, contracts, site photos. Done in seconds.' },
                { title: 'Organize', desc: 'The system classifies it by project, category and type. With versions, dates and assigned owner automatically.' },
                { title: 'Find', desc: 'Instant search by name, project, type or date. The right document in seconds, without browsing folders.' },
            ],
        },
        solutions: {
            chip: 'Features',
            title: 'Everything your document management needs.',
            description: 'From the first file to the audit. Without switching tools.',
            items: [
                { title: 'Repository by project', desc: 'All documents for each project in one place. Plans, contracts, permits and photos organized by project and category.' },
                { title: 'Version control', desc: 'Every file keeps its full history. You always know which version is current, who uploaded it and when.' },
                { title: 'Smart search', desc: 'Find any document in seconds. Filter by name, project, type, date or owner.' },
                { title: 'Access control', desc: 'Define who can view, edit or download each document. Access by role, project or file type.' },
                { title: 'Documents linked to tasks', desc: 'Attach plans and specs directly to site tasks. The team has the right document without searching for it.' },
                { title: 'Expiry alerts', desc: 'Certificates, insurance and permits with expiry dates automatically monitored. Zero missed renewals.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'The real cost of an outdated version.',
        },
        actors: {
            chip: 'Who it\'s for',
            items: [
                { chip: 'Director / Owner', desc: 'Total control: which documents exist, who has them and which are about to expire. No need to wait for someone to send the file.' },
                { chip: 'Architect / Site Manager', desc: 'Updated plans, contracts, and permits in one click. From the phone on site, without calling the office.' },
                { chip: 'Foreman / Operator', desc: 'Today\'s plan available from your phone. No calls to get the correct version.' },
            ],
        },
        whyArqui: {
            chip: 'Why Arqy Docs',
            description: 'Designed for construction firms that need real document order, not a shared folder with a different name.',
            items: [
                { title: 'Everything centralized.', desc: 'One repository for all projects. No disorganized Drive folders, no "send me the plan on WhatsApp".' },
                { title: 'Version control.', desc: 'Every change is tracked. You always know which version is current and who last modified it.' },
                { title: 'Instant search.', desc: 'By name, project, type or date. The right document in seconds, without opening 10 folders.' },
                { title: 'Controlled access.', desc: 'Each person sees only what they need. No sensitive documents exposed, no unnecessary access.' },
            ],
        },
        ecosystem: { title: 'The Ecosystem that Connects Everything', desc: 'Five interconnected modules covering the complete real estate lifecycle.' },
        about: {
            chip: 'The team',
            title: 'Who we are',
            desc: 'Meet the team behind the digital transformation of real estate',
            yearsLabel: 'years of experience',
            studyLabel: 'Background',
        },
        cta: {
            title: 'All your documents, organized from today.',
            description: 'Start with Arqy Docs and eliminate file searching forever.',
        },
    },
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
function DocumentHero({ lang }) {
    const t = PAGE_T[lang]?.hero || PAGE_T.es.hero;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

    return (
        <section ref={ref} className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center">
            <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
                <img
                    src="/images/Docs_Hero.webp"
                    alt="Arquitecto revisando documentos de obra"
                    className="w-full h-full object-cover object-center scale-110"
                />
            </motion.div>

            <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(15,20,45,0.78) 55%, rgba(15,20,45,0.25) 100%)' }} />

            <div className="relative z-20 w-full pt-[76px]">
                <div className="max-w-[1400px] mx-auto px-[16px] md:px-[28px]">
                <div className="max-w-[780px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 mb-6"
                    >
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: DOCS_BLUE }} />
                        <span className="text-white text-[13px] font-semibold tracking-wide">{t.chip}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.12 }}
                        className="text-white text-[28px] sm:text-[36px] md:text-[48px] lg:text-[62px] font-extrabold leading-[1.12] mb-5"
                    >
                        {t.title.split('\n').map((line, i) => i === 0 ? <React.Fragment key={i}>{line}<br /></React.Fragment> : line)}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.26 }}
                        className="text-white/80 text-[17px] leading-relaxed mb-8 max-w-[460px]"
                    >
                        {t.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap gap-3 mb-8"
                    >
                        <motion.a href="#" className="btn-primary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-contact-modal')); }}>
                            {t.cta1}
                        </motion.a>
                        <motion.a href="#soluciones" className="btn-secondary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={(e) => { e.preventDefault(); document.getElementById('soluciones')?.scrollIntoView({ behavior: 'smooth' }); }}>
                            {t.cta2}
                        </motion.a>
                    </motion.div>

                </div>
                </div>
            </div>
        </section>
    );
}

// ─── Module Strip ─────────────────────────────────────────────────────────────
const MODULES_STRIP = [
    { icon: TrendingUp,      label: 'Sales',        link: '/sales' },
    { icon: LayoutDashboard, label: 'Project Mgmt', link: '/project-management' },
    { icon: Package,         label: 'Procurement',  link: '/procurement' },
    { icon: Users,           label: 'Team',          link: '/team-management' },
    { icon: DollarSign,      label: 'Finance',       link: '/finance' },
    { icon: FolderOpen,      label: 'Documentos', labelEn: 'Documents', link: '/document-management' },
    { icon: BarChart3,       label: 'Analytics',    link: '/analytics' },
];
const ACTIVE_MODULE = 'Documentos';
const MotionLink = motion(Link);

function ModuleStrip({ lang }) {
    return (
        <section className="w-full py-5 overflow-hidden" style={{ background: PRIMARY }}>
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between flex-wrap gap-4"
                >
                    {MODULES_STRIP.map(({ icon: Icon, label, labelEn, link }, i) => {
                        const displayLabel = labelEn && lang === 'en' ? labelEn : label;
                        const isActive = label === ACTIVE_MODULE;
                        const cls = `flex items-center gap-2 transition-colors duration-200 group ${isActive ? 'text-white' : 'text-white/50 hover:text-white'}`;
                        const inner = (
                            <>
                                <Icon size={16} className="transition-transform duration-200 group-hover:scale-110" />
                                <span className="text-[13px] font-semibold whitespace-nowrap">{displayLabel}</span>
                            </>
                        );
                        return (
                            <React.Fragment key={label}>
                                {link ? (
                                    <MotionLink
                                        to={link}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.06 }}
                                        className={cls}
                                    >
                                        {inner}
                                    </MotionLink>
                                ) : (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.06 }}
                                        className={`${cls} cursor-default`}
                                    >
                                        {inner}
                                    </motion.span>
                                )}
                                {i < MODULES_STRIP.length - 1 && (
                                    <div className="hidden md:block w-px h-4 bg-white/20" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, prefix = '', suffix = '', duration = 1800 }) {
    const [count, setCount] = useState(0);
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!inView) return;
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [inView, target, duration]);

    return <span ref={ref} className="tabular-nums">{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ─── Metrics ──────────────────────────────────────────────────────────────────
const METRICS = [
    { value: 100, prefix: '', suffix: '%', label: 'Documentos trazables', sub: 'versión, autor y fecha de cada cambio' },
    { value: 0,   prefix: '', suffix: '',  label: 'Documentos perdidos en emails', sub: 'todo centralizado por proyecto' },
    { value: 3,   prefix: '', suffix: 'x', label: 'Más rápido para encontrar un archivo', sub: 'búsqueda instantánea vs carpetas' },
];

function MetricsSection({ lang }) {
    const t = PAGE_T[lang]?.metrics || PAGE_T.es.metrics;
    const metricsData = METRICS.map((m, i) => ({ ...m, ...(t.items[i] || {}) }));
    return (
        <section className="py-24" style={{ background: BG }}>
            <div className="max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full px-4 py-1.5 mb-5"
                >
                    <span className="text-[#20316d] text-[12px] font-bold tracking-widest uppercase">{t.chip}</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.08 }}
                    className="text-[36px] md:text-[48px] font-extrabold text-[#111827] mb-4"
                >
                    {t.title}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.16 }}
                    className="text-[#6B7280] text-[17px] mb-16 max-w-xl mx-auto"
                >
                    {t.description}
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-24">
                    {metricsData.map(({ value, prefix, suffix, label, sub }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: i * 0.12 }}
                            className="flex flex-col items-center text-center px-6 border-b md:border-b-0 md:border-r border-gray-100 last:border-0"
                        >
                            <div className="text-[72px] md:text-[88px] font-extrabold text-[#111827] leading-none mb-3 whitespace-nowrap">
                                <AnimatedCounter target={value} prefix={prefix} suffix={suffix} />
                            </div>
                            <p className="font-bold text-[13px] text-[#111827] mb-1">{label}</p>
                            <p className="text-[13px] text-[#6B7280]">{sub}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

// ─── Doc Illustrations ─────────────────────────────────────────────────────────
function DocSingle({ isActive }) {
    return (
        <div className="relative flex flex-col items-center justify-center h-[200px]">
            <motion.div
                animate={{ background: isActive ? '#20316d' : '#c7d2f0' }}
                transition={{ duration: 0.5 }}
                className="w-28 h-28 rounded-2xl flex items-center justify-center"
            >
                <FileText size={52} color="white" strokeWidth={1.5} />
            </motion.div>

            {/* Filename chip */}
            <motion.div
                animate={{ opacity: isActive ? 1 : 0.3 }}
                transition={{ duration: 0.4 }}
                className="mt-3 px-3 py-1 bg-[#20316d]/10 rounded-full text-[11px] font-bold text-[#20316d] flex items-center gap-1.5"
            >
                <FileText size={11} />
                Contract_v1.pdf
            </motion.div>

            {/* PDF badge */}
            <motion.div
                animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.5 }}
                transition={{ duration: 0.4, delay: isActive ? 0.2 : 0 }}
                className="absolute -top-1 -right-1 px-2 py-0.5 bg-[#EF4444] rounded-full text-white text-[9px] font-bold shadow-md"
            >
                PDF
            </motion.div>
        </div>
    );
}

function DocUpload({ isActive }) {
    const [versionIdx, setVersionIdx] = useState(0);
    const versions = ['v1', 'v2', 'v3'];

    useEffect(() => {
        if (!isActive) { setVersionIdx(0); return; }
        const id = setInterval(() => {
            setVersionIdx(prev => (prev + 1) % versions.length);
        }, 500);
        return () => clearInterval(id);
    }, [isActive]);

    return (
        <div className="relative flex flex-col items-center justify-center h-[200px]">
            <div className="flex items-center gap-3">
                {/* Document */}
                <motion.div
                    animate={{ background: isActive ? '#20316d' : '#c7d2f0' }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                >
                    <FileText size={36} color="white" strokeWidth={1.5} />
                </motion.div>

                {/* Arrow */}
                <motion.div
                    animate={{ opacity: isActive ? 1 : 0.2, x: isActive ? 0 : -6 }}
                    transition={{ duration: 0.5, delay: isActive ? 0.2 : 0 }}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-8 h-0.5 bg-[#20316d]" />
                    <ArrowRight size={14} className="text-[#20316d] -mt-2" />
                </motion.div>

                {/* Database */}
                <motion.div
                    animate={{ background: isActive ? '#6366F1' : '#c7d2f0' }}
                    transition={{ duration: 0.5, delay: isActive ? 0.3 : 0 }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                >
                    <Database size={36} color="white" strokeWidth={1.5} />
                </motion.div>
            </div>

            {/* Version cycling badge */}
            <motion.div
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? -8 : 0 }}
                transition={{ duration: 0.5, delay: isActive ? 0.2 : 0 }}
                className="absolute top-3 right-4 px-2.5 py-1 bg-white rounded-full text-[11px] font-bold shadow border border-[#E5E7EB]"
                style={{ color: DOCS_BLUE }}
            >
                {versions[versionIdx]}
            </motion.div>

            {/* "Organizado" label */}
            <motion.div
                animate={{ opacity: isActive ? 0.5 : 0 }}
                transition={{ duration: 0.4 }}
                className="mt-3 px-3 py-1 bg-[#6366F1]/10 rounded-full text-[11px] font-bold text-[#6366F1]"
            >
                Clasificado automáticamente
            </motion.div>
        </div>
    );
}

function DocLibrary({ isActive }) {
    const rows = [
        { count: 3, colors: ['#20316d', '#20316d', '#20316d'], delays: [0, 0.08, 0.16] },
        { count: 3, colors: ['#3a5899', '#3a5899', '#3a5899'], delays: [0.2, 0.28, 0.36] },
        { count: 3, colors: ['#aebfff', '#aebfff', '#aebfff'], delays: [0.4, 0.48, 0.56] },
    ];

    return (
        <div className="relative flex flex-col items-center justify-center gap-2 h-[200px]">
            {/* Floating search bar */}
            <motion.div
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                transition={{ duration: 0.5, delay: isActive ? 0.4 : 0 }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-lg border border-[#E5E7EB] whitespace-nowrap"
            >
                <Search size={11} className="text-[#6B7280]" />
                <span className="text-[11px] text-[#6B7280]">plano piso 3...</span>
            </motion.div>

            {rows.map((row, ri) => (
                <div key={ri} className="flex gap-2">
                    {row.colors.map((color, bi) => (
                        <motion.div
                            key={bi}
                            animate={{ background: isActive ? color : '#c7d2f0' }}
                            transition={{ duration: 0.4, delay: isActive ? row.delays[bi] : 0 }}
                            style={{ width: 48, height: 48 }}
                            className="rounded-xl flex items-center justify-center"
                        >
                            <FileText
                                size={20}
                                color={isActive && ri === 2 ? '#20316d' : 'white'}
                                strokeWidth={1.5}
                            />
                        </motion.div>
                    ))}
                </div>
            ))}
        </div>
    );
}

// ─── Document Steps Section ────────────────────────────────────────────────────
const STEPS = [
    {
        Illustration: DocSingle,
        num: '01',
        title: 'Cargá',
        desc: 'Subí cualquier tipo de archivo desde tu computadora o celular. Planos, contratos, fotos de obra. Todo en segundos.',
    },
    {
        Illustration: DocUpload,
        num: '02',
        title: 'Organizá',
        desc: 'El sistema lo clasifica por proyecto, categoría y tipo. Con versiones, fechas y responsable asignado automáticamente.',
    },
    {
        Illustration: DocLibrary,
        num: '03',
        title: 'Encontrá',
        desc: 'Búsqueda instantánea por nombre, proyecto, tipo o fecha. El documento correcto en segundos, sin buscar en carpetas.',
    },
];

function DocumentStepsSection({ lang }) {
    const tSteps = PAGE_T[lang]?.steps || PAGE_T.es.steps;
    const stepsData = STEPS.map((s, i) => ({ ...s, ...(tSteps.items[i] || {}) }));
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
    const [activeStep, setActiveStep] = useState(0);

    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        if (v < 0.4) setActiveStep(0);
        else if (v < 0.72) setActiveStep(1);
        else setActiveStep(2);
    });

    return (
        <div ref={containerRef} style={{ height: '300vh' }} className="hidden lg:block">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
                {/* Header */}
                <div className="text-center mb-10 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full px-4 py-1.5 mb-5"
                    >
                        <span className="text-[#20316d] text-[12px] font-bold tracking-widest uppercase">{tSteps.chip}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="text-[36px] md:text-[48px] font-extrabold text-[#111827] mb-3"
                    >
                        {tSteps.title.split('\n').map((line, i) => i === 0 ? <React.Fragment key={i}>{line}<br /></React.Fragment> : line)}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.16 }}
                        className="text-[#6B7280] text-[17px] max-w-lg mx-auto"
                    >
                        {tSteps.description}
                    </motion.p>

                    {/* Progress dots */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        {[0, 1, 2].map(i => (
                            <div
                                key={i}
                                className="h-1.5 rounded-full transition-all duration-500"
                                style={{
                                    width: i === activeStep ? 32 : 8,
                                    background: i === activeStep ? '#20316d' : '#D1D5DB',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Steps */}
                <div className="relative max-w-5xl w-full px-6">
                    {/* Connecting line */}
                    <div className="absolute top-[100px] left-[10%] right-[10%] h-px bg-[#E5E7EB] hidden lg:block" />

                    <div className="grid grid-cols-3 gap-8">
                        {stepsData.map(({ Illustration, num, title, desc }, i) => {
                            const isActive = activeStep === i;
                            return (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: isActive ? 1 : 0.3, scale: isActive ? 1 : 0.97 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <Illustration isActive={isActive} />
                                    <div
                                        className="mt-5 mb-1 text-[11px] font-bold tracking-widest uppercase transition-colors duration-500"
                                        style={{ color: isActive ? '#20316d' : '#9CA3AF' }}
                                    >
                                        {num}
                                    </div>
                                    <h3 className="text-[22px] font-extrabold text-[#111827] mb-2">{title}</h3>
                                    <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-[220px]">{desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mobile fallback
function DocumentStepsMobile({ lang }) {
    const tSteps = PAGE_T[lang]?.steps || PAGE_T.es.steps;
    const stepsData = STEPS.map((s, i) => ({ ...s, ...(tSteps.items[i] || {}) }));
    return (
        <section className="py-24 bg-white lg:hidden">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full px-4 py-1.5 mb-5">
                        <span className="text-[#20316d] text-[12px] font-bold tracking-widest uppercase">{tSteps.chip}</span>
                    </div>
                    <h2 className="text-[32px] font-extrabold text-[#111827] mb-3">
                        {tSteps.title.split('\n').map((line, i) => i === 0 ? <React.Fragment key={i}>{line}<br /></React.Fragment> : line)}
                    </h2>
                    <p className="text-[#6B7280] text-[16px] max-w-md mx-auto">
                        {tSteps.description}
                    </p>
                </div>

                <div className="flex flex-col gap-10">
                    {stepsData.map(({ Illustration, num, title, desc }, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <Illustration isActive={true} />
                            <div className="mt-4 mb-1 text-[11px] font-bold tracking-widest uppercase text-[#20316d]">{num}</div>
                            <h3 className="text-[20px] font-extrabold text-[#111827] mb-2">{title}</h3>
                            <p className="text-[15px] text-[#6B7280] leading-relaxed max-w-[280px]">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Solutions Section ────────────────────────────────────────────────────────
const SOLUTIONS = [
    {
        title: 'Repositorio por proyecto',
        desc: 'Todos los documentos de cada obra en un solo lugar. Planos, contratos, permisos y fotos organizados por proyecto y categoría.',
        img: '/images/Docs_repositorio.webp',
    },
    {
        title: 'Control de versiones',
        desc: 'Cada archivo mantiene su historial completo. Siempre sabés cuál es la versión vigente, quién la subió y cuándo.',
        img: '/images/Docs_versiones.webp',
    },
    {
        title: 'Búsqueda inteligente',
        desc: 'Encontrá cualquier documento en segundos. Filtrá por nombre, proyecto, tipo, fecha o responsable.',
        img: '/images/Docs_busqueda.webp',
    },
    {
        title: 'Control de accesos',
        desc: 'Definí quién puede ver, editar o descargar cada documento. Accesos por rol, por obra o por tipo de archivo.',
        img: '/images/Docs_accesos.webp',
    },
    {
        title: 'Documentos vinculados a tareas',
        desc: 'Adjuntá planos y specs directamente a las tareas de obra. El equipo tiene el documento correcto sin buscarlo.',
        img: '/images/Docs_tareas.webp',
    },
    {
        title: 'Alertas de vencimiento',
        desc: 'Certificados, seguros y permisos con fechas de vencimiento automáticamente monitoreados. Cero renovaciones perdidas.',
        img: '/images/Docs_alertas.webp',
    },
];

function SolutionsSection({ lang }) {
    const t = PAGE_T[lang]?.solutions || PAGE_T.es.solutions;
    const solutionsData = SOLUTIONS.map((s, i) => ({ ...s, ...(t.items[i] || {}) }));
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section id="soluciones" className="py-24" style={{ background: BG }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full px-4 py-1.5 mb-5"
                    >
                        <span className="text-[#20316d] text-[12px] font-bold tracking-widest uppercase">{t.chip}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="text-[36px] md:text-[48px] font-extrabold text-[#111827] mb-4"
                    >
                        {t.title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.16 }}
                        className="text-[#6B7280] text-[17px] max-w-xl mx-auto"
                    >
                        {t.description}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col lg:flex-row gap-10 items-start"
                >
                    {/* Left: Accordion */}
                    <div className="lg:w-[45%] flex flex-col">
                        {solutionsData.map(({ title, desc, img }, i) => (
                            <div
                                key={title}
                                className="border-b border-[#E5E7EB] cursor-pointer"
                                onClick={() => setActiveIndex(i)}
                            >
                                <div className={`flex items-center justify-between py-5 transition-colors duration-200 ${i === activeIndex ? 'text-[#111827]' : 'text-[#6B7280] hover:text-[#111827]'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[12px] font-bold text-[#9CA3AF] w-6 shrink-0">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className={`font-semibold text-[17px] transition-colors duration-200 ${i === activeIndex ? 'text-[#111827]' : ''}`}>
                                            {title}
                                        </span>
                                    </div>
                                    <motion.div animate={{ rotate: i === activeIndex ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                        <ChevronRight size={18} />
                                    </motion.div>
                                </div>

                                <AnimatePresence>
                                    {i === activeIndex && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-[15px] text-[#6B7280] leading-relaxed pb-5 pl-9">{desc}</p>
                                            <div className="lg:hidden pb-5 pl-9">
                                                <div className="w-full rounded-2xl overflow-hidden shadow-premium border border-[#E5E7EB]">
                                                    <img src={img} alt={title} className="w-full h-auto object-cover" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Right: Image (desktop only) */}
                    <div className="hidden lg:block lg:w-[55%] lg:sticky lg:top-28">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.35 }}
                                className="w-full rounded-2xl overflow-hidden shadow-premium border border-[#E5E7EB]"
                            >
                                <img
                                    src={solutionsData[activeIndex].img}
                                    alt={solutionsData[activeIndex].title}
                                    className="w-full h-auto object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ─── Typewriter (scroll-driven) ───────────────────────────────────────────────
function buildItems(segments) {
    const items = [];
    segments.forEach(({ text, highlight }) => {
        text.split('\n').forEach((part, li, arr) => {
            part.split('').forEach(char => items.push({ char, highlight }));
            if (li < arr.length - 1) items.push({ char: '\n', highlight: false });
        });
    });
    return items;
}

function ScrollTypewriter({ segments, charCountMV }) {
    const items = useMemo(() => buildItems(segments), [segments]);
    const [count, setCount] = useState(0);

    useMotionValueEvent(charCountMV, 'change', (v) => {
        setCount(Math.round(Math.max(0, Math.min(items.length, v))));
    });

    const done = count >= items.length;

    return (
        <>
            {items.slice(0, count).map((item, i) =>
                item.char === '\n'
                    ? <br key={i} />
                    : item.highlight
                        ? <span key={i} className="text-[#aebfff]">{item.char}</span>
                        : <React.Fragment key={i}>{item.char}</React.Fragment>
            )}
            {!done && count > 0 && (
                <span className="inline-block w-[2px] h-[0.85em] bg-white/80 align-middle ml-[1px]" />
            )}
        </>
    );
}

const PHRASE1_SEGMENTS_ES = [
    { text: 'En una obra, una versión\ndesactualizada de un plano\nno solo cuesta tiempo —\ncuesta ', highlight: false },
    { text: 'rehacerlo todo\ndesde cero', highlight: true },
    { text: '.', highlight: false },
];
const PHRASE2_SEGMENTS_ES = [
    { text: 'El director que sabe exactamente\ndónde está cada documento —\ny no ', highlight: false },
    { text: 'pierde media hora\nbuscando en emails\ny chats de WhatsApp', highlight: true },
    { text: ' —\ntoma mejores decisiones\nen menos tiempo.', highlight: false },
];
const PHRASE1_SEGMENTS_EN = [
    { text: 'On a project, an outdated\nversion of a blueprint\ndoesn\'t just cost time —\nit costs ', highlight: false },
    { text: 'redoing everything\nfrom scratch', highlight: true },
    { text: '.', highlight: false },
];
const PHRASE2_SEGMENTS_EN = [
    { text: 'The director who knows exactly\nwhere every document is —\nand doesn\'t ', highlight: false },
    { text: 'waste half an hour\nsearching through emails\nand WhatsApp chats', highlight: true },
    { text: ' —\nmakes better decisions\nin less time.', highlight: false },
];
const TOTAL1_ES = buildItems(PHRASE1_SEGMENTS_ES).length;
const TOTAL2_ES = buildItems(PHRASE2_SEGMENTS_ES).length;
const TOTAL1_EN = buildItems(PHRASE1_SEGMENTS_EN).length;
const TOTAL2_EN = buildItems(PHRASE2_SEGMENTS_EN).length;

// ─── Impact Quote ─────────────────────────────────────────────────────────────
function ImpactQuote({ lang }) {
    const t = PAGE_T[lang]?.impactQuote || PAGE_T.es.impactQuote;
    const PHRASE1_SEGMENTS = lang === 'en' ? PHRASE1_SEGMENTS_EN : PHRASE1_SEGMENTS_ES;
    const PHRASE2_SEGMENTS = lang === 'en' ? PHRASE2_SEGMENTS_EN : PHRASE2_SEGMENTS_ES;
    const TOTAL1 = lang === 'en' ? TOTAL1_EN : TOTAL1_ES;
    const TOTAL2 = lang === 'en' ? TOTAL2_EN : TOTAL2_ES;
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

    const clipPath = useTransform(scrollYProgress, [0, 0.65], ['inset(12% 0% round 28px)', 'inset(0% 0% round 0px)']);
    const phrase1Chars   = useTransform(scrollYProgress, [0.03, 0.32], [0, TOTAL1]);
    const phrase1Opacity = useTransform(scrollYProgress, [0.02, 0.12, 0.52, 0.62], [0, 1, 1, 0]);
    const phrase1Y       = useTransform(scrollYProgress, [0.52, 0.62], ['0px', '-30px']);
    const phrase2Chars   = useTransform(scrollYProgress, [0.65, 0.88], [0, TOTAL2]);
    const phrase2Opacity = useTransform(scrollYProgress, [0.62, 0.72], [0, 1]);
    const phrase2Y       = useTransform(scrollYProgress, [0.62, 0.72], ['30px', '0px']);

    return (
        <div ref={containerRef} style={{ height: '380vh' }}>
            <div className="sticky top-0 h-screen overflow-hidden">
                <motion.div
                    className="absolute inset-0 flex items-center justify-center overflow-hidden"
                    style={{ background: PRIMARY, clipPath }}
                >
                    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
                        style={{ background: VIOLET, filter: 'blur(100px)' }} />
                    <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
                        style={{ background: '#aebfff', filter: 'blur(100px)' }} />

                    <motion.div className="absolute max-w-4xl mx-auto px-6 text-center" style={{ opacity: phrase1Opacity, y: phrase1Y }}>
                        <div className="text-[80px] leading-none text-white/20 font-serif mb-2 select-none">"</div>
                        <h2 className="text-white text-[26px] md:text-[40px] font-bold leading-[1.25] mb-6">
                            <ScrollTypewriter segments={PHRASE1_SEGMENTS} charCountMV={phrase1Chars} />
                        </h2>
                        <p className="text-white/60 text-[16px]">{t.phrase1sub}</p>
                    </motion.div>

                    <motion.div className="absolute max-w-4xl mx-auto px-6 text-center" style={{ opacity: phrase2Opacity, y: phrase2Y }}>
                        <div className="text-[80px] leading-none text-white/20 font-serif mb-2 select-none">"</div>
                        <h2 className="text-white text-[26px] md:text-[40px] font-bold leading-[1.25] mb-8">
                            <ScrollTypewriter segments={PHRASE2_SEGMENTS} charCountMV={phrase2Chars} />
                        </h2>
                        <motion.a
                            href="#contacto"
                            className="inline-flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-colors duration-200"
                            style={{ color: PRIMARY }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            {lang === 'en' ? 'Get Started' : 'Empezar ahora'} <ArrowRight size={16} />
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

// ─── Actor Cards ──────────────────────────────────────────────────────────────
const ACTORS = [
    {
        chip: 'Director / Dueño',
        desc: 'Control total: qué documentos existen, quién los tiene y cuáles están por vencer. Sin depender de que alguien te mande el archivo.',
        img: '/images/Actor_Director.webp',
    },
    {
        chip: 'Arquitecto / Jefe de Obra',
        desc: 'Planos actualizados, contratos y permisos en un clic. Desde el celular en obra, sin llamar a la oficina.',
        img: '/images/Actor_Arquitecta.webp',
    },
    {
        chip: 'Capataz / Operario',
        desc: 'El plano del día, disponible desde el celular. Sin llamadas para conseguir la versión correcta.',
        img: '/images/Actor_Capataz.webp',
    },
];

function ActorCards({ lang }) {
    const t = PAGE_T[lang]?.actors || PAGE_T.es.actors;
    const actorsData = ACTORS.map((a, i) => ({ ...a, ...(t.items[i] || {}) }));
    return (
        <section id="actores" className="py-24" style={{ background: BG }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full px-4 py-1.5 mb-5"
                    >
                        <span className="text-[#20316d] text-[12px] font-bold tracking-widest uppercase">{t.chip}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="text-[36px] md:text-[48px] font-extrabold text-[#111827]"
                    >
                        {lang === 'es' ? <>Construido para quienes<br />no pueden perder documentos.</> : <>Built for those who<br />cannot afford to lose documents.</>}
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {actorsData.map(({ chip, desc, img }, i) => (
                        <motion.div
                            key={chip}
                            initial={{ opacity: 0, y: 60, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{ y: -10, scale: 1.03 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                            className="flex flex-col items-center text-center cursor-pointer group"
                        >
                            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-5 bg-[#E5E7EB]">
                                <img src={img} alt={chip} className="w-full h-full object-cover object-top" />
                            </div>
                            <h3 className="font-bold text-[22px] text-[#111827] mb-2">{chip}</h3>
                            <p className="text-[15px] text-[#6B7280] leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Why Arqui Docs ───────────────────────────────────────────────────────────
const PILLARS = [
    {
        num: '01',
        icon: FolderOpen,
        title: 'Todo centralizado.',
        desc: 'Un solo repositorio para todas las obras. Sin carpetas de Drive desorganizadas, sin "mandame el plano por WhatsApp".',
    },
    {
        num: '02',
        icon: GitBranch,
        title: 'Control de versiones.',
        desc: 'Cada cambio tiene registro. Siempre sabés cuál es la versión vigente y quién la modificó por última vez.',
    },
    {
        num: '03',
        icon: Search,
        title: 'Búsqueda instantánea.',
        desc: 'Por nombre, proyecto, tipo o fecha. El documento correcto en segundos, sin abrir 10 carpetas.',
    },
    {
        num: '04',
        icon: Shield,
        title: 'Accesos controlados.',
        desc: 'Cada persona ve solo lo que necesita. Sin documentos sensibles expuestos, sin accesos innecesarios.',
    },
];

function WhyArquiDocs({ lang }) {
    const t = PAGE_T[lang]?.whyArqui || PAGE_T.es.whyArqui;
    const pillarsData = PILLARS.map((p, i) => ({ ...p, ...(t.items[i] || {}) }));
    return (
        <section className="px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 relative">
                    <div className="lg:w-1/2 order-2 lg:order-1 py-20 flex flex-col gap-8">
                        {pillarsData.map(({ num, icon: Icon, title, desc }) => (
                            <motion.div
                                key={num}
                                initial={{ y: 40, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                viewport={{ once: true, margin: '-50px' }}
                                className="bg-white p-8 rounded-[2rem] border border-[#E5E7EB] shadow-premium hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mb-5">
                                    <Icon size={24} style={{ color: PRIMARY }} strokeWidth={2} />
                                </div>
                                <h3 className="text-[24px] font-semibold text-[#111827] mb-3">{title}</h3>
                                <p className="text-[16px] text-[#6B7280] leading-[1.65]">{desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="lg:w-1/2 order-1 lg:order-2">
                        <div className="lg:sticky lg:top-28 pt-20 pb-20">
                            <div className="inline-flex items-center gap-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full px-4 py-1.5 mb-6">
                                <span className="text-[#20316d] text-[12px] font-bold tracking-widest uppercase">{t.chip}</span>
                            </div>
                            <h2 className="text-[32px] md:text-[48px] font-extrabold text-[#111827] leading-tight mb-6">
                                {lang === 'es' ? <>No es una carpeta en la nube.<br />Es gestión documental de obra real.</> : <>It's not a cloud folder.<br />It's real construction document management.</>}
                            </h2>
                            <p className="text-[18px] text-[#6B7280] leading-[1.7]">
                                {t.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Orbiting Ecosystem ───────────────────────────────────────────────────────
const BUILD_MODULES = [
    { id: 'build',      label: 'BUILD',      icon: Database,  orbitRadius: 110, size: 48, speed:  0.6, phaseShift: 0 },
    { id: 'state',      label: 'STATE',      icon: Globe,     orbitRadius: 110, size: 48, speed:  0.6, phaseShift: (2 * Math.PI) / 3 },
    { id: 'capital',    label: 'CAPITAL',    icon: Wallet,    orbitRadius: 110, size: 48, speed:  0.6, phaseShift: (4 * Math.PI) / 3 },
    { id: 'home',       label: 'HOME',       icon: Home,      orbitRadius: 190, size: 52, speed: -0.4, phaseShift: 0 },
    { id: 'management', label: 'MANAGEMENT', icon: Settings,  orbitRadius: 190, size: 52, speed: -0.4, phaseShift: Math.PI },
];

const OrbitNode = memo(({ config, angle }) => {
    const [hovered, setHovered] = useState(false);
    const { orbitRadius, size, label } = config;
    const Icon = config.icon;
    const x = Math.cos(angle) * orbitRadius;
    const y = Math.sin(angle) * orbitRadius;
    return (
        <div
            className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
            style={{ width: `${size}px`, height: `${size}px`, transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`, zIndex: hovered ? 20 : 10 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className={`relative w-full h-full p-3 bg-white rounded-2xl flex items-center justify-center border border-[#E5E7EB] transition-all duration-300 cursor-pointer ${hovered ? 'scale-125 shadow-2xl border-[#20316d]/30' : 'shadow-lg'}`}
                style={{ boxShadow: hovered ? '0 0 30px rgba(13,13,169,0.2), 0 0 60px rgba(13,13,169,0.1)' : undefined }}>
                <Icon className="w-6 h-6 text-[#20316d]" />
                {hovered && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#111827] rounded-lg text-[10px] font-bold text-white whitespace-nowrap pointer-events-none tracking-widest uppercase">
                        {label}
                    </div>
                )}
            </div>
        </div>
    );
});
OrbitNode.displayName = 'OrbitNode';

function EcosystemSection({ lang }) {
    const t = PAGE_T[lang]?.ecosystem || PAGE_T.es.ecosystem;
    const [time, setTime] = useState(0);
    const [paused, setPaused] = useState(false);
    useEffect(() => {
        if (paused) return;
        let frameId;
        let last = performance.now();
        const tick = (now) => { const dt = (now - last) / 1000; last = now; setTime(t => t + dt); frameId = requestAnimationFrame(tick); };
        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [paused]);

    return (
        <section className="py-32 px-6 bg-[#FBFBFE] border-t border-[#E5E7EB]">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-[32px] md:text-[48px] font-bold text-[#111827] mb-4">{t.title}</h2>
                <p className="text-[16px] text-[#6B7280] mb-16 max-w-xl mx-auto">{t.desc}</p>
                <div className="w-full flex items-center justify-center">
                    <div className="relative w-[380px] h-[380px] md:w-[450px] md:h-[450px] flex items-center justify-center"
                        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" style={{ width: '220px', height: '220px' }}>
                            <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(13,13,169,0.15)', boxShadow: 'inset 0 0 20px rgba(174,191,255,0.08)' }} />
                            <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, transparent 40%, rgba(174,191,255,0.06) 70%, rgba(13,13,169,0.03) 100%)' }} />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" style={{ width: '380px', height: '380px' }}>
                            <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(13,13,169,0.1)', boxShadow: 'inset 0 0 40px rgba(174,191,255,0.05)' }} />
                            <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, transparent 50%, rgba(174,191,255,0.05) 80%, rgba(13,13,169,0.03) 100%)', animationDelay: '1.5s' }} />
                        </div>
                        <div className="w-24 h-24 bg-white rounded-[1.5rem] flex items-center justify-center z-10 relative shadow-2xl border-2 border-[#E5E7EB]">
                            <img src="/images/Isotipo.png" alt="Arqy" className="w-16 h-16 object-contain" />
                        </div>
                        {BUILD_MODULES.map((config) => (
                            <OrbitNode key={config.id} config={config} angle={time * config.speed + config.phaseShift} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── About Us ─────────────────────────────────────────────────────────────────
const TEAM_ES = [
    { name: 'Juan Devera',   experience: '10', img: '/images/Juan_devera_ceo.webp',  role: 'Fundador', quote: '"Creamos Arqy porque el real estate necesitaba una infraestructura digital que conecte capital, construcción y comunidad en una única fuente de verdad."', study: 'Finanzas' },
    { name: 'Luciano Reca',  experience: '7',  img: '/images/Luciano_Reca.webp',     role: 'Fundador', quote: '"Nuestra misión es profesionalizar una industria que durante décadas operó con herramientas del siglo pasado. Arqy es el sistema operativo que lo cambia todo."', study: 'Finanzas' },
];
const TEAM_EN = [
    { name: 'Juan Devera',   experience: '10', img: '/images/Juan_devera_ceo.webp',  role: 'Founder', quote: '"We created Arqy because real estate needed a digital infrastructure that connects capital, construction and community into a single source of truth."', study: 'Finance' },
    { name: 'Luciano Reca',  experience: '7',  img: '/images/Luciano_Reca.webp',     role: 'Founder', quote: '"Our mission is to professionalize an industry that for decades operated with last century\'s tools. Arqy is the operating system that changes everything."', study: 'Finance' },
];


// ─── CTA Final ────────────────────────────────────────────────────────────────
function CTAFinal({ lang }) {
    const t = PAGE_T[lang]?.cta || PAGE_T.es.cta;
    return (
        <section id="contacto" className="py-28 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #0d0da9 100%)` }}>
            <motion.div
                className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
                style={{ background: VIOLET, filter: 'blur(100px)' }}
                animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
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
                    <h2 className="text-white text-[32px] md:text-[48px] font-extrabold leading-[1.12] mb-5">
                        {t.title}
                    </h2>
                    <p className="text-white/65 text-[17px] mb-10">
                        {t.description}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <motion.a
                            href="#"
                            onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-contact-modal')); }}
                            className="inline-flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-colors duration-200"
                            style={{ color: PRIMARY }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            {lang === 'es' ? 'Hablar con un Experto' : 'Talk to an Expert'} <ArrowRight size={16} />
                        </motion.a>
                        <motion.a
                            href="/pricing"
                            className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-colors duration-200"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            {lang === 'es' ? 'Ver Precios' : 'See Pricing'}
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DocumentManagementPage() {
    const { lang, setLang } = useLang();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-lebane/10 selection:text-lebane overflow-x-clip">
            <SharedNavbar lang={lang} setLang={setLang} />
            <DocumentHero lang={lang} />
            <ModuleStrip lang={lang} />
            <MetricsSection lang={lang} />
            <DocumentStepsSection lang={lang} />
            <DocumentStepsMobile lang={lang} />
            <SolutionsSection lang={lang} />
            <ImpactQuote lang={lang} />
            <ActorCards lang={lang} />
            <WhyArquiDocs lang={lang} />
            <EcosystemSection lang={lang} />
            <SharedAboutSection
                team={lang === 'en' ? TEAM_EN : TEAM_ES}
                labels={PAGE_T[lang]?.about || PAGE_T.es.about}
            />
            <CTAFinal lang={lang} />
            <SharedFooter lang={lang} />
        </div>
    );
}

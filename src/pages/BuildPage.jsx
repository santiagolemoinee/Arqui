import React, { useRef, useEffect, useState, useMemo, memo } from 'react';
import { useLang } from '../LangContext.jsx';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import {
    TrendingUp, LayoutDashboard, Package, Users, DollarSign,
    FolderOpen, BarChart3, ArrowRight, Link2, Eye, Zap,
    HardHat, ChevronRight, Building2, Wrench, CheckCircle2,
    Database, Globe, Wallet, Home, Settings,
} from 'lucide-react';
import SharedNavbar from '../components/SharedNavbar';
import SharedFooter from '../components/SharedFooter';
import SharedAboutSection from '../components/SharedAboutSection';
import { Link } from 'react-router-dom';

// ─── Design tokens ────────────────────────────────────────────────────────────
const PRIMARY = '#20316d';
const LEBANE  = '#20316d';
const VIOLET  = '#7B61FF';
const BG      = '#FBFBFE';
const SURFACE = '#F9FAFB';

// ─── Translations ─────────────────────────────────────────────────────────────
const PAGE_T = {
    es: {
        hero: {
            chip: 'Arqy Build',
            title: 'El sistema operativo\nde tu obra.',
            description: 'Sales, gestión de obra, compras, equipo, documentos y analytics — integrados en un solo sistema.',
            cta1: 'Hablar con un Experto',
            cta2: 'Conocé las Soluciones',
        },
        metrics: {
            chip: 'Impacto real',
            title: 'El sistema operativo que cambia los números.',
            description: 'Lo que pasa cuando una constructora deja de operar con Excel y WhatsApp.',
            items: [
                { label: 'Promedio recuperado por obra al año', sub: 'en márgenes antes invisibles' },
                { label: 'Ahorrados en coordinación por proyecto', sub: 'menos reuniones, menos errores' },
                { label: 'Más obras gestionadas', sub: 'con el mismo equipo, sin contratar más' },
            ],
        },
        modules: {
            chip: 'Plataforma',
            title: 'Una plataforma. Siete módulos integrados.',
            description: 'Cada módulo resuelve un dolor específico. Todos conectados en una sola plataforma.',
            viewModule: 'Ver módulo',
            items: [
                { name: 'Sales', desc: 'Pipeline de oportunidades, seguimiento de leads y conversión automática a proyecto. El equipo comercial deja de perder oportunidades.' },
                { name: 'Project Management', desc: 'Control de obras en tiempo real. Desvíos presupuestarios detectados antes de que sean un problema, con visibilidad por categoría.' },
                { name: 'Procurement', desc: 'Trazabilidad completa: compra → stock → asignación → gasto. El contratista pide materiales desde la app, el encargado aprueba en el sistema.' },
                { name: 'Team Management', desc: 'Contratistas, mano de obra, pagos con historial y documentos por persona. El personal reporta desde obra con fotos y videos, y se comunica directamente sin salir de la plataforma.' },
                { name: 'Finance', desc: 'Balance de ingresos vs egresos en tiempo real por obra y por empresa. Los pagos aparecen automáticamente, sin que nadie los cargue a mano.' },
                { name: 'Document Management', desc: 'Repositorio centralizado por proyecto. Versiones, tipos de documentos configurables, búsqueda y acceso inmediato.' },
                { name: 'Analytics', desc: 'Dashboard ejecutivo que se alimenta solo. El dueño ve el estado real del negocio sin esperar el reporte mensual de nadie.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'El margen que desaparece por falta de visibilidad.',
        },
        actors: {
            chip: 'Para quién',
            items: [
                { chip: 'Constructoras', title: 'Control total de cada obra.', desc: 'Desvíos detectados a tiempo. Materiales con trazabilidad. Contratistas coordinados. El dueño con visión real del negocio sin esperar el reporte mensual.' },
                { chip: 'Estudios de Arquitectura', title: 'Del diseño al cierre, sin fricción.', desc: 'Del primer lead hasta el proyecto cerrado financieramente. Presupuesto, documentos y equipo en un solo lugar. Sin Excel, sin duplicación.' },
                { chip: 'Contratistas Especializados', title: 'Tu trabajo, sin el caos.', desc: 'Pedí materiales desde la app en vez del WhatsApp. Reportá desde obra con fotos y videos. Recibí pagos con historial completo. Sin reuniones innecesarias.' },
            ],
        },
        whyArqui: {
            chip: 'Por qué Arqy Build',
            title: 'No es software genérico adaptado a construcción.',
            description: 'Construido entendiendo cómo funciona realmente una obra, un presupuesto, un contratista y un cliente.',
            items: [
                { title: 'Todo conectado.', desc: 'Una compra actualiza el stock y genera el gasto automáticamente. La data se carga una sola vez y alimenta todos los módulos sin que nadie lo toque.' },
                { title: 'Visibilidad en tiempo real.', desc: 'El desvío aparece antes de que sea un problema. El dueño ve el estado de cada obra sin esperar el reporte mensual armado a mano por alguien.' },
                { title: 'En operación en días.', desc: 'No es un enterprise de implementación larga. Software específico que se configura rápido y el equipo empieza a usar desde el primer día.' },
                { title: 'Hecho para construcción.', desc: 'No adaptado de otro sector. Construido entendiendo cómo funciona realmente una obra, un presupuesto, un contratista y un cliente.' },
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
            title: 'Tu constructora, en control total desde hoy.',
            description: 'Empezá con Arqy Build y transformá la forma en que operás.',
        },
    },
    en: {
        hero: {
            chip: 'Arqy Build',
            title: 'The operating system\nfor your project.',
            description: 'Sales, project management, procurement, team, documents, and analytics — integrated in one single system.',
            cta1: 'Talk to an Expert',
            cta2: 'Explore Solutions',
        },
        metrics: {
            chip: 'Real impact',
            title: 'The operating system that changes the numbers.',
            description: 'What happens when a construction firm stops operating with Excel and WhatsApp.',
            items: [
                { label: 'Average recovered per project per year', sub: 'in previously invisible margins' },
                { label: 'Saved in coordination per project', sub: 'fewer meetings, fewer errors', suffix: ' days' },
                { label: 'More projects managed', sub: 'with the same team, without hiring more' },
            ],
        },
        modules: {
            chip: 'Platform',
            title: 'One platform. Seven integrated modules.',
            description: 'Each module solves a specific pain. All connected in one platform.',
            viewModule: 'View module',
            items: [
                { name: 'Sales', desc: 'Opportunity pipeline, lead tracking and automatic conversion to project. The sales team stops losing opportunities.' },
                { name: 'Project Management', desc: 'Real-time project control. Budget variances detected before they become a problem, with visibility by category.' },
                { name: 'Procurement', desc: 'Full traceability: purchase → stock → assignment → expense. The contractor requests materials from the app, the manager approves in the system.' },
                { name: 'Team Management', desc: 'Contractors, labor, payments with history and documents per person. Staff report from site with photos and videos, and communicate directly without leaving the platform.' },
                { name: 'Finance', desc: 'Income vs expense balance in real time per project and company. Payments appear automatically, without anyone entering them manually.' },
                { name: 'Document Management', desc: 'Centralized repository by project. Versions, configurable document types, search and immediate access.' },
                { name: 'Analytics', desc: 'Executive dashboard that updates itself. The owner sees the real state of the business without waiting for anyone\'s monthly report.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'The margin that disappears from lack of visibility.',
        },
        actors: {
            chip: 'Who it\'s for',
            items: [
                { chip: 'Construction Firms', title: 'Total control of every project.', desc: 'Variances detected in time. Materials with traceability. Coordinated contractors. The owner with a real view of the business without waiting for the monthly report.' },
                { chip: 'Architecture Studios', title: 'From design to close, without friction.', desc: 'From the first lead to the financially closed project. Budget, documents and team in one place. No Excel, no duplication.' },
                { chip: 'Specialized Contractors', title: 'Your work, without the chaos.', desc: 'Request materials from the app instead of WhatsApp. Report from site with photos and videos. Receive payments with full history. No unnecessary meetings.' },
            ],
        },
        whyArqui: {
            chip: 'Why Arqy Build',
            title: 'Not generic software adapted to construction.',
            description: 'Built with a real understanding of how a project, a budget, a contractor and a client actually work.',
            items: [
                { title: 'Everything connected.', desc: 'A purchase updates the stock and generates the expense automatically. Data is entered once and feeds all modules without anyone touching it.' },
                { title: 'Real-time visibility.', desc: 'The variance appears before it becomes a problem. The owner sees the status of every project without waiting for a manually assembled monthly report.' },
                { title: 'Up and running in days.', desc: 'Not an enterprise with a long implementation. Specific software that is configured quickly and the team starts using from day one.' },
                { title: 'Built for construction.', desc: 'Not adapted from another sector. Built with a real understanding of how a project, a budget, a contractor and a client actually work.' },
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
            title: 'Your construction firm, in total control from today.',
            description: 'Start with Arqy Build and transform the way you operate.',
        },
    },
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
function BuildHero({ lang }) {
    const t = PAGE_T[lang]?.hero || PAGE_T.es.hero;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

    return (
        <section ref={ref} className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center">
            {/* Background image with parallax */}
            <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
                <img
                    src="/images/ArqyBuild_Hero.webp"
                    alt="Edificio en construcción"
                    className="w-full h-full object-cover object-center scale-110"
                />
            </motion.div>

            {/* Content */}
            <div className="relative z-20 w-full pt-[76px]">
                <div className="max-w-[1400px] mx-auto px-[16px] md:px-[28px]">
                <div className="max-w-[780px]">
                    {/* Chip */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 mb-6"
                    >
                        <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                        <span className="text-white text-[13px] font-semibold tracking-wide">{t.chip}</span>
                    </motion.div>

                    {/* H1 */}
                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.12 }}
                        className="text-white text-[28px] sm:text-[36px] md:text-[48px] lg:text-[62px] font-extrabold leading-[1.12] mb-5"
                    >
                        {t.title.split('\n').map((line, i) => i === 0 ? <React.Fragment key={i}>{line}<br /></React.Fragment> : line)}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.26 }}
                        className="text-white/80 text-[17px] leading-relaxed mb-8 max-w-[440px]"
                    >
                        {t.description}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-wrap gap-3 mb-8"
                    >
                        <motion.a
                            href="#"
                            className="btn-primary"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-contact-modal')); }}
                        >
                            {t.cta1}
                        </motion.a>
                        <motion.a
                            href="#modulos"
                            className="btn-secondary"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={(e) => { e.preventDefault(); document.getElementById('modulos')?.scrollIntoView({ behavior: 'smooth' }); }}
                        >
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
const ACTIVE_MODULE = null;
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

    return (
        <span ref={ref} className="tabular-nums">
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}

// ─── Metrics ──────────────────────────────────────────────────────────────────
const METRICS = [
    {
        value: 30,
        prefix: '+$',
        suffix: 'k',
        label: 'Promedio recuperado por obra al año',
        sub: 'en márgenes antes invisibles',
    },
    {
        value: 15,
        prefix: '',
        suffix: ' días',
        label: 'Ahorrados en coordinación por proyecto',
        sub: 'menos reuniones, menos errores',
    },
    {
        value: 3,
        prefix: '',
        suffix: 'x',
        label: 'Más obras gestionadas',
        sub: 'con el mismo equipo, sin contratar más',
    },
];

function MetricsSection({ lang }) {
    const t = PAGE_T[lang]?.metrics || PAGE_T.es.metrics;
    const metricsData = METRICS.map((m, i) => ({ ...m, ...(t.items[i] || {}) }));
    return (
        <section className="py-24" style={{ background: BG }}>
            <div className="max-w-5xl mx-auto px-6 text-center">
                {/* Tag */}
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

                {/* Stats */}
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
                            <p className="font-bold text-[13px] text-[#111827] mb-1 whitespace-nowrap">{label}</p>
                            <p className="text-[13px] text-[#6B7280]">{sub}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

// ─── Modules Grid ─────────────────────────────────────────────────────────────
const MODULE_CARDS = [
    {
        icon: TrendingUp,
        name: 'Sales',
        desc: 'Pipeline de oportunidades, seguimiento de leads y conversión automática a proyecto. El equipo comercial deja de perder oportunidades.',
        color: '#22C55E',
        bgColor: '#F0FDF4',
        span: 1,
        link: '/sales',
        heroImg: '/images/ArquiSales_Hero.webp',
    },
    {
        icon: LayoutDashboard,
        name: 'Project Management',
        desc: 'Control de obras en tiempo real. Desvíos presupuestarios detectados antes de que sean un problema, con visibilidad por categoría.',
        color: '#0051FF',
        bgColor: '#EEF3FF',
        span: 1,
        link: '/project-management',
        heroImg: '/images/PM_Hero.webp',
    },
    {
        icon: Package,
        name: 'Procurement',
        desc: 'Trazabilidad completa: compra → stock → asignación → gasto. El contratista pide materiales desde la app, el encargado aprueba en el sistema.',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
        span: 1,
        link: '/procurement',
        heroImg: '/images/Procurement_Hero.webp',
    },
    {
        icon: Users,
        name: 'Team Management',
        desc: 'Contratistas, mano de obra, pagos con historial y documentos por persona. El personal reporta desde obra con fotos y videos, y se comunica directamente sin salir de la plataforma.',
        color: VIOLET,
        bgColor: '#F5F3FF',
        span: 2,
        link: '/team-management',
        heroImg: '/images/Team_Hero.webp',
    },
    {
        icon: DollarSign,
        name: 'Finance',
        desc: 'Balance de ingresos vs egresos en tiempo real por obra y por empresa. Los pagos aparecen automáticamente, sin que nadie los cargue a mano.',
        color: '#EF4444',
        bgColor: '#FEF2F2',
        span: 1,
        link: '/finance',
        heroImg: '/images/Finance_Hero.webp',
    },
    {
        icon: FolderOpen,
        name: 'Document Management',
        desc: 'Repositorio centralizado por proyecto. Versiones, tipos de documentos configurables, búsqueda y acceso inmediato.',
        color: '#0051FF',
        bgColor: '#EEF3FF',
        span: 1,
        link: '/document-management',
        heroImg: '/images/Docs_Hero.webp',
    },
    {
        icon: BarChart3,
        name: 'Analytics',
        desc: 'Dashboard ejecutivo que se alimenta solo. El dueño ve el estado real del negocio sin esperar el reporte mensual de nadie.',
        color: PRIMARY,
        bgColor: '#EEF0F8',
        span: 2,
        link: '/analytics',
        heroImg: '/images/Analytics_Hero.webp',
    },
];

function ModulesSection({ lang }) {
    const tMod = PAGE_T[lang]?.modules || PAGE_T.es.modules;
    const modulesData = MODULE_CARDS.map((m, i) => ({ ...m, ...(tMod.items[i] || {}) }));
    return (
        <section id="modulos" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full px-4 py-1.5 mb-5"
                    >
                        <span className="text-[#20316d] text-[12px] font-bold tracking-widest uppercase">{tMod.chip}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="text-[36px] md:text-[48px] font-extrabold text-[#111827] mb-4"
                    >
                        {tMod.title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.16 }}
                        className="text-[#6B7280] text-[17px] max-w-xl mx-auto"
                    >
                        {tMod.description}
                    </motion.p>
                </div>

                {/* Bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {modulesData.map(({ icon: Icon, name, desc, color, bgColor, span, link, heroImg }, i) => (
                        <motion.div
                            key={name}
                            initial={{ opacity: 0, y: 60, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)' }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                            className={`bento-card flex flex-col gap-4 cursor-pointer ${span === 2 ? 'md:col-span-2' : ''}`}
                            style={{ transition: 'box-shadow 0.3s ease' }}
                        >

                            {/* Module hero image */}
                            <div
                                className="w-full rounded-xl overflow-hidden"
                                style={{ height: span === 2 ? '180px' : '150px' }}
                            >
                                <img src={heroImg} alt={name} className="w-full h-full object-cover" />
                            </div>

                            {/* Content */}
                            <div className="flex items-start gap-3">
                                <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: bgColor }}>
                                    <Icon size={18} style={{ color }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[18px] text-[#111827] mb-1">{name}</h3>
                                    <p className="text-[14px] text-[#6B7280] leading-relaxed">{desc}</p>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <a
                                    href={link ?? '#'}
                                    className="inline-flex items-center gap-1 text-[13px] font-semibold transition-colors duration-200"
                                    style={{ color: LEBANE }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    {tMod.viewModule} <ArrowRight size={14} />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
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
    { text: 'En una obra de £200k, un desvío del 15%\nson ', highlight: false },
    { text: '£30k de margen que desaparecen', highlight: true },
    { text: ' —\nno por mala ejecución, sino por falta\nde visibilidad en tiempo real.', highlight: false },
];
const PHRASE2_SEGMENTS_ES = [
    { text: 'El equipo que sabe qué pasa en obra\n', highlight: false },
    { text: 'sin llamar a nadie, sin esperar el reporte', highlight: true },
    { text: ' —\ntoma mejores decisiones\nantes de que el problema exista.', highlight: false },
];
const PHRASE1_SEGMENTS_EN = [
    { text: 'On a £200k project, a 15% deviation\nmeans ', highlight: false },
    { text: '£30k of margin that vanishes', highlight: true },
    { text: ' —\nnot from poor execution, but from lack\nof real-time visibility.', highlight: false },
];
const PHRASE2_SEGMENTS_EN = [
    { text: 'The team that knows what\'s happening on site\n', highlight: false },
    { text: 'without calling anyone, without waiting for the report', highlight: true },
    { text: ' —\nmakes better decisions\nbefore the problem exists.', highlight: false },
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
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Blue box expands from inset card → full screen
    const clipPath = useTransform(
        scrollYProgress,
        [0, 0.65],
        ['inset(12% 0% round 28px)', 'inset(0% 0% round 0px)']
    );

    // Phrase 1 chars: scroll 0.03–0.32 → 0–TOTAL1  (termina pronto)
    const phrase1Chars = useTransform(scrollYProgress, [0.03, 0.32], [0, TOTAL1]);

    // Phrase 1: fade in rápido, se queda visible hasta 0.52, recién ahí sale
    const phrase1Opacity = useTransform(scrollYProgress, [0.02, 0.12, 0.52, 0.62], [0, 1, 1, 0]);
    const phrase1Y       = useTransform(scrollYProgress, [0.52, 0.62], ['0px', '-30px']);

    // Phrase 2 chars: scroll 0.65–0.88 → 0–TOTAL2  (empieza bien después)
    const phrase2Chars = useTransform(scrollYProgress, [0.65, 0.88], [0, TOTAL2]);

    // Phrase 2 fade in
    const phrase2Opacity = useTransform(scrollYProgress, [0.62, 0.72], [0, 1]);
    const phrase2Y       = useTransform(scrollYProgress, [0.62, 0.72], ['30px', '0px']);

    return (
        <div ref={containerRef} style={{ height: '380vh' }}>
            <div className="sticky top-0 h-screen overflow-hidden">
                <motion.div
                    className="absolute inset-0 flex items-center justify-center overflow-hidden"
                    style={{ background: PRIMARY, clipPath }}
                >
                    {/* Decorative orbs */}
                    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
                        style={{ background: VIOLET, filter: 'blur(100px)' }} />
                    <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
                        style={{ background: '#aebfff', filter: 'blur(100px)' }} />

                    {/* Phrase 1 */}
                    <motion.div
                        className="absolute max-w-4xl mx-auto px-6 text-center"
                        style={{ opacity: phrase1Opacity, y: phrase1Y }}
                    >
                        <div className="text-[80px] leading-none text-white/20 font-serif mb-2 select-none">"</div>
                        <h2 className="text-white text-[26px] md:text-[40px] font-bold leading-[1.25] mb-6">
                            <ScrollTypewriter segments={PHRASE1_SEGMENTS} charCountMV={phrase1Chars} />
                        </h2>
                        <p className="text-white/60 text-[16px]">{t.phrase1sub}</p>
                    </motion.div>

                    {/* Phrase 2 */}
                    <motion.div
                        className="absolute max-w-4xl mx-auto px-6 text-center"
                        style={{ opacity: phrase2Opacity, y: phrase2Y }}
                    >
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
        chip: 'Constructoras',
        title: 'Control total de cada obra.',
        desc: 'Desvíos detectados a tiempo. Materiales con trazabilidad. Contratistas coordinados. El dueño con visión real del negocio sin esperar el reporte mensual.',
        img: '/images/Actor_Constructora.webp',
        icon: Building2,
    },
    {
        chip: 'Estudios de Arquitectura',
        title: 'Del diseño al cierre, sin fricción.',
        desc: 'Del primer lead hasta el proyecto cerrado financieramente. Presupuesto, documentos y equipo en un solo lugar. Sin Excel, sin duplicación.',
        img: '/images/Actor_Arquitecta.webp',
        icon: HardHat,
    },
    {
        chip: 'Contratistas Especializados',
        title: 'Tu trabajo, sin el caos.',
        desc: 'Pedí materiales desde la app en vez del WhatsApp. Reportá desde obra con fotos y videos. Recibí pagos con historial completo. Sin reuniones innecesarias.',
        img: '/images/Actor_Contratista.webp',
        icon: Wrench,
    },
];

function ActorCards({ lang }) {
    const t = PAGE_T[lang]?.actors || PAGE_T.es.actors;
    const actorsData = ACTORS.map((a, i) => ({ ...a, ...(t.items[i] || {}) }));
    return (
        <section id="actores" className="py-24" style={{ background: BG }}>
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
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
                        {lang === 'es' ? <>Construido para quienes<br />construyen en serio.</> : <>Built for those who<br />build seriously.</>}
                    </motion.h2>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {actorsData.map(({ chip, title, desc, img, icon: Icon }, i) => (
                        <motion.div
                            key={chip}
                            initial={{ opacity: 0, y: 60, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{ y: -10, scale: 1.03 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                            className="flex flex-col items-center text-center cursor-pointer group"
                        >
                            {/* Image */}
                            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-5 bg-[#E5E7EB]">
                                <img
                                    src={img}
                                    alt={chip}
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>

                            {/* Content */}
                            <h3 className="font-bold text-[22px] text-[#111827] mb-2">{chip}</h3>
                            <p className="text-[15px] text-[#6B7280] leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Why Arqui Build ──────────────────────────────────────────────────────────
const PILLARS = [
    {
        num: '01',
        icon: Link2,
        title: 'Todo conectado.',
        desc: 'Una compra actualiza el stock y genera el gasto automáticamente. La data se carga una sola vez y alimenta todos los módulos sin que nadie lo toque.',
    },
    {
        num: '02',
        icon: Eye,
        title: 'Visibilidad en tiempo real.',
        desc: 'El desvío aparece antes de que sea un problema. El dueño ve el estado de cada obra sin esperar el reporte mensual armado a mano por alguien.',
    },
    {
        num: '03',
        icon: Zap,
        title: 'En operación en días.',
        desc: 'No es un enterprise de implementación larga. Software específico que se configura rápido y el equipo empieza a usar desde el primer día.',
    },
    {
        num: '04',
        icon: HardHat,
        title: 'Hecho para construcción.',
        desc: 'No adaptado de otro sector. Construido entendiendo cómo funciona realmente una obra, un presupuesto, un contratista y un cliente.',
    },
];

function WhyArquiBuild({ lang }) {
    const t = PAGE_T[lang]?.whyArqui || PAGE_T.es.whyArqui;
    const pillarsData = PILLARS.map((p, i) => ({ ...p, ...(t.items[i] || {}) }));
    return (
        <section className="px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 relative">
                    {/* Left: Scrollable cards */}
                    <div className="lg:w-1/2 order-2 lg:order-1 py-20 flex flex-col gap-8">
                        {pillarsData.map(({ num, icon: Icon, title, desc }, i) => (
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

                    {/* Right: Sticky title + description */}
                    <div className="lg:w-1/2 order-1 lg:order-2">
                        <div className="lg:sticky lg:top-28 pt-20 pb-20">
                            <div className="inline-flex items-center gap-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full px-4 py-1.5 mb-6">
                                <span className="text-[#20316d] text-[12px] font-bold tracking-widest uppercase">{t.chip}</span>
                            </div>
                            <h2 className="text-[32px] md:text-[48px] font-extrabold text-[#111827] leading-tight mb-6">
                                {t.title}
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
            {/* Animated orbs */}
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
export default function BuildPage() {
    const { lang, setLang } = useLang();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-lebane/10 selection:text-lebane overflow-x-clip">
            <SharedNavbar lang={lang} setLang={setLang} />
            <BuildHero lang={lang} />
            <ModuleStrip lang={lang} />
            <MetricsSection lang={lang} />
            <ModulesSection lang={lang} />
            <ImpactQuote lang={lang} />
            <ActorCards lang={lang} />
            <WhyArquiBuild lang={lang} />
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

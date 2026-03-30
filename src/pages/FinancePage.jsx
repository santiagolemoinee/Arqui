import React, { useRef, useEffect, useState, useMemo, memo } from 'react';
import { useLang } from '../LangContext.jsx';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import {
    TrendingUp, LayoutDashboard, Package, Users, DollarSign,
    FolderOpen, BarChart3, ArrowRight, Link2, Zap,
    HardHat, ChevronRight, Building2, CheckCircle2,
    Database, Globe, Wallet, Home, Settings,
    Receipt, PiggyBank, FileSpreadsheet, ArrowLeftRight,
} from 'lucide-react';
import SharedNavbar from '../components/SharedNavbar';
import SharedFooter from '../components/SharedFooter';
import SharedAboutSection from '../components/SharedAboutSection';
import { Link } from 'react-router-dom';

// ─── Design tokens ────────────────────────────────────────────────────────────
const PRIMARY = '#20316d';
const VIOLET  = '#7B61FF';
const BG      = '#FBFBFE';

// ─── Translations ─────────────────────────────────────────────────────────────
const PAGE_T = {
    es: {
        hero: {
            chip: 'Módulo de Finanzas · Arqy Build',
            title: 'Cada peso de tu obra,\ntrazado y controlado.',
            description: 'Ingresos, egresos, flujo de caja y reportes financieros por proyecto y por empresa. Sin Excel, sin consolidar a mano, sin sorpresas al cierre de mes.',
            cta1: 'Solicitar Demo',
            cta2: 'Ver Soluciones',
        },
        metrics: {
            chip: 'Impacto real',
            title: 'Números que cambian cómo controlás tus finanzas.',
            description: 'Resultados medidos en obras reales que adoptaron Arqy Finance.',
            items: [
                { label: 'Reducción en desvíos de presupuesto', sub: 'con visibilidad financiera en tiempo real' },
                { label: 'Más rápido el cierre contable mensual', sub: 'datos consolidados automáticamente' },
                { label: 'Visibilidad del flujo de caja', sub: 'por proyecto y por empresa' },
            ],
        },
        showcase: {
            chip: 'Control financiero completo',
            title: 'Tres vistas. Una sola verdad financiera.',
            description: 'Desde el detalle de cada transacción hasta la visión ejecutiva de toda la empresa — todo conectado en tiempo real.',
            items: [
                { title: 'Ingresos y Egresos por Proyecto', desc: 'Registrá y asigná cada ingreso y egreso a su proyecto correspondiente. Trazabilidad completa desde la factura hasta el impacto en presupuesto.' },
                { title: 'Finanzas por Proyecto', desc: 'Visualizá el estado financiero de cada proyecto de un vistazo. Presupuesto consumido, saldo disponible y tendencia de gasto en tiempo real.' },
                { title: 'Dashboard Financiero de Empresa', desc: 'Métricas consolidadas de todos los proyectos: revenue, gastos, rentabilidad y cash flow. La foto completa para tomar decisiones estratégicas.' },
            ],
        },
        solutions: {
            chip: 'Funcionalidades',
            title: 'Todo lo que necesita tu gestión financiera.',
            description: 'Desde el registro de ingresos hasta la vista global del negocio. Sin cambiar de herramienta.',
            items: [
                { title: 'Registro de ingresos', desc: 'Alta manual de ingresos por obra y cliente con fecha, monto y motivo. Todo trazable, todo asignado a su proyecto.' },
                { title: 'Vista consolidada de egresos', desc: 'Todos los egresos en un solo lugar: materiales (desde Procurement), mano de obra y tercerizados (desde Team Management). Automático.' },
                { title: 'Overview por empresa', desc: 'Ingresos totales vs egresos totales de toda la empresa. Vista global del negocio en tiempo real.' },
                { title: 'Overview por obra', desc: 'Ingresos vs egresos específicos de cada proyecto. Rentabilidad por obra, siempre actualizada.' },
                { title: 'Balance en tiempo real', desc: 'El balance se recalcula automáticamente cada vez que entra un ingreso o se registra un gasto en cualquier módulo.' },
                { title: 'Filtros por obra y período', desc: 'Ver finanzas de una obra específica o de un rango de fechas determinado. Flexibilidad total para analizar tus datos.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'El margen de una obra se protege con datos, no con intuición.',
        },
        actors: {
            chip: 'Para cada rol',
            items: [
                { chip: 'Director / Dueño', desc: 'Dashboard financiero de toda la empresa en un clic. Sabé cuánto entra, cuánto sale y cuánto margen queda — sin esperar el cierre de mes.' },
                { chip: 'Contador / Administrador', desc: 'Datos financieros de todas las obras consolidados automáticamente. Sin Excel, sin reconciliaciones manuales, sin transcripción de datos.' },
                { chip: 'Project Manager', desc: 'Flujo de caja y presupuesto de tu obra bajo control. Sabé si vas en presupuesto y anticipá problemas antes de que frenen la obra.' },
            ],
        },
        whyArqui: {
            chip: 'Por qué Arqy Finance',
            title: 'Finanzas pensadas para la construcción.',
            description: 'No es un sistema contable genérico ni una planilla mejorada. Es control financiero construido para el ciclo real de una obra.',
            items: [
                { title: 'Trazabilidad completa.', desc: 'Desde la factura hasta el impacto en presupuesto. Cada peso tiene un origen, un destino y un proyecto asignado.' },
                { title: 'Visibilidad en tiempo real.', desc: 'No al cierre del mes. Cada transacción actualiza los dashboards al instante, sin pasos intermedios.' },
                { title: 'Conectado al presupuesto.', desc: 'Cada ingreso y egreso impacta el presupuesto de la obra automáticamente. Una sola fuente de verdad financiera.' },
                { title: 'Hecho para construcción.', desc: 'No adaptado de retail o servicios. Pensado para el ciclo financiero real de una constructora argentina.' },
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
            title: 'Tus finanzas bajo control. Desde hoy.',
            description: 'Empezá con Arqy Finance y eliminá las planillas financieras para siempre.',
        },
    },
    en: {
        hero: {
            chip: 'Finance Module · Arqy Build',
            title: 'Every peso in your project,\ntracked and controlled.',
            description: 'Income, expenses, cash flow, and financial reports by project and by company. No Excel, no manual consolidation, no month-end surprises.',
            cta1: 'Request Demo',
            cta2: 'View Solutions',
        },
        metrics: {
            chip: 'Real impact',
            title: 'Numbers that change how you manage finances.',
            description: 'Results measured in real projects that adopted Arqy Finance.',
            items: [
                { label: 'Reduction in budget deviations', sub: 'with real-time financial visibility' },
                { label: 'Faster monthly accounting close', sub: 'data consolidated automatically' },
                { label: 'Cash flow visibility', sub: 'by project and by company' },
            ],
        },
        showcase: {
            chip: 'Complete financial control',
            title: 'Three views. One financial truth.',
            description: 'From the detail of each transaction to the executive view of the entire company — all connected in real time.',
            items: [
                { title: 'Income & Expenses by Project', desc: 'Record and assign every income and expense to its corresponding project. Full traceability from invoice to budget impact.' },
                { title: 'Finances by Project', desc: 'Visualize the financial status of each project at a glance. Budget consumed, available balance, and spending trend in real time.' },
                { title: 'Company Financial Dashboard', desc: 'Consolidated metrics across all projects: revenue, expenses, profitability, and cash flow. The complete picture for strategic decisions.' },
            ],
        },
        solutions: {
            chip: 'Features',
            title: 'Everything your financial management needs.',
            description: 'From income tracking to a global business overview. Without switching tools.',
            items: [
                { title: 'Income tracking', desc: 'Manual entry of income by project and client with date, amount, and reason. Fully traceable, fully assigned to its project.' },
                { title: 'Consolidated expense view', desc: 'All expenses in one place: materials (from Procurement), labor and subcontractors (from Team Management). Automatic.' },
                { title: 'Company overview', desc: 'Total income vs total expenses across the entire company. A real-time global view of the business.' },
                { title: 'Project overview', desc: 'Income vs expenses for each specific project. Profitability per project, always up to date.' },
                { title: 'Real-time balance', desc: 'The balance recalculates automatically every time income is entered or an expense is recorded in any module.' },
                { title: 'Filters by project & period', desc: 'View finances for a specific project or a date range. Total flexibility to analyze your data.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'A project\'s margin is protected with data, not intuition.',
        },
        actors: {
            chip: 'For every role',
            items: [
                { chip: 'Director / Owner', desc: 'Company-wide financial dashboard in one click. Know how much comes in, how much goes out, and how much margin remains — without waiting for month-end.' },
                { chip: 'Accountant / Administrator', desc: 'Financial data from all projects consolidated automatically. No Excel, no manual reconciliation, no data transcription.' },
                { chip: 'Project Manager', desc: 'Cash flow and budget for your project under control. Know if you\'re on budget and anticipate problems before they halt the project.' },
            ],
        },
        whyArqui: {
            chip: 'Why Arqy Finance',
            title: 'Finance built for construction.',
            description: 'Not a generic accounting system or an improved spreadsheet. Financial control built for the real cycle of a construction project.',
            items: [
                { title: 'Full traceability.', desc: 'From invoice to budget impact. Every peso has an origin, a destination, and an assigned project.' },
                { title: 'Real-time visibility.', desc: 'Not at month end. Each transaction updates dashboards instantly, with no intermediate steps.' },
                { title: 'Connected to the budget.', desc: 'Every income and expense impacts the project budget automatically. One single source of financial truth.' },
                { title: 'Built for construction.', desc: 'Not adapted from retail or services. Designed for the real financial cycle of a construction company.' },
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
            title: 'Your finances under control. Starting today.',
            description: 'Start with Arqy Finance and eliminate financial spreadsheets forever.',
        },
    },
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
function FinanceHero({ lang }) {
    const t = PAGE_T[lang]?.hero || PAGE_T.es.hero;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

    return (
        <section ref={ref} className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center">
            <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
                <img
                    src="/images/Finance_Hero.jpeg"
                    alt="Director financiero revisando reportes de obra"
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
                        <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
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
const ACTIVE_MODULE = 'Finance';
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
                                {link && !isActive ? (
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
    { value: 35, prefix: '-', suffix: '%', label: 'Reducción en desvíos de presupuesto', sub: 'con visibilidad financiera en tiempo real' },
    { value: 3,  prefix: '', suffix: 'x',  label: 'Más rápido el cierre contable mensual', sub: 'datos consolidados automáticamente' },
    { value: 100, prefix: '', suffix: '%', label: 'Visibilidad del flujo de caja', sub: 'por proyecto y por empresa' },
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

// ─── Finance Showcase (3 columns) ─────────────────────────────────────────────
const SHOWCASE_IMAGES = [
    '/images/Finance_ingresos.jpeg',
    '/images/Finance_proyectos.jpeg',
    '/images/Finance_dashboard.jpeg',
];

function FinanceShowcase({ lang }) {
    const t = PAGE_T[lang]?.showcase || PAGE_T.es.showcase;
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
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
                        className="text-[#6B7280] text-[17px] max-w-2xl mx-auto"
                    >
                        {t.description}
                    </motion.p>
                </div>

                {/* 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {t.items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: i * 0.12 }}
                            className="flex flex-col"
                        >
                            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5E7EB] mb-5"
                                style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
                                <img
                                    src={SHOWCASE_IMAGES[i]}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-[20px] font-bold text-[#111827] mb-2">{item.title}</h3>
                            <p className="text-[15px] text-[#6B7280] leading-relaxed">{item.desc}</p>
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
        title: 'Registro de ingresos',
        desc: 'Alta manual de ingresos por obra y cliente con fecha, monto y motivo. Todo trazable, todo asignado a su proyecto.',
        img: '/images/Finance_ingresos_feat.jpeg',
    },
    {
        title: 'Vista consolidada de egresos',
        desc: 'Todos los egresos en un solo lugar: materiales (desde Procurement), mano de obra y tercerizados (desde Team Management). Automático.',
        img: '/images/Finance_egresos.jpeg',
    },
    {
        title: 'Overview por empresa',
        desc: 'Ingresos totales vs egresos totales de toda la empresa. Vista global del negocio en tiempo real.',
        img: '/images/Finance_empresa.jpeg',
    },
    {
        title: 'Overview por obra',
        desc: 'Ingresos vs egresos específicos de cada proyecto. Rentabilidad por obra, siempre actualizada.',
        img: '/images/Finance_obra.jpeg',
    },
    {
        title: 'Balance en tiempo real',
        desc: 'El balance se recalcula automáticamente cada vez que entra un ingreso o se registra un gasto en cualquier módulo.',
        img: '/images/Finance_balance.jpeg',
    },
    {
        title: 'Filtros por obra y período',
        desc: 'Ver finanzas de una obra específica o de un rango de fechas determinado. Flexibilidad total para analizar tus datos.',
        img: '/images/Finance_filtros.jpeg',
    },
];

function SolutionsSection({ lang }) {
    const t = PAGE_T[lang]?.solutions || PAGE_T.es.solutions;
    const solutionsData = SOLUTIONS.map((s, i) => ({ ...s, ...(t.items[i] || {}) }));
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section id="soluciones" className="py-24" style={{ background: BG }}>
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

                {/* Accordion + Image */}
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
                                    <span className={`font-semibold text-[17px] transition-colors duration-200 ${i === activeIndex ? 'text-[#111827]' : ''}`}>
                                        {title}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: i === activeIndex ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
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
                                            <p className="text-[15px] text-[#6B7280] leading-relaxed pb-5">
                                                {desc}
                                            </p>
                                            <div className="lg:hidden pb-5">
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
                                className="w-full rounded-2xl overflow-hidden border border-[#E5E7EB]"
                                style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}
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
    { text: 'En una obra, el margen\nse define por cada peso\nque ', highlight: false },
    { text: 'nadie registró\no nadie controló a tiempo', highlight: true },
    { text: '.', highlight: false },
];
const PHRASE2_SEGMENTS_ES = [
    { text: 'El director que ve\n', highlight: false },
    { text: 'el flujo de caja real\nde cada proyecto, cada día', highlight: true },
    { text: ' —\nprotege el margen\nsin depender de un reporte mensual.', highlight: false },
];
const PHRASE1_SEGMENTS_EN = [
    { text: 'On a project, the margin\nis defined by every peso\nthat ', highlight: false },
    { text: 'nobody recorded\nor nobody controlled on time', highlight: true },
    { text: '.', highlight: false },
];
const PHRASE2_SEGMENTS_EN = [
    { text: 'The director who sees\n', highlight: false },
    { text: 'the real cash flow\nof each project, every day', highlight: true },
    { text: ' —\nprotects the margin\nwithout relying on a monthly report.', highlight: false },
];
const TOTAL1_ES = buildItems(PHRASE1_SEGMENTS_ES).length;
const TOTAL2_ES = buildItems(PHRASE2_SEGMENTS_ES).length;
const TOTAL1_EN = buildItems(PHRASE1_SEGMENTS_EN).length;
const TOTAL2_EN = buildItems(PHRASE2_SEGMENTS_EN).length;

// ─── Impact Quote ─────────────────────────────────────────────────────────────
function ImpactQuote({ lang }) {
    const t = PAGE_T[lang]?.impactQuote || PAGE_T.es.impactQuote;
    const P1 = lang === 'en' ? PHRASE1_SEGMENTS_EN : PHRASE1_SEGMENTS_ES;
    const P2 = lang === 'en' ? PHRASE2_SEGMENTS_EN : PHRASE2_SEGMENTS_ES;
    const T1 = lang === 'en' ? TOTAL1_EN : TOTAL1_ES;
    const T2 = lang === 'en' ? TOTAL2_EN : TOTAL2_ES;
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

    const clipPath = useTransform(scrollYProgress, [0, 0.65], ['inset(12% 0% round 28px)', 'inset(0% 0% round 0px)']);
    const phrase1Chars   = useTransform(scrollYProgress, [0.03, 0.32], [0, T1]);
    const phrase1Opacity = useTransform(scrollYProgress, [0.02, 0.12, 0.52, 0.62], [0, 1, 1, 0]);
    const phrase1Y       = useTransform(scrollYProgress, [0.52, 0.62], ['0px', '-30px']);
    const phrase2Chars   = useTransform(scrollYProgress, [0.65, 0.88], [0, T2]);
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
                        <div className="text-[80px] leading-none text-white/20 font-serif mb-2 select-none">&ldquo;</div>
                        <h2 className="text-white text-[26px] md:text-[40px] font-bold leading-[1.25] mb-6">
                            <ScrollTypewriter segments={P1} charCountMV={phrase1Chars} />
                        </h2>
                        <p className="text-white/60 text-[16px]">{t.phrase1sub}</p>
                    </motion.div>

                    <motion.div className="absolute max-w-4xl mx-auto px-6 text-center" style={{ opacity: phrase2Opacity, y: phrase2Y }}>
                        <div className="text-[80px] leading-none text-white/20 font-serif mb-2 select-none">&ldquo;</div>
                        <h2 className="text-white text-[26px] md:text-[40px] font-bold leading-[1.25] mb-8">
                            <ScrollTypewriter segments={P2} charCountMV={phrase2Chars} />
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
        desc: 'Dashboard financiero de toda la empresa en un clic. Sabé cuánto entra, cuánto sale y cuánto margen queda — sin esperar el cierre de mes.',
        img: '/images/Actor_Director.jpeg',
    },
    {
        chip: 'Contador / Administrador',
        desc: 'Datos financieros de todas las obras consolidados automáticamente. Sin Excel, sin reconciliaciones manuales, sin transcripción de datos.',
        img: '/images/Actor_Contador.jpeg',
    },
    {
        chip: 'Project Manager',
        desc: 'Flujo de caja y presupuesto de tu obra bajo control. Sabé si vas en presupuesto y anticipá problemas antes de que frenen la obra.',
        img: '/images/Actor_ProjectManager.jpeg',
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
                        {lang === 'es' ? <>Construido para quienes<br />controlan las finanzas en serio.</> : <>Built for those who<br />control finances seriously.</>}
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

// ─── Why Arqui Finance ────────────────────────────────────────────────────────
const PILLARS = [
    {
        num: '01',
        icon: Receipt,
        title: 'Trazabilidad completa.',
        desc: 'Desde la factura hasta el impacto en presupuesto. Cada peso tiene un origen, un destino y un proyecto asignado.',
    },
    {
        num: '02',
        icon: Zap,
        title: 'Visibilidad en tiempo real.',
        desc: 'No al cierre del mes. Cada transacción actualiza los dashboards al instante, sin pasos intermedios.',
    },
    {
        num: '03',
        icon: Link2,
        title: 'Conectado al presupuesto.',
        desc: 'Cada ingreso y egreso impacta el presupuesto de la obra automáticamente. Una sola fuente de verdad financiera.',
    },
    {
        num: '04',
        icon: HardHat,
        title: 'Hecho para construcción.',
        desc: 'No adaptado de retail o servicios. Pensado para el ciclo financiero real de una constructora argentina.',
    },
];

function WhyArquiFinance({ lang }) {
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
                                className="bg-white p-8 rounded-[2rem] border border-[#E5E7EB] hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                                style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}
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
    { name: 'Juan Devera',  experience: '10', img: '/images/Juan_devera_ceo.jpeg', role: 'Fundador', quote: '"Creamos Arqy porque el real estate necesitaba una infraestructura digital que conecte capital, construcción y comunidad en una única fuente de verdad."', study: 'Finanzas' },
    { name: 'Luciano Reca', experience: '7',  img: '/images/Luciano_Reca.jpeg',    role: 'Fundador', quote: '"Nuestra misión es profesionalizar una industria que durante décadas operó con herramientas del siglo pasado. Arqy es el sistema operativo que lo cambia todo."', study: 'Finanzas' },
];
const TEAM_EN = [
    { name: 'Juan Devera',  experience: '10', img: '/images/Juan_devera_ceo.jpeg', role: 'Founder', quote: '"We created Arqy because real estate needed a digital infrastructure that connects capital, construction and community into a single source of truth."', study: 'Finance' },
    { name: 'Luciano Reca', experience: '7',  img: '/images/Luciano_Reca.jpeg',    role: 'Founder', quote: '"Our mission is to professionalize an industry that for decades operated with last century\'s tools. Arqy is the operating system that changes everything."', study: 'Finance' },
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
export default function FinancePage() {
    const { lang, setLang } = useLang();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-lebane/10 selection:text-lebane overflow-x-clip">
            <SharedNavbar lang={lang} setLang={setLang} />
            <FinanceHero lang={lang} />
            <ModuleStrip lang={lang} />
            <MetricsSection lang={lang} />
            <FinanceShowcase lang={lang} />
            <SolutionsSection lang={lang} />
            <ImpactQuote lang={lang} />
            <ActorCards lang={lang} />
            <WhyArquiFinance lang={lang} />
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

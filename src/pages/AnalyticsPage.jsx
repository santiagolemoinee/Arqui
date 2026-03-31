import React, { useRef, useEffect, useState, useMemo, memo } from 'react';
import { useLang } from '../LangContext.jsx';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import {
    TrendingUp, LayoutDashboard, Package, Users, DollarSign,
    FolderOpen, BarChart3, ArrowRight, Link2, Zap,
    HardHat, ChevronRight, Building2, CheckCircle2,
    Database, Globe, Wallet, Home, Settings,
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
            chip: 'Módulo de Analytics · Arqy Build',
            cta1: 'Solicitar Demo',
            title: 'Decisiones con datos.\nNo con intuición.',
            description: 'Dashboards en tiempo real, análisis de presupuesto vs real y reportes automáticos para cada obra. Sin Excel, sin consolidar planillas a mano.',
            cta2: 'Ver Soluciones',
        },
        valueProps: {
            chip: 'Por qué importa',
            description: 'Tres razones por las que las mejores constructoras usan analytics en tiempo real.',
            items: [
                { title: 'Visibilidad total en tiempo real.', desc: 'Sabé el estado de cada obra, equipo y presupuesto sin llamar a nadie. Datos actualizados al instante.' },
                { title: 'Detectá desvíos antes de que cuesten.', desc: 'Alertas automáticas cuando una partida supera el presupuesto. Actuás antes del problema, no después.' },
                { title: 'Reportes sin trabajo manual.', desc: 'Los dashboards se actualizan solos con cada dato ingresado. Sin planillas, sin consolidar, sin errores.' },
            ],
        },
        chart: {
            chip: 'Presupuesto vs Real',
            live: 'Actualizado en tiempo real',
            cardTitle: 'Análisis de Presupuesto vs Real',
            cardSub: 'Torre Norte · Semana 18',
            budgeted: 'Presupuestado',
        },
        animatedChart: {
            title: 'Cada peso de la obra,\ntrazado en tiempo real.',
            description: 'Compará lo que presupuestaste contra lo que gastaste. Por partida, por obra o por empresa. Sin esperar el cierre de mes.',
        },
        solutions: {
            chip: 'Funcionalidades',
            title: 'Todos los datos que necesitás\npara tomar decisiones.',
            description: 'Desde presupuesto hasta equipo — todo correlacionado en tiempo real.',
            items: [
                { title: 'Dashboard general', desc: 'Vista unificada de todas las obras: avance, presupuesto, equipo y compras. El dueño ve todo en 30 segundos sin reportes manuales.' },
                { title: 'Presupuesto vs real', desc: 'Comparativa por partida en tiempo real. Sabés exactamente dónde está el desvío, cuánto cuesta y qué lo generó.' },
                { title: 'Avance de obra', desc: 'Porcentaje de avance por tarea, etapa y obra. Correlacionado con el cronograma para ver si vas adelantado o atrasado.' },
                { title: 'Performance de equipo', desc: 'Métricas de productividad por persona y por obra. Quién cumple plazos, quién los supera y dónde hay cuellos de botella.' },
                { title: 'Análisis de compras', desc: 'Gasto por proveedor, categoría y obra. Detectá duplicaciones, comparaciones de precios y tendencias de compra.' },
                { title: 'Reportes exportables', desc: 'Generá reportes en PDF o Excel con un clic. Para clientes, inversores o auditorías. Con el logo y formato de tu empresa.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'El tiempo de reacción lo es todo en una obra.',
        },
        actors: {
            chip: 'Para quién',
            title: 'Para quienes necesitan saber, no suponer.',
            items: [
                { chip: 'Director / Dueño', desc: 'Dashboards de todas las obras en un clic. Desvíos, avances y costos sin esperar el reporte del lunes.' },
                { chip: 'Arquitecto / Project Manager', desc: 'Métricas de cada obra bajo tu control. Sabés si vas en tiempo, en presupuesto y con el equipo correcto.' },
                { chip: 'Contador / Administrador', desc: 'Datos financieros de todas las obras consolidados automáticamente. Sin Excel, sin reconciliaciones manuales.' },
            ],
        },
        whyArqui: {
            chip: 'Por qué Arqy Analytics',
            description: 'Construido para las métricas que importan en una obra: presupuesto, avance, equipo y compras — todo correlacionado.',
            items: [
                { title: 'Datos en tiempo real.', desc: 'No al cierre del mes. Cada dato ingresado actualiza los dashboards al instante, sin pasos intermedios.' },
                { title: 'Desvíos automáticos.', desc: 'El sistema detecta cuando una partida se sale del presupuesto y alerta antes de que sea un problema.' },
                { title: 'Todo conectado.', desc: 'Los datos de equipo, compras, tareas y presupuesto se cruzan automáticamente. Una sola fuente de verdad.' },
                { title: 'Hecho para construcción.', desc: 'No adaptado de finanzas o retail. Construido con las métricas reales de una obra: avance, desvío y productividad.' },
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
            title: 'Tomá decisiones con datos reales, desde hoy.',
            description: 'Empezá con Arqy Analytics y eliminá los reportes manuales para siempre.',
        },
    },
    en: {
        hero: {
            chip: 'Analytics Module · Arqy Build',
            cta1: 'Request Demo',
            title: 'Decisions with data.\nNot with intuition.',
            description: 'Real-time dashboards, budget vs actual analysis, and automatic reports for every project. No Excel, no manually consolidating spreadsheets.',
            cta2: 'View Solutions',
        },
        valueProps: {
            chip: 'Why it matters',
            description: 'Three reasons why the best construction firms use real-time analytics.',
            items: [
                { title: 'Total visibility in real time.', desc: 'Know the status of every project, team and budget without calling anyone. Data updated instantly.' },
                { title: 'Detect overruns before they cost you.', desc: 'Automatic alerts when a line item exceeds budget. Act before the problem, not after.' },
                { title: 'Reports without manual work.', desc: 'Dashboards update automatically with every data entry. No spreadsheets, no consolidation, no errors.' },
            ],
        },
        chart: {
            chip: 'Budget vs Actual',
            live: 'Updated in real time',
            cardTitle: 'Budget vs Actual Analysis',
            cardSub: 'North Tower · Week 18',
            budgeted: 'Budgeted',
        },
        animatedChart: {
            title: 'Every peso in the project,\ntracked in real time.',
            description: 'Compare what you budgeted against what you spent. By line item, by project, or by company. Without waiting for month-end.',
        },
        solutions: {
            chip: 'Features',
            title: 'All the data you need\nto make decisions.',
            description: 'From budget to team — all correlated in real time.',
            items: [
                { title: 'General dashboard', desc: 'Unified view of all projects: progress, budget, team and purchases. The owner sees everything in 30 seconds without manual reports.' },
                { title: 'Budget vs actual', desc: 'Line-item comparison in real time. You know exactly where the variance is, how much it costs and what caused it.' },
                { title: 'Project progress', desc: 'Progress percentage by task, stage and project. Correlated with the schedule to see if you\'re ahead or behind.' },
                { title: 'Team performance', desc: 'Productivity metrics by person and project. Who meets deadlines, who exceeds them and where bottlenecks are.' },
                { title: 'Purchase analysis', desc: 'Spending by supplier, category and project. Detect duplications, price comparisons and purchasing trends.' },
                { title: 'Exportable reports', desc: 'Generate PDF or Excel reports with one click. For clients, investors or audits. With your company logo and format.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'Reaction time is everything on a project.',
        },
        actors: {
            chip: 'Who it\'s for',
            title: 'For those who need to know, not guess.',
            items: [
                { chip: 'Director / Owner', desc: 'Dashboards for all projects in one click. Variances, progress and costs without waiting for Monday\'s report.' },
                { chip: 'Architect / Project Manager', desc: 'Metrics for each project under your control. Know if you\'re on time, on budget and with the right team.' },
                { chip: 'Accountant / Administrator', desc: 'Financial data for all projects consolidated automatically. No Excel, no manual reconciliations.' },
            ],
        },
        whyArqui: {
            chip: 'Why Arqy Analytics',
            description: 'Built for the metrics that matter on a project: budget, progress, team and purchases — all correlated.',
            items: [
                { title: 'Real-time data.', desc: 'Not at month end. Each data entry updates the dashboards instantly, with no intermediate steps.' },
                { title: 'Automatic variances.', desc: 'The system detects when a line item goes over budget and alerts you before it becomes a problem.' },
                { title: 'Everything connected.', desc: 'Team, purchase, task and budget data are crossed automatically. One single source of truth.' },
                { title: 'Built for construction.', desc: 'Not adapted from finance or retail. Built with the real metrics of a project: progress, variance and productivity.' },
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
            title: 'Make decisions with real data, starting today.',
            description: 'Start with Arqy Analytics and eliminate manual reports forever.',
        },
    },
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
function AnalyticsHero({ lang }) {
    const t = PAGE_T[lang]?.hero || PAGE_T.es.hero;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

    return (
        <section ref={ref} className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center">
            {/* Background image with parallax */}
            <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
                <img
                    src="/images/Analytics_Hero.webp"
                    alt="Director revisando analytics de obra"
                    className="w-full h-full object-cover object-center scale-110"
                />
            </motion.div>

            {/* Overlay */}
            <div
                className="absolute inset-0 z-10"
                style={{ background: 'linear-gradient(to right, rgba(15,20,45,0.78) 55%, rgba(15,20,45,0.25) 100%)' }}
            />

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
                            className="text-white/80 text-[17px] leading-relaxed mb-8 max-w-[480px]"
                        >
                            {t.description}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-wrap gap-3"
                        >
                            <motion.a
                                href="#"
                                className="inline-flex items-center gap-2 bg-white font-bold px-7 py-3.5 rounded-full text-[15px] hover:bg-white/90 transition-colors duration-200"
                                style={{ color: PRIMARY }}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-contact-modal')); }}
                            >
                                {t.cta1} <ArrowRight size={16} />
                            </motion.a>
                            <motion.a
                                href="#soluciones"
                                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-full text-[15px] hover:bg-white/20 transition-colors duration-200"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={(e) => { e.preventDefault(); document.getElementById('soluciones')?.scrollIntoView({ behavior: 'smooth' }); }}
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
const ACTIVE_MODULE = 'Analytics';
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

// ─── Value Props Section ───────────────────────────────────────────────────────
const VALUE_PROPS = [
    {
        icon: BarChart3,
        color: '#20316d',
        bgColor: '#EEF0F8',
        title: 'Visibilidad total en tiempo real.',
        desc: 'Sabé el estado de cada obra, equipo y presupuesto sin llamar a nadie. Datos actualizados al instante.',
    },
    {
        icon: TrendingUp,
        color: '#22C55E',
        bgColor: '#F0FDF4',
        title: 'Detectá desvíos antes de que cuesten.',
        desc: 'Alertas automáticas cuando una partida supera el presupuesto. Actuás antes del problema, no después.',
    },
    {
        icon: Zap,
        color: '#F59E0B',
        bgColor: '#FFFBEB',
        title: 'Reportes sin trabajo manual.',
        desc: 'Los dashboards se actualizan solos con cada dato ingresado. Sin planillas, sin consolidar, sin errores.',
    },
];

function ValuePropsSection({ lang }) {
    const t = PAGE_T[lang]?.valueProps || PAGE_T.es.valueProps;
    const propsData = VALUE_PROPS.map((p, i) => ({ ...p, ...(t.items[i] || {}) }));
    return (
        <section className="py-24 bg-white">
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
                        {lang === 'es' ? <>Toda la información de tus obras,<br />visible en un solo lugar.</> : <>All your project information,<br />visible in one place.</>}
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

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {propsData.map(({ icon: Icon, color, bgColor, title, desc }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: i * 0.12 }}
                            className="bento-card flex flex-col gap-4"
                        >
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: bgColor }}>
                                <Icon size={28} style={{ color }} strokeWidth={1.8} />
                            </div>
                            <h3 className="font-bold text-[20px] text-[#111827]">{title}</h3>
                            <p className="text-[15px] text-[#6B7280] leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Animated Chart Section ────────────────────────────────────────────────────
const CHART_ROWS = [
    { label: 'Estructura',    labelEn: 'Structure',     budget: 100, actual: 87,  ok: true },
    { label: 'Instalaciones', labelEn: 'Installations', budget: 100, actual: 112, ok: false },
    { label: 'Terminaciones', labelEn: 'Finishes',      budget: 100, actual: 64,  ok: true },
    { label: 'Mano de Obra',  labelEn: 'Labor',         budget: 100, actual: 95,  ok: true },
    { label: 'Equipamiento',  labelEn: 'Equipment',     budget: 100, actual: 130, ok: false },
];

function AnimatedChartSection({ lang }) {
    const tChart = PAGE_T[lang]?.chart || PAGE_T.es.chart;
    const t = PAGE_T[lang]?.animatedChart || PAGE_T.es.animatedChart;
    return (
        <section className="py-24" style={{ background: BG }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Left: Header */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:w-[40%]"
                    >
                        <div className="inline-flex items-center gap-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full px-4 py-1.5 mb-5">
                            <span className="text-[#20316d] text-[12px] font-bold tracking-widest uppercase">{tChart.chip}</span>
                        </div>

                        <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#111827] leading-[1.12] mb-4">
                            {t.title.split('\n').map((line, i) => i === 0 ? <React.Fragment key={i}>{line}<br /></React.Fragment> : line)}
                        </h2>

                        <p className="text-[17px] text-[#6B7280] leading-relaxed mb-6">
                            {t.description}
                        </p>

                        {/* Live badge */}
                        <div className="inline-flex items-center gap-2 bg-[#F0FDF4] border border-[#22C55E]/30 rounded-full px-4 py-2">
                            <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                            <span className="text-[#16A34A] text-[13px] font-semibold">{tChart.live}</span>
                        </div>
                    </motion.div>

                    {/* Right: Bento chart card */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:w-[60%] bento-card p-6 w-full"
                    >
                        {/* Card header */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="font-bold text-[16px] text-[#111827]">{tChart.cardTitle}</h3>
                                <p className="text-[12px] text-[#6B7280] mt-0.5">{tChart.cardSub}</p>
                            </div>
                            <div className="flex items-center gap-4 text-[12px] text-[#6B7280]">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-2 rounded-full bg-[#aebfff]" />
                                    <span>{tChart.budgeted}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-2 rounded-full bg-[#22C55E]" />
                                    <span>Real</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart rows */}
                        <div className="flex flex-col gap-4">
                            {CHART_ROWS.map(({ label, labelEn, actual, ok }, i) => (
                                <div key={label}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[12px] text-[#6B7280] font-medium">{lang === 'en' ? labelEn : label}</span>
                                        <span
                                            className="text-[12px] font-bold"
                                            style={{ color: ok ? '#16A34A' : '#DC2626' }}
                                        >
                                            {actual}%
                                        </span>
                                    </div>
                                    {/* Budget bar (reference — always 100%) */}
                                    <div className="h-2.5 rounded-full bg-[#aebfff]/40 w-full mb-1" />
                                    {/* Actual bar (animated) */}
                                    <motion.div
                                        className="h-2.5 rounded-full"
                                        style={{ background: ok ? '#22C55E' : '#EF4444' }}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${Math.min(actual, 130)}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: i * 0.12, ease: 'easeOut' }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Footer summary */}
                        <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center gap-6">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                                <span className="text-[12px] text-[#6B7280]">3 partidas dentro del presupuesto</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                                <span className="text-[12px] text-[#6B7280]">2 con desvíos</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

// ─── Solutions Section ─────────────────────────────────────────────────────────
const SOLUTIONS = [
    {
        title: 'Dashboard general',
        desc: 'Vista unificada de todas las obras: avance, presupuesto, equipo y compras. El dueño ve todo en 30 segundos sin reportes manuales.',
        img: '/images/Analytics_dashboard.webp',
    },
    {
        title: 'Presupuesto vs real',
        desc: 'Comparativa por partida en tiempo real. Sabés exactamente dónde está el desvío, cuánto cuesta y qué lo generó.',
        img: '/images/Analytics_presupuesto.webp',
    },
    {
        title: 'Avance de obra',
        desc: 'Porcentaje de avance por tarea, etapa y obra. Correlacionado con el cronograma para ver si vas adelantado o atrasado.',
        img: '/images/Analytics_avance.webp',
    },
    {
        title: 'Performance de equipo',
        desc: 'Métricas de productividad por persona y por obra. Quién cumple plazos, quién los supera y dónde hay cuellos de botella.',
        img: '/images/Analytics_equipo.webp',
    },
    {
        title: 'Análisis de compras',
        desc: 'Gasto por proveedor, categoría y obra. Detectá duplicaciones, comparaciones de precios y tendencias de compra.',
        img: '/images/Analytics_compras.webp',
    },
    {
        title: 'Reportes exportables',
        desc: 'Generá reportes en PDF o Excel con un clic. Para clientes, inversores o auditorías. Con el logo y formato de tu empresa.',
        img: '/images/Analytics_reportes.webp',
    },
];

function SolutionsSection({ lang }) {
    const t = PAGE_T[lang]?.solutions || PAGE_T.es.solutions;
    const solutionsData = SOLUTIONS.map((s, i) => ({ ...s, ...(t.items[i] || {}) }));
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section id="soluciones" className="py-24 bg-white">
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
                        {t.title.split('\n').map((line, i) => i === 0 ? <React.Fragment key={i}>{line}<br /></React.Fragment> : line)}
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
    { text: 'El director que espera\nel reporte del lunes\npara saber cómo va la obra —\nya ', highlight: false },
    { text: 'perdió la semana\nde anticiparse', highlight: true },
    { text: '.', highlight: false },
];
const PHRASE2_SEGMENTS_ES = [
    { text: 'Los datos de tu obra\nya existen —\nlo que falta es ', highlight: false },
    { text: 'verlos en tiempo real\ny sin que nadie\nlos consolide a mano', highlight: true },
    { text: '.', highlight: false },
];
const PHRASE1_SEGMENTS_EN = [
    { text: 'The director who waits\nfor Monday\'s report\nto know how the project is going —\nhas already ', highlight: false },
    { text: 'lost the week\nto get ahead', highlight: true },
    { text: '.', highlight: false },
];
const PHRASE2_SEGMENTS_EN = [
    { text: 'Your project data\nalready exists —\nwhat\'s missing is ', highlight: false },
    { text: 'seeing it in real time\nwithout anyone\nconsolidating it manually', highlight: true },
    { text: '.', highlight: false },
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

    const clipPath = useTransform(
        scrollYProgress,
        [0, 0.65],
        ['inset(12% 0% round 28px)', 'inset(0% 0% round 0px)']
    );

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
        chip: 'Director / Dueño',
        desc: 'Dashboards de todas las obras en un clic. Desvíos, avances y costos sin esperar el reporte del lunes.',
        img: '/images/Actor_Director.webp',
        icon: Building2,
    },
    {
        chip: 'Arquitecto / Project Manager',
        desc: 'Métricas de cada obra bajo tu control. Sabés si vas en tiempo, en presupuesto y con el equipo correcto.',
        img: '/images/Actor_Arquitecta.webp',
        icon: HardHat,
    },
    {
        chip: 'Contador / Administrador',
        desc: 'Datos financieros de todas las obras consolidados automáticamente. Sin Excel, sin reconciliaciones manuales.',
        img: '/images/Actor_Contador.webp',
        icon: Building2,
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
                        {t.title}
                    </motion.h2>
                </div>

                {/* Cards */}
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
                                <img
                                    src={img}
                                    alt={chip}
                                    className="w-full h-full object-cover object-top"
                                />
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

// ─── Why Arqui Analytics ──────────────────────────────────────────────────────
const PILLARS = [
    {
        num: '01',
        icon: BarChart3,
        title: 'Datos en tiempo real.',
        desc: 'No al cierre del mes. Cada dato ingresado actualiza los dashboards al instante, sin pasos intermedios.',
    },
    {
        num: '02',
        icon: TrendingUp,
        title: 'Desvíos automáticos.',
        desc: 'El sistema detecta cuando una partida se sale del presupuesto y alerta antes de que sea un problema.',
    },
    {
        num: '03',
        icon: Link2,
        title: 'Todo conectado.',
        desc: 'Los datos de equipo, compras, tareas y presupuesto se cruzan automáticamente. Una sola fuente de verdad.',
    },
    {
        num: '04',
        icon: HardHat,
        title: 'Hecho para construcción.',
        desc: 'No adaptado de finanzas o retail. Construido con las métricas reales de una obra: avance, desvío y productividad.',
    },
];

function WhyArquiAnalytics({ lang }) {
    const t = PAGE_T[lang]?.whyArqui || PAGE_T.es.whyArqui;
    const pillarsData = PILLARS.map((p, i) => ({ ...p, ...(t.items[i] || {}) }));
    return (
        <section className="px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 relative">
                    {/* Left: Scrollable cards */}
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

                    {/* Right: Sticky title + description */}
                    <div className="lg:w-1/2 order-1 lg:order-2">
                        <div className="lg:sticky lg:top-28 pt-20 pb-20">
                            <div className="inline-flex items-center gap-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full px-4 py-1.5 mb-6">
                                <span className="text-[#20316d] text-[12px] font-bold tracking-widest uppercase">{t.chip}</span>
                            </div>
                            <h2 className="text-[32px] md:text-[48px] font-extrabold text-[#111827] leading-tight mb-6">
                                {lang === 'es' ? <>No es un dashboard genérico.<br />Son analytics de construcción real.</> : <>It's not a generic dashboard.<br />It's real construction analytics.</>}
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
    { name: 'Juan Devera',  experience: '10', img: '/images/Juan_devera_ceo.webp', role: 'Fundador', quote: '"Creamos Arqy porque el real estate necesitaba una infraestructura digital que conecte capital, construcción y comunidad en una única fuente de verdad."', study: 'Finanzas' },
    { name: 'Luciano Reca', experience: '7',  img: '/images/Luciano_Reca.webp',    role: 'Fundador', quote: '"Nuestra misión es profesionalizar una industria que durante décadas operó con herramientas del siglo pasado. Arqy es el sistema operativo que lo cambia todo."', study: 'Finanzas' },
];
const TEAM_EN = [
    { name: 'Juan Devera',  experience: '10', img: '/images/Juan_devera_ceo.webp', role: 'Founder', quote: '"We created Arqy because real estate needed a digital infrastructure that connects capital, construction and community into a single source of truth."', study: 'Finance' },
    { name: 'Luciano Reca', experience: '7',  img: '/images/Luciano_Reca.webp',    role: 'Founder', quote: '"Our mission is to professionalize an industry that for decades operated with last century\'s tools. Arqy is the operating system that changes everything."', study: 'Finance' },
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
export default function AnalyticsPage() {
    const { lang, setLang } = useLang();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-lebane/10 selection:text-lebane overflow-x-clip">
            <SharedNavbar lang={lang} setLang={setLang} />
            <AnalyticsHero lang={lang} />
            <ModuleStrip lang={lang} />
            <ValuePropsSection lang={lang} />
            <AnimatedChartSection lang={lang} />
            <SolutionsSection lang={lang} />
            <ImpactQuote lang={lang} />
            <ActorCards lang={lang} />
            <WhyArquiAnalytics lang={lang} />
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

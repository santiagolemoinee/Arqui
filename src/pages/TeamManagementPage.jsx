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
const VIOLET  = '#7B61FF';
const BG      = '#FBFBFE';
const TEAM_VIOLET = '#8B5CF6';

// ─── Translations ─────────────────────────────────────────────────────────────
const PAGE_T = {
    es: {
        hero: {
            chip: 'Módulo de Equipos · Arqy Build',
            title: 'Coordiná tu equipo\nsin Excel ni WhatsApp.',
            description: 'Asignación de tareas, partes diarios y control de asistencia en una sola app. El capataz registra, el jefe de obra supervisa, el director decide.',
            cta1: 'Solicitar Demo',
            cta2: 'Ver Soluciones',
        },
        metrics: {
            chip: 'Impacto real',
            title: 'Números que cambian cómo coordinás tu equipo.',
            description: 'Resultados medidos en obras reales que adoptaron Arqy Team Management.',
            items: [
                { label: 'Menos tiempo en coordinación diaria', sub: 'reuniones reemplazadas por datos' },
                { label: 'Tareas sin responsable asignado', sub: 'cada tarea tiene dueño y fecha' },
                { label: 'Más obras gestionadas por equipo', sub: 'con la misma cantidad de personas' },
            ],
        },
        solutions: {
            chip: 'Funcionalidades',
            title: 'Todo lo que necesita tu equipo de obra.',
            items: [
                { title: 'Asignación de tareas', desc: 'Asigná tareas a personas, fechas y obras desde cualquier dispositivo. Cada operario sabe exactamente qué tiene que hacer.' },
                { title: 'Cronograma de equipo', desc: 'Visualizá la carga de trabajo de cada persona por semana. Redistribuí tareas antes de que alguien quede sobrecargado.' },
                { title: 'Seguimiento de avance', desc: 'Actualizaciones de avance en tiempo real por tarea, persona y obra. Sin reuniones de seguimiento.' },
                { title: 'Comunicación centralizada', desc: 'Los mensajes, archivos y actualizaciones de cada tarea en un solo lugar. Sin perder nada en WhatsApp.' },
                { title: 'Roles y permisos', desc: 'Cada usuario ve y puede hacer lo que le corresponde. Sin accesos innecesarios, sin datos expuestos.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'La falta de coordinación es la principal causa de retrasos en obra.',
        },
        actors: {
            chip: 'Para cada rol',
            items: [
                { chip: 'Director de Obra', desc: 'Visibilidad total de quién trabaja en qué, en qué semana y con qué avance. Sin esperar el reporte del lunes.' },
                { chip: 'Arquitecto / Jefe', desc: 'Cronograma asignado, equipo coordinado y tareas con responsable claro. Liderá sin estar en la obra todo el día.' },
                { chip: 'Capataz / Operario', desc: 'Sabé exactamente qué tenés que hacer hoy. Reportá avance en segundos. Sin reuniones, sin confusión.' },
            ],
        },
        whyArqui: {
            chip: 'Por qué Arqy',
            description: 'No es una app de tareas genérica. Es coordinación de equipo pensada para el ritmo real de una obra argentina.',
            items: [
                { title: 'Equipo coordinado.', desc: 'Cada persona sabe qué hacer, cuándo y en qué obra. Sin ambigüedades, sin llamadas para confirmar.' },
                { title: 'Visibilidad en tiempo real.', desc: 'Avance por tarea, por persona y por obra. El dueño ve el estado real sin que nadie arme un reporte.' },
                { title: 'Conectado al cronograma.', desc: 'Las tareas del equipo se sincronizan con el cronograma de la obra. El desvío de una persona impacta el plan completo.' },
                { title: 'Hecho para construcción.', desc: 'No pensado para equipos de software o ventas. Construido para el capataz, el jefe de obra y el director.' },
            ],
        },
        timeline: {
            chip: 'Visibilidad de equipo',
            title: 'Todo el equipo. Todo el cronograma.\nEn una sola pantalla.',
            description: 'Sabé quién trabaja en qué, cuándo termina y si va en tiempo — sin llamar, sin preguntar, sin reportes.',
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
            title: 'Tu equipo merece coordinación real.',
            description: 'Dejá de perder tiempo con llamadas y WhatsApp. Empezá a gestionar tu equipo con datos.',
        },
    },
    en: {
        hero: {
            chip: 'Team Management Module · Arqy Build',
            title: 'Coordinate your team\nwithout Excel or WhatsApp.',
            description: 'Task assignment, daily logs, and attendance tracking in one app. The foreman logs, the site manager supervises, the director decides.',
            cta1: 'Request Demo',
            cta2: 'View Solutions',
        },
        metrics: {
            chip: 'Real impact',
            title: 'Numbers that change how you coordinate your team.',
            description: 'Results measured in real projects that adopted Arqy Team Management.',
            items: [
                { label: 'Less time on daily coordination', sub: 'meetings replaced by data' },
                { label: 'Tasks without an assigned owner', sub: 'every task has an owner and a date' },
                { label: 'More projects managed per team', sub: 'with the same number of people' },
            ],
        },
        solutions: {
            chip: 'Features',
            title: 'Everything your site team needs.',
            items: [
                { title: 'Task assignment', desc: 'Assign tasks to people, dates, and projects from any device. Every worker knows exactly what they need to do.' },
                { title: 'Team schedule', desc: 'Visualize each person\'s workload by week. Redistribute tasks before anyone gets overloaded.' },
                { title: 'Progress tracking', desc: 'Real-time progress updates per task, person, and project. No follow-up meetings.' },
                { title: 'Centralized communication', desc: 'Messages, files, and updates for each task in one place. Nothing lost in WhatsApp.' },
                { title: 'Roles and permissions', desc: 'Each user sees and can do what is relevant to them. No unnecessary access, no exposed data.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'Lack of coordination is the leading cause of delays on site.',
        },
        actors: {
            chip: 'For every role',
            items: [
                { chip: 'Project Director', desc: 'Full visibility of who works on what, in which week, and with what progress. Without waiting for Monday\'s report.' },
                { chip: 'Architect / Manager', desc: 'Assigned schedule, coordinated team, and tasks with a clear owner. Lead without being on site all day.' },
                { chip: 'Foreman / Worker', desc: 'Know exactly what you need to do today. Report progress in seconds. No meetings, no confusion.' },
            ],
        },
        whyArqui: {
            chip: 'Why Arqy',
            description: 'Not a generic task app. Team coordination designed for the real rhythm of a construction project.',
            items: [
                { title: 'Coordinated team.', desc: 'Everyone knows what to do, when, and on which project. No ambiguity, no calls to confirm.' },
                { title: 'Real-time visibility.', desc: 'Progress by task, person, and project. The owner sees the real status without anyone building a report.' },
                { title: 'Connected to the schedule.', desc: 'Team tasks sync with the project schedule. One person\'s deviation impacts the full plan.' },
                { title: 'Built for construction.', desc: 'Not designed for software or sales teams. Built for the foreman, site manager, and director.' },
            ],
        },
        timeline: {
            chip: 'Team Visibility',
            title: 'Everyone on the team. Every schedule.\nIn one screen.',
            description: 'Know who\'s working on what, when it finishes, and if it\'s on time — without calling, asking, or writing reports.',
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
            title: 'Your team deserves real coordination.',
            description: 'Stop losing time with calls and WhatsApp. Start managing your team with data.',
        },
    },
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
function TeamHero({ lang }) {
    const t = PAGE_T[lang]?.hero || PAGE_T.es.hero;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

    return (
        <section ref={ref} className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center">
            <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
                <img
                    src="/images/Team_Hero.jpeg"
                    alt="Líder de equipo coordinando en obra"
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
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: TEAM_VIOLET }} />
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
                        className="text-white/80 text-[17px] leading-relaxed mb-8 max-w-[440px]"
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
const ACTIVE_MODULE = 'Team';
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
    { value: 40, prefix: '', suffix: '%', label: 'Menos tiempo en coordinación diaria', sub: 'reuniones reemplazadas por datos' },
    { value: 0,  prefix: '', suffix: '',  label: 'Tareas sin responsable asignado', sub: 'cada tarea tiene dueño y fecha' },
    { value: 2,  prefix: '', suffix: 'x', label: 'Más obras gestionadas por equipo', sub: 'con la misma cantidad de personas' },
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

// ─── Gantt Chart ──────────────────────────────────────────────────────────────
const WEEKS = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7'];
const TODAY_COL = 4.5; // between Sem 4 and Sem 5

const GANTT_TASKS = [
    {
        name: 'Movimiento de Suelos',
        startCol: 0, endCol: 2,
        progress: 100,
        color: '#22C55E',
        done: true,
        avatars: ['MR'],
    },
    {
        name: 'Plateas de Fundación',
        startCol: 1.5, endCol: 4.5,
        progress: 60,
        color: '#20316d',
        done: false,
        avatars: ['LG', 'JD'],
    },
    {
        name: 'Estructura Nivel 1',
        startCol: 3, endCol: 6.5,
        progress: 45,
        color: '#6366F1',
        done: false,
        avatars: ['AR'],
    },
    {
        name: 'Instalaciones Sanitarias',
        startCol: 4, endCol: 6.5,
        progress: 30,
        color: '#6B7280',
        done: false,
        avatars: ['TS', 'PM'],
    },
];

const MILESTONE = { col: 4.5, label: 'Llenado de Losa' };

const TEAM_AVATARS = [
    { initials: 'MR', color: '#20316d' },
    { initials: 'LG', color: '#6366F1' },
    { initials: 'AR', color: '#22C55E' },
    { initials: 'JD', color: '#F59E0B' },
];

function GanttBar({ task, index, totalCols }) {
    const leftPct = (task.startCol / totalCols) * 100;
    const widthPct = ((task.endCol - task.startCol) / totalCols) * 100;

    return (
        <div className="relative h-10 mb-3">
            <div
                className="absolute top-0 h-10"
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            >
                <motion.div
                    className="w-full h-full rounded-full relative overflow-hidden flex items-center px-3 gap-2"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
                    style={{ background: task.color, originX: 0 }}
                >
                    {/* Progress fill (lighter overlay) */}
                    <div
                        className="absolute inset-0 rounded-full opacity-30"
                        style={{
                            background: 'rgba(255,255,255,0.25)',
                            width: `${task.progress}%`,
                        }}
                    />
                    <span className="relative text-white text-[11px] font-semibold truncate flex-1 leading-none">
                        {task.name}
                    </span>
                    <span className="relative text-white text-[11px] font-bold shrink-0 leading-none">
                        {task.done ? '✓' : `${task.progress}%`}
                    </span>
                </motion.div>
            </div>
        </div>
    );
}

function TeamTimelineSection({ lang }) {
    const t = PAGE_T[lang]?.timeline || PAGE_T.es.timeline;
    const totalCols = WEEKS.length;
    const todayPct = (TODAY_COL / totalCols) * 100;
    const milestonePct = (MILESTONE.col / totalCols) * 100;

    return (
        <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row gap-12 items-start mb-14">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-5"
                            style={{ background: `${TEAM_VIOLET}15`, borderColor: `${TEAM_VIOLET}30` }}
                        >
                            <span className="text-[12px] font-bold tracking-widest uppercase" style={{ color: TEAM_VIOLET }}>
                                {t.chip}
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: 0.08 }}
                            className="text-[36px] md:text-[48px] font-extrabold text-[#111827] leading-tight mb-4"
                        >
                            {t.title.split('\n').map((line, i) => i === 0 ? <React.Fragment key={i}>{line}<br /></React.Fragment> : line)}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.16 }}
                            className="text-[#6B7280] text-[17px] leading-relaxed max-w-md"
                        >
                            {t.description}
                        </motion.p>
                    </div>
                </div>

                {/* Gantt Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bento-card p-6 md:p-8 relative overflow-hidden"
                >
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-[18px] text-[#111827]">Project timeline</h3>
                            <p className="text-[13px] text-[#6B7280] mt-0.5">Torre A · Semanas 1–7</p>
                        </div>
                        {/* Team avatars */}
                        <div className="flex items-center">
                            <div className="flex">
                                {TEAM_AVATARS.map((av, i) => (
                                    <div
                                        key={av.initials}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold border-2 border-white"
                                        style={{
                                            background: av.color,
                                            marginLeft: i === 0 ? 0 : -8,
                                            zIndex: TEAM_AVATARS.length - i,
                                            position: 'relative',
                                        }}
                                    >
                                        {av.initials}
                                    </div>
                                ))}
                            </div>
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold border-2 border-white bg-[#F3F4F6] text-[#6B7280]"
                                style={{ marginLeft: -8, position: 'relative', zIndex: 0 }}
                            >
                                +3
                            </div>
                        </div>
                    </div>

                    {/* Scrollable container for mobile */}
                    <div className="overflow-x-auto">
                        <div style={{ minWidth: 560 }}>
                            {/* Week headers */}
                            <div className="grid mb-3" style={{ gridTemplateColumns: `repeat(${WEEKS.length}, 1fr)` }}>
                                {WEEKS.map((w) => (
                                    <div key={w} className="text-[11px] font-semibold text-[#9CA3AF] text-center">{w}</div>
                                ))}
                            </div>

                            {/* Guide lines + task bars */}
                            <div className="relative">
                                {/* Vertical guide lines */}
                                <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: `repeat(${WEEKS.length}, 1fr)` }}>
                                    {WEEKS.map((w) => (
                                        <div key={w} className="border-r border-[#F3F4F6] h-full" />
                                    ))}
                                </div>

                                {/* Today marker */}
                                <motion.div
                                    className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none"
                                    style={{ left: `${todayPct}%`, transform: 'translateX(-50%)', zIndex: 10 }}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8, duration: 0.4 }}
                                >
                                    {/* Label above */}
                                    <span className="text-[10px] font-bold text-[#F59E0B] mb-1 whitespace-nowrap">Hoy</span>
                                    <motion.div
                                        className="w-[2px] bg-[#F59E0B]"
                                        initial={{ height: 0 }}
                                        whileInView={{ height: '100%' }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.85, duration: 0.5 }}
                                        style={{ flex: 1 }}
                                    />
                                </motion.div>

                                {/* Task bars */}
                                <div className="pt-5 pb-2">
                                    {GANTT_TASKS.map((task, i) => (
                                        <GanttBar key={task.name} task={task} index={i} totalCols={totalCols} />
                                    ))}
                                </div>

                                {/* Milestone row */}
                                <div className="relative h-8 mt-1">
                                    <motion.div
                                        className="absolute flex flex-col items-center"
                                        style={{ left: `${milestonePct}%`, transform: 'translateX(-50%)' }}
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 1.0, duration: 0.4, type: 'spring', stiffness: 260 }}
                                    >
                                        {/* Diamond */}
                                        <div
                                            className="w-3 h-3 rotate-45 mb-1"
                                            style={{ background: '#F59E0B' }}
                                        />
                                        <span className="text-[10px] font-semibold text-[#6B7280] whitespace-nowrap">
                                            {MILESTONE.label}
                                        </span>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ─── Solutions Section ────────────────────────────────────────────────────────
const SOLUTIONS = [
    {
        title: 'Asignación de tareas',
        desc: 'Cada tarea tiene un responsable, una fecha y un estado. El capataz sabe exactamente qué tiene que hacer hoy, sin llamadas ni reuniones.',
        img: '/images/Team_asignaciones.jpeg',
    },
    {
        title: 'Cronograma de equipo',
        desc: 'Visualizá la carga de trabajo de cada persona por semana. Redistribuí tareas antes de que alguien quede sobrecargado.',
        img: '/images/Team_cronograma.jpeg',
    },
    {
        title: 'Seguimiento de avance',
        desc: 'Cada miembro reporta avance desde la obra. Vos ves el progreso real sin esperar el parte del día.',
        img: '/images/Team_avance.jpeg',
    },
    {
        title: 'Comunicación centralizada',
        desc: 'Los mensajes, archivos y actualizaciones de cada tarea en un solo lugar. Sin perder nada en WhatsApp.',
        img: '/images/Team_comunicacion.jpeg',
    },
    {
        title: 'Roles y permisos',
        desc: 'Cada usuario ve y puede hacer lo que le corresponde. Sin accesos innecesarios, sin datos expuestos.',
        img: '/images/Team_permisos.jpeg',
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
                        Desde la asignación hasta el reporte de avance. Sin cambiar de herramienta.
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
    { text: 'El 80% de los retrasos en obra\nno es falta de gente —\nes que ', highlight: false },
    { text: 'nadie supo a tiempo\nqué tenía que hacer', highlight: true },
    { text: '.', highlight: false },
];
const PHRASE2_SEGMENTS_ES = [
    { text: 'El jefe de obra que coordina\ncon datos — y no\n', highlight: false },
    { text: 'con llamadas a las 7am\ny grupos de WhatsApp', highlight: true },
    { text: ' —\nentrega a tiempo\ny sin desgastar al equipo.', highlight: false },
];
const PHRASE1_SEGMENTS_EN = [
    { text: '80% of project delays\naren\'t from lack of people —\nit\'s that ', highlight: false },
    { text: 'nobody knew in time\nwhat they had to do', highlight: true },
    { text: '.', highlight: false },
];
const PHRASE2_SEGMENTS_EN = [
    { text: 'The site manager who coordinates\nwith data — and not\n', highlight: false },
    { text: 'with 7am phone calls\nand WhatsApp groups', highlight: true },
    { text: ' —\ndelivers on time\nwithout burning out the team.', highlight: false },
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
        chip: 'Director de Obra',
        desc: 'Visibilidad total de quién trabaja en qué, en qué semana y con qué avance. Sin esperar el reporte del lunes.',
        img: '/images/Actor_Director.jpeg',
    },
    {
        chip: 'Arquitecto / Jefe',
        desc: 'Cronograma asignado, equipo coordinado y tareas con responsable claro. Liderá sin estar en la obra todo el día.',
        img: '/images/Actor_Arquitecta.jpeg',
    },
    {
        chip: 'Capataz / Operario',
        desc: 'Sabé exactamente qué tenés que hacer hoy. Reportá avance en segundos. Sin reuniones, sin confusión.',
        img: '/images/Actor_Capataz.jpeg',
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
                        {lang === 'es' ? <>Construido para quienes<br />coordinan equipos en serio.</> : <>Built for those who<br />coordinate teams seriously.</>}
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

// ─── Why Arqui Team ───────────────────────────────────────────────────────────
const PILLARS = [
    {
        num: '01',
        icon: Users,
        title: 'Equipo coordinado.',
        desc: 'Cada persona sabe qué hacer, cuándo y en qué obra. Sin ambigüedades, sin llamadas para confirmar.',
    },
    {
        num: '02',
        icon: Eye,
        title: 'Visibilidad en tiempo real.',
        desc: 'Avance por tarea, por persona y por obra. El dueño ve el estado real sin que nadie arme un reporte.',
    },
    {
        num: '03',
        icon: Link2,
        title: 'Conectado al cronograma.',
        desc: 'Las tareas del equipo se sincronizan con el cronograma de la obra. El desvío de una persona impacta el plan completo.',
    },
    {
        num: '04',
        icon: HardHat,
        title: 'Hecho para construcción.',
        desc: 'No pensado para equipos de software o ventas. Construido para el capataz, el jefe de obra y el director.',
    },
];

function WhyArquiTeam({ lang }) {
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
                                {lang === 'es' ? <>No es un gestor de tareas genérico.<br />Es coordinación de obra real.</> : <>It's not a generic task manager.<br />It's real construction coordination.</>}
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
const TEAM_MEMBERS_ES = [
    { name: 'Juan Devera',   experience: '10', img: '/images/Juan_devera_ceo.jpeg',  role: 'Fundador', quote: '"Creamos Arqy porque el real estate necesitaba una infraestructura digital que conecte capital, construcción y comunidad en una única fuente de verdad."', study: 'Finanzas' },
    { name: 'Luciano Reca',  experience: '7',  img: '/images/Luciano_Reca.jpeg',     role: 'Fundador', quote: '"Nuestra misión es profesionalizar una industria que durante décadas operó con herramientas del siglo pasado. Arqy es el sistema operativo que lo cambia todo."', study: 'Finanzas' },
];
const TEAM_MEMBERS_EN = [
    { name: 'Juan Devera',   experience: '10', img: '/images/Juan_devera_ceo.jpeg',  role: 'Founder', quote: '"We created Arqy because real estate needed a digital infrastructure that connects capital, construction and community into a single source of truth."', study: 'Finance' },
    { name: 'Luciano Reca',  experience: '7',  img: '/images/Luciano_Reca.jpeg',     role: 'Founder', quote: '"Our mission is to professionalize an industry that for decades operated with last century\'s tools. Arqy is the operating system that changes everything."', study: 'Finance' },
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
export default function TeamManagementPage() {
    const { lang, setLang } = useLang();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-lebane/10 selection:text-lebane overflow-x-clip">
            <SharedNavbar lang={lang} setLang={setLang} />
            <TeamHero lang={lang} />
            <ModuleStrip lang={lang} />
            <MetricsSection lang={lang} />
            <TeamTimelineSection lang={lang} />
            <SolutionsSection lang={lang} />
            <ImpactQuote lang={lang} />
            <ActorCards lang={lang} />
            <WhyArquiTeam lang={lang} />
            <EcosystemSection lang={lang} />
            <SharedAboutSection
                team={lang === 'en' ? TEAM_MEMBERS_EN : TEAM_MEMBERS_ES}
                labels={PAGE_T[lang]?.about || PAGE_T.es.about}
            />
            <CTAFinal lang={lang} />
            <SharedFooter lang={lang} />
        </div>
    );
}

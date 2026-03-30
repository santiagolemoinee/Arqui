import React, { useRef, useEffect, useState, useMemo, memo } from 'react';
import { useLang } from '../LangContext.jsx';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import {
    LayoutDashboard, Package, Users, DollarSign,
    FolderOpen, BarChart3, ArrowRight, Link2, Eye, Zap,
    HardHat, ChevronRight, Building2, Wrench, CheckCircle2,
    Database, Globe, Wallet, Home, Settings, TrendingUp,
} from 'lucide-react';
import SharedNavbar from '../components/SharedNavbar';
import SharedFooter from '../components/SharedFooter';
import SharedAboutSection from '../components/SharedAboutSection';
import { Link } from 'react-router-dom';

// ─── Design tokens ────────────────────────────────────────────────────────────
const PRIMARY = '#20316d';
const VIOLET  = '#7B61FF';
const BG      = '#FBFBFE';
const SURFACE = '#F9FAFB';

// ─── Translations ─────────────────────────────────────────────────────────────
const PAGE_T = {
    es: {
        hero: {
            chip: 'Módulo de Gestión de Proyectos · Arqy Build',
            title: 'Gestioná cada obra\nsin perder el control.',
            description: 'Tareas, cronogramas, equipo y presupuesto en un solo lugar. Sabés qué pasa en cada obra en tiempo real, sin llamadas ni reuniones innecesarias.',
            cta1: 'Solicitar Demo',
            cta2: 'Ver Soluciones',
        },
        metrics: {
            chip: 'Resultados reales',
            title: 'El impacto que ves desde el primer mes.',
            description: 'Los equipos que adoptan Arqy PM entregan más obras, con menos desvíos y sin contratar más gente.',
            items: [
                { label: 'Promedio recuperado por obra al año', sub: 'en márgenes antes invisibles' },
                { label: 'Ahorrados en coordinación por proyecto', sub: 'menos reuniones, menos errores' },
                { label: 'Más obras gestionadas', sub: 'con el mismo equipo, sin contratar más' },
            ],
        },
        pyramid: {
            chip: 'Cómo funciona',
            title: 'De la planificación al cierre, sin perder el control.',
            description: 'La gestión de obra no es lineal. Arqy organiza la complejidad en capas que se complementan.',
            items: [
                { title: 'Entrega', desc: 'Proyectos cerrados con documentación completa y balance final.' },
                { title: 'Seguimiento', desc: 'Avance real vs planificado. Desvíos detectados antes de que escalen.' },
                { title: 'Planificación', desc: 'Cronogramas, tareas y responsables desde el día uno.' },
            ],
        },
        solutions: {
            chip: 'Funcionalidades',
            title: 'Todo lo que necesita tu equipo de obra.',
            description: 'Cada herramienta pensada para el ciclo real de una obra, desde el primer día hasta la entrega.',
            items: [
                { title: 'Cronograma de obra', desc: 'Visualizá el plan completo: tareas, hitos y dependencias. Identificá en segundos qué está demorado y qué impacta la fecha de entrega.' },
                { title: 'Control presupuestario', desc: 'Presupuesto vs real por categoría en tiempo real. El desvío aparece antes de que sea un problema, no cuando ya no hay nada que hacer.' },
                { title: 'Seguimiento de tareas', desc: 'Cada tarea tiene responsable, fecha y estado. El equipo actualiza desde obra. Vos ves el avance sin hacer una sola llamada.' },
                { title: 'Reportes automáticos', desc: 'El dashboard se alimenta solo. El dueño ve el estado real del negocio sin esperar que alguien arme el reporte del mes.' },
                { title: 'Gestión de subcontratistas', desc: 'Asignaciones, avance y pagos de cada subcontratista en un solo lugar. Sin Excel, sin WhatsApp, sin "te mando el parte mañana".' },
                { title: 'Documentos por proyecto', desc: 'Planos, especificaciones y actas con versiones controladas. El equipo encuentra lo que necesita en segundos, desde cualquier lugar.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'Los desvíos invisibles son los que destruyen el margen de una obra.',
        },
        actors: {
            chip: 'Para cada rol de obra',
            items: [
                { chip: 'Director de Obra', desc: 'Visibilidad total del avance sin pisar la obra. Desvíos detectados a tiempo. Presupuesto vs real actualizado. El dueño con datos reales del negocio.' },
                { chip: 'Jefe de Proyecto', desc: 'Del cronograma al cierre, en un solo lugar. Tareas asignadas, subcontratistas coordinados y documentos ordenados sin cambiar de herramienta.' },
                { chip: 'Contratista / Sub', desc: 'Reportá avance desde la obra con fotos. Recibí asignaciones claras. Sin reuniones innecesarias, sin reportes manuales a fin de mes.' },
            ],
        },
        whyArqui: {
            chip: 'Por qué Arqy PM',
            title: 'El sistema de obra que tu equipo va a usar de verdad.',
            description: 'No es un ERP genérico adaptado. Es un sistema diseñado para la forma en que se gestiona una obra en Argentina y Latinoamérica.',
            items: [
                { title: 'Todo conectado.', desc: 'Un gasto en procurement actualiza el presupuesto automáticamente. La data fluye entre módulos sin cargarse dos veces.' },
                { title: 'El desvío, antes del problema.', desc: 'Cuando el real supera el presupuesto, el sistema lo muestra. No al final del mes, cuando ya es tarde.' },
                { title: 'En operación en días.', desc: 'No es un ERP de implementación larga. En días el equipo está usando el sistema sin meses de configuración.' },
                { title: 'Hecho para construcción.', desc: 'No adaptado de otra industria. Construido entendiendo cómo funciona realmente una obra, un presupuesto y un contratista.' },
            ],
        },
        ecosystem: {
            chip: 'El ecosistema Arqy',
            title: 'El Ecosistema que lo Une Todo',
            desc: 'Cinco módulos interconectados que cubren el ciclo de vida completo del real estate.',
        },
        about: {
            chip: 'El equipo',
            title: 'Quiénes somos',
            desc: 'Conocé al equipo detrás de la transformación digital del real estate',
            yearsLabel: 'años de experiencia',
            studyLabel: 'Área de formación',
        },
        cta: {
            title: 'Cada obra bajo control. Desde hoy.',
            description: 'Empezá en minutos. Sin implementación larga, sin tarjeta de crédito. Tu equipo de obra activo en días.',
        },
    },
    en: {
        hero: {
            chip: 'Project Management Module · Arqy Build',
            title: 'Manage every project\nwithout losing control.',
            description: 'Tasks, schedules, team and budget in one place. Know what\'s happening on every project in real time, without unnecessary calls or meetings.',
            cta1: 'Request Demo',
            cta2: 'View Solutions',
        },
        metrics: {
            chip: 'Real results',
            title: 'The impact you see from the first month.',
            description: 'Teams that adopt Arqy PM deliver more projects, with fewer variances, without hiring more staff.',
            items: [
                { label: 'Average recovered per project per year', sub: 'in previously invisible margins' },
                { label: 'Saved in coordination per project', sub: 'fewer meetings, fewer errors', suffix: ' days' },
                { label: 'More projects managed', sub: 'with the same team, without hiring more' },
            ],
        },
        pyramid: {
            chip: 'How it works',
            title: 'From planning to close, without losing control.',
            description: 'Project management isn\'t linear. Arqy organizes complexity in complementary layers.',
            items: [
                { title: 'Delivery', desc: 'Projects closed with complete documentation and final balance.' },
                { title: 'Tracking', desc: 'Actual vs planned progress. Variances detected before they escalate.' },
                { title: 'Planning', desc: 'Schedules, tasks, and responsible parties from day one.' },
            ],
        },
        solutions: {
            chip: 'Features',
            title: 'Everything your site team needs.',
            description: 'Every tool designed for the real construction cycle, from the first day to handover.',
            items: [
                { title: 'Construction schedule', desc: 'View the complete plan: tasks, milestones, and dependencies. Identify in seconds what is delayed and what impacts the delivery date.' },
                { title: 'Budget control', desc: 'Budget vs actual by category in real time. Variances appear before they become a problem, not when there is nothing left to do.' },
                { title: 'Task tracking', desc: 'Every task has an owner, date, and status. The team updates from the site. You see progress without making a single call.' },
                { title: 'Automatic reports', desc: 'The dashboard feeds itself. The owner sees the real state of the business without waiting for anyone to build the monthly report.' },
                { title: 'Subcontractor management', desc: 'Assignments, progress, and payments for each subcontractor in one place. No Excel, no WhatsApp, no "I\'ll send the report tomorrow".' },
                { title: 'Documents per project', desc: 'Plans, specifications, and minutes with version control. The team finds what they need in seconds, from anywhere.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'Invisible variances are what destroy a project\'s margin.',
        },
        actors: {
            chip: 'For every construction role',
            items: [
                { chip: 'Construction Director', desc: 'Full project progress visibility without visiting the site. Variances detected in time. Budget vs actual always updated. Real business data for the owner.' },
                { chip: 'Project Manager', desc: 'From schedule to close, in one place. Assigned tasks, coordinated subcontractors, and organized documents without switching tools.' },
                { chip: 'Contractor / Sub', desc: 'Report progress from the site with photos. Receive clear assignments. No unnecessary meetings, no manual reports at month-end.' },
            ],
        },
        whyArqui: {
            chip: 'Why Arqy PM',
            title: 'The construction management system your team will actually use.',
            description: 'Not a generic ERP adapted. A system designed for how construction projects are actually managed.',
            items: [
                { title: 'Everything connected.', desc: 'A procurement expense updates the budget automatically. Data flows between modules without being entered twice.' },
                { title: 'Variance before the problem.', desc: 'When actual exceeds budget, the system shows it. Not at month end, when it\'s already too late.' },
                { title: 'Up and running in days.', desc: 'Not a long enterprise ERP implementation. The team is using the system within days, not months of configuration.' },
                { title: 'Built for construction.', desc: 'Not adapted from another industry. Built understanding how a construction project, a budget, and a subcontractor really work.' },
            ],
        },
        ecosystem: {
            chip: 'The Arqy ecosystem',
            title: 'The Ecosystem that Connects Everything',
            desc: 'Five interconnected modules covering the complete real estate lifecycle.',
        },
        about: {
            chip: 'The team',
            title: 'Who we are',
            desc: 'Meet the team behind the digital transformation of real estate',
            yearsLabel: 'years of experience',
            studyLabel: 'Area of expertise',
        },
        cta: {
            title: 'Every project under control. Starting today.',
            description: 'Get started in minutes. No long implementation, no credit card. Your construction team active within days.',
        },
    },
};

// ─── EN/ES phrase segments for ImpactQuote ────────────────────────────────────
const PHRASE1_SEGMENTS_ES = [
    { text: 'En una obra de $500k, un desvío del 10%\nson ', highlight: false },
    { text: '$50k que salen de tu margen', highlight: true },
    { text: ' —\nno por mala ejecución, sino porque\nnadie vio el número a tiempo.', highlight: false },
];
const PHRASE2_SEGMENTS_ES = [
    { text: 'El jefe de obra que gestiona\n', highlight: false },
    { text: 'con datos reales y no con llamadas\ny WhatsApps', highlight: true },
    { text: ' —\nentrega a tiempo,\ndentro del presupuesto.', highlight: false },
];
const PHRASE1_SEGMENTS_EN = [
    { text: 'On a $500k project, a 10% variance\nis ', highlight: false },
    { text: '$50k coming out of your margin', highlight: true },
    { text: ' —\nnot from poor execution, but because\nnobody saw the number in time.', highlight: false },
];
const PHRASE2_SEGMENTS_EN = [
    { text: 'The site manager who runs projects\n', highlight: false },
    { text: 'with real data instead of calls\nand WhatsApps', highlight: true },
    { text: ' —\ndelivers on time,\nwithin budget.', highlight: false },
];

function buildItemsEarly(segments) {
    const items = [];
    segments.forEach(({ text, highlight }) => {
        text.split('\n').forEach((part, li, arr) => {
            part.split('').forEach(char => items.push({ char, highlight }));
            if (li < arr.length - 1) items.push({ char: '\n', highlight: false });
        });
    });
    return items;
}
const TOTAL1_ES = buildItemsEarly(PHRASE1_SEGMENTS_ES).length;
const TOTAL2_ES = buildItemsEarly(PHRASE2_SEGMENTS_ES).length;
const TOTAL1_EN = buildItemsEarly(PHRASE1_SEGMENTS_EN).length;
const TOTAL2_EN = buildItemsEarly(PHRASE2_SEGMENTS_EN).length;

// ─── Hero ─────────────────────────────────────────────────────────────────────
function PMHero({ lang }) {
    const t = PAGE_T[lang]?.hero || PAGE_T.es.hero;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

    return (
        <section ref={ref} className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center">
            <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
                <img
                    src="/images/PM_Hero.jpeg"
                    alt="Project manager revisando planos de obra"
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
                        <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
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
                            href="#soluciones"
                            className="btn-secondary"
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
const ACTIVE_MODULE = 'Project Mgmt';
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

// ─── Pyramid Section ──────────────────────────────────────────────────────────
const PYRAMID_STEPS = [
    {
        num: '03',
        width: '42%',
        bg: '#aebfff',
        textColor: '#20316d',
        title: 'Entrega',
        desc: 'Proyectos cerrados con documentación completa y balance final.',
    },
    {
        num: '02',
        width: '70%',
        bg: '#3a5899',
        textColor: '#ffffff',
        title: 'Seguimiento',
        desc: 'Avance real vs planificado. Desvíos detectados antes de que escalen.',
    },
    {
        num: '01',
        width: '100%',
        bg: '#20316d',
        textColor: '#ffffff',
        title: 'Planificación',
        desc: 'Cronogramas, tareas y responsables desde el día uno.',
    },
];

function PyramidSection({ lang }) {
    const t = PAGE_T[lang]?.pyramid || PAGE_T.es.pyramid;
    const pyramidData = PYRAMID_STEPS.map((s, i) => ({ ...s, ...(t.items[i] || {}) }));
    return (
        <section className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-6">
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

                {/* Pyramid steps — bottom (01) is rendered last visually via flex-col */}
                <div className="flex flex-col items-center gap-3">
                    {pyramidData.map((step, i) => (
                        <motion.div
                            key={step.num}
                            style={{ width: step.width, background: step.bg }}
                            className="flex items-center justify-between px-8 rounded-2xl cursor-default"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.015 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55, delay: i * 0.18 }}
                        >
                            <div className="flex items-center gap-4 py-6">
                                <span
                                    className="text-[36px] font-extrabold leading-none select-none"
                                    style={{ color: step.textColor, opacity: 0.3 }}
                                >
                                    {step.num}
                                </span>
                                <span
                                    className="text-[18px] font-bold"
                                    style={{ color: step.textColor }}
                                >
                                    {step.title}
                                </span>
                            </div>
                            <p
                                className="hidden md:block text-[14px] max-w-[320px] text-right"
                                style={{ color: step.textColor, opacity: 0.75 }}
                            >
                                {step.desc}
                            </p>
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
        title: 'Cronograma de obra',
        desc: 'Visualizá el plan completo: tareas, hitos y dependencias. Identificá en segundos qué está demorado y qué impacta la fecha de entrega.',
        img: '/images/PM_cronograma.jpeg',
    },
    {
        title: 'Control presupuestario',
        desc: 'Presupuesto vs real por categoría en tiempo real. El desvío aparece antes de que sea un problema, no cuando ya no hay nada que hacer.',
        img: '/images/PM_presupuesto.jpeg',
    },
    {
        title: 'Seguimiento de tareas',
        desc: 'Cada tarea tiene responsable, fecha y estado. El equipo actualiza desde obra. Vos ves el avance sin hacer una sola llamada.',
        img: '/images/PM_tareas.jpeg',
    },
    {
        title: 'Reportes automáticos',
        desc: 'El dashboard se alimenta solo. El dueño ve el estado real del negocio sin esperar que alguien arme el reporte del mes.',
        img: '/images/PM_reportes.jpeg',
    },
    {
        title: 'Gestión de subcontratistas',
        desc: 'Asignaciones, avance y pagos de cada subcontratista en un solo lugar. Sin Excel, sin WhatsApp, sin "te mando el parte mañana".',
        img: '/images/PM_subcontratistas.jpeg',
    },
    {
        title: 'Documentos por proyecto',
        desc: 'Planos, especificaciones y actas con versiones controladas. El equipo encuentra lo que necesita en segundos, desde cualquier lugar.',
        img: '/images/PM_documentos.jpeg',
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

                {/* Image LEFT (sticky) + Accordion RIGHT — inverted vs SalesPage */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col lg:flex-row gap-10 items-start"
                >
                    {/* Left: Image (desktop only) */}
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

                    {/* Right: Accordion */}
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
                                            <p className="text-[15px] text-[#6B7280] leading-relaxed pb-5 pl-9">
                                                {desc}
                                            </p>
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

const PHRASE1_SEGMENTS = [
    { text: 'En una obra de $500k, un desvío del 10%\nson ', highlight: false },
    { text: '$50k que salen de tu margen', highlight: true },
    { text: ' —\nno por mala ejecución, sino porque\nnadie vio el número a tiempo.', highlight: false },
];
const PHRASE2_SEGMENTS = [
    { text: 'El jefe de obra que gestiona\n', highlight: false },
    { text: 'con datos reales y no con llamadas\ny WhatsApps', highlight: true },
    { text: ' —\nentrega a tiempo,\ndentro del presupuesto.', highlight: false },
];
const TOTAL1 = buildItems(PHRASE1_SEGMENTS).length;
const TOTAL2 = buildItems(PHRASE2_SEGMENTS).length;

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
        chip: 'Director de Obra',
        desc: 'Visibilidad total del avance sin pisar la obra. Desvíos detectados a tiempo. Presupuesto vs real actualizado. El dueño con datos reales del negocio.',
        img: '/images/Actor_Director.jpeg',
        icon: Building2,
    },
    {
        chip: 'Jefe de Proyecto',
        desc: 'Del cronograma al cierre, en un solo lugar. Tareas asignadas, subcontratistas coordinados y documentos ordenados sin cambiar de herramienta.',
        img: '/images/Actor_ProjectManager.jpeg',
        icon: HardHat,
    },
    {
        chip: 'Contratista / Sub',
        desc: 'Reportá avance desde la obra con fotos. Recibí asignaciones claras. Sin reuniones innecesarias, sin reportes manuales a fin de mes.',
        img: '/images/Actor_Contratista.jpeg',
        icon: Wrench,
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
                        {lang === 'es' ? <>Construido para quienes<br />gestionan obra en serio.</> : <>Built for those who<br />manage construction seriously.</>}
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

// ─── Why Arqui PM ─────────────────────────────────────────────────────────────
const PILLARS = [
    {
        num: '01',
        icon: Link2,
        title: 'Todo conectado.',
        desc: 'Un gasto en procurement actualiza el presupuesto automáticamente. La data fluye entre módulos sin cargarse dos veces.',
    },
    {
        num: '02',
        icon: Eye,
        title: 'El desvío, antes del problema.',
        desc: 'Cuando el real supera el presupuesto, el sistema lo muestra. No al final del mes, cuando ya es tarde.',
    },
    {
        num: '03',
        icon: Zap,
        title: 'En operación en días.',
        desc: 'No es un ERP de implementación larga. En días el equipo está usando el sistema sin meses de configuración.',
    },
    {
        num: '04',
        icon: HardHat,
        title: 'Hecho para construcción.',
        desc: 'No adaptado de otra industria. Construido entendiendo cómo funciona realmente una obra, un presupuesto y un contratista.',
    },
];

function WhyArquiPM({ lang }) {
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

                    {/* Right: Sticky title */}
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
export default function ProjectManagementPage() {
    const { lang, setLang } = useLang();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-lebane/10 selection:text-lebane overflow-x-clip">
            <SharedNavbar lang={lang} setLang={setLang} />
            <PMHero lang={lang} />
            <ModuleStrip lang={lang} />
            <MetricsSection lang={lang} />
            <PyramidSection lang={lang} />
            <SolutionsSection lang={lang} />
            <ImpactQuote lang={lang} />
            <ActorCards lang={lang} />
            <WhyArquiPM lang={lang} />
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

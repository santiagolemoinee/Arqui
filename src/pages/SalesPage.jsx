import React, { useRef, useEffect, useState, useMemo, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import {
    TrendingUp, LayoutDashboard, Package, Users, DollarSign,
    FolderOpen, BarChart3, ArrowRight, Link2, Eye, Zap,
    HardHat, ChevronRight, Building2, Wrench, CheckCircle2,
    Database, Globe, Wallet, Home, Settings,
} from 'lucide-react';
import SharedNavbar from '../components/SharedNavbar';
import SharedFooter from '../components/SharedFooter';
import { useLang } from '../LangContext.jsx';
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
            chip: 'Módulo de Ventas · Arqy Build',
            title: 'Captá, seguí y cerrá.\nSin perder un lead.',
            description: 'Desde el primer contacto hasta la firma. Todo el ciclo comercial en un solo lugar, sin Excel, sin WhatsApp, sin oportunidades perdidas.',
            cta1: 'Solicitar Demo',
            cta2: 'Ver Soluciones',
        },
        metrics: {
            chip: 'Resultados reales',
            title: 'El impacto que ves desde el primer mes.',
            description: 'Los equipos que adoptan Arqy Sales cierran más, pierden menos y operan más rápido.',
            items: [
                { label: 'en tasa de conversión de leads', sub: 'con seguimiento sistemático' },
                { label: 'oportunidades perdidas por falta de seguimiento', sub: 'pipeline siempre actualizado' },
                { label: 'Más velocidad para presupuestar', sub: 'conversión automática a proyecto' },
            ],
        },
        valueProps: {
            chip: 'Por qué Arqy Sales',
            title: 'Centralizá todo tu ciclo comercial\nen un solo lugar.',
            description: 'Dejá atrás las planillas y los mensajes de WhatsApp. Tu pipeline, tus leads y tus presupuestos, en un solo sistema.',
            items: [
                { title: 'No pierdas más leads', desc: 'Cada contacto entra al pipeline, cada interacción queda registrada, cada seguimiento tiene su próximo paso.' },
                { title: 'Presupuestá y convertí en un clic', desc: 'Cuando el cliente acepta, el proyecto se abre automáticamente con toda la información ya cargada. Sin duplicar datos.' },
                { title: 'Visibilidad total del pipeline', desc: 'Sabé en todo momento cuánto vale tu cartera activa, qué etapa tiene cada oportunidad y qué necesita atención hoy.' },
            ],
        },
        solutions: {
            chip: 'Funcionalidades',
            title: 'Todo lo que necesita tu equipo comercial.',
            description: 'Cada herramienta pensada para el ciclo de ventas de una constructora o desarrolladora.',
            items: [
                { title: 'Pipeline visual', desc: 'Tablero kanban con etapas configurables. Arrastrá oportunidades entre etapas, filtrá por responsable, fecha o valor estimado.' },
                { title: 'Gestión de leads y contactos', desc: 'Todos tus contactos en un solo lugar con historial completo de cada interacción, sin perder ningún dato en emails o WhatsApp.' },
                { title: 'Historial de comunicaciones', desc: 'Cada llamada, reunión y email queda registrado por oportunidad. El equipo ve todo el contexto antes de contactar al cliente.' },
                { title: 'Documentos por oportunidad', desc: 'Planos, propuestas y contratos en un solo lugar. Sin versiones perdidas, sin carpetas de Drive desorganizadas.' },
                { title: 'Conversión automática a proyecto', desc: 'Cuando el cliente acepta, el proyecto se crea automáticamente con todos los datos ya cargados. Cero duplicación.' },
                { title: 'CRM integrado', desc: 'Clientes vinculados a sus oportunidades y proyectos. Historial completo desde el primer contacto hasta el cierre financiero.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'El seguimiento sistemático marca la diferencia entre ganar y perder una obra.',
        },
        actors: {
            chip: 'Para cada rol comercial',
            items: [
                { chip: 'Director Comercial', desc: 'Visibilidad total del pipeline sin armar reportes. Sabé cuánto vale la cartera activa, qué oportunidades están en riesgo y cuántos leads hay en cada etapa.' },
                { chip: 'Arquitecto / Jefe de Ventas', desc: 'Del primer contacto hasta la firma. Presupuestá, hacé seguimiento y convertí en proyecto en un clic. Sin Excel, sin duplicación.' },
                { chip: 'Asistente Comercial', desc: 'Registrá cada llamada, reunión y email en segundos. El equipo tiene contexto completo antes de cada contacto sin buscar en WhatsApp.' },
            ],
        },
        whyArqui: {
            chip: 'Por qué Arqy Sales',
            title: 'El sistema comercial que tu equipo va a usar de verdad.',
            description: 'No es un CRM genérico adaptado. Es un sistema diseñado para la forma en que se vende en construcción y real estate.',
            items: [
                { title: 'Todo conectado.', desc: 'Cuando cerrás una venta, el proyecto se abre automáticamente. La data se carga una vez y alimenta todos los módulos.' },
                { title: 'Visibilidad en tiempo real.', desc: 'El dueño ve el pipeline, las oportunidades en riesgo y el valor de la cartera sin que nadie arme un reporte.' },
                { title: 'En operación en días.', desc: 'No es un enterprise de implementación larga. En días tu equipo comercial ya está usando el sistema.' },
                { title: 'Hecho para construcción.', desc: 'No adaptado de otro sector. Construido entendiendo cómo funciona realmente el ciclo de ventas de una constructora.' },
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
            title: 'Tu pipeline bajo control. Desde hoy.',
            description: 'Empezá en minutos. Sin implementación larga, sin tarjeta de crédito. Tu equipo comercial activo en días.',
        },
    },
    en: {
        hero: {
            chip: 'Sales Module · Arqy Build',
            title: 'Capture, follow up, and close.\nWithout losing a lead.',
            description: 'From first contact to signature. The full sales cycle in one place, without Excel, WhatsApp, or lost opportunities.',
            cta1: 'Request Demo',
            cta2: 'View Solutions',
        },
        metrics: {
            chip: 'Real results',
            title: 'The impact you see from the first month.',
            description: 'Teams that adopt Arqy Sales close more deals, lose fewer opportunities, and operate faster.',
            items: [
                { label: 'increase in lead conversion rate', sub: 'with systematic follow-up' },
                { label: 'opportunities lost due to lack of follow-up', sub: 'pipeline always up to date' },
                { label: 'Faster quoting speed', sub: 'automatic conversion to project' },
            ],
        },
        valueProps: {
            chip: 'Why Arqy Sales',
            title: 'Centralize your entire sales cycle\nin one place.',
            description: 'Leave spreadsheets and WhatsApp messages behind. Your pipeline, leads, and quotes in one single system.',
            items: [
                { title: 'Never lose a lead again', desc: 'Every contact enters the pipeline, every interaction is recorded, every follow-up has its next step.' },
                { title: 'Quote and convert in one click', desc: 'When the client accepts, the project opens automatically with all the information already loaded. No duplicating data.' },
                { title: 'Full pipeline visibility', desc: 'Always know the value of your active portfolio, what stage each opportunity is in, and what needs attention today.' },
            ],
        },
        solutions: {
            chip: 'Features',
            title: 'Everything your sales team needs.',
            description: 'Every tool designed for the sales cycle of a construction or real estate company.',
            items: [
                { title: 'Visual pipeline', desc: 'Kanban board with configurable stages. Drag opportunities between stages, filter by owner, date, or estimated value.' },
                { title: 'Lead and contact management', desc: 'All your contacts in one place with a complete history of every interaction, without losing any data in emails or WhatsApp.' },
                { title: 'Communication history', desc: 'Every call, meeting, and email is recorded per opportunity. The team sees full context before contacting the client.' },
                { title: 'Documents per opportunity', desc: 'Plans, proposals, and contracts in one place. No lost versions, no disorganized Drive folders.' },
                { title: 'Automatic conversion to project', desc: 'When the client accepts, the project is created automatically with all data already loaded. Zero duplication.' },
                { title: 'Integrated CRM', desc: 'Clients linked to their opportunities and projects. Full history from first contact to financial close.' },
            ],
        },
        impactQuote: {
            phrase1sub: 'Systematic follow-up is the difference between winning and losing a project.',
        },
        actors: {
            chip: 'For every sales role',
            items: [
                { chip: 'Commercial Director', desc: 'Full pipeline visibility without building reports. Know your active portfolio value, which opportunities are at risk, and how many leads are in each stage.' },
                { chip: 'Architect / Sales Manager', desc: 'From first contact to signature. Quote, follow up, and convert to project in one click. No Excel, no duplication.' },
                { chip: 'Sales Assistant', desc: 'Log every call, meeting, and email in seconds. The team has full context before every contact without searching through WhatsApp.' },
            ],
        },
        whyArqui: {
            chip: 'Why Arqy Sales',
            title: 'The sales system your team will actually use.',
            description: 'Not a generic CRM adapted. A system designed for the way construction and real estate sales actually work.',
            items: [
                { title: 'Everything connected.', desc: 'When you close a sale, the project opens automatically. Data is entered once and feeds all modules.' },
                { title: 'Real-time visibility.', desc: 'The owner sees the pipeline, at-risk opportunities, and portfolio value without anyone building a report.' },
                { title: 'Up and running in days.', desc: 'Not a long enterprise implementation. Your sales team is using the system within days.' },
                { title: 'Built for construction.', desc: 'Not adapted from another sector. Built understanding how the sales cycle of a construction company really works.' },
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
            title: 'Your pipeline under control. Starting today.',
            description: 'Get started in minutes. No long implementation, no credit card. Your sales team active within days.',
        },
    },
};

// ─── EN phrase segments for ImpactQuote ───────────────────────────────────────
const PHRASE1_SEGMENTS_ES = [
    { text: 'Un lead sin seguimiento a las 48hs\ntiene ', highlight: false },
    { text: '80% menos chances de cerrarse', highlight: true },
    { text: ' —\nno por falta de producto, sino porque\nnadie recordó hacer el próximo contacto.', highlight: false },
];
const PHRASE2_SEGMENTS_ES = [
    { text: 'El equipo comercial que sabe\n', highlight: false },
    { text: 'en qué etapa está cada oportunidad\ny qué hacer hoy', highlight: true },
    { text: ' —\ncierra más obras,\nsin trabajar más horas.', highlight: false },
];
const PHRASE1_SEGMENTS_EN = [
    { text: 'A lead without follow-up within 48 hours\nhas ', highlight: false },
    { text: '80% less chance of closing', highlight: true },
    { text: ' —\nnot because of the product, but because\nnobody remembered to make the next contact.', highlight: false },
];
const PHRASE2_SEGMENTS_EN = [
    { text: 'The sales team that knows\n', highlight: false },
    { text: 'what stage every opportunity is in\nand what to do today', highlight: true },
    { text: ' —\ncloses more projects,\nwithout working more hours.', highlight: false },
];

// TOTAL char counts (computed lazily after buildItems is hoisted)
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
function SalesHero({ lang }) {
    const t = PAGE_T[lang]?.hero || PAGE_T.es.hero;
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

    return (
        <section ref={ref} className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-center">
            {/* Background image with parallax */}
            <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
                <img
                    src="/images/ArquiSales_Hero.jpeg"
                    alt="Ejecutivo de ventas revisando pipeline"
                    className="w-full h-full object-cover object-center scale-110"
                />
            </motion.div>

            {/* Dark overlay */}
            <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(15,20,45,0.78) 55%, rgba(15,20,45,0.25) 100%)' }} />

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
const ACTIVE_MODULE = 'Sales';
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
        value: 40,
        prefix: '+',
        suffix: '%',
        label: 'en tasa de conversión de leads',
        sub: 'con seguimiento sistemático',
    },
    {
        value: 0,
        prefix: '',
        suffix: '',
        label: 'oportunidades perdidas por falta de seguimiento',
        sub: 'pipeline siempre actualizado',
    },
    {
        value: 3,
        prefix: '',
        suffix: 'x',
        label: 'Más velocidad para presupuestar',
        sub: 'conversión automática a proyecto',
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
                            <p className="font-bold text-[13px] text-[#111827] mb-1">{label}</p>
                            <p className="text-[13px] text-[#6B7280]">{sub}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

// ─── Value Props ───────────────────────────────────────────────────────────────
const VALUE_PROPS = [
    {
        icon: TrendingUp,
        title: 'No pierdas más leads',
        desc: 'Cada contacto entra al pipeline, cada interacción queda registrada, cada seguimiento tiene su próximo paso.',
        color: '#22C55E',
        bgColor: '#F0FDF4',
    },
    {
        icon: Zap,
        title: 'Presupuestá y convertí en un clic',
        desc: 'Cuando el cliente acepta, el proyecto se abre automáticamente con toda la información ya cargada. Sin duplicar datos.',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
    },
    {
        icon: BarChart3,
        title: 'Visibilidad total del pipeline',
        desc: 'Sabé en todo momento cuánto vale tu cartera activa, qué etapa tiene cada oportunidad y qué necesita atención hoy.',
        color: PRIMARY,
        bgColor: '#EEF0F8',
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

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {propsData.map(({ icon: Icon, title, desc, color, bgColor }, i) => (
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

// ─── Solutions Section ────────────────────────────────────────────────────────
const SOLUTIONS = [
    {
        title: 'Pipeline visual',
        desc: 'Tablero kanban con etapas configurables. Arrastrá oportunidades entre etapas, filtrá por responsable, fecha o valor estimado.',
        img: '/images/Sales_pipeline.jpeg',
    },
    {
        title: 'Gestión de leads y contactos',
        desc: 'Todos tus contactos en un solo lugar con historial completo de cada interacción, sin perder ningún dato en emails o WhatsApp.',
        img: '/images/Sales_leads.jpeg',
    },
    {
        title: 'Historial de comunicaciones',
        desc: 'Cada llamada, reunión y email queda registrado por oportunidad. El equipo ve todo el contexto antes de contactar al cliente.',
        img: '/images/Sales_comunicaciones.jpeg',
    },
    {
        title: 'Documentos por oportunidad',
        desc: 'Planos, propuestas y contratos en un solo lugar. Sin versiones perdidas, sin carpetas de Drive desorganizadas.',
        img: '/images/Sales_documentos.jpeg',
    },
    {
        title: 'Conversión automática a proyecto',
        desc: 'Cuando el cliente acepta, el proyecto se crea automáticamente con todos los datos ya cargados. Cero duplicación.',
        img: '/images/Sales_conversion.jpeg',
    },
    {
        title: 'CRM integrado',
        desc: 'Clientes vinculados a sus oportunidades y proyectos. Historial completo desde el primer contacto hasta el cierre financiero.',
        img: '/images/Sales_crm.jpeg',
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
                                            {/* Mobile/Tablet: image inside accordion */}
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

const PHRASE1_SEGMENTS = [
    { text: 'Un lead sin seguimiento a las 48hs\ntiene ', highlight: false },
    { text: '80% menos chances de cerrarse', highlight: true },
    { text: ' —\nno por falta de producto, sino porque\nnadie recordó hacer el próximo contacto.', highlight: false },
];
const PHRASE2_SEGMENTS = [
    { text: 'El equipo comercial que sabe\n', highlight: false },
    { text: 'en qué etapa está cada oportunidad\ny qué hacer hoy', highlight: true },
    { text: ' —\ncierra más obras,\nsin trabajar más horas.', highlight: false },
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
        chip: 'Director Comercial',
        desc: 'Visibilidad total del pipeline sin armar reportes. Sabé cuánto vale la cartera activa, qué oportunidades están en riesgo y cuántos leads hay en cada etapa.',
        img: '/images/Actor_DirectorComercial.jpeg',
        icon: Building2,
    },
    {
        chip: 'Arquitecto / Jefe de Ventas',
        desc: 'Del primer contacto hasta la firma. Presupuestá, hacé seguimiento y convertí en proyecto en un clic. Sin Excel, sin duplicación.',
        img: '/images/Actor_Arquitecta.jpeg',
        icon: HardHat,
    },
    {
        chip: 'Asistente Comercial',
        desc: 'Registrá cada llamada, reunión y email en segundos. El equipo tiene contexto completo antes de cada contacto sin buscar en WhatsApp.',
        img: '/images/Actor_AsistenteComercial.jpeg',
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
                        {lang === 'es' ? <>Construido para quienes<br />venden en serio.</> : <>Built for those who<br />sell seriously.</>}
                    </motion.h2>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {actorsData.map(({ chip, desc, img, icon: Icon }, i) => (
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

// ─── Why Arqy Sales ───────────────────────────────────────────────────────────
const PILLARS = [
    {
        num: '01',
        icon: Link2,
        title: 'Todo conectado.',
        desc: 'Cuando cerrás una venta, el proyecto se abre automáticamente. La data se carga una vez y alimenta todos los módulos.',
    },
    {
        num: '02',
        icon: Eye,
        title: 'Visibilidad en tiempo real.',
        desc: 'El dueño ve el pipeline, las oportunidades en riesgo y el valor de la cartera sin que nadie arme un reporte.',
    },
    {
        num: '03',
        icon: Zap,
        title: 'En operación en días.',
        desc: 'No es un enterprise de implementación larga. En días tu equipo comercial ya está usando el sistema.',
    },
    {
        num: '04',
        icon: HardHat,
        title: 'Hecho para construcción.',
        desc: 'No adaptado de otro sector. Construido entendiendo cómo funciona realmente el ciclo de ventas de una constructora.',
    },
];

function WhyArquiSales({ lang }) {
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
    { name: 'Juan Devera',   experience: '10', img: '/images/Juan_devera_ceo.jpeg',  role: 'Fundador', quote: '"Creamos Arqy porque el real estate necesitaba una infraestructura digital que conecte capital, construcción y comunidad en una única fuente de verdad."', study: 'Finanzas' },
    { name: 'Luciano Reca',  experience: '7',  img: '/images/Luciano_Reca.jpeg',     role: 'Fundador', quote: '"Nuestra misión es profesionalizar una industria que durante décadas operó con herramientas del siglo pasado. Arqy es el sistema operativo que lo cambia todo."', study: 'Finanzas' },
];
const TEAM_EN = [
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
export default function SalesPage() {
    const { lang, setLang } = useLang();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-lebane/10 selection:text-lebane overflow-x-clip">
            <SharedNavbar lang={lang} setLang={setLang} />
            <SalesHero lang={lang} />
            <ModuleStrip lang={lang} />
            <MetricsSection lang={lang} />
            <ValuePropsSection lang={lang} />
            <SolutionsSection lang={lang} />
            <ImpactQuote lang={lang} />
            <ActorCards lang={lang} />
            <WhyArquiSales lang={lang} />
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

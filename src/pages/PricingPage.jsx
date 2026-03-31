import React, { useState, memo, useEffect } from 'react';
import { useLang } from '../LangContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, Wallet, Home, Globe, Settings,
    BarChart3, Zap, ShieldCheck, Check,
    Link2, Eye, HardHat, Database, ArrowRight, CheckCircle2, Wrench,
} from 'lucide-react';
import SharedNavbar from '../components/SharedNavbar';
import SharedFooter from '../components/SharedFooter';
import SharedAboutSection from '../components/SharedAboutSection';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const PRIMARY = '#20316d';

// ─── Data ──────────────────────────────────────────────────────────────────────
const CAROUSEL_MODULES = [
    { id: 'build',      label: 'Arqy Build',      icon: Building2,  active: true,  gradient: 'from-[#20316d] to-[#2a4494]' },
    { id: 'capital',    label: 'Arqy Capital',     icon: Wallet,     active: false, gradient: 'from-[#1a4a6b] to-[#1e6090]' },
    { id: 'management', label: 'Arqy Management',  icon: Settings,   active: false, gradient: 'from-[#374151] to-[#4B5563]' },
    { id: 'home',       label: 'Arqy Home',        icon: Home,       active: false, gradient: 'from-[#065f46] to-[#047857]' },
    { id: 'state',      label: 'Arqy State',       icon: Globe,      active: false, gradient: 'from-[#7B61FF] to-[#9d4edd]' },
];

const PLANS = [
    { id: 'trial',      nameKey: 'trial',      price: 100, color: '#20316d', gradient: 'from-[#20316d] to-[#2a4494]', ctaType: 'outline', icon: Building2 },
    { id: 'core',       nameKey: 'core',       price: 250, color: '#1a4a6b', gradient: 'from-[#1a4a6b] to-[#1e6090]', ctaType: 'outline', icon: BarChart3 },
    { id: 'enterprise', nameKey: 'enterprise', price: null, color: '#0051FF', gradient: 'from-[#0051FF] to-[#20316d]', ctaType: 'filled',  icon: Zap, recommended: true },
    { id: 'premium',    nameKey: 'premium',    price: null, color: '#0f172a', gradient: 'from-[#0f172a] to-[#20316d]', ctaType: 'outline', icon: ShieldCheck },
];

// ─── Translations ───────────────────────────────────────────────────────────────
const PAGE_T = {
    es: {
        tag: 'PRECIOS',
        title: 'Un plan para cada etapa de tu crecimiento',
        desc: 'Empieza con lo que necesitas hoy y escala sin fricciones. Todos los planes incluyen acceso a Arqy Build.',
        monthly: 'Mensual',
        annual: 'Anual · Ahorra 10%',
        perUser: '/usuario/mes',
        billedAnnually: 'Facturado anualmente',
        billedMonthly: 'Facturado mensualmente',
        recommended: 'Recomendado',
        comingSoon: 'Próximamente',
        compareToggle: 'Ver comparación completa',
        compareHide: 'Ocultar comparación',
        selectModule: 'Selecciona el módulo',
        moduleActive: 'Disponible',
        plans: {
            trial:      { name: 'Trial',             description: '1–3 usuarios · 1 proyecto activo',     cta: 'Quiero Empezar' },
            core:       { name: 'Core Pilot',         description: 'Hasta 5 usuarios · 3–5 proyectos',     cta: 'Iniciar Piloto' },
            enterprise: { name: 'Enterprise',     description: 'Usuarios y proyectos ilimitados',      cta: 'Hablar con Ventas' },
            premium:    { name: 'Premium Enterprise', description: 'Todo el MVP + add-ons avanzados',      cta: 'Solicitar Cotización' },
        },
        features: {
            trial:      ['Hasta 3 usuarios', '1 proyecto activo', 'Clients & CRM básico', 'Project Management', 'Procurement', 'Team Management', 'Finance básico', 'Document Management', 'Analytics básico', 'Soporte por Email'],
            core:       ['Hasta 5 usuarios', '3–5 proyectos activos', 'Todo lo del Trial', 'Analytics completo', 'Lead Funnel', 'Soporte por Chat'],
            enterprise: ['Usuarios ilimitados', 'Proyectos ilimitados', 'Todo lo del Core', 'Workorders', 'Drive to Site', 'Hourly Tracking', 'Report Back (fotos y videos)', 'Direct Communication', 'Account Manager Trimestral', 'Soporte 24/7'],
            premium:    ['Todo lo de Enterprise', 'Accounting Integration', 'Inventory Management avanzado', 'Warehouse Management', 'Vendor Management', 'Finance Dashboard avanzado', 'Account Manager Dedicado', 'Soporte 24/7 Prioritario'],
        },
        actors: {
            chip: 'Para quién',
            items: [
                { chip: 'Constructoras', desc: 'Desvíos detectados a tiempo. Materiales con trazabilidad. Contratistas coordinados. El dueño con visión real del negocio sin esperar el reporte mensual.' },
                { chip: 'Estudios de Arquitectura', desc: 'Del primer lead hasta el proyecto cerrado financieramente. Presupuesto, documentos y equipo en un solo lugar. Sin Excel, sin duplicación.' },
                { chip: 'Contratistas Especializados', desc: 'Pedí materiales desde la app en vez del WhatsApp. Reportá desde obra con fotos y videos. Recibí pagos con historial completo. Sin reuniones innecesarias.' },
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
        about: { chip: 'El equipo', title: 'Quiénes somos', desc: 'Conocé al equipo detrás de la transformación digital del real estate', yearsLabel: 'años de experiencia', studyLabel: 'Formación' },
        cta: {
            title: 'Tu constructora, en control total desde hoy.',
            description: 'Empezá con Arqy Build y transformá la forma en que operás.',
        },
        compare: {
            title: 'Comparación completa de planes',
            categories: [
                { name: 'Gestión de Proyectos', rows: [
                    { feature: 'Proyectos activos',     trial: '1',   core: '3–5',     enterprise: 'Ilimitados', premium: 'Ilimitados' },
                    { feature: 'Usuarios',              trial: '1–3', core: 'Hasta 5', enterprise: 'Ilimitados', premium: 'Ilimitados' },
                    { feature: 'Project Management',    trial: true,  core: true,      enterprise: true,         premium: true },
                    { feature: 'Workorders',            trial: false, core: false,     enterprise: true,         premium: true },
                    { feature: 'Drive to Site',         trial: false, core: false,     enterprise: true,         premium: true },
                    { feature: 'Hourly Tracking',       trial: false, core: false,     enterprise: true,         premium: true },
                    { feature: 'Report Back (fotos de obra)', trial: 'Limitado', core: true, enterprise: true,  premium: true },
                ]},
                { name: 'Finanzas & Analytics', rows: [
                    { feature: 'Finance básico',                trial: true,  core: true,  enterprise: true,  premium: true },
                    { feature: 'Desvío presupuestario',         trial: false, core: false, enterprise: true,  premium: true },
                    { feature: 'Overview por empresa/obra',     trial: false, core: false, enterprise: true,  premium: true },
                    { feature: 'Balance en tiempo real',        trial: false, core: false, enterprise: true,  premium: true },
                    { feature: 'Analytics completo',            trial: false, core: true,  enterprise: true,  premium: true },
                    { feature: 'Finance Dashboard avanzado',    trial: false, core: false, enterprise: false, premium: true },
                    { feature: 'Accounting Integration',        trial: false, core: false, enterprise: false, premium: true },
                ]},
                { name: 'CRM & Ventas', rows: [
                    { feature: 'Clients & CRM básico',         trial: true,  core: true,  enterprise: true, premium: true },
                    { feature: 'Lead Funnel',                   trial: false, core: true,  enterprise: true, premium: true },
                    { feature: 'Seguimiento de interacciones',  trial: false, core: false, enterprise: true, premium: true },
                    { feature: 'Procurement',                   trial: true,  core: true,  enterprise: true, premium: true },
                ]},
                { name: 'Inventario & Logística', rows: [
                    { feature: 'Document Management',               trial: true,  core: true,  enterprise: true,  premium: true },
                    { feature: 'Inventory Management avanzado',     trial: false, core: false, enterprise: false, premium: true },
                    { feature: 'Warehouse Management',              trial: false, core: false, enterprise: false, premium: true },
                    { feature: 'Vendor Management',                 trial: false, core: false, enterprise: false, premium: true },
                ]},
                { name: 'Soporte', rows: [
                    { feature: 'Soporte por Email',             trial: true,  core: true,  enterprise: true,  premium: true },
                    { feature: 'Soporte por Chat',              trial: false, core: true,  enterprise: true,  premium: true },
                    { feature: 'Account Manager Trimestral',    trial: false, core: false, enterprise: true,  premium: true },
                    { feature: 'Account Manager Dedicado',      trial: false, core: false, enterprise: false, premium: true },
                    { feature: 'Soporte 24/7 Prioritario',      trial: false, core: false, enterprise: true,  premium: true },
                ]},
            ],
        },
    },
    en: {
        tag: 'PRICING',
        title: 'A plan for every stage of your growth',
        desc: 'Start with what you need today and scale without friction. All plans include access to Arqy Build.',
        monthly: 'Monthly',
        annual: 'Annual · Save 10%',
        perUser: '/user/month',
        billedAnnually: 'Billed annually',
        billedMonthly: 'Billed monthly',
        recommended: 'Recommended',
        comingSoon: 'Coming Soon',
        compareToggle: 'View full comparison',
        compareHide: 'Hide comparison',
        selectModule: 'Select module',
        moduleActive: 'Available',
        plans: {
            trial:      { name: 'Trial',             description: '1–3 users · 1 active project',        cta: 'Get Started' },
            core:       { name: 'Core Pilot',         description: 'Up to 5 users · 3–5 projects',        cta: 'Start Pilot' },
            enterprise: { name: 'Enterprise',     description: 'Unlimited users and projects',         cta: 'Talk to Sales' },
            premium:    { name: 'Premium Enterprise', description: 'All MVP features + advanced add-ons',  cta: 'Request Quote' },
        },
        features: {
            trial:      ['Up to 3 users', '1 active project', 'Clients & Basic CRM', 'Project Management', 'Procurement', 'Team Management', 'Basic Finance', 'Document Management', 'Basic Analytics', 'Email Support'],
            core:       ['Up to 5 users', '3–5 active projects', 'Everything in Trial', 'Full Analytics', 'Lead Funnel', 'Chat Support'],
            enterprise: ['Unlimited users', 'Unlimited projects', 'Everything in Core', 'Workorders', 'Drive to Site', 'Hourly Tracking', 'Report Back (photos & videos)', 'Direct Communication', 'Quarterly Account Manager', '24/7 Support'],
            premium:    ['Everything in Enterprise', 'Accounting Integration', 'Advanced Inventory Management', 'Warehouse Management', 'Vendor Management', 'Advanced Finance Dashboard', 'Dedicated Account Manager', 'Priority 24/7 Support'],
        },
        actors: {
            chip: 'Who it\'s for',
            items: [
                { chip: 'Construction Firms', desc: 'Variances detected in time. Materials with traceability. Coordinated contractors. The owner with a real view of the business without waiting for the monthly report.' },
                { chip: 'Architecture Studios', desc: 'From the first lead to the financially closed project. Budget, documents and team in one place. No Excel, no duplication.' },
                { chip: 'Specialized Contractors', desc: 'Request materials from the app instead of WhatsApp. Report from site with photos and videos. Receive payments with full history. No unnecessary meetings.' },
            ],
        },
        whyArqui: {
            chip: 'Why Arqy Build',
            title: 'Not generic software adapted to construction.',
            description: 'Built with a real understanding of how a project, a budget, a contractor and a client actually work.',
            items: [
                { title: 'Everything connected.', desc: 'A purchase updates the stock and generates the expense automatically. Data is entered once and feeds all modules without anyone touching it.' },
                { title: 'Real-time visibility.', desc: 'The variance appears before it becomes a problem. The owner sees the status of every project without waiting for a manually assembled monthly report.' },
                { title: 'Up and running in days.', desc: 'Not an enterprise with a long implementation. Specific software configured quickly and the team starts using from day one.' },
                { title: 'Built for construction.', desc: 'Not adapted from another sector. Built with a real understanding of how a project, a budget, a contractor and a client actually work.' },
            ],
        },
        ecosystem: { title: 'The Ecosystem that Connects Everything', desc: 'Five interconnected modules covering the complete real estate lifecycle.' },
        about: { chip: 'The team', title: 'Who we are', desc: 'Meet the team behind the digital transformation of real estate', yearsLabel: 'years of experience', studyLabel: 'Background' },
        cta: {
            title: 'Your construction firm, in total control from today.',
            description: 'Start with Arqy Build and transform the way you operate.',
        },
        compare: {
            title: 'Full plan comparison',
            categories: [
                { name: 'Project Management', rows: [
                    { feature: 'Active projects',       trial: '1',   core: '3–5',     enterprise: 'Unlimited', premium: 'Unlimited' },
                    { feature: 'Users',                 trial: '1–3', core: 'Up to 5', enterprise: 'Unlimited', premium: 'Unlimited' },
                    { feature: 'Project Management',    trial: true,  core: true,      enterprise: true,        premium: true },
                    { feature: 'Workorders',            trial: false, core: false,     enterprise: true,        premium: true },
                    { feature: 'Drive to Site',         trial: false, core: false,     enterprise: true,        premium: true },
                    { feature: 'Hourly Tracking',       trial: false, core: false,     enterprise: true,        premium: true },
                    { feature: 'Report Back (site photos)', trial: 'Limited', core: true, enterprise: true, premium: true },
                ]},
                { name: 'Finance & Analytics', rows: [
                    { feature: 'Basic Finance',                 trial: true,  core: true,  enterprise: true,  premium: true },
                    { feature: 'Budget Deviation',              trial: false, core: false, enterprise: true,  premium: true },
                    { feature: 'Company/Project Overview',      trial: false, core: false, enterprise: true,  premium: true },
                    { feature: 'Real-time Balance',             trial: false, core: false, enterprise: true,  premium: true },
                    { feature: 'Full Analytics',                trial: false, core: true,  enterprise: true,  premium: true },
                    { feature: 'Advanced Finance Dashboard',    trial: false, core: false, enterprise: false, premium: true },
                    { feature: 'Accounting Integration',        trial: false, core: false, enterprise: false, premium: true },
                ]},
                { name: 'CRM & Sales', rows: [
                    { feature: 'Clients & Basic CRM',          trial: true,  core: true,  enterprise: true, premium: true },
                    { feature: 'Lead Funnel',                   trial: false, core: true,  enterprise: true, premium: true },
                    { feature: 'Interaction Tracking',          trial: false, core: false, enterprise: true, premium: true },
                    { feature: 'Procurement',                   trial: true,  core: true,  enterprise: true, premium: true },
                ]},
                { name: 'Inventory & Logistics', rows: [
                    { feature: 'Document Management',               trial: true,  core: true,  enterprise: true,  premium: true },
                    { feature: 'Advanced Inventory Management',     trial: false, core: false, enterprise: false, premium: true },
                    { feature: 'Warehouse Management',              trial: false, core: false, enterprise: false, premium: true },
                    { feature: 'Vendor Management',                 trial: false, core: false, enterprise: false, premium: true },
                ]},
                { name: 'Support', rows: [
                    { feature: 'Email Support',                 trial: true,  core: true,  enterprise: true,  premium: true },
                    { feature: 'Chat Support',                  trial: false, core: true,  enterprise: true,  premium: true },
                    { feature: 'Quarterly Account Manager',     trial: false, core: false, enterprise: true,  premium: true },
                    { feature: 'Dedicated Account Manager',     trial: false, core: false, enterprise: false, premium: true },
                    { feature: 'Priority 24/7 Support',         trial: false, core: false, enterprise: true,  premium: true },
                ]},
            ],
        },
    },
};

// ─── Shared section data ────────────────────────────────────────────────────────
const ACTORS = [
    { chip: 'Constructoras',            img: '/images/Actor_Constructora.webp', icon: Building2 },
    { chip: 'Estudios de Arquitectura', img: '/images/Actor_Arquitecta.webp',   icon: HardHat   },
    { chip: 'Contratistas Especializados', img: '/images/Actor_Contratista.webp', icon: Wrench    },
];

const PILLARS = [
    { num: '01', icon: Link2,    title: 'Todo conectado.',             desc: '' },
    { num: '02', icon: Eye,      title: 'Visibilidad en tiempo real.', desc: '' },
    { num: '03', icon: Zap,      title: 'En operación en días.',       desc: '' },
    { num: '04', icon: HardHat,  title: 'Hecho para construcción.',    desc: '' },
];

const BUILD_MODULES = [
    { id: 'build',      label: 'BUILD',      icon: Database, orbitRadius: 110, size: 48, speed:  0.6, phaseShift: 0 },
    { id: 'state',      label: 'STATE',      icon: Globe,    orbitRadius: 110, size: 48, speed:  0.6, phaseShift: (2 * Math.PI) / 3 },
    { id: 'capital',    label: 'CAPITAL',    icon: Wallet,   orbitRadius: 110, size: 48, speed:  0.6, phaseShift: (4 * Math.PI) / 3 },
    { id: 'home',       label: 'HOME',       icon: Home,     orbitRadius: 190, size: 52, speed: -0.4, phaseShift: 0 },
    { id: 'management', label: 'MANAGEMENT', icon: Settings, orbitRadius: 190, size: 52, speed: -0.4, phaseShift: Math.PI },
];

const TEAM_ES = [
    { name: 'Juan Devera',  experience: '10', img: '/images/Juan_devera_ceo.webp', role: 'Fundador', quote: '"Creamos Arqy porque el real estate necesitaba una infraestructura digital que conecte capital, construcción y comunidad en una única fuente de verdad."', study: 'Finanzas' },
    { name: 'Luciano Reca', experience: '7',  img: '/images/Luciano_Reca.webp',    role: 'Fundador', quote: '"Nuestra misión es profesionalizar una industria que durante décadas operó con herramientas del siglo pasado. Arqy es el sistema operativo que lo cambia todo."', study: 'Finanzas' },
];
const TEAM_EN = [
    { name: 'Juan Devera',  experience: '10', img: '/images/Juan_devera_ceo.webp', role: 'Founder', quote: '"We created Arqy because real estate needed a digital infrastructure that connects capital, construction and community into a single source of truth."', study: 'Finance' },
    { name: 'Luciano Reca', experience: '7',  img: '/images/Luciano_Reca.webp',    role: 'Founder', quote: '"Our mission is to professionalize an industry that for decades operated with last century\'s tools. Arqy is the operating system that changes everything."', study: 'Finance' },
];

// ─── Actor Cards ───────────────────────────────────────────────────────────────
function ActorCards({ lang }) {
    const t = PAGE_T[lang]?.actors || PAGE_T.es.actors;
    const actorsData = ACTORS.map((a, i) => ({ ...a, ...(t.items[i] || {}) }));
    return (
        <section className="py-24" style={{ background: '#FBFBFE' }}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-14">
                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full px-4 py-1.5 mb-5">
                        <span className="text-[#20316d] text-[12px] font-bold tracking-widest uppercase">{t.chip}</span>
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08 }}
                        className="text-[36px] md:text-[48px] font-extrabold text-[#111827]">
                        {lang === 'es' ? <>Construido para quienes<br />construyen en serio.</> : <>Built for those who<br />build seriously.</>}
                    </motion.h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {actorsData.map(({ chip, desc, img }, i) => (
                        <motion.div key={chip} initial={{ opacity: 0, y: 60, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} whileHover={{ y: -10, scale: 1.03 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                            className="flex flex-col items-center text-center cursor-pointer group">
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

// ─── Why Arqui Build ──────────────────────────────────────────────────────────
function WhyArquiBuild({ lang }) {
    const t = PAGE_T[lang]?.whyArqui || PAGE_T.es.whyArqui;
    const pillarsData = PILLARS.map((p, i) => ({ ...p, ...(t.items[i] || {}) }));
    return (
        <section className="px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 relative">
                    <div className="lg:w-1/2 order-2 lg:order-1 py-20 flex flex-col gap-8">
                        {pillarsData.map(({ num, icon: Icon, title, desc }) => (
                            <motion.div key={num} initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }} viewport={{ once: true, margin: '-50px' }}
                                className="bg-white p-8 rounded-[2rem] border border-[#E5E7EB] shadow-premium hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
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
                            <h2 className="text-[32px] md:text-[48px] font-extrabold text-[#111827] leading-tight mb-6">{t.title}</h2>
                            <p className="text-[18px] text-[#6B7280] leading-[1.7]">{t.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Ecosystem ────────────────────────────────────────────────────────────────
const OrbitNode = memo(({ config, angle }) => {
    const [hovered, setHovered] = useState(false);
    const { orbitRadius, size, label } = config;
    const Icon = config.icon;
    const x = Math.cos(angle) * orbitRadius;
    const y = Math.sin(angle) * orbitRadius;
    return (
        <div className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
            style={{ width: `${size}px`, height: `${size}px`, transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`, zIndex: hovered ? 20 : 10 }}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
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


// ─── CTA Final ────────────────────────────────────────────────────────────────
function CTAFinal({ lang }) {
    const t = PAGE_T[lang]?.cta || PAGE_T.es.cta;
    return (
        <section className="py-28 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #0d0da9 100%)` }}>
            <motion.div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
                style={{ background: '#7B61FF', filter: 'blur(100px)' }}
                animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
                style={{ background: '#aebfff', filter: 'blur(100px)' }}
                animate={{ x: [0, -40, 0], y: [0, -30, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} />
            <div className="relative max-w-3xl mx-auto px-6 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <h2 className="text-white text-[32px] md:text-[48px] font-extrabold leading-[1.12] mb-5">{t.title}</h2>
                    <p className="text-white/65 text-[17px] mb-10">{t.description}</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <motion.a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-contact-modal')); }} className="inline-flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-colors duration-200"
                            style={{ color: PRIMARY }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                            {lang === 'es' ? 'Hablar con un Experto' : 'Talk to an Expert'} <ArrowRight size={16} />
                        </motion.a>
                        <motion.a href="/pricing" className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-colors duration-200"
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                            {lang === 'es' ? 'Ver Precios' : 'See Pricing'}
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ─── Page Component ─────────────────────────────────────────────────────────────
export default function PricingPage() {
    const { lang, setLang } = useLang();
    const t = PAGE_T[lang];
    const [billing, setBilling] = useState('monthly');
    const [hoveredModule, setHoveredModule] = useState(null);

    const getPriceDisplay = (basePrice) =>
        billing === 'annual' ? Math.round(basePrice * 0.9) : basePrice;

    return (
        <div className="min-h-screen bg-[#FBFBFE] flex flex-col">
            <SharedNavbar lang={lang} setLang={setLang} />

            {/* Hero strip */}
            <div className="pt-36 pb-4 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#20316d]/10 border border-[#20316d]/20 rounded-full mb-6">
                        <div className="w-2 h-2 rounded-full bg-[#20316d]" />
                        <span className="text-[12px] font-bold text-[#20316d] uppercase tracking-[1.2px]">{t.tag}</span>
                    </div>
                    <h1 className="text-[32px] md:text-[52px] font-extrabold text-[#111827] leading-tight mb-4 max-w-3xl mx-auto">
                        {t.title}
                    </h1>
                    <p className="text-[17px] text-[#6B7280] max-w-xl mx-auto leading-relaxed">
                        {t.desc}
                    </p>
                </motion.div>
            </div>

            {/* Main content */}
            <main className="flex-1 py-12 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Module selector — horizontal names */}
                    <div className="flex flex-col items-center mb-20">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[2px] mb-8"
                        >
                            {t.selectModule}
                        </motion.p>

                        <div className="flex items-center justify-center flex-wrap gap-0">
                            {CAROUSEL_MODULES.map((mod, i) => (
                                <motion.div
                                    key={mod.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45, delay: 0.15 + i * 0.07 }}
                                    className="relative flex items-center"
                                    onMouseEnter={() => setHoveredModule(mod.id)}
                                    onMouseLeave={() => setHoveredModule(null)}
                                >
                                    {i > 0 && (
                                        <span className="mx-5 md:mx-8 text-[#D1D5DB] text-[22px] select-none leading-none">·</span>
                                    )}
                                    <div className="relative py-1.5">
                                        <motion.span
                                            className="text-[15px] md:text-[18px] font-bold leading-none select-none"
                                            animate={{
                                                color: mod.active ? '#20316d' : hoveredModule === mod.id ? '#6B7280' : '#C4C9D4',
                                            }}
                                            transition={{ duration: 0.2 }}
                                            style={{ cursor: mod.active ? 'default' : 'default' }}
                                        >
                                            {mod.label}
                                        </motion.span>

                                        {/* Active underline */}
                                        {mod.active && (
                                            <motion.div
                                                layoutId="active-module-line"
                                                className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full"
                                                style={{ background: '#20316d' }}
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                                            />
                                        )}

                                        {/* Coming soon tooltip */}
                                        <AnimatePresence>
                                            {hoveredModule === mod.id && !mod.active && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 4, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#111827] text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg pointer-events-none z-20"
                                                    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
                                                >
                                                    {t.comingSoon}
                                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111827] rotate-45" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Billing Toggle */}
                    <div className="flex justify-center mb-14">
                        <div className="relative flex items-center bg-[#F3F4F6] rounded-full p-1">
                            {['monthly', 'annual'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setBilling(option)}
                                    className="relative z-10 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-colors duration-200 whitespace-nowrap"
                                    style={{ color: billing === option ? PRIMARY : '#6B7280' }}
                                >
                                    {option === 'monthly' ? t.monthly : t.annual}
                                    {billing === option && (
                                        <motion.div
                                            layoutId="billing-pill-pricing"
                                            className="absolute inset-0 bg-white rounded-full shadow-md"
                                            style={{ zIndex: -1 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                        {PLANS.map((plan, index) => {
                            const pt = t.plans[plan.nameKey];
                            const features = t.features[plan.nameKey];
                            const PlanIcon = plan.icon;
                            const displayPrice = getPriceDisplay(plan.price);

                            return (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={{ y: -8, boxShadow: '0 24px 64px rgba(0,0,0,0.12)', transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                                    className="relative flex flex-col bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden"
                                >
                                    {/* Recommended badge */}
                                    {plan.recommended && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <span className="badge-pulse inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-[#0051FF]">
                                                <Zap className="w-3 h-3" />
                                                {t.recommended}
                                            </span>
                                        </div>
                                    )}

                                    {/* Colored header */}
                                    <div className={`bg-gradient-to-br ${plan.gradient} px-6 pt-6 pb-7`}>
                                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                                            <PlanIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-[20px] font-extrabold text-white mb-1">{pt.name}</h3>
                                        <p className="text-[13px] text-white/70 leading-snug">{pt.description}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="px-6 py-5 border-b border-[#F3F4F6]">
                                        {plan.price !== null ? (
                                            <>
                                                <div className="flex items-end gap-1">
                                                    <motion.span
                                                        key={`${plan.id}-${billing}`}
                                                        initial={{ opacity: 0, y: -8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="text-[42px] font-extrabold text-[#111827] leading-none"
                                                    >
                                                        ${displayPrice}
                                                    </motion.span>
                                                    <span className="text-[13px] text-[#9CA3AF] mb-1 leading-tight">{t.perUser}</span>
                                                </div>
                                                <p className="text-[12px] text-[#9CA3AF] mt-1">
                                                    {billing === 'annual' ? t.billedAnnually : t.billedMonthly}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-[24px] font-bold text-[#111827] py-2">
                                                {lang === 'es' ? 'Contactá a Ventas' : 'Contact Sales'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Feature list */}
                                    <div className="px-6 py-5 flex-1">
                                        <ul className="space-y-3">
                                            {features.map((feat, fi) => (
                                                <li key={fi} className="flex items-start gap-2.5">
                                                    <div
                                                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                                        style={{ backgroundColor: plan.color }}
                                                    >
                                                        <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                                                    </div>
                                                    <span className="text-[13px] text-[#374151] leading-snug">{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA */}
                                    <div className="px-6 pb-7 pt-2">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
                                            className={`w-full py-3 rounded-full text-[14px] font-bold transition-all duration-200 ${plan.ctaType === 'filled' ? 'text-white' : 'border-2 bg-transparent'}`}
                                            style={
                                                plan.ctaType === 'filled'
                                                    ? { backgroundColor: plan.color, boxShadow: `0 8px 24px ${plan.color}40` }
                                                    : { borderColor: plan.color, color: plan.color }
                                            }
                                        >
                                            {pt.cta}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Comparison Table */}
                    <div className="mt-8 -mx-6 px-6 overflow-x-auto">
                        <div className="min-w-[700px]">
                        {/* Sticky header — NO transform parent, sticky works vs viewport */}
                        <div
                            className="grid grid-cols-5 bg-white border border-[#E5E7EB] rounded-t-2xl"
                            style={{ position: 'sticky', top: '76px', zIndex: 30, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
                        >
                            {/* Label column */}
                            <div className="px-5 py-3 flex items-center">
                                <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest leading-tight">
                                    Planes
                                </span>
                            </div>

                            {/* Plan columns */}
                            {PLANS.map((plan) => {
                                const isFilled = plan.ctaType === 'filled';
                                return (
                                    <div key={plan.id} className="px-4 py-3 flex flex-col items-center gap-2.5 border-l border-[#F3F4F6]">
                                        <span className="text-[13px] font-extrabold tracking-wide" style={{ color: plan.color }}>
                                            {t.plans[plan.nameKey].name}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
                                            className="w-full py-2 rounded-xl text-[12px] font-bold transition-all duration-200"
                                            style={isFilled
                                                ? { background: `linear-gradient(135deg, ${plan.color} 0%, #20316d 100%)`, color: '#fff', boxShadow: `0 4px 14px ${plan.color}40` }
                                                : { background: 'white', border: `1.5px solid ${plan.color}`, color: plan.color }
                                            }
                                            onMouseEnter={e => { if (!isFilled) { e.currentTarget.style.background = plan.color; e.currentTarget.style.color = '#fff'; } }}
                                            onMouseLeave={e => { if (!isFilled) { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = plan.color; } }}
                                        >
                                            {t.plans[plan.nameKey].cta}
                                        </motion.button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Feature rows */}
                        <div className="bg-white border border-t-0 border-[#E5E7EB] rounded-b-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
                            {t.compare.categories.map((cat, ci) => (
                                <div key={ci}>
                                    {/* Category header */}
                                    <div className="grid grid-cols-5 bg-[#F9FAFB] border-b border-[#F3F4F6]">
                                        <div className="col-span-5 px-5 py-3 text-[11px] font-bold text-[#20316d] uppercase tracking-widest">
                                            {cat.name}
                                        </div>
                                    </div>
                                    {/* Rows */}
                                    {cat.rows.map((row, ri) => (
                                        <div
                                            key={ri}
                                            className={`grid grid-cols-5 hover:bg-[#FAFAFA] transition-colors ${ri < cat.rows.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}
                                        >
                                            <div className="px-5 py-3.5 text-[13px] text-[#374151]">{row.feature}</div>
                                            {['trial', 'core', 'enterprise', 'premium'].map((planKey) => {
                                                const val = row[planKey];
                                                return (
                                                    <div key={planKey} className="px-4 py-3.5 flex justify-center items-center border-l border-[#F9FAFB]">
                                                        {typeof val === 'boolean' ? (
                                                            val
                                                                ? <div className="w-5 h-5 rounded-full bg-[#20316d] flex items-center justify-center">
                                                                    <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                                                                  </div>
                                                                : <span className="w-4 h-0.5 bg-[#E5E7EB] rounded-full inline-block" />
                                                        ) : (
                                                            <span className="text-[13px] font-semibold text-[#374151]">{val}</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>

                </div>
            </main>

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

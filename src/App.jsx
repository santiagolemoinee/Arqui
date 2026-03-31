import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { useLang } from './LangContext.jsx';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import SharedNavbar from './components/SharedNavbar';
import SharedFooter from './components/SharedFooter';
import {
    Building2,
    Wallet,
    Home,
    Key,
    BarChart3,
    ArrowRight,
    ShieldCheck,
    Activity,
    Users,
    Database,
    Zap,
    Globe,
    Settings,
    MessageSquare,
    ChevronRight,
    TrendingUp,
    Lock,
    CheckCircle2
} from 'lucide-react';

// Design System Constants
const COLORS = {
    primary: "#20316d",
    lebane: "#0051FF",
    violet: "#7B61FF",
    background: "#FBFBFE"
};

const TRANSLATIONS = {
    es: {
        nav: { modules: 'Módulos', serve: 'A quiénes servimos', resources: 'Recursos', pricing: 'Pricing', login: 'Iniciar Sesión', cta: 'Empezar Ahora' },
        hero: {
            heading: ['El Sistema Operativo', 'del Real Estate'],
            desc: 'Somos la infraestructura digital que profesionaliza la industria. Unificamos capital, desarrollo y comunidad en una única fuente de verdad compartida.',
            cta1: 'Solicitar Acceso', cta2: 'Ver Ecosistema',
        },
        pain: {
            heading1: '¿Dónde se detiene tu crecimiento?', heading2: 'El Impacto del Caos Operativo',
            desc: 'Identificamos las fricciones críticas que hoy limitan tu rentabilidad, transparencia y escalabilidad en el mercado inmobiliario.',
            columns: [
                { cards: [{ title: 'Fuga de Márgenes', desc: 'Desvíos financieros detectados cuando ya es imposible corregirlos por falta de visibilidad real.' }, { title: 'Cronogramas Estáticos', desc: 'Planificaciones que no reflejan la realidad dinámica y los imprevistos del terreno.' }, { title: 'Retrabajos Críticos', desc: 'Errores costosos derivados de instrucciones perdidas en canales de comunicación informales.' }, { title: 'Opacidad Técnica', desc: 'Falta de trazabilidad real en certificaciones de avance y calidad de materiales instalados.' }] },
                { cards: [{ title: 'Ansiedad del Comprador', desc: 'Desconexión absoluta entre el cliente y el avance real de su unidad en construcción.' }, { title: 'Inventario Ciego', desc: 'Stock comercial desactualizado que genera ventas duplicadas o pérdida de oportunidades.' }, { title: 'Preventas sin Respaldo', desc: 'Promesas de venta basadas en proyecciones comerciales y no en hitos técnicos certificados.' }, { title: 'Cierre Lento', desc: 'Documentación técnica dispersa que retrasa la firma de boletos, contratos y escrituras finales.' }] },
                { cards: [{ title: 'Silencio Comunitario', desc: 'Residentes sin voz ni herramientas digitales en las decisiones que afectan su entorno.' }, { title: 'Fricción en Amenities', desc: 'Procesos analógicos, lentos y poco transparentes para la reserva de espacios comunes.' }, { title: 'Desconexión Vecinal', desc: 'Edificios que funcionan como estructuras aisladas, sin una red de comunidad conectada.' }, { title: 'Mala Experiencia Post-venta', desc: 'Reportes de fallas y reclamos perdidos por falta de un canal centralizado y profesional.' }] },
                { cards: [{ title: 'Exclusión de Capital', desc: 'Inversores potenciales fuera del mercado por barreras de entrada financieras demasiado altas.' }, { title: 'Inversión a Ciegas', desc: 'Capital expuesto a reportes manuales subjetivos sin verificación física de obra en tiempo real.' }, { title: 'Falta de Liquidez', desc: 'Inversiones inmobiliarias atrapadas en ciclos de salida rígidos, lentos y poco flexibles.' }, { title: 'Desconfianza Sistémica', desc: 'Inversores que dudan ante la falta de transparencia absoluta sobre el uso del capital.' }] },
            ],
        },
        build: {
            tag: 'Productos', title1: 'El Momento del Cambio: Donde el Caos se Convierte en', titleHighlight: 'Crecimiento',
            desc: 'Abandona la fragmentación y toma el liderazgo de tu negocio. Arqy despliega el nuevo estándar de confianza: una arquitectura diseñada para profesionalizar la ejecución de obra, certificar la comercialización del activo, agilizar el acceso al capital y elevar la vida en comunidad junto a una administración inteligente. Es hora de escalar tu visión con una transparencia sistémica que el mercado nunca ha visto. ¿Estás listo para el siguiente nivel?',
            buildTitle: 'Arqy Build: Control Total', buildDesc: 'Digitalizamos la ingeniería de campo y financiera. Seguimiento en tiempo real de cada tarea, costo y desvío para asegurar el retorno de inversión.',
            buildFeatures: ['Cronograma sincronizado con obra física', 'Alertas de desvío financiero en tiempo real', 'Dashboard de presupuesto vs. real'],
            learnMore: 'Ver más', timelineTitle: 'Sincronización en Tiempo Real: Tu Obra en Movimiento.',
            timelineDesc: 'Supera la incertidumbre de la gestión tradicional. Arqy Build te permite visualizar tareas simultáneas, detectar cuellos de botella antes de que ocurran y asegurar que cada equipo esté alineado con el ritmo real de ejecución.',
            projectTimeline: 'Project timeline', teamLabel: 'Team:',
            weeks: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7'],
            tasks: ['Movimiento de Suelos', 'Plateas de Fundación', 'Estructura Nivel 1', 'Instalaciones Sanitarias', 'Llenado de Losa'],
            financialTitle: 'Dashboard Financiero', financialDesc: 'Monitoreo en tiempo real del presupuesto y distribución de costos por etapa de construcción.',
            totalBudget: 'PRESUPUESTO TOTAL', currentDeviation: 'DESVÍO ACTUAL',
            legend: ['Ventas', 'Anticipo', 'Obra', 'Operativo', 'Otros'], netBalance: 'Balance neto:',
            months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
        },
        state: {
            title: 'Arqy State: Marketplace con Trazabilidad.', desc: 'Unidades verificadas con historial real. El comprador accede a la evidencia de construcción y estatus legal en un solo clic.',
            learnMore: 'Próximamente',
            bullets: ['Transparencia en Preventa: Accede al historial constructivo real y cronogramas de entrega certificados directamente por el avance físico de la obra.', 'Inventario Dinámico: Disponibilidad en vivo para brokers y compradores, con la capacidad de reservar unidades de forma digital y acceder a toda la documentación técnica de forma inmediata.', 'Evidencia Certificada: Visualiza el progreso mediante fotos y videos históricos que garantizan la calidad de los materiales y procesos estructurales antes de la entrega.'],
        },
        home: {
            bubble1Title: 'Votacion de consorcio iniciada', bubble2: '🙋 Hola vecinos, alguien sabe a que hora abre el SUM hoy?', bubble3: '🕘 Zoom reservado para las 9:15',
            title: 'Arqy Home: Tu Edificio es una Red Social.', desc: 'Gestión inteligente para residentes. Vota, reserva y accede a la memoria técnica de tu hogar desde una única plataforma digital.',
            features: ['Votaciones de Consorcio Verificadas', 'Booking de Amenities Inteligente', 'Acceso Remoto a Memoria Técnica'], learnMore: 'Próximamente',
        },
        management: {
            title: 'Arqy Management', desc: 'Gestión inteligente del edificio. Coordiná proveedores, administrá gastos y conectá a tu equipo desde un solo lugar con IoT e inteligencia artificial.',
            learnMore: 'Próximamente', controlTitle: 'Tu edificio, bajo control.',
            controlDesc: 'Maximiza la vida útil del inmueble mediante el monitoreo de sistemas vitales. Detectamos anomalías antes de que se conviertan en costos imprevistos, reduciendo expensas mediante la eficiencia técnica y el mantenimiento preventivo real.',
            energyLabel: 'Eficiencia energética:', elevatorAlert: '⚠️ Ascensor A:', elevatorDesc: 'Mantenimiento preventivo urgente. Próximo service reglamentario: 10 de Marzo',
            marketplaceTitle: 'Marketplace de Proveedores.', marketplaceDesc: 'Profesionales y proveedores de servicios pueden ofrecer su talento directamente en el ecosistema Arqy. Gestiona tareas de mantenimiento técnico o limpieza con pagos integrados en Tokens ARQY y calificaciones verificadas.',
            searchPlaceholder: 'Buscar servicio o proveedor...', services: ['Limpieza', 'Mant. Eléctrico', 'Climatización', 'Jardinería', 'Seguridad', 'Transporte', 'Plomería', 'Pintura', 'Cerrajería'],
        },
        capital: {
            title: 'Arqy Capital: La Infraestructura de Inversión', desc: 'Arqy Capital es el puente que conecta el mercado de capitales con la ejecución real en el terreno. Eliminamos la opacidad financiera mediante un sistema de inversión basado en datos verificables, no en promesas.',
            learnMore: 'Próximamente', microTitle: 'Micro-Inversión y Crowdfunding',
            microDesc: 'A través del Token ARQY, cualquier persona puede financiar proyectos específicos con montos mínimos. El activo inmobiliario funciona como garantía real, y la trazabilidad de Arqy Build asegura que cada peso invertido se refleje en el avance físico de la propiedad.',
            tokenTitle: 'El Ciclo Económico del Token ARQY', tokenDesc: 'El token no es solo inversión; es la moneda de cambio del ecosistema. Desde micro-inversiones en Capital hasta el pago de service providers en Property Management, ARQY crea un loop económico interno que revaloriza el activo inmobiliario digitalmente.',
        },
        personas: {
            tag: 'USUARIOS REALES',
            title: 'Personas Reales, Soluciones Reales.',
            subtitle: 'Desarrolladores, inversores, administradores, residentes y compradores. Cada uno con su plataforma, todos conectados al mismo activo.',
            people: [{ name: 'Constructores', desc: 'Asigná tareas, medí avances y llevá el registro de proveedores para que tu proyecto avance de manera óptima.', img: '/images/Constructor.webp' }, { name: 'Desarrolladores', desc: 'Controlá cada etapa del desarrollo inmobiliario con datos en tiempo real y trazabilidad completa del proyecto.', img: '/images/Arquitect.webp' }, { name: 'Inversores', desc: 'Accedé a oportunidades de inversión respaldadas por activos reales con transparencia total y rendimientos verificables.', img: '/images/Investor.webp' }, { name: 'Administradores', desc: 'Gestioná edificios de forma eficiente con herramientas de monitoreo, mantenimiento preventivo y comunicación directa.', img: '/images/Administrator.webp' }, { name: 'Residentes', desc: 'Viví una experiencia conectada: reservas, votaciones, reclamos y comunidad en un solo lugar.', img: '/images/Resident.webp' }, { name: 'Compradores', desc: 'Seguí el avance real de tu futura propiedad y tomá decisiones informadas con datos verificados.', img: '/images/Buyer.webp' }, { name: 'Brokers', desc: 'Accedé a información verificada de propiedades y proyectos para ofrecer a tus clientes datos confiables.', img: '/images/Broker.webp' }, { name: 'Proveedores', desc: 'Ofrecé tus servicios en el marketplace de Arqy y recibí pagos integrados con calificaciones verificadas.', img: '/images/Gardener.webp' }],
        },
        whyArqui: {
            title: '¿Por qué elegir Arqy?', desc: 'Arqy no es solo una opción, es el nuevo estándar de la industria. Nuestra propuesta es única y no existe ninguna otra plataforma en el mercado capaz de unificar el ciclo de vida completo del real estate en un solo sistema operativo. Pasamos de gestionar tareas a gestionar la confianza.',
            cards: [{ title: 'La Única Fuente de Verdad', desc: 'A diferencia de herramientas fragmentadas, Arqy conecta a todos los actores en un sistema de registro único donde la transparencia es automática, eliminando reportes manuales y datos subjetivos.' }, { title: 'Escalabilidad sin Precedentes', desc: 'Nuestra infraestructura operativa te permite triplicar tu capacidad de gestión de obras con la misma estructura administrativa, transformando el caos del crecimiento en una ventaja competitiva.' }, { title: 'Certificación Real de Valor', desc: 'Somos los únicos que transforman la gestión interna en un activo comercial, otorgando a cada unidad un historial técnico certificado que incrementa su valor de reventa y confianza del comprador.' }, { title: 'Continuidad Total del Activo', desc: 'Arqy es el único ecosistema que acompaña la propiedad desde la inversión inicial hasta décadas de operación comunitaria, protegiendo la memoria técnica y planos del edificio para siempre.' }, { title: 'Infraestructura de Capital Ágil', desc: 'Democratizamos el acceso al mercado mediante un loop económico tokenizado que garantiza seguridad al inversor y liquidez inmediata al desarrollador bajo el respaldo de activos reales.' }],
        },
        ecosystem: { title: 'El Ecosistema que lo Une Todo', desc: 'Cinco módulos interconectados que cubren el ciclo de vida completo del real estate.' },
        about: {
            tag: 'Sobre Nosotros', title: 'Quiénes somos', desc: 'Conocé al equipo detrás de la transformación digital del real estate', yearsExp: 'Años de experiencia', study: 'Estudio',
            members: [{ role: 'Fundador', quote: '"Creamos Arqy porque el real estate necesitaba una infraestructura digital que conecte capital, construcción y comunidad en una única fuente de verdad."', study: 'Finanzas' }, { role: 'Fundador', quote: '"Nuestra misión es profesionalizar una industria que durante décadas operó con herramientas del siglo pasado. Arqy es el sistema operativo que lo cambia todo."', study: 'Finanzas' }],
        },
        cta: {
            title: 'El futuro del Real Estate no se espera, se construye.', desc: 'Profesionaliza cada etapa de tu negocio inmobiliario con la infraestructura digital más potente del mercado. Deja atrás la fragmentación y sé parte de la red Arqy.',
            cta1: 'Hablar con un Experto', cta2: 'Ver Precios',
        },
        footer: {
            brandDesc: 'Arqy es la infraestructura digital del ciclo de vida completo del activo inmobiliario. Conectamos a todos los actores de la cadena — inversores, constructoras, compradores, residentes y administradores — en una única fuente de verdad compartida.',
            productCol: 'Producto', companyCol: 'Compañía', downloadsCol: 'Descargas', ourStory: 'Nuestra historia', blog: 'Blog', contact: 'Contacto',
            copyright: '© 2026 Arqy. Todos los derechos reservados.', privacy: 'Política de privacidad', terms: 'Términos de servicio',
        },
    },
    en: {
        nav: { modules: 'Modules', serve: 'Who we serve', resources: 'Resources', pricing: 'Pricing', login: 'Sign In', cta: 'Get Started' },
        hero: {
            heading: ['The Operating System', 'of Real Estate'],
            desc: 'We are the digital infrastructure that professionalizes the industry. We unify capital, development, and community into a single shared source of truth.',
            cta1: 'Request Access', cta2: 'Explore Ecosystem',
        },
        pain: {
            heading1: 'Where is your growth stalling?', heading2: 'The Impact of Operational Chaos',
            desc: 'We identify the critical friction points limiting your profitability, transparency, and scalability in the real estate market.',
            columns: [
                { cards: [{ title: 'Margin Leakage', desc: 'Financial deviations detected too late to correct, due to a lack of real-time visibility.' }, { title: 'Static Schedules', desc: 'Plans that fail to reflect the dynamic reality and unforeseen challenges on the ground.' }, { title: 'Costly Rework', desc: 'Expensive errors resulting from instructions lost in informal communication channels.' }, { title: 'Technical Opacity', desc: 'No real traceability in progress certifications or the quality of installed materials.' }] },
                { cards: [{ title: 'Buyer Anxiety', desc: 'A complete disconnect between clients and the actual progress on their unit under construction.' }, { title: 'Blind Inventory', desc: 'Outdated commercial stock that leads to duplicate sales or missed opportunities.' }, { title: 'Unsupported Pre-sales', desc: 'Sales commitments based on commercial projections, not on certified technical milestones.' }, { title: 'Slow Closings', desc: 'Scattered technical documentation that delays signing contracts, deeds, and final agreements.' }] },
                { cards: [{ title: 'Community Silence', desc: 'Residents with no voice or digital tools in decisions that affect their living environment.' }, { title: 'Amenity Friction', desc: 'Analog, slow, and opaque processes for booking shared spaces and common areas.' }, { title: 'Neighbor Disconnect', desc: 'Buildings that function as isolated structures, without a connected community network.' }, { title: 'Poor After-sale Experience', desc: 'Defect reports and complaints lost due to the lack of a centralized, professional channel.' }] },
                { cards: [{ title: 'Capital Exclusion', desc: 'Potential investors locked out of the market by excessively high financial barriers to entry.' }, { title: 'Blind Investment', desc: 'Capital exposed to subjective manual reports with no real-time on-site verification.' }, { title: 'Lack of Liquidity', desc: 'Real estate investments trapped in rigid, slow, and inflexible exit cycles.' }, { title: 'Systemic Distrust', desc: 'Investors who hesitate due to a lack of full transparency on how their capital is being used.' }] },
            ],
        },
        build: {
            tag: 'Products', title1: 'The Turning Point: Where Chaos Becomes', titleHighlight: 'Growth',
            desc: "Leave fragmentation behind and take control of your business. Arqy sets the new standard of trust: an architecture designed to professionalize construction execution, certify asset commercialization, streamline capital access, and elevate community living with intelligent administration. It's time to scale your vision with a systemic transparency the market has never seen. Ready for the next level?",
            buildTitle: 'Arqy Build: Total Control', buildDesc: 'We digitize field and financial engineering. Real-time tracking of every task, cost, and deviation to ensure return on investment.',
            buildFeatures: ['Schedule synced with physical construction', 'Real-time financial deviation alerts', 'Budget vs. actual dashboard'],
            learnMore: 'Learn More', timelineTitle: 'Real-Time Sync: Your Project in Motion.',
            timelineDesc: 'Overcome the uncertainty of traditional management. Arqy Build lets you visualize simultaneous tasks, detect bottlenecks before they happen, and ensure every team is aligned with the actual pace of execution.',
            projectTimeline: 'Project timeline', teamLabel: 'Team:',
            weeks: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7'],
            tasks: ['Earthworks', 'Foundation Slabs', 'Level 1 Structure', 'Plumbing Installations', 'Slab Pour'],
            financialTitle: 'Financial Dashboard', financialDesc: 'Real-time budget monitoring and cost distribution by construction phase.',
            totalBudget: 'TOTAL BUDGET', currentDeviation: 'CURRENT DEVIATION',
            legend: ['Sales', 'Advance', 'Construction', 'Operations', 'Other'], netBalance: 'Net balance:',
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        state: {
            title: 'Arqy State: Marketplace with Full Traceability.', desc: 'Verified units with real history. Buyers access construction evidence and legal status in a single click.',
            learnMore: 'Coming Soon',
            bullets: ['Pre-sale Transparency: Access real construction history and certified delivery schedules directly tied to physical progress on site.', 'Dynamic Inventory: Live availability for brokers and buyers, with the ability to digitally reserve units and instantly access all technical documentation.', 'Certified Evidence: View progress through historical photos and videos that guarantee material quality and structural processes before delivery.'],
        },
        home: {
            bubble1Title: 'HOA vote initiated', bubble2: '🙋 Hey neighbors, does anyone know what time the common room opens today?', bubble3: '🕘 Zoom scheduled for 9:15',
            title: 'Arqy Home: Your Building is a Social Network.', desc: "Smart management for residents. Vote, book, and access your home's technical records — all from a single digital platform.",
            features: ['Verified HOA Voting', 'Smart Amenity Booking', 'Remote Access to Technical Records'], learnMore: 'Coming Soon',
        },
        management: {
            title: 'Arqy Management', desc: 'Smart building management. Coordinate vendors, manage expenses, and connect your team from one place with IoT and artificial intelligence.',
            learnMore: 'Coming Soon', controlTitle: 'Your building, under control.',
            controlDesc: "Maximize the property's useful life by monitoring vital systems. We detect anomalies before they become unexpected costs, reducing maintenance fees through technical efficiency and proactive preventive maintenance.",
            energyLabel: 'Energy efficiency:', elevatorAlert: '⚠️ Elevator A:', elevatorDesc: 'Urgent preventive maintenance required. Next scheduled service: March 10th',
            marketplaceTitle: 'Service Provider Marketplace.', marketplaceDesc: 'Professionals and service providers can offer their skills directly within the Arqy ecosystem. Manage maintenance and cleaning tasks with integrated ARQY Token payments and verified ratings.',
            searchPlaceholder: 'Search for a service or provider...', services: ['Cleaning', 'Electrical Maint.', 'HVAC', 'Landscaping', 'Security', 'Transport', 'Plumbing', 'Painting', 'Locksmith'],
        },
        capital: {
            title: 'Arqy Capital: The Investment Infrastructure', desc: 'Arqy Capital is the bridge connecting capital markets with real on-the-ground execution. We eliminate financial opacity through an investment system built on verifiable data, not promises.',
            learnMore: 'Coming Soon', microTitle: 'Micro-Investment & Crowdfunding',
            microDesc: "Through the ARQY Token, anyone can fund specific projects with minimum amounts. The real estate asset serves as real collateral, and Arqy Build's traceability ensures every dollar invested is reflected in the property's physical progress.",
            tokenTitle: 'The ARQY Token Economic Cycle', tokenDesc: "The token isn't just an investment vehicle — it's the exchange currency of the entire ecosystem. From micro-investments in Capital to payments for service providers in Property Management, ARQY creates an internal economic loop that digitally appreciates the real estate asset.",
        },
        personas: {
            tag: 'REAL USERS',
            title: 'Real People, Real Solutions.',
            subtitle: 'Developers, investors, administrators, residents, and buyers. Each with their own platform, all connected to the same asset.',
            people: [{ name: 'Builders', desc: 'Assign tasks, track progress, and manage vendor records to keep your project moving forward optimally.', img: '/images/Constructor.webp' }, { name: 'Developers', desc: 'Control every stage of real estate development with real-time data and full project traceability.', img: '/images/Arquitect.webp' }, { name: 'Investors', desc: 'Access investment opportunities backed by real assets with full transparency and verifiable returns.', img: '/images/Investor.webp' }, { name: 'Administrators', desc: 'Manage buildings efficiently with monitoring tools, preventive maintenance, and direct communication.', img: '/images/Administrator.webp' }, { name: 'Residents', desc: 'Live a connected experience: bookings, votes, requests, and community — all in one place.', img: '/images/Resident.webp' }, { name: 'Buyers', desc: 'Track the real progress of your future property and make informed decisions with verified data.', img: '/images/Buyer.webp' }, { name: 'Brokers', desc: 'Access verified property and project data to provide your clients with reliable, trustworthy information.', img: '/images/Broker.webp' }, { name: 'Providers', desc: 'Offer your services in the Arqy marketplace and receive integrated payments with verified ratings.', img: '/images/Gardener.webp' }],
        },
        whyArqui: {
            title: 'Why choose Arqy?', desc: "Arqy isn't just an option — it's the new industry standard. Our proposition is unique; no other platform on the market can unify the complete real estate lifecycle in a single operating system. We've moved from managing tasks to managing trust.",
            cards: [{ title: 'The Single Source of Truth', desc: 'Unlike fragmented tools, Arqy connects all stakeholders in a unified record system where transparency is automatic, eliminating manual reports and subjective data.' }, { title: 'Unprecedented Scalability', desc: 'Our operational infrastructure lets you triple your project management capacity with the same administrative structure, turning growth chaos into a competitive advantage.' }, { title: 'Real Value Certification', desc: 'We are the only ones who transform internal management into a commercial asset, giving each unit a certified technical history that increases its resale value and buyer confidence.' }, { title: 'Full Asset Continuity', desc: 'Arqy is the only ecosystem that accompanies a property from the initial investment to decades of community operation, permanently protecting its technical records and building plans.' }, { title: 'Agile Capital Infrastructure', desc: 'We democratize market access through a tokenized economic loop that guarantees investor security and immediate liquidity to developers, backed by real assets.' }],
        },
        ecosystem: { title: 'The Ecosystem That Connects Everything', desc: 'Five interconnected modules covering the complete real estate lifecycle.' },
        about: {
            tag: 'About Us', title: 'Who We Are', desc: 'Meet the team behind the digital transformation of real estate', yearsExp: 'Years of experience', study: 'Studies',
            members: [{ role: 'Co-Founder', quote: '"We built Arqy because real estate needed a digital infrastructure that connects capital, construction, and community into a single source of truth."', study: 'Finance' }, { role: 'Co-Founder', quote: '"Our mission is to professionalize an industry that for decades operated with last century\'s tools. Arqy is the operating system that changes everything."', study: 'Finance' }],
        },
        cta: {
            title: "The future of Real Estate isn't waited for — it's built.", desc: 'Professionalize every stage of your real estate business with the most powerful digital infrastructure on the market. Leave fragmentation behind and become part of the Arqy network.',
            cta1: 'Talk to an Expert', cta2: 'See Pricing',
        },
        footer: {
            brandDesc: 'Arqy is the digital infrastructure for the complete lifecycle of real estate assets. We connect every stakeholder in the chain — investors, builders, buyers, residents, and administrators — in a single shared source of truth.',
            productCol: 'Product', companyCol: 'Company', downloadsCol: 'Downloads', ourStory: 'Our Story', blog: 'Blog', contact: 'Contact',
            copyright: '© 2026 Arqy. All rights reserved.', privacy: 'Privacy Policy', terms: 'Terms of Service',
        },
    },
};

const LangContext = React.createContext('es');
const useT = () => TRANSLATIONS[React.useContext(LangContext)];

const PAIN_ICONS = [
    { icon: (<svg className="w-8 h-8" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#EF4444" opacity="0.12" /><path d="M12 28l5-10 5 7 6-13" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>), direction: 1 },
    { icon: (<svg className="w-8 h-8" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#20316d" opacity="0.12" /><path d="M20 12v16M14 20h12" stroke="#20316d" strokeWidth="2.5" strokeLinecap="round" /><circle cx="20" cy="20" r="9" stroke="#20316d" strokeWidth="2" opacity="0.4" /></svg>), direction: -1 },
    { icon: (<svg className="w-8 h-8" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#7B61FF" opacity="0.12" /><path d="M14 26c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#7B61FF" strokeWidth="2.5" strokeLinecap="round" /><circle cx="20" cy="16" r="4" stroke="#7B61FF" strokeWidth="2.5" /></svg>), direction: 1 },
    { icon: (<svg className="w-8 h-8" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#F59E0B" opacity="0.12" /><path d="M20 12v4M20 24v4M28 20h-4M16 20h-4" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" /><circle cx="20" cy="20" r="5" stroke="#F59E0B" strokeWidth="2.5" /></svg>), direction: -1 },
];

const TEAM_STATIC = [
    { name: 'Juan Devera', experience: '10', img: '/images/Juan_devera_ceo.webp' },
    { name: 'Luciano Reca', experience: '7', img: '/images/Luciano_Reca.webp' },
];

const Navbar = ({ lang, setLang }) => {
    const [scrolled, setScrolled] = React.useState(false);
    const [navHidden, setNavHidden] = React.useState(false);
    const [modulesOpen, setModulesOpen] = React.useState(false);
    const [resourcesOpen, setResourcesOpen] = React.useState(false);
    const closeTimeoutRef = useRef(null);
    const resourcesTimeoutRef = useRef(null);
    const lastScrollY = useRef(0);
    const t = TRANSLATIONS[lang].nav;

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrolled(currentY > 50);
            if (currentY > lastScrollY.current && currentY > 80) {
                setNavHidden(true);
            } else {
                setNavHidden(false);
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleModulesEnter = useCallback(() => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setResourcesOpen(false);
        setModulesOpen(true);
    }, []);

    const handleModulesLeave = useCallback(() => {
        closeTimeoutRef.current = setTimeout(() => setModulesOpen(false), 150);
    }, []);

    const handleResourcesEnter = useCallback(() => {
        if (resourcesTimeoutRef.current) clearTimeout(resourcesTimeoutRef.current);
        setModulesOpen(false);
        setResourcesOpen(true);
    }, []);

    const handleResourcesLeave = useCallback(() => {
        resourcesTimeoutRef.current = setTimeout(() => setResourcesOpen(false), 150);
    }, []);

    const modules = [
        {
            id: 'build',
            name: 'Arqy Build',
            tagline: lang === 'es' ? 'Control Total de Obra' : 'Total Construction Control',
            desc: lang === 'es' ? 'Digitaliza la ingeniería de campo y financiera con seguimiento en tiempo real.' : 'Digitize field and financial engineering with real-time tracking.',
            icon: Building2,
            color: '#0051FF',
            bgColor: '#EEF3FF',
            features: lang === 'es' ? ['Cronograma en tiempo real', 'Dashboard financiero', 'Gestión de equipos'] : ['Real-time timeline', 'Financial dashboard', 'Team management'],
        },
        {
            id: 'state',
            name: 'Arqy State',
            tagline: lang === 'es' ? 'Marketplace con Trazabilidad' : 'Marketplace with Traceability',
            desc: lang === 'es' ? 'Unidades verificadas con historial real y evidencia certificada.' : 'Verified units with real history and certified evidence.',
            icon: Key,
            color: '#7B61FF',
            bgColor: '#F3F0FF',
            features: lang === 'es' ? ['Inventario dinámico', 'Evidencia certificada', 'Contratos digitales'] : ['Dynamic inventory', 'Certified evidence', 'Digital contracts'],
        },
        {
            id: 'home',
            name: 'Arqy Home',
            tagline: lang === 'es' ? 'Tu Edificio, Tu Red Social' : 'Your Building, Your Network',
            desc: lang === 'es' ? 'Gestión inteligente para residentes: votá, reservá y conectate.' : 'Smart management for residents: vote, book, and connect.',
            icon: Home,
            color: '#10B981',
            bgColor: '#ECFDF5',
            features: lang === 'es' ? ['Votaciones de consorcio', 'Reserva de amenities', 'Comunidad conectada'] : ['HOA voting', 'Amenity booking', 'Connected community'],
        },
        {
            id: 'management',
            name: 'Arqy Management',
            tagline: lang === 'es' ? 'Gestión Inteligente del Edificio' : 'Smart Building Management',
            desc: lang === 'es' ? 'Coordiná proveedores y monitoreá sistemas vitales con IoT.' : 'Coordinate vendors and monitor vital systems with IoT.',
            icon: Settings,
            color: '#F59E0B',
            bgColor: '#FFFBEB',
            features: lang === 'es' ? ['Monitoreo IoT', 'Marketplace de proveedores', 'Mantenimiento preventivo'] : ['IoT monitoring', 'Provider marketplace', 'Preventive maintenance'],
        },
        {
            id: 'capital',
            name: 'Arqy Capital',
            tagline: lang === 'es' ? 'Infraestructura de Inversión' : 'Investment Infrastructure',
            desc: lang === 'es' ? 'Conecta el mercado de capitales con la ejecución real en el terreno.' : 'Connect capital markets with real on-the-ground execution.',
            icon: Wallet,
            color: '#0D9488',
            bgColor: '#F0FDFA',
            features: lang === 'es' ? ['Token ARQY', 'Micro-inversión', 'Liquidez digital'] : ['ARQY Token', 'Micro-investment', 'Digital liquidity'],
        },
    ];

    const comingSoonLabel = lang === 'es' ? 'Próximamente' : 'Coming soon';

    return (
        <div className="fixed left-1/2 -translate-x-1/2 z-[100] max-w-[1400px] w-full top-4">
        <motion.div
            animate={{ y: navHidden ? '-120%' : '0%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
            <nav className={`h-[76px] mx-4 rounded-full border border-gray-200 shadow-premium transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-lg'}`}>
                <div className="h-full px-10 md:px-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/Imagotipo.png"
                            alt="Arqy Logo"
                            className="h-28 w-auto transition-transform hover:scale-105"
                        />
                    </div>

                    <div className="hidden lg:flex items-center gap-14 text-[16px] font-bold text-text-secondary">
                        <button
                            onMouseEnter={handleModulesEnter}
                            onMouseLeave={handleModulesLeave}
                            className={`relative group flex items-center gap-1.5 cursor-pointer transition-colors ${modulesOpen ? 'text-lebane' : 'hover:text-lebane'}`}
                        >
                            {t.modules}
                            <motion.svg
                                className="w-3.5 h-3.5 mt-0.5"
                                viewBox="0 0 12 12"
                                fill="none"
                                animate={{ rotate: modulesOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-lebane transition-all duration-300 ${modulesOpen ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                        </button>
                        <a href="#" className="hover:text-lebane transition-colors relative group flex items-center gap-1.5 cursor-pointer">
                            {t.serve}
                            <svg className="w-3.5 h-3.5 mt-0.5" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lebane transition-all group-hover:w-full" />
                        </a>
                        <button
                            onMouseEnter={handleResourcesEnter}
                            onMouseLeave={handleResourcesLeave}
                            className={`relative group flex items-center gap-1.5 cursor-pointer transition-colors ${resourcesOpen ? 'text-lebane' : 'hover:text-lebane'}`}
                        >
                            {t.resources}
                            <motion.svg
                                className="w-3.5 h-3.5 mt-0.5"
                                viewBox="0 0 12 12"
                                fill="none"
                                animate={{ rotate: resourcesOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-lebane transition-all duration-300 ${resourcesOpen ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                        </button>
                        <Link to="/pricing" className="hover:text-lebane transition-colors relative group">
                            {t.pricing}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lebane transition-all group-hover:w-full" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Language Toggle */}
                        <div className="hidden sm:flex items-center rounded-full border border-gray-200 overflow-hidden text-[14px] font-bold">
                            <button
                                onClick={() => setLang('es')}
                                className={`px-4 py-2.5 transition-all duration-200 ${lang === 'es' ? 'bg-[#20316d] text-white' : 'text-text-primary hover:bg-gray-50'}`}
                            >
                                ES
                            </button>
                            <div className="w-px h-5 bg-gray-200" />
                            <button
                                onClick={() => setLang('en')}
                                className={`px-4 py-2.5 transition-all duration-200 ${lang === 'en' ? 'bg-[#20316d] text-white' : 'text-text-primary hover:bg-gray-50'}`}
                            >
                                EN
                            </button>
                        </div>
                        <button className="hidden sm:block text-[16px] font-bold text-text-primary px-8 py-3.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-all">
                            {t.login}
                        </button>
                        <button className="text-white font-bold px-9 py-4 rounded-full text-[16px] transition-all hover:brightness-110 active:scale-95 whitespace-nowrap" style={{ backgroundColor: '#20316d', boxShadow: '0 4px 14px rgba(32,49,109,0.25)' }}>
                            {t.cta}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Modules Mega Menu Dropdown */}
            <AnimatePresence>
                {modulesOpen && (
                    <motion.div
                        className="absolute left-4 right-4 bg-white rounded-2xl border border-gray-100 overflow-hidden"
                        style={{ top: '88px', boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)' }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        onMouseEnter={handleModulesEnter}
                        onMouseLeave={handleModulesLeave}
                    >
                        <div className="grid grid-cols-5 divide-x divide-gray-100">
                            {modules.map((mod) => {
                                return (
                                    <div key={mod.id} className="p-6 flex flex-col">
                                        {/* Module name — links to module page */}
                                        {mod.id === 'build' ? (
                                            <Link
                                                to="/build"
                                                className="font-bold text-[17px] text-gray-900 mb-1 hover:text-lebane transition-all leading-tight inline-block hover:scale-[1.04] origin-left"
                                            >
                                                {mod.name}
                                            </Link>
                                        ) : (
                                        <a
                                            href="#"
                                            onClick={e => e.preventDefault()}
                                            className="font-bold text-[17px] text-gray-900 mb-1 hover:text-lebane transition-all leading-tight inline-block hover:scale-[1.04] origin-left"
                                        >
                                            {mod.name}
                                        </a>
                                        )}

                                        {/* Tagline */}
                                        <p className="text-[13px] font-semibold mb-3 leading-tight" style={{ color: mod.color }}>
                                            {mod.tagline}
                                        </p>

                                        {/* Divider */}
                                        <div className="h-px bg-gray-100 mb-3" />

                                        {/* Features — future links to each solution page */}
                                        <div className="space-y-2.5">
                                            {mod.id === 'build' ? (
                                                mod.features.map((feature, fi) => (
                                                    <div key={fi} className="flex items-center gap-2">
                                                        <a
                                                            href="#"
                                                            onClick={e => e.preventDefault()}
                                                            className="text-[13px] text-gray-600 leading-tight hover:text-lebane transition-all inline-block hover:scale-[1.04] origin-left"
                                                        >
                                                            {feature}
                                                        </a>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#20316d] text-white whitespace-nowrap">
                                                    {comingSoonLabel}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer strip */}
                        <div className="border-t border-gray-100 bg-gray-50/80 px-6 py-3 flex items-center justify-between">
                            <span className="text-[12px] text-gray-400">
                                {lang === 'es' ? '5 módulos para cubrir el ciclo de vida completo del real estate' : '5 modules covering the complete real estate lifecycle'}
                            </span>
                            <a
                                href="#build"
                                className="flex items-center gap-1.5 text-[12px] font-semibold text-lebane hover:gap-2.5 transition-all"
                            >
                                {lang === 'es' ? 'Ver todos los módulos' : 'View all modules'}
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Resources Dropdown */}
            <AnimatePresence>
                {resourcesOpen && (
                    <motion.div
                        className="absolute left-4 right-4 bg-white rounded-2xl border border-gray-100 overflow-hidden"
                        style={{ top: '88px', boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)' }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        onMouseEnter={handleResourcesEnter}
                        onMouseLeave={handleResourcesLeave}
                    >
                        <div className="grid grid-cols-[1fr_2fr] divide-x divide-gray-100">

                            {/* Left column — nav links */}
                            <div className="p-6 flex flex-col gap-1">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                    {lang === 'es' ? 'Compañía' : 'Company'}
                                </p>
                                {[
                                    { label: lang === 'es' ? 'Sobre Nosotros' : 'About Us', desc: lang === 'es' ? 'Conocé al equipo y nuestra misión' : 'Meet the team and our mission', icon: Users, color: '#0051FF', bg: '#EEF3FF' },
                                    { label: lang === 'es' ? 'Casos de Éxito' : 'Success Cases', desc: lang === 'es' ? 'Cómo nuestros clientes crecen con Arqy' : 'How our clients grow with Arqy', icon: TrendingUp, color: '#10B981', bg: '#ECFDF5', comingSoon: true },
                                    { label: lang === 'es' ? 'Actualizaciones de la Plataforma' : 'Platform Updates', desc: lang === 'es' ? 'Novedades y mejoras del ecosistema' : 'Latest ecosystem news and improvements', icon: Activity, color: '#7B61FF', bg: '#F3F0FF' },
                                ].map(({ label, desc, icon: Icon, color, bg, comingSoon }) => (
                                    <a
                                        key={label}
                                        href="#"
                                        onClick={e => e.preventDefault()}
                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group/item"
                                    >
                                        <div className="w-8 self-stretch rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                                            <Icon className="w-4 h-4" style={{ color }} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[14px] font-semibold text-gray-900 group-hover/item:text-lebane transition-all group-hover/item:scale-[1.03] inline-block origin-left">
                                                    {label}
                                                </p>
                                                {comingSoon && (
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#20316d] text-white whitespace-nowrap">
                                                        {lang === 'es' ? 'Próximamente' : 'Coming soon'}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[12px] text-gray-500 leading-snug mt-0.5">{desc}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Right column — Blog coming soon */}
                            <div className="p-6 flex flex-col">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                    Blog
                                </p>
                                <div className="flex-1 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 flex flex-col items-center justify-center gap-3 py-10 px-8">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                        <Globe className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[15px] font-bold text-gray-700 mb-1">
                                            {lang === 'es' ? 'Artículos y guías del ecosistema' : 'Ecosystem articles & guides'}
                                        </p>
                                        <p className="text-[13px] text-gray-400">
                                            {lang === 'es' ? 'Tendencias, casos de uso y novedades del real estate digital.' : 'Trends, use cases and real estate news.'}
                                        </p>
                                    </div>
                                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#20316d] text-white">
                                        {lang === 'es' ? 'Próximamente' : 'Coming soon'}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
        </div>
    );
};

const AnimatedBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-background">
        <motion.div
            animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
                scale: [1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-lebane/5 rounded-full blur-[120px]"
        />
        <motion.div
            animate={{
                x: [0, -40, 0],
                y: [0, 60, 0],
                scale: [1, 1.05, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-violet/5 rounded-full blur-[150px]"
        />
    </div>
);

const Hero = () => {
    const t = useT().hero;
    return (
        <section className="relative w-full overflow-hidden" style={{ minHeight: '145vh' }}>
            {/* Full Background Image */}
            <img
                src="/images/High_Hero.webp"
                alt="Arqy Hero Background"
                className="absolute inset-0 w-full h-full object-cover object-top select-none hero-bg-img"
                loading="eager"
                decoding="sync"
                fetchpriority="high"
                style={{ zIndex: 0 }}
            />

            {/* Blue Glow Effect */}
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
                    zIndex: 1
                }}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full flex justify-center pt-[200px] pb-[100px]" style={{ minHeight: '100vh' }}>
                <div className="container mx-auto px-6 md:px-12 text-center max-w-[1100px]">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center"
                    >
                        {/* Heading */}
                        <h1
                            className="font-black text-white tracking-tight mb-4 max-w-[557px]"
                            style={{
                                fontSize: 'clamp(32px, 8vw, 54.4px)',
                                lineHeight: 'clamp(44px, 11vw, 96px)',
                                fontWeight: '800',
                                fontFamily: "'Plus Jakarta Sans', sans-serif"
                            }}
                        >
                            <span className="lg:whitespace-nowrap">{t.heading[0]}</span>
                            <br />
                            <span className="lg:whitespace-nowrap">{t.heading[1]}</span>
                        </h1>

                        {/* Description */}
                        <p
                            className="text-white max-w-[587px] mb-[26px]"
                            style={{
                                fontSize: 'clamp(15px, 4vw, 19px)',
                                lineHeight: 'clamp(24px, 5.5vw, 32px)',
                                fontWeight: '800',
                                opacity: '0.8',
                                fontFamily: "'Inter', sans-serif"
                            }}
                        >
                            {t.desc}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-[23px]">
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
                                className="bg-[#20316d] text-white font-bold rounded-full transition-all hover:brightness-110 active:scale-95"
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    lineHeight: '28px',
                                    width: '238px',
                                    height: '76px',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    boxShadow: '0px 4px 6px -4px rgba(32, 49, 109, 0.30), 0px 10px 15px -3px rgba(32, 49, 109, 0.25)'
                                }}
                            >
                                {t.cta1}
                            </button>
                            <button
                                onClick={() => document.getElementById('build')?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-white font-bold rounded-full flex items-center justify-center gap-3 transition-all active:scale-95 group"
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    lineHeight: '28px',
                                    width: '234px',
                                    height: '78px',
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    background: 'rgba(255, 255, 255, 0.12)',
                                    backdropFilter: 'blur(24px)',
                                    WebkitBackdropFilter: 'blur(24px)',
                                    border: '1px solid rgba(255, 255, 255, 0.45)',
                                    boxShadow: '0 4px 24px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.3)'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                            >
                                {t.cta2}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};


const columnOffsets = [0, 40, -20, 50];

const ScrollColumn = ({ column, scrollY, sectionTop, index }) => {
    const offset = useTransform(
        scrollY,
        [sectionTop - 400, sectionTop + 800],
        [column.direction * 40, column.direction * -40]
    );
    const smoothOffset = useSpring(offset, { stiffness: 80, damping: 30 });

    return (
        <div className="flex-1 min-w-0" style={{ paddingTop: `${columnOffsets[index]}px` }}>
            <motion.div
                className="flex flex-col gap-4"
                style={{ y: smoothOffset }}
            >
                {column.cards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                        {i === 0 && (
                            <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mb-4">
                                {column.icon}
                            </div>
                        )}
                        <h4 className="text-[16px] font-bold text-[#111827] mb-2 leading-tight">{card.title}</h4>
                        <p className="text-[13px] text-[#6B7280] leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const PainCarouselRow = ({ column, direction, duration = 25 }) => {
    const cards = column.cards;
    // Duplicate cards for seamless loop
    const doubled = [...cards, ...cards];
    return (
        <div className="overflow-hidden w-full">
            <motion.div
                className="flex gap-4"
                animate={{ x: direction === 1 ? ['0%', '-50%'] : ['-50%', '0%'] }}
                transition={{ x: { repeat: Infinity, repeatType: 'loop', duration, ease: 'linear' } }}
                style={{ width: 'max-content' }}
            >
                {doubled.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm flex-shrink-0"
                        style={{ width: '260px' }}
                    >
                        {i % cards.length === 0 && (
                            <div className="w-10 h-10 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mb-3">
                                {column.icon}
                            </div>
                        )}
                        <h4 className="text-[15px] font-bold text-[#111827] mb-1.5 leading-tight">{card.title}</h4>
                        <p className="text-[13px] text-[#6B7280] leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const PainPointsGrid = () => {
    const t = useT().pain;
    const sectionRef = useRef(null);
    const { scrollY } = useScroll();
    const [sectionTop, setSectionTop] = useState(0);

    useEffect(() => {
        const updateTop = () => {
            if (sectionRef.current) {
                setSectionTop(sectionRef.current.offsetTop);
            }
        };
        updateTop();
        window.addEventListener('resize', updateTop);
        return () => window.removeEventListener('resize', updateTop);
    }, []);

    const painColumns = PAIN_ICONS.map((iconData, i) => ({
        ...iconData,
        cards: t.columns[i].cards,
    }));

    return (
        <section ref={sectionRef} className="py-28 bg-[#FBFBFE] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-[32px] md:text-[48px] font-extrabold mb-6 text-[#111827] tracking-tight">
                        {t.heading1}
                        <br />
                        {t.heading2}
                    </h2>
                    <p className="text-[18px] text-[#6B7280] max-w-3xl mx-auto" style={{ opacity: 0.8 }}>
                        {t.desc}
                    </p>
                </div>
            </div>

            {/* Desktop: vertical scroll columns */}
            <div className="hidden lg:flex gap-5 max-w-7xl mx-auto px-6">
                {painColumns.map((col, i) => (
                    <ScrollColumn key={i} column={col} scrollY={scrollY} sectionTop={sectionTop} index={i} />
                ))}
            </div>

            {/* Mobile/Tablet: horizontal auto-scrolling rows */}
            <div className="lg:hidden flex flex-col gap-4">
                {painColumns.map((col, i) => (
                    <PainCarouselRow
                        key={i}
                        column={col}
                        direction={i % 2 === 0 ? 1 : -1}
                        duration={30 + i * 3}
                    />
                ))}
            </div>
        </section>
    );
};

const StateImageReveal = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Expand top+bottom as user scrolls through the sticky container
    const clipPath = useTransform(
        scrollYProgress,
        [0, 0.8, 1],
        [
            "inset(20% 0 20% 0)",
            "inset(0% 0 0% 0)",
            "inset(0% 0 0% 0)",
        ]
    );

    return (
        // w-screen + left-1/2 -translate-x-1/2 on the outer container for full bleed
        <div ref={containerRef} className="w-screen relative left-1/2 -translate-x-1/2 bg-white h-[120vh] lg:h-[200vh]">
            {/* Sticky wrapper — no width manipulation needed, parent is already full-width */}
            <div className="sticky top-0 overflow-hidden">
                <motion.img
                    src="/images/Arqui_State.webp"
                    alt="Arqy State"
                    className="w-full h-auto block select-none"
                    style={{ clipPath }}
                    loading="eager"
                    decoding="sync"
                />
            </div>
        </div>
    );
};

const BuildSection = () => {
    const t = useT().build;
    const MONTH_DATA = [
        { income: [40, 15, 5], expenses: [-15, -8, -5] },
        { income: [15, 10, 5], expenses: [-12, -10, -3] },
        { income: [35, 20, 8], expenses: [-25, -15, -8] },
        { income: [25, 12, 6], expenses: [-30, -20, -15] },
        { income: [20, 15, 8], expenses: [-18, -12, -8] },
        { income: [28, 18, 10], expenses: [-22, -15, -10] },
        { income: [22, 15, 8], expenses: [-20, -15, -10] },
    ];
    return (
        <section id="build" className="py-32 px-6 bg-white relative overflow-hidden">
            {/* Header Section */}
            <div className="max-w-5xl mx-auto text-center mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Tag */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#20316d]/[0.10] border border-[#20316d]/[0.20] rounded-full mb-8">
                        <div className="w-2 h-2 rounded-full bg-[#20316d]" />
                        <span className="text-[12px] font-bold text-[#20316d] uppercase tracking-[1.2px]">{t.tag}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-text-primary">
                        {t.title1}{' '}
                        <span className="text-primary">{t.titleHighlight}</span>
                    </h2>

                    {/* Description */}
                    <p className="text-lg text-text-secondary leading-relaxed max-w-4xl mx-auto">
                        {t.desc}
                    </p>
                </motion.div>
            </div>

            {/* Top Section - Full Width Background Image with Right Content Card */}
            {/* Mobile/Tablet: content above image, stacked — matching State section style */}
            <div className="lg:hidden mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-7xl mx-auto px-6 mb-12"
                >
                    <div className="w-12 h-1 bg-[#20316d] mb-8 rounded-full" />
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-text-primary">
                        {t.buildTitle}
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {t.buildDesc}
                    </p>
                    <ul className="space-y-5 mb-8">
                        {t.buildFeatures.map((item, i) => (
                            <li key={i} className="flex items-start gap-4 text-base font-medium" style={{ color: '#374151', fontFamily: "'Inter', sans-serif" }}>
                                <div className="w-6 h-6 bg-[#20316d]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4 text-[#20316d]" />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/build">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-[#20316d] text-white font-semibold rounded-full hover:bg-[#162350] transition-colors text-base"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 14px rgba(32,49,109,0.25)' }}
                        >
                            {t.learnMore}
                        </motion.button>
                    </Link>
                </motion.div>
                <div className="-mx-6">
                    <img
                        src="/images/Edificio.webp"
                        alt="Arqy Build"
                        className="w-full h-auto block select-none"
                        style={{ imageRendering: 'high-quality', objectFit: 'cover' }}
                        loading="eager"
                    />
                </div>
            </div>

            {/* Desktop: original overlay layout */}
            <div className="hidden lg:block w-screen relative left-1/2 -translate-x-1/2 mb-24">
                <img
                    src="/images/Edificio.webp"
                    alt="Arqy Build"
                    className="w-full h-auto block select-none"
                    style={{ imageRendering: 'high-quality', objectFit: 'cover', maxWidth: '100%' }}
                    loading="eager"
                    decoding="sync"
                />

                {/* Right Content Card — vertically centered, no shadow */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-[35%] -translate-y-1/2 right-0 bg-white flex flex-col justify-center"
                    style={{
                        width: '48%',
                        padding: '60px',
                        borderRadius: '1.5rem 0 0 1.5rem',
                    }}
                >
                    {/* Blue line */}
                    <div className="w-10 h-[3px] rounded-full mb-6" style={{ backgroundColor: '#20316d' }} />

                    <h2 className="mb-4 leading-tight text-4xl md:text-5xl font-black text-text-primary">
                        {t.buildTitle}
                    </h2>

                    <p className="text-base leading-relaxed mb-7" style={{ color: '#6B7280', fontFamily: "'Inter', sans-serif" }}>
                        {t.buildDesc}
                    </p>

                    {/* Feature list */}
                    <ul className="space-y-4 mb-8">
                        {t.buildFeatures.map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-base font-medium" style={{ color: '#374151', fontFamily: "'Inter', sans-serif" }}>
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#20316d' }} />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <Link to="/build">
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="px-8 py-4 text-white font-bold rounded-full text-base transition-all self-start"
                            style={{ backgroundColor: '#20316d', fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: '0 4px 14px rgba(32,49,109,0.25)' }}
                        >
                            {t.learnMore}
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            {/* Bottom Section - Dos Tarjetas */}
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Build Timeline Card - Más Ancha (3 columnas) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-3 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-premium"
                    >
                        {/* Title & Description - ARRIBA */}
                        <div className="mb-10">
                            <h3 className="text-3xl font-bold text-text-primary mb-4 leading-tight">
                                {t.timelineTitle}
                            </h3>
                            <p className="text-base text-text-secondary leading-relaxed max-w-4xl">
                                {t.timelineDesc}
                            </p>
                        </div>

                        {/* Project Timeline - ABAJO */}
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-text-primary">
                                {t.projectTimeline}
                            </h4>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-text-secondary mr-2">{t.teamLabel}</span>
                                <div className="flex -space-x-2">
                                    <div className="w-7 h-7 rounded-full bg-[#20316d] border-2 border-white"></div>
                                    <div className="w-7 h-7 rounded-full bg-[#5b5bff] border-2 border-white"></div>
                                    <div className="w-7 h-7 rounded-full bg-[#aebfff] border-2 border-white"></div>
                                    <div className="w-7 h-7 rounded-full bg-[#6B7280] border-2 border-white"></div>
                                    <div className="w-7 h-7 rounded-full bg-[#535353] border-2 border-white flex items-center justify-center text-white text-xs font-bold">+</div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Grid with Dates */}
                        <div className="relative">
                            {/* Date Headers */}
                            <div className="flex justify-between mb-4 px-2">
                                {t.weeks.map((date, i) => (
                                    <span key={i} className="text-xs text-text-secondary font-medium">{date}</span>
                                ))}
                            </div>

                            {/* Timeline Grid Lines */}
                            <div className="absolute inset-0 flex justify-between px-2 pointer-events-none">
                                {[...Array(7)].map((_, i) => (
                                    <div key={i} className="w-px bg-gray-200 h-full"></div>
                                ))}
                            </div>

                            {/* Timeline Bars - Construction Tasks */}
                            <div className="relative space-y-3 pt-2 pb-8">
                                {/* 1. Movimiento de Suelos - Completado */}
                                <div className="relative h-10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '30%' }}
                                        transition={{ duration: 1, delay: 0.1 }}
                                        className="absolute left-0 h-full bg-[#22C55E] rounded-xl flex items-center px-3 gap-2 shadow-md"
                                    >
                                        <span className="text-white text-xs font-semibold flex-1 truncate">{t.tasks[0]}</span>
                                        <span className="text-white text-xs font-bold">✓</span>
                                    </motion.div>
                                </div>

                                {/* 2. Plateas de Fundación - En progreso 60% */}
                                <div className="relative h-10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '40%' }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="absolute left-[25%] h-full bg-[#20316d] rounded-xl flex items-center px-3 gap-2 shadow-md"
                                    >
                                        <span className="text-white text-xs font-semibold flex-1 truncate">{t.tasks[1]}</span>
                                        <span className="text-white text-xs font-bold bg-white/20 px-2 py-0.5 rounded-md">60%</span>
                                    </motion.div>
                                </div>

                                {/* 3. Estructura Nivel 1 - En curso (superpuesta con Instalaciones) */}
                                <div className="relative h-10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '35%' }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                        className="absolute left-[50%] h-full bg-[#5b5bff] rounded-xl flex items-center px-3 gap-2 shadow-md"
                                    >
                                        <span className="text-white text-xs font-semibold flex-1 truncate">{t.tasks[2]}</span>
                                        <span className="text-white text-xs font-bold bg-white/20 px-2 py-0.5 rounded-md">45%</span>
                                    </motion.div>
                                </div>

                                {/* 4. Instalaciones Sanitarias Primarias - En curso (superpuesta) */}
                                <div className="relative h-10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '25%' }}
                                        transition={{ duration: 1, delay: 0.4 }}
                                        className="absolute left-[58%] h-full bg-[#6B7280] rounded-xl flex items-center px-3 gap-2 shadow-md"
                                    >
                                        <span className="text-white text-xs font-semibold flex-1 truncate">{t.tasks[3]}</span>
                                        <span className="text-white text-xs font-bold bg-white/20 px-2 py-0.5 rounded-md">30%</span>
                                    </motion.div>
                                </div>

                                {/* 5. Llenado de Losa - Hito Programado */}
                                <div className="relative h-10 flex items-center">
                                    {/* Vertical marker line */}
                                    <motion.div
                                        initial={{ opacity: 0, scaleY: 0 }}
                                        whileInView={{ opacity: 1, scaleY: 1 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                        className="absolute left-[72%] w-0.5 h-16 bg-[#F59E0B] -top-3"
                                        style={{ transform: 'translateX(-50%)' }}
                                    />
                                    {/* Diamond marker */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                        className="absolute left-[72%] top-1/2 w-3 h-3 bg-[#F59E0B] rotate-45 shadow-lg border-2 border-white"
                                        style={{ transform: 'translateX(-50%) translateY(-50%) rotate(45deg)' }}
                                    />
                                    {/* Label */}
                                    <span className="absolute left-[72%] top-14 text-xs font-semibold text-text-primary whitespace-nowrap" style={{ transform: 'translateX(-50%)' }}>
                                        {t.tasks[4]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Financial Dashboard Card - Más Angosta (2 columnas) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-premium"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-text-primary">{t.financialTitle}</h3>
                            <div className="w-10 h-10 bg-lebane/10 rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-lebane" />
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                            {t.financialDesc}
                        </p>

                        {/* Financial Metrics - Horizontal */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            <div className="p-4 bg-surface rounded-xl border border-gray-100">
                                <span className="text-[10px] font-black text-text-secondary uppercase block mb-1.5">{t.totalBudget}</span>
                                <div className="text-xl font-black text-lebane">$4.2M</div>
                            </div>
                            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                <span className="text-[10px] font-black text-red-400 uppercase block mb-1.5">{t.currentDeviation}</span>
                                <div className="text-xl font-black text-red-500">+12.4%</div>
                            </div>
                        </div>

                        {/* Stacked Bar Chart - Ingresos vs Egresos */}
                        <div>
                            {/* Legend */}
                            <div className="flex gap-3 mb-6 flex-wrap">
                                {['#5b5bff', '#aebfff', '#EF4444', '#6B7280', '#22C55E'].map((color, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
                                        <span className="text-[10px] text-text-secondary">{t.legend[i]}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Bar Chart Container with Y-axis */}
                            <div className="flex gap-2">
                                {/* Y-axis labels */}
                                <div className="flex flex-col justify-between text-[10px] text-text-secondary h-64">
                                    <span>$60k</span>
                                    <span>$40k</span>
                                    <span>$20k</span>
                                    <span className="font-bold">$0</span>
                                    <span>-$20k</span>
                                    <span>-$40k</span>
                                    <span>-$60k</span>
                                </div>

                                {/* Chart */}
                                <div className="relative flex-1 h-64">
                                    {/* Zero line (x-axis) */}
                                    <div className="absolute left-0 right-0 top-1/2 border-t-2 border-gray-300 z-10"></div>

                                    {/* Grid lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between">
                                        {[...Array(7)].map((_, i) => (
                                            <div key={i} className="w-full border-t border-gray-100"></div>
                                        ))}
                                    </div>

                                    {/* Bars Container */}
                                    <div className="absolute inset-0 flex items-center justify-around px-2">
                                        {MONTH_DATA.map((data, idx) => ({ ...data, label: t.months[idx] })).map((month, idx) => (
                                            <div key={idx} className="flex flex-col items-center flex-1">
                                                {/* Stacked bars */}
                                                <div className="relative w-full max-w-[40px] flex flex-col items-center">
                                                    {/* Income bars (positive) */}
                                                    <div className="flex flex-col-reverse w-full">
                                                        {month.income.map((value, i) => {
                                                            const colors = ['#5b5bff', '#aebfff', '#22C55E'];
                                                            return (
                                                                <motion.div
                                                                    key={`income-${idx}-${i}`}
                                                                    initial={{ height: 0 }}
                                                                    whileInView={{ height: `${value * 2}px` }}
                                                                    transition={{ duration: 0.6, delay: idx * 0.1 + i * 0.05 }}
                                                                    className="w-full"
                                                                    style={{ backgroundColor: colors[i] }}
                                                                />
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Expense bars (negative) */}
                                                    <div className="flex flex-col w-full">
                                                        {month.expenses.map((value, i) => {
                                                            const colors = ['#EF4444', '#6B7280', '#535353'];
                                                            return (
                                                                <motion.div
                                                                    key={`expense-${idx}-${i}`}
                                                                    initial={{ height: 0 }}
                                                                    whileInView={{ height: `${Math.abs(value) * 2}px` }}
                                                                    transition={{ duration: 0.6, delay: idx * 0.1 + i * 0.05 }}
                                                                    className="w-full"
                                                                    style={{ backgroundColor: colors[i] }}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Month label */}
                                                <span className="text-[10px] text-text-secondary mt-2">{month.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Balance indicator */}
                            <div className="mt-8 p-3 bg-green-50 rounded-lg border border-green-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-text-secondary">{t.netBalance}</span>
                                    <span className="text-sm font-black text-green-600">+$85K</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// --- Orbiting Ecosystem Component ---
const arquiModules = [
    // Inner orbit - Build, State, Capital
    { id: 'build', label: 'BUILD', icon: Database, orbitRadius: 110, size: 48, speed: 0.6, phaseShift: 0, color: '#20316d' },
    { id: 'state', label: 'STATE', icon: Globe, orbitRadius: 110, size: 48, speed: 0.6, phaseShift: (2 * Math.PI) / 3, color: '#20316d' },
    { id: 'capital', label: 'CAPITAL', icon: Wallet, orbitRadius: 110, size: 48, speed: 0.6, phaseShift: (4 * Math.PI) / 3, color: '#20316d' },
    // Outer orbit - Home, Management
    { id: 'home', label: 'HOME', icon: Home, orbitRadius: 190, size: 52, speed: -0.4, phaseShift: 0, color: '#20316d' },
    { id: 'management', label: 'MANAGEMENT', icon: Settings, orbitRadius: 190, size: 52, speed: -0.4, phaseShift: Math.PI, color: '#20316d' },
];

const OrbitingNode = memo(({ config, angle }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { orbitRadius, size, label } = config;
    const Icon = config.icon;
    const x = Math.cos(angle) * orbitRadius;
    const y = Math.sin(angle) * orbitRadius;

    return (
        <div
            className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
            style={{ width: `${size}px`, height: `${size}px`, transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`, zIndex: isHovered ? 20 : 10 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`relative w-full h-full p-3 bg-white backdrop-blur-sm rounded-2xl flex items-center justify-center border border-[#E5E7EB] transition-all duration-300 cursor-pointer ${isHovered ? 'scale-125 shadow-2xl border-[#20316d]/30' : 'shadow-lg hover:shadow-xl'}`}
                style={{ boxShadow: isHovered ? '0 0 30px rgba(13,13,169,0.2), 0 0 60px rgba(13,13,169,0.1)' : undefined }}>
                <Icon className="w-6 h-6 text-[#20316d]" />
                {isHovered && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#111827] rounded-lg text-[10px] font-bold text-white whitespace-nowrap pointer-events-none tracking-widest uppercase">
                        {label}
                    </div>
                )}
            </div>
        </div>
    );
});
OrbitingNode.displayName = 'OrbitingNode';

const OrbitingEcosystem = () => {
    const [time, setTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        let frameId;
        let last = performance.now();
        const tick = (now) => {
            const dt = (now - last) / 1000;
            last = now;
            setTime(t => t + dt);
            frameId = requestAnimationFrame(tick);
        };
        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [isPaused]);

    return (
        <div className="w-full flex items-center justify-center">
            <div
                className="relative w-[450px] h-[450px] flex items-center justify-center origin-center scale-[0.65] sm:scale-[0.85] md:scale-100"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Inner orbit path ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                    style={{ width: '220px', height: '220px' }}>
                    <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(13,13,169,0.15)', boxShadow: 'inset 0 0 20px rgba(174,191,255,0.08)' }} />
                    <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, transparent 40%, rgba(174,191,255,0.06) 70%, rgba(13,13,169,0.03) 100%)' }} />
                </div>

                {/* Outer orbit path ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                    style={{ width: '380px', height: '380px' }}>
                    <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(13,13,169,0.1)', boxShadow: 'inset 0 0 40px rgba(174,191,255,0.05)' }} />
                    <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'radial-gradient(circle, transparent 50%, rgba(174,191,255,0.05) 80%, rgba(13,13,169,0.03) 100%)', animationDelay: '1.5s' }} />
                </div>

                {/* Central Arqui Logo */}
                <div className="w-24 h-24 bg-white rounded-[1.5rem] flex items-center justify-center z-10 relative shadow-2xl border-2 border-[#E5E7EB]">
                    <img src="/images/Isotipo.png" alt="Arqy" className="w-16 h-16 object-contain" />
                </div>

                {/* Orbiting module nodes */}
                {arquiModules.map((config) => {
                    const angle = time * config.speed + config.phaseShift;
                    return <OrbitingNode key={config.id} config={config} angle={angle} />;
                })}
            </div>
        </div>
    );
};


const AboutUsSection = () => {
    const t = useT().about;
    const [activeIndex, setActiveIndex] = useState(0);
    const staticData = TEAM_STATIC[activeIndex];
    const member = t.members[activeIndex];

    return (
        <section className="py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#20316d]/[0.10] border border-[#20316d]/[0.20] rounded-full mb-6">
                        <div className="w-2 h-2 rounded-full bg-[#20316d]" />
                        <span className="text-[12px] font-bold text-[#20316d] uppercase tracking-[1.2px]">{t.tag}</span>
                    </div>
                    <h2 className="text-[32px] md:text-[48px] font-extrabold text-[#111827] mb-4">
                        {t.title}
                    </h2>
                    <p className="text-[16px] text-[#6B7280] max-w-2xl mx-auto">
                        {t.desc}
                    </p>
                </div>

                {/* Mobile/Tablet Layout */}
                <div className="lg:hidden">
                    {/* Name tabs */}
                    <div className="flex gap-4 mb-8">
                        {TEAM_STATIC.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`px-4 py-2 rounded-full text-[14px] font-bold transition-all duration-300 ${i === activeIndex ? 'bg-[#20316d] text-white' : 'bg-gray-100 text-[#6B7280]'}`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>

                    {/* Top row: photo left (45%) + quote right (55%) */}
                    <div className="flex gap-4 mb-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="w-[42%] flex-shrink-0 aspect-[3/4] rounded-xl overflow-hidden bg-[#E5E7EB]"
                            >
                                <img
                                    src={staticData.img}
                                    alt={staticData.name}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.4 }}
                                className="bg-[#aebfff]/20 rounded-xl p-5 flex-1 flex items-center"
                            >
                                <p className="text-[16px] sm:text-[18px] font-semibold text-[#111827] leading-relaxed">
                                    {member.quote}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom row: person info side by side */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="flex items-center gap-6"
                        >
                            <div>
                                <h4 className="text-[18px] font-bold text-[#20316d]">{staticData.name}</h4>
                                <p className="text-[13px] text-[#6B7280]">{member.role}</p>
                            </div>
                            <div className="w-px h-10 bg-[#E5E7EB]" />
                            <div>
                                <span className="text-[32px] font-extrabold text-[#111827] leading-none">{staticData.experience}</span>
                                <p className="text-[12px] text-[#6B7280] mt-0.5">{t.yearsExp}</p>
                            </div>
                            <div className="w-px h-10 bg-[#E5E7EB]" />
                            <div>
                                <span className="text-[16px] font-bold text-[#111827]">{member.study}</span>
                                <p className="text-[12px] text-[#6B7280] mt-0.5">{t.study}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex flex-row gap-16 items-start">
                    {/* Left: Names List */}
                    <div className="lg:w-[280px] flex-shrink-0">
                        <div className="space-y-0">
                            {TEAM_STATIC.map((s, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`py-5 border-b border-[#E5E7EB] cursor-pointer transition-all duration-300 ${i === activeIndex ? '' : 'opacity-50 hover:opacity-75'}`}
                                >
                                    <h4 className={`text-[20px] font-bold transition-colors duration-300 ${i === activeIndex ? 'text-[#20316d]' : 'text-[#111827]'}`}>
                                        {s.name}
                                    </h4>
                                    <p className="text-[14px] text-[#6B7280] mt-1">{t.members[i].role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Center: Photo */}
                    <div className="flex-shrink-0 w-[380px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4 }}
                                className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-[#E5E7EB]"
                            >
                                <img
                                    src={staticData.img}
                                    alt={staticData.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                        const placeholder = document.createElement('span');
                                        placeholder.textContent = staticData.name.split(' ').map(n => n[0]).join('');
                                        placeholder.className = 'text-6xl font-black text-gray-400';
                                        e.target.parentElement.appendChild(placeholder);
                                    }}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right: Quote + Stats */}
                    <div className="flex-1 flex flex-col justify-between min-h-[480px]">
                        {/* Quote */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="bg-[#aebfff]/20 rounded-2xl p-10 flex-1 flex items-center"
                            >
                                <p className="text-[18px] md:text-[24px] font-semibold text-[#111827] leading-relaxed">
                                    {member.quote}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Stats */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="flex gap-12 mt-6"
                            >
                                <div>
                                    <span className="text-[48px] font-extrabold text-[#111827] leading-none">{staticData.experience}</span>
                                    <p className="text-[14px] text-[#6B7280] mt-1">{t.yearsExp}</p>
                                </div>
                                <div className="w-px bg-[#E5E7EB]" />
                                <div>
                                    <span className="text-[20px] font-bold text-[#111827] leading-tight block mt-2">{member.study}</span>
                                    <p className="text-[14px] text-[#6B7280] mt-1">{t.study}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

const App = () => {
    const containerRef = useRef(null);
    const { lang, setLang } = useLang();
    const t = TRANSLATIONS[lang];

    return (
        <LangContext.Provider value={lang}>
            <div className="min-h-screen bg-background text-text-primary selection:bg-lebane/10 selection:text-lebane overflow-x-clip">
                <SharedNavbar lang={lang} setLang={setLang} />
                <Hero />
                <PainPointsGrid />
                <BuildSection />

                {/* Arqui State: Horizontal Premium View */}
                <section id="state" className="pt-10 pb-0 bg-white overflow-hidden">
                    {/* Text Content */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        className="max-w-7xl mx-auto px-6 mb-12"
                    >
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Left: Title and Subtitle */}
                            <div className="lg:w-1/2">
                                <div className="w-12 h-1 bg-[#20316d] mb-8 rounded-full" />
                                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-text-primary">
                                    {t.state.title}
                                </h2>
                                <p className="text-lg text-text-secondary leading-relaxed mb-8">
                                    {t.state.desc}
                                </p>

                                {/* Learn More Button */}
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-[#20316d] text-white font-semibold rounded-full hover:bg-[#162350] transition-colors"
                                >
                                    {t.state.learnMore}
                                </motion.button>
                            </div>

                            {/* Right: Bullet Points */}
                            <div className="lg:w-1/2 lg:mt-11">
                                <ul className="space-y-5">
                                    {t.state.bullets.map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-base font-medium group cursor-default">
                                            <div className="w-6 h-6 bg-[#20316d]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                <CheckCircle2 className="w-4 h-4 text-[#20316d]" />
                                            </div>
                                            <span className="text-text-secondary group-hover:text-text-primary transition-colors">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                </section>

                {/* State Image — scroll reveal (outside section to avoid overflow-hidden breaking sticky) */}
                <StateImageReveal />

                {/* Arqui Home: Community App Section */}
                <section id="comunidad" className="pt-24 pb-32 bg-white relative overflow-hidden">
                    {/* Mobile/Tablet: full-width text above, then full-width image */}
                    <div className="lg:hidden">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-7xl mx-auto px-6 mb-12"
                        >
                            <div className="w-12 h-1 bg-[#20316d] mb-8 rounded-full" />
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-text-primary">
                                {t.home.title}
                            </h2>
                            <p className="text-lg text-text-secondary leading-relaxed mb-8">
                                {t.home.desc}
                            </p>
                            <ul className="space-y-5 mb-8">
                                {t.home.features.map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-base font-medium">
                                        <div className="w-6 h-6 bg-[#20316d]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-[#20316d]" />
                                        </div>
                                        <span className="text-text-secondary">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-[#20316d] text-white font-semibold rounded-full hover:bg-[#162350] transition-colors"
                            >
                                {t.home.learnMore}
                            </motion.button>
                        </motion.div>
                        <div className="relative">
                            <img src="/images/Arqui_home.png" alt="Arqy Home" className="w-full h-auto" />
                            {/* Bubble: Votacion consorcio */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bubble-float-1 absolute top-1 left-[3%] bg-white px-1.5 py-1.5 sm:px-4 sm:py-3.5 rounded-md sm:rounded-xl shadow-md sm:shadow-lg border border-gray-100 max-w-[100px] sm:max-w-[200px]"
                            >
                                <p className="text-[7px] sm:text-[12px] font-bold text-text-primary mb-0.5 sm:mb-2">{t.home.bubble1Title}</p>
                                <div className="space-y-0 sm:space-y-1">
                                    {['María González', 'Carlos Ruiz', 'Ana Martínez'].map(name => (
                                        <div key={name} className="flex items-center gap-0.5 sm:gap-2 text-[6px] sm:text-[11px] text-text-secondary">
                                            <CheckCircle2 className="w-2 h-2 sm:w-3 sm:h-3 text-green-500 flex-shrink-0" />
                                            <span>{name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                            {/* Bubble: Hola vecinos */}
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                                className="bubble-float-2 absolute top-1/2 -translate-y-1/2 right-[2%] bg-white px-1.5 py-1.5 sm:px-3 sm:py-3 rounded-md sm:rounded-xl shadow-md sm:shadow-lg border border-gray-100 max-w-[85px] sm:max-w-[180px]"
                            >
                                <p className="text-[6px] sm:text-[12px] font-semibold text-text-primary leading-snug">{t.home.bubble2}</p>
                            </motion.div>
                            {/* Bubble: Zoom reservado */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0 }}
                                className="bubble-float-3 absolute bottom-1 left-[3%] bg-primary px-1.5 py-1.5 sm:px-3 sm:py-3 rounded-md sm:rounded-xl shadow-md sm:shadow-lg max-w-[100px] sm:max-w-[200px]"
                            >
                                <p className="text-[6px] sm:text-[12px] font-bold text-white leading-snug">{t.home.bubble3}</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Desktop: original side-by-side layout */}
                    <div className="hidden lg:flex flex-row items-center gap-0">
                        <div className="lg:w-1/2 relative overflow-hidden">
                            <motion.div
                                initial={{ x: -80, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                                className="relative"
                            >
                                <img src="/images/Arqui_home.png" alt="Arqy Home" className="w-full h-auto" />

                                {/* Bubble: Votacion consorcio - arriba izquierda */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bubble-float-1 absolute top-2 left-[20%] bg-white px-4 py-3.5 rounded-xl shadow-lg border border-gray-100 max-w-[220px]"
                                >
                                    <p className="text-[13px] font-bold text-text-primary mb-2">{t.home.bubble1Title}</p>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                            <span>María González</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                            <span>Carlos Ruiz</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                            <span>Ana Martínez</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Bubble: Hola vecinos - derecha medio */}
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="bubble-float-2 absolute top-1/2 -translate-y-1/2 right-[4%] bg-white px-4 py-3.5 rounded-xl shadow-lg border border-gray-100 max-w-[210px]"
                                >
                                    <p className="text-[13px] font-semibold text-text-primary leading-snug">
                                        {t.home.bubble2}
                                    </p>
                                </motion.div>

                                {/* Bubble: Zoom reservado - abajo izquierda */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0 }}
                                    className="bubble-float-3 absolute bottom-2 left-[20%] bg-primary px-4 py-3.5 rounded-xl shadow-lg max-w-[230px]"
                                >
                                    <p className="text-[13px] font-bold text-white leading-snug">
                                        {t.home.bubble3}
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>

                        <div className="lg:w-1/2 px-6 md:px-12 lg:pl-20 lg:pr-32">
                            <div className="max-w-[550px]">
                                <div className="w-12 h-1 bg-[#20316d] mb-8 rounded-full" />
                                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-text-primary">
                                    {t.home.title}
                                </h2>
                                <p className="text-lg text-text-secondary leading-relaxed mb-8">
                                    {t.home.desc}
                                </p>
                                <ul className="space-y-6">
                                    {t.home.features.map((item, i) => (
                                        <li key={i} className="flex items-center gap-4 text-lg font-bold group hover:translate-x-1 transition-transform cursor-default">
                                            <div className="w-6 h-6 bg-[#20316d]/10 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-[#20316d]" />
                                            </div>
                                            <span className="opacity-80 group-hover:opacity-100">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-8 px-8 py-4 bg-[#20316d] text-white font-semibold rounded-full hover:bg-[#162350] transition-colors"
                                >
                                    {t.home.learnMore}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Arqui Management: Hero Banner */}
                <section className="pt-24 pb-20 bg-white relative overflow-hidden">
                    {/* Mobile/Tablet: full-width text above, then full-width image */}
                    <div className="lg:hidden">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-7xl mx-auto px-6 mb-12"
                        >
                            <div className="w-12 h-1 bg-[#20316d] mb-8 rounded-full" />
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-[#111827]">
                                {t.management.title}
                            </h2>
                            <p className="text-lg text-[#6B7280] leading-relaxed mb-8">
                                {t.management.desc}
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-[#20316d] text-white font-semibold rounded-full hover:bg-[#162350] transition-colors"
                            >
                                {t.management.learnMore}
                            </motion.button>
                        </motion.div>
                        <img
                            src="/images/Arqui_Managment.webp"
                            alt="Arqy Management"
                            className="w-full h-auto"
                        />
                    </div>

                    {/* Desktop: original side-by-side layout */}
                    <div className="hidden lg:flex flex-row items-center gap-0">
                        {/* Left: Text content */}
                        <div className="lg:w-1/2 px-6 lg:pr-12" style={{ paddingLeft: 'max(1.5rem, calc(50vw - 40rem))' }}>
                            <div className="max-w-[480px]">
                                <div className="w-12 h-1 bg-[#20316d] mb-8 rounded-full" />
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight text-[#111827]">
                                    {t.management.title}
                                </h2>
                                <p className="text-lg text-[#6B7280] leading-relaxed mb-8">
                                    {t.management.desc}
                                </p>
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-[#20316d] text-white font-semibold rounded-full hover:bg-[#162350] transition-colors"
                                >
                                    {t.management.learnMore}
                                </motion.button>
                            </div>
                        </div>

                        {/* Right: Image touching right edge */}
                        <div className="lg:w-1/2 overflow-hidden">
                            <motion.img
                                src="/images/Arqui_Managment.webp"
                                alt="Arqy Management"
                                initial={{ x: 80, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </section>

                {/* Arqui Management: Operación y Servicios */}
                <section id="management" className="pb-32 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            <motion.div
                                initial={{ y: 40, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                className="lg:col-span-3 bg-white rounded-[2rem] border border-gray-100 shadow-premium overflow-hidden flex flex-col"
                            >
                                <div className="px-8 pt-8">
                                    <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-text-primary">
                                        {t.management.controlTitle}
                                    </h3>
                                    <p className="text-lg text-text-secondary leading-relaxed">
                                        {t.management.controlDesc}
                                    </p>
                                </div>
                                <div className="relative flex-1 flex items-end mt-6 overflow-hidden">
                                    <img
                                        src="/images/Propery_Managment.webp"
                                        alt="Property Management"
                                        className="w-full block"
                                    />

                                    {/* Blue info card - right side, connected to building */}
                                    <div className="absolute top-[20%] right-1 sm:right-2 z-10 bubble-float-1">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary border-2 border-white shadow-lg flex-shrink-0" />
                                            <div className="w-4 sm:w-8 h-[2px] bg-primary flex-shrink-0" />
                                            <div className="bg-primary rounded-lg sm:rounded-xl px-2 py-1.5 sm:px-4 sm:py-3 shadow-lg">
                                                <p className="text-white text-[7px] sm:text-xs font-bold leading-tight">{t.management.energyLabel}</p>
                                                <p className="text-white text-[8px] sm:text-sm font-black">+12% este mes</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Red alert card - left side */}
                                    <div className="absolute top-[55%] left-1 sm:left-2 z-10 bubble-float-2">
                                        <div className="flex items-center flex-row-reverse">
                                            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 border-2 border-white shadow-lg flex-shrink-0" />
                                            <div className="w-4 sm:w-8 h-[2px] bg-red-500 flex-shrink-0" />
                                            <div className="bg-red-500 rounded-lg sm:rounded-xl px-2 py-1.5 sm:px-4 sm:py-3 shadow-lg max-w-[130px] sm:max-w-[210px]">
                                                <p className="text-white text-[7px] sm:text-xs font-bold leading-tight">{t.management.elevatorAlert}</p>
                                                <p className="text-white text-[6px] sm:text-[11px] leading-tight mt-0.5 sm:mt-1">{t.management.elevatorDesc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ y: 40, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-premium"
                            >
                                <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight text-text-primary">
                                    {t.management.marketplaceTitle}
                                </h3>
                                <p className="text-base text-text-secondary leading-relaxed mb-8">
                                    {t.management.marketplaceDesc}
                                </p>
                                {/* Marketplace visual - search + service cards */}
                                <div className="w-full">
                                    {/* Search bar */}
                                    <div className="flex items-center bg-surface rounded-xl px-4 py-3 border border-gray-200 mb-4">
                                        <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-400">{t.management.searchPlaceholder}</span>
                                    </div>

                                    {/* Service cards grid */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1V7" /></svg>),
                                            (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>),
                                            (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.95l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>),
                                            (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>),
                                            (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>),
                                            (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M16 17h.01M3 9h18M4 17h16a1 1 0 001-1V8a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1z" /></svg>),
                                            (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>),
                                            (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>),
                                            (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>),
                                        ].map((icon, i) => (
                                            <div key={i} className="flex flex-col items-center bg-surface rounded-xl py-3 px-2 border border-gray-100 hover:border-primary/30 transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary mb-2">
                                                    {icon}
                                                </div>
                                                <span className="text-[11px] font-semibold text-text-primary text-center leading-tight">{t.management.services[i]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Arqui Capital: Infraestructura de Inversión */}
                <section id="capital-info" className="pb-32 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        {/* Top row - Full width centered */}
                        <div className="mb-8 text-center flex flex-col items-center">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-text-primary">
                                {t.capital.title}
                            </h2>
                            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
                                {t.capital.desc}
                            </p>
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-8 px-8 py-4 text-white font-semibold rounded-full transition-colors"
                                style={{ backgroundColor: '#20316d' }}
                            >
                                {t.capital.learnMore}
                            </motion.button>
                        </div>

                    </div>

                    {/* Full-width image + cards overlay */}
                    {/* Desktop: overlay cards on image */}
                    <div className="hidden lg:block relative w-full mt-8">
                        <img
                            src="/images/Capital.png"
                            alt="Arqy Capital"
                            className="w-full h-auto block"
                        />
                        <div className="absolute inset-0 flex items-center justify-end">
                            <div className="flex flex-col gap-6 w-full max-w-2xl">
                                <motion.div
                                    initial={{ x: 60, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    className="bg-white/90 backdrop-blur-sm pl-8 pt-8 pb-8 pr-8 rounded-l-[2rem] border-l border-t border-b border-gray-100 shadow-premium"
                                >
                                    <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight text-text-primary">
                                        {t.capital.microTitle}
                                    </h3>
                                    <p className="text-base text-text-secondary leading-relaxed">
                                        {t.capital.microDesc}
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ x: 60, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                    className="bg-white/90 backdrop-blur-sm pl-8 pt-8 pb-8 pr-8 rounded-l-[2rem] border-l border-t border-b border-gray-100 shadow-premium"
                                >
                                    <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight text-text-primary">
                                        {t.capital.tokenTitle}
                                    </h3>
                                    <p className="text-base text-text-secondary leading-relaxed">
                                        {t.capital.tokenDesc}
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile/Tablet: full-width image then cards side by side */}
                    <div className="lg:hidden mt-8 -mx-6">
                        <img
                            src="/images/Capital.png"
                            alt="Arqy Capital"
                            className="w-full h-auto block mb-8"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-premium"
                            >
                                <h3 className="text-xl md:text-2xl font-black mb-3 leading-tight text-text-primary">
                                    {t.capital.microTitle}
                                </h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {t.capital.microDesc}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-premium"
                            >
                                <h3 className="text-xl md:text-2xl font-black mb-3 leading-tight text-text-primary">
                                    {t.capital.tokenTitle}
                                </h3>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {t.capital.tokenDesc}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Personas Reales, Soluciones Reales */}
                <section className="py-32 bg-[#FBFBFE] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#20316d]/[0.10] border border-[#20316d]/[0.20] rounded-full mb-6">
                            <div className="w-2 h-2 rounded-full bg-[#20316d]" />
                            <span className="text-[12px] font-bold text-[#20316d] uppercase tracking-[1.2px]">{t.personas.tag}</span>
                        </div>
                        <h2 className="text-[32px] md:text-[48px] font-extrabold text-[#111827]">{t.personas.title}</h2>
                        <p className="mt-4 text-[18px] text-[#6B7280] font-normal max-w-2xl mx-auto">{t.personas.subtitle}</p>
                    </div>

                    <div className="relative py-16" id="carousel-personas">
                        <div className="flex gap-16 overflow-clip overflow-y-visible">
                            {[...Array(2)].map((_, listIdx) => (
                                <div
                                    key={listIdx}
                                    className="flex gap-16 flex-shrink-0 animate-carousel-scroll carousel-track"
                                >
                                    {t.personas.people.map((person, i) => (
                                        <div key={i} className="w-[340px] flex-shrink-0 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:z-10 cursor-pointer">
                                            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-5 bg-[#E5E7EB] carousel-pause-trigger">
                                                <img
                                                    src={person.img}
                                                    alt={person.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <h4 className="font-bold text-[22px] text-[#111827] mb-2">{person.name}</h4>
                                            <p className="text-[15px] text-[#6B7280] leading-relaxed">{person.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        {/* Fade edges */}
                        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FBFBFE] to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FBFBFE] to-transparent z-10 pointer-events-none" />
                    </div>
                </section>

                {/* ¿Por qué elegir Arqui? - Sticky scroll section */}
                <section className="px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-16 relative">
                            {/* Left: Scrollable cards */}
                            <div className="lg:w-3/5 order-2 lg:order-1 py-20 flex flex-col gap-8">
                                {[
                                    (<svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#aebfff" /><path d="M16 24l6 6 10-12" stroke="#20316d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="24" r="22" stroke="#20316d" strokeWidth="1" opacity="0.3" /></svg>),
                                    (<svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#aebfff" /><path d="M14 30l6-12 6 8 8-16" stroke="#20316d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="24" cy="24" r="22" stroke="#20316d" strokeWidth="1" opacity="0.3" /></svg>),
                                    (<svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#aebfff" /><path d="M24 14v10l7 5" stroke="#20316d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 34l-3 4M33 34l3 4" stroke="#20316d" strokeWidth="2" strokeLinecap="round" /><circle cx="24" cy="24" r="22" stroke="#20316d" strokeWidth="1" opacity="0.3" /></svg>),
                                    (<svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#aebfff" /><path d="M24 12v24M18 16c0 0 0-4 6-4s6 4 6 4M18 32c0 0 0 4 6 4s6-4 6-4" stroke="#20316d" strokeWidth="3" strokeLinecap="round" /><circle cx="24" cy="24" r="22" stroke="#20316d" strokeWidth="1" opacity="0.3" /></svg>),
                                    (<svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#aebfff" /><circle cx="24" cy="22" r="8" stroke="#20316d" strokeWidth="3" /><path d="M24 30v6M20 36h8" stroke="#20316d" strokeWidth="3" strokeLinecap="round" /><circle cx="24" cy="24" r="22" stroke="#20316d" strokeWidth="1" opacity="0.3" /></svg>),
                                ].map((icon, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ y: 40, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.4 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        className="bg-white p-8 rounded-[2rem] border border-[#E5E7EB] shadow-premium hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mb-5">
                                            {icon}
                                        </div>
                                        <h3 className="text-[24px] font-semibold text-[#111827] mb-3">{t.whyArqui.cards[i].title}</h3>
                                        <p className="text-[16px] text-[#6B7280] leading-[1.65]">{t.whyArqui.cards[i].desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Right: Sticky title + description */}
                            <div className="lg:w-2/5 order-1 lg:order-2">
                                <div className="lg:sticky lg:top-28 pt-20 pb-20">
                                    <h2 className="text-[32px] md:text-[48px] font-extrabold text-[#111827] leading-tight mb-6">
                                        {t.whyArqui.title}
                                    </h2>
                                    <p className="text-[18px] text-[#6B7280] leading-[1.7]">
                                        {t.whyArqui.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ecosistema Orbiting Visualization */}
                <section className="py-32 px-6 bg-[#FBFBFE] border-t border-[#E5E7EB]">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-[32px] md:text-[48px] font-bold text-[#111827] mb-4">{t.ecosystem.title}</h2>
                        <p className="text-[16px] text-[#6B7280] mb-16 max-w-xl mx-auto">{t.ecosystem.desc}</p>

                        <OrbitingEcosystem />

                    </div>
                </section>

                {/* Sobre Nosotros */}
                <AboutUsSection />

                {/* CTA Final */}
                <section className="py-28 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #20316d 0%, #0d0da9 100%)' }}>
                    <motion.div
                        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
                        style={{ background: '#7B61FF', filter: 'blur(100px)' }}
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
                                {t.cta.title}
                            </h2>
                            <p className="text-white/65 text-[17px] mb-10">
                                {t.cta.desc}
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <motion.a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-contact-modal')); }}
                                    className="inline-flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-colors duration-200"
                                    style={{ color: '#20316d' }}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    {t.cta.cta1} <ArrowRight size={16} />
                                </motion.a>
                                <motion.a
                                    href="/pricing"
                                    className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-colors duration-200"
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    {t.cta.cta2}
                                </motion.a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <SharedFooter lang={lang} />
            </div>
        </LangContext.Provider>
    );
};

export default App;

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BracketsCurly, CalendarBlank, ChartLineUp, CheckCircle,
  Cloud, Code, Database, DeviceMobile, EnvelopeSimple, FileText, Globe, House, Lightning, List,
  LockKey, Plug, Robot, ShieldCheck, SlidersHorizontal, Stack, Strategy, TestTube,
  TrendUp, X,
} from "@phosphor-icons/react";


const products = [
  { name:"AuditScout", category:"Website intelligence", description:"A prioritized public website audit across SEO, security, performance, trust, and conversion.", problem:"Turn a public URL into a clear, prioritized action plan instead of another opaque score.", metric:"12+", label:"Public audit checks", status:"Public beta", beta:true, facts:[["12+","Public checks"],["No login","First audit"],["Prioritized","Report format"]], scope:["Product strategy","Audit engine","Web application"], href:"/work/auditscout", liveHref:"https://auditscout.vercel.app", screenshot:"/assets/products/auditscout-1200.webp", screenshotSmall:"/assets/products/auditscout-720.webp" },
  { name:"StormRadar", category:"Field operations", description:"Job-site weather intelligence that helps contractors understand when conditions are workable.", problem:"Translate fast-changing weather feeds into a decision a field crew can act on.", metric:"24/7", label:"Weather monitoring", status:"Live product", beta:false, facts:[["24/7","Monitoring"],["4","Trusted feeds"],["Contractors","Primary user"]], scope:["Operational UX","Weather data","Web application"], href:"/work/stormradar", liveHref:"https://stormradar.vercel.app", screenshot:"/assets/products/stormradar-1200.webp", screenshotSmall:"/assets/products/stormradar-720.webp" },
  { name:"WIYW", category:"Water intelligence", description:"Plain-language Florida drinking-water reports searchable by city, ZIP code, or utility.", problem:"Make fragmented public water-quality information understandable before a household chooses what to do next.", metric:"3", label:"Search entry points", status:"Live product", beta:false, facts:[["3","Search modes"],["Florida","Coverage"],["Public data","Sources"]], scope:["Data product","Public information","Content system"], href:"/work/wiyw", liveHref:"https://floridawiyw.com", screenshot:"/assets/products/wiyw-1200.webp", screenshotSmall:"/assets/products/wiyw-720.webp" },
  { name:"DeedScout", category:"Property intelligence", description:"Florida tax-deed and public-record research organized county by county.", problem:"Replace courthouse scavenger hunts with a traceable research layer built around official sources.", metric:"67", label:"Counties indexed", status:"Public beta", beta:true, facts:[["67","Florida counties"],["Official","Source links"],["Cached","Permit signals"]], scope:["Research workflow","Public records","Web application"], href:"/work/deedscout", liveHref:"https://deedscout.netlify.app", screenshot:"/assets/products/deedscout-1200.webp", screenshotSmall:"/assets/products/deedscout-720.webp" },
  { name:"ClawMonitor", category:"Developer tooling", description:"A slim Windows monitor for system performance and local developer-service health.", problem:"Keep machine and local-service health visible without interrupting the work being monitored.", metric:"35", label:"Automated tests", status:"Live product", beta:false, facts:[["35","Automated tests"],["MIT","License"],["Windows","Platform"]], scope:["Desktop product","Observability","Open source"], href:"/work/clawmonitor", liveHref:"https://denrod25-del.github.io/ClawMonitor/index.html", screenshot:"/assets/products/clawmonitor-1200.webp", screenshotSmall:"/assets/products/clawmonitor-720.webp" },
  { name:"Lava Leap", category:"Game engineering", description:"A free browser-and-Android arcade climber with layered movement and live competition.", problem:"Deliver a complete, replayable arcade loop with immediate access and no required account.", metric:"10", label:"Gameplay systems", status:"Live product", beta:false, facts:[["10","Gameplay systems"],["4","Playable climbers"],["No account","Required"]], scope:["Game systems","Web distribution","Android"], href:"/work/lava-leap", liveHref:"https://lava-leap-landing.vercel.app", screenshot:"/assets/products/lava-leap-1200.webp", screenshotSmall:"/assets/products/lava-leap-720.webp" },
  { name:"ScamWatch", category:"Consumer protection", description:"Calibrated scam intelligence for suspicious links, messages, phone numbers, and email.", problem:"Give consumers a trustworthy decision point before urgency turns suspicion into harm.", metric:"4", label:"Indicator types", status:"Public beta", beta:true, facts:[["4","Indicator types"],["FL","Active alerts"],["Official","Reporting routes"]], scope:["Threat UX","Public benefit","Privacy design"], href:"/work/scamwatch", liveHref:"https://scamwatch-seven.vercel.app", screenshot:"/assets/products/scamwatch-1200.webp", screenshotSmall:"/assets/products/scamwatch-720.webp" },
];

const serviceCatalog = [
  { icon:Code, title:"Custom Software", body:"Purpose-built systems designed around your operations, users, and competitive advantage." },
  { icon:Robot, title:"AI Development", body:"Practical AI products and intelligent workflows grounded in reliable data and measurable value." },
  { icon:Lightning, title:"Automation", body:"Connected processes that remove repetitive work and keep teams focused on higher-value decisions." },
  { icon:Globe, title:"Web Development", body:"Fast, accessible web experiences that communicate trust and convert attention into action." },
  { icon:DeviceMobile, title:"Mobile Apps", body:"Native-feeling mobile products designed for clarity, speed, and dependable field use." },
  { icon:Plug, title:"API Integrations", body:"Secure integrations that make existing platforms work together as one coherent system." },
  { icon:Cloud, title:"Cloud Infrastructure", body:"Observable, scalable foundations engineered for resilience and responsible growth." },
  { icon:Strategy, title:"Technical Consulting", body:"Clear architecture and delivery guidance for consequential technology decisions." },
];

const technologies = [[BracketsCurly,"Next.js"],[Code,"React"],[BracketsCurly,"TypeScript"],[Database,"Supabase"],[Database,"PostgreSQL"],[Cloud,"Vercel"],[Robot,"OpenAI"],[Plug,"API systems"]];

const insights = [
  { slug:"systems-that-endure", category:"Engineering", number:"01", title:"What makes a software system endure?", excerpt:"The architectural and product decisions that keep software useful long after its first release.", date:"AUG 06, 2026", readTime:"7 MIN", lead:"Longevity is not a technology choice. It is the result of clear boundaries, observable behavior, disciplined change, and a product model that remains legible as the business evolves.", sections:[
    ["Design for change, not prediction","Teams rarely know the exact shape a system will need in three years. Durable architecture creates safe seams for change without distributing uncertainty everywhere. Stable contracts, explicit ownership, and reversible decisions matter more than speculative abstraction."],
    ["Make the system explain itself","A dependable product reveals its current state, the reason behind important decisions, and the path an operator can take next. Observability belongs in the interface and the architecture—not only in an engineering dashboard."],
    ["Treat simplicity as operating leverage","Every unnecessary dependency, workflow branch, and hidden rule creates future coordination cost. The strongest systems keep their essential model small enough for a senior team to understand, operate, and evolve with confidence."],
  ]},
  { slug:"ai-that-earns-trust", category:"AI", number:"02", title:"Building AI features that earn operational trust", excerpt:"Move beyond impressive demos with bounded behavior, visible confidence, and accountable human decisions.", date:"JUL 28, 2026", readTime:"8 MIN", lead:"Useful AI does not ask users to trust a model blindly. It gives them enough context to understand the recommendation, verify the evidence, and intervene when judgment matters.", sections:[
    ["Start with a decision boundary","Define what the model may suggest, what it may execute, and what always requires human approval. This boundary turns a vague AI ambition into an operable product contract."],
    ["Expose evidence and uncertainty","Confidence, provenance, and relevant source material should travel with every consequential output. Users make better decisions when the system is candid about what it knows and what it inferred."],
    ["Measure the complete workflow","Model accuracy alone does not describe product value. Track correction rate, time to decision, safe escalation, adoption, and downstream outcomes across the real operating environment."],
  ]},
  { slug:"automation-that-compounds", category:"Automation", number:"03", title:"Automation should compound, not conceal", excerpt:"A practical framework for removing repetitive work without burying the exceptions teams need to see.", date:"JUL 16, 2026", readTime:"6 MIN", lead:"The best automation reduces coordination while increasing operational clarity. It makes predictable work disappear and important exceptions easier to understand.", sections:[
    ["Map the work before the tool","Observe triggers, decisions, handoffs, evidence, and failure paths before selecting technology. Automating an unclear process only makes confusion move faster."],
    ["Keep exceptions first-class","Real operations contain missing data, ambiguous ownership, and judgment-heavy cases. Design an explicit exception lane with clear status, accountability, and recovery."],
    ["Build reusable primitives","Shared intake, rules, approvals, notifications, and audit history allow each successful workflow to lower the cost of the next one."],
  ]},
  { slug:"threat-modeling-as-design", category:"Cybersecurity", number:"04", title:"Threat modeling is a product design practice", excerpt:"Security becomes more useful when risks are connected to users, workflows, and system behavior early.", date:"JUL 02, 2026", readTime:"7 MIN", lead:"Threat modeling works best before architecture hardens. It is a structured way to understand what the product protects, where trust changes, and how failure affects real people.", sections:[
    ["Model assets and actors together","Data classifications are not enough. Identify the people, services, incentives, privileges, and business consequences that surround each important asset."],
    ["Make trust boundaries visible","Authentication, third-party integrations, queues, file movement, and administrative workflows all change who or what may act. Diagram those transitions and assign ownership."],
    ["Turn findings into design decisions","A useful threat model produces concrete controls, testable requirements, monitoring signals, and accepted risks—not a document that disappears after review."],
  ]},
  { slug:"architecture-for-evolution", category:"Software Architecture", number:"05", title:"Architecture for evolution, not ceremony", excerpt:"How teams can make consequential technical decisions without creating a process that slows delivery.", date:"JUN 19, 2026", readTime:"9 MIN", lead:"Architecture is the set of decisions that determine how safely a system can change. The documentation should make those decisions easier to understand, challenge, and revise.", sections:[
    ["Record the forces, not just the answer","Capture the constraints, alternatives, tradeoffs, and evidence behind a decision. Future teams need to know when the original reasoning no longer applies."],
    ["Separate policy from implementation","Stable business rules and security policy should not be trapped inside delivery mechanisms that change frequently. Clear boundaries preserve optionality."],
    ["Review architecture through outcomes","Availability, change lead time, recovery, cost, and operator experience reveal architectural quality better than diagram complexity."],
  ]},
  { slug:"water-operations-need-context", category:"Water Technology", number:"06", title:"Water operations need context, not another dashboard", excerpt:"Connecting field signals, asset history, and response workflows into one useful operating picture.", date:"JUN 05, 2026", readTime:"8 MIN", lead:"Utilities already have data. The hard problem is translating fragmented signals into a shared understanding of risk, priority, ownership, and action.", sections:[
    ["Design around operating decisions","Begin with the choices operators make during normal and abnormal conditions. Work backward to the signals, history, and confidence needed at that moment."],
    ["Respect field constraints","Connectivity, gloves, glare, urgency, and incomplete records change what usable software looks like. Resilient mobile states and clear escalation matter more than dense visualization."],
    ["Preserve traceability","Every advisory should retain its source readings, transformations, acknowledgement, and resolution so teams can learn without losing accountability."],
  ]},
  { slug:"technology-due-diligence", category:"Business Technology", number:"07", title:"A practical technology due-diligence lens", excerpt:"Evaluate software capability through business continuity, operating risk, and the ability to change.", date:"MAY 21, 2026", readTime:"6 MIN", lead:"Technical due diligence should explain how software helps or limits the business. Code quality matters, but its consequences matter more.", sections:[
    ["Follow critical business flows","Trace revenue, customer delivery, reporting, and operational continuity through the systems that support them. This reveals concentrated risk faster than repository sampling alone."],
    ["Measure the cost of change","Deployment confidence, test coverage, ownership, environment consistency, and architectural coupling determine how quickly a strategy can become working software."],
    ["Translate risk into choices","Prioritize findings by business impact, likelihood, remediation path, and timing. Leadership needs clear options—not an undifferentiated technical backlog."],
  ]},
  { slug:"building-stormradar", category:"Development Logs", number:"08", title:"Development log: shaping StormRadar's command layer", excerpt:"Inside the product decisions that turned high-volume environmental signals into calm operational guidance.", date:"MAY 08, 2026", readTime:"5 MIN", lead:"StormRadar began with a simple question: what does a field leader need to know early enough to change the outcome? That question shaped the data model, alert logic, and interface hierarchy.", sections:[
    ["From feeds to a shared picture","We normalized forecast, observation, asset, and field-status data around regions and operating windows rather than the structure of each upstream provider."],
    ["Prioritizing the next decision","Alerts combine severity, confidence, exposure, and available lead time. The interface presents the action window before the raw signal detail."],
    ["Designing for calm under pressure","Measured spacing, restrained status color, concise language, and predictable navigation keep the command layer readable when conditions become noisy."],
  ]},
];

const siteBase = "https://symbolicdev.com";

function trackEvent(name,details={}) {
  track(name,details);
}

async function submitLead(form,kind) {
  const payload=Object.fromEntries(new FormData(form).entries());
  payload.kind=kind;
  if (["localhost","127.0.0.1"].includes(window.location.hostname)) {
    await new Promise(resolve=>window.setTimeout(resolve,500));
    return {ok:true,id:"local-preview"};
  }
  const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const data=await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(data.message || "We could not send this request. Please email us directly.");
  return data;
}

function usePageMetadata(location) {
  useEffect(()=>{
    const article=location.pathname.startsWith("/insights/") ? insights.find(item=>`/insights/${item.slug}`===location.pathname) : null;
    const product=location.pathname.startsWith("/work/") ? products.find(item=>item.href===location.pathname) : null;
    const pages={
      "/": ["Symbolic Development — Software Built to Endure","Elegant, reliable software and infrastructure engineered with purpose."],
      "/work": ["Selected Work — Symbolic Development","Explore software systems designed around consequential real-world operations."],
      "/services": ["Engineering Services — Symbolic Development","Custom software, AI, automation, mobile, cloud, integrations, and technical consulting."],
      "/insights": ["Engineering Insights — Symbolic Development","Engineering perspectives on software, AI, automation, security, architecture, and operations."],
      "/booking": ["Book a Working Session — Symbolic Development","Request a focused introductory working session with Symbolic Development."],
      "/privacy": ["Privacy — Symbolic Development","How Symbolic Development handles website and inquiry information."],
      "/terms": ["Terms — Symbolic Development","Terms governing use of the Symbolic Development website."],
    };
    const knownPage=pages[location.pathname];
    const [title,description]=article ? [`${article.title} — Symbolic Development`,article.excerpt] : product ? [`${product.name} Case Study — Symbolic Development`,product.description] : (knownPage || ["Page Not Found — Symbolic Development","The requested page could not be found."]);
    const canonical=`${siteBase}${location.pathname}`;
    const productSlug=product?.href.split("/").filter(Boolean).pop();
    const image=`${siteBase}/assets/og/${productSlug || (article?.slug==="building-stormradar" ? "stormradar" : "home")}.webp`;
    const setMeta=(selector,attribute,value)=>{ let node=document.head.querySelector(selector); if(!node){node=document.createElement("meta"); const match=selector.match(/\[(name|property)="([^"]+)"\]/); if(match) node.setAttribute(match[1],match[2]); document.head.appendChild(node);} node.setAttribute(attribute,value); };
    document.title=title;
    setMeta('meta[name="description"]',"content",description);
    setMeta('meta[property="og:title"]',"content",title);
    setMeta('meta[property="og:description"]',"content",description);
    setMeta('meta[property="og:url"]',"content",canonical);
    setMeta('meta[property="og:type"]',"content",article ? "article" : "website");
    setMeta('meta[property="og:image"]',"content",image);
    setMeta('meta[name="twitter:title"]',"content",title);
    setMeta('meta[name="twitter:description"]',"content",description);
    setMeta('meta[name="twitter:image"]',"content",image);
    setMeta('meta[name="twitter:card"]',"content","summary_large_image");
    setMeta('meta[name="robots"]',"content",article || product || knownPage ? "index, follow" : "noindex, nofollow");
    let link=document.head.querySelector('link[rel="canonical"]'); if(!link){link=document.createElement("link");link.rel="canonical";document.head.appendChild(link);} link.href=canonical;
    let script=document.getElementById("sdds-structured-data"); if(!script){script=document.createElement("script");script.id="sdds-structured-data";script.type="application/ld+json";document.head.appendChild(script);}
    script.textContent=JSON.stringify(article ? {"@context":"https://schema.org","@type":"BlogPosting",headline:article.title,description:article.excerpt,datePublished:"2026-08-06",author:{"@type":"Organization",name:"Symbolic Development"},publisher:{"@type":"Organization",name:"Symbolic Development"},mainEntityOfPage:canonical} : {"@context":"https://schema.org","@type":"WebPage",name:title,description,url:canonical,isPartOf:{"@type":"WebSite",name:"Symbolic Development",url:siteBase}});
  },[location.pathname]);
}

const systemProfiles = {
  AuditScout: {
    initials:"AK", user:"Alex Kim", team:"Security Team",
    nav:[[House,"Overview"],[SlidersHorizontal,"Controls"],[FileText,"Findings"],[TestTube,"Tests"],[Stack,"Assets"],[ChartLineUp,"Reports"],[Plug,"Integrations"]],
    metrics:[["Controls coverage","98.6%","+ 2.4%"],["Open findings","24","↓ 12%"],["Critical findings","2","↓ 33%","red"],["Tests run","1,842","+ 8%"]],
    primary:"Frameworks", rows:[["SOC 2","98.6%",98],["ISO 27001","96.1%",96],["HIPAA","92.3%",92],["PCI DSS","88.7%",88]],
    secondary:"Recent findings", events:[["Critical","S3 bucket public access","20m","critical"],["High","MFA not enforced","1h","high"],["Medium","Unused admin roles","3h","medium"]],
  },
  StormRadar: {
    initials:"RM", user:"Riley Morgan", team:"Field Operations",
    nav:[[House,"Command"],[Globe,"Radar"],[Lightning,"Storms"],[ChartLineUp,"Forecasts"],[DeviceMobile,"Field units"],[FileText,"Briefings"],[Plug,"Integrations"]],
    metrics:[["Active storm cells","12","+ 3 new"],["Field units","48","46 online"],["Median lead time","42m","+ 11m"],["Priority alerts","3","↓ 25%","red"]],
    primary:"Regional readiness", rows:[["Gulf Coast","High",94],["Mid-Atlantic","Elevated",78],["Great Lakes","Watch",64],["Northeast","Stable",42]],
    secondary:"Live advisories", events:[["Severe","Cell SR-104 intensifying","8m","critical"],["High","Route 17 flood risk","22m","high"],["Watch","Wind shift detected","41m","medium"]],
  },
  WIYW: {
    initials:"JT", user:"Jordan Tate", team:"Operations",
    nav:[[House,"Workspace"],[Lightning,"Workflows"],[FileText,"Requests"],[SlidersHorizontal,"Rules"],[Stack,"Teams"],[ChartLineUp,"Insights"],[Plug,"Connections"]],
    metrics:[["Tasks completed","8,412","+ 18%"],["Hours returned","624","+ 42h"],["Active workflows","38","+ 4"],["Exceptions","7","↓ 31%","red"]],
    primary:"Workflow health", rows:[["Customer intake","99.2%",99],["Approvals","96.8%",97],["Vendor onboarding","94.1%",94],["Weekly reporting","91.5%",92]],
    secondary:"Recent activity", events:[["Done","Contract approved","4m","medium"],["Review","Vendor needs owner","18m","high"],["Done","Report distributed","36m","medium"]],
  },
  DeedScout: {
    initials:"MS", user:"Morgan Shaw", team:"Research Team",
    nav:[[House,"Overview"],[Globe,"Search"],[FileText,"Parcels"],[Database,"Records"],[Stack,"Owners"],[ChartLineUp,"Watchlists"],[Plug,"Exports"]],
    metrics:[["Parcels indexed","2.8M","+ 42k"],["Verified matches","18,204","+ 12%"],["Counties live","126","+ 8"],["Watchlist alerts","14","↓ 9%","red"]],
    primary:"Record coverage", rows:[["Deeds","98.2%",98],["Tax records","96.7%",97],["Liens","93.4%",93],["Ownership links","89.8%",90]],
    secondary:"Recent matches", events:[["Match","New deed transfer","12m","medium"],["Alert","Owner entity changed","44m","high"],["Match","Lien released","1h","medium"]],
  },
  ClawMonitor: {
    initials:"DR", user:"Local system", team:"Developer workstation",
    nav:[[House,"Overview"],[ChartLineUp,"Performance"],[Lightning,"Processes"],[Stack,"Services"],[Database,"Storage"],[Globe,"Network"],[SlidersHorizontal,"Settings"]],
    metrics:[["CPU load","28%","4.05 GHz"],["Memory","41%","19.6 GB"],["GPU load","9%","46°C"],["Services online","3 / 4","Docker stopped","red"]],
    primary:"System health", rows:[["CPU temperature","46°C",46],["Memory pressure","41%",41],["GPU temperature","46°C",46],["Disk activity","14%",14]],
    secondary:"Developer stack", events:[["Online","OpenClaw · :18789","live","medium"],["Online","WSL · 7.9 GB","live","medium"],["Offline","Docker stopped","now","high"]],
  },
  "Lava Leap": {
    initials:"LL", user:"Climber", team:"Global arcade",
    nav:[[House,"Overview"],[TrendUp,"Leaderboards"],[Lightning,"Daily challenge"],[Stack,"Climbers"],[ShieldCheck,"Achievements"],[Globe,"Platforms"],[SlidersHorizontal,"Settings"]],
    metrics:[["Gameplay systems","10","All live"],["Playable climbers","4","Ember · Classic · Cole · Kiko"],["Platforms","2","Browser + Android"],["Account required","No","Play instantly"]],
    primary:"Game systems", rows:[["Endless climb","Live",100],["Daily challenge","Live",100],["Lava Titan","Live",100],["Global rankings","Live",100]],
    secondary:"Run signals", events:[["Live","All-time leaderboard","global","medium"],["Daily","Fresh challenge seed","today","medium"],["Open","Browser play","free","medium"]],
  },
};

function useLocation() {
  const read = () => ({ pathname:window.location.pathname, search:window.location.search, hash:window.location.hash });
  const [location,setLocation] = useState(read);
  useEffect(() => {
    const update = () => setLocation(read());
    window.addEventListener("popstate",update); window.addEventListener("sdds:navigate",update);
    return () => { window.removeEventListener("popstate",update); window.removeEventListener("sdds:navigate",update); };
  },[]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => location.hash ? document.querySelector(location.hash)?.scrollIntoView() : window.scrollTo({top:0,behavior:"instant"}));
    return () => cancelAnimationFrame(frame);
  },[location.pathname,location.hash]);
  return location;
}

function SiteLink({ href,onClick,children,...props }) {
  const internal = href.startsWith("/") || href.startsWith("#");
  const activate = (event) => {
    onClick?.(event);
    if (!internal || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const target = new URL(href,window.location.href);
    window.history.pushState({},"",`${target.pathname}${target.search}${target.hash}`);
    window.dispatchEvent(new Event("sdds:navigate"));
  };
  return <a href={href} onClick={activate} {...props}>{children}</a>;
}

function SectionLabel({ children }) { return <div className="section-label"><span>{children}</span><i /></div>; }
function ButtonLink({ href,children,primary=false,...props }) { return <SiteLink className={`button ${primary ? "button-primary" : "button-secondary"}`} href={href} {...props}><span>{children}</span><ArrowUpRight size={16} /></SiteLink>; }
function VisuallyHidden({ children }) { return <span className="visually-hidden">{children}</span>; }
function LiveProductLink({ product,className="" }) { return product.liveHref ? <SiteLink className={className} href={product.liveHref} target="_blank" rel="noopener noreferrer" onClick={()=>trackEvent("live_product_opened",{product:product.name})}>Visit live product <VisuallyHidden> (opens in new tab)</VisuallyHidden><ArrowUpRight size={17}/></SiteLink> : null; }

function usePrefersReducedMotion() {
  const [reduced,setReduced]=useState(()=>typeof window!=="undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const update=()=>setReduced(media.matches);
    update();
    media.addEventListener("change",update);
    return()=>media.removeEventListener("change",update);
  },[]);
  return reduced;
}

function Reveal({ children, className="", as:Tag="div", delay=0, stagger=false, ...props }) {
  const ref=useRef(null);
  const reduced=usePrefersReducedMotion();
  const [visible,setVisible]=useState(reduced);
  useEffect(()=>{
    if (reduced) { setVisible(true); return undefined; }
    const node=ref.current;
    if (!node) return undefined;
    const observer=new IntersectionObserver(([entry])=>{
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    },{ threshold:0.16, rootMargin:"0px 0px -8% 0px" });
    observer.observe(node);
    return()=>observer.disconnect();
  },[reduced]);
  return <Tag ref={ref} className={`reveal ${stagger ? "reveal-stagger" : ""} ${visible ? "is-visible" : ""} ${className}`.trim()} style={delay ? { "--reveal-delay":`${delay}ms` } : undefined} {...props}>{children}</Tag>;
}

function CountUp({ value, suffix="", duration=900 }) {
  const ref=useRef(null);
  const reduced=usePrefersReducedMotion();
  const raw=String(value);
  const numeric=Number(raw.replace(/[^\d.]/g,""));
  const isNumeric=Number.isFinite(numeric) && /^\d/.test(raw);
  const pad=isNumeric && raw.startsWith("0") ? raw.length : 0;
  const format=(n)=>`${pad ? String(n).padStart(pad,"0") : String(n)}${suffix}`;
  const [display,setDisplay]=useState(()=>isNumeric && !reduced ? format(0) : raw);
  useEffect(()=>{
    if (!isNumeric || reduced) {
      setDisplay(raw);
      return undefined;
    }
    const node=ref.current;
    if (!node) return undefined;
    let frame=0;
    let start=0;
    let running=false;
    const animate=(timestamp)=>{
      if (!start) start=timestamp;
      const progress=Math.min((timestamp-start)/duration,1);
      const eased=1-Math.pow(1-progress,3);
      setDisplay(format(Math.round(numeric*eased)));
      if (progress<1) frame=requestAnimationFrame(animate);
      else setDisplay(raw);
    };
    const play=()=>{
      if (running) return;
      running=true;
      start=0;
      frame=requestAnimationFrame(animate);
    };
    const inView=()=>{
      const rect=node.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.94 && rect.bottom > 0;
    };
    if (inView()) play();
    const observer=new IntersectionObserver(([entry])=>{
      if (entry.isIntersecting) {
        play();
        observer.disconnect();
      }
    },{ threshold:0.18, rootMargin:"0px 0px -6% 0px" });
    if (!running) observer.observe(node);
    return()=>{
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  },[raw,suffix,duration,isNumeric,numeric,pad,reduced]);
  return <strong ref={ref}>{display}</strong>;
}

function ProductScreenshot({ product,className="" }) {
  const hostname=new URL(product.liveHref).hostname.replace(/^www\./,"");
  return <figure className={`product-screenshot ${className}`}>
    <div className="product-screenshot-bar"><span>LIVE INTERFACE</span><span>{hostname}</span></div>
    <SiteLink href={product.liveHref} target="_blank" rel="noopener noreferrer" aria-label={`Open the live ${product.name} website in a new tab`} onClick={()=>trackEvent("product_screenshot_opened",{product:product.name})}>
      <img src={product.screenshot} srcSet={`${product.screenshotSmall} 720w, ${product.screenshot} 1200w`} sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1040px) calc(100vw - 80px), 850px" alt={`${product.name} live website homepage`} width="1200" height="750" loading="lazy" decoding="async" fetchPriority="low"/>
      <span className="product-screenshot-action">Open live product <ArrowUpRight size={16}/></span>
      <VisuallyHidden>Opens in a new tab.</VisuallyHidden>
    </SiteLink>
  </figure>;
}

function Navigation({ location }) {
  const [compact,setCompact] = useState(false); const [open,setOpen] = useState(false);
  useEffect(() => { const onScroll=()=>setCompact(window.scrollY>48); onScroll(); window.addEventListener("scroll",onScroll,{passive:true}); return()=>window.removeEventListener("scroll",onScroll); },[]);
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow=document.body.style.overflow;
    const onKeyDown=event=>{ if(event.key==="Escape") setOpen(false); };
    document.body.style.overflow="hidden";
    window.addEventListener("keydown",onKeyDown);
    return()=>{ document.body.style.overflow=previousOverflow; window.removeEventListener("keydown",onKeyDown); };
  },[open]);
  const close=()=>setOpen(false);
  const current=href=>href==="/work" ? location.pathname.startsWith("/work") : href==="/insights" ? location.pathname.startsWith("/insights") : location.pathname===href;
  return <header className={`nav-shell ${compact ? "is-compact" : ""}`}>
    <SiteLink className="wordmark" href="/" aria-label="Symbolic Development home" aria-current={location.pathname==="/" && !location.hash ? "page" : undefined}>
      <span className="brand-mark" aria-hidden="true" />
      <span>SYMBOLIC DEVELOPMENT</span>
    </SiteLink>
    <nav id="primary-navigation" className={`nav-links ${open ? "is-open" : ""}`} aria-label="Primary navigation"><SiteLink href="/work" aria-current={current("/work") ? "page" : undefined} onClick={close}>Work</SiteLink><SiteLink href="/services" aria-current={current("/services") ? "page" : undefined} onClick={close}>Services</SiteLink><SiteLink href="/#approach" aria-current={location.pathname==="/" && location.hash==="#approach" ? "location" : undefined} onClick={close}>Approach</SiteLink><SiteLink href="/insights" aria-current={current("/insights") ? "page" : undefined} onClick={close}>Insights</SiteLink><SiteLink className="mobile-cta" href="/booking" onClick={()=>{trackEvent("booking_cta_clicked",{source:"mobile_navigation"});close();}}>Book a working session</SiteLink></nav>
    <SiteLink className="nav-cta" href="/booking" onClick={()=>trackEvent("booking_cta_clicked",{source:"navigation"})}>Book a working session <ArrowUpRight size={14} /></SiteLink>
    <button type="button" className="menu-button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="primary-navigation" onClick={()=>setOpen(!open)}>{open ? <X size={22}/> : <List size={22}/>}</button>
  </header>;
}

function Hero() {
  return <section className="hero" id="top">
    <div className="hero-backdrop" aria-hidden="true">
      <img className="hero-art" src="/assets/hero-monolith-960.webp" srcSet="/assets/hero-monolith-640.webp 640w, /assets/hero-monolith-960.webp 960w, /assets/hero-monolith-1254.webp 1254w" sizes="(max-width: 900px) 60vh, min(72vh, 640px)" width="1254" height="1254" loading="eager" decoding="sync" fetchPriority="high" alt="" />
      <div className="hero-fade" />
    </div>
    <div className="hero-copy">
      <Reveal className="hero-copy-inner" stagger>
        <SectionLabel>Product + Engineering</SectionLabel>
        <h1>Software for decisions that <em>matter.</em></h1>
        <p className="hero-lead">We design and engineer operational platforms, intelligence products, and automation systems built for real-world complexity.</p>
        <div className="hero-actions">
          <ButtonLink href="/booking" primary onClick={()=>trackEvent("booking_cta_clicked",{source:"hero"})}>Book a working session</ButtonLink>
          <SiteLink className="hero-text-link" href="/work" onClick={()=>trackEvent("proof_cta_clicked",{source:"hero"})}>See the proof <ArrowRight size={16}/></SiteLink>
        </div>
        <p className="hero-signal"><span className="live-dot" aria-hidden="true" /> 07 live products · Web · Mobile · Desktop</p>
      </Reveal>
    </div>
  </section>;
}

function TrustStrip() {
  const proof=[["07","Live products"],["03","Platform surfaces"],["35","Automated tests — ClawMonitor"],["67","Florida counties — DeedScout"]];
  return <section className="trust-strip" aria-label="Company metrics">
    <div className="trust-strip-inner">
      {proof.map(([value,label],index)=>(
        <Reveal as="div" className="trust-item" key={label} delay={index*60}>
          <CountUp value={value} />
          <span>{label}</span>
        </Reveal>
      ))}
    </div>
  </section>;
}

function BuyerSituations() {
  const situations=[
    ["01","Launch a new product","Turn an opportunity into a validated product foundation, production architecture, and focused first release."],
    ["02","Modernize a system","Untangle technical and experience debt without putting daily operations at risk."],
    ["03","Automate operations","Connect fragmented workflows, approvals, data, and AI into a dependable operating layer."],
    ["04","Strengthen a team","Add senior product and engineering judgment where consequential decisions need clear ownership."],
  ];
  return <section className="buyer-situations section">
    <div className="section-heading">
      <Reveal>
        <SectionLabel>Where we create leverage</SectionLabel>
        <h2>Start with the business situation.</h2>
      </Reveal>
      <Reveal delay={120}><p>Capabilities matter when they are attached to the decision, constraint, or operating problem your team needs to solve.</p></Reveal>
    </div>
    <div className="situation-list">
      {situations.map(([number,title,body],index)=>(
        <Reveal as="div" key={number} delay={index*60} className="situation-row">
          <SiteLink href={`/booking?engagement=${encodeURIComponent(title)}`}>
            <span className="situation-idx">{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
            <span className="situation-go">Book a focused conversation <ArrowRight size={15}/></span>
          </SiteLink>
        </Reveal>
      ))}
    </div>
  </section>;
}

function EngagementModels() {
  const models=[
    ["01","Product foundation","New products and uncertain requirements","Validated scope, system architecture, interaction model, and delivery roadmap."],
    ["02","Focused build","A defined product ready for implementation","A production release delivered in visible increments with quality measured throughout."],
    ["03","System modernization","Software carrying technical or UX debt","A prioritized audit followed by targeted redesign, migration, and hardening."],
    ["04","Engineering partnership","Products needing sustained senior support","Continuous delivery, observability, and accountable technical leadership."],
  ];
  return <section className="engagement-models section">
    <Reveal className="engage-intro">
      <SectionLabel>Engagement models</SectionLabel>
      <h2>A clear way<br/>to begin.</h2>
      <p>Every engagement starts by reducing uncertainty, defining ownership, and agreeing on the evidence that will demonstrate progress.</p>
    </Reveal>
    <div className="engagement-model-list">
      {models.map(([number,title,bestFor,outcome],index)=>(
        <Reveal as="article" key={number} delay={index*60} className="engagement-model">
          <span>{number}</span>
          <div>
            <h3>{title}</h3>
            <dl>
              <dt>Best for</dt><dd>{bestFor}</dd>
              <dt>Initial outcome</dt><dd>{outcome}</dd>
            </dl>
            <SiteLink className="hero-text-link" href={`/booking?engagement=${encodeURIComponent(title)}`}>Discuss this model <ArrowRight size={15}/></SiteLink>
          </div>
        </Reveal>
      ))}
    </div>
  </section>;
}

function AuditDashboard() {
  const [active,setActive]=useState("Overview");
  const items=[[House,"Overview"],[SlidersHorizontal,"Controls"],[FileText,"Findings"],[TestTube,"Tests"],[Stack,"Assets"],[ChartLineUp,"Reports"],[Plug,"Integrations"]];
  return <div className="audit-window" aria-label="AuditScout product preview"><aside className="audit-sidebar"><div className="audit-brand"><ShieldCheck size={19}/><span>AUDITSCOUT</span></div><div className="audit-nav">{items.map(([Icon,label])=><button type="button" aria-label={label} aria-pressed={active===label} title={label} key={label} className={active===label?"active":""} onClick={()=>setActive(label)}><Icon size={15}/><span>{label}</span></button>)}</div><div className="audit-user"><span>AK</span><div><strong>Alex Kim</strong><small>Security Team</small></div></div></aside><div className="audit-main"><div className="audit-toolbar"><h2>{active}</h2><div><span>All frameworks</span><span>Last 30 days</span></div></div><div className="metric-grid"><div><small>Controls coverage</small><strong>98.6%</strong><em>+ 2.4%</em></div><div><small>Open findings</small><strong>24</strong><em>↓ 12%</em></div><div><small>Critical findings</small><strong>2</strong><em className="red">↓ 33%</em></div><div><small>Tests run</small><strong>1,842</strong><em>+ 8%</em></div></div><div className="audit-detail-grid"><div className="frameworks"><h3>Frameworks</h3>{[["SOC 2","98.6%"],["ISO 27001","96.1%"],["HIPAA","92.3%"],["PCI DSS","88.7%"]].map(([name,value],index)=><div className="framework-row" key={name}><span>{name}</span><i><b style={{width:`${[98,96,92,88][index]}%`}}/></i><small>{value}</small></div>)}</div><div className="findings"><div className="panel-title"><h3>Recent findings</h3><span>Recent activity</span></div><p><span className="severity critical">Critical</span>S3 bucket public access<small>20m</small></p><p><span className="severity high">High</span>MFA not enforced<small>1h</small></p><p><span className="severity medium">Medium</span>Unused admin roles<small>3h</small></p></div></div></div></div>;
}

function SystemDashboard({ productName }) {
  const profile = systemProfiles[productName] || systemProfiles.AuditScout;
  const [active,setActive] = useState(profile.nav[0][1]);

  useEffect(() => setActive(profile.nav[0][1]),[productName]);

  return <div className="audit-window" aria-label={`${productName} product preview`}>
    <aside className="audit-sidebar">
      <div className="audit-brand"><ShieldCheck size={19}/><span>{productName.toUpperCase()}</span></div>
      <div className="audit-nav">{profile.nav.map(([Icon,label])=><button type="button" aria-label={label} aria-pressed={active===label} title={label} key={label} className={active===label?"active":""} onClick={()=>setActive(label)}><Icon size={15}/><span>{label}</span></button>)}</div>
      <div className="audit-user"><span>{profile.initials}</span><div><strong>{profile.user}</strong><small>{profile.team}</small></div></div>
    </aside>
    <div className="audit-main">
      <div className="audit-toolbar"><h2>{active}</h2><div><span>All regions</span><span>Last 30 days</span></div></div>
      <div className="metric-grid">{profile.metrics.map(([label,value,change,tone])=><div key={label}><small>{label}</small><strong>{value}</strong><em className={tone || ""}>{change}</em></div>)}</div>
      <div className="audit-detail-grid">
        <div className="frameworks"><h3>{profile.primary}</h3>{profile.rows.map(([name,value,progress])=><div className="framework-row" key={name}><span>{name}</span><i><b style={{width:`${progress}%`}}/></i><small>{value}</small></div>)}</div>
        <div className="findings"><div className="panel-title"><h3>{profile.secondary}</h3><span>Recent activity</span></div>{profile.events.map(([severity,label,time,tone])=><p key={label}><span className={`severity ${tone}`}>{severity}</span>{label}<small>{time}</small></p>)}</div>
      </div>
    </div>
  </div>;
}

function ProductSection() {
  const [product,setProduct]=useState(products[0]);
  const [swapping,setSwapping]=useState(false);
  const railRefs=useRef([]);
  const reduced=usePrefersReducedMotion();
  const swapTimer=useRef(0);
  const selectProduct=(item,index)=>{
    if (item.name===product.name) return;
    railRefs.current[index]?.focus();
    if (reduced) { setProduct(item); return; }
    window.clearTimeout(swapTimer.current);
    setSwapping(true);
    swapTimer.current=window.setTimeout(()=>{
      setProduct(item);
      setSwapping(false);
    },220);
  };
  useEffect(()=>()=>window.clearTimeout(swapTimer.current),[]);
  const activateByIndex=index=>selectProduct(products[index],index);
  const handleRailKey=(event,index)=>{
    const keys={ArrowDown:(index+1)%products.length,ArrowUp:(index-1+products.length)%products.length,Home:0,End:products.length-1,ArrowRight:(index+1)%products.length,ArrowLeft:(index-1+products.length)%products.length};
    if(keys[event.key]===undefined) return;
    event.preventDefault();
    activateByIndex(keys[event.key]);
  };
  const selectedIndex=products.findIndex(item=>item.name===product.name);
  return <section className="product-section section" id="work">
    <div className="section-heading product-section-intro">
      <Reveal>
        <SectionLabel>Live product proof</SectionLabel>
        <h2>Working products.<br/>Visible decisions.</h2>
      </Reveal>
      <Reveal delay={120}><p>Seven working products across public information, operational intelligence, developer tooling, and game engineering.</p></Reveal>
    </div>
    <Reveal className="proof-shell">
      <div className="product-rail" role="tablist" aria-label="Featured products" aria-orientation="vertical">
        {products.map((item,index)=>(
          <button
            type="button"
            id={`product-tab-${index}`}
            role="tab"
            aria-controls="featured-product-panel"
            aria-selected={product.name===item.name}
            tabIndex={product.name===item.name?0:-1}
            ref={node=>{railRefs.current[index]=node;}}
            className={product.name===item.name?"active":""}
            onKeyDown={event=>handleRailKey(event,index)}
            onClick={()=>selectProduct(item,index)}
            key={item.name}
          >
            <span className="product-rail-index">{String(index+1).padStart(2,"0")}</span>
            <span className="product-rail-name">{item.name}</span>
            <span className="product-rail-category">{item.category}</span>
          </button>
        ))}
      </div>
      <div className={`product-preview ${swapping ? "is-swapping" : ""}`} id="featured-product-panel" role="tabpanel" aria-labelledby={`product-tab-${selectedIndex}`}>
        <ProductScreenshot product={product}/>
        <div className="product-copy">
          <div className="product-copy-main">
            <h3>
              <span>{product.name}</span>
              <span className={`status-pill ${product.beta ? "is-beta" : ""}`}><span className="live-dot" aria-hidden="true" />{product.status}</span>
            </h3>
            <p>{product.description}</p>
            <div className="product-links">
              <SiteLink className="hero-text-link" href={product.liveHref} target="_blank" rel="noopener noreferrer" onClick={()=>trackEvent("live_product_opened",{product:product.name})}>Open the live product <ArrowUpRight size={16}/></SiteLink>
              <SiteLink className="hero-text-link" href={product.href}>Read the case study <ArrowRight size={16}/></SiteLink>
            </div>
          </div>
          <div className="product-facts">
            {product.facts.map(([value,label])=>(
              <div key={`${product.name}-${label}`}><b>{value}</b><span>{label}</span></div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  </section>;
}

function ServicesPreview() {
  return <section className="services section" id="services">
    <Reveal>
      <SectionLabel>WHAT WE DO</SectionLabel>
      <div className="services-intro"><h2>Complex problems.<br/>Considered solutions.</h2><p>We partner with organizations to design, build, and evolve software that’s secure, scalable, and built to last.</p></div>
    </Reveal>
    <div className="services-grid">
      {serviceCatalog.slice(0,3).map(({icon:Icon,title,body},index)=>(
        <Reveal as="article" key={title} delay={index*90}>
          <Icon size={42} weight="thin"/>
          <div><h3>{title}</h3><p>{body}</p><SiteLink href="/services">Explore {title.toLowerCase()} <ArrowRight size={15}/></SiteLink></div>
        </Reveal>
      ))}
    </div>
  </section>;
}

function Approach() {
  const steps=[["01","Discover","Clarify goals, constraints, users, and the measure of success."],["02","Architect","Shape resilient systems, interfaces, and delivery plans."],["03","Build","Engineer in focused increments with quality visible throughout."],["04","Evolve","Measure, refine, and extend without compromising the foundation."]];
  return <section className="approach section" id="approach">
    <div className="section-heading">
      <Reveal>
        <SectionLabel>Approach</SectionLabel>
        <h2>Intent at every stage.</h2>
      </Reveal>
    </div>
    <ol className="process-timeline">
      {steps.map(([n,title,body],index)=>(
        <Reveal as="li" key={n} delay={index*80}>
          <span className="process-node" aria-hidden="true" />
          <span className="process-index">{n}</span>
          <h3>{title}</h3>
          <p>{body}</p>
        </Reveal>
      ))}
    </ol>
  </section>;
}

function Technology() {
  return <aside className="tech-strip" aria-label="Technology stack">
    <div className="tech-strip-inner">
      <span className="tech-strip-label">Built with</span>
      <ul>
        {technologies.map(([,label])=><li key={label}>{label}</li>)}
      </ul>
    </div>
  </aside>;
}

function ProductProof() {
  const items=[
    ["AuditScout","A public beta turns a URL into a prioritized report across more than twelve checks."],
    ["DeedScout","Official Florida tax-deed research organized across all sixty-seven counties."],
    ["ClawMonitor","An MIT-licensed Windows observability tool protected by thirty-five automated tests."],
    ["Lava Leap","A no-account browser and Android game with ten connected gameplay systems."],
  ];
  return <section className="product-proof section" id="insights">
    <Reveal>
      <SectionLabel>PROOF OVER PROMISES</SectionLabel>
      <h2>Working software is the credential.</h2>
      <p>Until client references are published, the strongest evidence is inspectable: live products, public source, visible product states, and grounded release facts.</p>
      <SiteLink className="text-link" href="/work">Explore all seven products <ArrowRight size={18}/></SiteLink>
    </Reveal>
    <div className="product-proof-list">
      {items.map(([name,body],index)=>(
        <Reveal as="article" key={name} delay={index*70}>
          <span>{String(index+1).padStart(2,"0")}</span>
          <div><h3>{name}</h3><p>{body}</p></div>
        </Reveal>
      ))}
    </div>
  </section>;
}

function Contact() {
  const [status,setStatus]=useState("idle"); const [error,setError]=useState(""); const [startedAt,setStartedAt]=useState(()=>Date.now());
  const send=async event=>{event.preventDefault();const form=event.currentTarget;setStatus("sending");setError("");try{await submitLead(form,"contact");trackEvent("contact_submitted");setStatus("sent");}catch(reason){trackEvent("contact_submit_failed");setError(reason.message);setStatus("error");}};
  const reset=()=>{setStatus("idle");setError("");setStartedAt(Date.now());};
  return <section className="contact section" id="contact">
    <Reveal className="contact-copy">
      <SectionLabel>DISCUSS A SYSTEM</SectionLabel>
      <h2>Bring us the<br/>difficult problem.</h2>
      <p>Share the decision, workflow, or product your team needs to improve. We’ll respond with a practical first step—not a generic sales sequence.</p>
      <div className="contact-expectation"><span>01</span><p>We review the context and identify the right engagement shape.</p><span>02</span><p>If there is a fit, we prepare a focused working session.</p><span>03</span><p>You leave with clearer options, even before a build begins.</p></div>
      <div className="contact-details"><a href="mailto:hello@symbolicdev.com">hello@symbolicdev.com</a><SiteLink href="/booking" onClick={()=>trackEvent("booking_cta_clicked",{source:"contact"})}>Request a working session <CalendarBlank size={15}/></SiteLink></div>
    </Reveal>
    <Reveal delay={120}>
      {status==="sent"?<div className="success-message" role="status"><CheckCircle size={34} weight="thin"/><h3>Context received.</h3><p>We’ll respond within one business day with a practical next step.</p><button type="button" onClick={reset}>Send another</button></div>:<form onSubmit={send}><input type="hidden" name="startedAt" value={startedAt}/><label className="form-trap" hidden aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off"/></label><div className="form-row"><label>Name<input required minLength="2" maxLength="80" name="name" autoComplete="name" placeholder="Your name"/></label><label>Email<input required type="email" maxLength="160" name="email" autoComplete="email" placeholder="you@company.com"/></label></div><label>Company <span className="optional">OPTIONAL</span><input maxLength="120" name="company" autoComplete="organization" placeholder="Company or organization"/></label><div className="form-row"><label>Project stage<select required name="stage" defaultValue=""><option value="" disabled>Select stage</option><option>Exploring an opportunity</option><option>Defining a new product</option><option>Ready to build</option><option>Modernizing an existing system</option><option>Looking for ongoing engineering support</option></select></label><label>Preferred start<select required name="timeline" defaultValue=""><option value="" disabled>Select timing</option><option>As soon as possible</option><option>Within 1–2 months</option><option>Within 3–6 months</option><option>Planning for later</option></select></label></div><div className="form-row"><label>Engagement<select required name="engagement" defaultValue=""><option value="" disabled>Select engagement</option><option>Product foundation</option><option>Focused build</option><option>System modernization</option><option>Engineering partnership</option><option>Not sure yet</option></select></label><label>Investment range<select required name="budget" defaultValue=""><option value="" disabled>Select range</option><option>Under $15k</option><option>$15k–$40k</option><option>$40k–$100k</option><option>$100k+</option><option>Need help scoping</option></select></label></div><label>What decision or system needs to improve?<textarea required minLength="20" maxLength="4000" name="message" rows="4" placeholder="Describe the current situation, the people affected, and what a successful outcome would change."/></label>{error&&<p className="form-error" role="alert">{error} <a href="mailto:hello@symbolicdev.com">Email us directly.</a></p>}<button className="button button-primary" type="submit" disabled={status==="sending"}><span>{status==="sending"?"Sending…":"Send project context"}</span><ArrowUpRight size={16}/></button><small className="form-privacy">By sending, you agree to our <SiteLink href="/privacy">privacy notice</SiteLink>.</small></form>}
    </Reveal>
  </section>;
}

function PageHero({eyebrow,title,copy,meta}) { return <section className="page-hero"><div className="reveal-section"><SectionLabel>{eyebrow}</SectionLabel><h1>{title}</h1><p>{copy}</p></div><div className="page-hero-meta"><span>{meta}</span><span>SYMBOLIC DEVELOPMENT</span></div></section>; }

function ProjectCard({product,index}) { const slug=product.href.split("/").filter(Boolean).pop(); return <article className="project-card reveal-section" id={slug}><div className="project-index">{String(index+1).padStart(2,"0")}</div><SiteLink className="project-card-visual" href={product.href} aria-label={`Read the ${product.name} case study`}><img src={product.screenshot} srcSet={`${product.screenshotSmall} 720w, ${product.screenshot} 1200w`} sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1040px) 40vw, 520px" alt={`${product.name} live product interface`} width="1200" height="750" loading="lazy" decoding="async"/></SiteLink><div className="project-card-copy"><span>{product.category}</span><h2>{product.name}</h2><p className="project-problem">{product.problem}</p><p>{product.description}</p><div className="project-scope">{product.scope.map(item=><span key={item}>{item}</span>)}</div><div className="project-proof"><strong>{product.metric}</strong><span>{product.label}</span></div><div className="project-card-links"><SiteLink href={product.href}>Read case study <ArrowRight size={18}/></SiteLink><LiveProductLink product={product} className="project-live-link"/><SiteLink href={`/booking?ref=${slug}`}>Discuss a system like {product.name} <CalendarBlank size={17}/></SiteLink></div></div></article>; }

function WorkPage() { return <main><PageHero eyebrow="SELECTED SYSTEMS" title={<>Working products.<br/>Visible decisions.</>} copy="Every project shows the operating problem, the product response, and evidence a prospective client can inspect directly." meta="WORK // 01—07"/><section className="work-proof-note section"><span>HOW TO READ THE WORK</span><p>These are independent products and public releases rather than anonymous client claims. Metrics are limited to facts visible in the live product, public source, or release documentation.</p></section><section className="project-list section">{products.map((product,index)=><ProjectCard key={product.name} product={product} index={index}/>)}</section><EngagementModels/><PhaseCTA/></main>; }

function AuditScoutCaseStudy() {
  const stack=["React","TypeScript","Node.js","PostgreSQL","Supabase","Vercel"];
  const product=products.find(item=>item.name==="AuditScout");
  return <main><section className="case-hero"><div><SiteLink className="back-link" href="/work"><ArrowLeft size={16}/> All work</SiteLink><SectionLabel>COMPLIANCE INTELLIGENCE</SectionLabel><h1>AuditScout</h1><p>Continuous audit and compliance monitoring for organizations that cannot afford uncertainty.</p><LiveProductLink product={product} className="case-live-link"/></div><div className="case-hero-stats"><div><span>Controls coverage</span><strong>98.6%</strong></div><div><span>Review velocity</span><strong>3.4×</strong></div><div><span>Critical findings</span><strong>−33%</strong></div></div></section><section className="case-dashboard section"><ProductScreenshot product={product} className="case-product-screenshot"/></section><section className="case-narrative section"><div className="case-rail"><span>01</span><SectionLabel>OVERVIEW</SectionLabel></div><div><h2>Compliance clarity without the manual chase.</h2><p>AuditScout consolidates controls, tests, evidence, assets, and findings into one continuously updated operating view. Security teams see what needs attention before review cycles become emergencies.</p></div><div className="case-rail"><span>02</span><SectionLabel>THE PROBLEM</SectionLabel></div><div><h2>Fragmented evidence created invisible risk.</h2><p>The client’s assurance process lived across spreadsheets, tickets, cloud consoles, and institutional knowledge. Preparing for an audit required weeks of manual coordination, while leadership lacked a dependable view of current exposure.</p></div><div className="case-rail"><span>03</span><SectionLabel>THE SOLUTION</SectionLabel></div><div><h2>A live control system, designed around decisions.</h2><p>We created a unified control graph, automated evidence collection, prioritized findings, and role-specific reporting. The interface keeps technical detail available without overwhelming the people accountable for action.</p></div></section><section className="architecture section"><div><SectionLabel>ARCHITECTURE</SectionLabel><h2>Observable by design.</h2><p>Every service is independently monitored, every action is traceable, and every integration degrades safely.</p></div><div className="architecture-grid"><article><Database size={26}/><span>Evidence layer</span><p>Normalized evidence and controls with durable history.</p></article><article><Plug size={26}/><span>Integration layer</span><p>Scoped connectors for cloud, identity, ticketing, and code.</p></article><article><LockKey size={26}/><span>Trust layer</span><p>Least-privilege access, encryption, and audit logging.</p></article><article><TrendUp size={26}/><span>Decision layer</span><p>Risk signals translated into clear operational priorities.</p></article></div></section><section className="case-outcome section"><div><SectionLabel>OUTCOME</SectionLabel><h2>From periodic preparation to continuous assurance.</h2></div><div className="outcome-grid"><article><strong>76%</strong><span>Less manual evidence collection</span></article><article><strong>3.4×</strong><span>Faster review cycles</span></article><article><strong>100%</strong><span>Control ownership visibility</span></article></div><div className="stack-row">{stack.map(item=><span key={item}>{item}</span>)}</div></section><PhaseCTA/></main>;
}

const caseStudyDetails = {
  auditscout: {
    name:"AuditScout", eyebrow:"WEBSITE INTELLIGENCE",
    description:"A public website-audit experience that turns a URL into a prioritized scorecard and practical next actions.",
    status:"Public beta", platform:"Web application", engagement:"Independent product build", deliverables:"Strategy · UX · audit engine · launch",
    heroStats:[["Public checks","12+"],["First audit","No login"],["Report format","Prioritized"]],
    narrative:[
      ["OVERVIEW","A useful audit begins with priority, not volume.","AuditScout reviews public website signals across SEO, security, performance, trust, and conversion, then organizes findings by likely impact instead of handing the user an undifferentiated list."],
      ["THE PROBLEM","Most automated audits create more interpretation work.","A score alone does not tell an owner what to fix first, why the issue matters, or how to brief the person responsible for improving it."],
      ["THE SOLUTION","A public scorecard written for action.","The beta combines more than twelve checks with plain-language findings, a thirty-day plan, and copy-ready implementation prompts. The first audit is available without an account."],
    ],
    architecture:[
      [Globe,"Public signal layer","Collects only publicly available website information for a passive first review."],
      [TestTube,"Check layer","Organizes independent checks across SEO, security, performance, trust, and conversion."],
      [Strategy,"Priority layer","Translates findings into an impact-ranked scorecard and thirty-day plan."],
      [FileText,"Action layer","Produces plain-language explanations and copy-ready implementation prompts."],
    ],
    outcomeTitle:"A beta experience that demonstrates value before asking for an account.",
    outcomes:[["12+","Public website checks"],["0","Login required for first audit"],["30","Day action plan"]],
    proofNote:"AuditScout is clearly labeled as a public beta. Scanner depth and agency features are still evolving; the proof shown here is limited to the live public-audit experience.",
    stack:["Public audit flow","Prioritized scorecard","Thirty-day plan","Vercel"],
  },
  stormradar: {
    name:"StormRadar", eyebrow:"FIELD OPERATIONS",
    description:"A contractor-focused weather experience that combines live radar, severe-weather alerts, and job-site workability guidance.",
    status:"Live product", platform:"Web application", engagement:"Independent product build", deliverables:"Weather UX · alerts · responsive launch",
    heroStats:[["Monitoring","24/7"],["Trusted feeds","4"],["Primary user","Contractors"]],
    narrative:[
      ["OVERVIEW","Know when the job site is workable.","The public CrewCast experience combines radar, current conditions, short-range forecasts, and severe-weather alerts around the decision a contractor needs to make next."],
      ["THE PROBLEM","Weather data is plentiful; job-site guidance is not.","Field teams often move between radar, hourly forecasts, and alert feeds before translating those signals into staffing, routing, and safe work windows."],
      ["THE SOLUTION","A calm weather layer organized around workability.","The interface presents the current condition, likely workable window, hourly change, radar access, and alert activation in one contractor-focused experience."],
    ],
    architecture:[
      [Database,"Weather layer","Combines government forecast, observation, radar, and severe-weather sources."],
      [Strategy,"Workability layer","Frames changing conditions around a practical job-site decision."],
      [Lightning,"Alert layer","Makes severe-weather monitoring available without burying the current situation."],
      [DeviceMobile,"Field layer","Keeps the core view readable for crews checking conditions away from a desk."],
    ],
    outcomeTitle:"One job-site weather view grounded in trusted public data.",
    outcomes:[["4","Named government data sources"],["24/7","Weather monitoring"],["1","Focused workability decision"]],
    proofNote:"The public product names NWS, NOAA, NHC, and NEXRAD as data sources. No unsupported accuracy, response-time, or customer-adoption claims are presented here.",
    stack:["NWS","NOAA","NHC","NEXRAD","Vercel"],
  },
  wiyw: {
    name:"WIYW", eyebrow:"WATER INTELLIGENCE",
    description:"A Florida drinking-water research experience that explains public reports and common water concerns in plain language.",
    status:"Live product", platform:"Web application", engagement:"Independent product build", deliverables:"Data UX · content system · public launch",
    heroStats:[["Search modes","3"],["Coverage","Florida"],["Primary output","Water report"]],
    narrative:[
      ["OVERVIEW","Public water information people can actually navigate.","What’s In Your Water lets a Florida resident search by city, ZIP code, or water utility to find detected contaminants, public reports, common issues, and filter information."],
      ["THE PROBLEM","Water-quality evidence is fragmented and difficult to interpret.","Residents must often identify their utility, locate annual reports, decode technical language, and understand what a detected contaminant means before deciding what to investigate next."],
      ["THE SOLUTION","A plain-language research layer around local water.","The product organizes geographic search, utility context, reports, education, alerts, comparison, and an AI-assisted explanation entry point within one public experience."],
    ],
    architecture:[
      [Globe,"Location layer","Connects city, ZIP, county, and utility paths to the relevant public context."],
      [Database,"Report layer","Organizes public water reports and detected-contaminant information."],
      [FileText,"Explanation layer","Translates technical water topics into plain-language educational content."],
      [Lightning,"Action layer","Connects reports with comparison, alerts, and next-step guidance."],
    ],
    outcomeTitle:"Three familiar search paths into one Florida water-intelligence experience.",
    outcomes:[["3","Search entry points"],["1","Plain-language report destination"],["67","Florida counties in the statewide context"]],
    proofNote:"The site provides public information and educational guidance; it does not replace certified testing or professional health advice.",
    stack:["Public water reports","Florida utility context","Search","Educational content","Vercel"],
  },
  deedscout: {
    name:"DeedScout", eyebrow:"PROPERTY INTELLIGENCE",
    description:"Florida tax-deed research organized county by county with official links, permit signals, and practical research workflows.",
    status:"Public beta", platform:"Web application", engagement:"Independent product build", deliverables:"Research UX · public sources · workflow design",
    heroStats:[["Counties indexed","67"],["Research modules","6"],["Cached permit cities","4"]],
    narrative:[
      ["OVERVIEW","Property research without the courthouse scavenger hunt.","DeedScout organizes official county clerk and auction links, parcel tools, permit signals, and a focused research workflow across Florida's sixty-seven counties."],
      ["THE PROBLEM","Public data was available, but not decision-ready.","Researchers moved between county portals, scanned documents, spreadsheets, and paid databases. Formats changed by jurisdiction, entity names were inconsistent, and verification consumed most of the workflow."],
      ["THE SOLUTION","An honest research layer around official sources.","The product keeps county links, cached permit information, research modules, watchlists, and exports together while clearly distinguishing cached or recovering data from official records that must be confirmed before bidding."],
    ],
    architecture:[
      [Globe,"County layer","Organizes research entry points across Florida's sixty-seven counties."],
      [Database,"Record layer","Connects tax-deed, parcel, permit, and public-record research paths."],
      [Stack,"Workflow layer","Groups watchlists, research modules, and export tools around repeatable work."],
      [ShieldCheck,"Evidence layer","Preserves visible source labels and reminds researchers to confirm official records."],
    ],
    outcomeTitle:"A statewide research index with transparent data boundaries.",
    outcomes:[["67","Counties indexed"],["6","Research modules"],["4","Cached permit cities"]],
    proofNote:"DeedScout is a public beta. Sale dates, parcel counts, and cached permit coverage can be incomplete or recovering; the product explicitly directs users to confirm official sources before bidding.",
    stack:["Florida public records","County sources","Permit cache","Research exports","Netlify"],
  },
  clawmonitor: {
    name:"ClawMonitor", eyebrow:"SYSTEM OBSERVABILITY",
    description:"A glanceable, always-on-top Windows monitor for performance metrics and local developer-service health.",
    status:"Open source", platform:"Windows 10 / 11", engagement:"Independent product build", deliverables:"Desktop UX · native behavior · automated tests",
    heroStats:[["System metrics","5"],["Automated tests","35"],["License","MIT"]],
    narrative:[
      ["OVERVIEW","Your whole system, at a glance.","ClawMonitor keeps CPU, RAM, GPU, temperatures, network, disk activity, and developer-service health visible in a slim Windows bar that never steals focus from the work underneath."],
      ["THE PROBLEM","Understanding a struggling workstation interrupted the work itself.","Developers had to open separate task, hardware, network, and container tools to answer a simple question: what is consuming the machine, and which local services are actually healthy? Persistent monitors often covered applications or captured clicks."],
      ["THE SOLUTION","A native-feeling monitor designed to stay out of the way.","The system registers as a Windows AppBar to reserve screen space, remains click-through during normal use, reveals detail on hover, and combines modular metric collectors with live status for Docker, WSL, Ollama, OpenClaw, and other local services."],
    ],
    architecture:[
      [ChartLineUp,"Metric layer","Focused collectors for CPU, memory, GPU, temperature, disk, and network signals."],
      [Strategy,"Native layer","Windows AppBar behavior reserves space and restores itself safely across restarts."],
      [Plug,"Service layer","Lightweight health checks keep local developer services visible at a glance."],
      [TestTube,"Quality layer","Thirty-five automated tests protect the modular collectors and interface behavior."],
    ],
    outcomeTitle:"A useful system layer that stays visible—and stays out of the way.",
    outcomes:[["35","Automated tests"],["3","Selectable palettes"],["MIT","Open-source license"]],
    proofNote:"ClawMonitor's public repository and MIT license make the implementation, test suite, and release claims directly inspectable.",
    stack:["Electron","systeminformation","koffi","Win32 AppBar","Vitest","GitHub Pages"],
  },
  "lava-leap": {
    name:"Lava Leap", eyebrow:"GAME ENGINEERING",
    description:"A free endless arcade climber built around readable movement, escalating pressure, and immediate global competition.",
    status:"Live product", platform:"Browser + Android", engagement:"Independent product build", deliverables:"Game systems · distribution · leaderboards",
    heroStats:[["Gameplay systems","10"],["Playable climbers","4"],["Platforms","2"]],
    narrative:[
      ["OVERVIEW","An arcade climb that starts instantly and keeps asking for one more run.","Lava Leap combines an endless vertical tower, rising lava, double jumps, dashes, combos, power-ups, achievements, and the Lava Titan boss in a focused browser-and-Android experience."],
      ["THE PROBLEM","Fast arcade play loses momentum when access, controls, or progression create friction.","The experience needed to teach itself in seconds, feel responsive across keyboard and touch, offer meaningful run-to-run goals, and connect every player to live competition without requiring an account."],
      ["THE SOLUTION","A compact game loop with layered mastery and frictionless distribution.","Familiar movement expands into double and triple jumps, dashes, combo scoring, daily challenges, unlocks, and boss encounters. Browser play, Android releases, itch.io distribution, and automatic leaderboard submission make every entry point immediate."],
    ],
    architecture:[
      [Lightning,"Gameplay layer","Responsive movement, rising pressure, hazards, power-ups, and boss encounters."],
      [Stack,"Progression layer","Coins, shop systems, achievements, climbers, and daily challenge seeds."],
      [TrendUp,"Competition layer","Automatic best-run submission to live global and daily leaderboards."],
      [Globe,"Distribution layer","One game delivered through the browser, Android releases, and itch.io."],
    ],
    outcomeTitle:"A complete arcade loop that is immediate to enter and difficult to put down.",
    outcomes:[["10","Core gameplay systems"],["4","Playable climbers"],["2","Launch platforms"]],
    proofNote:"The game is free to play in the browser, offers a public Android release, requires no account, and publishes global and daily leaderboards.",
    stack:["Browser","Android","Vercel","GitHub Releases","itch.io"],
  },
  scamwatch: {
    name:"ScamWatch", eyebrow:"CONSUMER PROTECTION INTELLIGENCE",
    description:"A public-benefit platform that helps people assess suspicious links, messages, phone numbers, and email before they act.",
    status:"Public beta", platform:"Web application", engagement:"Independent product build", deliverables:"Threat UX · privacy design · public guidance",
    heroStats:[["Indicator types","4"],["Official routes","3"],["Core access","Free"]],
    narrative:[
      ["OVERVIEW","Know before you click.","ScamWatch gives consumers one clear place to check a suspicious indicator, understand the calibrated risk, review active Florida scam alerts, and reach trusted recovery guidance."],
      ["THE PROBLEM","Scam warnings often arrive after the decision moment.","People receive urgent messages through unfamiliar links, spoofed phone numbers, and convincing email. Raw warning lists rarely explain why something is risky or what a person should do after clicking, paying, or sharing sensitive information."],
      ["THE SOLUTION","Transparent threat analysis with a direct path to action.","The experience accepts four common indicator types, explains threat vectors in plain language, surfaces active Florida campaigns, and routes people toward official FTC, FBI IC3, and state resources without selling personal information."],
    ],
    architecture:[
      [ShieldCheck,"Analysis layer","Calibrated risk explanations for suspicious links, messages, phone numbers, and email."],
      [LockKey,"Privacy layer","De-identification and metadata stripping protect information submitted for review."],
      [Lightning,"Alert layer","Florida-focused campaign intelligence makes timely regional threats visible."],
      [FileText,"Guidance layer","Recovery checklists and official reporting routes turn risk into clear next steps."],
    ],
    outcomeTitle:"A calmer, clearer decision point between suspicion and harm.",
    outcomes:[["4","Indicator types supported"],["3","Official reporting routes"],["100%","Free core education"]],
    proofNote:"ScamWatch clearly labels its seeded campaigns as demo data and does not present them as a complete live scam database. Official reporting links remain the source of record.",
    stack:["Vercel","Threat analysis","Privacy controls","Florida alerts","Recovery guidance"],
  },
};

function ProductCaseStudy({ slug }) {
  const study = caseStudyDetails[slug];
  const product = products.find(item=>item.name===study.name);
  const productIndex=products.findIndex(item=>item.name===study.name);
  const nextProduct=products[(productIndex+1)%products.length];
  return <main>
    <section className="case-hero"><div><SiteLink className="back-link" href="/work"><ArrowLeft size={16}/> All work</SiteLink><SectionLabel>{study.eyebrow}</SectionLabel><h1>{study.name}</h1><p>{study.description}</p><LiveProductLink product={product} className="case-live-link"/><div className="case-facts"><div><span>Status</span><strong>{study.status}</strong></div><div><span>Platform</span><strong>{study.platform}</strong></div><div><span>Engagement</span><strong>{study.engagement}</strong></div><div><span>Deliverables</span><strong>{study.deliverables}</strong></div></div></div><div className="case-hero-stats">{study.heroStats.map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
    <section className="case-dashboard section"><ProductScreenshot product={product} className="case-product-screenshot"/></section>
    <section className="case-narrative section">{study.narrative.map(([label,title,body],index)=><div className="case-study-row" key={label}><div className="case-rail"><span>{String(index+1).padStart(2,"0")}</span><SectionLabel>{label}</SectionLabel></div><div><h2>{title}</h2><p>{body}</p></div></div>)}</section>
    <section className="architecture section"><div><SectionLabel>SYSTEM DESIGN</SectionLabel><h2>Purposeful at every layer.</h2><p>These layers describe the capabilities visible in the product and the decisions shaping the experience—not unverifiable infrastructure claims.</p></div><div className="architecture-grid">{study.architecture.map(([Icon,title,body])=><article key={title}><Icon size={26}/><span>{title}</span><p>{body}</p></article>)}</div></section>
    <section className="case-outcome section"><div><SectionLabel>VERIFIED PROOF</SectionLabel><h2>{study.outcomeTitle}</h2></div><div className="outcome-grid">{study.outcomes.map(([value,label])=><article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div><p className="proof-note"><ShieldCheck size={18}/>{study.proofNote}</p><div className="stack-row">{study.stack.map(item=><span key={item}>{item}</span>)}</div></section>
    <section className="next-project section"><div><SectionLabel>NEXT SYSTEM</SectionLabel><h2>{nextProduct.name}</h2><p>{nextProduct.problem}</p></div><SiteLink href={nextProduct.href}>Read the next case study <ArrowRight size={20}/></SiteLink></section>
    <PhaseCTA source={slug}/>
  </main>;
}

function ServicesPage() {
  return <main><PageHero eyebrow="ENGINEERING CAPABILITIES" title={<>From difficult problem<br/>to dependable system.</>} copy="We combine product thinking, technical depth, and disciplined delivery to build software that earns trust over time." meta="SERVICES // 01—08"/><BuyerSituations/><section className="service-catalog section">{serviceCatalog.map(({icon:Icon,title,body},index)=><article className="reveal-section" key={title}><div className="service-number">{String(index+1).padStart(2,"0")}</div><Icon size={32} weight="thin"/><h2>{title}</h2><p>{body}</p><SiteLink href={`/booking?engagement=${encodeURIComponent(title)}`}>Discuss this capability <ArrowUpRight size={15}/></SiteLink></article>)}</section><EngagementModels/><Technology/><PhaseCTA source="services"/></main>;
}

function InsightCard({ article, featured=false }) {
  return <article className={`insight-card reveal-section ${featured ? "is-featured" : ""}`}>
    <div className="insight-card-meta"><span>{article.number}</span><span>{article.category}</span></div>
    <div className="insight-card-copy"><h2>{article.title}</h2><p>{article.excerpt}</p><SiteLink href={`/insights/${article.slug}`}>Read insight <ArrowRight size={17}/></SiteLink></div>
    <div className="insight-card-time"><span>{article.date}</span><span>{article.readTime} READ</span></div>
  </article>;
}

function InsightsPage() {
  const [filter,setFilter]=useState("All");
  const categories=["All",...insights.map(article=>article.category)];
  const visible=filter==="All" ? insights : insights.filter(article=>article.category===filter);
  return <main><PageHero eyebrow="FIELD NOTES" title={<>Thinking for systems<br/>that have to work.</>} copy="Engineering perspectives on software, AI, automation, security, architecture, and the operating environments around them." meta="INSIGHTS // 01—08"/>
    <section className="insights-index section">
      <div className="insight-filter" role="toolbar" aria-label="Filter insights by category">{categories.map(category=><button key={category} aria-pressed={filter===category} className={filter===category?"active":""} onClick={()=>setFilter(category)}>{category}</button>)}</div>
      <div className="insight-results" aria-live="polite"><span>{String(visible.length).padStart(2,"0")} ARTICLES</span><span>{filter.toUpperCase()}</span></div>
      <div className="insight-list">{visible.map((article,index)=><InsightCard article={article} featured={filter==="All"&&index===0} key={article.slug}/>)}</div>
    </section><PhaseCTA/></main>;
}

function InsightArticle({ slug }) {
  const article=insights.find(item=>item.slug===slug) || insights[0];
  const related=insights.filter(item=>item.slug!==article.slug).slice(0,2);
  return <main><article>
    <header className="article-hero"><SiteLink className="back-link" href="/insights"><ArrowLeft size={16}/> All insights</SiteLink><div className="article-kicker"><span>{article.category}</span><span>{article.date}</span><span>{article.readTime} READ</span></div><h1>{article.title}</h1><p>{article.excerpt}</p><div className="article-byline"><span>SYMBOLIC DEVELOPMENT</span><span>ENGINEERING NOTES // {article.number}</span></div></header>
    <div className="article-layout section"><aside><span>IN THIS NOTE</span>{article.sections.map(([title],index)=><a key={title} href={`#section-${index+1}`}>{String(index+1).padStart(2,"0")} {title}</a>)}</aside><div className="article-body"><p className="article-lead">{article.lead}</p>{article.sections.map(([title,body],index)=><section id={`section-${index+1}`} key={title}><span>{String(index+1).padStart(2,"0")}</span><h2>{title}</h2><p>{body}</p></section>)}<div className="article-note"><ShieldCheck size={26} weight="thin"/><div><strong>Built with purpose.</strong><p>Our engineering notes share practical principles we use when designing and operating consequential software.</p></div></div></div></div>
    <section className="related-insights section"><SectionLabel>CONTINUE READING</SectionLabel><div>{related.map(item=><SiteLink href={`/insights/${item.slug}`} key={item.slug}><span>{item.category}</span><strong>{item.title}</strong><ArrowUpRight size={18}/></SiteLink>)}</div></section>
  </article><PhaseCTA/></main>;
}

const policyContent={
  privacy:{eyebrow:"PRIVACY",title:"Clear handling of the information you share.",updated:"AUGUST 11, 2026",sections:[["Information we collect","We collect the information you choose to provide through an inquiry or booking request, including your name, email address, company, project context, and preferred meeting window. We may also receive limited technical data needed for security and aggregate site measurement."],["How we use it","We use inquiry information to respond, prepare for conversations, protect the site from abuse, and improve how the website supports prospective clients. We do not sell personal information."],["Service providers","Hosting, email delivery, and privacy-respecting analytics providers may process limited information on our behalf under their own security and privacy commitments."],["Retention and choices","We retain inquiry information only as long as reasonably necessary for business communication, legal obligations, and security. You may request access, correction, or deletion by emailing hello@symbolicdev.com."]]},
  terms:{eyebrow:"TERMS",title:"Straightforward terms for using this website.",updated:"AUGUST 07, 2026",sections:[["Website use","This website presents Symbolic Development's capabilities, work, and engineering perspectives. You may use it for lawful informational and business-evaluation purposes."],["Intellectual property","Site content, branding, interface design, and original written material belong to Symbolic Development unless otherwise stated. References to third-party technologies remain the property of their respective owners."],["No professional guarantee","Website content is general information and does not create a client relationship, warranty, or professional advice. Project terms are established separately in a written agreement."],["Availability and changes","We work to keep the website accurate and available, but may update, suspend, or change it without notice. These terms are governed by the laws applicable to the final contracting entity."]]},
};

function BookingPage() {
  const [status,setStatus]=useState("idle"); const [error,setError]=useState(""); const [startedAt,setStartedAt]=useState(()=>Date.now()); const today=new Date().toISOString().slice(0,10);
  const query=new URLSearchParams(window.location.search); const referral=query.get("ref") || ""; const selectedEngagement=query.get("engagement") || "";
  const engagementOptions=["Launch a new product","Modernize a system","Automate operations","Strengthen a team","Product foundation","Focused build","System modernization","Engineering partnership","Not sure yet"];
  const send=async event=>{event.preventDefault();const form=event.currentTarget;setStatus("sending");setError("");try{await submitLead(form,"booking");trackEvent("booking_requested");setStatus("sent");}catch(reason){trackEvent("booking_request_failed");setError(reason.message);setStatus("error");}};
  const contextCopy=referral ? `You’re continuing from the ${products.find(item=>item.href.endsWith(referral))?.name || referral} case study. Choose a useful window and we’ll carry that context into the conversation.` : "Choose a useful window and tell us what is at stake. We’ll confirm the right people and a practical agenda by email.";
  return <main><PageHero eyebrow="WORKING SESSION" title={<>Start with a focused<br/>technical conversation.</>} copy={contextCopy} meta="BOOKING // 30 MIN"/><section className="booking section"><div className="booking-copy"><SectionLabel>WHAT TO EXPECT</SectionLabel><h2>Clarity before commitment.</h2><div className="booking-points"><article><span>01</span><p>A focused review of the problem, operating context, and desired outcome.</p></article><article><span>02</span><p>An honest read on feasibility, risk, and the most useful next decision.</p></article><article><span>03</span><p>No sales theater. If we are not the right fit, we will say so clearly.</p></article></div><SiteLink className="booking-secondary-link" href="/#contact">Prefer to send full project context? <ArrowRight size={15}/></SiteLink></div>{status==="sent"?<div className="success-message" role="status"><CheckCircle size={34} weight="thin"/><h3>Session requested.</h3><p>We’ll confirm the time and agenda by email within one business day.</p><SiteLink href="/insights">Read our engineering notes</SiteLink></div>:<form onSubmit={send}><input type="hidden" name="startedAt" value={startedAt}/><input type="hidden" name="referral" value={referral}/><label className="form-trap" hidden aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off"/></label><div className="form-row"><label>Name<input required minLength="2" maxLength="80" name="name" autoComplete="name" placeholder="Your name"/></label><label>Email<input required type="email" maxLength="160" name="email" autoComplete="email" placeholder="you@company.com"/></label></div><label>Company <span className="optional">OPTIONAL</span><input maxLength="120" name="company" autoComplete="organization" placeholder="Company or organization"/></label><label>What should this session focus on?<select required name="engagement" defaultValue={engagementOptions.includes(selectedEngagement) ? selectedEngagement : ""}><option value="" disabled>Select a focus</option>{engagementOptions.map(option=><option key={option}>{option}</option>)}</select></label><div className="form-row"><label>Preferred date<input required type="date" min={today} name="preferredDate"/></label><label>Preferred window<select required name="preferredWindow" defaultValue=""><option value="" disabled>Select a window</option><option>9:00–11:00 ET</option><option>11:00–14:00 ET</option><option>14:00–17:00 ET</option></select></label></div><label>What should we prepare for?<textarea required minLength="20" maxLength="4000" name="message" rows="4" placeholder="The problem, current constraints, and what a useful outcome looks like."/></label>{error&&<p className="form-error" role="alert">{error} <a href="mailto:hello@symbolicdev.com">Email us directly.</a></p>}<button className="button button-primary" type="submit" disabled={status==="sending"}><span>{status==="sending"?"Requesting…":"Request session"}</span><CalendarBlank size={16}/></button><small className="form-privacy">This is a scheduling request, not an automatic calendar reservation.</small></form>}</section></main>;
}

function PolicyPage({ type }) { const policy=policyContent[type]; return <main><PageHero eyebrow={policy.eyebrow} title={policy.title} copy="Plain-language information about this website and the way we work." meta={`UPDATED // ${policy.updated}`}/><section className="policy section"><aside><span>{policy.eyebrow}</span><a href="mailto:hello@symbolicdev.com">Questions <EnvelopeSimple size={15}/></a></aside><div>{policy.sections.map(([title,body],index)=><article key={title}><span>{String(index+1).padStart(2,"0")}</span><h2>{title}</h2><p>{body}</p></article>)}</div></section></main>; }

function NotFoundPage() { return <main className="not-found"><div><SectionLabel>404 // NOT FOUND</SectionLabel><h1>This route<br/>doesn’t exist.</h1><p>The system is operational. The page you requested is not.</p><div><ButtonLink href="/" primary>Return home</ButtonLink><ButtonLink href="/work">Explore our work</ButtonLink></div></div></main>; }

function PhaseCTA({ source="site" }) { return <section className="phase-cta"><div><SectionLabel>DISCUSS A SYSTEM</SectionLabel><h2>Bring us the difficult problem.</h2></div><div className="phase-cta-actions"><ButtonLink href={`/booking?ref=${encodeURIComponent(source)}`} primary onClick={()=>trackEvent("booking_cta_clicked",{source})}>Book a working session</ButtonLink><ButtonLink href="/#contact" onClick={()=>trackEvent("contact_cta_clicked",{source})}>Send full context</ButtonLink></div></section>; }
function HomePage() { return <main><Hero/><TrustStrip/><ProductSection/><BuyerSituations/><Approach/><EngagementModels/><ProductProof/><Technology/><Contact/></main>; }
function Footer() { return <footer><SiteLink className="wordmark" href="/">SYMBOLIC DEVELOPMENT</SiteLink><nav aria-label="Legal and contact"><SiteLink href="/booking">Book a session</SiteLink><SiteLink href="/privacy">Privacy</SiteLink><SiteLink href="/terms">Terms</SiteLink></nav><span>© 2026 · SDDS V1.0</span></footer>; }

export function App() {
  const location=useLocation(); usePageMetadata(location); let page=null;
  if(location.pathname==="/") page=<HomePage/>;
  if(location.pathname==="/work") page=<WorkPage/>;
  if(location.pathname==="/work/auditscout") page=<ProductCaseStudy slug="auditscout"/>;
  if(location.pathname==="/work/stormradar") page=<ProductCaseStudy slug="stormradar"/>;
  if(location.pathname==="/work/wiyw") page=<ProductCaseStudy slug="wiyw"/>;
  if(location.pathname==="/work/deedscout") page=<ProductCaseStudy slug="deedscout"/>;
  if(location.pathname==="/work/clawmonitor") page=<ProductCaseStudy slug="clawmonitor"/>;
  if(location.pathname==="/work/lava-leap") page=<ProductCaseStudy slug="lava-leap"/>;
  if(location.pathname==="/work/scamwatch") page=<ProductCaseStudy slug="scamwatch"/>;
  if(location.pathname==="/services") page=<ServicesPage/>;
  if(location.pathname==="/insights") page=<InsightsPage/>;
  if(location.pathname.startsWith("/insights/")) page=<InsightArticle slug={location.pathname.split("/").filter(Boolean)[1]}/>;
  if(location.pathname==="/booking") page=<BookingPage/>;
  if(location.pathname==="/privacy") page=<PolicyPage type="privacy"/>;
  if(location.pathname==="/terms") page=<PolicyPage type="terms"/>;
  if(!page) page=<NotFoundPage/>;
  return <><a className="skip-link" href="#main-content">Skip to main content</a><Navigation location={location}/><div id="main-content" tabIndex="-1">{page}</div><Footer/></>;
}

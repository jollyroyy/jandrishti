/* Design philosophy: Civic Night Operations — evidence-first civic dashboard with a dark navy command canvas, vivid status colors, asymmetrical rail/workspace composition, and calm, direct interactions. */
import { useMemo, useState } from "react";
import {
  Activity, Bell, Building2, CalendarDays, Check, ChevronDown, Clock3, Droplets, ExternalLink,
  FileText, Heart, Home as HomeIcon, Leaf, MapPin, Menu, Navigation, Phone, Plus, Search,
  Settings, ShieldCheck, Star, TrendingUp, Users, X, Zap, BarChart3, Route as RouteIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";

const assets = {
  seal: "/images/namma-hand-emblem_0509ff06.png",
  leadership: "/images/namma-leadership-strip_9ef1fae9.png",
  referenceLeadership: "/images/namma-leadership-strip-clean_f161edb6.png",
  rajiv: "/images/namma-rajiv-gandhi-public_7d134caa.jpg",
  utKhaderPublic: "/images/ut-khader-public_f598c34d.png",
  rahulPublic: "/images/rahul-gandhi-public_6b760bd8.png",
  shivakumarPublic: "/images/shivakumar-public_451760a4.png",
  rajivPublic: "/images/rajiv-gandhi-public_35393440.png",
  khader: "/images/ut-khader-portrait_9bcc7a5c.png",
  hero: "/images/namma-hero-coast_2787efb0.jpg",
  pulse: "/images/namma-weekly-pulse_f3b683b8.jpg",
  road: "/images/namma-road-update_79fec2c6.jpg",
  water: "/images/namma-water-update_b743d677.jpg",
};

const navItems = [
  { label: "Home", icon: HomeIcon }, { label: "Priority", icon: Heart }, { label: "Progress", icon: TrendingUp },
];
const updates = [
  { title: "Road improvement – Kotekar Main Road", desc: "Work completed", time: "Today", image: assets.road },
  { title: "Water supply restored in 3 localities", desc: "Completed", time: "Yesterday", image: assets.water },
  { title: "Drainage cleaning drive in 2 areas", desc: "Completed", time: "2 days ago", image: assets.road },
];

function IconButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick?: () => void }) {
  return <button aria-label={label} onClick={onClick} className="icon-button">{children}</button>;
}
function Metric({ icon: Icon, value, label, note, tone }: any) {
  return <div className="metric"><div className={`metric-icon ${tone}`}><Icon size={20} /></div><div><div className="metric-value">{value}</div><div className="metric-label">{label}</div><div className={`metric-note ${tone === "purple" ? "danger-note" : ""}`}>{note}</div></div></div>;
}
function LeadershipPortraits() {
  const leaders = [
    { image: assets.utKhaderPublic, name: "U.T. Khader", role: "MLA, Mangaluru" },
    { image: assets.rahulPublic, name: "Rahul Gandhi", role: "Leader of Opposition" },
    { image: assets.shivakumarPublic, name: "D.K. Shivakumar", role: "KPCC President" },
    { image: assets.rajiv, name: "Rajiv Gandhi", role: "Former Prime Minister" },
  ];
  return <div className="leader-portraits" aria-label="Congress leadership portraits">{leaders.map((leader) => <div className="leader-person" key={leader.name}><img src={leader.image} alt={leader.name}/><strong>{leader.name}</strong><span>{leader.role}</span></div>)}</div>;
}

export default function Home() {
  const [active, setActive] = useState("Home");
  const [locationOpen, setLocationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [month, setMonth] = useState("May 2024");
  const [search, setSearch] = useState("");
  const filteredUpdates = useMemo(() => updates.filter((u) => u.title.toLowerCase().includes(search.toLowerCase())), [search]);

  const nav = (label: string) => { setActive(label); setMobileNavOpen(false); if (label !== "Home") setViewOpen(true); };
  const report = () => setReportOpen(true);
  const submitReport = () => { setReportOpen(false); toast("Issue reported successfully", { description: "Your report has been added to the constituency desk." }); };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="seal-wrap"><img src={assets.seal} alt="Namma 204 civic seal" /></div><div><div className="brand-name">NAMMA <span>204</span></div><div className="brand-sub">Mangaluru Assembly Constituency</div></div></div>
      <nav className="side-nav">{navItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => nav(label)} className={`side-link ${active === label ? "active" : ""}`}><Icon size={22} strokeWidth={1.8} /><span>{label}</span></button>)}</nav>
      <div className="office"><div><Phone size={18} /> <span>Constituency Office</span></div><div><Phone size={16} /> <span>0824-XXXXXXX</span></div><div><Clock3 size={16} /> <span>10:00 AM - 6:00 PM<br/>(Mon - Sat)</span></div></div>
      <div className="tricolor-ribbon" aria-hidden="true" />
    </aside>

    <main className="main-area">
      <header className="topbar"><IconButton label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></IconButton><button className="location-select" onClick={() => setLocationOpen(true)}><MapPin size={20} className="green" /><span>Mangaluru Assembly Constituency</span><ChevronDown size={18} /></button><div className="top-actions"><div className="notification-wrap"><IconButton label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={20} /><span className="notification-count">3</span></IconButton>{notificationsOpen && <div className="popover notifications"><strong>Notifications</strong><p>3 updates need your attention.</p><button onClick={() => { setNotificationsOpen(false); nav("Priority"); }}>Review priority issues <ExternalLink size={14} /></button></div>}</div><button className="profile-trigger" onClick={() => setProfileOpen(true)}><div className="avatar">UK</div><div className="profile-copy"><strong>U.T. Khader</strong><span>MLA, Mangaluru</span></div><ChevronDown size={18} /></button></div></header>

      <div className="content-grid">
        <section className="center-column">
          <section className="hero-card"><img src={assets.hero} alt="Mangaluru coastline at night" /><div className="hero-overlay"/><div className="hero-copy"><div className="eyebrow">MANGALURU · 204</div><h1>Your Area.<br/>Your Voice.<br/><span>Our Commitment.</span></h1><p>Let’s build a cleaner, smarter<br/>and stronger Mangaluru together.</p><div className="hero-actions"><Button className="report-button" onClick={report}>Report an Issue <Plus size={17}/></Button><Button variant="outline" className="projects-button" onClick={() => setProjectsOpen(true)}>See Projects <RouteIcon size={17}/></Button></div></div><img className="reference-leadership" src={assets.referenceLeadership} alt="U.T. Khader, Rahul Gandhi, D.K. Shivakumar and Rajiv Gandhi" /></section>
          <section className="metrics-card"><Metric icon={Users} value="1,891" label="Issues Resolved" note="↑ 18% vs last month" tone="green-tone"/><Metric icon={FileText} value="126" label="Projects Completed" note="↑ 14% vs last month" tone="amber-tone"/><Metric icon={BarChart3} value="67" label="In Progress" note="Across 204" tone="blue-tone"/><Metric icon={Star} value="31" label="Priority Issues" note="Needs attention" tone="purple"/></section>
          <div className="lower-grid"><section className="panel focus-panel"><div className="panel-heading"><h2>Focus Areas</h2></div><div className="focus-list"><button onClick={() => toast("Water Supply selected") }><span className="focus-icon blue"><Droplets size={18}/></span>Water Supply</button><button onClick={() => toast("Roads & Infrastructure selected")}><span className="focus-icon amber"><Building2 size={18}/></span>Roads & Infrastructure</button><button onClick={() => toast("Health & Sanitation selected")}><span className="focus-icon red"><Heart size={18}/></span>Health & Sanitation</button><button onClick={() => toast("Public Amenities selected")}><span className="focus-icon green"><Leaf size={18}/></span>Public Amenities</button></div><button className="link-button" onClick={() => nav("Priority")}>View all focus areas <span>→</span></button></section><section className="panel updates-panel"><div className="panel-heading"><h2>Recent Updates</h2><button className="text-link" onClick={() => toast("Showing all recent updates")}>View all</button></div><div className="search-row"><Search size={15}/><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search updates" /></div><div className="update-list">{filteredUpdates.map((item) => <button className="update-row" key={item.title} onClick={() => toast(item.title, { description: item.desc })}><img src={item.image} alt=""/><div className="update-copy"><strong>{item.title}</strong><span>{item.desc}</span></div><div className="update-time">{item.time}<i/></div></button>)}</div></section></div>
        </section>

        <aside className="right-column"><section className="panel map-panel"><div className="panel-heading"><h2>Constituency Map</h2><button className="text-link" onClick={() => toast("Opening full constituency map", { description: "Map view is ready to explore by constituency zone." })}>View full map</button></div><div className="map-art"><div className="map-lines"/><div className="map-label label-a">Surathkal</div><div className="map-label label-b">Moodbidri</div><div className="map-label label-c">Ullal</div><div className="map-label label-d">Talapady</div><div className="map-label label-e">Mangaluru</div><div className="bubble red-b">23<small>Ullal</small></div><div className="bubble amber-b">11<small>Thokottu</small></div><div className="bubble green-b">9<small>Talapady</small></div></div><div className="legend"><span><i className="dot red-dot"/>Issues</span><span><i className="dot amber-dot"/>In Progress</span><span><i className="dot green-dot"/>Completed</span></div></section><section className="panel representative"><img className="rep-photo" src={assets.khader} alt="U.T. Khader"/><div className="rep-status"><i/> Constituency Office</div><h2>U.T. Khader</h2><p>MLA, Mangaluru</p><blockquote>“I’m listening to every voice.<br/>Working for every citizen.”</blockquote><div className="signature">U.T. Khader</div></section><section className="panel impact"><div className="panel-heading"><h2>Impact This Month</h2><button className="month-select" onClick={() => setMonth(month === "May 2024" ? "June 2024" : "May 2024")}>{month}<ChevronDown size={15}/></button></div><div className="impact-body"><div className="donut"><strong>76%</strong><span>Overall Progress</span></div><div className="impact-legend"><span><i className="dot green-dot"/>Resolved <b>76%</b></span><span><i className="dot blue-dot"/>In Progress <b>18%</b></span><span><i className="dot amber-dot"/>Pending <b>6%</b></span></div></div></section><section className="panel weekly"><div className="panel-heading"><div><h2>This Week in 204</h2><span className="date-range">13 – 19 May 2024</span></div></div><div className="week-stats"><div><strong className="red-text">61</strong><span>New Issues</span></div><div><strong className="green-text">96</strong><span>Resolved</span></div><div><strong className="purple-text">12</strong><span>Projects Updated</span></div></div><img src={assets.pulse} alt="Mangaluru city lights" /></section></aside>
      </div>
    </main>

    <Dialog open={viewOpen} onOpenChange={setViewOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>{active === "Priority" ? "Priority issues" : "Progress across 204"}</DialogTitle><DialogDescription>{active === "Priority" ? "Items currently marked for civic attention." : "A quick view of active and completed constituency work."}</DialogDescription></DialogHeader><div className="project-items">{active === "Priority" ? <><div><span className="status-chip red-chip">Needs attention</span><strong>Streetlight repairs in 4 wards</strong><small>7 reports · assigned to field office</small></div><div><span className="status-chip amber-chip">Reviewing</span><strong>Drainage clearing near Ullal</strong><small>Site visit scheduled this week</small></div></> : <><div><span className="status-chip green-chip">Completed</span><strong>Road improvement – Kotekar Main Road</strong><small>Updated today</small></div><div><span className="status-chip blue-chip">In progress</span><strong>Water supply resilience plan</strong><small>13 localities in scope</small></div></>}</div></DialogContent></Dialog>
    <Dialog open={reportOpen} onOpenChange={setReportOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>Report an Issue</DialogTitle><DialogDescription>Tell the constituency office what needs attention in your area.</DialogDescription></DialogHeader><div className="dialog-fields"><Input placeholder="Issue title"/><Input placeholder="Location or ward"/><textarea placeholder="Describe the issue" rows={4}/><Button className="report-button" onClick={submitReport}>Submit report <Check size={17}/></Button></div></DialogContent></Dialog>
    <Dialog open={projectsOpen} onOpenChange={setProjectsOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>Projects across 204</DialogTitle><DialogDescription>Current work in the Mangaluru Assembly Constituency.</DialogDescription></DialogHeader><div className="project-items"><div><img className="project-thumb" src={assets.road} alt="Resurfaced road project"/><span className="status-chip green-chip">Completed</span><strong>Road improvement – Kotekar Main Road</strong><small>Updated today</small></div><div><img className="project-thumb" src={assets.water} alt="Water supply project"/><span className="status-chip amber-chip">In progress</span><strong>Stormwater drainage renewal</strong><small>Expected completion: June 2024</small></div><div><img className="project-thumb" src={assets.pulse} alt="Community resilience planning area"/><span className="status-chip blue-chip">Planning</span><strong>Community water resilience plan</strong><small>12 localities included</small></div></div></DialogContent></Dialog>
    <Dialog open={locationOpen} onOpenChange={setLocationOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>Select constituency</DialogTitle><DialogDescription>Choose the area you want to monitor.</DialogDescription></DialogHeader><div className="location-options">{["Mangaluru Assembly Constituency", "Surathkal", "Ullal", "Talapady"].map((name, i) => <button key={name} onClick={() => { setLocationOpen(false); toast(`${name} selected`); }} className={i === 0 ? "selected-location" : ""}><MapPin size={17}/>{name}{i === 0 && <Check size={16}/>}</button>)}</div></DialogContent></Dialog>
    <Sheet open={profileOpen} onOpenChange={setProfileOpen}><SheetContent className="dark-sheet"><SheetHeader><SheetTitle>Account & Office</SheetTitle></SheetHeader><div className="sheet-profile"><div className="avatar large">UK</div><h3>U.T. Khader</h3><p>MLA, Mangaluru</p><button onClick={() => toast("Profile settings opened")}><Settings size={17}/> Profile settings</button><button onClick={() => toast("Office contact copied")}><Phone size={17}/> Contact office</button><button onClick={() => toast("Signed out of this demo session")}><ShieldCheck size={17}/> Sign out</button></div></SheetContent></Sheet>
    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}><SheetContent side="left" className="dark-sheet"><SheetHeader><SheetTitle>NAMMA <span>204</span></SheetTitle></SheetHeader><div className="mobile-links">{navItems.map(({label, icon: Icon}) => <button key={label} onClick={() => nav(label)} className={active === label ? "active" : ""}><Icon size={19}/>{label}</button>)}<button onClick={report}><Plus size={19}/>Report an Issue</button></div></SheetContent></Sheet>
  </div>;
}

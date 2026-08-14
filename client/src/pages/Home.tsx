/* Design philosophy: Civic Night Operations — evidence-first civic dashboard with a dark navy command canvas, vivid status colors, asymmetrical rail/workspace composition, and calm, direct interactions. */
import { useMemo, useState } from "react";
import {
  Activity, Bell, Building2, CalendarDays, Check, ChevronDown, Clock3, Copy, Droplets, ExternalLink,
  FileText, Heart, Home as HomeIcon, Leaf, LogOut, MapPin, Menu, Navigation, Phone, Plus, Search,
  Settings, ShieldCheck, Star, TrendingUp, Users, X, Zap, BarChart3, Route as RouteIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";

const OFFICE_PHONE = "0824-XXXXXXX";

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

const focusAreas = [
  { id: "water", icon: Droplets, tone: "blue", chip: "blue-chip", status: "In progress", title: "Water Supply", desc: "Reliable, clean water across every ward of the constituency.", activities: ["13 localities in scope", "2 storage tanks upgraded", "Monthly quality testing in 9 zones"] },
  { id: "roads", icon: Building2, tone: "amber", chip: "amber-chip", status: "In progress", title: "Roads & Infrastructure", desc: "Safer roads, cleaner drains and working streetlights.", activities: ["Kotekar Main Road resurfaced", "Streetlight repairs in 4 wards", "Drainage clearing near Ullal scheduled"] },
  { id: "health", icon: Heart, tone: "red", chip: "red-chip", status: "Needs attention", title: "Health & Sanitation", desc: "Clean streets, better clinics and preventive care for all.", activities: ["Drainage cleaning drive in 2 areas", "Health camp planned at Ullal", "Waste segregation pilot in 5 wards"] },
  { id: "amenities", icon: Leaf, tone: "green", chip: "green-chip", status: "Completed", title: "Public Amenities", desc: "Parks, water points and public spaces maintained for everyone.", activities: ["3 parks upgraded", "Public toilets maintained in market areas", "Bus shelter repairs completed"] },
];

const updates = [
  { title: "Road improvement – Kotekar Main Road", desc: "Work completed", time: "Today", image: assets.road, chip: "green-chip", status: "Completed", body: "Resurfacing and drainage correction are complete on Kotekar Main Road. The field office will keep monitoring the stretch and its junctions over the next 90 days." },
  { title: "Water supply restored in 3 localities", desc: "Completed", time: "Yesterday", image: assets.water, chip: "green-chip", status: "Completed", body: "Supply has been restored in the three affected localities after repairs to the distribution line. Pressure checks across neighbouring wards continue this week." },
  { title: "Drainage cleaning drive in 2 areas", desc: "Completed", time: "2 days ago", image: assets.road, chip: "green-chip", status: "Completed", body: "Crews cleared blocked drains in two low-lying areas ahead of the monsoon. Grit chambers will be cleaned again at the end of the season." },
  { title: "Streetlight repairs in 4 wards", desc: "In progress", time: "3 days ago", image: assets.water, chip: "amber-chip", status: "In progress", body: "Faulty streetlights have been identified in four wards and replacement work is under way. Ward-wise completion updates will be posted here." },
  { title: "Health camp at Ullal", desc: "Completed", time: "1 week ago", image: assets.pulse, chip: "green-chip", status: "Completed", body: "A general health and screening camp was held at Ullal with 400+ residents screened. The next camp is being scheduled for Surathkal." },
];

const zones = [
  { name: "Ullal", count: 23, tone: "red" },
  { name: "Thokottu", count: 11, tone: "amber" },
  { name: "Talapady", count: 9, tone: "green" },
  { name: "Surathkal", count: 7, tone: "amber" },
  { name: "Moodbidri", count: 4, tone: "green" },
  { name: "Mangaluru", count: 31, tone: "red" },
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
  const [focusListOpen, setFocusListOpen] = useState(false);
  const [activeFocus, setActiveFocus] = useState<any>(null);
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [activeUpdate, setActiveUpdate] = useState<any>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [month, setMonth] = useState("May 2024");
  const [search, setSearch] = useState("");
  const filteredUpdates = useMemo(() => updates.filter((u) => u.title.toLowerCase().includes(search.toLowerCase())), [search]);

  const nav = (label: string) => { setActive(label); setMobileNavOpen(false); if (label !== "Home") setViewOpen(true); };
  const report = () => setReportOpen(true);
  const submitReport = () => { setReportOpen(false); toast("Issue reported successfully", { description: "Your report has been added to the constituency desk." }); };
  const reportRelated = () => { setActiveFocus(null); setActiveUpdate(null); setReportOpen(true); };
  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`${label} copied to clipboard`);
    } catch {
      toast("Copy not available", { description: text });
    }
  };
  const confirmSignOut = () => { setSignOutOpen(false); toast("Signed out of this session", { description: "Sign in again to continue using the constituency desk." }); };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="seal-wrap"><img src={assets.seal} alt="Namma 204 civic seal" /></div><div><div className="brand-name">NAMMA <span>204</span></div><div className="brand-sub">Mangaluru Assembly Constituency</div></div></div>
      <nav className="side-nav">{navItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => nav(label)} className={`side-link ${active === label ? "active" : ""}`}><Icon size={22} strokeWidth={1.8} /><span>{label}</span></button>)}</nav>
      <div className="office"><div><Phone size={18} /> <span>Constituency Office</span></div><div><Phone size={16} /> <a href={`tel:${OFFICE_PHONE}`}>{OFFICE_PHONE}</a></div><div><Clock3 size={16} /> <span>10:00 AM - 6:00 PM<br/>(Mon - Sat)</span></div></div>
      <div className="tricolor-ribbon" aria-hidden="true" />
    </aside>

    <main className="main-area">
      <header className="topbar"><IconButton label="Open navigation" onClick={() => setMobileNavOpen(true)}><Menu size={20} /></IconButton><button className="location-select" onClick={() => setLocationOpen(true)}><MapPin size={20} className="green" /><span>Mangaluru Assembly Constituency</span><ChevronDown size={18} /></button><div className="top-actions"><div className="notification-wrap"><IconButton label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={20} /><span className="notification-count">3</span></IconButton>{notificationsOpen && <div className="popover notifications"><strong>Notifications</strong><p>3 updates need your attention.</p><button onClick={() => { setNotificationsOpen(false); nav("Priority"); }}>Review priority issues <ExternalLink size={14} /></button></div>}</div><button className="profile-trigger" onClick={() => setProfileOpen(true)}><div className="avatar">UK</div><div className="profile-copy"><strong>U.T. Khader</strong><span>MLA, Mangaluru</span></div><ChevronDown size={18} /></button></div></header>

      <div className="content-grid">
        <section className="center-column">
          <section className="hero-card"><img src={assets.hero} alt="Mangaluru coastline at night" /><div className="hero-overlay"/><div className="hero-copy"><div className="eyebrow">MANGALURU · 204</div><h1>Your Area.<br/>Your Voice.<br/><span>Our Commitment.</span></h1><p>Let’s build a cleaner, smarter<br/>and stronger Mangaluru together.</p><div className="hero-actions"><Button className="report-button" onClick={report}>Report an Issue <Plus size={17}/></Button><Button variant="outline" className="projects-button" onClick={() => setProjectsOpen(true)}>See Projects <RouteIcon size={17}/></Button></div></div><img className="reference-leadership" src={assets.referenceLeadership} alt="U.T. Khader, Rahul Gandhi, D.K. Shivakumar and Rajiv Gandhi" /></section>
          <section className="metrics-card"><Metric icon={Users} value="1,891" label="Issues Resolved" note="↑ 18% vs last month" tone="green-tone"/><Metric icon={FileText} value="126" label="Projects Completed" note="↑ 14% vs last month" tone="amber-tone"/><Metric icon={BarChart3} value="67" label="In Progress" note="Across 204" tone="blue-tone"/><Metric icon={Star} value="31" label="Priority Issues" note="Needs attention" tone="purple"/></section>
          <div className="lower-grid"><section className="panel focus-panel"><div className="panel-heading"><h2>Focus Areas</h2></div><div className="focus-list">{focusAreas.map((f) => <button key={f.id} onClick={() => setActiveFocus(f)}><span className={`focus-icon ${f.tone}`}><f.icon size={18}/></span>{f.title}</button>)}</div><button className="link-button" onClick={() => setFocusListOpen(true)}>View all focus areas <span>→</span></button></section><section className="panel updates-panel"><div className="panel-heading"><h2>Recent Updates</h2><button className="text-link" onClick={() => setUpdatesOpen(true)}>View all</button></div><div className="search-row"><Search size={15}/><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search updates" /></div><div className="update-list">{filteredUpdates.map((item) => <button className="update-row" key={item.title} onClick={() => setActiveUpdate(item)}><img src={item.image} alt=""/><div className="update-copy"><strong>{item.title}</strong><span>{item.desc}</span></div><div className="update-time">{item.time}<i/></div></button>)}</div></section></div>
        </section>

        <aside className="right-column"><section className="panel map-panel"><div className="panel-heading"><h2>Constituency Map</h2><button className="text-link" onClick={() => setMapOpen(true)}>View full map</button></div><div className="map-art"><div className="map-lines"/><div className="map-label label-a">Surathkal</div><div className="map-label label-b">Moodbidri</div><div className="map-label label-c">Ullal</div><div className="map-label label-d">Talapady</div><div className="map-label label-e">Mangaluru</div><div className="bubble red-b">23<small>Ullal</small></div><div className="bubble amber-b">11<small>Thokottu</small></div><div className="bubble green-b">9<small>Talapady</small></div></div><div className="legend"><span><i className="dot red-dot"/>Issues</span><span><i className="dot amber-dot"/>In Progress</span><span><i className="dot green-dot"/>Completed</span></div></section><section className="panel representative"><img className="rep-photo" src={assets.khader} alt="U.T. Khader"/><div className="rep-status"><i/> Constituency Office</div><h2>U.T. Khader</h2><p>MLA, Mangaluru</p><blockquote>“I’m listening to every voice.<br/>Working for every citizen.”</blockquote><div className="signature">U.T. Khader</div></section><section className="panel impact"><div className="panel-heading"><h2>Impact This Month</h2><button className="month-select" onClick={() => setMonth(month === "May 2024" ? "June 2024" : "May 2024")}>{month}<ChevronDown size={15}/></button></div><div className="impact-body"><div className="donut"><strong>76%</strong><span>Overall Progress</span></div><div className="impact-legend"><span><i className="dot green-dot"/>Resolved <b>76%</b></span><span><i className="dot blue-dot"/>In Progress <b>18%</b></span><span><i className="dot amber-dot"/>Pending <b>6%</b></span></div></div></section><section className="panel weekly"><div className="panel-heading"><div><h2>This Week in 204</h2><span className="date-range">13 – 19 May 2024</span></div></div><div className="week-stats"><div><strong className="red-text">61</strong><span>New Issues</span></div><div><strong className="green-text">96</strong><span>Resolved</span></div><div><strong className="purple-text">12</strong><span>Projects Updated</span></div></div><img src={assets.pulse} alt="Mangaluru city lights" /></section></aside>
      </div>
    </main>

    <Dialog open={viewOpen} onOpenChange={setViewOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>{active === "Priority" ? "Priority issues" : "Progress across 204"}</DialogTitle><DialogDescription>{active === "Priority" ? "Items currently marked for civic attention." : "A quick view of active and completed constituency work."}</DialogDescription></DialogHeader><div className="project-items">{active === "Priority" ? <><div><span className="status-chip red-chip">Needs attention</span><strong>Streetlight repairs in 4 wards</strong><small>7 reports · assigned to field office</small></div><div><span className="status-chip amber-chip">Reviewing</span><strong>Drainage clearing near Ullal</strong><small>Site visit scheduled this week</small></div></> : <><div><span className="status-chip green-chip">Completed</span><strong>Road improvement – Kotekar Main Road</strong><small>Updated today</small></div><div><span className="status-chip blue-chip">In progress</span><strong>Water supply resilience plan</strong><small>13 localities in scope</small></div></>}</div></DialogContent></Dialog>
    <Dialog open={reportOpen} onOpenChange={setReportOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>Report an Issue</DialogTitle><DialogDescription>Tell the constituency office what needs attention in your area.</DialogDescription></DialogHeader><div className="dialog-fields"><Input placeholder="Issue title"/><Input placeholder="Location or ward"/><textarea placeholder="Describe the issue" rows={4}/><Button className="report-button" onClick={submitReport}>Submit report <Check size={17}/></Button></div></DialogContent></Dialog>
    <Dialog open={projectsOpen} onOpenChange={setProjectsOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>Projects across 204</DialogTitle><DialogDescription>Current work in the Mangaluru Assembly Constituency.</DialogDescription></DialogHeader><div className="project-items"><div><img className="project-thumb" src={assets.road} alt="Resurfaced road project"/><span className="status-chip green-chip">Completed</span><strong>Road improvement – Kotekar Main Road</strong><small>Updated today</small></div><div><img className="project-thumb" src={assets.water} alt="Water supply project"/><span className="status-chip amber-chip">In progress</span><strong>Stormwater drainage renewal</strong><small>Expected completion: June 2024</small></div><div><img className="project-thumb" src={assets.pulse} alt="Community resilience planning area"/><span className="status-chip blue-chip">Planning</span><strong>Community water resilience plan</strong><small>12 localities included</small></div></div></DialogContent></Dialog>
    <Dialog open={focusListOpen} onOpenChange={setFocusListOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>Focus areas across 204</DialogTitle><DialogDescription>Where the constituency office is working right now.</DialogDescription></DialogHeader><div className="focus-grid">{focusAreas.map((f) => <button key={f.id} className="focus-card" onClick={() => { setFocusListOpen(false); setActiveFocus(f); }}><span className={`status-chip ${f.chip}`}>{f.status}</span><strong>{f.title}</strong><small>{f.desc}</small></button>)}</div></DialogContent></Dialog>
    {activeFocus && <Dialog open onOpenChange={() => setActiveFocus(null)}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>{activeFocus.title}</DialogTitle><DialogDescription><span className={`status-chip ${activeFocus.chip}`}>{activeFocus.status}</span></DialogDescription></DialogHeader><p className="focus-detail-desc">{activeFocus.desc}</p><ul className="activity-list">{activeFocus.activities.map((a: string) => <li key={a}><Check size={15}/>{a}</li>)}</ul><div className="dialog-foot"><Button className="report-button" onClick={reportRelated}>Report a related issue <Plus size={17}/></Button></div></DialogContent></Dialog>}
    <Dialog open={updatesOpen} onOpenChange={setUpdatesOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>Recent Updates</DialogTitle><DialogDescription>All updates from the constituency office.</DialogDescription></DialogHeader><div className="update-list">{updates.map((item) => <button className="update-row" key={item.title} onClick={() => { setUpdatesOpen(false); setActiveUpdate(item); }}><img src={item.image} alt=""/><div className="update-copy"><strong>{item.title}</strong><span>{item.desc}</span></div><div className="update-time">{item.time}<i/></div></button>)}</div></DialogContent></Dialog>
    {activeUpdate && <Dialog open onOpenChange={() => setActiveUpdate(null)}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>{activeUpdate.title}</DialogTitle><DialogDescription>Constituency update</DialogDescription></DialogHeader><img className="update-detail-img" src={activeUpdate.image} alt={activeUpdate.title}/><div className="update-detail-meta"><span className={`status-chip ${activeUpdate.chip}`}>{activeUpdate.status}</span><span>{activeUpdate.time}</span></div><p className="update-detail-body">{activeUpdate.body}</p><div className="dialog-foot"><Button className="report-button" onClick={reportRelated}>Report a related issue <Plus size={17}/></Button></div></DialogContent></Dialog>}
    <Dialog open={mapOpen} onOpenChange={setMapOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>Constituency Map</DialogTitle><DialogDescription>Zone-wise issue load across Mangaluru Assembly Constituency.</DialogDescription></DialogHeader><div className="map-art large"><div className="map-lines"/><div className="map-label label-a">Surathkal</div><div className="map-label label-b">Moodbidri</div><div className="map-label label-c">Ullal</div><div className="map-label label-d">Talapady</div><div className="map-label label-e">Mangaluru</div><div className="bubble red-b">23<small>Ullal</small></div><div className="bubble amber-b">11<small>Thokottu</small></div><div className="bubble green-b">9<small>Talapady</small></div></div><div className="zone-list">{zones.map((z) => <div className="zone-row" key={z.name}><span>{z.name}</span><span className={`zone-count ${z.tone}`}>{z.count} {z.count === 1 ? "issue" : "issues"}</span></div>)}</div></DialogContent></Dialog>
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>Office & Account</DialogTitle><DialogDescription>Constituency office details for the Mangaluru Assembly Constituency.</DialogDescription></DialogHeader><div className="settings-list"><div className="settings-row"><div><div className="s-label">Office hours</div><div className="s-val">10:00 AM - 6:00 PM (Mon - Sat)</div></div><Clock3 size={17} className="green"/></div><div className="settings-row"><div><div className="s-label">Constituency office</div><div className="s-val"><a href={`tel:${OFFICE_PHONE}`} className="office-tel">{OFFICE_PHONE}</a></div></div><button className="copy-btn" onClick={() => copyText(OFFICE_PHONE, "Office number")}><Copy size={13}/>Copy</button></div><div className="settings-row"><div><div className="s-label">Session</div><div className="s-val">Signed in as U.T. Khader</div></div><button className="copy-btn" onClick={() => { setSettingsOpen(false); setSignOutOpen(true); }}><LogOut size={13}/>Sign out</button></div></div></DialogContent></Dialog>
    <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>Sign out?</DialogTitle><DialogDescription>You will need to sign back in to continue using the constituency desk.</DialogDescription></DialogHeader><div className="dialog-actions"><Button variant="outline" onClick={() => setSignOutOpen(false)}>Cancel</Button><Button className="report-button" onClick={confirmSignOut}>Sign out <LogOut size={16}/></Button></div></DialogContent></Dialog>
    <Dialog open={locationOpen} onOpenChange={setLocationOpen}><DialogContent className="dark-dialog"><DialogHeader><DialogTitle>Select constituency</DialogTitle><DialogDescription>Choose the area you want to monitor.</DialogDescription></DialogHeader><div className="location-options">{["Mangaluru Assembly Constituency", "Surathkal", "Ullal", "Talapady"].map((name, i) => <button key={name} onClick={() => { setLocationOpen(false); toast(`${name} selected`); }} className={i === 0 ? "selected-location" : ""}><MapPin size={17}/>{name}{i === 0 && <Check size={16}/>}</button>)}</div></DialogContent></Dialog>
    <Sheet open={profileOpen} onOpenChange={setProfileOpen}><SheetContent className="dark-sheet"><SheetHeader><SheetTitle>Account & Office</SheetTitle></SheetHeader><div className="sheet-profile"><div className="avatar large">UK</div><h3>U.T. Khader</h3><p>MLA, Mangaluru</p><button onClick={() => { setProfileOpen(false); setSettingsOpen(true); }}><Settings size={17}/> Profile settings</button><button onClick={() => copyText(OFFICE_PHONE, "Office number")}><Phone size={17}/> Contact office</button><button onClick={() => { setProfileOpen(false); setSignOutOpen(true); }}><ShieldCheck size={17}/> Sign out</button></div></SheetContent></Sheet>
    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}><SheetContent side="left" className="dark-sheet"><SheetHeader><SheetTitle>NAMMA <span>204</span></SheetTitle></SheetHeader><div className="mobile-links">{navItems.map(({label, icon: Icon}) => <button key={label} onClick={() => nav(label)} className={active === label ? "active" : ""}><Icon size={19}/>{label}</button>)}<button onClick={report}><Plus size={19}/>Report an Issue</button></div></SheetContent></Sheet>
  </div>;
}
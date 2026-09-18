import { useState } from 'react';
import {
  Activity, Bell, CheckCircle2, ChevronRight, CircleHelp, FolderKanban,
  Home, Menu, Plus, Search, Settings, Sparkles, Users, X
} from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: Home },
  { label: 'Projects', icon: FolderKanban },
  { label: 'Team', icon: Users },
  { label: 'Activity', icon: Activity },
];

const activities = [
  ['JD', 'Jordan completed “Define launch goals”', '12 min ago', 'green'],
  ['AR', 'Alex added a comment to Mobile redesign', '48 min ago', 'purple'],
  ['MK', 'You created a new project', '2 hr ago', 'orange'],
];

export default function App() {
  const [active, setActive] = useState('Overview');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
        <div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><span>workspace</span><button className="close-menu" onClick={() => setMenuOpen(false)}><X size={18} /></button></div>
        <button className="workspace-switcher"><span className="workspace-avatar">M</span><span><strong>My workspace</strong><small>Personal</small></span><ChevronRight size={16} /></button>
        <nav>{navItems.map(({ label, icon: Icon }) => <button key={label} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => { setActive(label); setMenuOpen(false); }}><Icon size={18} />{label}</button>)}</nav>
        <div className="sidebar-bottom"><button className="nav-item"><Settings size={18} />Settings</button><button className="nav-item"><CircleHelp size={18} />Help center</button><div className="profile"><div className="profile-avatar">MG</div><span><strong>Maggie</strong><small>maggie@example.com</small></span><ChevronRight size={15} /></div></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(true)}><Menu size={22} /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{active}</strong></div><div className="top-actions"><button className="icon-button"><Search size={19} /></button><button className="icon-button notification"><Bell size={19} /><i /></button><button className="new-button"><Plus size={18} /> <span>New project</span></button></div></header>
        <div className="page">
          <section className="welcome"><div><p className="eyebrow">Friday, September 18, 2026</p><h1>Good morning, Maggie <span>👋</span></h1><p className="subtitle">Here’s what’s happening across your workspace today.</p></div><button className="primary-button"><Plus size={18} /> Create something</button></section>
          <section className="stats-grid"><Stat label="Active projects" value="12" change="+2 this month" icon={<FolderKanban />} tone="blue" /><Stat label="Tasks completed" value="84" change="+18% from last month" icon={<CheckCircle2 />} tone="green" /><Stat label="Team members" value="8" change="2 pending invites" icon={<Users />} tone="purple" /><Stat label="Activity score" value="92%" change="+6% this week" icon={<Activity />} tone="orange" /></section>
          <div className="content-grid"><section className="card projects-card"><div className="card-heading"><div><h2>Recent projects</h2><p>Keep an eye on your most active work.</p></div><button className="text-button">View all <ChevronRight size={15} /></button></div><Project name="Website redesign" tag="Design" progress={72} color="blue" due="Due in 4 days" /><Project name="Mobile app launch" tag="Product" progress={46} color="purple" due="Due in 12 days" /><Project name="Q4 marketing plan" tag="Marketing" progress={28} color="orange" due="Due in 21 days" /></section><section className="card activity-card"><div className="card-heading"><div><h2>Recent activity</h2><p>Latest updates from your team.</p></div><button className="more-button">•••</button></div><div className="activity-list">{activities.map(([initials, text, time, tone]) => <div className="activity-row" key={text}><div className={`activity-avatar ${tone}`}>{initials}</div><div><p>{text}</p><small>{time}</small></div></div>)}</div><button className="activity-link">View all activity <ChevronRight size={15} /></button></section></div>
          <section className="quick-card"><div className="quick-icon"><Sparkles size={21} /></div><div><h2>Make your workspace yours</h2><p>Invite your team and create your first project to get the most out of Workspace.</p></div><button className="secondary-button">Get started <ChevronRight size={16} /></button></section>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, change, icon, tone }: { label: string; value: string; change: string; icon: React.ReactNode; tone: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><p>{label}</p><strong>{value}</strong><small>{change}</small></div>; }
function Project({ name, tag, progress, color, due }: { name: string; tag: string; progress: number; color: string; due: string }) { return <div className="project-row"><div className="project-title"><span className={`project-dot ${color}`} /><div><strong>{name}</strong><span className="tag">{tag}</span></div></div><div className="progress-wrap"><div className="progress-label"><small>{progress}% complete</small><small>{due}</small></div><div className="progress"><span className={color} style={{ width: `${progress}%` }} /></div></div><ChevronRight className="row-chevron" size={17} /></div>; }

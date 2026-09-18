import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Activity, Bell, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp,
  ClipboardList, FolderKanban, Home, Menu, Pencil, Plus, Search, Settings,
  Sparkles, Trash2, UserPlus, Users, X
} from 'lucide-react';

type Project = { id: string; name: string; tag: string; progress: number; color: string; due: string; description: string };
type ActivityItem = { id: string; text: string; time: string; tone: string };

const initialProjects: Project[] = [
  { id: 'website', name: 'Website redesign', tag: 'Design', progress: 72, color: 'blue', due: 'Due in 4 days', description: 'Refresh the marketing site and improve conversion.' },
  { id: 'mobile', name: 'Mobile app launch', tag: 'Product', progress: 46, color: 'purple', due: 'Due in 12 days', description: 'Prepare the mobile release for launch.' },
  { id: 'marketing', name: 'Q4 marketing plan', tag: 'Marketing', progress: 28, color: 'orange', due: 'Due in 21 days', description: 'Plan campaigns and content for the next quarter.' },
];
const navItems = [{ label: 'Overview', icon: Home }, { label: 'Projects', icon: FolderKanban }, { label: 'Team', icon: Users }, { label: 'Activity', icon: Activity }];
const seedActivity: ActivityItem[] = [
  { id: '1', text: 'Jordan completed “Define launch goals”', time: '12 min ago', tone: 'green' },
  { id: '2', text: 'Alex added a comment to Mobile app launch', time: '48 min ago', tone: 'purple' },
  { id: '3', text: 'You created a new project', time: '2 hr ago', tone: 'orange' },
];

function read<T>(key: string, fallback: T): T { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }

export default function App() {
  const [active, setActive] = useState('Overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(() => read('workspace-projects', initialProjects));
  const [activity, setActivity] = useState<ActivityItem[]>(() => read('workspace-activity', seedActivity));
  const [query, setQuery] = useState('');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => { localStorage.setItem('workspace-projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('workspace-activity', JSON.stringify(activity)); }, [activity]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2600); return () => window.clearTimeout(timer); }, [toast]);

  const filteredProjects = useMemo(() => projects.filter(p => `${p.name} ${p.tag}`.toLowerCase().includes(query.toLowerCase())), [projects, query]);
  const openForm = (project?: Project) => { setEditing(project ?? null); setShowProjectForm(true); };
  const saveProject = (project: Project) => {
    setProjects(current => editing ? current.map(item => item.id === project.id ? project : item) : [project, ...current]);
    setActivity(current => [{ id: crypto.randomUUID(), text: editing ? `You updated “${project.name}”` : `You created “${project.name}”`, time: 'just now', tone: editing ? 'purple' : 'orange' }, ...current].slice(0, 8));
    setShowProjectForm(false); setToast(editing ? 'Project updated' : 'Project created');
  };
  const removeProject = (project: Project) => { if (!window.confirm(`Delete “${project.name}”?`)) return; setProjects(current => current.filter(item => item.id !== project.id)); setToast('Project deleted'); };
  const select = (label: string) => { setActive(label); setMenuOpen(false); };

  return <div className="app-shell">
    <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><span>workspace</span><button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <button className="workspace-switcher" onClick={() => setToast('Workspace switching is ready for your teams')}><span className="workspace-avatar">M</span><span><strong>My workspace</strong><small>Personal</small></span><ChevronDown size={16} /></button>
      <nav>{navItems.map(({ label, icon: Icon }) => <button key={label} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => select(label)}><Icon size={18} />{label}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => select('Settings')}><Settings size={18} />Settings</button><button className="nav-item" onClick={() => setToast('Help center is coming soon')}><CircleHelp size={18} />Help center</button><div className="profile"><div className="profile-avatar">MG</div><span><strong>Maggie</strong><small>maggie@example.com</small></span></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={22} /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{active}</strong></div><div className="top-actions"><label className="search"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects" aria-label="Search projects" /></label><button className="icon-button notification" onClick={() => select('Activity')} aria-label="View notifications"><Bell size={19} /><i /></button><button className="new-button" onClick={() => openForm()}><Plus size={18} /> <span>New project</span></button></div></header>
      <div className="page">
        {active === 'Overview' && <Overview projects={filteredProjects} activity={activity} onCreate={() => openForm()} onEdit={openForm} onDelete={removeProject} />}
        {active === 'Projects' && <Projects projects={filteredProjects} onCreate={() => openForm()} onEdit={openForm} onDelete={removeProject} />}
        {active === 'Team' && <Team onInvite={() => setToast('Invitation flow ready to connect')} />}
        {active === 'Activity' && <ActivityView activity={activity} />}
        {active === 'Settings' && <SettingsView onReset={() => { if (window.confirm('Reset sample data?')) { setProjects(initialProjects); setActivity(seedActivity); setToast('Sample data restored'); } }} />}
      </div>
    </main>
    {showProjectForm && <ProjectForm initial={editing} onSave={saveProject} onClose={() => setShowProjectForm(false)} />}
    {toast && <div className="toast"><Check size={17} />{toast}</div>}
  </div>;
}

function Overview({ projects, activity, onCreate, onEdit, onDelete }: { projects: Project[]; activity: ActivityItem[]; onCreate: () => void; onEdit: (p: Project) => void; onDelete: (p: Project) => void }) {
  const completed = projects.length ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0;
  return <><section className="welcome"><div><p className="eyebrow">Friday, September 18, 2026</p><h1>Good morning, Maggie <span>👋</span></h1><p className="subtitle">Here’s what’s happening across your workspace today.</p></div><button className="primary-button" onClick={onCreate}><Plus size={18} /> Create project</button></section><section className="stats-grid"><Stat label="Active projects" value={String(projects.length)} change="Live workspace data" icon={<FolderKanban />} tone="blue" /><Stat label="Average progress" value={`${completed}%`} change="Across all projects" icon={<CheckCircle2 />} tone="green" /><Stat label="Team members" value="8" change="2 pending invites" icon={<Users />} tone="purple" /><Stat label="Activity score" value="92%" change="+6% this week" icon={<Activity />} tone="orange" /></section><div className="content-grid"><section className="card projects-card"><div className="card-heading"><div><h2>Recent projects</h2><p>Keep an eye on your most active work.</p></div><button className="text-button" onClick={onCreate}>New project <Plus size={15} /></button></div>{projects.length ? projects.slice(0, 4).map(p => <ProjectRow key={p.id} project={p} onEdit={onEdit} onDelete={onDelete} />) : <Empty onCreate={onCreate} />}</section><section className="card activity-card"><div className="card-heading"><div><h2>Recent activity</h2><p>Latest updates from your team.</p></div></div><ActivityList items={activity.slice(0, 4)} /></section></div><section className="quick-card"><div className="quick-icon"><Sparkles size={21} /></div><div><h2>Make your workspace yours</h2><p>Invite your team and create your first project to get the most out of Workspace.</p></div><button className="secondary-button" onClick={onCreate}>Get started <ChevronRight size={16} /></button></section></>;
}
function Projects({ projects, onCreate, onEdit, onDelete }: { projects: Project[]; onCreate: () => void; onEdit: (p: Project) => void; onDelete: (p: Project) => void }) { return <><section className="page-heading"><div><p className="eyebrow">Workspace</p><h1>Projects</h1><p className="subtitle">Plan, track, and ship great work together.</p></div><button className="primary-button" onClick={onCreate}><Plus size={18} /> New project</button></section><section className="card full-card">{projects.length ? projects.map(p => <ProjectRow key={p.id} project={p} onEdit={onEdit} onDelete={onDelete} />) : <Empty onCreate={onCreate} />}</section></>; }
function Team({ onInvite }: { onInvite: () => void }) { const members = [['MG', 'Maggie', 'Owner', 'orange'], ['JD', 'Jordan Davis', 'Designer', 'green'], ['AR', 'Alex Rivera', 'Developer', 'purple'], ['SK', 'Sam Kim', 'Marketing', 'blue']]; return <><section className="page-heading"><div><p className="eyebrow">Workspace</p><h1>Team</h1><p className="subtitle">Work better together with your team.</p></div><button className="primary-button" onClick={onInvite}><UserPlus size={18} /> Invite member</button></section><section className="card team-grid">{members.map(([initials, name, role, tone]) => <div className="member" key={name}><div className={`member-avatar ${tone}`}>{initials}</div><strong>{name}</strong><span>{role}</span><button className="member-action" onClick={onInvite}>•••</button></div>)}</section></>; }
function ActivityView({ activity }: { activity: ActivityItem[] }) { return <><section className="page-heading"><div><p className="eyebrow">Workspace</p><h1>Activity</h1><p className="subtitle">Everything happening in your workspace.</p></div></section><section className="card full-card"><ActivityList items={activity} /></section></>; }
function SettingsView({ onReset }: { onReset: () => void }) { return <><section className="page-heading"><div><p className="eyebrow">Workspace</p><h1>Settings</h1><p className="subtitle">Manage your workspace preferences.</p></div></section><section className="card settings-card"><div><h2>Workspace preferences</h2><p>Universal Workspace saves your projects locally in this browser.</p></div><button className="secondary-button danger" onClick={onReset}>Restore sample data</button></section></>; }
function Stat({ label, value, change, icon, tone }: { label: string; value: string; change: string; icon: ReactNode; tone: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><p>{label}</p><strong>{value}</strong><small>{change}</small></div>; }
function ProjectRow({ project, onEdit, onDelete }: { project: Project; onEdit: (p: Project) => void; onDelete: (p: Project) => void }) { return <div className="project-row"><div className="project-title"><span className={`project-dot ${project.color}`} /><div><strong>{project.name}</strong><span className="tag">{project.tag}</span></div></div><div className="progress-wrap"><div className="progress-label"><small>{project.progress}% complete</small><small>{project.due}</small></div><div className="progress"><span className={project.color} style={{ width: `${project.progress}%` }} /></div></div><div className="row-actions"><button onClick={() => onEdit(project)} aria-label={`Edit ${project.name}`}><Pencil size={15} /></button><button onClick={() => onDelete(project)} aria-label={`Delete ${project.name}`}><Trash2 size={15} /></button></div></div>; }
function ActivityList({ items }: { items: ActivityItem[] }) { return <div className="activity-list">{items.map(item => <div className="activity-row" key={item.id}><div className={`activity-avatar ${item.tone}`}>{item.text.includes('Jordan') ? 'JD' : item.text.includes('Alex') ? 'AR' : 'MG'}</div><div><p>{item.text}</p><small>{item.time}</small></div></div>)}</div>; }
function Empty({ onCreate }: { onCreate: () => void }) { return <div className="empty"><ClipboardList size={28} /><p>No projects found.</p><button className="text-button" onClick={onCreate}>Create your first project</button></div>; }
function ProjectForm({ initial, onSave, onClose }: { initial: Project | null; onSave: (p: Project) => void; onClose: () => void }) { const [form, setForm] = useState<Project>(initial ?? { id: crypto.randomUUID(), name: '', tag: 'Product', progress: 0, color: 'blue', due: 'No due date', description: '' }); const submit = (e: FormEvent) => { e.preventDefault(); if (form.name.trim()) onSave({ ...form, name: form.name.trim() }); }; return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><form className="modal" onSubmit={submit}><div className="modal-heading"><div><h2>{initial ? 'Edit project' : 'Create project'}</h2><p>Keep your work organized and moving forward.</p></div><button type="button" onClick={onClose} aria-label="Close"><X size={19} /></button></div><label>Project name<input autoFocus required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Website redesign" /></label><div className="form-grid"><label>Category<select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}><option>Product</option><option>Design</option><option>Marketing</option><option>Engineering</option></select></label><label>Progress (%)<input type="number" min="0" max="100" value={form.progress} onChange={e => setForm({ ...form, progress: Math.max(0, Math.min(100, Number(e.target.value))) })} /></label></div><label>Due date<input value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} placeholder="Due in 10 days" /></label><label>Description<textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" /></label><div className="modal-actions"><button type="button" className="cancel-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{initial ? 'Save changes' : 'Create project'}</button></div></form></div>; }

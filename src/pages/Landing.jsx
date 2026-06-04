import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  LockKeyhole,
  Route,
  ShieldCheck,
  UserRound,
  UsersRound,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import serviceMarketplaceHero from '../assets/service-marketplace-hero.png';
import logo from '../assets/smarthub-logo.svg';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#roles', label: 'Roles' },
];

const features = [
  {
    title: 'Request services easily',
    text: 'Create service requests with the details teams need to respond quickly.',
    icon: ClipboardList,
  },
  {
    title: 'Track booking progress',
    text: 'Follow each request from submission through completion with clear status updates.',
    icon: Route,
  },
  {
    title: 'Provider work management',
    text: 'Give providers a focused place to review assigned work and keep jobs moving.',
    icon: Wrench,
  },
  {
    title: 'Admin control and support',
    text: 'Support operations with secure oversight for users, providers, and requests.',
    icon: ShieldCheck,
  },
];

const howItWorks = [
  {
    title: 'Create account',
    text: 'Register securely with your email and basic details.',
  },
  {
    title: 'Choose role',
    text: 'Start as a user or provider, with admin access handled separately.',
  },
  {
    title: 'Manage requests',
    text: 'Request, assign, track, and complete service work in one platform.',
  },
];

const roles = [
  {
    title: 'User',
    text: 'Submit service requests and track every booking in a simple workspace.',
    icon: UserRound,
  },
  {
    title: 'Provider',
    text: 'Manage assigned requests and stay aligned with customer needs.',
    icon: Wrench,
  },
  {
    title: 'Admin',
    text: 'Oversee people, bookings, complaints, reports, and platform support.',
    icon: UsersRound,
  },
];

export default function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-white via-brand-50/40 to-white text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" to="/" aria-label="SmartHub home">
            <img className="h-10 w-10 rounded-lg shadow-soft" src={logo} alt="SmartHub logo" />
            <span className="text-lg font-bold tracking-normal text-slate-950">SmartHub</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <a key={item.href} className="text-sm font-medium text-slate-600 transition hover:text-brand-700" href={item.href}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link className="btn-muted" to="/login">Login</Link>
            <Link className="btn-primary" to="/register">Register</Link>
          </div>
        </nav>
      </header>

      <section className="relative">
        <div className="absolute left-1/2 top-0 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-semibold text-brand-800 shadow-soft">
              <LockKeyhole className="h-4 w-4" />
              Secure service coordination for every role
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              Service management made simple for everyone.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              SmartHub helps users request services, providers manage work, and admins oversee operations from one secure platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary px-5 py-3" to="/register">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="btn-muted px-5 py-3" to="/login">Login</Link>
            </div>

            <div className="mt-10 grid gap-3 text-sm font-medium text-slate-600 sm:grid-cols-3">
              {['Fast setup', 'Role-based access', 'Clear request tracking'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-200/50 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-brand-200/50 blur-3xl" />

            <div className="relative mx-auto max-w-xl rounded-[2rem] border border-brand-100/80 bg-gradient-to-br from-white via-brand-50/80 to-brand-50/80 p-3 shadow-soft sm:p-4">
              <div className="overflow-hidden rounded-[1.5rem] border border-white bg-white shadow-sm">
                <img
                  className="aspect-[4/3] w-full object-cover object-center"
                  src={serviceMarketplaceHero}
                  alt="SmartHub service providers including an electrician, cleaner, plumber, technician, and support worker"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
            Everything needed to keep service work clear.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            SmartHub keeps each role focused on the next step without crowding the experience.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-soft">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-gradient-to-b from-white to-brand-50/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Start simple, then manage every request with confidence.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                The public flow stays lightweight, while secure workspaces handle the right tools for each role after login.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {howItWorks.map((step, index) => (
                <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <div className="mb-6 grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="roles" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Roles</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
            Built for users, providers, and admins.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {roles.map((role) => (
            <article key={role.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-soft">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-50 text-brand-700">
                <role.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950">{role.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{role.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-10 text-center text-white shadow-soft sm:px-10">
          <LayoutDashboard className="mx-auto h-9 w-9 text-brand-100" />
          <h2 className="mt-4 text-3xl font-semibold tracking-normal">Ready to simplify service management?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-brand-50">
            Create your account and start using the workspace designed for your role.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="btn bg-white px-5 py-3 text-brand-800 hover:bg-brand-50" to="/register">Get Started</Link>
            <Link className="btn border border-white/30 bg-white/10 px-5 py-3 text-white hover:bg-white/20" to="/login">Login</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img className="h-8 w-8 rounded-lg" src={logo} alt="SmartHub logo" />
            <span className="font-semibold text-slate-700">SmartHub</span>
          </div>
          <div className="flex items-center gap-5">
            {navLinks.map((item) => (
              <a key={item.href} className="transition hover:text-brand-700" href={item.href}>
                {item.label}
              </a>
              ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

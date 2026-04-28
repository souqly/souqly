'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Tag,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Store,
  ShoppingBag,
} from 'lucide-react'
import { signOut } from '@/lib/actions/auth'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DashboardMerchant {
  id: string
  name: string
  slug: string
  subscription_status: string
  status: string
}

interface DashboardShellProps {
  merchant: DashboardMerchant
  children: React.ReactNode
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  external?: boolean
}

// ---------------------------------------------------------------------------
// Constantes de navigation
// ---------------------------------------------------------------------------

function buildNavItems(slug: string): NavItem[] {
  return [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Produits',
      href: '/dashboard/produits',
      icon: Package,
    },
    {
      label: 'Catégories',
      href: '/dashboard/categories',
      icon: Tag,
    },
    {
      label: 'Commandes',
      href: '/dashboard/commandes',
      icon: ShoppingBag,
    },
    {
      label: 'Paramètres',
      href: '/dashboard/parametres',
      icon: Settings,
    },
    {
      label: 'Voir le catalogue',
      href: `/${slug}/catalogue`,
      icon: ExternalLink,
      external: true,
    },
  ]
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function DashboardShell({ merchant, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const navItems = buildNavItems(merchant.slug)

  function isActive(href: string): boolean {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 w-64 bg-neutral-900 border-r border-white/5',
          'flex flex-col transition-transform duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:z-auto',
        ].join(' ')}
      >
        {/* Logo / Nom de la boutique */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Store className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{merchant.name}</p>
            <p className="text-xs text-neutral-500 truncate">/{merchant.slug}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => setMobileOpen(false)}
                className={[
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-indigo-600/10 text-indigo-400'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5',
                ].join(' ')}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
                {item.external && (
                  <ExternalLink className="h-3 w-3 ml-auto text-neutral-600" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Déconnexion */}
        <div className="px-3 py-4 border-t border-white/5">
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span>Déconnexion</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-neutral-900">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-indigo-600 flex items-center justify-center">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white truncate max-w-[160px]">
              {merchant.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

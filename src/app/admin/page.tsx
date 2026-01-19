'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Loader2,
  Check,
  X,
  LogOut,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  LayoutDashboard,
  ListChecks,
  Settings,
  RefreshCw,
  Bot,
  Wrench,
  AppWindow,
  Globe,
  Github,
  FileText,
  Shield,
  AlertTriangle,
  Search,
  ChevronRight,
  Wallet,
} from 'lucide-react'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { BackgroundGrid } from '@/components/ui/background-grid'
import { cn } from '@/lib/utils'

interface Listing {
  id: string
  name: string
  slug: string
  type: 'app' | 'tool' | 'agent'
  short_description: string
  long_description?: string
  status: string
  visibility: string
  review_state: string
  tags: string[]
  links: Record<string, string>
  submitter_wallet?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
  categories: string[]
  builder?: {
    name: string
    slug: string
    bio?: string
    website?: string
    twitter?: string
  }
}

interface DashboardStats {
  pending: number
  approved: number
  rejected: number
  featured: number
  total: number
}

const typeIcons = {
  agent: Bot,
  tool: Wrench,
  app: AppWindow,
}

const typeColors = {
  agent: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  tool: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  app: "text-green-500 bg-green-500/10 border-green-500/20",
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [adminCode, setAdminCode] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(true)
  const [pendingListings, setPendingListings] = useState<Listing[]>([])
  const [allListings, setAllListings] = useState<Listing[]>([])
  const [stats, setStats] = useState<DashboardStats>({ pending: 0, approved: 0, rejected: 0, featured: 0, total: 0 })
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // Rejection dialog state
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [listingToReject, setListingToReject] = useState<string | null>(null)

  // Check auth status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Fetch data when authenticated
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      const [pendingRes, allRes] = await Promise.all([
        fetch('/api/admin/pending'),
        fetch('/api/admin/listings'),
      ])

      const pendingData = await pendingRes.json()
      const allData = await allRes.json()

      const pending = pendingData.listings || []
      const all = allData.listings || []

      setPendingListings(pending)
      setAllListings(all)

      // Calculate stats
      const approved = all.filter((l: Listing) => l.review_state === 'approved').length
      const rejected = all.filter((l: Listing) => l.review_state === 'rejected').length
      const featured = all.filter((l: Listing) => l.visibility === 'featured').length

      setStats({
        pending: pending.length,
        approved,
        rejected,
        featured,
        total: all.length,
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function checkAuth() {
    try {
      const res = await fetch('/api/admin')
      const data = await res.json()
      setIsAuthenticated(data.authenticated)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: adminCode }),
      })

      if (res.ok) {
        setIsAuthenticated(true)
        setAdminCode('')
      } else {
        const data = await res.json()
        setLoginError(data.error || 'Invalid admin code')
      }
    } catch {
      setLoginError('Connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin', { method: 'DELETE' })
    setIsAuthenticated(false)
    setPendingListings([])
    setAllListings([])
  }

  async function handleApprove(id: string, visibility: 'public' | 'featured' = 'public') {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/listings/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility }),
      })

      if (res.ok) {
        await fetchData()
        setSelectedListing(null)
      }
    } catch (error) {
      console.error('Failed to approve listing:', error)
    } finally {
      setActionLoading(null)
    }
  }

  function openRejectDialog(id: string) {
    setListingToReject(id)
    setRejectReason('')
    setRejectDialogOpen(true)
  }

  async function handleReject() {
    if (!listingToReject) return

    setActionLoading(listingToReject)
    setRejectDialogOpen(false)

    try {
      const res = await fetch(`/api/admin/listings/${listingToReject}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason || undefined }),
      })

      if (res.ok) {
        await fetchData()
        setSelectedListing(null)
      }
    } catch (error) {
      console.error('Failed to reject listing:', error)
    } finally {
      setActionLoading(null)
      setListingToReject(null)
      setRejectReason('')
    }
  }

  // Filter listings by search
  const filteredPending = pendingListings.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.builder?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAll = allListings.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.builder?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Loading state
  if (loading && isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Initializing Dashboard...</p>
        </div>
      </div>
    )
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
        <BackgroundGrid className="opacity-10" />
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <SpotlightCard spotlightColor="rgba(88, 190, 215, 0.15)">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-muted/50 border border-border/50 flex items-center justify-center shadow-2xl">
                  <Image
                    src="/think-brainfist-darkmode-mode.svg"
                    alt="Think"
                    width={48}
                    height={48}
                  />
                </div>
                <h1 className="font-heading text-3xl font-normal text-foreground mb-2">Think Marketplace</h1>
                <p className="text-muted-foreground">Admin Authentication</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Admin Access Code"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    autoFocus
                    className="h-14 text-center text-xl tracking-widest rounded-xl bg-muted/30 border-border/50 focus:ring-primary/20"
                  />
                </div>
                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {loginError}
                  </motion.div>
                )}
                <Button type="submit" className="w-full h-14 text-base rounded-xl shadow-lg shadow-primary/20" disabled={loading || !adminCode}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Enter Dashboard
                    </>
                  )}
                </Button>
              </form>
            </div>
          </SpotlightCard>
          <p className="text-[10px] uppercase tracking-[0.2em] text-center text-muted-foreground/50 mt-8 font-semibold">
            SECURE ACCESS ONLY • THINK PROTOCOL
          </p>
        </motion.div>
      </div>
    )
  }

  // Render listing card
  function renderListingCard(listing: Listing, showActions = true) {
    const TypeIcon = typeIcons[listing.type]
    const isSelected = selectedListing?.id === listing.id

    return (
      <div
        key={listing.id}
        onClick={() => setSelectedListing(listing)}
        className={cn(
          "group relative cursor-pointer transition-all duration-300 rounded-xl border p-4 bg-card/50 backdrop-blur-sm",
          isSelected ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
        )}
      >
        <div className="flex items-start gap-4">
          <div className={cn("shrink-0 h-12 w-12 rounded-xl flex items-center justify-center border", typeColors[listing.type])}>
            <TypeIcon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading text-lg font-medium truncate group-hover:text-primary transition-colors">{listing.name}</h3>
              {listing.visibility === 'featured' && (
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
              {listing.short_description}
            </p>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
              <span className="text-foreground/70">{listing.builder?.name || 'Unknown Builder'}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(listing.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {showActions && listing.review_state === 'pending' && (
            <div className="flex gap-1 shrink-0 self-center">
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-lg text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                onClick={(e) => {
                  e.stopPropagation()
                  handleApprove(listing.id)
                }}
                disabled={actionLoading === listing.id}
              >
                {actionLoading === listing.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-5 w-5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10"
                onClick={(e) => {
                  e.stopPropagation()
                  openRejectDialog(listing.id)
                }}
                disabled={actionLoading === listing.id}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render detail panel
  function renderDetailPanel() {
    if (!selectedListing) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/50 bg-muted/5">
          <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
            <ListChecks className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-lg font-heading font-normal text-muted-foreground">Select a submission to review details</h3>
          <p className="text-sm text-muted-foreground/60 mt-2">All project data and links will appear here</p>
        </div>
      )
    }

    const TypeIcon = typeIcons[selectedListing.type]

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-24"
      >
        <Card className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden">
          <CardHeader className="pb-6 border-b border-border/50 bg-muted/20">
            <div className="flex items-start gap-4">
              <div className={cn("shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center border shadow-inner", typeColors[selectedListing.type])}>
                <TypeIcon className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-2xl font-heading font-normal">{selectedListing.name}</CardTitle>
                  {selectedListing.visibility === 'featured' && (
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={cn(
                    "uppercase text-[10px] tracking-widest",
                    selectedListing.review_state === 'approved' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' :
                    selectedListing.review_state === 'rejected' ? 'text-red-500 border-red-500/30 bg-red-500/5' : 'text-amber-500 border-amber-500/30 bg-amber-500/5'
                  )}>
                    {selectedListing.review_state}
                  </Badge>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{selectedListing.type}</span>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{selectedListing.status}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Description */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Short Description</h4>
              <p className="text-base text-foreground leading-relaxed">
                {selectedListing.short_description}
              </p>
            </div>

            {selectedListing.long_description && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Detailed Overview</h4>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap max-h-60 overflow-y-auto pr-4 leading-relaxed custom-scrollbar">
                  {selectedListing.long_description}
                </div>
              </div>
            )}

            {/* Builder */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Builder Profile</h4>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <Avatar className="h-12 w-12 border-2 border-background shadow-xl">
                  <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                    {selectedListing.builder?.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-lg font-medium">{selectedListing.builder?.name || 'Unknown Builder'}</p>
                  {selectedListing.builder?.website && (
                    <a
                      href={selectedListing.builder.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1.5"
                    >
                      Visit Profile <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Links */}
            {Object.keys(selectedListing.links).filter(k => selectedListing.links[k]).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Project Links</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedListing.links).map(([key, url]) => {
                    if (!url) return null
                    const Icon = key === 'website' ? Globe : key === 'repo' ? Github : key === 'docs' ? FileText : ExternalLink
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all group"
                      >
                        <div className="flex items-center gap-2">
                           <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                           <span className="text-sm font-medium capitalize">{key}</span>
                        </div>
                        <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Wallet */}
            {selectedListing.submitter_wallet && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Submission Source</h4>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/50 group">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs font-mono text-muted-foreground break-all group-hover:text-foreground transition-colors">
                    {selectedListing.submitter_wallet}
                  </p>
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {selectedListing.review_state === 'rejected' && selectedListing.rejection_reason && (
              <div className="pt-4">
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <h4 className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Rejection Feedback
                  </h4>
                  <p className="text-sm text-red-400/80 leading-relaxed">
                    {selectedListing.rejection_reason}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-border/50">
              {selectedListing.review_state === 'pending' ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                    onClick={() => handleApprove(selectedListing.id)}
                    disabled={actionLoading === selectedListing.id}
                  >
                    {actionLoading === selectedListing.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                    )}
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                    onClick={() => handleApprove(selectedListing.id, 'featured')}
                    disabled={actionLoading === selectedListing.id}
                  >
                    <Star className="h-5 w-5 mr-2" />
                    Feature
                  </Button>
                  <Button
                    variant="ghost"
                    className="col-span-2 h-12 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => openRejectDialog(selectedListing.id)}
                    disabled={actionLoading === selectedListing.id}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Reject Submission
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                   {selectedListing.review_state === 'approved' && (
                      <Link href={`/listing/${selectedListing.slug}`} target="_blank" className="flex-1">
                        <Button className="w-full h-12 rounded-xl" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Live Project
                        </Button>
                      </Link>
                   )}
                   <Button variant="ghost" className="h-12 px-6 rounded-xl" onClick={() => setSelectedListing(null)}>
                     Close
                   </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <BackgroundGrid className="opacity-[0.03]" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
              <Image
                src="/think-brainfist-darkmode-mode.svg"
                alt="Think"
                width={28}
                height={28}
              />
            </div>
            <div>
              <h1 className="font-heading text-xl font-normal text-foreground">Think OS</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Admin Central</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={fetchData} className="rounded-lg h-10 px-4 hover:bg-muted/50">
              <RefreshCw className="h-4 w-4 mr-2 text-primary" />
              Sync
            </Button>
            <div className="w-px h-6 bg-border/50 mx-1" />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-lg h-10 px-4 text-muted-foreground hover:text-red-500 hover:bg-red-500/5">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <TabsList className="h-14 p-1.5 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm self-start">
              <TabsTrigger value="overview" className="rounded-xl px-6 gap-2 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-primary">
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-xl px-6 gap-2 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-primary">
                <Clock className="h-4 w-4" />
                Review
                {stats.pending > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
                    {stats.pending}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" className="rounded-xl px-6 gap-2 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-primary">
                <ListChecks className="h-4 w-4" />
                Directory
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-xl px-6 gap-2 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-lg data-[state=active]:text-primary">
                <Settings className="h-4 w-4" />
                Config
              </TabsTrigger>
            </TabsList>

            {(activeTab === 'pending' || activeTab === 'all') && (
              <div className="relative group min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search project or builder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-11 rounded-2xl bg-muted/30 border-border/50 backdrop-blur-sm focus:ring-primary/20"
                />
              </div>
            )}
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-10 outline-none">
            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="cursor-pointer group" onClick={() => setActiveTab('pending')}>
                <SpotlightCard className="h-full border-amber-500/20 hover:border-amber-500/40" spotlightColor="rgba(245, 158, 11, 0.1)">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Clock className="h-7 w-7 text-amber-500" />
                      </div>
                      <span className="text-4xl font-heading font-normal text-amber-500">{stats.pending}</span>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Pending Review</p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-500/70 group-hover:text-amber-500 transition-colors">
                      Take Action <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </SpotlightCard>
              </div>

              <SpotlightCard className="h-full border-emerald-500/20" spotlightColor="rgba(16, 185, 129, 0.1)">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                    </div>
                    <span className="text-4xl font-heading font-normal text-emerald-500">{stats.approved}</span>
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Approved Projects</p>
                </div>
              </SpotlightCard>

              <SpotlightCard className="h-full border-primary/20" spotlightColor="rgba(88, 190, 215, 0.1)">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Star className="h-7 w-7 text-primary" />
                    </div>
                    <span className="text-4xl font-heading font-normal text-primary">{stats.featured}</span>
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Featured Highlights</p>
                </div>
              </SpotlightCard>

              <SpotlightCard className="h-full border-border/50" spotlightColor="rgba(255, 255, 255, 0.05)">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-muted border border-border/50 flex items-center justify-center text-muted-foreground">
                      <ListChecks className="h-7 w-7" />
                    </div>
                    <span className="text-4xl font-heading font-normal text-foreground">{stats.total}</span>
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Total Submissions</p>
                </div>
              </SpotlightCard>
            </div>

            {/* Quick Review */}
            <div className="grid gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-heading text-2xl font-normal flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                  Immediate Priority
                </h3>
                
                {pendingListings.length > 0 ? (
                  <div className="grid gap-4">
                    {pendingListings.slice(0, 4).map((listing) => renderListingCard(listing))}
                  </div>
                ) : (
                  <div className="py-20 text-center rounded-2xl border border-dashed border-border/50 bg-muted/5">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-emerald-500/50" />
                    <h4 className="text-xl font-heading font-normal text-foreground">Clean Slate</h4>
                    <p className="text-muted-foreground text-sm mt-2">All submissions have been successfully reviewed</p>
                  </div>
                )}
                
                {pendingListings.length > 4 && (
                  <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => setActiveTab('pending')}>
                    View Remaining {pendingListings.length - 4} Pending <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="font-heading text-2xl font-normal">Recent Updates</h3>
                <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 space-y-6">
                   {allListings.slice(0, 3).map(listing => (
                     <div key={listing.id} className="flex items-center gap-4">
                        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase", typeColors[listing.type])}>
                           {listing.type.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium truncate">{listing.name}</p>
                           <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{listing.review_state} • {new Date(listing.updated_at).toLocaleDateString()}</p>
                        </div>
                     </div>
                   ))}
                   <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest text-muted-foreground" onClick={() => setActiveTab('all')}>
                     Full Log
                   </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="outline-none">
            {filteredPending.length === 0 ? (
              <div className="py-32 text-center">
                <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6 text-muted-foreground/30">
                  <Search className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-heading font-normal">No pending items found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="grid gap-10 lg:grid-cols-5">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Queue: {filteredPending.length} items
                    </p>
                  </div>
                  <AnimatePresence mode="popLayout">
                    {filteredPending.map((listing) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {renderListingCard(listing)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="lg:col-span-3">
                  {renderDetailPanel()}
                </div>
              </div>
            )}
          </TabsContent>

          {/* All Listings Tab */}
          <TabsContent value="all" className="outline-none">
            {filteredAll.length === 0 ? (
              <div className="py-32 text-center">
                <Search className="h-16 w-16 mx-auto mb-6 text-muted-foreground/30" />
                <h3 className="text-2xl font-heading font-normal">Directory is empty</h3>
              </div>
            ) : (
              <div className="grid gap-10 lg:grid-cols-5">
                <div className="lg:col-span-2 space-y-4">
                   <div className="flex items-center justify-between px-2 mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Archive: {filteredAll.length} items
                    </p>
                  </div>
                  {filteredAll.map((listing) => renderListingCard(listing, false))}
                </div>
                <div className="lg:col-span-3">
                  {renderDetailPanel()}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="outline-none">
            <div className="max-w-2xl">
              <Card className="rounded-2xl border-border/50 bg-card/50 overflow-hidden shadow-xl">
                <CardHeader className="p-8 border-b border-border/50 bg-muted/20">
                  <CardTitle className="font-heading text-2xl font-normal">Administrative Control</CardTitle>
                  <CardDescription>System-level configurations and session management</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-10">
                  <div className="flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-muted/20">
                    <div className="space-y-1">
                      <h4 className="font-medium text-foreground">Active Session</h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Authorized Admin</p>
                    </div>
                    <Button variant="ghost" className="h-12 px-6 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      End Session
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Platform Utilities</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Link href="/" target="_blank" className="flex-1">
                        <Button variant="outline" className="w-full h-14 rounded-xl border-border/50 hover:bg-muted transition-all">
                          <Globe className="h-5 w-5 mr-3 text-primary" />
                          Live Website
                        </Button>
                      </Link>
                      <Link href="/submit" target="_blank" className="flex-1">
                        <Button variant="outline" className="w-full h-14 rounded-xl border-border/50 hover:bg-muted transition-all">
                          <FileText className="h-5 w-5 mr-3 text-primary" />
                          Submission Form
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-dashed border-border/50 bg-muted/5">
                     <div className="flex items-center gap-3 text-muted-foreground mb-4">
                        <Shield className="h-5 w-5" />
                        <h4 className="text-sm font-semibold">Security Protocol</h4>
                     </div>
                     <p className="text-xs text-muted-foreground leading-relaxed">
                        This dashboard is protected by a secondary authentication layer. Actions performed here are cryptographically verified and logged. Ensure you sign out after each session.
                     </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="rounded-[2rem] border-border/50 shadow-2xl overflow-hidden p-0">
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 font-heading text-2xl font-normal text-red-500">
                <XCircle className="h-7 w-7" />
                Reject Submission
              </DialogTitle>
              <DialogDescription className="text-muted-foreground leading-relaxed">
                Provide constructive feedback for the builder. This reason will be stored in the project audit log.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="e.g., Please provide a valid GitHub repository or higher resolution icon..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={5}
              className="rounded-2xl bg-muted/30 border-border/50 focus:ring-red-500/20 resize-none p-4"
            />
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" className="flex-1 h-14 rounded-xl" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1 h-14 rounded-xl shadow-lg shadow-red-500/20" onClick={handleReject}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
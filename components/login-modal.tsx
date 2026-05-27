"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useAuth } from "@/contexts/auth-context"
import { UserPreferenceModal } from "@/components/user-preference-modal"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message?: string
}

export function LoginModal({
  open,
  onOpenChange,
  title = "Continue with KAAL",
  message = "Sign in to save your conversations and continue anytime.",
}: LoginModalProps) {

  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [showPreferenceModal, setShowPreferenceModal] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { loginWithEmail, loginWithGoogle } = useAuth()

  /* ---------------- GOOGLE LOGIN ---------------- */

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      await loginWithGoogle()
    } catch {
      setError("Google login failed")
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------------- EMAIL LOGIN ---------------- */

  const handleSendEmail = async () => {

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      await loginWithEmail(email)
      setEmailSent(true)
    } catch {
      setError("Failed to send login link")
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------------- CLOSE ---------------- */

  const handleClose = () => {
    onOpenChange(false)
    setEmail("")
    setError("")
    setEmailSent(false)
  }

  /* ---------------- PREF MODAL ---------------- */

  const handlePreferenceModalClose = () => {
    setShowPreferenceModal(false)
    handleClose()
  }

  if (showPreferenceModal) {
    return (
      <UserPreferenceModal
        open={showPreferenceModal}
        onOpenChange={handlePreferenceModalClose}
      />
    )
  }

  /* ---------------- EMAIL SENT ---------------- */

  if (emailSent) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-card border-0 rounded-2xl">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-semibold">
              Check your email
            </DialogTitle>
          </DialogHeader>

          <div className="text-center py-4">
            <p className="text-muted-foreground mb-6">
              We’ve sent you a secure login link.
            </p>

            <Button
              onClick={handleSendEmail}
              variant="outline"
              className="rounded-full"
            >
              Resend Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  /* ---------------- LOGIN UI ---------------- */

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-0 rounded-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">
            {title}
          </DialogTitle>

          <p className="text-sm text-muted-foreground mt-1">
            {message}
          </p>
        </DialogHeader>

        <div className="space-y-5 py-4">

          {/* GOOGLE BUTTON → PRIMARY */}

          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium"
          >
            Continue with Google
          </Button>

          {/* DIVIDER */}

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* EMAIL SECTION */}

          <div className="space-y-3">

            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full"
            />

            {error && (
              <p className="text-xs text-destructive text-center">
                {error}
              </p>
            )}

            {/* EMAIL → OUTLINE */}

            <Button
              onClick={handleSendEmail}
              disabled={isLoading}
              variant="outline"
              className="w-full rounded-full font-medium"
            >
              {isLoading ? "Sending..." : "Continue with Email"}
            </Button>

          </div>

          {/* FOOTER FIX */}

          <button
            onClick={handleClose}
            className="text-sm text-muted-foreground hover:text-foreground text-center w-full"
          >
            Continue without signing
          </button>

        </div>

      </DialogContent>

    </Dialog>
  )
}
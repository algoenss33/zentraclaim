import { Twitter, Send, Github, Globe } from "lucide-react"
import { ZentraBrand } from "@/components/zentra-logo"

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Send, href: "#", label: "Telegram" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Globe, href: "#", label: "Website" },
]

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <ZentraBrand compact logoClassName="w-9 h-9" />

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-zentra-cyan/15 transition-all duration-300 hover:scale-110"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Zentra Wallet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

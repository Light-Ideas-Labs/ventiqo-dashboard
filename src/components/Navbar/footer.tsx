import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Facebook, Instagram, X as XIcon } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();
const LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Explore Events", href: "/events" },
  { name: "Contact Us", href: "/#contact-us" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden rounded-t-[3rem] bg-[#0F2942] pt-16 text-white">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Logo + Contact */}
          <div className="flex flex-col items-start gap-4">
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Ventiqo"
              width={48}
              height={48}
            />
            <div>
              <h3 className="mb-2 font-semibold">Contact Us</h3>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Phone className="h-4 w-4" />
                <span>020 909 909</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-white/80">
                <Mail className="h-4 w-4" />
                <span>v3entiqo@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 font-semibold">Links</h3>
            <ul className="flex flex-col gap-2 text-sm text-white/80">
              {LINKS.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs + Social */}
          <div className="flex flex-col items-start gap-4">
            <Link
              href="/sign-up"
              className="rounded-full bg-[#F5A623] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#F5A623]/90"
            >
              Organise an Event
            </Link>
            <Link
              href="/events"
              className="rounded-full border border-white/60 px-6 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Explore events Now!
            </Link>
            <div className="flex gap-3 pt-2">
              <a href="#" aria-label="Facebook" className="text-white/70 transition hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="X" className="text-white/70 transition hover:text-white">
                <XIcon className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-white/70 transition hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/60 md:flex-row">
          <div className="flex gap-4">
            <Link href="/terms-and-conditions" className="hover:text-white">
              Terms
            </Link>
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
          </div>
          <p>&copy; {CURRENT_YEAR} Ventiqo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, MapPin, Phone, Clock } from "lucide-react";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Services", href: "/services" },
    { name: "Our Projects", href: "/projects" },
    { name: "Partners & Clients", href: "/partners" },
    { name: "Contact Us", href: "/contact" },
  ],
  programs: [
    { name: "Software Development", href: "/training" },
    { name: "Data Science & AI", href: "/training" },
    { name: "IoT & Automation", href: "/training" },
    { name: "Digital Skills", href: "/training" },
  ],
  opportunities: [
    { name: "Internships", href: "/internships" },
    { name: "Training Programs", href: "/training" },
    { name: "Corporate Training", href: "/services" },
    { name: "Become a Partner", href: "/partners" },
  ],
  resources: [
    { name: "Blog & Insights", href: "/blog" },
    { name: "Success Stories", href: "/about" },
    { name: "FAQ", href: "/contact" },
    { name: "Career Guidance", href: "/blog" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground">
      {/* Circuit line decoration */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Brand Column - Takes 2 columns on large screens */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-accent text-2xl font-bold">≪</span>
              <span className="font-heading text-xl font-semibold tracking-wide">
                CODEMANDE
              </span>
            </Link>
            <p className="text-card-foreground/70 text-sm leading-relaxed mb-6 max-w-xs">
              Empowering Africa through technology education and innovation. Building the next generation of digital professionals across Rwanda and beyond.
            </p>
            
            {/* Contact Info Block */}
            <div className="space-y-3 text-sm text-card-foreground/70">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <span>KG 123 Street, Kigali Innovation City,<br />Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-accent flex-shrink-0" />
                <span>info@codemande.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-accent flex-shrink-0" />
                <span>+250 788 000 000</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-accent flex-shrink-0" />
                <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
              </div>
            </div>
          </div>

          {/* Company Links Block */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-card-foreground text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-card-foreground/70 hover:text-accent transition-colors duration-300 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Links Block */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-card-foreground text-sm uppercase tracking-wider">
              Programs
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-card-foreground/70 hover:text-accent transition-colors duration-300 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities Links Block */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-card-foreground text-sm uppercase tracking-wider">
              Opportunities
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.opportunities.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-card-foreground/70 hover:text-accent transition-colors duration-300 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links Block */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-card-foreground text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-card-foreground/70 hover:text-accent transition-colors duration-300 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-card-foreground/10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <h4 className="font-heading font-semibold text-card-foreground mb-1">
                Stay Updated
              </h4>
              <p className="text-sm text-card-foreground/70">
                Subscribe to our newsletter for the latest courses, tech insights, and opportunities.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <button className="px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-card-foreground/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-card-foreground/60">
                © {new Date().getFullYear()} CODEMANDE. All rights reserved.
              </p>
              <p className="text-xs text-card-foreground/40 mt-1">
                Leading Technology Education & Innovation in Rwanda and Beyond.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-card-foreground/20 flex items-center justify-center text-card-foreground/60 hover:text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-xs text-card-foreground/50">
              <Link to="/contact" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-accent transition-colors">Terms of Service</Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-accent transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

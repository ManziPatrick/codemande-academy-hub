import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/team" },
    { name: "Careers", href: "/careers" },
    { name: "Partners", href: "/partners" },
  ],
  programs: [
    { name: "Software Development", href: "/courses/software" },
    { name: "Data Science & AI", href: "/courses/data-science" },
    { name: "IoT Solutions", href: "/courses/iot" },
    { name: "Internships", href: "/internships" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "Documentation", href: "/docs" },
    { name: "Student Portal", href: "/portal" },
    { name: "FAQs", href: "/faq" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground">
      {/* Circuit line decoration */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-accent text-2xl font-bold">≪</span>
              <span className="font-heading text-xl font-semibold tracking-wide">
                CODEMANDE
              </span>
            </Link>
            <p className="text-card-foreground/70 text-sm leading-relaxed mb-6 max-w-sm">
              Empowering Africa through technology education and innovation. Building the next generation of tech leaders in Rwanda and beyond.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-card-foreground/70">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-accent flex-shrink-0" />
                <span>Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-accent flex-shrink-0" />
                <span>info@codemande.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-accent flex-shrink-0" />
                <span>+250 788 000 000</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-card-foreground">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-card-foreground/70 hover:text-accent transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-card-foreground">Programs</h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-card-foreground/70 hover:text-accent transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-card-foreground">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-card-foreground/70 hover:text-accent transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-card-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-card-foreground/60">
            © {new Date().getFullYear()} CODEMANDE.{" "}
            <span className="italic">Leading Tech Education in Rwanda & Beyond.</span>
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full border border-card-foreground/20 flex items-center justify-center text-card-foreground/60 hover:text-accent hover:border-accent transition-all duration-300"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

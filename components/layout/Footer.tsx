import Link from "next/link";
import {
  PhoneCall,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-4">
              Wingi food
            </h3>
            <p className="text-muted-foreground mb-4">
              Cuisine africaine raffinée, service de restauration à livrer, et
              service traiteur pour tous vos événements.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/profile.php?id=61565519288789"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://www.instagram.com/wingifood/"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="https://www.tiktok.com/@wingifood1?_t=ZM-8yomyL7CNXx&_r=1 "
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                <FaTiktok size={20} />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  24 Rue <br /> Paris, France
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneCall className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">+33752545273</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">
                  contact@wingifood.com
                </span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-4">Horaires</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Commande</span>
                <span>en semaine</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Samedi</span>
                <span>livraison</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Dimanche</span>
                <span>fermé</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-4">
              Liens Rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Commander
                </Link>
              </li>
              <li>
                <Link
                  href="/catering"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Service traiteur
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Wingifood. Tous droits réservés.
            </p>
            <div className="flex gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Politique de confidentialité
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Conditions d&apos;utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

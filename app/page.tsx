import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, Users, FileCheck2, Gavel, MapPin, Building2, Calendar, Lock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-blue-900">Etat Civil</h1>
              <p className="text-xs text-blue-600">Ville de Bukavu</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline">Connexion</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-5xl font-bold text-blue-900 mb-6">
            Registre Civil de Bukavu
          </h2>
          <p className="text-xl text-blue-700 mb-8 leading-relaxed">
            Systeme moderne de gestion des actes d'etat civil pour la ville de Bukavu. 
            Securise, efficace et conforme au Code de la Famille de la RDC.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Acceder au systeme
              </Button>
            </Link>
            <Link href="#services">
              <Button size="lg" variant="outline">
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Citoyens enregistres</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15K+</div>
              <div className="text-blue-200">Mariages enregistres</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2K+</div>
              <div className="text-blue-200">Divorces enregistres</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">Disponibilite</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4 py-20">
        <h3 className="font-serif text-3xl font-bold text-center text-blue-900 mb-12">
          Nos Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <Users className="size-8 text-blue-600 mb-2" />
              <CardTitle>Gestion des Citoyens</CardTitle>
              <CardDescription>
                Enregistrement et gestion complete des citoyens bukaviens
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <FileCheck2 className="size-8 text-blue-600 mb-2" />
              <CardTitle>Registre des Mariages</CardTitle>
              <CardDescription>
                Enregistrement des mariages conforme au Code de la Famille
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <Gavel className="size-8 text-blue-600 mb-2" />
              <CardTitle>Registre des Divorces</CardTitle>
              <CardDescription>
                Gestion des divorces avec references juridiques
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <ShieldCheck className="size-8 text-blue-600 mb-2" />
              <CardTitle>Journal d'Audit</CardTitle>
              <CardDescription>
                Traçabilite complete de toutes les operations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* About Bukavu Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-serif text-3xl font-bold text-blue-900 mb-6">
                A propos de Bukavu
              </h3>
              <p className="text-blue-800 mb-4 leading-relaxed">
                Bukavu, chef-lieu de la province du Sud-Kivu en Republique Democratique du Congo, 
                est une ville dynamique situee au bord du lac Kivu. Avec une population en constante croissance, 
                notre bureau d'etat civil s'engage a fournir des services modernes et efficaces a tous nos citoyens.
              </p>
              <p className="text-blue-800 mb-6 leading-relaxed">
                Ce systeme numerique permet une gestion transparente et securisee des actes d'etat civil, 
                facilitant ainsi les procedures administratives pour les familles bukaviennes.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="size-5 text-blue-600" />
                  <span className="text-blue-800">Sud-Kivu, RDC</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="size-5 text-blue-600" />
                  <span className="text-blue-800">Bureau Central</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-5 text-blue-600" />
                  <span className="text-blue-800">Lun-Ven: 8h-17h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="size-5 text-blue-600" />
                  <span className="text-blue-800">Donnees securisees</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
              <h4 className="font-serif text-2xl font-bold mb-4">
                Pourquoi notre systeme ?
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="size-5 mt-0.5 flex-shrink-0" />
                  <span>Securite maximale avec chiffrement des donnees</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="size-5 mt-0.5 flex-shrink-0" />
                  <span>Accessibilite 24/7 pour les officiers autorises</span>
                </li>
                <li className="flex items-start gap-3">
                  <FileCheck2 className="size-5 mt-0.5 flex-shrink-0" />
                  <span>Conformite totale avec le Code de la Famille RDC</span>
                </li>
                <li className="flex items-start gap-3">
                  <Gavel className="size-5 mt-0.5 flex-shrink-0" />
                  <span>Traçabilite complete avec journal d'audit</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="font-serif text-3xl font-bold text-blue-900 mb-6">
            Pret a moderniser votre etat civil ?
          </h3>
          <p className="text-blue-700 mb-8">
            Rejoignez le systeme moderne de gestion de l'etat civil de Bukavu
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Connexion officiers
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex size-8 items-center justify-center rounded-full bg-white/20">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="font-serif font-bold">Etat Civil - Bukavu</p>
            </div>
          </div>
          <p className="text-blue-200 text-sm">
            © 2024 Republique Democratique du Congo. Tous droits reserves.
          </p>
        </div>
      </footer>
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
    title: "Conditions d'utilisation — FirstStep",
    description: "Conditions générales d'utilisation de la plateforme FirstStep.",
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#050914] text-slate-300">
            <header className="border-b border-white/6 bg-[#050914]/95 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative h-8 w-8 rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-blue-500/40 transition-all">
                            <Image src="/og-image.png" alt="FirstStep" fill className="object-cover" />
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">FirstStep</span>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Retour
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-20">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-6">
                        Legal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Conditions d&apos;utilisation
                    </h1>
                    <p className="text-slate-500 text-sm">Derniere mise a jour : 1er mars 2026</p>
                </div>

                <div className="space-y-10 text-sm leading-relaxed">
                    <Section num="01" title="Objet">
                        <p className="text-slate-400">
                            Les presentes conditions generales d&apos;utilisation (CGU) regissent
                            l&apos;acces et l&apos;utilisation de la plateforme SaaS{' '}
                            <strong className="text-white">FirstStep</strong>, editee et exploitee au Maroc.
                            En accedant a la Plateforme, vous acceptez sans reserve les presentes CGU.
                        </p>
                    </Section>

                    <Section num="02" title="Acces a la Plateforme">
                        <div className="text-slate-400 space-y-3">
                            <p>L&apos;acces est reserve aux personnes ayant cree un compte et souscrit a un service.</p>
                            <p>L&apos;utilisateur doit fournir des informations exactes. Tout compte frauduleux peut etre suspendu sans preavis.</p>
                            <p>Chaque utilisateur est responsable de la confidentialite de ses identifiants.</p>
                        </div>
                    </Section>

                    <Section num="03" title="Services proposes">
                        <div className="text-slate-400 space-y-3">
                            <p>FirstStep propose des modules de gestion adaptes aux secteurs : restauration, sante, services professionnels, etc.</p>
                            <p>Chaque module est souscrit separement. FirstStep se reserve le droit de faire evoluer les fonctionnalites.</p>
                        </div>
                    </Section>

                    <Section num="04" title="Tarification et paiement">
                        <div className="text-slate-400 space-y-3">
                            <p>Les tarifs sont en <strong className="text-white">MAD</strong> et peuvent evoluer avec un preavis de 30 jours.</p>
                            <p>Le paiement est du a la souscription. En cas de non-paiement, l&apos;acces peut etre suspendu.</p>
                            <p>Aucun remboursement pour les periodes d&apos;abonnement entamees, sauf disposition legale contraire.</p>
                        </div>
                    </Section>

                    <Section num="05" title="Obligations de l'utilisateur">
                        <ul className="text-slate-400 space-y-2">
                            {[
                                "Utiliser la Plateforme conformement aux lois marocaines en vigueur.",
                                "Ne pas tenter de pirater, decompiler ou alterer la Plateforme ou ses donnees.",
                                "Ne pas diffuser de contenu illegal, offensant ou trompeur.",
                                "Ne pas partager ses identifiants avec des tiers non autorises.",
                                "Signaler toute faille de securite a contact@firststep.ma.",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section num="06" title="Propriete intellectuelle">
                        <p className="text-slate-400">
                            Tous les elements de la Plateforme (code, design, marques, logos) sont la propriete exclusive de FirstStep.
                            Toute reproduction non autorisee est interdite.
                        </p>
                    </Section>

                    <Section num="07" title="Donnees personnelles">
                        <div className="text-slate-400 space-y-3">
                            <p>
                                FirstStep traite les donnees personnelles conformement a la{' '}
                                <strong className="text-white">loi marocaine n° 09-08</strong>.
                            </p>
                            <p>
                                Les donnees ne sont jamais vendues a des tiers. Pour toute demande :{' '}
                                <a href="mailto:contact@firststep.ma" className="text-blue-400 hover:underline">contact@firststep.ma</a>.
                            </p>
                        </div>
                    </Section>

                    <Section num="08" title="Limitation de responsabilite">
                        <div className="text-slate-400 space-y-3">
                            <p>FirstStep s&apos;engage a assurer la disponibilite de la Plateforme sans garantir une continuite absolue.</p>
                            <p>FirstStep n&apos;est pas responsable des dommages indirects lies a l&apos;utilisation de la Plateforme.</p>
                        </div>
                    </Section>

                    <Section num="09" title="Suspension et resiliation">
                        <div className="text-slate-400 space-y-3">
                            <p>FirstStep peut suspendre ou resilier tout compte en cas de violation des CGU, sans preavis ni remboursement.</p>
                            <p>L&apos;utilisateur peut resilier son abonnement a tout moment. La resiliation prend effet a la fin de la periode en cours.</p>
                        </div>
                    </Section>

                    <Section num="10" title="Modification des CGU">
                        <p className="text-slate-400">
                            FirstStep peut modifier les presentes CGU a tout moment avec notification aux utilisateurs.
                            L&apos;utilisation continue de la Plateforme vaut acceptation des nouvelles CGU.
                        </p>
                    </Section>

                    <Section num="11" title="Droit applicable">
                        <p className="text-slate-400">
                            Les presentes CGU sont regies par le <strong className="text-white">droit marocain</strong>.
                            Les tribunaux competents du Maroc seront seuls habilites en cas de litige.
                        </p>
                    </Section>

                    <Section num="12" title="Contact">
                        <p className="text-slate-400">
                            Pour toute question :{' '}
                            <a href="mailto:contact@firststep.ma" className="text-blue-400 hover:underline">contact@firststep.ma</a>
                        </p>
                    </Section>

                    <div className="border-t border-white/6 pt-8 text-xs text-slate-600">
                        © 2026 FirstStep Platform. Tous droits reserves. — Maroc
                    </div>
                </div>
            </main>
        </div>
    )
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-3">
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md px-2 py-0.5">
                    {num}
                </span>
                {title}
            </h2>
            {children}
        </section>
    )
}

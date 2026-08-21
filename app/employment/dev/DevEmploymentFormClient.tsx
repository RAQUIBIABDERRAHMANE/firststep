'use client'

import { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  FileText,
  UploadCloud,
  Github,
  Linkedin,
  Globe,
  Percent,
  CheckCircle2,
  AlertCircle,
  Code2,
  ShieldCheck,
  Building2,
  Sparkles,
  Loader2,
} from 'lucide-react'

const AVAILABLE_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Vue.js',
  'Angular',
  'Node.js',
  'Express',
  'NestJS',
  'Python',
  'Django',
  'FastAPI',
  'Java',
  'Spring Boot',
  'C#',
  '.NET',
  'Go',
  'Rust',
  'PHP',
  'Laravel',
  'Ruby',
  'Rails',
  'Swift',
  'Kotlin',
  'React Native',
  'Flutter',
  'Electron',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'GraphQL',
  'REST API',
  'Git',
  'CI/CD',
  'Linux',
]

export default function DevEmploymentFormClient() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cin, setCin] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [revenueShare, setRevenueShare] = useState('15')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const [cvFile, setCvFile] = useState<File | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  // Conditions checkboxes
  const [paymentCond, setPaymentCond] = useState(false)
  const [remoteCond, setRemoteCond] = useState(false)
  const [ndaCond, setNdaCond] = useState(false)
  const [ownershipCond, setOwnershipCond] = useState(false)
  const [finalCond, setFinalCond] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const name = file.name.toLowerCase()
      if (!name.endsWith('.pdf') && file.type !== 'application/pdf') {
        setErrorMsg('Le CV doit impérativement être un fichier PDF.')
        setCvFile(null)
        return
      }
      setErrorMsg(null)
      setCvFile(file)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!paymentCond || !remoteCond || !ndaCond || !ownershipCond || !finalCond) {
      setErrorMsg('Veuillez accepter toutes les conditions et termes du contrat de partenariat.')
      return
    }

    if (!cvFile) {
      setErrorMsg('Veuillez joindre votre CV au format PDF.')
      return
    }

    if (!photoFile) {
      setErrorMsg('Veuillez joindre votre photo d\'identité.')
      return
    }

    if (!githubUrl) {
      setErrorMsg('Veuillez indiquer le lien vers votre profil GitHub.')
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('roleType', 'DEVELOPER')
      formData.append('fullName', fullName)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('cin', cin)
      formData.append('githubUrl', githubUrl)
      if (portfolioUrl) formData.append('portfolioUrl', portfolioUrl)
      if (linkedinUrl) formData.append('linkedinUrl', linkedinUrl)
      formData.append('skills', JSON.stringify(selectedSkills))
      formData.append('revenueShare', revenueShare)
      formData.append('cv', cvFile)
      formData.append('photo', photoFile)

      const res = await fetch('/api/employment/apply', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Une erreur est survenue lors de la soumission.')
      }

      setSuccess(true)
    } catch (err: any) {
      console.error('Submission error:', err)
      setErrorMsg(err.message || 'Erreur lors de l\'envoi de la candidature.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
          <CheckCircle2 className="w-10 h-10 text-slate-950" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Candidature Développeur Enregistrée !
          </h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
            Merci <span className="text-cyan-400 font-semibold">{fullName}</span>. Nous avons bien reçu votre dossier de développeur partenaire.
          </p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 max-w-lg mx-auto text-left text-xs text-slate-400 space-y-2">
          <p className="flex items-center gap-2 text-cyan-300 font-medium">
            <Sparkles className="w-4 h-4" /> Prochaines étapes :
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Notre équipe technique examine votre profil et vos dépôts GitHub.</li>
            <li>En cas de validation, vous recevrez votre contrat d&apos;engagement officiel signé par email.</li>
            <li>Un email récapitulatif vient d&apos;être envoyé à <span className="text-white">{email}</span>.</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-5 py-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Section 1: Informations Personnelles */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">1. Informations Personnelles</h2>
            <p className="text-xs text-slate-400">Coordonnées et identification légale pour l&apos;accord de partenariat</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Nom Complet *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Ex: Youssef El Amrani"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Professionnel *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="youssef@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Numéro WhatsApp / Téléphone *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                placeholder="+212 6 XX XX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Numéro CIN (Carte d&apos;Identité Nationale) *</label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Ex: AB123456"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Profil Technique & Liens */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">2. Présence Technique & Références</h2>
            <p className="text-xs text-slate-400">Lien GitHub et portfolio pour évaluer votre code et vos réalisations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Profil GitHub *</label>
            <div className="relative">
              <Github className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                required
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Portfolio / Site Web</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://monportfolio.dev"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Profil LinkedIn</label>
            <div className="relative">
              <Linkedin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Skills Tag Picker */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Technologies & Compétences Clés :</span>
            <span className="text-[11px] text-cyan-400 font-mono">{selectedSkills.length} sélectionnée(s)</span>
          </label>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-slate-950/50 border border-slate-800 rounded-2xl">
            {AVAILABLE_SKILLS.map((skill) => {
              const active = selectedSkills.includes(skill)
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {skill}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Section 3: Revenue Share Model & Uploads */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">3. Modèle Financier & Fichiers</h2>
            <p className="text-xs text-slate-400">Revenue share par projet et transmission de vos documents obligatoires</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Revenue Share par Projet Développeur (%) *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={revenueShare}
                onChange={(e) => setRevenueShare(e.target.value)}
                className="flex-1 accent-cyan-400 cursor-pointer"
              />
              <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-300 font-mono font-bold text-sm">
                {revenueShare}%
              </div>
            </div>
            <p className="text-[11px] text-slate-500">Pourcentage du chiffre d&apos;affaires généré sur chaque projet assigné.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">CV Professionnel (PDF uniquement) *</label>
            <label className="flex flex-col items-center justify-center p-3.5 bg-slate-950/70 border border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all">
              <UploadCloud className="w-5 h-5 text-slate-500 mb-1" />
              <span className="text-xs text-slate-300 truncate max-w-full">
                {cvFile ? cvFile.name : 'Choisir le fichier PDF'}
              </span>
              <span className="text-[10px] text-slate-500">Max 10 Mo</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                required
                onChange={handleCvChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Photo d&apos;Identité *</label>
            <label className="flex flex-col items-center justify-center p-3.5 bg-slate-950/70 border border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all">
              <User className="w-5 h-5 text-slate-500 mb-1" />
              <span className="text-xs text-slate-300 truncate max-w-full">
                {photoFile ? photoFile.name : 'Choisir une photo (JPG, PNG)'}
              </span>
              <span className="text-[10px] text-slate-500">Photo claire du visage</span>
              <input
                type="file"
                accept="image/*"
                required
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Section 4: Accord Légal & Conditions Partenaire */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">4. Termes de l&apos;Accord de Partenariat Développeur</h2>
            <p className="text-xs text-slate-400">Veuillez lire et cocher l&apos;ensemble des clauses obligatoires</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-slate-300">
          <label className="flex items-start gap-3 p-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={paymentCond}
              onChange={(e) => setPaymentCond(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/30 h-4 w-4 shrink-0"
            />
            <span className="leading-relaxed">
              <strong>1. Paiement au Projet & Revenue Share :</strong> J&apos;accepte que la rémunération s&apos;effectue sous forme de commission / Revenue Share ({revenueShare}%) sur chaque projet livré et validé par le client FirstStep.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={remoteCond}
              onChange={(e) => setRemoteCond(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/30 h-4 w-4 shrink-0"
            />
            <span className="leading-relaxed">
              <strong>2. Travail à Distance & Autonomie :</strong> J&apos;atteste disposer des équipements informatiques et de la connexion internet nécessaires pour assurer le développement et respecter les délais convenus.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={ndaCond}
              onChange={(e) => setNdaCond(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/30 h-4 w-4 shrink-0"
            />
            <span className="leading-relaxed">
              <strong>3. Confidentialité & Non-Divulgation (NDA) :</strong> Je m&apos;engage formellement à garder confidentielles toutes les informations, données clients, clés d&apos;API et codes sources développés au sein de la plateforme.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={ownershipCond}
              onChange={(e) => setOwnershipCond(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/30 h-4 w-4 shrink-0"
            />
            <span className="leading-relaxed">
              <strong>4. Propriété Intellectuelle :</strong> L&apos;ensemble des créations logicielles et livrables créés dans le cadre des missions demeurent la propriété exclusive de FirstStep et de ses clients.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 bg-slate-950/50 border border-slate-800/80 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={finalCond}
              onChange={(e) => setFinalCond(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/30 h-4 w-4 shrink-0"
            />
            <span className="leading-relaxed">
              <strong>5. Exactitude des Données :</strong> Je certifie sur l&apos;honneur l&apos;exactitude des informations fournies (CIN, CV, références) et accepte que la signature du contrat d&apos;accord officiel soit générée sur cette base.
            </span>
          </label>
        </div>
      </div>

      {/* Submit CTA */}
      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer w-full sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Traitement et téléversement en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Soumettre ma Candidature Développeur</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

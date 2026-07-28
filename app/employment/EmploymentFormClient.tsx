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

export default function EmploymentFormClient() {
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
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        setErrorMsg('Le CV doit obligatoirement être un fichier au format PDF.')
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

    if (!cvFile) {
      setErrorMsg('Veuillez télécharger votre CV au format PDF.')
      return
    }

    if (!photoFile) {
      setErrorMsg('Veuillez télécharger une photo d\'identité.')
      return
    }

    if (selectedSkills.length === 0) {
      setErrorMsg('Veuillez sélectionner au moins une compétence.')
      return
    }

    if (!paymentCond || !remoteCond || !ndaCond || !ownershipCond || !finalCond) {
      setErrorMsg('Veuillez accepter toutes les conditions légales et acknowledgements.')
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('fullName', fullName)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('cin', cin)
      formData.append('githubUrl', githubUrl)
      formData.append('portfolioUrl', portfolioUrl)
      formData.append('linkedinUrl', linkedinUrl)
      formData.append('revenueShare', revenueShare)
      formData.append('skills', JSON.stringify(selectedSkills))
      formData.append('cv', cvFile)
      formData.append('photo', photoFile)

      const res = await fetch('/api/employment/apply', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la soumission de la candidature.')
      }

      setSuccess(true)
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue lors de l\'envoi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl text-center shadow-2xl shadow-emerald-950/40">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-3">Candidature Envoyée avec Succès !</h2>
        <p className="text-slate-300 text-base leading-relaxed mb-6">
          Merci <span className="font-semibold text-cyan-400">{fullName}</span>. Nous avons bien reçu votre dossier de candidature pour le poste de Software Developer.
        </p>
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 mb-8 text-left text-sm text-slate-300 space-y-2">
          <p className="flex items-center gap-2 text-cyan-400 font-semibold">
            <Mail className="w-4 h-4" /> Un email de confirmation a été envoyé à : <span className="underline">{email}</span>
          </p>
          <p className="text-slate-400">
            Notre équipe examinera votre profil et les termes de la convention d'embauche. Dès validation par l'administration, vous recevrez un contrat final par email.
          </p>
        </div>
        <button
          onClick={() => {
            setSuccess(false)
            setFullName('')
            setEmail('')
            setPhone('')
            setCin('')
            setGithubUrl('')
            setPortfolioUrl('')
            setLinkedinUrl('')
            setSelectedSkills([])
            setCvFile(null)
            setPhotoFile(null)
            setPaymentCond(false)
            setRemoteCond(false)
            setNdaCond(false)
            setOwnershipCond(false)
            setFinalCond(false)
          }}
          className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-cyan-900/30"
        >
          Soumettre une autre candidature
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errorMsg && (
        <div className="p-4 bg-rose-900/40 border border-rose-500/50 rounded-2xl flex items-center gap-3 text-rose-200 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Candidate Information */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">1. Informations Personnelles</h3>
            <p className="text-xs text-slate-400">Renseignez vos coordonnées officielles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Nom complet (Full Name) *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Yassine El Amrani"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Adresse Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: yassine@example.com"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Numéro de téléphone (Phone) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +212 600 000 000"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              N° CIN (Carte d'identité nationale) *
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                required
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="Ex: AB123456"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Documents Upload */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">2. Documents & Media</h3>
            <p className="text-xs text-slate-400">Joignez votre CV (PDF uniquement) et une photo de profil</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* CV Upload */}
          <div className="border-2 border-dashed border-slate-700/80 hover:border-cyan-500/80 rounded-2xl p-5 transition-all text-center bg-slate-950/50">
            <label className="cursor-pointer block">
              <FileText className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <span className="block text-sm font-semibold text-slate-200">
                Curriculum Vitae (CV) *
              </span>
              <span className="block text-xs text-cyan-400 font-mono mt-1">FORMAT PDF UNIQUEMENT</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleCvChange}
                className="hidden"
              />
              {cvFile ? (
                <div className="mt-3 py-1.5 px-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-mono truncate max-w-full">
                  ✓ {cvFile.name}
                </div>
              ) : (
                <span className="mt-3 inline-block px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium">
                  Choisir un fichier PDF
                </span>
              )}
            </label>
          </div>

          {/* Photo Upload */}
          <div className="border-2 border-dashed border-slate-700/80 hover:border-purple-500/80 rounded-2xl p-5 transition-all text-center bg-slate-950/50">
            <label className="cursor-pointer block">
              <UploadCloud className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <span className="block text-sm font-semibold text-slate-200">
                Photo de l'employé *
              </span>
              <span className="block text-xs text-slate-400 mt-1">Format Image (JPG, PNG, WebP)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {photoFile ? (
                <div className="mt-3 py-1.5 px-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-300 text-xs font-mono truncate max-w-full">
                  ✓ {photoFile.name}
                </div>
              ) : (
                <span className="mt-3 inline-block px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium">
                  Choisir une photo
                </span>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* 3. Online Profiles */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">3. Profils Professionnels</h3>
            <p className="text-xs text-slate-400">Partagez vos liens de code et réalisations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Profil GitHub *
            </label>
            <div className="relative">
              <Github className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="url"
                required
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Profil LinkedIn *
            </label>
            <div className="relative">
              <Linkedin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="url"
                required
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Site Portfolio (Optionnel)
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://myportfolio.com"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Skills & Technologies Selection */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Skills & Technologies *</h3>
              <p className="text-xs text-slate-400">Sélectionnez les technologies que vous maîtrisez</p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-emerald-500/10 text-emerald-300 rounded-full border border-emerald-500/20">
            {selectedSkills.length} sélectionnée(s)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill)
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-900/30 scale-105'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white'
                }`}
              >
                {isSelected ? '✓ ' : ''}{skill}
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Revenue Share & Agreement Conditions */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Compensation & Conditions Légales</h3>
            <p className="text-xs text-slate-400">Partage de revenu et engagements d'accord de travail</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Revenue Share Percentage (per project) attendu *
          </label>
          <div className="relative max-w-xs">
            <Percent className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="number"
              min="1"
              max="100"
              required
              value={revenueShare}
              onChange={(e) => setRevenueShare(e.target.value)}
              placeholder="Ex: 15"
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-slate-500 outline-none font-mono"
            />
            <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">%</span>
          </div>
        </div>

        {/* Checkboxes List matching Screenshot */}
        <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={paymentCond}
              onChange={(e) => setPaymentCond(e.target.checked)}
              className="mt-1 w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">Payment Condition:</strong> I understand that payment is issued only after the client has fully paid FirstStep for the project. *
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={remoteCond}
              onChange={(e) => setRemoteCond(e.target.checked)}
              className="mt-1 w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">Remote Work Condition:</strong> I understand that if I do not contribute to a project, I will not receive payment for that project. *
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ndaCond}
              onChange={(e) => setNdaCond(e.target.checked)}
              className="mt-1 w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">NDA:</strong> I will keep confidential all source code, business ideas, and client data. NDA survives termination. *
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ownershipCond}
              onChange={(e) => setOwnershipCond(e.target.checked)}
              className="mt-1 w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">Ownership:</strong> All code, designs, and projects are 100% owned by FirstStep. *
            </span>
          </label>
        </div>

        {/* Employer Information Panel */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4" /> Employer Information
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block">Company Name:</span>
              <span className="text-white font-semibold">FirstStep</span>
            </div>
            <div>
              <span className="text-slate-400 block">Founder / Employer:</span>
              <span className="text-white font-semibold">Abderrahmane Raquibi</span>
            </div>
          </div>
        </div>

        {/* Final Confirmation Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer bg-cyan-950/30 border border-cyan-800/40 p-4 rounded-xl">
          <input
            type="checkbox"
            checked={finalCond}
            onChange={(e) => setFinalCond(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-cyan-400 rounded cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-cyan-200 font-medium">
            <strong>Final Confirmation:</strong> I confirm all information provided is accurate and I agree to the terms of this employment agreement. *
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-cyan-950/50 hover:shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Envoi de votre candidature en cours...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Soumettre ma Candidature (Submit Application)</span>
          </>
        )}
      </button>
    </form>
  )
}

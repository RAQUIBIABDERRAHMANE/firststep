'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Save, Eye, CheckCircle2, Loader2, Trash2, PlusCircle, Type, Move, Upload } from 'lucide-react'

interface FieldConfig {

  key: string
  label: string
  color: string
  icon: string
}

const FIELDS: FieldConfig[] = [
  { key: 'date', label: 'Date du Contrat', color: '#d97706', icon: '📅' },
  { key: 'employeeName', label: 'Nom de l\'Employé', color: '#2563eb', icon: '👤' },
  { key: 'employeeCin', label: 'CIN de l\'Employé', color: '#7c3aed', icon: '🪪' },
  { key: 'startDate', label: 'Date de Début', color: '#059669', icon: '🚀' },
  { key: 'revenueShare', label: 'Revenue Share (%)', color: '#ea580c', icon: '💰' },
  { key: 'employeeSignName', label: 'Nom Signature Employé', color: '#0d9488', icon: '✍️' },
  { key: 'employeeSignDate', label: 'Date Signature Employé', color: '#4f46e5', icon: '🗓️' },
]

interface Positions {
  [key: string]: { x: number; y: number }
}

interface EnabledMap {
  [key: string]: boolean
}

interface FieldStyle {
  fontSize: number
  fontColor: string
  isBold: boolean
  isItalic: boolean
  fontFamily: string
}

interface FieldStyles {
  [key: string]: FieldStyle
}

// PDF dimensions (Standard A4 portrait at 72 DPI: 595.5 x 842.25)
const PDF_WIDTH = 595.5
const PDF_HEIGHT = 842.25

const DEFAULT_POSITIONS_MAP: Positions = {
  date: { x: 235, y: 687 },
  employeeName: { x: 125, y: 647 },
  employeeCin: { x: 60, y: 627 },
  startDate: { x: 125, y: 607 },
  revenueShare: { x: 180, y: 436 },
  employeeSignName: { x: 120, y: 165 },
  employeeSignDate: { x: 125, y: 120 },
}



const DEFAULT_ENABLED_MAP: EnabledMap = {
  date: true,
  employeeName: true,
  employeeCin: true,
  startDate: true,
  revenueShare: true,
  employeeSignName: true,
  employeeSignDate: true,
}

const DEFAULT_STYLES_MAP: FieldStyles = {
  date: { fontSize: 11, fontColor: '#000000', isBold: true, isItalic: false, fontFamily: 'Helvetica' },
  employeeName: { fontSize: 11, fontColor: '#000000', isBold: true, isItalic: false, fontFamily: 'Helvetica' },
  employeeCin: { fontSize: 10, fontColor: '#000000', isBold: false, isItalic: false, fontFamily: 'Helvetica' },
  startDate: { fontSize: 11, fontColor: '#000000', isBold: true, isItalic: false, fontFamily: 'Helvetica' },
  revenueShare: { fontSize: 11, fontColor: '#0277bd', isBold: true, isItalic: false, fontFamily: 'Helvetica' },
  employeeSignName: { fontSize: 11, fontColor: '#000000', isBold: true, isItalic: false, fontFamily: 'Helvetica' },
  employeeSignDate: { fontSize: 10, fontColor: '#000000', isBold: false, isItalic: false, fontFamily: 'Helvetica' },
}

export default function EmploymentCanvasClient() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [positions, setPositions] = useState<Positions>(DEFAULT_POSITIONS_MAP)
  const [enabledMap, setEnabledMap] = useState<EnabledMap>(DEFAULT_ENABLED_MAP)
  const [fieldStyles, setFieldStyles] = useState<FieldStyles>(DEFAULT_STYLES_MAP)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [canvasScale, setCanvasScale] = useState(1)
  const [selectedField, setSelectedField] = useState<string | null>('date')
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(true)

  // Convert PDF coordinates (origin bottom-left) to canvas coordinates (origin top-left)
  const pdfToCanvas = useCallback(
    (pdfX: number, pdfY: number) => {
      return {
        x: pdfX * canvasScale,
        y: (PDF_HEIGHT - pdfY) * canvasScale,
      }
    },
    [canvasScale]
  )

  // Convert canvas coordinates back to PDF coordinates
  const canvasToPdf = useCallback(
    (canvasX: number, canvasY: number) => {
      return {
        x: canvasX / canvasScale,
        y: PDF_HEIGHT - canvasY / canvasScale,
      }
    },
    [canvasScale]
  )

  // Load template positions & enabled states from API
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/employment-template')
        const data = await res.json()
        if (data.success && data.template) {
          const t = data.template
          const pos: Positions = {}
          const enMap: EnabledMap = {}
          const styles: FieldStyles = {}

          for (const field of FIELDS) {
            const defPos = DEFAULT_POSITIONS_MAP[field.key] || { x: 100, y: 500 }
            const defStyle = DEFAULT_STYLES_MAP[field.key] || {
              fontSize: 11,
              fontColor: '#000000',
              isBold: false,
              isItalic: false,
              fontFamily: 'Helvetica',
            }

            pos[field.key] = {
              x: t[`${field.key}X`] ?? defPos.x,
              y: t[`${field.key}Y`] ?? defPos.y,
            }
            enMap[field.key] = t[`${field.key}Enabled`] ?? true
            styles[field.key] = {
              fontSize: t[`${field.key}FontSize`] ?? defStyle.fontSize,
              fontColor: t[`${field.key}FontColor`] ?? defStyle.fontColor,
              isBold: t[`${field.key}IsBold`] ?? defStyle.isBold,
              isItalic: t[`${field.key}IsItalic`] ?? defStyle.isItalic,
              fontFamily: t[`${field.key}FontFamily`] ?? defStyle.fontFamily,
            }
          }
          setPositions(pos)
          setEnabledMap(enMap)
          setFieldStyles(styles)
        }
      } catch (err) {
        console.error('Failed to load positions:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Load PDF.js worker script dynamically and render background PDF page to canvas image
  useEffect(() => {
    const scriptId = 'pdfjs-script'
    let script = document.getElementById(scriptId) as HTMLScriptElement
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
      script.async = true
      document.body.appendChild(script)
    }

    const initPdf = () => {
      const pdfjsLib = (window as any)['pdfjs-dist/build/pdf']
      if (!pdfjsLib) return
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

      const loadingTask = pdfjsLib.getDocument('/developer-employment-agreement.pdf')
      loadingTask.promise.then(
        (pdf: any) => {
          pdf.getPage(1).then((page: any) => {
            const viewport = page.getViewport({ scale: 2.0 })
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            if (context) {
              canvas.height = viewport.height
              canvas.width = viewport.width

              const renderContext = {
                canvasContext: context,
                viewport: viewport,
              }
              page.render(renderContext).promise.then(() => {
                setBackgroundImage(canvas.toDataURL('image/png'))
                setPdfLoading(false)
              })
            }
          }).catch((err: any) => {
            console.error('Error rendering page:', err)
            setPdfLoading(false)
          })
        },
        (err: any) => {
          console.error('Error loading PDF:', err)
          setPdfLoading(false)
        }
      )
    }

    if ((window as any)['pdfjs-dist/build/pdf']) {
      initPdf()
    } else {
      script.onload = initPdf
    }
  }, [])

  // Calculate canvas scale based on container width
  useEffect(() => {
    function updateScale() {
      if (canvasRef.current) {
        const containerWidth = canvasRef.current.clientWidth
        setCanvasScale(containerWidth / PDF_WIDTH)
      }
    }
    updateScale()
    const timer = setTimeout(updateScale, 100)
    window.addEventListener('resize', updateScale)
    return () => {
      window.removeEventListener('resize', updateScale)
      clearTimeout(timer)
    }
  }, [loading, pdfLoading])

  // Mouse drag handlers (matched with baseline pdfToCanvas math)
  const handleMouseDown = (fieldKey: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(fieldKey)
    setSelectedField(fieldKey)

    const pos = positions[fieldKey] || { x: 100, y: 500 }
    const canvasPos = pdfToCanvas(pos.x, pos.y)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - canvasPos.x,
        y: e.clientY - rect.top - canvasPos.y,
      })
    }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const canvasX = e.clientX - rect.left - dragOffset.x
      const canvasY = e.clientY - rect.top - dragOffset.y

      const pdfPos = canvasToPdf(canvasX, canvasY)
      const clampedX = Math.max(0, Math.min(PDF_WIDTH, Math.round(pdfPos.x)))
      const clampedY = Math.max(0, Math.min(PDF_HEIGHT, Math.round(pdfPos.y)))

      setPositions((prev) => ({
        ...prev,
        [dragging]: { x: clampedX, y: clampedY },
      }))
    },
    [dragging, dragOffset, canvasToPdf]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  // Save template settings
  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const payload: any = {}
      for (const field of FIELDS) {
        payload[`${field.key}X`] = positions[field.key]?.x ?? 100
        payload[`${field.key}Y`] = positions[field.key]?.y ?? 100
        payload[`${field.key}Enabled`] = enabledMap[field.key] ?? true

        const st = fieldStyles[field.key]
        if (st) {
          payload[`${field.key}FontSize`] = st.fontSize
          payload[`${field.key}FontColor`] = st.fontColor
          payload[`${field.key}IsBold`] = st.isBold
          payload[`${field.key}IsItalic`] = st.isItalic
          payload[`${field.key}FontFamily`] = st.fontFamily
        }
      }

      const res = await fetch('/api/admin/employment-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        return true
      } else {
        alert('Erreur: ' + data.error)
        return false
      }
    } catch (err) {
      console.error('Failed to save positions:', err)
      alert('Erreur lors de la sauvegarde.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const toggleFieldEnabled = (key: string) => {
    setEnabledMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const updateFieldStyle = (key: string, updates: Partial<FieldStyle>) => {
    setFieldStyles((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...updates },
    }))
  }

  const sampleValues: { [key: string]: string } = {
    date: '28/07/2026',
    employeeName: 'Yassine El Amrani',
    employeeCin: 'AB123456',
    startDate: '28/07/2026',
    revenueShare: '15%',
    employeeSignName: 'Yassine El Amrani',
    employeeSignDate: '28/07/2026',
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingPdf, setUploadingPdf] = useState(false)

  const handleCustomPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPdf(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/employment-template/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (res.ok && data.success) {
        alert('✅ Votre modèle de contrat PDF a été importé avec succès ! Rechargement du canvas...')
        window.location.reload()
      } else {
        alert('Erreur: ' + (data.error || 'Échec du téléchargement'))
      }
    } catch (err) {
      console.error('Failed to upload custom PDF:', err)
      alert('Erreur lors du téléchargement du fichier PDF.')
    } finally {
      setUploadingPdf(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Chargement de l'éditeur de modèle de contrat...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input for uploading custom agreement PDF */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCustomPdfUpload}
        accept="application/pdf,.pdf"
        className="hidden"
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Move className="w-6 h-6" />
            </span>
            Éditeur Visuel de Contrat d'Emploi
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Faites glisser les champs sur le document pour ajuster leur emplacement exact. Vous pouvez aussi charger votre propre document PDF de contrat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 text-purple-200 font-semibold text-sm transition-all border border-purple-800/80 cursor-pointer disabled:opacity-50"
          >
            {uploadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-purple-400" />}
            {uploadingPdf ? 'Importation...' : 'Charger mon propre PDF'}
          </button>

          <button
            onClick={() => {
              handleSave().then((ok) => {
                if (ok) window.open('/api/admin/employment-template/preview', '_blank')
              })
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            Sauvegarder & Aperçu PDF
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/40 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Enregistré !' : 'Enregistrer le Modèle'}
          </button>
        </div>
      </div>


      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Interactive PDF Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-2">
              <span className="font-mono">Document: DEVELOPER EMPLOYMENT Agreement</span>
              <span className="font-mono">Format: US Letter (612 x 792 pt)</span>
            </div>

            {/* Canvas Container */}
            <div
              ref={canvasRef}
              className="relative w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-700/80 select-none cursor-crosshair"
              style={{ aspectRatio: `${PDF_WIDTH} / ${PDF_HEIGHT}` }}
            >
              {pdfLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-slate-400 text-sm gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                  Génération du rendu du fond PDF...
                </div>
              ) : backgroundImage ? (
                <img
                  src={backgroundImage}
                  alt="Agreement Background"
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : null}

              {/* Positioned Field Overlay Items */}
              {FIELDS.map((field) => {
                const isEnabled = enabledMap[field.key] !== false
                if (!isEnabled) return null

                const pos = positions[field.key] || { x: 100, y: 500 }
                const canvasPos = pdfToCanvas(pos.x, pos.y)
                const isSelected = selectedField === field.key
                const isDraggingThis = dragging === field.key
                const style = fieldStyles[field.key] || {
                  fontSize: 11,
                  fontColor: '#000000',
                  isBold: false,
                  isItalic: false,
                  fontFamily: 'Helvetica',
                }

                return (
                  <div
                    key={field.key}
                    onMouseDown={(e) => handleMouseDown(field.key, e)}
                    onClick={() => setSelectedField(field.key)}
                    style={{
                      left: `${canvasPos.x}px`,
                      top: `${canvasPos.y}px`,
                      transform: 'translateY(-78%)', // Baseline offset to align text baseline with PDF y coordinate
                      zIndex: isDraggingThis ? 50 : isSelected ? 40 : 10,
                      cursor: isDraggingThis ? 'grabbing' : 'grab',
                    }}
                    className="absolute group select-none"
                  >
                    {/* Visual Hover/Selection border box */}
                    <div
                      className={`absolute rounded transition-all pointer-events-none ${
                        isSelected
                          ? 'border-2 border-solid shadow-md'
                          : 'border border-dashed border-slate-400 group-hover:border-slate-700'
                      }`}
                      style={{
                        left: -6,
                        right: -6,
                        top: -4,
                        bottom: -4,
                        borderColor: isSelected ? field.color : 'transparent',
                        backgroundColor: isSelected ? `${field.color}15` : 'transparent',
                      }}
                    />

                    {/* Floating metadata badge header */}
                    <div
                      className={`absolute bottom-full left-0 mb-1 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm whitespace-nowrap transition-opacity pointer-events-none ${
                        isSelected || isDraggingThis ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      style={{ backgroundColor: field.color }}
                    >
                      <span>{field.icon}</span>
                      <span>{field.label}</span>
                    </div>

                    {/* WYSIWYG text preview overlay */}
                    <span
                      className="block whitespace-nowrap"
                      style={{
                        color: style.fontColor,
                        fontSize: `${style.fontSize * canvasScale}px`,
                        fontWeight: style.isBold ? 'bold' : 'normal',
                        fontStyle: style.isItalic ? 'italic' : 'normal',
                        fontFamily:
                          style.fontFamily === 'Times' || style.fontFamily === 'TimesRoman'
                            ? "'Times New Roman', Times, serif"
                            : style.fontFamily === 'Courier'
                            ? 'Courier, monospace'
                            : 'Helvetica, Arial, sans-serif',
                        lineHeight: 1,
                      }}
                    >
                      {sampleValues[field.key]}
                    </span>

                    {/* Precise coordinates indicator */}
                    {(isDraggingThis || isSelected) && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-slate-900/90 text-white text-[9px] px-2 py-0.5 rounded font-mono whitespace-nowrap shadow-lg">
                        X: {Math.round(pos.x)}, Y: {Math.round(pos.y)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Field Selector, Delete/Enable & Typography Style Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Field Selection & Enable/Delete List */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-400" /> Champs & Visibilité
            </h3>
            <div className="space-y-2">
              {FIELDS.map((field) => {
                const isSelected = selectedField === field.key
                const isEnabled = enabledMap[field.key] !== false
                const pos = positions[field.key] || { x: 0, y: 0 }

                return (
                  <div
                    key={field.key}
                    className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-white font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedField(field.key)}
                      className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                    >
                      <span>{field.icon}</span>
                      <span className={!isEnabled ? 'line-through opacity-50' : ''}>
                        {field.label}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isEnabled ? (
                        <>
                          <span className="font-mono text-[10px] text-slate-400">
                            {Math.round(pos.x)}, {Math.round(pos.y)}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleFieldEnabled(field.key)}
                            className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 border border-rose-800/50 transition-colors cursor-pointer"
                            title="Supprimer / Masquer ce champ du contrat PDF"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleFieldEnabled(field.key)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/50 text-[11px] font-semibold transition-colors cursor-pointer"
                          title="Restaurer ce champ"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Activer
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Typography & Coordinates Style Editor Panel */}
          {selectedField && fieldStyles[selectedField] && enabledMap[selectedField] !== false && (
            <div className="bg-slate-900/80 border border-cyan-500/30 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <span>{FIELDS.find((f) => f.key === selectedField)?.icon}</span>
                  Style & Position : {FIELDS.find((f) => f.key === selectedField)?.label}
                </h4>
              </div>

              {/* Coordinates Manual Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Position X (pt)</label>
                  <input
                    type="number"
                    value={Math.round(positions[selectedField]?.x || 0)}
                    onChange={(e) =>
                      setPositions((prev) => ({
                        ...prev,
                        [selectedField]: { ...prev[selectedField], x: Number(e.target.value) },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Position Y (pt)</label>
                  <input
                    type="number"
                    value={Math.round(positions[selectedField]?.y || 0)}
                    onChange={(e) =>
                      setPositions((prev) => ({
                        ...prev,
                        [selectedField]: { ...prev[selectedField], y: Number(e.target.value) },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Typography controls */}
              <div className="space-y-4">
                {/* Font Size Slider & Color */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-400">Taille de police (Font Size)</label>
                    <span className="text-xs font-mono text-cyan-400">
                      {fieldStyles[selectedField].fontSize} pt
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="32"
                    value={fieldStyles[selectedField].fontSize}
                    onChange={(e) =>
                      updateFieldStyle(selectedField, { fontSize: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Couleur du texte (Font Color)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={fieldStyles[selectedField].fontColor}
                      onChange={(e) =>
                        updateFieldStyle(selectedField, { fontColor: e.target.value })
                      }
                      className="w-10 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-300">
                      {fieldStyles[selectedField].fontColor}
                    </span>
                  </div>
                </div>

                {/* Font Family */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Police (Font Family)</label>
                  <select
                    value={fieldStyles[selectedField].fontFamily}
                    onChange={(e) => updateFieldStyle(selectedField, { fontFamily: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="Helvetica">Helvetica (Sans-Serif Standard)</option>
                    <option value="TimesRoman">Times Roman (Serif Classique)</option>
                    <option value="Courier">Courier (Monospace)</option>
                  </select>
                </div>

                {/* Bold & Italic Toggles */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateFieldStyle(selectedField, { isBold: !fieldStyles[selectedField].isBold })
                    }
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      fieldStyles[selectedField].isBold
                        ? 'bg-cyan-500 text-white border-cyan-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Gras (Bold)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateFieldStyle(selectedField, { isItalic: !fieldStyles[selectedField].isItalic })
                    }
                    className={`flex-1 py-2 rounded-xl text-xs italic transition-all cursor-pointer border ${
                      fieldStyles[selectedField].isItalic
                        ? 'bg-cyan-500 text-white border-cyan-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Italique (Italic)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

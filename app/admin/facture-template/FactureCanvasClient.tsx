'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Save, Download, RotateCcw, Move, Type, Eye } from 'lucide-react'

interface FieldConfig {
  key: string
  label: string
  color: string
  icon: string
}

const FIELDS: FieldConfig[] = [
  { key: 'factureNumber', label: 'N° Facture', color: '#0d9488', icon: '🔢' },
  { key: 'date', label: 'Date', color: '#d97706', icon: '📅' },
  { key: 'clientCompany', label: 'Entreprise Client', color: '#7c3aed', icon: '🏢' },
  { key: 'clientName', label: 'Nom Client', color: '#2563eb', icon: '👤' },
  { key: 'clientEmail', label: 'Email Client', color: '#059669', icon: '📧' },
  { key: 'serviceName', label: 'Service', color: '#ea580c', icon: '🛠️' },
  { key: 'servicePrice', label: 'Montant Service', color: '#ec4899', icon: '💸' },
  { key: 'subtotal', label: 'Sous-total', color: '#dc2626', icon: '💰' },
  { key: 'total', label: 'Total', color: '#991b1b', icon: '💵' },
]

interface Positions {
  [key: string]: { x: number; y: number }
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

// PDF page dimensions (US Letter portrait at 72 DPI, matches template PDF dimensions exactly)
const PDF_WIDTH = 612
const PDF_HEIGHT = 792

export default function FactureCanvasClient() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [positions, setPositions] = useState<Positions>({})
  const [fieldStyles, setFieldStyles] = useState<FieldStyles>({})
  const [fontSize, setFontSize] = useState(12)
  const [fontColor, setFontColor] = useState('#000000')
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [canvasScale, setCanvasScale] = useState(1)
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(true)

  // Convert PDF coordinates (origin bottom-left) to canvas coordinates (origin top-left)
  const pdfToCanvas = useCallback((pdfX: number, pdfY: number) => {
    return {
      x: pdfX * canvasScale,
      y: (PDF_HEIGHT - pdfY) * canvasScale,
    }
  }, [canvasScale])

  // Convert canvas coordinates back to PDF coordinates
  const canvasToPdf = useCallback((canvasX: number, canvasY: number) => {
    return {
      x: canvasX / canvasScale,
      y: PDF_HEIGHT - canvasY / canvasScale,
    }
  }, [canvasScale])

  // Load positions and styles from API
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/facture-template')
        const data = await res.json()
        if (data.success && data.template) {
          const t = data.template
          const pos: Positions = {}
          const styles: FieldStyles = {}
          for (const field of FIELDS) {
            pos[field.key] = {
              x: t[`${field.key}X`] ?? 100,
              y: t[`${field.key}Y`] ?? 100,
            }
            styles[field.key] = {
              fontSize: t[`${field.key}FontSize`] ?? t.fontSize ?? 12,
              fontColor: t[`${field.key}FontColor`] ?? t.fontColor ?? '#000000',
              isBold: t[`${field.key}IsBold`] ?? (field.key === 'factureNumber' || field.key === 'clientCompany' || field.key === 'total'),
              isItalic: t[`${field.key}IsItalic`] ?? false,
              fontFamily: t[`${field.key}FontFamily`] ?? 'Helvetica',
            }
          }
          setPositions(pos)
          setFieldStyles(styles)
          setFontSize(t.fontSize || 12)
          setFontColor(t.fontColor || '#000000')
        } else {
          // Set defaults
          const pos: Positions = {}
          const styles: FieldStyles = {}
          for (const field of FIELDS) {
            pos[field.key] = { x: 80, y: 500 - FIELDS.indexOf(field) * 40 }
            styles[field.key] = {
              fontSize: field.key === 'total' ? 14 : 12,
              fontColor: '#000000',
              isBold: field.key === 'factureNumber' || field.key === 'clientCompany' || field.key === 'total',
              isItalic: false,
              fontFamily: 'Helvetica',
            }
          }
          setPositions(pos)
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

  // Load PDF.js script dynamically and render background image
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
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

      const loadingTask = pdfjsLib.getDocument('/facture%20themplate.pdf')
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

  const handleMouseDown = (fieldKey: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(fieldKey)
    setSelectedField(fieldKey)

    const canvasPos = pdfToCanvas(positions[fieldKey].x, positions[fieldKey].y)
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - canvasPos.x,
        y: e.clientY - rect.top - canvasPos.y,
      })
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const canvasX = e.clientX - rect.left - dragOffset.x
    const canvasY = e.clientY - rect.top - dragOffset.y

    const pdfPos = canvasToPdf(canvasX, canvasY)

    // Clamp to PDF bounds
    pdfPos.x = Math.max(0, Math.min(PDF_WIDTH, pdfPos.x))
    pdfPos.y = Math.max(0, Math.min(PDF_HEIGHT, pdfPos.y))

    setPositions(prev => ({
      ...prev,
      [dragging]: { x: pdfPos.x, y: pdfPos.y },
    }))
  }, [dragging, dragOffset, canvasToPdf])

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

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const body: Record<string, number | string | boolean> = { fontSize, fontColor }
      for (const field of FIELDS) {
        body[`${field.key}X`] = positions[field.key]?.x ?? 0
        body[`${field.key}Y`] = positions[field.key]?.y ?? 0
        body[`${field.key}FontSize`] = fieldStyles[field.key]?.fontSize ?? 12
        body[`${field.key}FontColor`] = fieldStyles[field.key]?.fontColor ?? '#000000'
        body[`${field.key}IsBold`] = fieldStyles[field.key]?.isBold ?? false
        body[`${field.key}IsItalic`] = fieldStyles[field.key]?.isItalic ?? false
        body[`${field.key}FontFamily`] = fieldStyles[field.key]?.fontFamily ?? 'Helvetica'
      }

      const res = await fetch('/api/admin/facture-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        return true
      }
      return false
    } catch (err) {
      console.error('Failed to save:', err)
      return false
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = async () => {
    const success = await handleSave()
    if (success) {
      window.open('/api/admin/facture-template/preview', '_blank')
    }
  }

  const handleReset = () => {
    const pos: Positions = {
      factureNumber: { x: 400, y: 730 },
      date: { x: 400, y: 700 },
      clientCompany: { x: 80, y: 640 },
      clientName: { x: 80, y: 620 },
      clientEmail: { x: 80, y: 600 },
      serviceName: { x: 80, y: 480 },
      servicePrice: { x: 450, y: 480 },
      subtotal: { x: 450, y: 200 },
      total: { x: 450, y: 170 },
    }
    const styles: FieldStyles = {}
    for (const field of FIELDS) {
      styles[field.key] = {
        fontSize: field.key === 'total' ? 14 : 12,
        fontColor: '#000000',
        isBold: field.key === 'factureNumber' || field.key === 'clientCompany' || field.key === 'total',
        isItalic: false,
        fontFamily: 'Helvetica',
      }
    }
    setPositions(pos)
    setFieldStyles(styles)
    setFontSize(12)
    setFontColor('#000000')
  }

  // Sample data for preview labels
  const sampleData: Record<string, string> = {
    factureNumber: 'FS-2026-0001',
    date: '14/06/2026',
    clientCompany: 'Entreprise ABC',
    clientName: 'Mohammed Alaoui',
    clientEmail: 'mohammed@example.com',
    serviceName: 'Site Web Restaurant',
    servicePrice: '2,500.00 MAD',
    subtotal: '2,500.00 MAD',
    total: '2,500.00 MAD',
  }

  if (loading || pdfLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Chargement et rendu du document PDF...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Type className="h-7 w-7" />
          Modèle de Facture
        </h1>
        <p className="text-slate-500 mt-1">
          Glissez-déposez les champs sur le document pour définir leur position et personnalisez leur style indépendamment
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Canvas Area */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Move className="h-4 w-4" />
              <span>Glissez-déposez le texte pour positionner les éléments de facture</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              Letter: {PDF_WIDTH} × {PDF_HEIGHT} pts
            </div>
          </div>

          {/* PDF Canvas Workspace */}
          <div className="p-8 bg-slate-100/50 flex items-center justify-center overflow-auto min-h-[600px]">
            <div
              ref={canvasRef}
              className="relative bg-white shadow-xl border border-slate-300 overflow-hidden select-none transition-shadow duration-300"
              style={{
                width: '100%',
                maxWidth: 600,
                aspectRatio: `${PDF_WIDTH} / ${PDF_HEIGHT}`,
                cursor: dragging ? 'grabbing' : 'default',
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              {/* Grid overlay for alignment assistance */}
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
                backgroundSize: `${25 * canvasScale}px ${25 * canvasScale}px`,
              }} />

              {/* True WYSIWYG draggable elements */}
              {FIELDS.map((field) => {
                const pos = positions[field.key]
                if (!pos) return null
                const canvasPos = pdfToCanvas(pos.x, pos.y)
                const isSelected = selectedField === field.key
                const isDraggingThis = dragging === field.key
                 const style = fieldStyles[field.key] || { fontSize: 12, fontColor: '#000000', isBold: false, isItalic: false, fontFamily: 'Helvetica' }

                return (
                  <div
                    key={field.key}
                    className="absolute group"
                    style={{
                      left: canvasPos.x,
                      top: canvasPos.y,
                      transform: 'translateY(-78%)', // Shift box up so its baseline (which is ~78% from top) aligns exactly with canvasPos.y
                      zIndex: isDraggingThis ? 50 : isSelected ? 40 : 10,
                      cursor: isDraggingThis ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={(e) => handleMouseDown(field.key, e)}
                  >
                    {/* Visual Hover/Selection border box (offset outward so it does not shift the text) */}
                    <div
                      className={`absolute rounded transition-all border pointer-events-none ${
                        isSelected
                          ? 'border-solid border-2 shadow-md'
                          : 'border-dashed border-slate-300 hover:border-slate-500 hover:border-solid hover:bg-white/40'
                      }`}
                      style={{
                        left: -6,
                        right: -6,
                        top: -3,
                        bottom: -3,
                        borderColor: isSelected ? field.color : 'transparent',
                        backgroundColor: isSelected 
                          ? `${field.color}15` 
                          : 'transparent',
                      }}
                    />

                    {/* Floating metadata tag helper */}
                    <div
                      className={`absolute bottom-full left-0 mb-1 flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-sm whitespace-nowrap transition-opacity pointer-events-none ${
                        isSelected || isDraggingThis ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      style={{ backgroundColor: field.color }}
                    >
                      <span>{field.icon}</span>
                      <span>{field.label}</span>
                    </div>

                    {/* WYSIWYG text preview overlay (actual content, no offset padding/border) */}
                    <span
                      className="block whitespace-nowrap select-none"
                      style={{
                        color: style.fontColor,
                        fontSize: `${style.fontSize * canvasScale}px`,
                        fontWeight: style.isBold ? 'bold' : 'normal',
                        fontStyle: style.isItalic ? 'italic' : 'normal',
                        fontFamily: style.fontFamily === 'Times' || style.fontFamily === 'TimesRoman' ? "'Times New Roman', Times, serif" :
                                    style.fontFamily === 'Courier' ? "Courier, monospace" :
                                    "Helvetica, Arial, sans-serif",
                        lineHeight: 1, // Set to 1 to match the font height exactly with fontSize
                      }}
                    >
                      {sampleData[field.key]}
                    </span>

                    {/* Precise coordinates overlay */}
                    {(isDraggingThis || isSelected) && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-slate-900/90 text-white text-[9px] px-2 py-0.5 rounded font-mono whitespace-nowrap shadow-lg select-none">
                        x: {Math.round(pos.x)}, y: {Math.round(pos.y)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="flex flex-col gap-4">
          {/* Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Actions</h3>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 shadow-sm cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Sauvegarde...' : saved ? '✓ Sauvegardé !' : 'Sauvegarder la configuration'}
              </button>

              <button
                onClick={handlePreview}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                Aperçu PDF
              </button>

              <button
                onClick={() => {
                  handleSave().then(() => {
                    window.open('/api/admin/facture-template/preview', '_blank')
                  })
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Sauvegarder & Télécharger
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl border border-slate-200 transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Selected Field Style Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm min-h-[240px] flex flex-col justify-center">
            {selectedField ? (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="p-1 rounded bg-slate-100">
                    {FIELDS.find(f => f.key === selectedField)?.icon}
                  </span>
                  Style : {FIELDS.find(f => f.key === selectedField)?.label}
                </h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1.5 block">Taille de police (px)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="6"
                        max="36"
                        value={fieldStyles[selectedField]?.fontSize ?? 12}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          setFieldStyles(prev => ({
                            ...prev,
                            [selectedField]: {
                              ...prev[selectedField],
                              fontSize: val,
                            }
                          }))
                        }}
                        className="flex-1 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-sm font-mono text-slate-700 w-8 text-right">
                        {fieldStyles[selectedField]?.fontSize ?? 12}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 mb-1.5 block">Couleur du texte</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={fieldStyles[selectedField]?.fontColor ?? '#000000'}
                        onChange={(e) => {
                          const val = e.target.value
                          setFieldStyles(prev => ({
                            ...prev,
                            [selectedField]: {
                              ...prev[selectedField],
                              fontColor: val,
                            }
                          }))
                        }}
                        className="h-9 w-12 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <span className="text-sm font-mono text-slate-500">
                        {fieldStyles[selectedField]?.fontColor ?? '#000000'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <label className="text-xs text-slate-700 font-medium cursor-pointer" htmlFor="bold-toggle">
                      Gras / Bold
                    </label>
                    <input
                      type="checkbox"
                      id="bold-toggle"
                      checked={fieldStyles[selectedField]?.isBold ?? false}
                      onChange={(e) => {
                        const val = e.target.checked
                        setFieldStyles(prev => ({
                          ...prev,
                          [selectedField]: {
                            ...prev[selectedField],
                            isBold: val,
                          }
                        }))
                      }}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <label className="text-xs text-slate-700 font-medium cursor-pointer" htmlFor="italic-toggle">
                      Italique / Italic
                    </label>
                    <input
                      type="checkbox"
                      id="italic-toggle"
                      checked={fieldStyles[selectedField]?.isItalic ?? false}
                      onChange={(e) => {
                        const val = e.target.checked
                        setFieldStyles(prev => ({
                          ...prev,
                          [selectedField]: {
                            ...prev[selectedField],
                            isItalic: val,
                          }
                        }))
                      }}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-100">
                    <label className="text-xs text-slate-700 font-medium">
                      Police / Font Family
                    </label>
                    <select
                      value={fieldStyles[selectedField]?.fontFamily ?? 'Helvetica'}
                      onChange={(e) => {
                        const val = e.target.value
                        setFieldStyles(prev => ({
                          ...prev,
                          [selectedField]: {
                            ...prev[selectedField],
                            fontFamily: val,
                          }
                        }))
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Helvetica">Helvetica (Sans-Serif)</option>
                      <option value="Times">Times Roman (Serif)</option>
                      <option value="Courier">Courier (Monospace)</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-400">
                  Sélectionnez un champ sur l&apos;aperçu ou dans la liste ci-dessous pour modifier son style.
                </p>
              </div>
            )}
          </div>

          {/* Field List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Champs</h3>
            <div className="flex flex-col gap-1.5">
              {FIELDS.map((field) => {
                const pos = positions[field.key]
                const isSelected = selectedField === field.key
                return (
                  <button
                    key={field.key}
                    onClick={() => setSelectedField(isSelected ? null : field.key)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100 ring-1 ring-slate-300 font-medium'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: field.color }}
                    />
                    <span className="flex-1 text-slate-700">{field.icon} {field.label}</span>
                    {pos && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {Math.round(pos.x)}, {Math.round(pos.y)}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Help */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">💡 Comment utiliser</h3>
            <ul className="text-xs text-amber-800 space-y-1.5">
              <li>• Glissez-déposez le texte directement sur le document.</li>
              <li>• Cliquez sur un champ pour ajuster sa police, sa couleur, son style gras et italique.</li>
              <li>• Utilisez la grille d&apos;alignement pour caler vos zones de texte.</li>
              <li>• Cliquez sur <strong>Aperçu PDF</strong> pour valider le rendu final avant d&apos;enregistrer.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState, useRef } from 'react';
import {
  Download,
  FileText,
  Share2,
  CheckCircle2,
  X,
  Printer,
  Sparkles,
  Award,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building2,
  Tag,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { DiaryCertificatePost, QualityBadge } from '../types';
import { INITIAL_QUALITY_BADGES } from '../data/mockData';

interface CertificatePdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificates: DiaryCertificatePost[];
  badges?: QualityBadge[];
  studentName?: string;
  studentId?: string;
}

export const CertificatePdfExportModal: React.FC<CertificatePdfExportModalProps> = ({
  isOpen,
  onClose,
  certificates,
  badges = INITIAL_QUALITY_BADGES,
  studentName = 'Anumitra Saha',
  studentId = 'CS-2023-07',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [includeBadges, setIncludeBadges] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>(
    certificates.map((c) => c.id)
  );

  const pdfContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const filteredCertificates = certificates.filter((c) =>
    selectedCertIds.includes(c.id)
  );

  const toggleCertSelection = (id: string) => {
    setSelectedCertIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedCertIds(certificates.map((c) => c.id));
  };

  const handleDeselectAll = () => {
    setSelectedCertIds([]);
  };

  const handleDownloadPdf = async () => {
    if (!pdfContentRef.current || filteredCertificates.length === 0) return;

    setIsGenerating(true);
    try {
      const element = pdfContentRef.current;
      const formattedDate = new Date().toISOString().slice(0, 10);
      const opt = {
        margin: [8, 8, 8, 8] as [number, number, number, number],
        filename: `${studentName.replace(/\s+/g, '_')}_Certificate_Diary_Summary_${formattedDate}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          backgroundColor: '#ffffff',
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().set(opt).from(element).save();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3500);
    } catch (error) {
      console.error('Failed to generate PDF summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareOrCopy = async () => {
    const summaryText = `🎓 ${studentName}'s Academic Certificate Diary Summary\n• Verified Credentials: ${filteredCertificates.length}\n• Key Certifications: ${filteredCertificates.map((c) => c.title).join(', ')}\n• Distinction Badges: Empathy Luminary (9.2), Interaction Catalyst (8.7)\nVerified via SynqUp Academic Bridge`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${studentName}'s Certificate Diary Summary`,
          text: summaryText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Ignored
    }
  };

  const earnedBadges = badges.filter((b) => b.isUnlocked);

  return (
    <div
      id="certificate-pdf-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="certificate-pdf-modal-content"
        className="bg-[#0f172a] text-[#dae2fd] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
      >
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#131d35]/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8083ff]/30 to-[#4edea3]/20 text-[#c0c1ff] flex items-center justify-center border border-[#8083ff]/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#dae2fd] tracking-tight">
                  Export Certificate Diary Summary
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] text-[10px] font-bold border border-[#8083ff]/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#4edea3]" /> html2pdf.js
                </span>
              </div>
              <p className="text-xs text-[#c7c4d7]">
                Generate a professional PDF summary of verified credentials, reflections, and badges for sharing.
              </p>
            </div>
          </div>

          <button
            id="close-pdf-export-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#c7c4d7] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls & Options */}
        <div className="px-5 py-3.5 bg-[#17233f]/70 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Checkboxes & Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[#c7c4d7] font-semibold">Options:</span>

            <label className="flex items-center gap-1.5 cursor-pointer text-[#dae2fd] select-none">
              <input
                type="checkbox"
                checked={includeBadges}
                onChange={(e) => setIncludeBadges(e.target.checked)}
                className="rounded accent-[#8083ff] cursor-pointer"
              />
              <span>Include Distinction Badges</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-[#dae2fd] select-none">
              <input
                type="checkbox"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
                className="rounded accent-[#8083ff] cursor-pointer"
              />
              <span>Include Certificate Previews</span>
            </label>

            <div className="flex items-center gap-1.5 text-[11px] text-[#8083ff]">
              <span>({filteredCertificates.length}/{certificates.length} selected)</span>
              <button
                onClick={handleSelectAll}
                className="hover:underline font-semibold cursor-pointer"
                type="button"
              >
                All
              </button>
              <span>•</span>
              <button
                onClick={handleDeselectAll}
                className="hover:underline font-semibold cursor-pointer"
                type="button"
              >
                None
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="share-pdf-summary-btn"
              onClick={handleShareOrCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222f4d] hover:bg-[#2b3a5e] text-[#dae2fd] border border-white/10 font-semibold transition-all cursor-pointer"
              type="button"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#4edea3]" />
                  <span className="text-[#4edea3]">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#c0c1ff]" />
                  <span>Share Summary</span>
                </>
              )}
            </button>

            <button
              id="print-pdf-summary-btn"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222f4d] hover:bg-[#2b3a5e] text-[#dae2fd] border border-white/10 font-semibold transition-all cursor-pointer"
              type="button"
            >
              <Printer className="w-3.5 h-3.5 text-[#c0c1ff]" />
              <span>Print</span>
            </button>

            <button
              id="download-pdf-summary-btn"
              disabled={isGenerating || filteredCertificates.length === 0}
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4edea3] hover:opacity-95 text-[#0d0096] font-extrabold shadow-lg shadow-[#8083ff]/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0d0096]" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#0d0096]" />
                  <span>Download PDF Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {exportSuccess && (
          <div className="bg-[#4edea3]/15 border-b border-[#4edea3]/30 px-5 py-2 text-xs text-[#4edea3] font-bold flex items-center gap-2 shrink-0 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>PDF summary exported successfully! File downloaded to your browser.</span>
          </div>
        )}

        {/* Certificate selector pills */}
        <div className="px-5 py-2.5 bg-[#101726] border-b border-white/[0.04] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
          <span className="text-[11px] text-[#908fa0] shrink-0">Included:</span>
          {certificates.map((c) => {
            const isSelected = selectedCertIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCertSelection(c.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#8083ff]/20 text-[#c0c1ff] border-[#8083ff]/40'
                    : 'bg-[#172033] text-[#71717a] border-white/5 line-through opacity-60'
                }`}
                type="button"
              >
                <span>{c.title}</span>
                <span className="text-[10px] opacity-70">({c.organization})</span>
              </button>
            );
          })}
        </div>

        {/* Document Preview Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#090d16] flex justify-center">
          {/* Printable Document Container (A4 layout styling for html2canvas/html2pdf) */}
          <div
            ref={pdfContentRef}
            id="printable-pdf-document"
            style={{
              width: '100%',
              maxWidth: '740px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
              borderRadius: '8px',
              padding: '28px 32px',
              boxSizing: 'border-box',
            }}
          >
            {/* Header / Institutional Branding */}
            <div
              style={{
                borderBottom: '2px solid #0f172a',
                paddingBottom: '16px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: '#3730a3',
                      color: '#ffffff',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    SQ
                  </div>
                  <h1
                    style={{
                      fontSize: '20px',
                      fontWeight: '800',
                      color: '#0f172a',
                      margin: 0,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    SynqUp Academic Portfolio
                  </h1>
                </div>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#475569',
                    margin: '4px 0 0 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Verified Student Certificate Diary & Behavioral Distinction Summary
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    border: '1px solid #a7f3d0',
                    marginBottom: '4px',
                  }}
                >
                  ✓ Cryptographically Verified
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  Exported: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Student Metadata Card */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                  {studentName}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  ID: {studentId} • Department of Computer Science & Engineering • Class Rank Top 6%
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#3730a3' }}>
                    {filteredCertificates.length}
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                    Certificates
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#047857' }}>
                    8.6/10
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                    Credit Score
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#b45309' }}>
                    {earnedBadges.length}
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                    Badges
                  </div>
                </div>
              </div>
            </div>

            {/* Distinction Badges Section in PDF */}
            {includeBadges && earnedBadges.length > 0 && (
              <div
                style={{
                  marginBottom: '20px',
                  pageBreakInside: 'avoid',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#0f172a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>★ Peer Distinction Badges Earned (High Behavioral Consistency)</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                  }}
                >
                  {earnedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      style={{
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '8px 10px',
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#1e293b' }}>
                        {badge.name}
                      </div>
                      <div style={{ fontSize: '10px', color: '#3730a3', fontWeight: '600', marginTop: '1px' }}>
                        {badge.qualityTitle}: {badge.currentScore}/10
                      </div>
                      <div style={{ fontSize: '9px', color: '#64748b', marginTop: '3px' }}>
                        {badge.tier} Tier • Earned {badge.earnedDate || 'Verified'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section Title: Verified Certificate Entries */}
            <div
              style={{
                fontSize: '12px',
                fontWeight: '800',
                color: '#0f172a',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '4px',
              }}
            >
              Academic Certificates & Milestone Diary ({filteredCertificates.length})
            </div>

            {/* Certificates List */}
            {filteredCertificates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '12px' }}>
                No certificates selected for export.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredCertificates.map((cert, index) => (
                  <div
                    key={cert.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      backgroundColor: '#ffffff',
                      pageBreakInside: 'avoid',
                    }}
                  >
                    {/* Entry Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '6px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                          {index + 1}. {cert.title}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#3730a3', marginTop: '1px' }}>
                          {cert.organization}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'inline-block',
                          }}
                        >
                          {cert.issueDate}
                        </div>
                        {cert.credentialId && (
                          <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px' }}>
                            ID: {cert.credentialId}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reflection / Content */}
                    <p
                      style={{
                        fontSize: '11px',
                        color: '#334155',
                        lineHeight: '1.5',
                        margin: '6px 0 10px 0',
                      }}
                    >
                      {cert.content}
                    </p>

                    {/* Certificate Image Preview (if enabled) */}
                    {includeImages && cert.certificateImage && (
                      <div
                        style={{
                          marginBottom: '10px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          maxHeight: '180px',
                        }}
                      >
                        <img
                          src={cert.certificateImage}
                          alt={cert.title}
                          crossOrigin="anonymous"
                          style={{
                            width: '100%',
                            height: '180px',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      </div>
                    )}

                    {/* Skills Tags */}
                    {cert.skills && cert.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                        <span style={{ fontSize: '9px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginRight: '4px' }}>
                          Competencies:
                        </span>
                        {cert.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '9px',
                              fontWeight: '600',
                              backgroundColor: '#eef2ff',
                              color: '#3730a3',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid #c7d2fe',
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Document Footer */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '9px',
                color: '#64748b',
                pageBreakInside: 'avoid',
              }}
            >
              <div>
                Verified by SynqUp Academic Network • SHA-256 Signature: e7f8b9...c3a1
              </div>
              <div>
                Official Student Portfolio Summary • Page 1
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-5 py-3.5 bg-[#131d35] border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-[#c7c4d7]">
            Format: Standard A4 portrait • Ready for LinkedIn, job applications, or advisor review
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-[#dae2fd] hover:bg-white/10 font-medium transition-colors cursor-pointer"
              type="button"
            >
              Close
            </button>

            <button
              disabled={isGenerating || filteredCertificates.length === 0}
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#8083ff] hover:bg-[#9194ff] text-[#0d0096] font-bold transition-all cursor-pointer disabled:opacity-50"
              type="button"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

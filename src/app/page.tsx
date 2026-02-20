'use client';
import { useRouter } from 'next/navigation';
import { Button, Container, SimpleGrid, Group, Text } from '@mantine/core';
import { IconArrowRight, IconPlayerPlay, IconBolt, IconPackage } from '@tabler/icons-react';
import { FoxLogo, FoxLogoWithText } from '../components/FoxLogo';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="landing-page">
      {/* ── HERO ────────────────────────────────────────── */}
      <section className="hero-section" id="hero">
        {/* Nav */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '24px 60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 100,
          }}
        >
          <FoxLogoWithText size={38} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span className="powered-badge">
              <IconBolt size={11} />
              Powered by Foxit
            </span>
            <Button
              variant="filled"
              color="orange"
              size="md"
              radius="xl"
              onClick={() => router.push('/app')}
              rightSection={<IconArrowRight size={14} />}
              style={{ fontWeight: 700 }}
            >
              Launch App
            </Button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '50px 40px 80px 40px',
          gap: 0,
          position: 'relative'
        }}>
          {/* Left Side: Content */}
          <div style={{ flex: '0 0 75%', textAlign: 'left', zIndex: 10 }}>
            <div className="hero-badge" style={{ margin: '0 0 24px 0', width: 'fit-content' }}>
              <span>🦊 Foxit Document Automation Hackathon 2026</span>
            </div>

            <h1 className="hero-title" style={{
              textAlign: 'left',
              fontSize: '4.5rem',
              lineHeight: 1.1,
              marginBottom: 24,
              maxWidth: '1200px',
              fontWeight: 800
            }}>
              Automate Every HR Document.<br />
              <span style={{ color: '#F76707' }}>Instantly.</span>
            </h1>

            <p className="hero-subtitle" style={{ textAlign: 'left', margin: '0 0 40px 0', maxWidth: '100%', fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)' }}>
              Generate offer letters, NDAs, and full onboarding packs —<br />
              powered by <strong>Foxit Document Generation</strong> & <strong>PDF Services APIs</strong>.
            </p>

            <div className="hero-cta-group" style={{ justifyContent: 'flex-start' }}>
              <Button
                size="xl"
                color="orange"
                radius="xl"
                rightSection={<IconArrowRight size={18} />}
                onClick={() => router.push('/app')}
                style={{ paddingInline: 40, fontWeight: 800 }}
              >
                Go to Dashboard
              </Button>
              <Button
                size="xl"
                variant="outline"
                color="gray"
                radius="xl"
                leftSection={<IconPlayerPlay size={16} />}
                onClick={() => router.push('/app')}
                style={{ paddingInline: 36, borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
              >
                See Demo
              </Button>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: 'flex',
                gap: 48,
                marginTop: 64,
              }}
            >
              {[
                { label: 'Documents', value: '5+' },
                { label: 'PDF Services', value: '6+' },
                { label: 'Setup', value: '< 2m' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#F76707' }}>{value}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Illustration */}
          <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-start', position: 'relative', marginLeft: -100 }}>
            <FoxIllustration />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint">
          <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
            <rect x="1" y="1" width="18" height="30" rx="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <circle cx="10" cy="10" r="3" fill="rgba(255,255,255,0.5)">
              <animate attributeName="cy" from="10" to="22" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="features-section" id="features">
        <Container size="lg">
          <h2 className="section-title">Everything HR Needs, Automated</h2>
          <p className="section-subtitle">
            From a single form to a complete onboarding package — <strong style={{ color: '#EA580C' }}>Fox HR</strong> handles it all in seconds.
          </p>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
            <div className="feature-card">
              <span className="feature-icon">🦊</span>
              <div className="feature-title">Smart Generation</div>
              <div className="feature-desc">
                Fill a form. Get a polished PDF in seconds using the{' '}
                <span style={{ color: '#F76707' }}>Foxit Document Generation API</span>.
                Dynamic placeholders, professional layouts, company branding.
              </div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <div className="feature-title">Fox HR Pipelines</div>
              <div className="feature-desc">
                Merge, compress, password-protect, and archive PDFs with the{' '}
                <span style={{ color: '#F76707' }}>Foxit PDF Services API</span>.
                Full pipeline from raw template to delivery-ready document.
              </div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📦</span>
              <div className="feature-title">Complete Onboarding Packs</div>
              <div className="feature-desc">
                Deliver a complete document bundle to new hires in one click —
                offer letter, NDA, policy handbook, tax declaration, appointment letter.
              </div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">👥</span>
              <div className="feature-title">Bulk Processing</div>
              <div className="feature-desc">
                Upload a CSV of new hires and generate all their documents at once.
                Perfect for batch onboarding events.
              </div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔐</span>
              <div className="feature-title">Security & Compliance</div>
              <div className="feature-desc">
                Password protection with employee DOB, PDF/A archival format,
                confidential watermarks — all in one pipeline.
              </div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">👁️</span>
              <div className="feature-title">Preview & Download</div>
              <div className="feature-desc">
                Preview any generated PDF in-browser before downloading.
                Full document history with re-generation support.
              </div>
            </div>
          </SimpleGrid>
        </Container>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="hiw-section" id="how-it-works">
        <Container size="lg">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to automate your entire HR document workflow</p>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: 0,
              flexWrap: 'wrap',
            }}
          >
            {[
              {
                step: 1,
                title: 'Fill Employee Details',
                desc: 'Enter employee info: name, role, CTC, department, start date, and select which documents to generate.',
              },
              {
                step: 2,
                title: 'Foxit DocGen Generates PDFs',
                desc: 'Foxit Document Generation API injects your data into professional .docx templates and returns polished PDFs.',
              },
              {
                step: 3,
                title: 'PDF Services Delivers Pack',
                desc: 'Foxit PDF Services merges all documents, compresses, password-protects, and delivers the final onboarding pack.',
              },
            ].map(({ step, title, desc }, index) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <div className="hiw-step" style={{ width: 220 }}>
                  <div className="hiw-step-number">{step}</div>
                  <div className="hiw-step-title">{title}</div>
                  <div className="hiw-step-desc">{desc}</div>
                </div>
                {index < 2 && (
                  <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.2)', margin: '0 0px', marginTop: -60, flexShrink: 0 }}>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* API call chain visualization */}
          <div
            style={{
              marginTop: 60,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '32px',
              fontFamily: 'Monaco, monospace',
              fontSize: 13,
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            <div style={{ marginBottom: 12, color: '#F76707', fontWeight: 700 }}>// API Flow</div>
            <div><span style={{ color: '#4FC3F7' }}>POST</span> /document-generation/api/GenerateDocumentBase64 → 📜 Offer Letter PDF</div>
            <div><span style={{ color: '#4FC3F7' }}>POST</span> /document-generation/api/GenerateDocumentBase64 → 🔏 NDA PDF</div>
            <div><span style={{ color: '#4FC3F7' }}>POST</span> /pdf-services/api/documents/upload → <span style={{ color: '#81C784' }}>documentId</span></div>
            <div><span style={{ color: '#4FC3F7' }}>POST</span> /pdf-services/api/merge → <span style={{ color: '#81C784' }}>taskId</span></div>
            <div><span style={{ color: '#4FC3F7' }}>GET </span> /pdf-services/api/tasks/:taskId → <span style={{ color: '#81C784' }}>resultDocumentId</span></div>
            <div><span style={{ color: '#4FC3F7' }}>GET </span> /pdf-services/api/documents/:id/download → 📦 <span style={{ color: '#FFB74D' }}>onboarding-pack.pdf</span></div>
          </div>
        </Container>
      </section>

      {/* ── FOXIT BANNER ─────────────────────────────────── */}
      <section className="foxit-banner">
        <h2 className="foxit-banner-title">🦊 Built on Foxit APIs</h2>
        <p className="foxit-banner-text">
          <strong style={{ color: '#EA580C' }}>Fox HR</strong> is built on two powerful Foxit APIs: the{' '}
          <strong>Document Generation API</strong> for creating dynamic documents from templates,
          and the <strong>PDF Services API</strong> for merging, compressing, protecting and delivering
          production-ready PDF packages.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://developer-api.foxit.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'white', textDecoration: 'none', borderBottom: '2px solid rgba(255,255,255,0.4)', paddingBottom: 2 }}
          >
            🔗 developer-api.foxit.com
          </a>
          <a
            href="https://docs.developer-api.foxit.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'white', textDecoration: 'none', borderBottom: '2px solid rgba(255,255,255,0.4)', paddingBottom: 2 }}
          >
            📖 docs.developer-api.foxit.com
          </a>
        </div>
        <div style={{ marginTop: 40 }}>
          <Button
            size="xl"
            style={{ background: 'white', color: '#E8590C', fontWeight: 800, paddingInline: 48 }}
            radius="xl"
            onClick={() => router.push('/app')}
            rightSection={<IconArrowRight size={20} />}
          >
            Start Automating →
          </Button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="landing-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            Fox HR © 2026 | Powered by Foxit APIs | Built for the Foxit Document Automation Hackathon
          </span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
          No employee data is stored on servers. All data lives in browser localStorage.
        </div>
      </footer>
    </div>
  );
}

// Large geometric fox illustration for hero
function FoxIllustration() {
  return (
    <svg
      className="hero-fox-svg"
      viewBox="0 0 300 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.3))' }}
    >
      {/* Glow effect removed as requested */}
      {/* <ellipse cx="150" cy="240" rx="100" ry="20" fill="rgba(232,89,12,0.15)" /> */}

      {/* Body */}
      <ellipse cx="150" cy="190" rx="70" ry="55" fill="url(#bodyGrad)" />

      {/* Tail */}
      <path d="M220 200 Q280 160 270 220 Q260 260 220 235 Z" fill="url(#tailGrad)" />
      <path d="M220 200 Q270 165 265 215" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4,3" />
      <ellipse cx="260" cy="225" rx="18" ry="14" fill="white" opacity="0.9" transform="rotate(-15 260 225)" />

      {/* Legs */}
      <rect x="107" y="230" width="22" height="35" rx="11" fill="url(#legGrad)" />
      <rect x="171" y="230" width="22" height="35" rx="11" fill="url(#legGrad)" />
      <rect x="100" y="215" width="20" height="30" rx="10" fill="url(#legGrad)" />
      <rect x="180" y="215" width="20" height="30" rx="10" fill="url(#legGrad)" />

      {/* Feet */}
      <ellipse cx="118" cy="265" rx="14" ry="7" fill="#C44A00" />
      <ellipse cx="182" cy="265" rx="14" ry="7" fill="#C44A00" />

      {/* Head */}
      <ellipse cx="150" cy="130" rx="60" ry="58" fill="url(#headGrad)" />

      {/* Ears */}
      <polygon points="110,85 88,38 128,70" fill="url(#earGrad)" />
      <polygon points="190,85 212,38 172,70" fill="url(#earGrad)" />
      {/* Ear inner */}
      <polygon points="108,82 93,50 120,70" fill="#FFD4B0" opacity="0.9" />
      <polygon points="192,82 207,50 180,70" fill="#FFD4B0" opacity="0.9" />

      {/* Muzzle */}
      <ellipse cx="150" cy="155" rx="30" ry="20" fill="#FFD4B0" />

      {/* Eyes */}
      <ellipse cx="128" cy="128" rx="12" ry="13" fill="white" />
      <ellipse cx="172" cy="128" rx="12" ry="13" fill="white" />
      <ellipse cx="130" cy="130" rx="8" ry="9" fill="#1A1A2E" />
      <ellipse cx="174" cy="130" rx="8" ry="9" fill="#1A1A2E" />
      {/* Pupils */}
      <circle cx="132" cy="128" r="3" fill="white" />
      <circle cx="176" cy="128" r="3" fill="white" />
      {/* Eye shine */}
      <circle cx="134" cy="126" r="1.5" fill="white" opacity="0.8" />
      <circle cx="178" cy="126" r="1.5" fill="white" opacity="0.8" />

      {/* Nose */}
      <ellipse cx="150" cy="149" rx="7" ry="5" fill="#1A1A2E" />
      {/* Nose shine */}
      <circle cx="148" cy="147" r="2" fill="rgba(255,255,255,0.4)" />

      {/* Mouth */}
      <path d="M143 155 Q150 163 157 155" stroke="#C44A00" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Cheek blush */}
      <ellipse cx="112" cy="148" rx="14" ry="8" fill="rgba(255,100,50,0.18)" />
      <ellipse cx="188" cy="148" rx="14" ry="8" fill="rgba(255,100,50,0.18)" />

      {/* Forehead mark */}
      <path d="M150 75 L142 100 L158 100 Z" fill="rgba(255,255,255,0.2)" />

      {/* Document floating around fox */}
      <g transform="rotate(-15 250 80) translate(230, 60)">
        <rect x="0" y="0" width="44" height="56" rx="5" fill="white" opacity="0.9" />
        <rect x="6" y="10" width="32" height="3" rx="1.5" fill="#E8590C" opacity="0.7" />
        <rect x="6" y="18" width="24" height="2" rx="1" fill="#CCC" />
        <rect x="6" y="25" width="28" height="2" rx="1" fill="#CCC" />
        <rect x="6" y="32" width="20" height="2" rx="1" fill="#CCC" />
        <rect x="6" y="39" width="26" height="2" rx="1" fill="#CCC" />
      </g>

      <g transform="rotate(10 30 100) translate(10, 85)">
        <rect x="0" y="0" width="40" height="52" rx="5" fill="white" opacity="0.85" />
        <rect x="5" y="9" width="30" height="3" rx="1.5" fill="#F76707" opacity="0.7" />
        <rect x="5" y="17" width="22" height="2" rx="1" fill="#CCC" />
        <rect x="5" y="24" width="26" height="2" rx="1" fill="#CCC" />
        <rect x="5" y="31" width="18" height="2" rx="1" fill="#CCC" />
      </g>

      <defs>
        <radialGradient id="headGrad" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#FF8C3A" />
          <stop offset="100%" stopColor="#E8590C" />
        </radialGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F76707" />
          <stop offset="100%" stopColor="#D44F08" />
        </linearGradient>
        <linearGradient id="tailGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F76707" />
          <stop offset="100%" stopColor="#FFB347" />
        </linearGradient>
        <linearGradient id="earGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB347" />
          <stop offset="100%" stopColor="#E8590C" />
        </linearGradient>
        <linearGradient id="legGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8590C" />
          <stop offset="100%" stopColor="#C44A00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

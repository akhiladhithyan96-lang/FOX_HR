'use client';

interface FoxLogoProps {
    size?: number;
    className?: string;
}

/**
 * A sleek, professional "Fox HR" logo.
 * Geometric, minimal, and premium looking.
 */
export function FoxLogo({ size = 48, className = '' }: FoxLogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Minimalist Geometric Fox Head */}
            <path
                d="M50 15L85 40L75 80L50 90L25 80L15 40L50 15Z"
                fill="url(#foxHRGrad)"
            />

            {/* Professional Ears */}
            <path d="M15 40L5 10L35 30" fill="#E8590C" />
            <path d="M85 40L95 10L65 30" fill="#E8590C" />

            {/* Minimal Inner Ear */}
            <path d="M18 35L12 18L30 30" fill="white" fillOpacity="0.4" />
            <path d="M82 35L88 18L70 30" fill="white" fillOpacity="0.4" />

            {/* Sharp Eyes */}
            <circle cx="38" cy="48" r="5" fill="#1A1A2E" />
            <circle cx="62" cy="48" r="5" fill="#1A1A2E" />
            <circle cx="40" cy="46" r="1.5" fill="white" />
            <circle cx="64" cy="46" r="1.5" fill="white" />

            {/* Sleek Nose Area */}
            <path d="M40 70C40 70 45 75 50 75C55 75 60 70 60 70" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M48 62L52 62L50 65L48 62Z" fill="#1A1A2E" />

            <defs>
                <linearGradient id="foxHRGrad" x1="50" y1="15" x2="50" y2="90" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FB923C" />
                    <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export function FoxLogoWithText({ size = 40 }: { size?: number }) {
    return (
        <div style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: '-1px',
            color: '#FB923C',
            lineHeight: 1,
            textTransform: 'uppercase'
        }}>
            FOX HR
        </div>
    );
}

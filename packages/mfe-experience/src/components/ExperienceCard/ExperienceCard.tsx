import { useEffect, useRef, useState } from 'react';
import type { Experience } from '@portfolio/shared';

interface Props {
  experience: Experience;
  index: number;
}

export function ExperienceCard({ experience, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  const accentColor = index === 0 ? '#00D9C0'
    : index === 3 ? '#F5A623'
    : '#0099FF';

  return (
    <div
      ref={cardRef}
      className="exp-card"
      style={{
        flexShrink: 0,
        width: '340px',
        position: 'relative',
        opacity: 0,
        marginTop: isEven ? '-120px' : '120px',
      }}
    >
      {/* Connector dot on timeline */}
      <div style={{
        position: 'absolute',
        [isEven ? 'bottom' : 'top']: '-40px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '12px', height: '12px',
        borderRadius: '50%',
        background: accentColor,
        border: '2px solid #060E14',
        zIndex: 2,
      }} />

      {/* Connector line */}
      <div style={{
        position: 'absolute',
        [isEven ? 'bottom' : 'top']: '-34px',
        left: '50%',
        width: '1px',
        height: '28px',
        background: `linear-gradient(${isEven ? 'to bottom' : 'to top'}, transparent, ${accentColor}40)`,
      }} />

      {/* Card */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          background: '#0D1F2D',
          border: `1px solid ${expanded ? accentColor : '#1E3448'}`,
          borderRadius: '12px',
          padding: '1.5rem',
          cursor: 'pointer',
          transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
          transform: expanded ? 'translateY(-4px)' : 'none',
          boxShadow: expanded ? `0 12px 40px ${accentColor}18` : 'none',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              color: accentColor,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              {experience.company}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              color: '#1E3448',
              letterSpacing: '0.1em',
            }}>
              {experience.period}
            </span>
          </div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1rem',
            fontWeight: 700,
            color: '#E8F4F8',
            lineHeight: 1.3,
            marginBottom: '0.5rem',
          }}>
            {experience.role}
          </h3>
          <span style={{
            display: 'inline-block',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: '#7BA7BC',
            background: '#152535',
            borderRadius: '4px',
            padding: '2px 8px',
          }}>
            {experience.duration}
          </span>
        </div>

        {/* Summary */}
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.82rem',
          color: '#7BA7BC',
          lineHeight: 1.6,
          marginBottom: '1rem',
        }}>
          {experience.summary}
        </p>

        {/* Highlight badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: `${accentColor}12`,
          border: `1px solid ${accentColor}30`,
          borderRadius: '6px',
          padding: '4px 10px',
          marginBottom: expanded ? '1rem' : 0,
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accentColor }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.62rem', color: accentColor,
          }}>
            {experience.highlight}
          </span>
        </div>

        {/* Expanded: bullets + tech */}
        {expanded && (
          <div>
            <ul style={{ listStyle: 'none', marginBottom: '1rem' }}>
              {experience.bullets.map((b, i) => (
                <li key={i} style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.78rem', color: '#7BA7BC',
                  lineHeight: 1.5, paddingLeft: '1rem',
                  position: 'relative', marginBottom: '0.4rem',
                }}>
                  <span style={{
                    position: 'absolute', left: 0, top: '0.5em',
                    width: '4px', height: '4px', borderRadius: '50%',
                    background: accentColor,
                  }} />
                  {b}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {experience.technologies.slice(0, 6).map(tech => (
                <span key={tech} style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.58rem', color: '#7BA7BC',
                  background: '#152535', borderRadius: '4px',
                  padding: '2px 6px',
                }}>
                  {tech}
                </span>
              ))}
              {experience.technologies.length > 6 && (
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.58rem', color: '#1E3448',
                  padding: '2px 6px',
                }}>
                  +{experience.technologies.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Expand toggle */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginTop: '0.75rem',
        }}>
          <svg
            width="16" height="16" viewBox="0 0 16 16"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <path d="M4 6l4 4 4-4" stroke="#1E3448" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

/**
 * Hand-built isometric 3D vector illustrations — one per capability.
 * Each uses a 3-tone extrude (top = lightest, front = mid, side = darkest)
 * to read as a dimensional shape rather than a flat icon.
 */

const EX = 15; // extrude x
const EY = -9; // extrude y (up)

/** A shaded 3D slab/cuboid. */
function Block({
  x,
  y,
  w,
  h,
  front,
  top,
  side,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  front: string;
  top: string;
  side: string;
}) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill={front} rx="2" />
      <path
        d={`M${x + w} ${y} L${x + w + EX} ${y + EY} L${x + w + EX} ${
          y + EY + h
        } L${x + w} ${y + h} Z`}
        fill={side}
      />
      <path
        d={`M${x} ${y} L${x + EX} ${y + EY} L${x + w + EX} ${y + EY} L${
          x + w
        } ${y} Z`}
        fill={top}
      />
    </>
  );
}

function Art({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 170 150"
      className="h-full w-auto max-w-full drop-shadow-[0_10px_18px_rgba(1,20,24,0.22)]"
      fill="none"
    >
      <ellipse cx="86" cy="132" rx="52" ry="9" fill="rgba(1,20,24,0.16)" />
      {children}
    </svg>
  );
}

export const ART: Record<string, ReactNode> = {
  // Ecommerce Bookkeeping — stack of ledgers
  bookkeeping: (
    <Art>
      <g>
        <Block x={36} y={86} w={86} h={24} front="#0B3B42" top="#12606C" side="#06262B" />
        <rect x={36} y={86} width="8" height="24" fill="#00DF7F" />
        <Block x={42} y={62} w={84} h={22} front="#15808F" top="#27AFC0" side="#0E5A66" />
        <rect x={42} y={62} width="8" height="22" fill="#E9F6EF" />
        <Block x={34} y={40} w={88} h={22} front="#00DF7F" top="#5BFFC1" side="#00A968" />
        <rect x={34} y={40} width="8" height="22" fill="#0B3B42" />
        <path d="M58 50h54M58 56h44" stroke="#0B3B42" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      </g>
    </Art>
  ),

  // Inventory & COGS — parcel box
  cogs: (
    <img
      src="/cards/inventory_card.svg"
      alt=""
      className="h-full w-auto max-w-full object-contain drop-shadow-[0_10px_18px_rgba(1,20,24,0.22)]"
    />
  ),

  // Sales Tax & Nexus — invoice + coins
  salestax: (
    <Art>
      <g>
        <path d="M48 26 100 26 116 42 116 118 48 118 Z" fill="#F6F8F1" />
        <path d="M100 26 116 42 100 42 Z" fill="#CBD8C9" />
        <path d="M62 56 96 84" stroke="#00DF7F" strokeWidth="5" strokeLinecap="round" />
        <circle cx="64" cy="58" r="6" fill="none" stroke="#00DF7F" strokeWidth="4" />
        <circle cx="94" cy="82" r="6" fill="none" stroke="#00DF7F" strokeWidth="4" />
        <path d="M58 100h48M58 108h30" stroke="#9DB0A6" strokeWidth="3" strokeLinecap="round" />
        <g>
          <ellipse cx="112" cy="112" rx="22" ry="9" fill="#E0A92E" />
          <rect x="90" y="100" width="44" height="12" fill="#F4C84B" />
          <ellipse cx="112" cy="100" rx="22" ry="9" fill="#FFD45E" />
          <ellipse cx="112" cy="100" rx="13" ry="5" fill="#E0A92E" />
        </g>
      </g>
    </Art>
  ),

  // Cash Flow & Forecasting — rising 3D bars + arrow
  cashflow: (
    <Art>
      <g>
        <Block x={42} y={86} w={20} h={26} front="#0E5A66" top="#1B8190" side="#093F47" />
        <Block x={70} y={68} w={20} h={44} front="#15808F" top="#27AFC0" side="#0E5A66" />
        <Block x={98} y={46} w={20} h={66} front="#00DF7F" top="#5BFFC1" side="#00A968" />
        <path
          d="M48 78 L78 60 L98 70 L128 36"
          stroke="#F6F8F1"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M116 34 132 34 132 50" stroke="#F6F8F1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Art>
  ),

  // Fractional CFO — briefcase + badge
  cfo: (
    <Art>
      <g>
        <rect x={62} y={40} width="46" height="12" rx="4" fill="none" stroke="#0B2A30" strokeWidth="5" />
        <Block x={42} y={52} w={86} h={58} front="#1F2A30" top="#33454D" side="#121A1E" />
        <rect x={42} y={74} width="86" height="9" fill="#0B1316" />
        <rect x={78} y={70} width="14" height="16" rx="2" fill="#F4C84B" />
        <circle cx="146" cy="44" r="16" fill="#00DF7F" />
        <path
          d="M146 35 148.4 41.5 155 41.8 149.8 46 151.7 52.5 146 48.7 140.3 52.5 142.2 46 137 41.8 143.6 41.5 Z"
          fill="#0B3B42"
        />
      </g>
    </Art>
  ),

  // Multi-Channel Reconciliation — looping 3D arrows + node
  recon: (
    <Art>
      <g>
        <circle cx="86" cy="74" r="40" fill="none" stroke="#0E5A66" strokeWidth="13" strokeLinecap="round" strokeDasharray="92 60" />
        <circle cx="86" cy="74" r="40" fill="none" stroke="#27AFC0" strokeWidth="13" strokeLinecap="round" strokeDasharray="92 60" transform="rotate(180 86 74)" />
        <path d="M118 50 L128 38 L132 56 Z" fill="#27AFC0" />
        <path d="M54 98 L44 110 L40 92 Z" fill="#0E5A66" />
        <circle cx="86" cy="74" r="16" fill="#00DF7F" />
        <circle cx="80" cy="68" r="5" fill="#5BFFC1" />
      </g>
    </Art>
  ),

  // Year-End & Tax Prep — wall calendar
  tax: (
    <Art>
      <g>
        <Block x={44} y={40} w={82} h={74} front="#F6F8F1" top="#FFFFFF" side="#C9D6C8" />
        <rect x={44} y={40} width="82" height="20" fill="#E84393" />
        <path d="M126 40 141 31 141 49 126 58 Z" fill="#B9316F" />
        <path d="M44 40 59 31 141 31 126 40 Z" fill="#FF6FA8" />
        <rect x={58} y={34} width="6" height="14" rx="3" fill="#0B2A30" />
        <rect x={106} y={34} width="6" height="14" rx="3" fill="#0B2A30" />
        <path
          d="M62 86 L78 100 L110 70"
          stroke="#00DF7F"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </Art>
  ),
};

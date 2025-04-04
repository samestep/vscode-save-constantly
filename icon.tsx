import { render } from "preact-render-to-string";

const polar = (r: number, theta: number): string =>
  `${r * Math.cos(theta)} ${-r * Math.sin(theta)}`;

const icon = () => {
  // https://code.visualstudio.com/api/references/extension-manifest#fields
  const size = 256;

  const m = size / 2; // Edge of the image.

  const w = 63; // Half width of the save icon.
  const p = 30; // Corner size.

  const d = 14; // Vertical distance from center to lower inset.
  const b = 36; // Half width of lower inset.

  const q = 6; // Distance from icon edge to insets.

  const u = 31; // Vertical distance from center to upper inset.
  const c = 20; // Left position of upper inset.
  const f = 25; // Right position of upper inset.

  const r = 104; // Radius of the arrows.
  const t = 11; // Thickness of the arrows.
  const ri = r - t; // Inner radius of the arrows.ß
  const ro = r + t; // Outer radius of the arrows.
  const a = 28; // Arrowhead width.
  const ria = r - a; // Inner radius of arrowhead.
  const roa = r + a; // Outer radius of arrowhead.

  const v = 34 / 100; // Radians between arrowhead end and next arrow start.
  const v1 = Math.PI / 4 + v; // Radians of top arrow start.
  const v2 = -((3 * Math.PI) / 4 + v); // Radians of top arrowhead start.
  const v3 = -(3 * Math.PI) / 4; // Radians of top arrowhead end.
  const dv = -Math.PI; // Radians between arrowheads.
  const v4 = v1 + dv; // Radians of bottom arrow start.
  const v5 = v2 + dv; // Radians of bottom arrowhead start.
  const v6 = v3 + dv; // Radians of bottom arrowhead end.

  const s = 5; // Drop shadow size.

  const outer = "#0a2873"; // Icon color.
  const inner = "#dedede"; // Inset color.
  const arrows = "#969696"; // Arrow color.

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox={`${-m} ${-m} ${size} ${size}`}
    >
      <defs>
        <filter id="shadow">
          <feDropShadow stdDeviation={s} />
        </filter>
      </defs>
      <polygon
        fill={outer}
        points={`${w},${-w + p} ${w - p},${-w} ${-w},${-w} ${-w},${w} ${w},${w}`}
      />
      <rect fill={inner} x={-b} y={d} width={2 * b} height={w - d - q} />
      <rect fill={inner} x={-f} y={-w + q} width={f + c} height={w - u - q} />
      <path
        style={`fill:${arrows}; filter:url(#shadow)`}
        d={[
          `M ${polar(ri, v1)}`,
          `A ${ri} ${ri} 0 0 0 ${polar(ri, v2)}`,
          `L ${polar(ria, v2)}`,
          `L ${polar(r, v3)}`,
          `L ${polar(roa, v2)}`,
          `L ${polar(ro, v2)}`,
          `A ${ro} ${ro} 0 0 1 ${polar(ro, v1)}`,
        ].join(" ")}
      />
      <path
        style={`fill:${arrows}; filter:url(#shadow)`}
        d={[
          `M ${polar(ri, v4)}`,
          `A ${ri} ${ri} 0 0 0 ${polar(ri, v5)}`,
          `L ${polar(ria, v5)}`,
          `L ${polar(r, v6)}`,
          `L ${polar(roa, v5)}`,
          `L ${polar(ro, v5)}`,
          `A ${ro} ${ro} 0 0 1 ${polar(ro, v4)}`,
        ].join(" ")}
      />
    </svg>
  );
};

Bun.write("icon.svg", render(icon()));

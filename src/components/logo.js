import { useTheme } from "@mui/material/styles";

export const Logo = () => {
  const theme = useTheme();
  const fillColor = theme.palette.primary.main;

  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="48.000000pt"
      height="48.000000pt"
      viewBox="0 0 48.000000 48.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)"
        fill="rgba(255,255,255,0.9)"
        stroke="none"
      >
        <path
          d="M218 448 c-8 -7 -61 -93 -117 -190 -87 -151 -101 -180 -91 -198 10
-19 20 -20 230 -20 210 0 220 1 230 20 10 18 -4 47 -91 198 -93 161 -121 202
-139 202 -3 0 -13 -6 -22 -12z"
        />
      </g>
    </svg>
  );
};

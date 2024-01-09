import { cn } from "#src/utils/cn";

type Props = React.SVGProps<SVGSVGElement>;

export function IconDiscord({ className = "", ...props }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 293"
      preserveAspectRatio="xMidYMid"
      className={cn("h-6 w-6", className)}
      aria-label="Discord"
      {...props}
    >
      <path
        d="M226.011 0H29.99C13.459 0 0 13.458 0 30.135v197.778c0 16.677 13.458 30.135 29.989 30.135h165.888l-7.754-27.063 18.725 17.408 17.7 16.384L256 292.571V30.135C256 13.458 242.542 0 226.011 0zm-56.466 191.05s-5.266-6.291-9.655-11.85c19.164-5.413 26.478-17.408 26.478-17.408-5.998 3.95-11.703 6.73-16.823 8.63-7.314 3.073-14.336 5.12-21.211 6.291-14.044 2.633-26.917 1.902-37.888-.146-8.339-1.61-15.507-3.95-21.504-6.29-3.365-1.317-7.022-2.926-10.68-4.974-.438-.293-.877-.439-1.316-.732-.292-.146-.439-.292-.585-.438-2.633-1.463-4.096-2.487-4.096-2.487s7.022 11.703 25.6 17.261c-4.388 5.56-9.801 12.142-9.801 12.142-32.33-1.024-44.617-22.235-44.617-22.235 0-47.104 21.065-85.285 21.065-85.285 21.065-15.799 41.106-15.36 41.106-15.36l1.463 1.756C80.75 77.53 68.608 89.088 68.608 89.088s3.218-1.755 8.63-4.242c15.653-6.876 28.088-8.777 33.208-9.216.877-.147 1.609-.293 2.487-.293a123.776 123.776 0 0 1 29.55-.292c13.896 1.609 28.818 5.705 44.031 14.043 0 0-11.556-10.971-36.425-18.578l2.048-2.34s20.041-.44 41.106 15.36c0 0 21.066 38.18 21.066 85.284 0 0-12.435 21.211-44.764 22.235zm-68.023-68.316c-8.338 0-14.92 7.314-14.92 16.237 0 8.924 6.728 16.238 14.92 16.238 8.339 0 14.921-7.314 14.921-16.238.147-8.923-6.582-16.237-14.92-16.237m53.394 0c-8.339 0-14.922 7.314-14.922 16.237 0 8.924 6.73 16.238 14.922 16.238 8.338 0 14.92-7.314 14.92-16.238 0-8.923-6.582-16.237-14.92-16.237"
        fill="#7289DA"
      />
    </svg>
  );
}

export function IconFacebook({ className, ...props }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      clip-rule="evenodd"
      fill-rule="evenodd"
      //image-rendering="optimizeQuality"
      //shape-rendering="geometricPrecision"
      //text-rendering="geometricPrecision"
      viewBox="6702.77 18309.17 6561.66 6561.660000000007"
      className={cn("h-6 w-6", className)}
      aria-label="Facebook"
      {...props}
    >
      <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="9983.6" x2="9983.6" y1="18249.39" y2="25150.62">
        <stop offset="0" stop-color="#00b2ff" />
        <stop offset="1" stop-color="#006aff" />
      </linearGradient>
      <path
        d="M9983.6 18309.17c1811.95 0 3280.83 1468.88 3280.83 3280.83s-1468.88 3280.83-3280.83 3280.83S6702.77 23401.95 6702.77 21590s1468.88-3280.83 3280.83-3280.83z"
        fill="url(#a)"
      />
      <path
        d="M10409.89 24843.29v-2534.17h714.43l94.7-891.91h-809.13l1.2-446.44c0-232.63 22.1-357.22 356.24-357.22h446.68v-892.06h-714.59c-858.35 0-1160.42 432.65-1160.42 1160.34v535.45h-535.07v891.99H9339v2498.09c208.45 41.53 423.95 63.47 644.6 63.47a3310.9 3310.9 0 0 0 426.29-27.54z"
        fill="#fff"
        fill-rule="nonzero"
      />
    </svg>
  );
}

export function IconGithub({ className, ...props }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("h-6 w-6", className)}
      aria-label="Github"
      {...props}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function IconGoogle({ className, ...props }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("h-6 w-6", className)}
      aria-label="Google"
      {...props}
    >
      <path
        fill="#EA4335"
        d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
      />
      <path
        fill="#34A853"
        d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
      />
      <path
        fill="#4A90E2"
        d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
      />
    </svg>
  );
}

export function IconTwitter({ className, ...props }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="117.806 161.288 464.388 377.424"
      className={cn("h-6 w-6", className)}
      aria-label="Twitter"
      {...props}
    >
      <path
        d="m582.194 205.976c-17.078 7.567-35.424 12.68-54.71 14.991 19.675-11.78 34.769-30.474 41.886-52.726-18.407 10.922-38.798 18.857-60.497 23.111-17.385-18.488-42.132-30.064-69.538-30.064-52.603 0-95.266 42.663-95.266 95.307a97.3 97.3 0 0 0 2.454 21.68c-79.211-3.989-149.383-41.928-196.382-99.562-8.18 14.112-12.885 30.474-12.885 47.899 0 33.05 16.833 62.236 42.377 79.314a95.051 95.051 0 0 1 -43.154-11.924v1.227c0 46.16 32.826 84.672 76.43 93.426a95.97 95.97 0 0 1 -25.095 3.313 95.929 95.929 0 0 1 -17.936-1.677c12.128 37.836 47.306 65.406 89.008 66.142-32.622 25.565-73.71 40.802-118.337 40.802-7.69 0-15.278-.45-22.743-1.33 42.173 27.06 92.24 42.807 146.029 42.807 175.275 0 271.094-145.17 271.094-271.073 0-4.09-.103-8.222-.287-12.312 18.612-13.458 34.769-30.208 47.51-49.29z"
        fill="#1da1f2"
      />
    </svg>
  );
}

export function IconBellWithNumber({ number, className, ...props }: { number: number } & Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 48 48"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("hover:bg-secondary h-12 w-12 text-xs font-thin hover:rounded-full", className)}
      {...props}
    >
      <path transform="translate(12,12)" d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0" />

      {number > 0 && (
        <g transform="translate(34,15)">
          <circle cx="0" cy="0" r="10" stroke="none" fill="#ef4444" />
          <text x="0" y="0" textAnchor="middle" dominantBaseline="central" stroke="#d4d4d4" fill="none">
            {number > 9 ? 9 : number}
          </text>
        </g>
      )}
    </svg>
  );
}

export function IconChatWithNumber({ number, className, ...props }: { number: number } & Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 48 48"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("hover:bg-secondary h-12 w-12 text-xs font-thin hover:rounded-full", className)}
      {...props}
    >
      <g transform="translate(12,12)">
        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
      </g>

      {number > 0 && (
        <g transform="translate(34,15)">
          <circle cx="0" cy="0" r="10" stroke="none" fill="#ef4444" />
          <text x="0" y="0" textAnchor="middle" dominantBaseline="central" stroke="#d4d4d4" fill="none">
            {number > 9 ? 9 : number}
          </text>
        </g>
      )}
    </svg>
  );
}

export function IconLoadingSpinner({ className, ...props }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className={cn("h-6 w-6", className)} {...props}>
      <circle cx="250" cy="250" r="230" fill="none" stroke="#64748b" strokeWidth="40" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="40"
        strokeLinecap="butt"
        d="M 250 250 m 230 0 a 230 230 0 0 1 -230 230"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="0.75s"
          repeatCount="indefinite"
          begin="0s"
          values="0 250 250; 360 250 250"
        />
      </path>
    </svg>
  );
}

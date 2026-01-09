import * as React from "react"
import { SVGProps } from "react"

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      {...props}
    >
      <path
        d="M50 10L90 90H10L50 10Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinejoin="round"
      />
    </svg>
  )
}

import * as React from "react"
import { SVGProps } from "react"

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2,21L8,3L12,11L17,6L22,21" style={{ fill: 'none' }} />
      <path d="M4.14,15.08C6.76,13.51,9.38,13.65,12,15.5C14.74,17.44,17.49,17.5,20.23,15.69" style={{ fill: 'none' }} />
    </svg>
  )
}

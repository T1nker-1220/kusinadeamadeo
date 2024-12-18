import { AriaAttributes, DOMAttributes } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
      section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
      a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
      img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
      label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>
      nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>
      li: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLIElement>, HTMLLIElement>
      header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      footer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      article: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
} 
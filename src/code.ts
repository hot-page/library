import prism from 'prismjs'
import css from 'prismjs/themes/prism.min.css?inline'

const prismStyles = new CSSStyleSheet()
prismStyles.replace(css)

const styleSheet = new CSSStyleSheet()
styleSheet.replace(`
  code {
    display: block;
    padding: 8px;
    font-family: var(--code-font);
    white-space: pre-wrap;
    word-break: break-all;
  }

  .token {
    background: none !important;
  }
`)

class HotPageCode extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    this.attachShadow({ mode: 'open' })
    this.shadowRoot!.adoptedStyleSheets = [prismStyles, styleSheet]
    const language =
      ['html','css', 'javascript'].includes(this.getAttribute('language'))
        ? this.getAttribute('language')
        : 'html'
    const code = prism.highlight(
      this.textContent,
      prism.languages[language],
      language,
    )
    this.shadowRoot!.innerHTML = `<code>${code}</code>`
  }
}

customElements.define('hot-page-code', HotPageCode)

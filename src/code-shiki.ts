import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import theme from 'shiki/themes/slack-ochin.mjs'
import js from 'shiki/langs/javascript.mjs'
import css from 'shiki/langs/css.mjs'
import html from 'shiki/langs/html.mjs'

const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(`
  pre {
    margin: 0;
    white-space: pre-wrap;
  }

  code {
    display: block;
    font-family: var(--code-font);
    padding: 16px;
    background-color: var(--primary-color-100);
  }

  /* indents wrapped lines */
  code .line {
    display: inline-block;
    min-height: 1.2em;
    text-indent: -1.5em;
    padding-left: 1.5em;
  }
`)

class HotPageCode extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    this.attachShadow({ mode: 'open' })
    const shiki = await createHighlighterCore({
      themes: [theme],
      langs: [js, css, html],
      engine: createJavaScriptRegexEngine(),
    })
    this.shadowRoot!.adoptedStyleSheets = [styleSheet]
    const lang =
      ['html','css', 'javascript'].includes(this.getAttribute('language'))
        ? this.getAttribute('language')
        : 'html'
    let input = this.textContent
    // This sucks but there's a big issue where it will only color properties
    // that are inside a block
    if (lang == 'css') input = `.foo {\n${input}\n}`
    const output = shiki
      .codeToHtml(
        input,
        { lang, theme: 'slack-ochin' }
      )
    console.log(output)
    this.shadowRoot!.innerHTML = output
    // Remove what we added to the source above
    if (lang == 'css') {
      const code = this.shadowRoot!.querySelector('code')!
      code.childNodes[1].remove() // the newline text node
      code.childNodes[0].remove()
      code.childNodes[code.childNodes.length - 1].remove()
    }
  }
}

customElements.define('hot-page-code', HotPageCode)

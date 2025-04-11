const styles = new CSSStyleSheet()
styles.replace(`
  details ::marker {
    content: '';
  }

  summary {
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-tems: center;
    gap: 4px;
  }

  #chevron {
    transform: rotate(-90deg);
    transition: transform 200ms;
  }

  details[open] #chevron {
    transform: rotate(0deg);
  }

  summary svg {
    width: 1em;
    height: 1em;
  }
`)

class ExtraHelp extends HTMLElement {

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.adoptedStyleSheets = [styles]
  }

  connectedCallback() {
    this.#render()
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <details>
        <summary>
          <svg id="chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 33 33">
            <path
              fill="var(--icon-color-900)"
              d="M16.5,24.8L4.2,11.3l2.9-3.1,9.5,10.3,9.5-10.3,2.9,3.1-12.3,13.5Z"
            />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 33 33">
            <path fill="var(--icon-color-300)" stroke="var(--icon-color-900)" d="M15 30c7.5.9 14.2-4.4 15.1-11.9A13.5 13.5 0 0 0 14.9 3a13.6 13.6 0 0 0 0 27Z" />
            <path fill="var(--icon-color-900)" d="m22 13.2-3.3 3.6v2h-3.4v-2.2l3.4-3.6v-2.4h-3.3l-.6.1-.6.4-.4.6-.2.6H12q0-.6.3-1.3a4 4 0 0 1 1.9-1.8l1.2-.3h3q.8 0 1.3.3l1.2.7.8 1.1.3 1.3zM18.7 24h-3.4v-3.4h3.4z" />
          </svg>
          <slot name="summary">
            How does this work?
          </slot>
        </summary>
        <div>
          <slot></slot>
        </div>
      </details>
    `
  }
}

customElements.define('extra-help', ExtraHelp)

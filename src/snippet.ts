const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(`
  :host {
    cursor: grab;
    display: block;
  }

  #container {
    display: grid;
    grid-template-rows: auto auto;
  }

  #header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: end;
    align-items: center;
    gap: 4px;
  }

  @supports not (anchor-name: --info) {
    #info {
      display: none;
    }

    #info-popup {
      display: none;
    }
  }

  @supports (anchor-name: --info) {
    #info {
      anchor-name: --info;
    }

    #info-popup {
      display: none; 
      opacity: 0;
      border: 1px solid var(--primary-color-900);
      background-color: var(--primary-color-100);
      position: fixed;
      position-anchor: --info;
      top: calc(anchor(bottom) + 8px);
      left: 16px;
      right: 16px;
      z-index: 1;
      transition:
        opacity 300ms ease-out,
        display 300ms allow-discrete;
    }

    #info-arrow {
      border-top: 1px solid var(--primary-color-900);
      border-left: 1px solid var(--primary-color-900);
      background-color: var(--primary-color-100);
      position: fixed;
      position-anchor: --info;
      top: calc(anchor(bottom) + 2px);
      left: calc(anchor(center) - 6px);
      width: 12px;
      height: 12px;
      transform: rotate(45deg);
    }

    #info:hover + #info-popup {
      display: block;
      opacity: 1;
    }

    @starting-style {
      #info:hover + #info-popup {
        opacity: 0;
      }
    }
  }

`)

class HotPageSnippet extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.addEventListener('pointerdown', this.#handlePointerDown)
    this.addEventListener('slotchange', this.#render)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot!.adoptedStyleSheets = [styleSheet]
    this.#render()
  }

  disconnectedCallback() {
    this.removeEventListener('pointerdown', this.#handlePointerDown)
  }

  #dataTransfer() {
    const dataTransfer = { }
    if (this.hasAttribute('hot-sheet-nodes')) {
      dataTransfer['application/x-hot-sheet-nodes'] = this.getAttribute('hot-sheet-nodes')
    }
    if (this.hasAttribute('hot-dom-elements')) {
      dataTransfer['application/x-hot-dom-elements'] = this.getAttribute('hot-dom-elements')
    }
    return dataTransfer
  }

  #handlePointerDown = (event: PointerEvent) => {
    if (event.which !== 1) return
    if (
      !this.getAttribute('hot-dom-elements') &&
      !this.getAttribute('hot-sheet-nodes')
    ) {
      return
    }
    event.preventDefault()
    this.style.cursor = 'grabbing'
    this.setPointerCapture(event.pointerId)
    this.addEventListener('pointermove', this.#handlePointerMove)
    this.addEventListener('pointerup', this.#handlePointerUp)
    window.top?.postMessage(
      {
        name: 'dragStart',
        x: event.clientX,
        y: event.clientY,
        dataTransfer: this.#dataTransfer()
      },
      '*',
    )
  }

  #handlePointerMove = (event: PointerEvent) => {
    window.top?.postMessage(
      {
        name: 'dragMove',
        x: event.clientX,
        y: event.clientY,
        dataTransfer: this.#dataTransfer(),
      },
      '*',
    )
  }

  #handlePointerUp = (event: PointerEvent) => {
    this.removeEventListener('pointermove', this.#handlePointerMove)
    this.removeEventListener('pointerup', this.#handlePointerUp)
    this.style.cursor = ''
    window.top?.postMessage(
      {
        name: 'dragEnd',
        x: event.clientX,
        y: event.clientY,
        dataTransfer: this.#dataTransfer(),
      },
      '*',
    )
  }

  #render() {
    const hasInfo = this.querySelector('[slot="info"]')
    this.shadowRoot!.innerHTML = `
      <div id="container">
        <div id="header">
          ${hasInfo
            ? `<svg id="info" width="24" height="24" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="var(--icon-color-300)"
                  stroke="var(--icon-color-900)"
                  strokeMiterlimit="10"
                  strokeWidth="1.4"
                  d="M17 30.5a14.4 14.4 0 1 0 0-28.8 14.4 14.4 0 0 0 0 28.8Z"
                />
                <path
                  fill="var(--icon-color-900)"
                  d="M18.6 10.5h-3.2V8.9h3.2zm0 12.8h-3.2V12h3.2z"
                />
              </svg>`
            : ''
          }
          <div id="info-popup">
            <div id="info-arrow"></div>
            <slot name="info"></slot>
          </div>
          <svg part="icon" width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              stroke="var(--icon-color-900)"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="1.4"
              d="M11.5 29.5H6.9a2.7 2.7 0 0 1-2.7-2.7v-4.6M29.8 22.2v4.6c0 1.5-1.3 2.7-2.8 2.7h-4.5M22.5 4H27c1.6 0 2.8 1.2 2.8 2.7v4.6M4.2 11.3V6.7c0-1.5 1.2-2.8 2.7-2.8h4.6"
            />
            <path
              fill="var(--icon-color-300)"
              fillRule="evenodd"
              stroke="var(--icon-color-900)"
              strokeMiterlimit="10"
              strokeWidth="1.4"
              d="M22 11.3q-1.2.1-1.3 1.3V10a1.4 1.4 0 1 0-2.8 0V8.5a1.4 1.4 0 1 0-2.7 0V10a1.4 1.4 0 1 0-2.8 0V16q-.2.9-1 .4L10 15.2c-.6-.6-1.7-.6-2.3 0s-.6 1.7 0 2.3l3.3 4.4a4 4 0 0 0 4 2.8h3c3 0 5.3-2.3 5.3-5.2v-7q-.1-1.2-1.4-1.3Z"
              clipRule="evenodd"
            />
            <path
              stroke="var(--icon-color-900)"
              strokeMiterlimit="10"
              strokeWidth="1.4"
              d="M15.2 15.1V10M18 15.1V10M20.7 15.1V10"
            />
          </svg>
        </div>
        <slot></slot>
      </div>
    `
  }

}

customElements.define('hot-page-snippet', HotPageSnippet)

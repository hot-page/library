const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(`
  #containser {
    display: grid;
    grid-template-rows: auto auto;
  }

  #icon {
    width: fit-content;
    justify-self: end;
    cursor: grab;
  }
`)

class HotPageSnippet extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.addEventListener('pointerdown', this.#handlePointerDown)
    this.style.cursor = 'grab'
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.adoptedStyleSheets = [styleSheet]
    this.shadowRoot.innerHTML = `
      <div id="container">
        <div id="icon">
          <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">


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

  disconnectedCallback() {
    this.removeEventListener('pointerdown', this.#handlePointerDown)
  }

  #handlePointerDown = (event) => {
    if (event.which !== 1) return
    event.preventDefault()
    this.setPointerCapture(event.pointerId)
    this.addEventListener('pointermove', this.#handlePointerMove)
    this.addEventListener('pointerup', this.#handlePointerUp)
    window.top?.postMessage(
      {
        name: 'dragStart',
        dataTransfer: {
          'application/x-hot-dom-elements':
            this.getAttribute('hot-dom-elements'),
        },
      },
      '*',
    )
  }

  #handlePointerMove = (event) => {
    window.top?.postMessage(
      {
        name: 'dragMove',
        x: event.clientX,
        y: event.clientY,
        dataTransfer: {
          'application/x-hot-dom-elements':
            this.getAttribute('hot-dom-elements'),
        },
      },
      '*',
    )
  }

  #handlePointerUp = (event) => {
    this.removeEventListener('pointermove', this.#handlePointerMove)
    this.removeEventListener('pointerup', this.#handlePointerUp)
    window.top?.postMessage(
      {
        name: 'dragEnd',
        x: event.clientX,
        y: event.clientY,
        dataTransfer: {
          'application/x-hot-dom-elements':
            this.getAttribute('hot-dom-elements'),
        },
      },
      '*',
    )
  }
}

customElements.define('hot-page-snippet', HotPageSnippet)

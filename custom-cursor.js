class CustomCursor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    this.injectGlobalStyles();
    this.injectScrollbarStyles(); // Added scrollbar logic
    this.render();
    this.initCursor();
  }

  injectGlobalStyles() {
    const style = document.createElement('style');
    style.innerHTML = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);
  }

  injectScrollbarStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Webkit (Chrome, Safari, Edge) */
      ::-webkit-scrollbar {
        width: 8px;
        background: #111; /* Match a dark background */
      }
      ::-webkit-scrollbar-track {
        background: #111;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2); 
        border-radius: 10px;
        border: 2px solid #111; /* Creates padding effect */
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
      }

      /* Firefox (Limited support) */
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.2) #111;
      }
    `;
    document.head.appendChild(style);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 999999;
          opacity: 1;
          transition: opacity 0.3s;
        }
        .dot, .trail {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          transition: width 0.2s, height 0.2s, background-color 0.2s, border-color 0.2s;
        }
        .dot {
          width: 6px;
          height: 6px;
          background: #fff;
        }
        .trail {
          width: 30px;
          height: 30px;
          border: 1.5px solid rgba(255, 255, 255, 0.5);
        }
        :host(.hovered) .dot { width: 4px; height: 4px; }
        :host(.hovered) .trail {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.8);
        }
      </style>
      <div class="dot"></div>
      <div class="trail"></div>
    `;
  }

  initCursor() {
    const dot = this.shadowRoot.querySelector('.dot');
    const trail = this.shadowRoot.querySelector('.trail');

    window.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      trail.animate({
        transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`
      }, { duration: 400, fill: 'forwards' });

      const isClickable = e.target.closest('a, button, [role="button"], input, .clickable');
      isClickable ? this.classList.add('hovered') : this.classList.remove('hovered');
    });

    document.addEventListener('mouseleave', () => this.style.opacity = '0');
    document.addEventListener('mouseenter', () => this.style.opacity = '1');
  }
}

customElements.define('custom-cursor', CustomCursor);
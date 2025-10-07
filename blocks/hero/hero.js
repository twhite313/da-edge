const heroBlock = document.querySelector('.hero');
const h1Element = heroBlock?.querySelector('h1');

if (h1Element) {
  // Extract only text nodes (ignore <picture> etc.)
  let textOnly = '';
  h1Element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      textOnly += node.textContent;
    }
  });
  // Remove newlines, tabs, and trim whitespace
  const cleanText = textOnly.replace(/[\n\r\t]/g, '').trim();

  // Only update if text starts with 'FeDX'
  if (cleanText.startsWith('FeDX')) {
    // Simple approach: replace DX in the entire innerHTML
    h1Element.innerHTML = h1Element.innerHTML.replace(/DX/g, '<span class="dx">DX</span>');
  }
}

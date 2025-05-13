// Helper functions for DOM manipulation and querying

/**
 * Creates a delay promise for the specified milliseconds
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after the delay
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Tries to find a DOM element with retries
 * @param {string} selector - CSS selector to find
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} waitTime - Time to wait between attempts in ms
 * @returns {Promise<Element|null>} - Found element or null
 */
export async function findElement(selector, maxAttempts = 5, waitTime = 1000) {
  let attempts = 0;
  while (attempts < maxAttempts) {
    let element = document.querySelector(selector);
    if (element) return element;
    console.log(
      `Attempt ${attempts + 1}: Element ${selector} not found, retrying...`
    );
    await delay(waitTime);
    attempts++;
  }
  console.warn(`Element ${selector} not found after ${maxAttempts} attempts.`);
  return null;
}

/**
 * Simulates pressing Enter key on an element
 * @param {Element} element - DOM element to dispatch event on
 */
export function dispatchEnterKey(element) {
  const enterEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    keyCode: 13,
    bubbles: true,
  });
  element.dispatchEvent(enterEvent);
}

// Functions for handling watchers in different Jira environments
import { delay, findElement, dispatchEnterKey } from './domUtils.js';

/**
 * Adds watchers to a standard Jira ticket
 * @param {string[]} contacts - Array of email addresses to add as watchers
 */
export async function addJira(contacts) {
  let shareButton = await findElement('a.js-share-request');
  if (!shareButton) {
    return;
  }
  shareButton.click();
  console.log('Clicked on Share!');
  await delay(2000);

  mainloop: for (const email of contacts) {
    console.log(`Adding: ${email}`);
    const select2Dropdown = await findElement('.select2-choices');
    if (!select2Dropdown) {
      console.warn('Select2 dropdown not found.');
      continue;
    }
    select2Dropdown.click();
    console.log('Clicked Select2 dropdown.');
    await delay(500);

    const select2Input = await findElement('.select2-input');
    if (!select2Input) {
      console.warn(`Select2 input field not found for ${email}`);
      continue;
    }
    select2Input.focus();
    select2Input.value = email;
    select2Input.dispatchEvent(new Event('input', { bubbles: true }));

    let label;
    let attempts = 0;
    while (!label) {
      await delay(1000);
      label = document.querySelector('.select2-result-label');
      attempts++;
      if (attempts > 5) continue mainloop;
    }

    dispatchEnterKey(select2Input);
    console.log(`Confirmed ${email}`);
    await delay(1000);
  }

  // Find and click the "Share" button
  const confirmButton = await findElement(
    'button.js-add-button.aui-button-primary'
  );
  if (!confirmButton) {
    console.warn('Confirm button not found');
  }
  confirmButton.click();
  await delay(3000);
  console.log('All watchers have been added.');
  window.alert('All watchers have been added. You may close the tab now.');
}

/**
 * Adds watchers to an OpsJira ticket
 * @param {string[]} contacts - Array of email addresses to add as watchers
 */
export async function addOpsJira(contacts) {
  mainloop: for (const email of contacts) {
    const share = await findElement(
      'a[data-testid="rw_add_participants_button"]'
    );
    if (!share) {
      return;
    }
    share.click();
    console.log('Clicked on Share!');
    await delay(2000);
    console.log(`Adding: ${email}`);

    const rwParticipantInput = await findElement('#rw_participant_input');
    if (!rwParticipantInput) {
      console.warn('Select2 dropdown not found.');
      continue;
    }
    rwParticipantInput.value = email;
    rwParticipantInput.dispatchEvent(new KeyboardEvent('keyup', { key: '@' }));
    console.log('Entered email.');

    let rwItemResults = null;
    let attempts = 0;
    const shareButton = await findElement('#rw_share_request_submit_button');
    if (!shareButton) {
      console.warn(`Confirm button not found for ${email}`);
      continue mainloop;
    }

    while (!rwItemResults) {
      await delay(1000);
      rwItemResults = document.querySelector(
        `.rw_item_results a[data-username=\"${email}\"]`
      );
      attempts++;
      if (attempts > 5) {
        document
          .querySelector('#rw_share_request_submit_button + button')
          .click();
        continue mainloop;
      }
    }

    rwItemResults.click();
    await delay(1000);
    console.log(shareButton);
    shareButton.click();
    while (share.classList.contains('rw_active')) {
      await delay(1000);
    }
  }
  window.alert('All watchers have been added. You may close the tab now.');
}

/**
 * Determines which Jira system is being used and adds watchers accordingly
 * @param {string[]} contacts - Array of email addresses to add as watchers
 */
export async function addWatchersSequentially(contacts) {
  const URL = window.location.href;
  if (/.*GSDFE.*/.test(URL)) {
    addOpsJira(contacts);
  } else {
    addJira(contacts);
  }
}

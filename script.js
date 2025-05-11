chrome.storage.sync.get('listItems', function(data) {
    function addWatchers(contacts) {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        async function findElement(selector, maxAttempts = 5, waitTime = 1000) {
            let attempts = 0;
            while (attempts < maxAttempts) {
                let element = document.querySelector(selector);
                if (element) return element;
                console.log(`Attempt ${attempts + 1}: Element ${selector} not found, retrying...`);
                await delay(waitTime);
                attempts++;
            }
            console.warn(`Element ${selector} not found after ${maxAttempts} attempts.`);
            return null;
        }

        async function addJira() {
            let shareButton = await findElement('a.js-share-request');
            if (!shareButton) {
                return;
            };
            shareButton.click();
            console.log("Clicked on Share!");
            await delay(2000);
            mainloop: for (const email of contacts) {
                console.log(`Adding: ${email}`);
                const select2Dropdown = await findElement('.select2-choices');
                if (!select2Dropdown) {
                    console.warn("Select2 dropdown not found.");
                    continue;
                }
                select2Dropdown.click();
                console.log("Clicked Select2 dropdown.");
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
                    label = document.querySelector(".select2-result-label");
                    attempts++;
                    if (attempts > 5)
                        continue mainloop;
                }

                const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true });
                select2Input.dispatchEvent(enterEvent);
                console.log(`Confirmed ${email}`);
                await delay(1000);
            }
            // Find and click the "Share" button
            const confirmButton = await findElement('button.js-add-button.aui-button-primary');
            if (!confirmButton) {
                console.warn(`Confirm button not found for ${email}`);
            }
            confirmButton.click();
            await delay(3000);
            console.log("All watchers have been added.");
        }

        async function addOpsJira() {
            mainloop: for (const email of contacts) {
                const share = await findElement('a[data-testid="rw_add_participants_button"]');
                if (!share) {
                    return;
                };
                share.click();
                console.log("Clicked on Share!");
                await delay(2000);
                console.log(`Adding: ${email}`);
                const rwParticipantInput = await findElement('#rw_participant_input');
                if (!rwParticipantInput) {
                    console.warn("Select2 dropdown not found.");
                    continue;
                }
                rwParticipantInput.value = email;
                rwParticipantInput.dispatchEvent(new KeyboardEvent('keyup', { key: '@' }));
                console.log("Entered email.");
                let rwItemResults = null;
                let attempts = 0;
                const shareButton = await findElement('#rw_share_request_submit_button');
                if (!shareButton) {
                    console.warn(`Confirm button not found for ${email}`);
                    continue mainloop;
                }
                while (!rwItemResults) {
                    await delay(1000);
                    rwItemResults = document.querySelector(`.rw_item_results a[data-username=\"${email}\"]`);
                    attempts++;
                    if (attempts > 5) {
                        document.querySelector('#rw_share_request_submit_button + button').click()
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
        }

        async function addWatchersSequentially() {
            const URL = window.location.href;
            if (/.*GSDFE.*/.test(URL))
                addOpsJira();
            else
                addJira();
        }

        addWatchersSequentially();
    }

    if (data.listItems && data.listItems.trim() !== '') {
        const teamMembers = data.listItems.split(',').map(item => item.trim()).filter(item => item !== '');

        if (teamMembers.length > 0) {
            addWatchers(teamMembers)
        } else {
            window.alert("No team members found in the list. Add team members in the options page.")
        }
    } else {
        window.alert("No team members found in the list. Add team members in the options page.")
    }
});

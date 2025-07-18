// Main script that runs when extension is triggered
chrome.storage.sync.get('listItems', async function (data) {
  const sendRequest = async (domainRules, emails) => {
    let response = await fetch(domainRules['fetchUrl'], {
      headers: {
        'content-type': 'application/json',
        priority: 'u=1, i',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest',
      },
      referrer: `${url}`, // Full URL
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: `{\"usernames\":[${emails.reduce(
        (acc, curr, idx) => acc + `${!idx ? '' : ','}\"` + curr + '"',
        ''
      )}]}${domainRules['structure']}`,
      method: `${domainRules['method']}`,
      mode: 'cors',
      credentials: 'include',
    });
    if (!response?.ok) {
      return null;
    }
  }

  const finish = async () => {
    chrome.runtime.sendMessage({
      type: "ADDING_COMPLETE",
      data: {
        url: window.location.href
      }
    })
  }

  console.log('Running script');

  const list = data.listItems;
  if (!list?.length) {
    alert(
      `No team members added.\nAdd a comma-delineated list of team members on the option page before proceeding.`
    );
    return;
  }
  const emails = list.split(',').map(word => word.trim());
  const url = window.location.href;
  const code = url.match(/[A-Z0-9]+\-[0-9]+/);
  let domain = url.match(/[a-z0-9]+\.uberinternal\.com/)[0];
  const domainRules = {
    't3.uberinternal.com': {
      fetchUrl: `https://${domain}/rest/share/1.0/issue/${code}`,
      method: 'POST',
      structure: ',"message":"","emails":[]',
    },
    'jira.uberinternal.com': {
      fetchUrl: `https://${domain}/rest/servicedesk/1/customer/participants/${code}/share`,
      method: 'PUT',
      structure: ',"organisationIds":[],"emails":[]',
    },
  };

  let response = await sendRequest(domainRules[domain], emails);
  if (response)
    return await finish();
  domain =
    domain === 't3.uberinternal.com'
      ? 'jira.uberinternal.com'
      : 't3.uberinternal.com';
  response = await sendRequest(domainRules[domain], emails);
  if (response)
    return await finish();
  alert('An error has occurred.\nCheck the console for more information.');
});

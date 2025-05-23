// Main script that runs when extension is triggered
chrome.storage.sync.get('listItems', async function (data) {
  let addWatchersSequentially = await (async () =>
    (
      await import('./utils/watcherUtils.js')
    ).addWatchersSequentially)();
  console.log(addWatchersSequentially);
  function addWatchers(contacts) {
    addWatchersSequentially(contacts);
  }

  if (data.listItems && data.listItems.trim() !== '') {
    const teamMembers = data.listItems
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');

    if (teamMembers.length > 0) {
      addWatchers(teamMembers);
    } else {
      window.alert(
        'No team members found in the list. Add team members in the options page.'
      );
    }
  } else {
    window.alert(
      'No team members found in the list. Add team members in the options page.'
    );
  }
});

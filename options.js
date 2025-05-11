document.addEventListener('DOMContentLoaded', function () {
  // Load saved items
  chrome.storage.sync.get('listItems', function (data) {
    if (data.listItems) {
      document.getElementById('listItems').value = data.listItems;
    }
  });

  // Save button functionality
  document.getElementById('saveBtn').addEventListener('click', function () {
    const listItems = document.getElementById('listItems').value;
    chrome.storage.sync.set({ listItems: listItems }, function () {
      const status = document.getElementById('status');
      status.textContent = 'Team list saved!';
      setTimeout(function () {
        status.textContent = '';
      }, 1500);
    });
  });
});

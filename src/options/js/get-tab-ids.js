chrome.tabs.getCurrent(function(tab) {
  chrome.tabs.query({windowId: windowId},  function(res) {
    alert(res);
  });
});


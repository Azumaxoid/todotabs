var KEY_OTHERS = 'Others';
function urlContains(urlDataList, url) {
  return !!urlDataList.find(function(urlData) { return urlData.url === url; });
}
function addUrl(data, src) {
  return data.find(function(urlData) {
    if (urlData.host === src.host) {
      return !urlContains(urlData.value, src.url) && urlData.value.push(src);
    }
    return false;
  });
}
function dateToStr(date) {
  return fillZero(date.getMonth())
         + '/' + fillZero(date.getDate())
         + ' ' + fillZero(date.getHours())
         + ':' + fillZero(date.getMinutes());
}
function fillZero(val) {
  return (val < 10) ? ('0' + val) : val;
}
chrome.browserAction.onClicked.addListener(function() {
  var date = dateToStr(new Date());
  chrome.tabs.query({},  function(res) {
    chrome.storage.sync.get(['urls'], function(data) {
      try {
        var storedData = data.urls || [];
        var tabIds = res.map(function(tab) {
          if (tab.url.startsWith('chrome')) {
            return '';
          }
　　　　　  　　　var host = tab.url.split('/')[2];
          var newUrl = { favIconUrl: tab.favIconUrl, title: tab.title, url: tab.url, host: host, date: date };
          !addUrl(storedData, newUrl) && storedData.push({key:host, host:host, value:[newUrl]});
          return tab.id;
      
        }).filter(function(data) { return data !== ''; });;
        chrome.tabs.remove(tabIds, function() {
          chrome.storage.sync.set({'urls': storedData}, function() {
            chrome.tabs.create({url:chrome.extension.getURL("src/options/index.html")});
          });
        });
      } catch (e) {
        alert(e);
      }
    });
  });
});


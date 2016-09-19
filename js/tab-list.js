var contents = document.getElementById('contents');
var content_tmp = document.querySelector('.content').cloneNode(true);
document.querySelector('.content').remove();
var item_tmp = content_tmp.querySelector('.item').cloneNode(true);
content_tmp.querySelector('.item').remove();
var storedData = {};
var timer = null;
function setTitle(content, data) {
  var titleTag = content.querySelector('.title');
  titleTag.innerText = data.key;
  titleTag.addEventListener('keyup', function(e){
    data.key = titleTag.innerText;
    saveData();
  });
  titleTag.addEventListener('blur', function(e){
    data.key = titleTag.innerText;
    saveData();
  });
  titleTag.addEventListener('keydown', function(e){
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  });
}
function saveData() {
  timer && clearTimeout(timer);
  timer = setTimeout(function() {
    chrome.storage.sync.set({'urls': storedData}, function() {});
  }, 200);
}
function addUrls(items, urlData, key) {
  var newItem = item_tmp.cloneNode(true);
  var aTag = newItem.querySelector('.url');
  aTag.href = aTag.title = urlData.url;
  newItem.querySelector('.favicon').src = urlData.favIconUrl;
  newItem.querySelector('.name').innerText = urlData.title;
  newItem.querySelector('.time').innerText = urlData.date;
  items.appendChild(newItem);
  newItem.querySelector('.delete')
  .addEventListener('click', function() { deleteItem(newItem, urlData, key); });
  var urlTag = newItem.querySelector('.url');
  urlTag.addEventListener('click', function() { openSite(urlData); });
  urlTag.addEventListener('dragstart', function(e) { e.preventDefault(); return false; });
}
function deleteItem(target, targetData, key) {
  var urls = storedData.find(function(data) { return data.key === key; }).value;
  urls.splice(urls.findIndex(function(data) { return data.url === targetData.url; }), 1);
  chrome.storage.sync.set({'urls': storedData}, function() {
    target.remove();
  });
}
function openSite(targetData) {
  targetData.date = dateToStr(new Date());
  window.open(targetData.url);
  chrome.storage.sync.set({'urls': storedData}, function() {
    render();
  });
}
function openAllSite(group) {
  group.value.forEach(function(urlData) {
    urlData.date = dateToStr(new Date());
    window.open(urlData.url);
  });
  chrome.storage.sync.set({'urls': storedData}, function() {
    render();
  });
}
function deleteAllSite(group) {
  storedData.splice(storedData.indexOf(group), 1);
  chrome.storage.sync.set({'urls': storedData}, function() {
    render();
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
function render() {
  contents.innerHTML = '';
  chrome.storage.sync.get(['urls'], function(data) {
    storedData = data.urls || [];
    storedData.forEach(function(data) {
      var newContent = content_tmp.cloneNode(true);
      var items = newContent.querySelector('.items');
      setTitle(newContent, data);
      data.value.forEach(function(urlData, index) { addUrls(items, urlData, data.key); });
      contents.appendChild(newContent);
      newContent.querySelector('.open_all').addEventListener('click', function() { openAllSite(data); });
      newContent.querySelector('.delete_all').addEventListener('click', function() { deleteAllSite(data); });
    });
  });
}

render();

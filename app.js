const getLink = node => {
  if (!node) {
    return null; 
  }
  return node.href ? node : getLink(node.parentNode);
}

const onClick = e => {
  const link = getLink(e.target)
  if (!link) {
    return;
  }

  e.preventDefault();

  chrome.runtime.sendMessage({
    action: "CREATE_INCOGNITO_WINDOW",
    url: link.href
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", onClick);
})

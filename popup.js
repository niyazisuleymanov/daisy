const addToList = (url) => {
  let ul = document.getElementById("domain-names");
  let li = document.createElement("li");
  li.setAttribute("id", url)
  li.innerHTML = `${url}<button id="remove">remove</button>`;
  ul.appendChild(li);
}

const initializeList = () => {
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    for (let i = 0; i < rules.length; i++) {
      addToList(rules[i].condition.urlFilter);
    }
  });
}

document.getElementById("domain-names").onclick = (e) => {
  const target = e.target;
  if (target.tagName === "BUTTON") {
    let li = target.closest("li");
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
      let urls = [];
      for (let i = 0; i < rules.length; i++) {
        urls.push(rules[i].condition.urlFilter);
      }  
      const index = urls.indexOf(li.id);
      if (index !== -1) {
        chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: [rules[index].id]
        });
      }
      li.remove();
    });
  }
  return false;
}
  
document.getElementById("add").onclick = () => {
  const domain = document.getElementById("domain").value;
  if (domain == "") {
    alert("domain name cannot be empty");
  } else if (domain.includes("google.com")) {
    alert(`cannot incognito ${domain}`);
  } else {
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
      let urls = [];
      for (let i = 0; i < rules.length; i++) {
        urls.push(rules[i].condition.urlFilter);
      }
      if (urls.indexOf(domain) !== -1) {
        alert(`domain name ${domain} is already listed`);
      } else {
        addToList(domain);
        urls.push(domain);
        chrome.declarativeNetRequest.updateDynamicRules({
          addRules: [
            {
              id: urls.length, 
              action: { 
                type: "redirect",
                redirect: {
                  url: "https://google.com/gen_204"
                } 
              },
              condition: {
                urlFilter: domain,
                resourceTypes: [
                  "main_frame"
                ]
              }
            }
          ],
          removeRuleIds: [urls.length]
        });
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initializeList());

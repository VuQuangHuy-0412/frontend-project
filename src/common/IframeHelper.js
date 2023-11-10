const urlAllow = [
  'https://ghtk.me/',
  'https://ewallet-web-admin-dev.ghtklab.com',
  'https://ewallet-web-admin.ghtk.vn/',
]

export function receiveMessage(evt) {
  if (!urlAllow.includes(evt.origin)) return false
  let data = evt.data
  if (data) app.$store.dispatch('getEvent', data)
}

export function startListen() {
  if (!window['postMessage']) console.log('Không hỗ trợ function postMessage')
  else {
    if (window.addEventListener) {
      // For standards-compliant web browsers (ie9+)
      window.addEventListener('message', receiveMessage, false)
    } else {
      // alert("not standards-compliant (ie8)");
      window.attachEvent('onmessage', receiveMessage)
    }
  }
}

export function sendMessage(data, targer, targetOrigin = '*') {
  if (!targer) targer = window.opener || window.parent
  if (!targer) return
  targer.postMessage(data, targetOrigin)
}

export function getGchatTokenFromIframe() {
  let iframe = parent.document.getElementById('ewalletManagement')
  
  if (!iframe) return null

  return (
    iframe.src && iframe.src.split('?')
    && iframe.src.split('?')[1] && iframe.src.split('?')[1].split('=')
    && iframe.src.split('?')[1].split('=')[1])
    ? iframe.src.split('?')[1].split('=')[1]
    : null
}
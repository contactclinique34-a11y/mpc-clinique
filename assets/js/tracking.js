window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(function (link) {
    link.addEventListener('click', function () {
      gtag('event', 'conversion', {
        send_to: 'AW-18086360544',
        event_category: 'lead',
        event_label: 'whatsapp_click',
        value: 1
      });
    });
  });
});

(function initTawkTo() {
  // Exposés sur window pour que l'embed Tawk.to ET toute config ultérieure
  // (Tawk_API.visitor, Tawk_API.onLoad…) partagent bien le même objet global.
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();

  var s1 = document.createElement("script"),
    s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = "https://embed.tawk.to/68540aaaa39e6f190afde496/1iu44jb22";
  s1.charset = "UTF-8";
  // Valeur CORS valide ("*" n'est pas autorisé pour l'attribut crossorigin).
  s1.setAttribute("crossorigin", "anonymous");
  s0.parentNode.insertBefore(s1, s0);
})();

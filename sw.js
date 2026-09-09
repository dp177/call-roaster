/* Call Roster — service worker
   Keeps the app loading instantly (and offline), and shows a daily
   reminder on phones that support periodic background sync. */
var SHELL = "roster-shell-v2";
var DATA = "roster-data";

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(SHELL).then(function (c) {
      return c.addAll(["./", "./index.html", "./manifest.json", "./icon.png"]).catch(function () {});
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (k) {
          if (k.indexOf("roster-shell-") === 0 && k !== SHELL) return caches.delete(k);
        }));
      })
    ])
  );
});

// Network-first for the page itself, cache fallback for offline.
self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  if (e.request.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    e.respondWith(
      fetch(e.request).then(function (r) {
        var copy = r.clone();
        caches.open(SHELL).then(function (c) { c.put(e.request, copy); });
        return r;
      }).catch(function () {
        return caches.match(e.request).then(function (r) {
          return r || caches.match("./index.html");
        });
      })
    );
  }
});

function todayStr() {
  var d = new Date();
  function p(n) { return (n < 10 ? "0" : "") + n; }
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

function showDaily() {
  return caches.open(DATA).then(function (c) {
    return c.match("/summary");
  }).then(function (r) {
    if (!r) return null;
    return r.json();
  }).then(function (s) {
    var body = "Open Call Roster to check today's patients.";
    if (s) {
      var t = s[todayStr()];
      if (t && t.count) {
        body = t.count + " procedure" + (t.count > 1 ? "s" : "") + " today" +
          (t.toCall ? " — " + t.toCall + " still to call" : "") +
          (t.names ? ": " + t.names : "");
      } else if (t) {
        body = "No procedures scheduled today.";
      }
    }
    return self.registration.showNotification("📞 Call Roster — today", {
      body: body,
      tag: "daily-" + todayStr(),
      icon: "./icon.png",
      badge: "./icon.png"
    });
  }).catch(function () {});
}

self.addEventListener("periodicsync", function (e) {
  if (e.tag === "daily-roster") e.waitUntil(showDaily());
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ("focus" in list[i]) return list[i].focus();
      }
      return self.clients.openWindow("./");
    })
  );
});

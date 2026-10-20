/* Steira Air — site interactions
   Vanilla JS, no dependencies, no external APIs. */
(function () {
  'use strict';

  var ENDPOINT = 'https://vision.leadrai.com/api/forms/56e46c99a0079953baa519490a1dfada';

  /* ---------------------------------------------------------------
     Mobile navigation
  --------------------------------------------------------------- */
  function initNav() {
    var burger = document.querySelector('.burger');
    var nav = document.getElementById('primary-nav');
    if (!burger || !nav) return;

    function close() {
      burger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }

    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });

    // Submenu toggles (mobile accordion / desktop keyboard support)
    Array.prototype.forEach.call(nav.querySelectorAll('.menu-toggle'), function (btn) {
      btn.addEventListener('click', function (e) {
        var parent = btn.closest('.has-sub');
        if (!parent) return;
        if (window.matchMedia('(max-width: 960px)').matches) {
          e.preventDefault();
          var isOpen = parent.classList.toggle('is-open');
          btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
      });
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && window.matchMedia('(max-width: 960px)').matches) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', function () {
      if (!window.matchMedia('(max-width: 960px)').matches) close();
    });
  }

  /* ---------------------------------------------------------------
     Sticky header shadow
  --------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var tick = false;
    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      tick = false;
    }
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------
     Scroll reveal
  --------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(items, function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     FAQ filtering
  --------------------------------------------------------------- */
  function initFaqFilter() {
    var bar = document.querySelector('.faq-cats');
    if (!bar) return;
    var items = document.querySelectorAll('[data-faq-cat]');
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      var filter = btn.getAttribute('data-filter');
      Array.prototype.forEach.call(bar.querySelectorAll('button'), function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      Array.prototype.forEach.call(items, function (item) {
        var match = filter === 'all' || item.getAttribute('data-faq-cat') === filter;
        item.hidden = !match;
        if (!match) item.removeAttribute('open');
      });
    });
  }

  /* ---------------------------------------------------------------
     Forms: stamp _page, honeypot guard, fetch submit + confirmation
  --------------------------------------------------------------- */
  function showAlert(form, message, isError) {
    var box = form.querySelector('.form-alert');
    if (!box) return;
    var text = box.querySelector('.form-alert-text');
    if (text) text.textContent = message;
    box.classList.toggle('is-error', !!isError);
    box.hidden = false;
    box.setAttribute('role', 'status');
    try { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (err) { /* noop */ }
  }

  function initForms() {
    var forms = document.querySelectorAll('form[data-leadr]');
    if (!forms.length) return;

    var submitted = /[?&]submitted=1(&|$)/.test(window.location.search);

    Array.prototype.forEach.call(forms, function (form) {
      // _page must reflect the current URL on load so visitors come back here.
      var pageField = form.querySelector('input[name="_page"]');
      if (pageField) pageField.value = window.location.href;

      if (submitted) {
        showAlert(form, 'Thanks, your message was sent. A Steira Air specialist will be in touch shortly.', false);
      }

      form.addEventListener('submit', function (e) {
        if (!window.fetch || !window.FormData) return; // plain HTML POST fallback

        e.preventDefault();

        var btn = form.querySelector('button[type="submit"]');
        var original = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

        var data = new FormData(form);
        if (pageField) data.set('_page', window.location.href);

        var payload = {};
        data.forEach(function (value, key) {
          if (payload[key] !== undefined) {
            payload[key] = [].concat(payload[key], value);
          } else {
            payload[key] = value;
          }
        });

        fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            return res.json().catch(function () { return { ok: res.ok }; });
          })
          .then(function (json) {
            if (json && json.ok) {
              showAlert(form, 'Thanks, your message was sent. A Steira Air specialist will be in touch shortly.', false);
              form.reset();
              if (pageField) pageField.value = window.location.href;
            } else {
              throw new Error('Submission rejected');
            }
          })
          .catch(function () {
            showAlert(form, 'Sorry — we could not send that right now. Please call +1 470-539-8969 and we will help straight away.', true);
          })
          .then(function () {
            if (btn) { btn.disabled = false; btn.textContent = original; }
          });
      });
    });
  }

  /* ---------------------------------------------------------------
     Footer year
  --------------------------------------------------------------- */
  function initYear() {
    var el = document.querySelectorAll('[data-year]');
    if (!el.length) return;
    var y = new Date().getFullYear();
    Array.prototype.forEach.call(el, function (node) { node.textContent = y; });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initNav();
    initHeader();
    initReveal();
    initFaqFilter();
    initForms();
    initYear();
  });
})();

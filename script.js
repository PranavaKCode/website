/* script.js — reveal on scroll, mobile nav toggle, footer-only petals animation (retina-aware),
   image fade-ins, and contact form handling (Formspree + mailto fallback) */

document.addEventListener('DOMContentLoaded', () => {

  /*********** Reveal on scroll ***********/
  const reveals = document.querySelectorAll('.reveal, article, header, section');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('is-visible');
          obs.unobserve(ent.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(r => io.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('is-visible'));
  }

  /*********** Mobile nav toggle ***********/
  const nav = document.querySelector('nav');
  if (nav) {
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.prepend(toggle);
    toggle.addEventListener('click', () => nav.classList.toggle('show'));
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && nav.classList.contains('show')) nav.classList.remove('show');
    });
  }

  /*********** Image fade-in for about/publication images ***********/
  const imgs = document.querySelectorAll('.about-image img, .publication-image img');
  const imgObs = ('IntersectionObserver' in window) ? new IntersectionObserver((entries, ob) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.transition = 'transform 420ms cubic-bezier(.2,.9,.25,1), opacity 420ms ease';
        en.target.style.transform = 'translateY(0) scale(1)';
        en.target.style.opacity = '1';
        ob.unobserve(en.target);
      }
    });
  }, { threshold: 0.06 }) : null;

  imgs.forEach(img => {
    img.style.opacity = '0';
    img.style.transform = 'translateY(12px) scale(0.995)';
    if (imgObs) imgObs.observe(img);
    else {
      img.style.opacity = '1';
      img.style.transform = 'translateY(0) scale(1)';
    }
  });

  /*********** FOOTER-ONLY PETALS ANIMATION (retina-aware, robust) ***********/
  const footer = document.querySelector('.site-footer');
  if (footer) {
    let fcanvas = footer.querySelector('.footer-canvas');
    if (!fcanvas) {
      fcanvas = document.createElement('canvas');
      fcanvas.className = 'footer-canvas';
      footer.insertBefore(fcanvas, footer.firstChild);
    }

    Object.assign(fcanvas.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
    });

    Array.from(footer.children).forEach(ch => {
      if (ch === fcanvas) return;
      if (!ch.style.position) ch.style.position = 'relative';
      ch.style.zIndex = 2;
    });

    const fctx = fcanvas.getContext('2d');

    function resizeCanvas() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = footer.getBoundingClientRect();
      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);
      fcanvas.width = Math.round(cssW * dpr);
      fcanvas.height = Math.round(cssH * dpr);
      fcanvas.style.width = cssW + 'px';
      fcanvas.style.height = cssH + 'px';
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let FW = 100, FH = 40;
    class FooterPetal {
      constructor(initial = true) { this.reset(initial); }
      reset(initial = false) {
        const rect = footer.getBoundingClientRect();
        FW = Math.max(1, rect.width); FH = Math.max(1, rect.height);
        this.x = Math.random() * FW;
        this.y = initial ? Math.random() * FH : -10 - Math.random() * 60;
        this.size = 3 + Math.random() * 6;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = 0.4 + Math.random() * 0.9;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.04;
        this.h = 340 + Math.random() * 12;
        this.s = 62 + Math.random() * 8;
        this.l = 76 - Math.random() * 8;
        this.alpha = 0.45 + Math.random() * 0.35;
        this.wobble = 0.08 + Math.random() * 0.18;
      }
      draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 2, this.size / 2, 0, this.size);
        ctx.bezierCurveTo(-this.size / 2, this.size / 2, -this.size / 2, -this.size / 2, 0, -this.size);
        ctx.fillStyle = `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.alpha})`;
        ctx.fill();
        ctx.restore();
      }
      update(mouseVelX = 0, mouseVelY = 0) {
        this.x += this.speedX + mouseVelX * (Math.random() * 3);
        this.y += this.speedY + mouseVelY * (Math.random() * 2);
        this.angle += this.spin;
        this.x += Math.sin(this.y * this.wobble + this.size) * 0.4;
        if (this.y > FH + 20 || this.x < -40 || this.x > FW + 40) this.reset(false);
      }
    }

    let fpetals = [];
    function rebuildPetals() {
      const rect = footer.getBoundingClientRect();
      FW = Math.max(1, rect.width);
      FH = Math.max(1, rect.height);
      const count = Math.max(10, Math.floor((FW * FH) / 12000));
      fpetals = new Array(count).fill().map(() => new FooterPetal(true));
    }

    const mouse = { x: 0, y: 0, lastX: 0, lastY: 0 };
    window.addEventListener('mousemove', (e) => {
      const rect = footer.getBoundingClientRect();
      mouse.x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      mouse.y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    });

    function onResize() {
      resizeCanvas();
      rebuildPetals();
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => onResize());
    }
    setTimeout(onResize, 600);

    resizeCanvas();
    rebuildPetals();

    let rafId = null;
    let animating = false;
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) startFooterAnim();
        else stopFooterAnim();
      });
    }, { threshold: 0.02 });
    footerObserver.observe(footer);

    function startFooterAnim() {
      if (animating) return;
      animating = true;
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
      loop();
    }
    function stopFooterAnim() {
      animating = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      fctx.clearRect(0, 0, fcanvas.width, fcanvas.height);
    }
    function loop() {
      const vx = (mouse.x - mouse.lastX) * 0.02;
      const vy = (mouse.y - mouse.lastY) * 0.02;
      mouse.lastX += (mouse.x - mouse.lastX) * 0.12;
      mouse.lastY += (mouse.y - mouse.lastY) * 0.12;

      const rect = footer.getBoundingClientRect();
      fctx.clearRect(0, 0, rect.width, rect.height);

      for (let p of fpetals) {
        p.update(vx, vy);
        p.draw(fctx);
      }
      rafId = requestAnimationFrame(loop);
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq && mq.matches) stopFooterAnim();
  } // end footer handling

  /*********** CONTACT FORM HANDLING ***********/
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const statusEl = document.getElementById('formStatus');
    const submitBtn = document.getElementById('contactSubmit');
    const endpoint = contactForm.dataset.endpoint && !contactForm.dataset.endpoint.includes('yourFormID')
      ? contactForm.dataset.endpoint
      : null;

    function showStatus(msg, isError = false) {
      if (statusEl) {
        statusEl.textContent = msg;
        statusEl.style.color = isError ? '#b02a2a' : '#3a6b4a';
      } else {
        alert(msg);
      }
      if (!isError) contactForm.reset();
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = contactForm.firstName.value.trim();
      const lastName = contactForm.lastName.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      const hp = contactForm._hp ? contactForm._hp.value : '';
      if (hp) { return showStatus('Thanks — message received.', true); }
      if (!firstName || !lastName || !email || !message) {
        return showStatus('Please complete all fields before sending.', true);
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return showStatus('Please enter a valid email address.', true);
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        if (endpoint) {
          const payload = {
            firstName, lastName, email, message, _subject: `Website message from ${firstName} ${lastName}`
          };
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            showStatus('Thanks — your message was sent!', false);
          } else {
            const data = await res.json().catch(()=>({}));
            const errMsg = data && data.error ? data.error : 'Error sending message. Try using the email link below.';
            showStatus(errMsg, true);
          }
        } else {
          const subject = encodeURIComponent(`Website message from ${firstName} ${lastName}`);
          const body = encodeURIComponent(`Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`);
          window.location.href = `mailto:vanessamatvei@gmail.com?subject=${subject}&body=${body}`;
          showStatus('Your email client should open. If not, use the email link below.', false);
        }
      } catch (err) {
        console.error(err);
        showStatus('Network error — please try again or email me directly.', true);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      }
    });
  }

  /*********** FUN TITLE CHANGE ON TAB SWITCH ***********/
  let originalTitle = document.title;
  window.addEventListener("blur", () => {
    document.title = "Wait, come back 😔";
  });
  window.addEventListener("focus", () => {
    document.title = originalTitle;
  });

}); // DOMContentLoaded

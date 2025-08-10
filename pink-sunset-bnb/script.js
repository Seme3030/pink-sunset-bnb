/* script.js - slideshow + simple form handlers + modal confirmation */

document.addEventListener('DOMContentLoaded', function () {
  // update footer years
  const y = new Date().getFullYear();
  document.getElementById('year')?.textContent = y;
  document.getElementById('year-2')?.textContent = y;
  document.getElementById('year-3')?.textContent = y;
  document.getElementById('year-4')?.textContent = y;

  /* === Slideshow === */
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsContainer = document.getElementById('dots');
  let current = 0;
  let slideInterval;

  function buildDots() {
    if (!dotsContainer) return;
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.addEventListener('click', () => goToSlide(i));
      if (i === 0) btn.classList.add('active');
      dotsContainer.appendChild(btn);
    });
  }
  function setActive(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach((d, i) => d.classList.toggle('active', i === index));
    }
    current = index;
  }
  function nextSlide() { setActive((current + 1) % slides.length); }
  function prevSlide() { setActive((current - 1 + slides.length) % slides.length); }
  function goToSlide(i) { setActive(i); resetInterval(); }
  function startInterval() { slideInterval = setInterval(nextSlide, 4500); }
  function resetInterval() { clearInterval(slideInterval); startInterval(); }

  if (slides.length > 0) {
    buildDots();
    startInterval();
    document.querySelectorAll('.slide-btn.next').forEach(b => b.addEventListener('click', nextSlide));
    document.querySelectorAll('.slide-btn.prev').forEach(b => b.addEventListener('click', prevSlide));
  }

  /* === Modal helper === */
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  function showModal(html) {
    if (!modal || !modalBody) return;
    modalBody.innerHTML = html;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }
  modalClose?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  /* === Contact form === */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = this.querySelector('#cname').value.trim();
      const email = this.querySelector('#cemail').value.trim();
      const message = this.querySelector('#cmessage').value.trim();
      showModal(`<h3>Thanks, ${escapeHtml(name)}!</h3>
                 <p>We received your message and will reply to <strong>${escapeHtml(email)}</strong> shortly.</p>
                 <p><em>Your message:</em></p><blockquote>${escapeHtml(message)}</blockquote>`);
      contactForm.reset();
    });
  }

  /* === Booking form === */
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    // If site was opened with a type (from index links), preselect it
    const params = new URLSearchParams(window.location.search);
    const preType = params.get('type');
    if (preType) {
      const sel = bookingForm.querySelector('#roomType');
      if (sel) sel.value = preType;
    }

  bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const full = this.querySelector('#fullname').value.trim();
      const email = this.querySelector('#email').value.trim();
      const checkin = this.querySelector('#checkin').value;
      const checkout = this.querySelector('#checkout').value;
      const guests = this.querySelector('#guests').value;
      const type = this.querySelector('#roomType').value;
      const notes = this.querySelector('#notes').value.trim();

      // Basic validation: dates make sense
      if (!full || !email || !checkin || !checkout || !type) {
        showModal('<h3>Oops — missing info</h3><p>Please complete required fields before submitting.</p>');
        return;
      }
      if (new Date(checkin) >= new Date(checkout)) {
        showModal('<h3>Date problem</h3><p>Check-out must be after check-in. Please correct the dates.</p>');
        return;
      }

      const summary = `
        <h3>Booking request received 🎉</h3>
        <p>Thanks <strong>${escapeHtml(full)}</strong> — here’s your request summary:</p>
        <ul>
          <li><strong>Room type:</strong> ${escapeHtml(type)}</li>
          <li><strong>Check-in:</strong> ${escapeHtml(checkin)}</li>
          <li><strong>Check-out:</strong> ${escapeHtml(checkout)}</li>
          <li><strong>Guests:</strong> ${escapeHtml(guests)}</li>
          <li><strong>Email:</strong> ${escapeHtml(email)}</li>
        </ul>
        ${notes ? <p><strong>Special requests:</strong> ${escapeHtml(notes)}</p> : ''}
        <p class="fineprint">This is a demo: no reservation has been created. In a production site you'd now call your server API to save the booking.</p>
      `;
      showModal(summary);
      bookingForm.reset();
    });
  }

  /* tiny utility */
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
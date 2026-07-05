const progressBar = document.querySelector('.scroll-progress span');
const cursorGlow = document.querySelector('.cursor-glow');
const revealItems = document.querySelectorAll('.reveal');
const slider = document.querySelector('[data-slider]');
const modal = document.querySelector('[data-modal]');
const modalFrame = document.querySelector('[data-modal-frame]');
const modalCloseTargets = document.querySelectorAll('[data-modal-close]');
const certificateLinks = document.querySelectorAll('[data-pdf]');

const updateProgress = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
  progressBar.style.transform = `scaleX(${progress})`;
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

window.addEventListener('pointermove', (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

if (slider) {
  const stageImage = slider.querySelector('[data-slider-image]');
  const stageTag = slider.querySelector('[data-slider-tag]');
  const stageCaption = slider.querySelector('[data-slider-caption]');
  const prevButton = slider.querySelector('[data-slider-prev]');
  const nextButton = slider.querySelector('[data-slider-next]');
  const thumbButtons = Array.from(slider.querySelectorAll('[data-slide]'));
  let activeIndex = 0;

  const setActiveSlide = (index) => {
    activeIndex = (index + thumbButtons.length) % thumbButtons.length;
    const activeThumb = thumbButtons[activeIndex];

    stageImage.src = activeThumb.dataset.src;
    stageImage.alt = activeThumb.dataset.alt;
    stageTag.textContent = activeThumb.dataset.title;
    stageCaption.textContent = activeThumb.dataset.caption;

    thumbButtons.forEach((button) => button.classList.remove('is-active'));
    activeThumb.classList.add('is-active');
  };

  prevButton.addEventListener('click', () => setActiveSlide(activeIndex - 1));
  nextButton.addEventListener('click', () => setActiveSlide(activeIndex + 1));
  thumbButtons.forEach((button, index) => button.addEventListener('click', () => setActiveSlide(index)));
  setActiveSlide(0);
}

const closeModal = () => {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  modalFrame.removeAttribute('src');
};

certificateLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    modalFrame.src = `${link.dataset.pdf}#view=FitH`;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

modalCloseTargets.forEach((target) => target.addEventListener('click', closeModal));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) {
    closeModal();
  }
});

/* =========================================================
   EASYWORK ENTERPRISE - PROCUREMENT UI BEHAVIOUR
   UI ONLY. Watches the existing form status; does not submit API requests.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form[data-form="procurement"]');
  const modal = document.getElementById('procurementSuccessModal');
  const referenceNode = document.getElementById('procurementSuccessReference');
  const closeButton = document.getElementById('procurementSuccessClose');
  const statusNode = form ? form.querySelector('.form-status') : null;

  if (!form || !modal || !statusNode) return;

  let lastStatus = '';

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('procurement-modal-open');
  };

  const openModal = (message) => {
    const match = message.match(/Reference:\s*(.+)$/i);
    referenceNode.textContent = match ? match[1].trim() : 'Submitted';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('procurement-modal-open');

    window.setTimeout(() => closeButton.focus(), 120);
  };

  closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  const observer = new MutationObserver(() => {
    const message = statusNode.textContent.trim();
    const isSuccess = statusNode.classList.contains('success');

    if (isSuccess && message && message !== lastStatus) {
      lastStatus = message;
      openModal(message);
    } else if (!message) {
      lastStatus = '';
    }
  });

  observer.observe(statusNode, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class']
  });
});

/* =========================================================
   EASYWORK ENTERPRISE
   FORMS + API INTEGRATION
   Email Submission Version
   ========================================================= */

/*
 * Use the live Netlify origin when the site is deployed, and keep the
 * local Express server as the development fallback.
 */
const API_BASE_URL =
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000'
        : window.location.origin;


/* =========================================================
   WHATSAPP
   ========================================================= */

const WHATSAPP_NUMBER = '27727212627';


function buildWhatsAppUrl(message) {
    const safeMessage = encodeURIComponent(message);

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${safeMessage}`;
}


/* =========================================================
   WHATSAPP LINKS
   ========================================================= */

function attachWhatsAppLinks() {

    document.querySelectorAll('.whatsapp-link').forEach((link) => {

        const message =
            link.dataset.message ||
            'Hello Easywork Enterprise, I would like to enquire about your services.';

        link.href = buildWhatsAppUrl(message);

        link.target = '_blank';

        link.rel = 'noopener noreferrer';

    });

}


/* =========================================================
   STATUS MESSAGE
   ========================================================= */

function showFormStatus(statusNode, message, type = 'info') {

    if (!statusNode) return;

    statusNode.textContent = message;

    statusNode.className = `form-status ${type}`;

}


/* =========================================================
   PROCUREMENT FORM
   ========================================================= */

function submitProcurementForm(form) {

    const statusNode = form.querySelector('.form-status');

    form.addEventListener('submit', async (event) => {

        /*
         * VERY IMPORTANT
         *
         * Stop the browser from submitting the form normally.
         * This prevents:
         *
         * procurement.html?customer=...
         */
        event.preventDefault();

        event.stopPropagation();


        /* -------------------------------------------------
           Disable button while submitting
           ------------------------------------------------- */

        const submitButton =
            form.querySelector('.btn-submit');

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.dataset.originalText =
                submitButton.textContent;

            submitButton.textContent =
                'Submitting Request...';

        }


        /* -------------------------------------------------
           Clear previous status
           ------------------------------------------------- */

        showFormStatus(
            statusNode,
            'Submitting your request...',
            'loading'
        );


        try {

            /* ---------------------------------------------
               Read form data
               --------------------------------------------- */

            const formData = new FormData(form);

            const values =
                Object.fromEntries(formData.entries());


            /* ---------------------------------------------
               Build API request
               --------------------------------------------- */

            const response = await fetch(
                `${API_BASE_URL}/api/procurement`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({

                        customer:
                            values.customer || '',

                        contactPerson:
                            values.contactPerson || '',

                        phone:
                            values.phone || '',

                        email:
                            values.email || '',

                        material:
                            values.material || '',

                        quantity:
                            values.quantity || '',

                        location:
                            values.location || '',

                        date:
                            values.date || '',

                        additional:
                            values.additional || ''

                    })
                }
            );


            /* ---------------------------------------------
               Read server response
               --------------------------------------------- */

            const result = await response.json();


            /* ---------------------------------------------
               API ERROR
               --------------------------------------------- */

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    'The request could not be submitted.'
                );

            }


            /* ---------------------------------------------
               SUCCESS
               --------------------------------------------- */

            const reference =
                result.reference ||
                result.requestReference ||
                'Submitted';


            showFormStatus(
                statusNode,
                `✓ Request successfully submitted. Reference: ${reference}`,
                'success'
            );


            /* ---------------------------------------------
               Reset form AFTER successful submission
               --------------------------------------------- */

            form.reset();


            /* ---------------------------------------------
               Optional success styling
               --------------------------------------------- */

            form.classList.add('submission-success');


            /* ---------------------------------------------
               Scroll to success message
               --------------------------------------------- */

            if (statusNode) {

                statusNode.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

            }


        } catch (error) {

            console.error(
                'PROCUREMENT SUBMISSION ERROR:',
                error
            );


            /* ---------------------------------------------
               ERROR MESSAGE
               --------------------------------------------- */

            showFormStatus(
                statusNode,
                '✕ We could not submit your request. Please try again or contact Easywork Enterprise directly.',
                'error'
            );

        } finally {

            /* ---------------------------------------------
               Re-enable submit button
               --------------------------------------------- */

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    submitButton.dataset.originalText ||
                    'Submit Procurement Request';

            }

        }

    });

}


/* =========================================================
   CONTACT FORM
   ========================================================= */

function submitContactForm(form) {

    const statusNode =
        form.querySelector('.form-status');


    form.addEventListener('submit', async (event) => {

        /*
         * Prevent normal browser submission.
         */
        event.preventDefault();

        event.stopPropagation();


        const submitButton =
            form.querySelector('.btn-submit');


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.dataset.originalText =
                submitButton.textContent;

            submitButton.textContent =
                'Sending...';

        }


        showFormStatus(
            statusNode,
            'Sending your enquiry...',
            'loading'
        );


        try {

            const formData =
                new FormData(form);

            const values =
                Object.fromEntries(formData.entries());


            const response = await fetch(
                `${API_BASE_URL}/api/contact`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({

                        name:
                            values.name || '',

                        company:
                            values.company || '',

                        phone:
                            values.phone || '',

                        email:
                            values.email || '',

                        subject:
                            values.subject || '',

                        message:
                            values.message || ''

                    })
                }
            );


            const result =
                await response.json();


            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    'The enquiry could not be submitted.'
                );

            }


            const reference =
                result.reference ||
                result.requestReference ||
                'Submitted';


            showFormStatus(
                statusNode,
                `✓ Your enquiry has been successfully sent. Reference: ${reference}`,
                'success'
            );


            form.reset();


            form.classList.add(
                'submission-success'
            );


        } catch (error) {

            console.error(
                'CONTACT SUBMISSION ERROR:',
                error
            );


            showFormStatus(
                statusNode,
                '✕ We could not send your enquiry. Please try again or contact Easywork Enterprise directly.',
                'error'
            );

        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    submitButton.dataset.originalText ||
                    'Submit';

            }

        }

    });

}


/* =========================================================
   FORM INITIALIZATION
   ========================================================= */

function initializeForms() {

    const forms =
        document.querySelectorAll(
            'form[data-form]'
        );


    forms.forEach((form) => {

        const formType =
            form.dataset.form;


        if (formType === 'procurement') {

            submitProcurementForm(form);

        }


        if (formType === 'contact') {

            submitContactForm(form);

        }

    });

}


/* =========================================================
   PRODUCT NAVIGATION
   ========================================================= */

function initializeProductNavigation() {

    const detailTrigger =
        document.querySelectorAll(
            '.detail-trigger'
        );


    const quoteTrigger =
        document.querySelectorAll(
            '.quote-trigger'
        );


    const redirectToProcurement =
        (event) => {

            event.preventDefault();

            window.location.href =
                'procurement.html';

        };


    detailTrigger.forEach((button) => {

        button.addEventListener(
            'click',
            redirectToProcurement
        );

    });


    quoteTrigger.forEach((button) => {

        button.addEventListener(
            'click',
            redirectToProcurement
        );

    });

}


/* =========================================================
   PRODUCT SEARCH
   ========================================================= */

function initializeProductSearch() {

    const productCards =
        document.querySelectorAll(
            '.product-card'
        );


    const searchInput =
        document.getElementById(
            'productSearch'
        );


    const categoryButtons =
        document.querySelectorAll(
            '.category-btn'
        );


    /* ---------------------------------------------
       Product detail
       --------------------------------------------- */

    const updateDetailPanel =
        (card) => {

            if (!card) return;


            const name =
                card.dataset.name ||
                'Refuse Bags';


            const category =
                card.dataset.category ||
                'Refuse Bags';


            const price =
                card.dataset.price ||
                'Price on Request';


            const description =
                card.dataset.description ||
                'Product description';


            const status =
                card.dataset.status ||
                'Available';


            const image =
                card.querySelector('img')
                    ?.getAttribute('src') ||
                'assets/images/refuse-bags.svg';


            let specs = {};

            try {

                specs =
                    card.dataset.specs
                        ? JSON.parse(
                            card.dataset.specs
                        )
                        : {};

            } catch (error) {

                console.warn(
                    'Invalid product specifications:',
                    error
                );

            }


            const detailName =
                document.getElementById(
                    'detailName'
                );


            const detailImage =
                document.getElementById(
                    'detailImage'
                );


            const detailTitle =
                document.getElementById(
                    'detailTitle'
                );


            const detailPrice =
                document.getElementById(
                    'detailPrice'
                );


            const detailStatus =
                document.getElementById(
                    'detailStatus'
                );


            const detailSpecs =
                document.getElementById(
                    'detailSpecs'
                );


            const detailDescription =
                document.getElementById(
                    'detailDescription'
                );


            const detailWhatsApp =
                document.getElementById(
                    'detailWhatsApp'
                );


            if (detailName)
                detailName.textContent =
                    name;


            if (detailImage)
                detailImage.src =
                    image;


            if (detailTitle)
                detailTitle.textContent =
                    name;


            if (detailPrice)
                detailPrice.textContent =
                    price;


            if (detailStatus) {

                detailStatus.textContent =
                    status;

                detailStatus.className =
                    'status-badge ' +
                    (
                        status
                            .toLowerCase()
                            .includes('available')
                            ? 'success'
                            : 'info'
                    );

            }


            if (detailSpecs) {

                const rows =
                    Object.entries(specs)
                        .map(
                            ([key, value]) => `
                                <tr>
                                    <th scope="row">${key}</th>
                                    <td>${value}</td>
                                </tr>
                            `
                        )
                        .join('');


                detailSpecs.innerHTML =
                    rows;

            }


            if (detailDescription)
                detailDescription.textContent =
                    description;


            if (detailWhatsApp) {

                const message =
                    `Hello Easywork Enterprise,

I am interested in your ${name}.

Please provide availability and delivery information.

Thank you.`;

                detailWhatsApp.href =
                    buildWhatsAppUrl(
                        message
                    );

                detailWhatsApp.dataset.message =
                    message;

            }


            const breadcrumbs =
                document.querySelector(
                    '.detail-breadcrumbs'
                );


            if (breadcrumbs) {

                breadcrumbs.innerHTML =
                    `Home / Products / <span>${name}</span>`;

            }


            document
                .querySelector(
                    '.product-detail-panel'
                )
                ?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });

        };


    /* ---------------------------------------------
       Product cards
       --------------------------------------------- */

    productCards.forEach((card) => {

        card.addEventListener(
            'click',
            (event) => {

                if (
                    event.target.closest(
                        'a, button'
                    )
                ) return;


                updateDetailPanel(card);

            }
        );

    });


    /* ---------------------------------------------
       Search
       --------------------------------------------- */

    if (searchInput) {

        searchInput.addEventListener(
            'input',
            (event) => {

                const query =
                    event.target.value
                        .trim()
                        .toLowerCase();


                productCards.forEach(
                    (card) => {

                        const name =
                            (
                                card.dataset.name ||
                                ''
                            ).toLowerCase();


                        const category =
                            (
                                card.dataset.category ||
                                ''
                            ).toLowerCase();


                        const show =
                            !query ||
                            name.includes(query) ||
                            category.includes(query);


                        card.style.display =
                            show ? '' : 'none';

                    }
                );

            }
        );

    }


    /* ---------------------------------------------
       Category filters
       --------------------------------------------- */

    categoryButtons.forEach(
        (button) => {

            button.addEventListener(
                'click',
                () => {

                    const filter =
                        button.dataset.filter;


                    categoryButtons.forEach(
                        (btn) => {

                            btn.classList.toggle(
                                'active',
                                btn === button
                            );

                        }
                    );


                    productCards.forEach(
                        (card) => {

                            const matches =
                                filter === 'all' ||
                                card.dataset.category === filter;


                            card.style.display =
                                matches ? '' : 'none';

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        console.log(
            'Easywork Enterprise frontend initialized.'
        );


        attachWhatsAppLinks();

        initializeForms();

        initializeProductNavigation();

        initializeProductSearch();

    }
);
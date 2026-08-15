const contactForm =
    document.getElementById('contact-form');

contactForm.addEventListener(
'submit',
function(event){

    event.preventDefault();

    const btn =
        document.getElementById('button');

    btn.disabled =true

    btn.textContent =
        'Envoi en cours...';

    const serviceID =
        'service_0menwtj';

    const templateID =
        'template_x7h78nt';

    emailjs.sendForm(

        serviceID,
        templateID,
        contactForm

    )

    .then(() => {

        btn.disabled =false

        btn.textContent =
            'Envoyer';

        alert(
            'Message envoyé avec succès !'
        );

        contactForm.reset();

    })

    .catch((err) => {

        btn.disabled = false
        btn.textContent =
            'Envoyer';

        console.log(err);

        alert(
            'Erreur lors de l’envoi'
        );

    });

});
const form = document.querySelector('form');

    // Au submit,
    form.addEventListener("submit", (event) => {
        // on empêche le comportement par défaut :
        event.preventDefault();

		const email = document.getElementById("email").value;
		const mdp = document.getElementById("password").value;
		console.log(email, mdp);
	});

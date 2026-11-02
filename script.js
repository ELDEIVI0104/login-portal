document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('authForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    window.location.href = 'gracias.html';
                }
            } catch (error) {
                console.error('Error al enviar los datos:', error);
            }
        });
    }
});
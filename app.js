const API_BASE = window.location.origin;

const validators = {
    name: (v) => {
        if (!v.trim()) return 'Full name is required.';
        if (v.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
    },
    email: (v) => {
        if (!v.trim()) return 'Email address is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Please enter a valid email address.';
        return '';
    },
    message: (v) => {
        if (!v.trim()) return 'Message is required.';
        if (v.trim().length < 10) return 'Message must be at least 10 characters.';
        return '';
    }
};

function setFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    if (message) {
        input.classList.add('invalid');
        error.textContent = message;
    } else {
        input.classList.remove('invalid');
        error.textContent = '';
    }
}

function validateAll() {
    const fields = ['name', 'email', 'message'];
    let valid = true;
    fields.forEach(f => {
        const err = validators[f](document.getElementById(f).value);
        setFieldError(f, err);
        if (err) valid = false;
    });
    return valid;
}

['name', 'email', 'message'].forEach(f => {
    document.getElementById(f).addEventListener('blur', function () {
        setFieldError(f, validators[f](this.value));
    });
    document.getElementById(f).addEventListener('input', function () {
        if (this.classList.contains('invalid')) {
            setFieldError(f, validators[f](this.value));
        }
    });
});

document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateAll()) return;

    const btn = document.getElementById('submitBtn');
    const errorEl = document.getElementById('errorMessage');

    errorEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Sending...';

    const payload = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    try {
        const res = await fetch(`${API_BASE}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok && data.success) {
            document.getElementById('formState').style.display = 'none';
            document.getElementById('successState').style.display = 'block';
        } else {
            errorEl.textContent = data.error || 'Something went wrong. Please try again.';
            errorEl.style.display = 'block';
        }
    } catch (err) {
        console.error('Submit error:', err);
        errorEl.textContent = 'Network error. Please check your connection and try again.';
        errorEl.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Send Message';
    }
});

function resetForm() {
    document.getElementById('contactForm').reset();
    ['name', 'email', 'message'].forEach(f => setFieldError(f, ''));
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successState').style.display = 'none';
    document.getElementById('formState').style.display = 'block';
}

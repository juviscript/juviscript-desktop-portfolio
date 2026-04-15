<script setup lang="ts">
import { ref } from "vue";

const name = ref("");
const email = ref("");
const message = ref("");

const errors = ref({
	name: "",
	email: "",
	message: "",
});

const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

function validateForm() {
	errors.value = {
		name: "",
		email: "",
		message: "",
	};

	let isValid = true;

	if (!name.value.trim()) {
		errors.value.name = "Please enter your name.";
		isValid = false;
	}

	if (!email.value.trim()) {
		errors.value.email = "Please enter your email.";
		isValid = false;
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
		errors.value.email = "Please enter a valid email address.";
		isValid = false;
	}

	if (!message.value.trim()) {
		errors.value.message = "Please enter a message.";
		isValid = false;
	} else if (message.value.trim().length < 10) {
		errors.value.message = "Message should be at least 10 characters.";
		isValid = false;
	}

	return isValid;
}

async function sendContactEmail() {
	successMessage.value = "";
	errorMessage.value = "";

	if (!validateForm()) {
		return;
	}

	isSubmitting.value = true;

	try {
		const response = await fetch("/api/contact", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: name.value.trim(),
				email: email.value.trim(),
				message: message.value.trim(),
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to send message.");
		}

		successMessage.value = "Message sent successfully.";
		name.value = "";
		email.value = "";
		message.value = "";
	} catch {
		errorMessage.value = "Something went wrong. Please try again.";
	} finally {
		isSubmitting.value = false;
	}
}
</script>

<template>
	<div class="contact-window">
		<aside class="contact-sidebar">
			<h2 class="contact-title">Contact Me</h2>
			<p class="contact-copy">Have a project in mind, want to connect professionally, or just want to say hello? Send a note here and I'll get back to you.</p>

			<div class="contact-note-card">
				<h3 class="contact-note-title">Best For</h3>
				<ul class="contact-note-list">
					<li>Project inquiries</li>
					<li>Portfolio feedback</li>
					<li>Professional connections</li>
				</ul>
			</div>
		</aside>

		<section class="contact-form-panel">
			<form class="contact-form" @submit.prevent="sendContactEmail">
				<div class="field-grid">
					<div class="field-group">
						<label class="field-label" for="contact-name">Name</label>
						<div class="field-shell">
							<input id="contact-name" v-model="name" class="field-input" type="text" placeholder="Your name" required />
						</div>
						<p v-if="errors.name" class="field-error">{{ errors.name }}</p>
					</div>

					<div class="field-group">
						<label class="field-label" for="contact-email">Email</label>
						<div class="field-shell">
							<input id="contact-email" v-model="email" class="field-input" type="email" placeholder="you@example.com" required />
						</div>
						<p v-if="errors.email" class="field-error">{{ errors.email }}</p>
					</div>
				</div>

				<div class="field-group field-group--message">
					<label class="field-label" for="contact-message">Message</label>
					<div class="field-shell field-shell--textarea">
						<textarea id="contact-message" v-model="message" class="field-input field-input--textarea" placeholder="Tell me a bit about what you're reaching out about." required></textarea>
					</div>
					<p v-if="errors.message" class="field-error">{{ errors.message }}</p>
				</div>

				<div class="form-footer">
					<div class="status-messages" aria-live="polite">
						<p v-if="successMessage" class="status-message status-message--success">{{ successMessage }}</p>
						<p v-if="errorMessage" class="status-message status-message--error">{{ errorMessage }}</p>
					</div>

					<button class="submit-button" type="submit" :disabled="isSubmitting">
						{{ isSubmitting ? "Sending..." : "Send Message" }}
					</button>
				</div>
			</form>
		</section>
	</div>
</template>

<style scoped>
.contact-window {
	height: 100%;
	min-height: 0;
	display: grid;
	grid-template-columns: minmax(17rem, 24%) minmax(0, 1fr);
	gap: var(--space-4);
}

.contact-sidebar,
.contact-form-panel {
	min-height: 0;
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	border-radius: var(--radius-xl);
	box-shadow: var(--shadow-card);
}

.contact-sidebar {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
	padding: var(--space-5);
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.14)),
		linear-gradient(180deg, var(--color-surface-strong), var(--color-surface-muted));
}

.contact-kicker {
	margin: 0;
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.contact-title {
	margin: 0;
	font-family: var(--font-display);
	font-size: var(--text-2xl);
	font-weight: 700;
	line-height: var(--line-tight);
	color: var(--color-ink);
}

.contact-copy {
	margin: 0;
	color: var(--color-ink);
	line-height: var(--line-loose);
}

.contact-note-card {
	padding: var(--space-4);
	border-radius: var(--radius-lg);
	background: rgba(255, 249, 241, 0.84);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.1);
}

.contact-note-title {
	margin: 0 0 var(--space-3);
	font-family: var(--font-chrome);
	font-size: var(--text-sm);
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--color-ink);
}

.contact-note-list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
}

.contact-note-list li {
	position: relative;
	padding-left: 1rem;
	color: var(--color-ink);
	line-height: var(--line-normal);
}

.contact-note-list li::before {
	content: "";
	position: absolute;
	left: 0;
	top: 0.55em;
	width: 0.4rem;
	height: 0.4rem;
	border-radius: 50%;
	background: var(--color-accent-orange);
}

.contact-form-panel {
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.1)), var(--color-surface);
	padding: var(--space-5);
}

.contact-form {
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
}

.field-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: var(--space-4);
}

.field-group {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
}

.field-group--message {
	flex: 1;
	min-height: 0;
}

.field-label {
	font-family: var(--font-chrome);
	font-size: var(--text-xs);
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.field-shell {
	padding: 0.55rem 0.75rem;
	border-radius: var(--radius-pill);
	border: var(--border-thin) solid transparent;
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.15)),
		var(--color-surface-muted);
	transition:
		border-color 140ms ease,
		box-shadow 140ms ease,
		background-color 140ms ease;
}

.field-shell--textarea {
	flex: 1;
	min-height: 0;
	padding: 0.8rem 0.95rem;
	border-radius: var(--radius-lg);
}

.field-shell:focus-within {
	border-color: rgba(90, 61, 43, 0.18);
	box-shadow:
		inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.2),
		0 0 0 0.22rem rgba(233, 158, 112, 0.2);
}

.field-input {
	width: 100%;
	padding: 0;
	border: none;
	background: transparent;
	color: var(--color-ink);
	font-size: var(--text-sm);
	line-height: var(--line-normal);
	outline: none;
	box-shadow: none;
	appearance: none;
}

.field-input::placeholder {
	color: var(--color-ink-soft);
}

.field-input:focus {
	outline: none;
	box-shadow: none;
}

.field-input--textarea {
	flex: 1;
	min-height: 14rem;
	resize: none;
}

.field-error {
	margin: 0;
	font-size: var(--text-xs);
	font-weight: 500;
	color: var(--color-accent-red);
}

.form-footer {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: var(--space-4);
}

.status-messages {
	flex: 1;
	min-height: 1.5rem;
}

.status-message {
	margin: 0;
	font-size: var(--text-sm);
	font-weight: 500;
}

.status-message--success {
	color: #2e7d4f;
}

.status-message--error {
	color: var(--color-accent-red);
}

.submit-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 10rem;
	min-height: 3rem;
	padding: 0 var(--space-4);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.14);
	border-radius: var(--radius-pill);
	background: linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange));
	color: var(--color-white);
	font-family: var(--font-display);
	font-size: var(--text-sm);
	font-weight: 700;
	cursor: pointer;
	box-shadow: 0 0.75rem 1.5rem rgba(222, 107, 72, 0.2);
	transition:
		transform 140ms ease,
		box-shadow 140ms ease,
		opacity 140ms ease;
}

.submit-button:hover:not(:disabled) {
	transform: translateY(-0.0625rem);
	box-shadow: 0 1rem 1.75rem rgba(222, 107, 72, 0.26);
}

.submit-button:disabled {
	cursor: wait;
	opacity: 0.72;
}

@media (max-width: 56rem) {
	.contact-window {
		grid-template-columns: 1fr;
	}

	.field-grid {
		grid-template-columns: 1fr;
	}

	.form-footer {
		flex-direction: column;
		align-items: stretch;
	}

	.submit-button {
		width: 100%;
	}
}
</style>

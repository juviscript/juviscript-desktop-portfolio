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
	} catch (error) {
		errorMessage.value = "Something went wrong. Please try again.";
	} finally {
		isSubmitting.value = false;
	}
}
</script>

<template>
	<div class="contact-window-content">
		<div class="contact-window-header">
			<h2>Contact Me</h2>
			<p>Have any questions, want to chat about a project, or just want to say hi? You can find me on any of the socials below.</p>
		</div>
		<div class="contact-window-body">
			<form @submit.prevent="sendContactEmail">
				<input v-model="name" required />
				<p v-if="errors.name">{{ errors.name }}</p>

				<input v-model="email" type="email" required />
				<p v-if="errors.email">{{ errors.email }}</p>

				<textarea v-model="message" required></textarea>
				<p v-if="errors.message">{{ errors.message }}</p>

				<button type="submit" :disabled="isSubmitting">
					{{ isSubmitting ? "Sending..." : "Send" }}
				</button>

				<p v-if="successMessage">{{ successMessage }}</p>
				<p v-if="errorMessage">{{ errorMessage }}</p>
			</form>
		</div>
	</div>
</template>

<style scoped>
.contact-window-content {
	width: 100%;
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 20px;
	box-sizing: border-box;
}
</style>

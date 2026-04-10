type ContactRequest = {
	name?: string;
	email?: string;
	message?: string;
};

type Smtp2goResponse = {
	data?: {
		succeeded?: number;
		failed?: number;
		error?: string;
	};
};

function jsonResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
		},
	});
}

function isValidEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendEmail(args: {
	apiKey: string;
	sender: string;
	to: string[];
	subject: string;
	textBody: string;
	htmlBody: string;
}) {
	const response = await fetch("https://api.smtp2go.com/v3/email/send", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"X-Smtp2go-Api-Key": args.apiKey,
		},
		body: JSON.stringify({
			sender: args.sender,
			to: args.to,
			subject: args.subject,
			text_body: args.textBody,
			html_body: args.htmlBody,
		}),
	});

	const data = await response.json<Smtp2goResponse>();

	return {
		ok: response.ok && !!data?.data?.succeeded,
		data,
	};
}

export async function onRequestPost(context: {
	request: Request;
	env: {
		SMTP2GO_API_KEY?: string;
		CONTACT_TO_EMAIL?: string;
		CONTACT_FROM_EMAIL?: string;
	};
}) {
	const apiKey = context.env.SMTP2GO_API_KEY;
	const toEmail = context.env.CONTACT_TO_EMAIL;
	const fromEmail = context.env.CONTACT_FROM_EMAIL;

	if (!apiKey || !toEmail || !fromEmail) {
		return jsonResponse(
			{ error: "Server email configuration is incomplete." },
			500
		);
	}

	let body: ContactRequest;

	try {
		body = await context.request.json();
	} catch {
		return jsonResponse({ error: "Invalid JSON request body." }, 400);
	}

	const name = body.name?.trim() ?? "";
	const email = body.email?.trim() ?? "";
	const message = body.message?.trim() ?? "";

	if (!name) {
		return jsonResponse({ error: "Name is required." }, 400);
	}

	if (!email) {
		return jsonResponse({ error: "Email is required." }, 400);
	}

	if (!isValidEmail(email)) {
		return jsonResponse({ error: "A valid email address is required." }, 400);
	}

	if (!message) {
		return jsonResponse({ error: "Message is required." }, 400);
	}

	if (message.length < 10) {
		return jsonResponse(
			{ error: "Message must be at least 10 characters long." },
			400
		);
	}

	const ownerEmailResult = await sendEmail({
		apiKey,
		sender: fromEmail,
		to: [toEmail],
		subject: `New portfolio contact from ${name}`,
		textBody: [
			`Name: ${name}`,
			`Email: ${email}`,
			"",
			"Message:",
			message,
		].join("\n"),
		htmlBody: `
			<h2>New portfolio contact</h2>
			<p><strong>Name:</strong> ${name}</p>
			<p><strong>Email:</strong> ${email}</p>
			<p><strong>Message:</strong></p>
			<p>${message.replace(/\n/g, "<br>")}</p>
		`,
	});

	if (!ownerEmailResult.ok) {
		return jsonResponse(
			{
				error: "Failed to send email.",
				details: ownerEmailResult.data?.data?.error ?? "Unknown SMTP2GO error.",
			},
			500
		);
	}

	const confirmationResult = await sendEmail({
		apiKey,
		sender: fromEmail,
		to: [email],
		subject: "We received your message",
		textBody: [
			`Hi ${name},`,
			"",
			"Thanks for reaching out through juviscript.dev.",
			"I received your message and will get back to you as soon as I can.",
			"",
			"Here is a copy of what you sent:",
			message,
			"",
			"- Juvilane",
		].join("\n"),
		htmlBody: `
			<h2>Thanks for reaching out</h2>
			<p>Hi ${name},</p>
			<p>Thanks for reaching out through <strong>juviscript.dev</strong>.</p>
			<p>I received your message and will get back to you as soon as I can.</p>
			<p><strong>Your message:</strong></p>
			<p>${message.replace(/\n/g, "<br>")}</p>
			<p>- Juvilane</p>
		`,
	});

	if (!confirmationResult.ok) {
		return jsonResponse(
			{
				error: "Your message was sent, but the confirmation email could not be delivered.",
				details: confirmationResult.data?.data?.error ?? "Unknown SMTP2GO error.",
			},
			500
		);
	}

	return jsonResponse({ success: true, message: "Message sent successfully." });
}

const nodemailer = require("nodemailer");
const cron = require("node-cron");
const User = require("./models/user");


async function sendReminderEmails() {
	try {
		
		const users = await User.find({});
		users.forEach(async (user) => {
			user.reminders.forEach(async (reminder) => {
				const today = new Date();
				const reminderDate = new Date(reminder.date);
				if (reminderDate.toDateString() === today.toDateString()) {
					const transporter = nodemailer.createTransport({
						host: "live.smtp.mailtrap.io",
						port: 2525,
						auth: {
							user: process.env.SMTP_USER,
							pass: process.env.SMTP_PASS,
							type: "login",
						},
					});

					const mailOptions = {
						from: "udith@kiranks.me",
						to: user.email,
						subject: `Reminder: ${reminder.title}`,
						text: `Reminder: ${reminder.message}`,
					};

					await transporter.sendMail(mailOptions);
					console.log(`Reminder email sent to ${user.email}`);
				}
			});
		});

		
		await mongoose.disconnect();
	} catch (error) {
		console.error("Error sending reminder emails:", error);
	}
}

cron.schedule("55 23 * * *", () => { 
	console.log("Running reminder email job at 23:50...");
	sendReminderEmails();
});


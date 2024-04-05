import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

const configureEnvironment = function () {
	const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
	const paypalClientSecret = process.env.PAYPAL_APP_SECRET!;

	return process.env.NODE_ENV === "production"
		? new checkoutNodeJssdk.core.LiveEnvironment(paypalClientId, paypalClientSecret)
		: new checkoutNodeJssdk.core.SandboxEnvironment(paypalClientId, paypalClientSecret);
};

const client = function () {
	return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment());
};

export default client;

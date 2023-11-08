const payNow = async () => {
	const amount = localStorage.getItem("amt");
	fetch("/api/initiatePayment", {
		method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount })
	}).then((response) => response.json()).then((data_result) => {
		console.log(data_result);
		const api_response_status = data_result.status;
		if (api_response_status === true) window.location.href = data_result.data.payment_url;
		else throw new Error(data_result.error);
	}).catch((error) => {
		console.error("Error initiating payment:", error);
	});
}
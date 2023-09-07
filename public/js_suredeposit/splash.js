function getData() {
	try {
		fetch('/api/splash')
			.then(response => response.json())
			.then(data => {
				const uid = data.uid;
				const inv = data.inv;
				const bal = data.bal;
				const int = data.int;
				const name = data.name;
				localStorage.setItem("uid", uid);
				localStorage.setItem("inv", inv);
				localStorage.setItem("bal", bal);
				localStorage.setItem("int", int);
				localStorage.setItem("name", name);
				location.href = "/home";
			})
	} catch (error) {
		location.href = "/signup";
	}
}

setTimeout(getData, 750);
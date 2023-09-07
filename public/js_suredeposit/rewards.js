const rewardBox = document.getElementById("reward");
const withdrawBtn = document.getElementById("withdraw");
const code = document.getElementById("code");

const popup = document.getElementById("popup");
const heading = document.getElementById("popup-heading");
const text = document.getElementById("popup-text");

const btnBox = document.getElementById("btnBox");
const closeBtn = document.getElementById("close-button");

const yes = document.getElementById("yes");
const no = document.getElementById("no");

const copy = document.getElementById("copyCode");
const wh = document.getElementById("sendWh");

var rewards = 0;
const min = 250;


fetch('/getData/rewards')
    .then(response => response.json())
    .then(data => {
        const resu = data.resu;
        rewards = data.rewards;
        dep = data.dep;
        const name = data.name;
        const id = data.uid;
        rewardBox.innerHTML += rewards;
        refCode = name.slice(0, 2).toUpperCase() + id;
        code.innerHTML = refCode;
        content = "Hey, I've been using this app called SureDeposit to invest my savings and earn 15% interest on it. \n\nDownload the app now to invest & borrow @15% and don't forget to use my referral code to earn ₹100 bonus on signing up.\n\nCODE: " + refCode + " \n\nAPP: https://play.google.com/store/apps/details?id=com.Pageturners_tech.sure_deposit_AIA_store";
    })
    .catch(error => console.error(error));

withdrawBtn.addEventListener("click", () => {
    popup.classList.remove("hidden");
    if (min > rewards) {
        screen.classList.add("blur");
        popup.classList.remove("hidden");
        heading.innerHTML = "Low Balance in Rewards";
        text.innerHTML = "Minimum Balance for Claiming your rewards is &#8377; 250";
    }
    else {
        fetch('/getData/bank')
            .then(response => response.json())
            .then(data => {
                BNAME = data.BNAME;
                ACCNO = data.ACCNO;
                UPIID = data.UPIID;
                if (BNAME == null && ACCNO == null && UPIID == null) {
                    screen.classList.add("blur");
                    heading.innerHTML = "No Withdrawal Account";
                    text.innerHTML = "Add your Withdrawal account to receive your reward";
                }
                else {
                    fetch('/getData/referral')
                        .then(response => response.json())
                        .then(data => {
                            dep2 = data.dep;
                            console.log(dep);
                            console.log(dep2);
                            if ((dep == 0)) {
                                screen.classList.add("blur");
                                heading.innerHTML = "Deposit before Claiming";
                                text.innerHTML = "You have to make a deposit to Claim your rewards";
                            }
                            else if ((dep2 == 0)) {
                                screen.classList.add("blur");
                                heading.innerHTML = "Deposit before Claiming";
                                text.innerHTML = "Your friends have to make a deposit to Claim your rewards";
                            }
                            else {
                                screen.classList.add("blur");
                                btnBox.classList.remove("hidden");
                                heading.innerHTML = "Confirm Withdrawal";
                                text.innerHTML = "Are you sure you want to claim your rewards";
                            }
                        })
                        .catch(error => console.error(error));
                }
            })
            .catch(error => console.error(error));
    }

});

closeBtn.addEventListener("click", () => {
    screen.classList.remove("blur");
    popup.classList.add("hidden");
});

yes.addEventListener("click", () => {
    async function claimRewards() {
        let response = await fetch('/setData/rewards', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                amt: parseInt(rewards),
            })
        })
        let withdrawResponse = await response.json();
    }
    claimRewards();
    screen.classList.add("blur");
    btnBox.classList.add("hidden");
    heading.innerHTML = "Rewards Claimed";
    text.innerHTML = "you will receive your rewards in your withdrawal account within 48 hours";
    setTimeout(() => {
        screen.classList.remove("blur");
        popup.classList.add("hidden");
    }, 2000);
    setTimeout(() => {
        window.location.reload();
    }, 2000);
});

no.addEventListener("click", () => {
    screen.classList.remove("blur");
    popup.classList.add("hidden");
});

// copy.addEventListener("click", () => {
// 	navigator.clipboard.writeText(content).then(function () {
// 		screen.classList.add("blur");
// 		popup.classList.remove("hidden");
// 		heading.innerHTML = "Code copied to clipboard";
// 		text.innerHTML = "";
// 		setTimeout(() => {
// 			screen.classList.remove("blur");
// 			popup.classList.add("hidden");
// 		}, 1000);
// 	}, function (error) {
// 		console.error("Failed to copy to clipboard: ", error);
// 	});
// });

wh.addEventListener("click", () => {
    const mesg = `https://wa.me/?text=${encodeURIComponent(content)}`
    window.location = mesg;
});


const containers = document.querySelectorAll(".container");
const dots = document.querySelectorAll(".slider-dot");
const btn_containers = document.querySelectorAll(".box-container");
const btns = document.querySelectorAll(".btn");

let current = 0;

function hideAllContainers() {
    containers.forEach((container) => {
        container.classList.add("hidden");
        container.classList.remove("active");
    });
}

function hideAllBtns() {
    btn_containers.forEach((btn_container) => {
        btn_container.classList.add("hidden");
        btn_container.classList.remove("active");
    });
}

function hideAllDots() {
    dots.forEach((dot) => {
        dot.classList.remove("active");
    });
}

function showCurrentContainer() {
    btn_containers[current].classList.remove("hidden");
    btn_containers[current].classList.add("active");
    containers[current].classList.remove("hidden");
    containers[current].classList.add("active");
}

function showCurrentDot() {
    dots[current].classList.add("active");
}
function goToNext() {

    // Slide left

    if (current < 2) {
        current++;
        // console.log(current);
    } else {
        window.location.href = "/signup1";
        return;
    }
    setTimeout(() => {
        hideAllDots();
        showCurrentDot();
        hideAllBtns()
        hideAllContainers();
        showCurrentContainer();
    }, 200);
}


dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        current = index;
        setTimeout(() => {
            hideAllDots();
            showCurrentDot();
            hideAllBtns()
            hideAllContainers();
            showCurrentContainer();
        }, 200);
    });
});

btns.forEach((btn) => {
    btn.addEventListener("click", goToNext);
})

showCurrentContainer();
showCurrentDot();

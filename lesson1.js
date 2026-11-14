.
let currentSlide = 0;

const slides = document.querySelectorAll(".slide");
const nextBtn = document.getElementById("nextBtn");
const finishBtn = document.getElementById("finishBtn");
const lessonFill = document.getElementById("lessonFill");
const lessonPercent = document.getElementById("lessonPercent");

function updateProgress() {

    let percent = ((currentSlide + 1) / slides.length) * 100;

    lessonFill.style.width = percent + "%";
    lessonPercent.textContent = Math.round(percent) + "%";

    slides.forEach((slide, index) => {
        slide.classList.remove("active");

        if (index === currentSlide) {
            slide.classList.add("active");
        }
    });

    if (currentSlide === slides.length - 1) {
        nextBtn.style.display = "none";
        finishBtn.style.display = "inline-block";
    }
}

function nextSlide() {

    if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateProgress();
    }

}

function finishLesson() {

    let completedLessons =
        parseInt(localStorage.getItem("completedLessons")) || 0;

    let xp =
        parseInt(localStorage.getItem("xp")) || 0;

    let streak =
        parseInt(localStorage.getItem("streak")) || 0;

    if (completedLessons < 1) {

        completedLessons = 1;
        xp += 30;
        streak += 1;

        localStorage.setItem("completedLessons", completedLessons);
        localStorage.setItem("nextLesson", 2);
        localStorage.setItem("xp", xp);
        localStorage.setItem("streak", streak);
        localStorage.setItem("nextLesson", 2);

    }

    alert("🎉 وانەکە تەواو بوو!");

    window.location.href = "korean.html";

}

updateProgress();

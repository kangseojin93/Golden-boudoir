const totalLessons = 100;

const completedLessons =
    parseInt(localStorage.getItem("completedLessons")) || 0;

const nextLesson =
    parseInt(localStorage.getItem("nextLesson")) || 1;

const xp =
    parseInt(localStorage.getItem("xp")) || 0;


// ==============================
// LEVEL
// ==============================

const level = Math.floor(xp / 100) + 1;

const levelText = document.getElementById("level");

if (levelText) {
    levelText.textContent = "Lv." + level;
}


// ==============================
// STREAK
// ==============================

const streak =
    parseInt(localStorage.getItem("streak")) || 0;

const xpText = document.getElementById("xp");
const streakText = document.getElementById("streak");
const lessonCountText = document.getElementById("lessonCount");

if (xpText) {
    xpText.textContent = xp;
}

if (streakText) {
    streakText.textContent = streak;
}

if (lessonCountText) {
    lessonCountText.textContent =
        completedLessons + " / " + totalLessons;
}


// ==============================
// LESSON PATH
// ==============================

const lessonPath =
    document.getElementById("lessonPath");

if (lessonPath) {

    for (let i = 1; i <= totalLessons; i++) {

        const lesson =
            document.createElement("div");

        lesson.className = "lessonNode";

        lesson.dataset.lesson = i;


        // کلیک لەسەر وانە
        lesson.addEventListener("click", () => {

            if (i <= completedLessons + 1) {

                saveProgress();

                window.location.href =
                    `lesson${i}.html`;
            }

        });


        // شوێنی وانەکان
        const positions = [
            "-80px",
            "0px",
            "80px",
            "0px"
        ];

        lesson.style.transform =
            `translateX(${positions[(i - 1) % 4]})`;


        // وانە تەواوکراوە
        if (i <= completedLessons) {

            lesson.classList.add("completed");

            lesson.innerHTML = "✅";

        }


        // وانەی داهاتوو
        else if (i === nextLesson) {

            lesson.classList.add("current");

            lesson.innerHTML = i;

        }


        // وانەی قوفڵکراو
        else if (i === completedLessons + 2) {

            lesson.classList.add("locked");

            lesson.innerHTML = "🔒";

        }


        // وانەکانی دواتر شاراوە
        else {

            lesson.style.display = "none";

        }


        lessonPath.appendChild(lesson);


        // هێڵی نێوان وانەکان
        if (i < totalLessons) {

            const line =
                document.createElement("div");

            line.className = "pathLine";

            lessonPath.appendChild(line);

        }

    }

}


// ==============================
// PROGRESS BAR
// ==============================

const progressFill =
    document.querySelector(".progressFill");

const progressText =
    document.getElementById("progressText");

if (progressFill && progressText) {

    const percent =
        Math.round(
            (completedLessons / totalLessons) * 100
        );

    progressFill.style.width =
        percent + "%";

    progressText.textContent =
        percent + "%";
}


// ==============================
// SAVE PROGRESS
// ==============================

function saveProgress() {

    const data = {

        completedLessons:
            localStorage.getItem("completedLessons"),

        xp:
            localStorage.getItem("xp"),

        streak:
            localStorage.getItem("streak"),

        nextLesson:
            localStorage.getItem("nextLesson"),

        lastStudyDay:
            localStorage.getItem("lastStudyDay")

    };


    localStorage.setItem(
        "goldenBoudoirSave",
        JSON.stringify(data)
    );

}


// ==============================
// RESTORE SAVE
// ==============================

const save =
    localStorage.getItem("goldenBoudoirSave");

if (save) {

    const data =
        JSON.parse(save);

    for (const key in data) {

        if (data[key] !== null) {

            localStorage.setItem(
                key,
                data[key]
            );

        }

    }

}

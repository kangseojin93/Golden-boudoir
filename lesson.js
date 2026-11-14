
(() => {
  'use strict';

  const bodyLesson = Number(document.body?.dataset.lesson);
  const file = location.pathname.split('/').pop() || '';
  const match = file.match(/lesson(\d+)\.html/i);

  const lessonNumber =
    Number.isSafeInteger(bodyLesson) && bodyLesson > 0
      ? bodyLesson
      : (match ? Number(match[1]) : 1);

  const XP_PER_LESSON = 30;

  let currentSlide = 0;
  let finishing = false;

  const slides = Array.from(
    document.querySelectorAll('.slide')
  );

  const nextBtn = document.getElementById('nextBtn');
  const finishBtn = document.getElementById('finishBtn');
  const lessonFill = document.getElementById('lessonFill');
  const lessonPercent = document.getElementById('lessonPercent');

  function updateProgress() {
    if (!slides.length) return;

    const percent =
      ((currentSlide + 1) / slides.length) * 100;

    if (lessonFill) {
      lessonFill.style.width = percent + '%';
    }

    if (lessonPercent) {
      lessonPercent.textContent = Math.round(percent) + '%';
    }

    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });

    const isLast = currentSlide === slides.length - 1;

    if (nextBtn) {
      nextBtn.style.display = isLast ? 'none' : 'inline-block';
    }

    if (finishBtn) {
      finishBtn.style.display = isLast ? 'inline-block' : 'none';
    }
  }

  window.nextSlide = function () {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      updateProgress();
    }
  };

  function dateKey(offset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offset);

    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }

  function readNumber(key) {
    const value = Number(localStorage.getItem(key) || 0);
    return Number.isFinite(value) && value >= 0 ? value : 0;
  }

  function getCompletedSet() {
    let list = [];

    try {
      list = JSON.parse(
        localStorage.getItem('completedLessonNumbers') || '[]'
      );

      if (!Array.isArray(list)) list = [];
    } catch (_) {}

    if (!list.length) {
      let oldCount = readNumber('completedLessons');

      try {
        const oldSave = JSON.parse(
          localStorage.getItem('goldenBoudoirSave') || '{}'
        );

        oldCount = Math.max(
          oldCount,
          Number(oldSave.completedLessons) || 0
        );

        if (Array.isArray(oldSave.completedLessonNumbers)) {
          list = oldSave.completedLessonNumbers;
        }
      } catch (_) {}

      if (!list.length && oldCount > 0) {
        list = Array.from(
          { length: Math.floor(oldCount) },
          (_, i) => i + 1
        );
      }
    }

    return new Set(
      list.map(Number).filter(
        n => Number.isSafeInteger(n) && n >= 1
      )
    );
  }

  async function getNextLesson() {
    try {
      const response = await fetch('lessons.json', {
        cache: 'no-store'
      });

      if (!response.ok) return null;

      const numbers = await response.json();

      if (!Array.isArray(numbers)) return null;

      return numbers
        .map(Number)
        .filter(n =>
          Number.isSafeInteger(n) && n > lessonNumber
        )
        .sort((a, b) => a - b)[0] || null;

    } catch (_) {
      return null;
    }
  }

  window.finishLesson = async function () {
    if (finishing) return;
    finishing = true;

    if (finishBtn) finishBtn.disabled = true;

    try {
      const completedSet = getCompletedSet();

      let xp = readNumber('xp');
      let streak = readNumber('streak');

      const today = dateKey(0);
      const yesterday = dateKey(-1);

      const lastStudyDay = localStorage.getItem('lastStudyDay');
      const doneKey = `lessonCompleted_${lessonNumber}`;

      const alreadyDone =
        localStorage.getItem(doneKey) === '1' ||
        completedSet.has(lessonNumber);

      // Add XP only once for each lesson
      if (!alreadyDone) {
        xp += XP_PER_LESSON;
      }

      completedSet.add(lessonNumber);

      localStorage.setItem(doneKey, '1');

      // Update streak only once per day
      if (lastStudyDay !== today) {
        streak = lastStudyDay === yesterday
          ? streak + 1
          : 1;
      }

      const nextNumber = await getNextLesson();
      const nextLesson = nextNumber || lessonNumber + 1;

      const numbers = [...completedSet].sort((a, b) => a - b);

      localStorage.setItem(
        'completedLessons',
        String(numbers.length)
      );

      localStorage.setItem(
        'completedLessonNumbers',
        JSON.stringify(numbers)
      );

      localStorage.setItem('xp', String(xp));
      localStorage.setItem('streak', String(streak));
      localStorage.setItem('lastStudyDay', today);
      localStorage.setItem('nextLesson', String(nextLesson));

      let previousSave = {};

      try {
        previousSave = JSON.parse(
          localStorage.getItem('goldenBoudoirSave') || '{}'
        ) || {};
      } catch (_) {}

      localStorage.setItem(
        'goldenBoudoirSave',
        JSON.stringify({
          ...previousSave,
          completedLessons: numbers.length,
          completedLessonNumbers: numbers,
          xp,
          streak,
          nextLesson,
          lastStudyDay: today
        })
      );

      // Open the next available lesson
      if (nextNumber) {
        window.location.assign(`lesson${nextNumber}.html`);
      } else {
        window.location.assign('korean.html');
      }

    } catch (error) {
      console.error('Finish lesson error:', error);

      finishing = false;

      if (finishBtn) finishBtn.disabled = false;

      alert('کێشەیەک لە پاشەکەوتکردنی وانەکە هەیە.');
    }
  };

  updateProgress();

})();

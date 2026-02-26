# PATCH 007 — Frontend Quiz Edge Cases

**Priority:** MEDIUM
**File:** `quiz_javascript.html`

## Simple Explanation

Three frontend issues: (A) Changing the bed size in Q1 doesn't clear answers to later questions that depend on it. A customer could end up with a mattress or accessory on their quote that isn't available for their selected bed size. This patch resets all dependent answers when the bed size changes. (B) There's no way to go back from the results page to modify selections. This patch adds a "Modify Selections" button. (C) The `isMultiSelect` flag on each question is only set when the question is rendered on screen. It should be set once during initialization so the results page can always reference it reliably.

---

## 7A. Changing Q1 answer doesn't clear downstream answers

If a user selects 39" bed, picks the "Comfort" mattress (only available for 39"), then goes back and changes to 48" bed — the "Comfort" mattress answer is still stored in `state.answers['q5']` even though that option is now hidden.

This means the results page could show an invalid selection, and the quote would include a mattress that isn't available for the chosen bed size.

### Current Code (line 975)

```javascript
if (questionId === 'q1') {
    state.selectedBedSize = getSelectedBedSize();
    buildVisibleQuestionsList();
    updateConditionalImages();
}
```

### Patched Code

```javascript
if (questionId === 'q1') {
    const previousBedSize = state.selectedBedSize;
    state.selectedBedSize = getSelectedBedSize();
    buildVisibleQuestionsList();
    updateConditionalImages();

    // If bed size actually changed, clear answers that depend on it
    if (previousBedSize !== state.selectedBedSize) {
        // Clear finish selection (different options per bed size)
        delete state.answers['q2-bed'];
        delete state.answers['q2-headboard'];
        // Clear mattress (availability varies by size)
        delete state.answers['q5'];
        // Clear accessories with size-dependent options
        state.answers['q6'] = [];
        state.answers['q7'] = [];
        state.answers['q8'] = [];
        state.answers['q9'] = [];
        // Clear delivery (pricing varies)
        delete state.answers['q10'];
        delete state.answers['q11'];
    }
}
```

---

## 7B. No way to return to quiz from results page

Once `showResults()` fires, the quiz container and navigation are hidden. The user cannot go back to change their answers.

### Add a "Back to Quiz" button

In `showResults()` (line 1161), add a back button to the results container:

```javascript
function showResults() {
    quizContainer.style.display = 'none';
    navigationContainer.style.display = 'none';
    resultsContainer.classList.add('active');

    state.quoteNumber = generateQuoteNumber();
    generateResultsSummary();

    // Add back button at top of results if not already present
    if (!document.getElementById('backToQuizBtn')) {
        const backBtn = document.createElement('button');
        backBtn.id = 'backToQuizBtn';
        backBtn.textContent = '← Modify Selections';
        backBtn.style.cssText = 'background:transparent; color:#25385b; border:2px solid #25385b; padding:8px 20px; border-radius:8px; cursor:pointer; font-size:1em; margin-bottom:15px;';
        backBtn.addEventListener('click', returnToQuiz);
        resultsContainer.insertBefore(backBtn, resultsContainer.firstChild);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function returnToQuiz() {
    resultsContainer.classList.remove('active');
    quizContainer.style.display = '';
    navigationContainer.style.display = '';

    // Go to last question
    state.currentQuestionIndex = state.visibleQuestions.length - 1;
    renderQuestion(state.currentQuestionIndex);
    updateProgressBar();
    updateNavigationButtons();
    updateSectionInfo();

    // Reset form states
    document.getElementById('emailForm').classList.remove('active');
    document.getElementById('phoneForm').classList.remove('active');
    document.getElementById('successMessage').classList.remove('active');
    document.querySelectorAll('.contact-option').forEach(opt => opt.classList.remove('selected'));
    state.contactType = null;
}
```

---

## 7C. "See Results" button text doesn't revert when navigating back

When the user reaches the last question, `nextBtn` text changes to `'See Results →'`. If they press back, the text stays because `updateNavigationButtons` only sets it when at the last index.

### Current Code (line 1096)

```javascript
if (state.currentQuestionIndex >= state.visibleQuestions.length - 1) {
    nextBtn.textContent = 'See Results →';
} else {
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
}
```

This is already correct — the `else` branch restores the icon. No patch needed here; including for documentation completeness.

---

## 7D. `isMultiSelect` property is set during render, not on data

Line 865 mutates the quiz data during render:

```javascript
question.isMultiSelect = isMultiSelect;
```

This means `isMultiSelect` is only available after the question has been rendered at least once. `generateResultsSummary()` uses `question.isMultiSelect` (line 1202) — if a multi-select question was skipped and never rendered (not currently possible, but fragile), it would be `undefined`.

### Patched Code

Set `isMultiSelect` during init instead of during render. Add to `initQuiz()`:

```javascript
function initQuiz() {
    // Pre-compute isMultiSelect for all questions
    quizData.questions.forEach(question => {
        question.isMultiSelect = question.type === 'multi';
    });

    buildVisibleQuestionsList();
    // ... rest unchanged
}
```

Then remove line 865 from `renderQuestion`:

```javascript
// DELETE THIS LINE:
// question.isMultiSelect = isMultiSelect;
```

The local `isMultiSelect` variable in `renderQuestion` can stay for use within that function.

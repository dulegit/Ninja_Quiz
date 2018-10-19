# Ninja Quiz
----------
Short quiz with 10 questions about Superheroes developed in functional JavaScript...

### 2018-10-19, Update
* For `$form.addEventListener()` add external function `btnClicked()`
* Add missing `removeEventListener()` method for `btnClicked()`, which missing cause error when starting game for second, third, (etc.) time, without reloading browser.
    * In `function check(answer)` **question** object was undefined
    * When you click on button to choose answer, it calls `check(event.target.value)` as much times as you start new game without reloading browser
    * remove unnecessary code, optimize code
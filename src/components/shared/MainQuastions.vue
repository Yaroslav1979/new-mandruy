<template>
  <div class="questions">
    <h1 class="questions__title">Поширені запитання</h1>

    <div class="question-block">
      <div class="question" data-answer="{{answer}}">
        <span>Як можна додати власне місце?</span>
        <button class="toggle-answer">
            <p class="icon-openanswer">
                +
            </p>
        </button>
      </div>
      <div class="answer question" style="display: none">
        Ви можете зробити це у розділі "Додати місце". Для цього потрібно ввести
        назву, обрати категорії, які описують місце, додати координати, опис та
        фото. Натиснувши кнопку "Надіслати" ми отримаємо запит. Після розгляду
        місце буде додане у нашу базу, або ж буде відхилене.
      </div>
    </div>

    <div class="question-block">
      <div class="question" data-answer="{{answer}}">
        <span>Скільки часу потрібно на обробку мого запиту?</span>
        <button class="toggle-answer"><p class="icon-openanswer">+</p></button>
      </div>
      <div class="answer question" style="display: none">
        Ми не маємо можливості розглядати запити кожного дня і додавати на сайт
        лише по одному місцю. Проте намагатимемось робити це регулярно,
        оновлюючи список місць в гугл картах раз на 1-2 тижні. Оновлення бази на
        сайті може зайняти довше часу.
      </div>
    </div>

    <div class="question-block">
      <div class="question" data-answer="{{answer}}">
        <span>Як віднайти потрібне мені місце?</span>
        <button class="toggle-answer"><p class="icon-openanswer">+</p></button>
      </div>
      <div class="answer question" style="display: none">
        Щоб знайти потрібне вам місце ви можете скористатися розділом "Пошук
        місць". Сам пошук можна здійснити за введеною назвою, областю
        розташування або категоріями. Також ви маєте можливість відсортувати
        список за потрібним критерієм та обрати вигляд списку або блоків.
      </div>
    </div>

    <div class="question-block">
      <div class="question" data-answer="{{answer}}">
        <span>Для кого призначений цей сайт?</span>
        <button class="toggle-answer"><p class="icon-openanswer">+</p></button>
      </div>
      <div class="answer question" style="display: none">
        Сайт призначений для усіх, хто любить подорожувати Україною. Серед
        місць, внесених до нашої бази, є історичні пам'ятки, музеї, місця для
        таборів, відпочинку. Тому сайт може стати в нагоді будь-кому.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainQuastions",
};
</script>

<style lang="scss" scoped>
/* .bgd {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 1600px; 
} */

.questions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;  
  gap: 20px;
  padding: 40px 0;
  background-color: #000; 
}

.questions__title {
color: #FFF;
text-align: center;
font-family: e-Ukraine, sans-serif;
font-size: 24px;
font-weight: 700;
line-height: 18px; 
text-transform: uppercase;
padding: 20px 0;
}

.question-block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
   width: 1096px;
  /* justify-self: center; */
  border-radius: 5px;
  border: 2px solid #8C9BA5;
  padding: 16px 20px 0 20px;
 
}

.question {
  display: flex;
  justify-content: space-between;  
  color: #FFF;
  font-family: e-Ukraine, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  
}
.toggle-answer {
    background-color: black;
    border:  solid #000;
    margin-bottom: 10px;
}

.answer {
padding-bottom: 20px;
}

.icon-openanswer {
    display: flex;
    flex-direction: column;
    justify-content: center;
  color: #FFF;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
  /* background-color: black; */
  cursor: pointer;
}
.icon-openanswer:hover {
  color: #cec3c3;
  font-size: 40px;
}
</style>

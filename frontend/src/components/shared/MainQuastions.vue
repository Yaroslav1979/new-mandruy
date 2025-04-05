<!-- <template>
  <section class="questions" id="questions">
    <h1 class="questions__title">Поширені запитання</h1>

    <FaqItem
      v-for="(item, index) in faqItems"
      :key="index"
      :question="item.question"
      :answer="item.answer"
    />
  </section>
</template>

<script>
import FaqItem from "./FaqItem.vue";

export default {
  name: "MainQuestions",
  components: { FaqItem },
  data() {
    return {
      faqItems: [
        {
          question: "Як можна додати власне місце?",
          answer:
            "Ви можете зробити це у розділі 'Додати місце'. Для цього потрібно ввести назву, обрати категорії, які описують місце, додати координати, опис та фото. Натиснувши кнопку 'Надіслати' ми отримаємо запит. Після розгляду місце буде додане у нашу базу, або ж буде відхилене.",
        },
        {
          question: "Скільки часу потрібно на обробку мого запиту?",
          answer:
            "Ми не маємо можливості розглядати запити кожного дня і додавати на сайт лише по одному місцю. Проте намагатимемось робити це регулярно, оновлюючи список місць в гугл картах раз на 1-2 тижні. Оновлення бази на сайті може зайняти довше часу.",
        },
        {
          question: "Як віднайти потрібне мені місце?",
          answer:
            "Щоб знайти потрібне вам місце ви можете скористатися розділом 'Пошук місць'. Сам пошук можна здійснити за введеною назвою, областю розташування або категоріями. Також ви маєте можливість відсортувати список за потрібним критерієм та обрати вигляд списку або блоків.",
        },
        {
          question: "Для кого призначений цей сайт?",
          answer:
            "Сайт призначений для усіх, хто любить подорожувати Україною. Серед місць, внесених до нашої бази, є історичні пам'ятки, музеї, місця для таборів, відпочинку. Тому сайт може стати в нагоді будь-кому.",
        },
      ],
    };
  },
};
</script>

<style scoped>
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
  color: #fff;
  text-align: center;
  font-family: e-Ukraine, sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 18px;
  text-transform: uppercase;
  padding: 20px 0;
}
</style> -->

<template>
  <section class="questions" id="questions">
    <h1 class="questions__title">Поширені запитання</h1>

    <QuestionItem
      v-for="(item, index) in questions"
      :key="item.id"
      :number="index + 1"
      :question="item.question"
      :answer="item.answer"
    />
  </section>
</template>

<script>
import QuestionItem from "./QuestionItem.vue";
import { questions } from "./popularQuestions";

export default {
  name: "MainQuastions",
  components: {
    QuestionItem,
  },
  data() {
    return {
      questions,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables.scss";

.questions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 40px 0;
  background-color: #000;

  &__title {
    color: #fff;
    text-align: center;
    font-family: e-Ukraine, sans-serif;
    font-size: 24px;
    font-weight: 700;
    line-height: 18px;
    text-transform: uppercase;
    padding: 20px 0;
  }
}
</style>

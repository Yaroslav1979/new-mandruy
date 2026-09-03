<template>
  <div class="question-block">
    <div class="question" @click="toggleAnswer">
      <div class="question__wrapper">
        <span class="question__number">{{ number }}.</span>
        <span class="question__text">{{ question }}</span>
      </div>
      <button class="toggle-answer">
        <p class="icon-openanswer">{{ isOpen ? "-" : "+" }}</p>
      </button>
    </div>

    <div v-if="isOpen" class="answer">
      {{ answer }}
    </div>
  </div>
</template>

<script>
export default {
  name: "QuestionItem",
  props: {
    number: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleAnswer() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/variables.scss";

.question-block {
  display: flex;
  flex-direction: column;

  width: min(1096px, calc(100% - 40px));

  border-radius: clamp(4px, 0.4vw, 5px);
  border: clamp(1px, 0.15vw, 2px) solid #333639;

  padding: clamp(10px, 1.5vw, 16px) clamp(12px, 1.8vw, 20px);

  cursor: pointer;
  box-sizing: border-box;
}

.question {
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: #111;
  font-family: e-Ukraine, sans-serif;
  font-size: clamp(13px, 1.2vw, 16px);
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;

  &__wrapper {
    display: flex;
    align-items: center;

    /*
     * Текст може займати всю доступну ширину,
     * залишаючи місце для +/-
     */
    min-width: 0;
  }

  &__number {
    display: flex;
    align-items: center;

    margin-right: clamp(5px, 0.6vw, 8px);

    flex-shrink: 0;
  }

  &__text {
    min-width: 0;
  }
}

.answer {
  margin-top: clamp(7px, 0.8vw, 10px);
  padding-left: clamp(14px, 1.8vw, 20px);

  color: #111;
  font-family: e-Ukraine, sans-serif;
  font-size: clamp(12px, 1.05vw, 14px);
  line-height: 1.5;
}

.toggle-answer {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  padding: 0;
  margin-left: clamp(10px, 2vw, 25px);

  background-color: #fff;
  border: none;
}

.icon-openanswer {
  display: flex;
  align-items: center;

  margin: 0;

  color: #333639;
  font-size: clamp(24px, 2.5vw, 32px);
  font-style: normal;
  font-weight: 600;
  line-height: 1;

  cursor: pointer;
}
</style>

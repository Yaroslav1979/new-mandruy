<template>
  <div class="question-block">
    <div class="question" @click="toggleAnswer">
      <div class="question__wrapper">
      <span class="question__number">{{ number }}.</span>
      <span class="question__text">{{ question }}</span>
      </div>
      <button class="toggle-answer">
        <p class="icon-openanswer">{{ isOpen ? '-' : '+' }}</p>
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

  width: 1096px;
  border-radius: 5px;
  border: 2px solid #8c9ba5;
  padding: 16px 20px 16px 20px;
  cursor: pointer;
}

.question {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  color: #fff;
  font-family: e-Ukraine, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
  
  &__wrapper {
    display: flex;  
  }

  &__number {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }
}

.answer {
  margin-top: 10px;
  padding-left: 20px;
  color: #fff;
  line-height: 1.5;
}

.toggle-answer {
  background-color: black;
  border: none;
  display: flex;
  align-items: center; 
}

.icon-openanswer {
  color: #fff;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
  cursor: pointer;
  display: flex;
  align-items: center; 
}
</style>


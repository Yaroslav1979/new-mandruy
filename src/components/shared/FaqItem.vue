<!-- <template>
    <div class="question-block">
      <div class="question" @click="toggleAnswer">
        <span>{{ question }}</span>
        <button class="toggle-answer">
          <p class="icon-openanswer">{{ isOpen ? '-' : '+' }}</p>
        </button>
      </div>
  
      <div v-if="isOpen" class="answer question">
        {{ answer }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "FaqItem",
    props: {
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
  
  <style scoped>
  .question-block {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-content: center;
    width: 1096px;
    border-radius: 5px;
    border: 2px solid #8c9ba5;
    padding: 16px 20px 0 20px;
  }
  
  .question {
    display: flex;
    justify-content: space-between;
    color: #fff;
    cursor: pointer;
  }
  
  .toggle-answer {
    background-color: black;
    border: none;
  }
  
  .icon-openanswer {
    font-size: 32px;
    font-weight: 600;
    line-height: 18px;
    cursor: pointer;
  }
  
  .icon-openanswer:hover {
    color: #cec3c3;
    font-size: 40px;
  }
  
  .answer {
    padding-bottom: 20px;
  }
  </style> -->
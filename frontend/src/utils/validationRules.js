export const isRequired = (val) => ({
    hasPassed: !!val && val.trim().length > 0,
    message: 'Будь-ласка, заповніть це поле',
  }); 

  export const charLimit = (limit) => (val) => ({
    hasPassed: val.length <= limit,
    message: 'Ви перевищили ліміт',
  });
  
  export const emailValidation = (val) => ({
    hasPassed: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(val),
    message: 'Невірний email',
  });
  
  export const passwordValidation = (val) => ({
    hasPassed: /^(?=.*[A-Za-z])(?=.*[\d])[a-zA-Z0-9]{7,256}$/.test(val),
    message: 'Пароль має містити одну цифру, малу та велику латинську літеру',
  });
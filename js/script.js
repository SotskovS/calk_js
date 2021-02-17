'use strict';

const isNumber = n => (!isNaN(parseFloat(n)) && isFinite(n)); 

const start = document.querySelector('#start'),
  btnPlusIncome = document.getElementsByTagName('button')[0],
  btnPlusExpences = document.getElementsByTagName('button')[1],
  depositeCheck = document.querySelector('#deposit-check'),
  additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
  salaryAmount = document.querySelector('.salary-amount'),
  budgetDayValue = document.querySelector('.budget_day-value'),
  budgetMonthValue = document.querySelector('.budget_month-value'),
  expensesMonthValue = document.querySelector('.expenses_month-value'),
  additionalIncomeValue = document.querySelector('.additional_income-value'),
  additionalExpensesValue = document.querySelector('.additional_expenses-value'),
  incomePeriodValue = document.querySelector('.income_period-value'),
  targetMonthValue = document.querySelector('.target_month-value'),  
  additionalExpensesItem = document.querySelector('.additional_expenses-item'),
  targetAmount = document.querySelector('.target-amount'),
  periodSelect = document.querySelector('.period-select'),
  periodAmount = document.querySelector('.period-amount'),
  inputs = document.querySelectorAll('input'),
  cancel = document.querySelector('#cancel'),  
  depositBank = document.querySelector('.deposit-bank'),
  depositCalc = document.querySelector('.deposit-calc'),
  depositAmount = document.querySelector('.deposit-amount'),

data = document.querySelector('.data'),

  depositPercent = document.querySelector('.deposit-percent');

let incomeItems = document.querySelectorAll('.income-items'),
  expensesItems = document.querySelectorAll('.expenses-items'); 
  
class AppData {
  constructor() { 
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;  
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0; 
    this.expensesMonth = 0;  
  }

  start() {
  
    this.budget = +salaryAmount.value;   
    
    this.getExpenses();
    this.getIncome();
    this.getExpensesMonth();
    this.getIncomeMonth();
    this.getAddExpenses();
    this.getAddIncome();
    this.getInfoDeposit();
    this.getBudget();
    this.getPeriod();
    this.showResult();
    
    start.style.display = "none";
    cancel.style.display = "block";
    
    inputs.forEach( item => {
      item.setAttribute('disabled', true);  
    });

    periodSelect.disabled = false;
  
    incomeItems.forEach( item => {      
      item.querySelector('input').setAttribute('disabled', true);
    });
  
    expensesItems.forEach( item => {      
      item.querySelector('input').setAttribute('disabled', true);
    });
  
    btnPlusIncome.setAttribute('disabled', true);
    btnPlusExpences.setAttribute('disabled', true);   
  }
  
  reset() {
    
    start.style.display = "block";
    cancel.style.display = "none";
  
    inputs.forEach( item => {      
      item.removeAttribute('disabled');
      item.value = '';
    });
  
    incomeItems.forEach( (item, i) => {
      console.log();
      switch (i) {
        case 1:
          incomeItems[1].remove();
          break;
        case 2:
          incomeItems[1].remove();
          incomeItems[2].remove();
          break;
        default:
          break;
      }      
    });
  
    expensesItems.forEach( (item, i) => {
      console.log();
      switch (i) {
        case 1:
          expensesItems[1].remove();
          break;
        case 2:
          expensesItems[1].remove();
          expensesItems[2].remove();
          break;
        default:
          break;
      }      
    });
  
    btnPlusIncome.style.display = 'block';
    btnPlusExpences.style.display = 'block';
    
    expensesItems.forEach( item => {
      item.querySelector('input').removeAttribute('disabled', true);
      item.querySelector('input').value = '';
    });
  
    btnPlusIncome.removeAttribute('disabled');
    btnPlusExpences.removeAttribute('disabled');
    periodSelect.value = 1;
    periodAmount.textContent = "1";
  
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;  
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0; 
    this.expensesMonth = 0;
    this.budgetDayValue = 0;
    this.budgetMonthValue = 0;
    this.incomePeriodValue = 0;
     
    depositeCheck.checked = false;
    this.depositHandler();
  
    start.disabled = true;
    depositPercent.style.display = 'none';
  }

  showResult(){
  
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcPeriod();
    incomePeriodValue.value = this.getPeriod();
  }

  addExpensesBlock() {
  
    const cloneExpensesItem = expensesItems[0].cloneNode(true);
    cloneExpensesItem.querySelector('.expenses-title').value = '';
    cloneExpensesItem.querySelector('.expenses-amount').value = '';
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, btnPlusExpences);
    expensesItems = document.querySelectorAll('.expenses-items');
    
    if (expensesItems.length === 3) {
      btnPlusExpences.style.display = 'none';
    }
  }
  
  addIncomeBlock() {
  
    const cloneIncomeItem = incomeItems[0].cloneNode(true);
    cloneIncomeItem.querySelector('.income-title').value = '';
    cloneIncomeItem.querySelector('.income-amount').value = '';
    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, btnPlusIncome);
    incomeItems = document.querySelectorAll('.income-items');
    
    if (incomeItems.length === 3) {
      btnPlusIncome.style.display = 'none';
    }
  }

  getExpenses() {
  
    expensesItems.forEach((item) => {
      const itemExpenses = item.querySelector('.expenses-title').value;
      const cashExpenses = item.querySelector('.expenses-amount').value;
    
      if (itemExpenses !== '' && cashExpenses !== '') {      
        this.expenses[itemExpenses] = cashExpenses;
      }
    });
  }

  getIncome() {
  
    incomeItems.forEach( item => {
      const itemIncome = item.querySelector('.income-title').value;
      const cashIncome = item.querySelector('.income-amount').value;
    
      if (itemIncome !== '' && cashIncome !== '') {
        this.income[itemIncome] = cashIncome;
      }
    });
  }

  getAddExpenses() {
    
    const addExpenses = additionalExpensesItem.value.split(',');    
    addExpenses.forEach( item => {
      item = item.trim();
      
      if (item !== '') {
        this.addExpenses.push(item);
      }
    });
  }

  getAddIncome() {
  
    additionalIncomeItem.forEach( item => {
      const itemValue = item.value.trim();
      
      if (itemValue !== '') {
        this.addIncome.push(itemValue);
      }
    });
  }

  getExpensesMonth() {
    
    for (let key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
      
  }

  getIncomeMonth() {
          
    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
      
  }
  
  getPeriod() {    
  
    periodAmount.textContent = periodSelect.value;
    return periodSelect.value;
  }

  getBudget() { 

    const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
    this.budgetDay = Math.ceil(this.budgetMonth / 30);
  }
  
  getTargetMonth() {
    return Math.ceil(targetAmount.value / this.budgetMonth);
  }

  getStatusIncome() {
  
    if (this.budgetDay >= 1200) {
      return 'У вас высокий уровень дохода';  
    } else if (this.budgetDay < 1200 && this.budgetDay >= 600) {
      return 'У вас средний уровень дохода';
    } else if (this.budgetDay < 600 && this.budgetDay >= 0) {
      return 'У сожалению у вас уровень дохода ниже среднего';
    } else if (this.budgetDay < 0) {
      return 'Что-то пошло не так';
    }  
  }

  calcPeriod() {    
    return this.budgetMonth * periodSelect.value;
  }

  getInfoDeposit() {
    
    if (this.deposit) {
      this.percentDeposit = depositPercent.value;

      this.moneyDeposit = depositAmount.value;
    }
  }

  changePercent() {
    const valueSelect = this.value;
    
    if (valueSelect === 'other') {
      depositPercent.style.display = 'inline-block';
      depositPercent.value = '';

    } else {
      depositPercent.style.display = 'none';
      depositPercent.value = valueSelect;
    }

  }

  depositHandler() {

    if (depositeCheck.checked) {
      depositBank.style.display = 'inline-block';
      depositBank.value = '5';
      depositAmount.style.display = 'inline-block';
      depositBank.addEventListener('change', this.changePercent);

      // this.eventListener();
    
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      depositBank.removeEventListener('change', this.changePercent);
    }
  
  }

  eventListener() {

    start.disabled = true;




data.addEventListener('input', event => {

  if (isNumber(event.target.value) && (event.target.placeholder == 'Сумма')) {          

    console.log('dfffffffffff');
    start.disabled = false;
  } 

  console.log(Boolean(event.target.placeholder == 'Сумма'));
});


    //   salaryAmount.addEventListener('input', () => {
      
    //     const salaryMoney = salaryAmount.value.trim();
      
    //     if (isNumber(salaryMoney)) {          
    //       start.disabled = false;
    //     }       

    //   });
    
    //   if (depositeCheck.checked) {

    //     start.disabled = true;
      
    //     depositCalc.addEventListener('input', event => {
          
    //       if (isNumber(event.target.value)) {          
    //         start.disabled = false;
    //       }
          
    //     });

    //   }


      // depositAmount.addEventListener('input', () => {
        
      //   const salaryMoney = salaryAmount.value.trim(),
      //     depositMoney = depositAmount.value.trim();

      //   if (isNumber(salaryMoney) && isNumber(depositMoney)) {       
          
      //     start.disabled = false;
      //   }                
      // });

      // depositPercent.addEventListener('input', () => {
                    
      //   const percentMoney = depositPercent.value.trim();
        
      //   if (isNumber(percentMoney) && (percentMoney > 0 && percentMoney < 100)) {
          
      //     start.disabled = false;
      //   } else {
      //     alert ("Введите корректное значение в поле проценты");
      //   }        
      // }); 

    start.addEventListener('click', this.start.bind(this));
    cancel.addEventListener('click', this.reset.bind(appData));
      
    periodSelect.addEventListener('input', this.getPeriod);
    btnPlusExpences.addEventListener('click', this.addExpensesBlock);
    btnPlusIncome.addEventListener('click', this.addIncomeBlock);
    
    depositeCheck.addEventListener('change', this.depositHandler.bind(this));
  }
}

const appData = new AppData();

appData.eventListener();



let input = data.querySelectorAll('input');
  
console.log(typeof input);



console.log(input);
/*
BUDGET CONTROLLER
*/
var budgetController = (function () {

    var data = {
        allItems: {
            exp: [],
            inc: [],
        }, 
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1
    }

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description
        this.value = value
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description
        this.value = value
    }

    var calculateTotal = function (type){
        var sum = 0
        data.allItems[type].forEach(function(curr){
            sum = sum + curr.value
        });
        data.totals[type] = sum;
    }

    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            if(data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            else
                ID = 0

            if(type === 'exp')
                newItem = new Expense(ID, des, val)
            else if(type === 'inc')
                newItem = new Income(ID, des, val)

            data.allItems[type].push(newItem)
            return newItem
        },
        
        calculateBudget: function(){
            /* 
            Calculate the total income and expenses
            Calculate the budget income - expenses
            Calculate the percentage of income spent
            */

            calculateTotal('exp');
            calculateTotal('inc')

            data.budget = data.totals.inc - data.totals.exp
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100)
            } else {
                data.percentage = -1
            }
            

        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            }
        },
        testing: function () {
            console.log(data)
        }
    }
})();
/*
UI CONTROLLER
*/
var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        budgetIncomeLabel: '.budget__income--value',
        budgetExpensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
            }
        },
        addListItem: function(obj, type){
            /*
            create HTML strings with placeholder text
            replace the placeholder text with some actual data
            insert the html into the DOM
            */
            var html, newHtml, element;
            if(type === 'inc'){
                element = DOMStrings.incomeContainer
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if( type === 'exp'){
                element = DOMStrings.expenseContainer
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', obj.value)

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            
        },
        clearFields: function (){
            var fields, fieldsArray
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue)
            fieldsArray =  Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(curr, i, array){
                curr.value = "";
            });

            fieldsArray[0].focus()
        },

        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget
            document.querySelector(DOMStrings.budgetIncomeLabel).textContent = obj.totalInc
            document.querySelector(DOMStrings.budgetExpensesLabel).textContent = obj.totalExp
            

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage+'%'
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---'  
            }
        },

        getDOMstrings: function(){
            return DOMStrings;
        }
    }
})();



/*
GLOBAL APP CONTROLLER
*/
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', function () {
            ctrlAddItem()
        });
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem()
            }
        });
    }

    
    var updateBudget = function () {
        /*
        Calculate the budget
        return the budget
        display the budget on the UI
        */
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget()

        UICtrl.displayBudget(budget);
    }

    

    var ctrlAddItem = function () {
        /*
        1 get the filed input data
        2 add the item to the budget controller
        3 add the item to the UI controller
        4 clear the fields
        5 calculate and update the budget
        6 display the budget on the UI
        */

        var input = UICtrl.getInput();
        if(input.description !== "" && input.value !==NaN && input.value>0){
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget();
        }
    }

    return {
        init: function(){
            console.log("Application Has Started")
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0,
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init()
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
        this.percentage = -1
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description
        this.value = value
    }

    Expense.prototype.calcPercentages = function (totalIncome) {
        if(totalIncome > 0)
            this.percentage = Math.round((this.value / totalIncome)*100)
        else
            this.percentage = -1
    };  
    
    Expense.prototype.getPercentage = function() {
        return this.percentage
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
        
        deleteitem: function (type, id) {
            var ids, index;
            ids = data.allItems[type].map(function (current) {
                return current.id
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1)
            }

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

        calculatePercentages: function() {
            data.allItems.exp.forEach(function (curr) {
                curr.calcPercentages(data.totals.inc);
            })
        },

        getPercentages: function(){
            var allperc = data.allItems.exp.map(function(curr) {
                return curr.getPercentage()
            });
            return allperc
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
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    }

    var formatNumber = function(num, type){
        var numSplit,int, dec, sign
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.')
        int = numSplit[0]
        if(int.length > 3) {
            int = int.substr(0,int.length - 3) + ','+int.substr(int.length-3,int.length)
        }
        dec = numSplit[1]

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
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
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if( type === 'exp'){
                element = DOMStrings.expenseContainer
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            
        },

        deleteListItems: function(selectorID){
            var element;
            element = document.getElementById(selectorID).parentNode
            element.removeChild(document.getElementById(selectorID))
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
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp'
            document.querySelector(DOMStrings.budgetLabel).textContent =formatNumber(obj.budget, type)
            document.querySelector(DOMStrings.budgetIncomeLabel).textContent =formatNumber(obj.totalInc, 'inc')
            document.querySelector(DOMStrings.budgetExpensesLabel).textContent =formatNumber(obj.totalExp, 'exp')
            

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage+'%'
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---'  
            }
        },

        displayPercentages(perArr){
            var fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

            var nodeListForEach = function(list, callback){
                for(var i = 0; i< list.length; i++){
                    callback(list[i], i)
                }
            }

            nodeListForEach(fields, function(current, index){
                if(perArr[index] > 0)
                    current.textContent = perArr[index] + '%';
                else
                    current.textContent = '---'
            })
        },

        displayMonth: function () {
            var now, year, month, months
            now = new Date();
            months = ['January','February','March','April','May','June','July','August','September','October','November','December']
            month = now.getMonth() 
            year = now.getFullYear()
            document.querySelector(DOMStrings.dateLabel).textContent = months[month]+", "+year;
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
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem()
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
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


    var updatePercentages = function() {
        /* 
        calulate percentages
        read percentages from the budget controller 
        update the UI with the new percentages
        */
       budgetCtrl.calculatePercentages();
       var percentages = budgetCtrl.getPercentages();
       UICtrl.displayPercentages(percentages)
    }
    

    var ctrlAddItem = function () {
        /*
        1 get the filed input data
        2 add the item to the budget controller
        3 add the item to the UI controller
        4 clear the fields
        5 calculate and update the budget
        6 display the budget on the UI
        7 calculate and update percentages
        */

        var input = UICtrl.getInput();
        if(input.description !== "" && input.value !==NaN && input.value>0){
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value)
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget();
            updatePercentages();
        }
    }

    var ctrlDeleteItem = function(event) {
        var itemID,
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {
           splitID = itemID.split('-')
           type = splitID[0]
           id = parseInt(splitID[1])
           /* 
           delete the item from the data structure
           delete the item from the UI
           update and show the budget
           */
          budgetCtrl.deleteitem(type, id);
          UICtrl.deleteListItems(itemID);
          updateBudget();
          updatePercentages();
        }
    };
    return {
        init: function(){
            console.log("Application Has Started")
            UICtrl.displayMonth()
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
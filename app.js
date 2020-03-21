/*
BUDGET CONTROLLER
*/
var budgetController = (function () {
    /*
    var x = 23
    var add = function(a){
        return x+a
    }
    return {
        publicTest: function(b){
            return (add(b))
        }
    }
    */

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

    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;
    var total

    var data = {
        allItems: {
            exp: [],
            inc: [],
        }, 
        totats: {
            exp: 0,
            inc: 0,
        }
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
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
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
    /*
    var z = budgetCtrl.publicTest(5);

    return {
        anotherPublic: function(){
            console.log(z)
        }
    }
    */

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


    

    var ctrlAddItem = function () {
        /*
        1 get the filed input data
        2 add the item to the budget controller
        3 add the item to the UI controller
        4 calculate the budget
        5 display the budget on the UI
        */

        var input = UICtrl.getInput();
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value)
    }

    return {
        init: function(){
            console.log("Application Has Started")
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init()
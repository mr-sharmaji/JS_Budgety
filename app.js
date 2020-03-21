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

    var DOM = UICtrl.getDOMstrings();
    
    var ctrlAddItem = function () {
        /*
        1 get the filed input data
        2 add the item to the budget controller
        3 add the item to the UI controller
        4 calculate the budget
        5 display the budget on the UI
        */

        var input = UICtrl.getInput();
        console.log(input)
    }

    document.querySelector(DOM.inputBtn).addEventListener('click', function () {
        ctrlAddItem()
    });

    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem()
        }

    });

})(budgetController, UIController);
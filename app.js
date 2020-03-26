var budgetController = (function(){
    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return{
        addItem: function(type,des,val){
            var newItem,ID;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }

            if(type === 'exp'){
                newItem = new Expense(ID,des,val);
            }else{
                newItem = new Income(ID,des,val);
            }

            data.allItems[type].push(newItem);
            return newItem;

        },
        testing: () => {
            console.log(data);
        }
    };

})();




var uiController = (function(){
    var DOMstring = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inpuBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    }
    return {
        getInput: function(){
            return{
                type : document.querySelector(DOMstring.inputType).value,
                description : document.querySelector(DOMstring.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstring.inputValue).value),
            };
        },
        addListItem: function(obj,type){
            var element,html;
            if(type === 'exp'){
                element = DOMstring.expenseContainer;
                html = `<div class="item clearfix" id="expense-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">- ${obj.value}</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
            }else{
                element = DOMstring.incomeContainer;
                html = `<div class="item clearfix" id="income-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">+ ${obj.value}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            }
            document.querySelector(element).insertAdjacentHTML('beforeend',html);
           
        },
        getDOMString: function(){
            return DOMstring;
        },
        clearField: function(){
            var fields = document.querySelectorAll(DOMstring.inputDescription + ',' + DOMstring.inputValue);
            var fieldArr = Array.prototype.slice.call(fields);

            fieldArr.forEach(element => {
                element.value = '';
            });

            fieldArr[0].focus();
        }
    };
})();

var appController = (function(budgetCtrl,uiCtrl){

    var setUpEventListener = function(){
        var DOMObject = uiCtrl.getDOMString();

        document.querySelector(DOMObject.inpuBtn).addEventListener('click',function(e){
            ctrlAddItem();
        });
    
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13){
                ctrlAddItem();
            }
        });
    }

    var ctrlAddItem = function(){
        var input = uiCtrl.getInput();
        if(input.description !== '' && input.value !== NaN && input.value > 0){
            var newItems = budgetCtrl.addItem(input.type,input.description,input.value);
            uiCtrl.addListItem(newItems,input.type);
            uiCtrl.clearField();
        }
    }

    

    return{
        init: function(){
            console.log("Applicaton runnig on the local machine!");
            setUpEventListener();
        }
    }
    
})(budgetController,uiController);

appController.init();
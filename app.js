var budgetController = (function(){
    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome)*100);
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage;
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
        },
        budget: 0,
        percentage: -1
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(item => {
            sum = sum + item['value'];
        })
        
        data.totals[type] = sum;
    }

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
        deleteItem: function(type,id){
            var ids,index;

            ids = data.allItems[type].map((item)=>{
                return item.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        },
        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;

            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(item){
                item.calcPercentage(data.totals.inc);
            })
        },
        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(item){
                return item.getPercentage();
            });
            return allPerc;
        },
        testing: function() {
            console.log(data);
        }
    };

})();




var uiController = (function(){
    var DOMstring = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    }
    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function(list,callback){
        for(var i=0; i< list.length; i++){
            callback(list[i],i);
        }
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
                html = `<div class="item clearfix" id="exp-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber(obj.value,type)}</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
            }else{
                element = DOMstring.incomeContainer;
                html = `<div class="item clearfix" id="inc-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${formatNumber(obj.value,type)}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            }
            document.querySelector(element).insertAdjacentHTML('beforeend',html);
           
        },
        deleteListItem: function(selectorId){
            document.getElementById(selectorId).parentNode.removeChild(document.getElementById(selectorId));
        },
        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(obj.budget,type)+'$';
            document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalInc,'inc')+'$';
            document.querySelector(DOMstring.expenseLabel).textContent = formatNumber(obj.totalExp,'exp')+'$';
            if(obj.percentage > 0){
                document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage+'%';
            }else{
                document.querySelector(DOMstring.percentageLabel).textContent = '0%';
            }
        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstring.expensesPercLabel);
            
            

            nodeListForEach(fields,function(item,index){
                if(percentages[index] > 0){
                    item.textContent = percentages[index] + '%';
                }
            });

        },
        displayMonth: function(){
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth();
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector(DOMstring.dateLabel).textContent = months[month] + ' ' + year;
        },
        changeType: function(){
            var fields = document.querySelectorAll(
                DOMstring.inputType + ',' +
                DOMstring.inputDescription + ',' +
                DOMstring.inputValue);

            nodeListForEach(fields,function(item){
                item.classList.toggle('red-focus');
            })

            document.querySelector(DOMstring.inputBtn).classList.toggle('red');

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

        document.querySelector(DOMObject.inputBtn).addEventListener('click',function(e){
            ctrlAddItem();
        });
    
        document.addEventListener('keypress',function(e){
            if(e.keyCode === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOMObject.container).addEventListener('click',ctrlDeleteItem);

        document.querySelector(DOMObject.inputType).addEventListener('change',uiCtrl.changeType);
    }

    var updateBudget = function(){
        budgetCtrl.calculateBudget();
        var totalCalc = budgetCtrl.getBudget();
        uiCtrl.displayBudget(budgetCtrl.getBudget());
    }

    var updatePercentages = function(){
        budgetCtrl.calculatePercentages();
        var percentages = budgetCtrl.getPercentages();
        uiCtrl.displayPercentages(percentages);
    }

    var ctrlAddItem = function(){
        var input = uiCtrl.getInput();
        if(input.description !== '' && input.value !== NaN && input.value > 0){
            var newItems = budgetCtrl.addItem(input.type,input.description,input.value);
            uiCtrl.addListItem(newItems,input.type);
            uiCtrl.clearField();
            updateBudget();
            updatePercentages();
            
        }
    }

    var ctrlDeleteItem = function(e){
        var itemId,itemType,itemId,itemSpilt,DOMElement;
        itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemId){
            itemSpilt = itemId.split('-');
            itemType = itemSpilt[0];
            itemId   = parseInt(itemSpilt[1]);
            budgetCtrl.deleteItem(itemType,itemId);
            uiCtrl.deleteListItem(e.target.parentNode.parentNode.parentNode.parentNode.id);
            updateBudget();
            updatePercentages();
        }
        
    }

    return{
        init: function(){
            console.log("Applicaton runnig on the local machine!");
            uiCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListener();
            uiCtrl.displayMonth();
        }
    }
    
})(budgetController,uiController);

appController.init();



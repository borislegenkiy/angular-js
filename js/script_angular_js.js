var myApp = angular.module('myApp', []);
//----------------var------------------
var count_pos=0;
var count_danger = 0;
var count_info = 0;
var count_price_portfolio = 0;
var count_income_loss = 0;
var cost_current = 0;
//--------------function----------------
function resCost(sum) {
    if (sum<0) {
		res = Math.abs(sum);
		res = "-"+"$"+res;
	} else {
		if(sum==0){
			res = sum;
		} else {
			res = "$"+sum;
		}
	}
	return res;
}
//--------------directives--------------
myApp.directive('inputs', function() {
	return {
        template: "<div><input type='text' class='form-control input_calcul f_left' id='current_price' required ng-pattern='/^\d{0,9}(\.\d{1,9})?$/' ng-model='current_price' placeholder='Текущая цена'><input class='btn btn-default input_button f_left' type='submit' ng-click='OkClick()' value='Ok'></div>",
        replace: true
    };
});

myApp.directive('addButton', function($compile) {
	return {
		template: '<div class="holder"><button type="button" ng-click="addElements(\'inputs\')" class="btn btn-default">Задать цену</button><div class="holder" value="count_pos">',
		link: function(scope, element, attr) {
            scope.addElements = function(type) {
                var el = $compile('<div ' + type + '></div>')(scope);
                $('.holder', element).html(el);
            },
			scope.OkClick = function() {
					//current item 'total cost' and current item 'income-loss'
					cost = scope.conts[attr.value].cost;
					cost = cost.replace("$","");
					cost1 = parseFloat(cost);
					cost2 = parseFloat(current_price.value);
					
				    count = parseFloat(scope.conts[attr.value].count);
					
					cost = (cost2 - cost1)*count;//current income-loss
					cost_current = cost2 * count;//current cost
					
					
					//all items 'total cost' and all items 'income-loss'
					count_price_portfolio = 0;//total income-loss
					count_income_loss = 0;//total cost
					count_danger= 0;//total red lines
					count_info =0;//total green lines
					for (var i = 0; i < scope.conts.length; i++) {
						if (attr.value!=i) {
							count_price_portfolio = count_price_portfolio + scope.conts[i].cost_current_data;
							count_income_loss = count_income_loss + scope.conts[i].cost_current_income_loss;
							if(scope.conts[i].cost_current_income_loss<0) {
								count_danger++;
							}
							if(scope.conts[i].cost_current_income_loss>0) {
								count_info++;
							}
						} else {
							count_price_portfolio = count_price_portfolio + cost_current;
							count_income_loss = count_income_loss + cost;
							if(cost<0) {
								count_danger++;
							}
							if(cost>0) {
								count_info++;
							}
						}
					}
					
					//return new data to table
					current_price_str = "$" + current_price.value;
					var el = $compile("<div class='data' data-title='Кликните для изменения цены' ng-click=addElements(\'inputs\') value='"+attr.value+"'>$"+current_price.value+"</div>")(scope);
					$('.holder', element).html(el);
					
			
					if (cost<0) {
						res_str = Math.abs(cost);
						res_str= "-"+"$"+res_str;
						style = "danger";
					} else {
						if (cost==0) {
							res_str= cost;
							style = "none";
						} else {
							res_str= "$"+cost;
							style = "info";
						}
					}
					
					res_str_cost_current = resCost(cost_current);
					res_str_count_portfolio = resCost(count_price_portfolio);
					res_str_count_income_loss = resCost(count_income_loss);
					
					//results
					scope.conts[attr.value].incomeloss = res_str;
					scope.conts[attr.value].price = current_price_str;
					scope.conts[attr.value].style = style;
					if(style=="info") {
						scope.conts[attr.value].info = 1;	
					}
					if(style=="danger") {
						scope.conts[attr.value].danger = 1;	
					}
					
					//count total results for all items
					scope.conts[0].danger = count_danger;
					scope.conts[0].info = count_info;
					scope.conts[0].price_portfolio = res_str_count_portfolio;
					scope.conts[0].income_loss = res_str_count_income_loss;
					
					//count total results for current item
					scope.conts[attr.value].income_loss_current = res_str;
					scope.conts[attr.value].cost_current = res_str_cost_current;
					scope.conts[attr.value].cost_current_data = cost_current;
					scope.conts[attr.value].cost_current_income_loss = cost;
			
					for (var i = 0; i <= scope.conts.length; i++) {
						percent = scope.conts[i].cost_current_data/count_price_portfolio * 100;
						percent = percent.toFixed(2)+"%";
						scope.conts[i].percent = percent;
					}
            }
        }
    };
});
//--------------controller---------------
myApp.controller('ContentController', function($scope,$compile) {
		incomeloss = "Сначала задайте цену";
		style="none";
		
		$scope.count_array = 0;
		$scope.count_profitable_paper = 0;
		$scope.count_unprofitable_paper = 0;
		
		$scope.show = "display: none;";
		$scope.show_profitable = "";
		$scope.show_unprofitable = "";
		$scope.show_result = "";
		flag = false;
		
		$scope.conts = [
		];
		
		$scope.AddClick = function (conts,answerForm) {
			flag_old_element = -1;
			flag_new_element = -1;
			cost = 0;
			sount = 0;
			new_element = 0;
			
			for (var i = 0; i < $scope.conts.length; i++) {
				if ($scope.conts[i].name==$scope.name) {
					cost = $scope.conts[i].cost;
					cost = cost.replace("$","");
					cost1 = parseFloat(cost);
					cost2 = parseFloat($scope.cost);
					
					count1 = parseFloat($scope.conts[i].count);
					count2 = parseFloat($scope.count);
					
					cost = (cost1 + cost2)/2;
					count = (count1 + count2);
					
					flag_old_element = i;
					break;
				}
			}
			if (answerForm.$valid) {
				$scope.show = "";
				if (flag_old_element!=-1) {
					$scope.conts[flag_old_element].cost = "$"+cost;
					$scope.conts[flag_old_element].count = count;
					$scope.conts[flag_old_element].style = "none";
					$scope.conts[flag_old_element].incomeloss = incomeloss;
					$scope.conts[flag_old_element].price = incomeloss;
					
					window.alert("Данные устарели. Введите, пожалуйста, текущую цену на вкладке 'Все'");
				} else {
					$scope.conts.push(
						{
							name: $scope.name,
							cost: "$" + $scope.cost,
							count: $scope.count,
							incomeloss: incomeloss,
							style: "none",
							price: incomeloss
						}
					);
					new_element++;
				}
				//count all papers
				if (!flag) {
						$scope.conts[0].all = 0;
						$scope.conts[0].all = $scope.conts[0].all + new_element;
						flag = true;
				} else {
						$scope.conts[0].all = $scope.conts[0].all + new_element;
				}
			} else {
			}
		};
});
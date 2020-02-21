 //Difine funtion to display metadata on selection
//Difine funtion to display charts
function createGaugeCharts (recipe) {
console.log(recipe);
calories = recipe.recipe.totalDaily.ENERC_KCAL.quantity/recipe.recipe.yield;
protein = recipe.recipe.totalDaily.PROCNT.quantity/recipe.recipe.yield;
sodium = recipe.recipe.totalDaily.NA.quantity/recipe.recipe.yield;
fat = recipe.recipe.totalDaily.FAT.quantity/recipe.recipe.yield;
carbs = recipe.recipe.totalDaily.CHOCDF.quantity/recipe.recipe.yield;

    //Gauge 1 
        var gaugeData1 = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: calories,
        title: { text: "Percentage of Daily Calories",
                  margin: { t: 10, b: 1 }   },
            type: "indicator",
        mode: "gauge+number+delta",
        delta: { reference: 50 },
        gauge: {axis: { range: [null, 100] },
        steps: [
          { range: [0,20], color: "white" },
          { range: [30,40], color: "lightgreen" },
          { range: [40,50], color: "lightgreen" },
          { range: [50,60], color: "lightyellow" },
          { range: [60,70], color: "lightyellow" },
          { range: [70,80], color: "lightyellow" },
          { range: [80,90], color: "lightpink" }, 
          { range: [90,100], color: "red" }]
        } 
        }];
        var layout1 = { width: 300, height: 150, margin: { t: 10, b: 1 }, 
        paper_bgcolor: "white",
        font: { color: "drakgray", family: "PT Sans Narrow", size:9},
        titlefont: {size:8}
        };
    
        Plotly.newPlot('gauge1', gaugeData1, layout1);

    //gauge 2
        var gaugeData2 = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: protein,
        title: { text: "Percentage of Daily Protein",
                  margin: { t: 10, b: 1 }   },
            type: "indicator",
        mode: "gauge+number+delta",
        delta: { reference: 50 },
        gauge: {axis: { range: [null, 100] },
        steps: [
            { range: [0,20], color: "white" },
            { range: [30,40], color: "lightgreen" },
            { range: [40,50], color: "lightgreen" },
            { range: [50,60], color: "lightyellow" },
            { range: [60,70], color: "lightyellow" },
            { range: [70,80], color: "lightyellow" },
            { range: [80,90], color: "lightpink" }, 
            { range: [90,100], color: "red" }]
        } 
        }];
        var layout2 = { width: 300, height: 150, margin: { t: 10, b: 1 }, 
        paper_bgcolor: "white",
        font: { color: "drakgray", family: "PT Sans Narrow", size:9},
        titlefont: {size:8}
        };
    
        Plotly.newPlot('gauge2', gaugeData2, layout2);

     //gauge 3
        var gaugeData3 = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: fat,
        title: { text: "Percentage of Daily Fat",
                margin: { t: 10, b: 1 }   },
            type: "indicator",
        mode: "gauge+number+delta",
        delta: { reference: 50 },
        gauge: {axis: { range: [null, 100] },
        steps: [
            { range: [0,20], color: "white" },
            { range: [30,40], color: "lightgreen" },
            { range: [40,50], color: "lightgreen" },
            { range: [50,60], color: "lightyellow" },
            { range: [60,70], color: "lightyellow" },
            { range: [70,80], color: "lightyellow" },
            { range: [80,90], color: "lightpink" }, 
            { range: [90,100], color: "red" }]
        } 
        }];
        var layout3 = { width: 300, height: 150, margin: { t: 10, b: 1 }, 
        paper_bgcolor: "white",
        font: { color: "drakgray", family: "PT Sans Narrow", size:9},
        titlefont: {size:8}
        };
    
        Plotly.newPlot('gauge3', gaugeData3, layout3);

    //gauge 4
        var gaugeData4 = [{
        domain: { x: [0, 10], y: [0, 1] },
        value: carbs,
        title: { text: "Percentage of Daily Carbs",
                margin: { t: 10, b: 1 } },
            type: "indicator",
        mode: "gauge+number+delta",
        delta: { reference: 50 },
        gauge: {axis: { range: [null, 100] },
              steps: [
                { range: [0,20], color: "white" },
                { range: [30,40], color: "lightgreen" },
                { range: [40,50], color: "lightgreen" },
                { range: [50,60], color: "lightyellow" },
                { range: [60,70], color: "lightyellow" },
                { range: [70,80], color: "lightyellow" },
                { range: [80,90], color: "lightpink" }, 
                { range: [90,100], color: "red" }]
            } 
              }];
        var layout4 = { width: 300, height: 150, margin: { t: 10, b: 1 }, 
        paper_bgcolor: "white",
        font: { color: "drakgray", family: "PT Sans Narrow", size:9},
        titlefont: {size:8}
        };
    
        Plotly.newPlot('gauge4', gaugeData4, layout4);
        
      
    }
  
  
  
  
import * as d3 from 'd3'


var g;
var gBrush;
var brush;

export interface stateObject {
    order : number[];
}

export interface stateObject2 {
    xValue : number;
}

export function resetState(prevState : stateObject) {
  //console.log(prevState);
  let listsOfKey = Object.keys(prevState)[0];
  let dataFile = document.getElementById('aBarChart').children;
  //console.log(dataFile);
  let dataFileCopy = [];

  for(let j = 0 ; j < dataFile.length ; j++) {
    dataFileCopy[j] = dataFile[prevState[listsOfKey].order[j]].getAttribute("width");
  }

  for(let j = 0 ; j < dataFile.length ; j++) {
    dataFile[j].setAttribute("width", dataFileCopy[j]);
  }

  return prevState;
}

export function resetState2(prevState : stateObject2) {

  let brushG = d3.select(".selection");
  console.log("logging in reset")
  let keyValue = Object.keys(prevState)[0];
  console.log(prevState[keyValue].xValue);
  let currentWidth = +brushG.attr("width");

  console.log(currentWidth);

  gBrush.call(brush.move, [prevState[keyValue].xValue, prevState[keyValue].xValue + currentWidth]);

  return prevState;
}

export async function changeData() {

  const dataFile: HTMLSelectElement = <HTMLSelectElement>document.getElementById('dataset');

  try {

    let stringVal = 'src/data/' + dataFile.value + '.csv';
    let currentStateVal;
    const data = await d3.csv(stringVal);
    let elementVar = <HTMLInputElement> document.getElementById('random');
    if (elementVar.checked) { // if random
        currentStateVal = update(randomSubset(data));
        // update w/ random subset of data
    } else {
        currentStateVal = update(data);
        // update w/ full data
    }

  return currentStateVal;
  }
  catch (error) {
    console.log(error);
    alert('Could not load the dataset!');
  }
}

var globalMax;

function calculateGlobalMax(data) {
  globalMax = 0;
  let rowMax;
  for(let i = 0 ; i < data.length ; i++) {

    if(+data[i].a > +data[i].b)
    rowMax = +data[i].a;
    else
    rowMax = +data[i].b;

    if(rowMax > globalMax)
    globalMax = rowMax;
  }
}

export function staircase() {
  let dataFile = document.getElementById('aBarChart').children;
  let arr = [];

  for(let i = 0 ; i < dataFile.length ; i++) {
    let pair = [];
    pair.push(parseInt(dataFile[i].getAttribute("width")));
    pair.push(i);
    arr.push(pair);
  }
  arr.sort((a,b) => a[0] - b[0]);

  let stateArray : number[] = [];

  for(let j = 0 ; j < dataFile.length ; j++) {
    dataFile[j].setAttribute("width", (arr[j][0]).toString());
    stateArray.push(arr[j][1]);
  }
  const currentState : stateObject = ({order : stateArray});
  //console.log("Returning the value as");
  //console.log(currentState);
  return currentState;

}
function randomSubset(data) {
  return data.filter( d => (Math.random() > 0.5));
}

export function update(data) {
  let currentState : number[] = [];
  let counter = 1;

  for (let d of data) {
    d.a = +d.a; //unary operator converts string to number
    d.b = +d.b; //unary operator converts string to number
    currentState.push(counter-1);
    counter++;
  }
  // Set up the scales
  let aScale = d3.scaleLinear()
  .domain([0, +d3.max(data, (d:any) => d.a)])
  .range([0, 140]);

  let bScale = d3.scaleLinear()
  .domain([0, +d3.max(data, (d:any) => d.b)])
  .range([0, 140]);

  let iScale = d3.scaleLinear()
  .domain([0, data.length])
  .range([10, 120]);

  let aLineGenerator = d3.line()
  .x((d, i) => iScale(i))
  .y((d:any) => aScale(d.a));

  let bLineGenerator = d3.line()
  .x((d, i) => iScale(i))
  .y((d:any) => bScale(d.b));

  let aAreaGenerator = d3.area()
  .x((d, i) => iScale(i))
  .y0(0)
  .y1((d:any) => aScale(d.a));

  let bAreaGenerator = d3.area()
  .x((d, i) => iScale(i))
  .y0(0)
  .y1((d:any) => bScale(d.b));

  let barA = d3.selectAll("#aBarChart");
  barA.selectAll("rect").remove();
  let selectionBarA = barA.selectAll("rect");
  let dataselectionBarA = selectionBarA.data(data);

  dataselectionBarA
    .exit()
      .style("opacity", 1)
    .transition()
    .duration(3000)
      .style("opacity", 0)
    .remove();

  let newRectsA = dataselectionBarA
                    .enter()
                    .append("rect")
                      .attr("x", 0)
                      .attr("y", (d, i) => iScale(i))
                      .attr("width", 0)
                      .attr("height", 10)
                      .style("opacity", 0);

  dataselectionBarA = newRectsA;

  dataselectionBarA
              .transition()
                .duration(3000)
              .attr("x", 0)
              .attr("y", function (d, i) {
                return iScale(i);
              })
              .attr("width", function (d:any, i) {
                return aScale(d.a);
              })
              .attr("height", 10)
              .style("opacity", 1);

  let barB = d3.selectAll("#bBarChart");
  barB.selectAll("rect").remove();
  let selectionBarB = barB.selectAll("rect");
  let dataselectionBarB = selectionBarB.data(data);

  dataselectionBarB
    .exit()
      .style("opacity", 1)
    .transition()
    .duration(3000)
      .style("opacity", 0).remove();

  let newRectsB = dataselectionBarB
                    .enter()
                    .append("rect")
                      .attr("x", 0)
                      .attr("y", (d, i) => iScale(i))
                      .attr("width", 0)
                      .attr("height", 10)
                      .style("opacity", 0);

  dataselectionBarB = newRectsB;

  dataselectionBarB
    .transition()
    .duration(3000)
      .attr("x", 0)
      .attr("y", function (d, i) {
        return iScale(i);
      })
      .attr("width", function (d:any, i) {
        return bScale(d.b);
      })
      .attr("height", 10)
        .style("opacity", 1);

  let selectionLineA = d3.selectAll("#aLineChart");
  selectionLineA.attr("d", aLineGenerator(data));

  let selectionLineB = d3.selectAll("#bLineChart");
  selectionLineB.attr("d", bLineGenerator(data));

  let selectionAreaA = d3.selectAll("#aAreaChart");
  selectionAreaA.attr("d", aAreaGenerator(data));

  let selectionAreaB = d3.selectAll("#bAreaChart");
  selectionAreaB.attr("d", bAreaGenerator(data));


  let selectionScatter = d3.selectAll("#scatterplot");
  console.log("selected");
  console.log(selectionScatter);
  console.log("before removal");
  console.log(selectionScatter.selectAll("circle"));
  selectionScatter.selectAll("circle").remove();

  let selectionCircles = selectionScatter.selectAll("circle");
  console.log("after removal");
  console.log(selectionCircles);

  let dataselectionScatter = selectionCircles.data(data);

  function brushed(){
         //let [x1,y1] = d3.event.selection[0]
         //let [x2,y2] = d3.event.selection[1]

         //console.log(x1)
         //console.log(y1)
       }

  let scatterplotSvg = d3.select("#scatterplotSvg");
  let brush = d3.brush().extent([[0, 0],[160, 160]]).on("brush end", brushed);
  scatterplotSvg.append("g").attr("class", "brush").call(brush);
  let brushVal = d3.select(".brush")
  //d3.select(".brush").transition().call(brush.move, x.range());
  brushVal.call(brush.move, [0, 160], [0, 160]);


  calculateGlobalMax(data);

  let totalScale = d3.scaleLinear()
    .domain([0, globalMax])
    .range([0, 140]);

  dataselectionScatter
    .exit()
      .style("opacity", 1)
    .transition()
    .duration(3000)
      .style("opacity", 0)
    .remove();

  let newScatter = dataselectionScatter
                    .enter()
                    .append("circle")
                      .attr("cx", function(d:any, i) {
                        return totalScale(d.a);
                      })
                      .attr("cy", function(d:any, i) {
                        return totalScale(d.b);
                      })
                      .attr("r", 5)
                      .style("opacity", 0);

  newScatter
    .transition()
    .duration(3000)
      .attr("cx", function(d:any, i) {
        return totalScale(d.a);
      })
      .attr("cy", function(d:any, i) {
        return totalScale(d.b);
      })
      .attr("r", 5)
      .style("opacity", 1);

  //Assigning click function using d3.

  //Assigning tooltip for the scatter points.
  dataselectionScatter.selectAll("title").remove();

  dataselectionScatter
    .append("title")
    .text(function(d:any, i) {
      return "X is " + totalScale(d.a) + " and Y is " + totalScale(d.b)
    });

  //Interaction on bar chart are assigned below.

  const currentStateVal : stateObject = ({order : currentState});


  //console.log("Returning the value as");
  //console.log(currentStateVal);
  return currentStateVal;
}

export function returnFreshState() {
  let currentState = [0,1,2,3,4,5,6,7,8,9,10];
  let currentStateVal : stateObject = ({order : currentState});
  return currentStateVal;
}


export function scatterPlotFunction() {

  let data = d3.range(800).map(Math.random);

  let svg = d3.select("#testDiv").select("svg");
  let margin = {top: 194, right: 50, bottom: 214, left: 50};
  let width = +svg.attr("width") - margin.left - margin.right;
  let height = +svg.attr("height") - margin.top - margin.bottom;
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let x = d3.scaleLinear().range([0, width]),
      y = d3.randomNormal(height / 2, height / 8);

  brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on("start brush end", brushmoved);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  let circle = g.append("g")
      .attr("class", "circle")
    .selectAll("circle")
    .data(data)
    .enter().append("circle")
      .attr("transform", function(d) { return "translate(" + x(d) + "," + y() + ")"; })
      .attr("r", 3.5);

  gBrush = g.append("g")
      .attr("class", "brush")
      .call(brush);

  let handle = gBrush.selectAll(".handle--custom")
    .data([{type: "w"}, {type: "e"}]);

  gBrush.call(brush.move, [500, 700]);

  function brushmoved() {
    var s = d3.event.selection;
    console.log(s)
    if (s == null) {
      handle.attr("display", "none");
      circle.classed("active", false);
    } else {
      var sx = s.map(x.invert);
      circle.classed("active", function(d) { return sx[0] <= d && d <= sx[1]; });
      handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + s[i] + "," + height / 2 + ")"; });
    }
  }
}

export function moveBrushNow() {
  console.log("Call reached here");
  let brushG = d3.select(".selection");
  let currentx = +brushG.attr("x");
  let currentWidth = +brushG.attr("width");

  gBrush.call(brush.move, [currentx + 10, currentx + 10 + currentWidth]);
  let currentStateVal : stateObject2 = ({xValue : currentx + 10});

  return currentStateVal;

  //console.log(brush.getattr("x"));
}

import * as d3 from 'd3'

export interface stateObject {
    order : number[];
}

export function resetState(prevState : stateObject) {
  console.log("touchdown");
  console.log("called with");
  console.log(Object.keys(prevState));
  let listsOfKey = Object.keys(prevState)[0];
  let dataFile = document.getElementById('aBarChart').children;
  console.log(dataFile);
  let dataFileCopy = [];

  for(let j = 0 ; j < dataFile.length ; j++) {
    dataFileCopy[j] = dataFile[prevState[listsOfKey].order[j]].getAttribute("width");
  }

  for(let j = 0 ; j < dataFile.length ; j++) {
    dataFile[j].setAttribute("width", dataFileCopy[j]);
  }

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
  console.log("Returning the value as");
  console.log(currentState);
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

  const currentStateVal : stateObject = ({order : currentState});
  console.log("Returning the value as");
  console.log(currentStateVal);
  return currentStateVal;
}

export function returnFreshState() {
  let currentState = [0,1,2,3,4,5,6,7,8,9,10];
  let currentStateVal : stateObject = ({order : currentState});
  return currentStateVal;
}

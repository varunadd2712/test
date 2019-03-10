import * as d3 from 'd3'
import { createStore, combineReducers } from "redux";
import { Provenance } from "provenance-lib-core/lib/src";

import {
  ReversibleAction,
  ReversibleActionCreator
} from "provenance-lib-core/lib/src/provenance-core/ProvenanceActions";

import { StateNode } from "provenance-lib-core/lib/src/provenance-core/NodeInterfaces";

export enum VizActionsEnum {
  DATASET_UPDATE = "DATASET_UPDATE",
  STAIRCASE = "STAIRCASE"
}

interface VizAction {
  type: VizActionsEnum;
  args: number;
}

export const createStaircaseAction = (toSet:number): VizAction => ({
  type: VizActionsEnum.STAIRCASE,
  args: toSet
});

export const createUpdateAction = (toSet:number): VizAction => ({
  type: VizActionsEnum.DATASET_UPDATE,
  args: toSet
});

const vizReducer = (count: number, action: VizAction) => {
  console.log("called with")
  console.log(action)
  switch (action.type) {
    case "DO_" + VizActionsEnum.DATASET_UPDATE: {
      changeData();
      return count + action.args;
    }

    case "DO_" + VizActionsEnum.STAIRCASE: {
      staircase();
      return count + action.args;
    }

    default:
      return count + 500;
  }
};

export const Vizualization = () =>
  createStore(
    combineReducers({
      count: vizReducer
    })
  );


const app = Vizualization();

const provenance = Provenance(app);

const createReversibleAddAction = (toSet: number): ReversibleAction<number, number> => {
  return ReversibleActionCreator(VizActionsEnum.STAIRCASE, toSet, toSet);
};

const act = createReversibleAddAction(3);

console.log("Running action");
provenance.apply(act);
console.log(app.getState());
provenance.apply(act);
console.log(app.getState());

const button: HTMLElement = document.getElementById('dataset');
button.addEventListener("click", (e:Event) => changeData());

const button3: HTMLElement = document.getElementById('random');
button3.addEventListener("click", (e:Event) => changeData());

const button2:HTMLElement = document.getElementById('staircase');
button2.addEventListener("click", (e2:Event) => staircase());
var globalMax:number;

async function changeData() {

  const dataFile: HTMLSelectElement = <HTMLSelectElement>document.getElementById('dataset');

  try {

    let stringVal = 'src/data/' + dataFile.value + '.csv';
    //const data:d3.DSVRowArray<string> = await d3.csv('data/' + dataFile.value + '.csv');

    d3.csv(stringVal).then(data => {
      let elementVar = <HTMLInputElement> document.getElementById('random');
      if (elementVar.checked) { // if random
        update(randomSubset(data));                  // update w/ random subset of data
      } else {
        update(data);                                // update w/ full data
      }
  })
    console.log("logging data first time");
  }
  catch (error) {
    console.log(error);
    alert('Could not load the dataset!');
  }
}



function staircase() {
  console.log("here value");
  let dataFile = document.getElementById('aBarChart').children;
  let step_size = 10;
  for(let i = 0 ; i < dataFile.length ; i++) {
    dataFile[i].setAttribute("width", (step_size).toString());
    step_size += 10;
  }
}

function calculateGlobalMax(data:d3.DSVRowArray<string>) {
  globalMax = 0;
  let rowMax:number;
  console.log("logging data here");
  console.log(data);
  for(let i = 0 ; i < data.length ; i++) {

    if(+data[i].a > +data[i].b)
    rowMax = +data[i].a;
    else
    rowMax = +data[i].b;

    if(rowMax > globalMax)
    globalMax = rowMax;
  }
  console.log("globalMax is");
  console.log(globalMax);
}

function randomSubset(data) {
  return data.filter( d => (Math.random() > 0.5));
}

function update(data) {

  for (let d of data) {
    d.a = +d.a; //unary operator converts string to number
    d.b = +d.b; //unary operator converts string to number
  }

  console.log("logging data");
  console.log(data);

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
}

import * as d3 from 'd3'
import { createStore, combineReducers } from "redux";
import { initialize, initProvenance } from "@visdesignlab/provenance-lib-core/lib/src/";
import { recordableReduxActionCreator } from "@visdesignlab/provenance-lib-core/lib/src/";
import { Provenance } from "@visdesignlab/provenance-lib-core/lib/src/";

import {
  vizState,
  VizApp,
  initVisState
} from "./vizApp";

const provenance = initProvenance(initVisState)
const app = VizApp(provenance);

provenance.addObserver("state", (state : vizState) => {
  render(state)
});

var actionTrace = [];

provenance.applyAction({
  label: "Initial Render",
  action: () => {
    const currentState = (app.currentState() as any) as vizState;
    render(currentState)
    return currentState;
  },
  args:[initVisState]
})

provenance.done();

function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}

function sortFunction() {
  actionTrace.push(2);
  provenance.applyAction({
    label: "Sort Data",
    action: () => {
      const currentState = (app.currentState() as any) as vizState;
      currentState.state = [4,9,2,5,0,8,7,6,3,1];
      return currentState;
    },
    args: []
  })
}

function originalDataFunction() {
  actionTrace.push(1);
  provenance.applyAction({
    label: "Original Data",
    action: () => {
      const currentState = (app.currentState() as any) as vizState;
      currentState.state = [0,1,2,3,4,5,6,7,8,9];
      return currentState;
    },
    args: []
  })
}

function exportState() {

  provenance.exportState();
}

function exportPartialState() {

  provenance.exportPartialState();
}

function logProvenance() {
    console.log(provenance.graph());
}

function logGraphFunction() {
  let stringVal = "{\"nodes\":{\"a2b91416-0964-4eb4-822a-0487804c2ff9\":{\"id\":\"a2b91416-0964-4eb4-822a-0487804c2ff9\",\"label\":\"Root\",\"metadata\":{\"createdOn\":1574005840586},\"artifacts\":{},\"children\":[\"a26c41b9-93d6-4983-86e7-02d7cefb95a8\"],\"state\":{\"state\":[0,1,2,3,4,5,6,7,8,9],\"state2\":[0,1]}},\"a26c41b9-93d6-4983-86e7-02d7cefb95a8\":{\"id\":\"a26c41b9-93d6-4983-86e7-02d7cefb95a8\",\"label\":\"Initial Render\",\"metadata\":{\"createdOn\":1574005840605},\"actionResult\":null,\"parent\":\"a2b91416-0964-4eb4-822a-0487804c2ff9\",\"children\":[\"8345b094-40e5-41d1-945d-0c7688537ec5\"],\"artifacts\":[],\"state\":{\"state\":[0,1,2,3,4,5,6,7,8,9],\"state2\":[0,1]}},\"8345b094-40e5-41d1-945d-0c7688537ec5\":{\"id\":\"8345b094-40e5-41d1-945d-0c7688537ec5\",\"label\":\"Sort Data\",\"metadata\":{\"createdOn\":1574005844514},\"actionResult\":null,\"parent\":\"a26c41b9-93d6-4983-86e7-02d7cefb95a8\",\"children\":[\"435f5035-590b-484d-b87c-7cb50806f3c2\"],\"artifacts\":[],\"state\":{\"state\":[4,9,2,5,0,8,7,6,3,1],\"state2\":[0,1]}},\"435f5035-590b-484d-b87c-7cb50806f3c2\":{\"id\":\"435f5035-590b-484d-b87c-7cb50806f3c2\",\"label\":\"Original Data\",\"metadata\":{\"createdOn\":1574005845658},\"actionResult\":null,\"parent\":\"8345b094-40e5-41d1-945d-0c7688537ec5\",\"children\":[\"ffe3e54b-f3e3-455e-97e0-cee5743745a3\"],\"artifacts\":[],\"state\":{\"state\":[0,1,2,3,4,5,6,7,8,9],\"state2\":[0,1]}},\"ffe3e54b-f3e3-455e-97e0-cee5743745a3\":{\"id\":\"ffe3e54b-f3e3-455e-97e0-cee5743745a3\",\"label\":\"Sort Data\",\"metadata\":{\"createdOn\":1574005848130},\"actionResult\":null,\"parent\":\"435f5035-590b-484d-b87c-7cb50806f3c2\",\"children\":[\"068b82d8-0008-4a5e-8f29-f9465bbfc364\"],\"artifacts\":[],\"state\":{\"state\":[4,9,2,5,0,8,7,6,3,1],\"state2\":[0,1]}},\"068b82d8-0008-4a5e-8f29-f9465bbfc364\":{\"id\":\"068b82d8-0008-4a5e-8f29-f9465bbfc364\",\"label\":\"Original Data\",\"metadata\":{\"createdOn\":1574005848720},\"actionResult\":null,\"parent\":\"ffe3e54b-f3e3-455e-97e0-cee5743745a3\",\"children\":[],\"artifacts\":[],\"state\":{\"state\":[0,1,2,3,4,5,6,7,8,9],\"state2\":[0,1]}}},\"current\":{\"id\":\"068b82d8-0008-4a5e-8f29-f9465bbfc364\",\"label\":\"Original Data\",\"metadata\":{\"createdOn\":1574005848720},\"actionResult\":null,\"parent\":\"ffe3e54b-f3e3-455e-97e0-cee5743745a3\",\"children\":[],\"artifacts\":[],\"state\":{\"state\":[0,1,2,3,4,5,6,7,8,9],\"state2\":[0,1]}},\"root\":{\"id\":\"a2b91416-0964-4eb4-822a-0487804c2ff9\",\"label\":\"Root\",\"metadata\":{\"createdOn\":1574005840586},\"artifacts\":{},\"children\":[\"a26c41b9-93d6-4983-86e7-02d7cefb95a8\"],\"state\":{\"state\":[0,1,2,3,4,5,6,7,8,9],\"state2\":[0,1]}}}";

  let nodesList = JSON.parse(stringVal);
  nodesList = nodesList.nodes;
  let unsortedArray = []
  Object.keys(nodesList).forEach(e => unsortedArray.push(nodesList[e]));

  let nodesSorted = sort_by_key(unsortedArray, "metadata.createdOn");

  for (let entry of nodesSorted) {

    console.log("Calling " + entry.label)
    provenance.applyAction({
      label: entry.label,
      action: () => {
        const currentState = (app.currentState() as any) as vizState;
        currentState.state = entry.state.state;
        currentState.state2 = entry.state.state2;
        return currentState;
      },
      args: []
    })
  }
}

function importState() {
  provenance.importState();
}

function importPartialState() {
  provenance.importPartialState();
}

function doneObserver() {
  provenance.done();
}

let btn = document.getElementById("sortButton");
btn.addEventListener("click", (e:Event) => sortFunction());

let btn1 = document.getElementById("originalButton");
btn1.addEventListener("click", (e:Event) => originalDataFunction());

let btn2 = document.getElementById("logButton");
btn2.addEventListener("click", (e:Event) => logGraphFunction());

let btn8 = document.getElementById("log2Button");
btn8.addEventListener("click", (e:Event) => logProvenance());

let btn3 = document.getElementById("exportButton");
btn3.addEventListener("click", (e:Event) => exportState());

let btn4 = document.getElementById("exportPartialButton");
btn4.addEventListener("click", (e:Event) => exportPartialState());

let btn5 = document.getElementById("importButton");
btn5.addEventListener("click", (e:Event) => importState());

let btn6 = document.getElementById("importPartialButton");
btn6.addEventListener("click", (e:Event) => importPartialState());

let btn7 = document.getElementById("doneButton");
btn7.addEventListener("click", (e:Event) => doneObserver());

function render(state) {

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
  var x = d3.scaleBand()
  .range([0, width])
  .padding(0.1);
  var y = d3.scaleLinear()
  .range([height, 0]);
  d3.select("#svgDiv").selectAll("svg").remove()
  d3.select("#actionTraceDiv").selectAll("svg").remove()

  var svg = d3.select("#svgDiv").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");

  let data = getData(state);
  x.domain(data.map(function(d) { return d.salesperson; }));
  y.domain([0, d3.max(data, function(d) { return d.sales; })]);

  svg.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d.salesperson); })
  .attr("width", x.bandwidth())
  .attr("y", function(d) { return y(d.sales); })
  .attr("height", function(d) { return height - y(d.sales); })
  .attr("stroke", "black")
  .attr("stroke-width", "4px");

  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

  svg.append("g")
  .call(d3.axisLeft(y));

  svg = d3.select("#svgDiv").append("svg")
  .attr("width", width)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");

  data = getData2(state);

  x.domain(data.map(function(d) { return d.salesperson; }));
  y.domain([0, d3.max(data, function(d) { return d.sales; })]);

  svg.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d.salesperson) + 140; })
  .attr("width", 100)
  .attr("y", function(d) { return y(d.sales); })
  .attr("height", function(d) { return height - y(d.sales); })
  .attr("stroke", "black")
  .attr("stroke-width", "4px");

  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

  svg.append("g")
  .call(d3.axisLeft(y));

  if(actionTrace.length == 0)
  return;

  svg = d3.select("#actionTraceDiv").append("svg")
  .attr("width", width)
  .attr("height", height  - 100)
  .append("g")
  .attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");

  data = actionTrace

  svg.selectAll("rect")
  .data(data)
  .enter().append("rect")
  .attr("class", "trace")
  .attr("x", function(d, i) { return 55*i; })
  .attr("width", 50)
  .attr("y", 10)
  .attr("height", 20)
  .attr("fill", function(d, i) { if(d == 1) return "blue"; return "red"; });
}

function getData(state) {

  let data = []
  let dataPiece = {}
  dataPiece["salesperson"] = "Bob"
  dataPiece["sales"] = 33
  data.push(dataPiece)

  dataPiece = {}
  dataPiece["salesperson"] = "Robin"
  dataPiece["sales"] = 12
  data.push(dataPiece)

  dataPiece = {}
  dataPiece["salesperson"] = "Anne"
  dataPiece["sales"] = 41
  data.push(dataPiece)

  dataPiece = {}
  dataPiece["salesperson"] = "Mark"
  dataPiece["sales"] = 16
  data.push(dataPiece)

  dataPiece = {}
  dataPiece["salesperson"] = "Joe"
  dataPiece["sales"] = 59
  data.push(dataPiece)

  dataPiece = {}
  dataPiece["salesperson"] = "Eve"
  dataPiece["sales"] = 38
  data.push(dataPiece)

  dataPiece = {}
  dataPiece["salesperson"] = "Karen"
  dataPiece["sales"] = 21
  data.push(dataPiece)

  dataPiece = {}
  dataPiece["salesperson"] = "Kirsty"
  dataPiece["sales"] = 25
  data.push(dataPiece)

  dataPiece = {}
  dataPiece["salesperson"] = "Chris"
  dataPiece["sales"] = 30
  data.push(dataPiece)

  dataPiece = {}
  dataPiece["salesperson"] = "Lisa"
  dataPiece["sales"] = 47
  data.push(dataPiece)

  let dataState = [];

  for (let i = 0 ; i < state.state.length ; i++) {
    dataState.push(data[state.state[i]])
  }

  return dataState;
}

function getData2(state) {

  let data = []
  let dataPiece = {}

  dataPiece = {}
  dataPiece["salesperson"] = "2019"
  dataPiece["sales"] = 30
  data.push(dataPiece)

  dataPiece = {}
  dataPiece["salesperson"] = "2020"
  dataPiece["sales"] = 47
  data.push(dataPiece)

  let dataState = [];

  for (let i = 0 ; i < state.state2.length ; i++) {
    dataState.push(data[state.state2[i]])
  }

  return dataState;
}

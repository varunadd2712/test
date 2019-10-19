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

provenance.applyAction({
  label: "Initial Render",
  action: () => {
    const currentState = (app.currentState() as any) as vizState;
    render(currentState)
    return currentState;
  },
  args:[initVisState]
})

function sortFunction() {

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

function logGraphFunction() {

  console.log(provenance.graph());
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
  d3.select("body").selectAll("svg").remove()
  var svg = d3.select("body").append("svg")
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
        .attr("height", function(d) { return height - y(d.sales); });

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));

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

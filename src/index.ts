import * as d3 from 'd3'
import { createStore, combineReducers } from "redux";
import { initialize } from "@visdesignlab/provenance-lib-core/lib/src/";
import { recordableReduxActionCreator } from "@visdesignlab/provenance-lib-core/lib/src/";

var state = JSON.parse("{\"keys\":[0,1,2,3,4,5,6,7,8,9]}")

export enum VizActionsEnum {
  SORT_DATA = "SORT_DATA",
  EXPORT_DATA = "EXPORT_DATA",
  IMPORT_DATA = "IMPORT_DATA",
  ORIGINAL_DATA = "ORIGINAL_DATA"
}

interface VizAction {
  type: VizActionsEnum;
  args: stateObject;
}

export interface stateObject {

    state : number[];
}

export const sortDataAction = (toSet:stateObject): VizAction => ({
  type: VizActionsEnum.SORT_DATA,
  args: toSet
});

export const exportDataAction = (toSet:stateObject): VizAction => ({
  type: VizActionsEnum.EXPORT_DATA,
  args: toSet
});

export const importDataAction = (toSet:stateObject): VizAction => ({
  type: VizActionsEnum.IMPORT_DATA,
  args: toSet
});

export const originalDataAction = (toSet:stateObject): VizAction => ({
  type: VizActionsEnum.ORIGINAL_DATA,
  args: toSet
});

const vizReducer = (count: stateObject, action: VizAction) => {
  switch (action.type) {
    case VizActionsEnum.SORT_DATA: {
      sortFunction();
      return 100;
    }

    case VizActionsEnum.IMPORT_DATA: {
      importState();
      return 100;
    }

    case VizActionsEnum.EXPORT_DATA: {
      exportState();
      return 100;
    }

    case VizActionsEnum.ORIGINAL_DATA: {
      originalDataFunction();
      return 100;
    }

    default:
      originalDataFunction();
      return 100;
  }
};

export const Vizualization = () =>
  createStore(
    combineReducers({
      count: vizReducer
    })
  );

const app = Vizualization();

console.log(initialize)
const provenance = initialize(app);

const exportAction = recordableReduxActionCreator(
  "exportAction",
  VizActionsEnum.EXPORT_DATA,
  100
);

provenance.applyAction(exportAction)

export function render() {

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

    let data = getData();
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

export function getData() {
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

  for (let i = 0 ; i < state.keys.length ; i++) {
      dataState.push(data[state.keys[i]])
  }

  return dataState;
}

export function originalDataFunction() {
  state = JSON.parse("{\"keys\":[0,1,2,3,4,5,6,7,8,9]}")
  render();
}

export function sortFunction() {
  state = JSON.parse("{\"keys\":[4,9,2,5,0,8,7,6,3,1]}")
  render();
}

export function exportState() {
  let queryString = btoa(JSON.stringify(state));
  window.location.search = "?" + queryString
}

export function importState() {
  let stateString = window.location.search.substring(1)
  state = JSON.parse(atob(stateString))
  render()
}

let btn1 = document.getElementById("originalButton");
btn1.addEventListener("click", (e:Event) => this.originalDataFunction());

let btn = document.getElementById("sortButton");
btn.addEventListener("click", (e:Event) => this.sortFunction());

let btn2 = document.getElementById("importButton");
btn2.addEventListener("click", (e:Event) => this.importState());

let btn3 = document.getElementById("exportButton");
btn3.addEventListener("click", (e:Event) => this.exportState());

render();

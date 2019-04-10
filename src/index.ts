import { createStore, combineReducers } from "redux";
import { Provenance } from "provenance-lib-core/lib/src";
import {resetState, changeData, staircase, returnFreshState, stateObject, scatterPlotFunction, moveBrushNow, stateObject2, resetState2} from "./helper";

import {
  ReversibleAction,
  ReversibleActionCreator
} from "provenance-lib-core/lib/src";

export enum VizActionsEnum {
  DATASET_UPDATE = "DATASET_UPDATE",
  STAIRCASE = "STAIRCASE",
  RESET = "RESET"
}

scatterPlotFunction();
console.log("start test");
//moveBrushNow();


export enum Viz2ActionsEnum {
  MOVE_BRUSH = "MOVE_BRUSH",
  RESET_BRUSH = "RESET_BRUSH"
}

interface VizAction {
  type: VizActionsEnum;
  args: stateObject;
}

interface Viz2Action {
  type: Viz2ActionsEnum;
  args: stateObject2;
}

export const createBrushAction = (toSet:stateObject2): Viz2Action => ({
  type: Viz2ActionsEnum.MOVE_BRUSH,
  args: toSet
});

export const createStaircaseAction = (toSet:stateObject): VizAction => ({
  type: VizActionsEnum.STAIRCASE,
  args: toSet
});

export const createUpdateAction = (toSet:stateObject): VizAction => ({
  type: VizActionsEnum.DATASET_UPDATE,
  args: toSet
});

export const createResetAction = (toSet:stateObject): VizAction => ({
  type: VizActionsEnum.DATASET_UPDATE,
  args: toSet
});

const viz2Reducer = (count: stateObject2, action: Viz2Action) => {
  switch (action.type) {
    case "DO_" + Viz2ActionsEnum.MOVE_BRUSH: {
      console.log("In this block");
      return moveBrushNow();
    }

    case Viz2ActionsEnum.RESET_BRUSH: {
      //console.log("recieved args", action.args);
      resetState2(action.args);
      return action.args;
    }

    default: {
      console.log("In this guy")
        return moveBrushNow();
    }
  }
};

const vizReducer = (count: stateObject, action: VizAction) => {
  switch (action.type) {
    case "DO_" + VizActionsEnum.DATASET_UPDATE: {
      changeData();
      return returnFreshState();
    }

    case "DO_" + VizActionsEnum.STAIRCASE: {
      return staircase();
    }

    case "UNDO_" + VizActionsEnum.STAIRCASE: {
      //resetState();
      //return count + action.args;
      return returnFreshState();

    }

    case VizActionsEnum.RESET: {
      //console.log("recieved args", action.args);
      resetState(action.args);
      return action.args;
    }

    default:
      //return count + 500;
      return returnFreshState();
  }
};

export const Vizualization2 = () =>
  createStore(
    combineReducers({
      count: viz2Reducer
    })
  );

export const Vizualization1 = () =>
  createStore(
    combineReducers({
      count: vizReducer
    })
  );

const app = Vizualization1();
const app2 = Vizualization2();

const provenance2 = Provenance(app2, "RESET_BRUSH");
const provenance = Provenance(app, "RESET");

const createReversibleMoveBrushAction = (toSet: number): ReversibleAction<number, number> => {
  return ReversibleActionCreator(Viz2ActionsEnum.MOVE_BRUSH, toSet, toSet);
};

const createReversibleStaircaseAction = (toSet: number): ReversibleAction<number, number> => {
  return ReversibleActionCreator(VizActionsEnum.STAIRCASE, toSet, toSet);
};

const createReversibleUpdateAction = (toSet: number): ReversibleAction<number, number> => {
  return ReversibleActionCreator(VizActionsEnum.DATASET_UPDATE, toSet, toSet);
};

const button: HTMLElement = document.getElementById('dataset');
button.addEventListener("click", (e:Event) => doUpdate());

const button3: HTMLElement = document.getElementById('random');
button3.addEventListener("click", (e:Event) => doUpdate());

const button2:HTMLElement = document.getElementById('staircase');
button2.addEventListener("click", (e2:Event) => doStaircase());

const button4:HTMLElement = document.getElementById('undo-staircase');
button4.addEventListener("click", (e2:Event) => callUndo());

const button5:HTMLElement = document.getElementById('move brush');
button5.addEventListener("click", (e2:Event) => moveBrushNowHere());

const button6:HTMLElement = document.getElementById('reset brush');
button6.addEventListener("click", (e2:Event) => undoBrush());


const act = createReversibleStaircaseAction(3);
const act2 = createReversibleUpdateAction(3);

const act3 = createReversibleMoveBrushAction(3);

function moveBrushNowHere() {
    console.log("At least reached");
    provenance2.apply(act3);
    //console.log(provenance.graph());
}

function doStaircase() {
  provenance.apply(act);
  //console.log(provenance.graph());
}
function undoBrush() {
  //provenance.goBackNSteps(1);
  provenance2.goBackOneStepWithState();
}

function callUndo() {
  //provenance.goBackNSteps(1);
  provenance.goBackOneStepWithState();
}

function doUpdate() {
  provenance.apply(act2);
  //console.log(provenance.graph());
}

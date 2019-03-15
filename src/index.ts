import { createStore, combineReducers } from "redux";
import { Provenance } from "provenance-lib-core/lib/src";
import {resetState, changeData, staircase, returnFreshState, stateObject} from "./helper";

import {
  ReversibleAction,
  ReversibleActionCreator
} from "provenance-lib-core/lib/src/index";

export enum VizActionsEnum {
  DATASET_UPDATE = "DATASET_UPDATE",
  STAIRCASE = "STAIRCASE",
  RESET = "RESET"
}

interface VizAction {
  type: VizActionsEnum;
  args: stateObject;
}

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
      resetState(action.args);
      return count;
    }

    default:
      //return count + 500;
      return returnFreshState();
  }
};

export const Vizualization1 = () =>
  createStore(
    combineReducers({
      count: vizReducer
    })
  );

const app = Vizualization1();

const provenance = Provenance(app);

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

const act = createReversibleStaircaseAction(3);
const act2 = createReversibleUpdateAction(3);

function doStaircase() {
  provenance.apply(act);
  console.log(app.getState());
  console.log(provenance.graph());
}

function callUndo() {
  //provenance.goBackNSteps(1);
  provenance.applyReset("RESET");
}

function doUpdate() {
  provenance.apply(act2);
  console.log(app.getState());
  console.log(provenance.graph());
}

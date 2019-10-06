import { Provenance } from "@visdesignlab/provenance-lib-core/lib/src/";

export interface vizState {
  state : number[];
}

export const initVisState: vizState = {
  state : [0,1,2,3,4,5,6,7,8,9]
};

export function VizApp(provenance: Provenance<vizState>) {
  return {
    currentState: () => provenance.graph().current.state
  };
}

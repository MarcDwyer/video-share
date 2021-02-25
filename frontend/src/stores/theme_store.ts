import { makeAutoObservable } from "mobx";

export const Dark: ThemeStruct = {
  bgColor: "#15191c",
  color: "#b4bac2",
  routeColor: "#676767",
  routeBgColor: "#23262b",
  cardColor: "#2f333c",
  borderColor: "#676767",
  btnColor: "#23262b",
  hoverShade: "#2f333c",
  hamburgercolor: "#F7850A",
};
export type ThemeStruct = {
  bgColor: string;
  color: string;
  cardColor: string;
  routeBgColor: string;
  routeColor: string;
  borderColor: string;
  btnColor: string;
  hoverShade: string;
  hamburgercolor: string;
};
export class ThemeStore {
  theme = Dark;

  constructor() {
    makeAutoObservable(this);
  }
}

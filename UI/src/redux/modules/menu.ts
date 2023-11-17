import { string } from "fp-ts";
import { fromIO } from "fp-ts/lib/TaskEither";
import { Action } from "redux";
import { ActionsObservable, combineEpics, ofType } from "redux-observable";
import { EMPTY, Observable, pipe } from "rxjs";
import { map, switchMap, switchMapTo } from "rxjs/operators";

export const key = "menu";

export const userMenuClickedAction = {
  type: "management/menu/USER_MENU_CLICKED",
} as const;

const updateCartVisibilityType = "customer/cart/UPDATE_VISIBILITY";
const updateUserSectionType = "customer/menu/SECTION";
const updateSearchTextType = "customer/menu/SEARCH_TEXT";
const updateUserModeType = "customer/menu/MODE";

export const updateLanguageType = "customer/menu/LANGUAGE";

export const updateCartVisibilityAction = (flag: boolean) =>
  ({
    type: updateCartVisibilityType,
    flag,
  } as const);

export const updateUserSectionAction = (userSection: string) =>
  ({
    type: updateUserSectionType,
    userSection,
  } as const);

export const updateSearchTextAction = (searchText: string) =>
  ({
    type: updateSearchTextType,
    searchText,
  } as const);

export const updateUserModeAction = (userRole: string) =>
  ({
    type: updateUserModeType,
    userRole: userRole,
  } as const);

export enum actionTypes {
  TOGGLE_MENU = "site/menu/TOGGLE_MENU",
  CLOSE_MENU = "site/menu/CLOSE_MENU",
  OPEN_MENU = "site/menu/OPEN_MENU",
  TOGGLE_PIN_MENU = "site/menu/TOGGLE_PIN_MENU",
  PIN_OPEN_MENU = "site/menu/PIN_OPEN_MENU",
  UNPIN_OPEN_MENU = "site/menu/UNPIN_OPEN_MENU",
}

type Actions =
  | typeof userMenuClickedAction
  | ReturnType<
      | typeof updateUserSectionAction
      | typeof updateCartVisibilityAction
      | typeof updateSearchTextAction
      | typeof updateUserModeAction
    >;

export const initialMenuState = {
  isUserMenuOpen: false,
  showCart: false,
  userSection: "",
  searchText: "",
  userRole: "", // Admin - CustomerCare - User
};

type State = typeof initialMenuState;

export function reducer(
  state: State = initialMenuState,
  action: Actions
): State {
  switch (action.type) {
    case "management/menu/USER_MENU_CLICKED":
      return {
        ...state,
        isUserMenuOpen: !state.isUserMenuOpen,
        showCart: state.showCart,
      };
    case updateCartVisibilityType:
      return {
        ...state,
        showCart: action.flag,
        isUserMenuOpen: state.isUserMenuOpen,
      };
    case updateUserSectionType: {
      return {
        ...state,
        userSection: action.userSection,
      };
    }
    case updateSearchTextType: {
      return {
        ...state,
        searchText: action.searchText,
      };
    }
    case updateUserModeType: {
      return {
        ...state,
        userRole: action.userRole,
      };
    }
    default:
      return state;
  }
}

export const Selectors = {
  all: (state: any): State => state[key],
  isUserMenuOpen: (state: any): boolean => state[key].isUserMenuOpen,
  showCart: (state: any): boolean => state[key].showCart,
  userSection: (state: any): string => state[key].userSection,
  searchText: (state: any): string => state[key].searchText,
  userRole: (state: any): string => state[key].userRole,
};

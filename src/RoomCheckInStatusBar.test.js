import React from "react";
import {
  render,
  fireEvent,
  waitForElement,
  cleanup
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { RoomCheckInStatusBar } from "./App";

afterEach(cleanup);

describe("Individual room status bar", () => {
  it("rooms' status bars checkbox unchecked by default", () => {
    const { getByTestId } = render(
      <RoomCheckInStatusBar
        roomNum="2"
        roomStatus={{
          roomNumber: 2,
          checked: false,
          numAdults: "1",
          numChildren: "0"
        }}
        onRoomStatusChange={() => {}}
      />
    );
    expect(getByTestId("room-2-checkbox")).toHaveProperty("checked", false);
  });
});

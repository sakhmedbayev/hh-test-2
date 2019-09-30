import { LocalStorageMock } from "@react-mock/localstorage";
import "@testing-library/jest-dom/extend-expect";
import { cleanup, fireEvent, render, waitForElement } from "@testing-library/react";
import React from "react";
import App, { initialState } from "./App";

afterEach(cleanup);

const renderComponent = data =>
  render(
    <LocalStorageMock items={data}>
      <App />
    </LocalStorageMock>
  );

const allTogglableRooms = initialState.roomStatuses.slice(1);

describe("elements render properly", () => {
  it("renders according to the snapshot", () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders togglable rooms with their default/disabled properties", () => {
    const { getByTestId } = render(<App />);

    allTogglableRooms.forEach(room => {
      const roomCheckboxTestId = `room-${room.roomNumber}-checkbox`;
      const roomWidgetTestId = `room-${room.roomNumber}-widget-container`;
      const guestNumDropdownAdultsTestId = `room-dropdown-${room.roomNumber}-Adults`;
      const guestNumDropdownChildrenTestId = `room-dropdown-${room.roomNumber}-Children`;

      expect(getByTestId(roomCheckboxTestId)).toHaveProperty("checked", false);
      expect(getByTestId(guestNumDropdownAdultsTestId)).toHaveProperty(
        "disabled",
        true
      );
      expect(getByTestId(guestNumDropdownChildrenTestId)).toHaveProperty(
        "disabled",
        true
      );
      expect(getByTestId(roomWidgetTestId)).toHaveStyle(
        "background-color: #DBDBE3"
      );
    });
  });
});

describe("Room widget", () => {
  it("changes checkbox status for room 2 correctly", async () => {
    const component = render(<App />);

    fireEvent.click(component.getByTestId(`room-2-status-label`));

    const updatedComponent = await waitForElement(() =>
      component.getByTestId(`room-2-status-label`)
    );

    expect(updatedComponent).toHaveProperty("checked", true);
  });
  it("changes checkbox status for room 3 correctly", async () => {
    const component = render(<App />);

    fireEvent.click(component.getByTestId(`room-3-status-label`));

    const updatedComponent = await waitForElement(() =>
      component.getByTestId(`room-3-status-label`)
    );

    expect(updatedComponent).toHaveProperty("checked", true);
  });
  it("changes checkbox status for room 4 correctly", async () => {
    const component = render(<App />);

    fireEvent.click(component.getByTestId(`room-4-status-label`));

    const updatedComponent = await waitForElement(() =>
      component.getByTestId(`room-4-status-label`)
    );

    expect(updatedComponent).toHaveProperty("checked", true);
  });
  it("sets proper value for room 1 adults dropdown correctly", () => {
    const component = render(<App />);

    const foundSelectBeforeEvent = component.getByTestId(
      `room-dropdown-1-Adults`
    );

    fireEvent.change(foundSelectBeforeEvent, { target: { value: "2" } });

    expect(foundSelectBeforeEvent.value).toBe("2");
  });
  it("sets proper value for room 1 children dropdown correctly", () => {
    const component = render(<App />);

    const foundSelectBeforeEvent = component.getByTestId(
      `room-dropdown-1-Children`
    );

    fireEvent.change(foundSelectBeforeEvent, { target: { value: "2" } });

    expect(foundSelectBeforeEvent.value).toBe("2");
  });
  it("sets proper value for room 2 adults dropdown correctly", () => {
    const component = render(<App />);
    fireEvent.click(component.getByTestId(`room-2-status-label`));
    const foundSelectBeforeEvent = component.getByTestId(
      `room-dropdown-2-Adults`
    );
    fireEvent.change(foundSelectBeforeEvent, { target: { value: "2" } });
    expect(foundSelectBeforeEvent.value).toBe("2");
  });
  it("sets proper value for room 1 children dropdown correctly", () => {
    const component = render(<App />);
    fireEvent.click(component.getByTestId(`room-2-status-label`));
    const foundSelectBeforeEvent = component.getByTestId(
      `room-dropdown-2-Children`
    );
    fireEvent.change(foundSelectBeforeEvent, { target: { value: "2" } });
    expect(foundSelectBeforeEvent.value).toBe("2");
  });
});

describe("a room's checked status has proper effect on other rooms' checked statuses", () => {
  it("sets proper checked status on the current and other rooms", () => {
    const component = render(<App />);

    fireEvent.click(component.getByTestId("room-4-checkbox"));

    expect(component.getByTestId("room-2-checkbox")).toHaveProperty(
      "checked",
      true
    );
    expect(component.getByTestId("room-3-checkbox")).toHaveProperty(
      "checked",
      true
    );
    expect(component.getByTestId("room-4-checkbox")).toHaveProperty(
      "checked",
      true
    );

    fireEvent.click(component.getByTestId("room-2-checkbox"));

    expect(component.getByTestId("room-2-checkbox")).toHaveProperty(
      "checked",
      false
    );
    expect(component.getByTestId("room-3-checkbox")).toHaveProperty(
      "checked",
      false
    );
    expect(component.getByTestId("room-4-checkbox")).toHaveProperty(
      "checked",
      false
    );
  });
});

describe("the form initialized correctly by pulling data from LocalStorage", () => {
  it("pulls data from LocalStorage and sets proper statuses on rooms' checkboxes", () => {
    const dataForLocalStorage = [
      { roomNumber: 1, checked: true, numAdults: "1", numChildren: "0" },
      { roomNumber: 2, checked: true, numAdults: "1", numChildren: "0" },
      { roomNumber: 3, checked: false, numAdults: "1", numChildren: "0" },
      { roomNumber: 4, checked: false, numAdults: "1", numChildren: "0" }
    ];

    const component = renderComponent({
      roomStatuses: JSON.stringify(dataForLocalStorage)
    });

    expect(component.getByTestId("room-2-checkbox")).toHaveProperty(
      "checked",
      true
    );
    expect(component.getByTestId("room-3-checkbox")).toHaveProperty(
      "checked",
      false
    );
    expect(component.getByTestId("room-4-checkbox")).toHaveProperty(
      "checked",
      false
    );
  });
});

describe("form submissions", () => {
  it("updates LocalStorage cache when only room 1 is submitted", () => {
    const dataForLocalStorage = [
      { roomNumber: 1, checked: true, numAdults: "1", numChildren: "0" },
      { roomNumber: 2, checked: false, numAdults: "1", numChildren: "0" },
      { roomNumber: 3, checked: false, numAdults: "1", numChildren: "0" },
      { roomNumber: 4, checked: false, numAdults: "1", numChildren: "0" }
    ];

    const component = renderComponent({
      roomStatuses: JSON.stringify(dataForLocalStorage)
    });

    fireEvent.click(component.getByText(/Submit/i));

    // LocalStorage should store only room 1 data
    expect(JSON.parse(localStorage.getItem("roomStatuses"))).toStrictEqual(
      dataForLocalStorage.slice(0, 1)
    );
  });
  it("updates LocalStorage cache when room 1 and 2 are submitted", () => {
    const dataForLocalStorage = [
      { roomNumber: 1, checked: true, numAdults: "1", numChildren: "0" },
      { roomNumber: 2, checked: true, numAdults: "1", numChildren: "0" },
      { roomNumber: 3, checked: false, numAdults: "1", numChildren: "0" },
      { roomNumber: 4, checked: false, numAdults: "1", numChildren: "0" }
    ];

    const component = renderComponent({
      roomStatuses: JSON.stringify(dataForLocalStorage)
    });

    fireEvent.click(component.getByText(/Submit/i));

    // LocalStorage should store data for room 1 and 2
    expect(JSON.parse(localStorage.getItem("roomStatuses"))).toStrictEqual(
      dataForLocalStorage.slice(0, 2)
    );
  });
  it("updates LocalStorage when room 1 and 2 are checked initially but room 3 and 4 are set true by a user and submitted with their default values", () => {
    const dataForLocalStorage = [
      { roomNumber: 1, checked: true, numAdults: "1", numChildren: "0" },
      { roomNumber: 2, checked: true, numAdults: "1", numChildren: "0" },
      { roomNumber: 3, checked: false, numAdults: "1", numChildren: "0" },
      { roomNumber: 4, checked: false, numAdults: "1", numChildren: "0" }
    ];

    const component = renderComponent({
      roomStatuses: JSON.stringify(dataForLocalStorage)
    });

    fireEvent.click(component.getByTestId("room-3-checkbox"));
    fireEvent.click(component.getByTestId("room-4-checkbox"));
    fireEvent.click(component.getByText(/Submit/i));

    expect(JSON.parse(localStorage.getItem("roomStatuses"))).toStrictEqual([
      ...dataForLocalStorage.slice(0, 2),
      { roomNumber: 3, checked: true, numAdults: "1", numChildren: "0" },
      { roomNumber: 4, checked: true, numAdults: "1", numChildren: "0" }
    ]);
  });
});

/* eslint-disable jsx-a11y/no-onchange */
import React, { useReducer } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";

const sharedRoomLabelStyles = css`
  padding: 3px;
  font-weight: bold;
  font-size: 12px;
`;

// App RoomStatus component

const StyledRoomStatusLabel = styled.label`
  ${sharedRoomLabelStyles};
  background-color: ${props => (props.checked ? "#e7e7e7" : "#DBDBE3")};
`;

StyledRoomStatusLabel.propTypes = {
  checked: PropTypes.bool.isRequired
};

export const RoomCheckInStatusBar = ({ roomStatus, onRoomStatusChange }) => {
  return (
    <StyledRoomStatusLabel
      htmlFor={`roomStatus-${roomStatus.roomNumber}`}
      aria-label={`Room ${roomStatus.roomNumber}`}
      checked={roomStatus.checked}
      data-testid={`room-${roomStatus.roomNumber}-status-label`}
    >
      <input
        name="room-status"
        type="checkbox"
        id={`roomStatus-${roomStatus.roomNumber}`}
        checked={roomStatus.checked}
        onChange={e => {
          onRoomStatusChange({ ...roomStatus, checked: e.target.checked });
        }}
        data-testid={`room-${roomStatus.roomNumber}-checkbox`}
      />
      <span style={{ marginLeft: "5px" }}>Room {roomStatus.roomNumber}</span>
    </StyledRoomStatusLabel>
  );
};

RoomCheckInStatusBar.propTypes = {
  roomStatus: PropTypes.shape({
    roomNumber: PropTypes.number.isRequired,
    checked: PropTypes.bool.isRequired,
    numAdults: PropTypes.string.isRequired,
    numChildren: PropTypes.string.isRequired
  }),
  onRoomStatusChange: PropTypes.func.isRequired
};

// GuestNumber component

const StyledDiv2 = styled.div`
  display: flex;
  flex-direction: column;
  width: 50px;
`;

const StyledGuestLabel = styled.label`
  font-size: 12px;
  margin-bottom: 5px;
`;

export const GuestNumberDropdown = ({
  labelPrefix,
  labelSuffix,
  options,
  roomStatus,
  onRoomStatusChange,
  type
}) => {
  return (
    <StyledDiv2 role={`room-dropdown-${labelPrefix}-${labelSuffix}`}>
      <StyledGuestLabel
        htmlFor={`room-dropdown-${labelPrefix}-${labelSuffix}`}
        area-label={`${labelPrefix} ${labelSuffix}`}
      >
        {labelPrefix} <br /> {labelSuffix}
      </StyledGuestLabel>
      <select
        name="number-of-guest-status"
        id={`room-dropdown-${labelPrefix}-${labelSuffix}`}
        value={roomStatus[type]}
        onChange={e => {
          onRoomStatusChange({ ...roomStatus, [type]: e.target.value });
        }}
        disabled={roomStatus.roomNumber !== 1 && !roomStatus.checked}
        data-testid={`room-dropdown-${roomStatus.roomNumber}-${labelPrefix}`}
      >
        {options.map(option => (
          <option
            key={option}
            value={option}
            data-testid={`option-${labelPrefix}-${roomStatus.roomNumber}-${option}`}
          >
            {option}
          </option>
        ))}
      </select>
    </StyledDiv2>
  );
};

GuestNumberDropdown.propTypes = {
  labelPrefix: PropTypes.string.isRequired,
  labelSuffix: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  roomStatus: PropTypes.shape({
    roomNumber: PropTypes.number.isRequired,
    checked: PropTypes.bool.isRequired,
    numAdults: PropTypes.string.isRequired,
    numChildren: PropTypes.string.isRequired
  }),
  type: PropTypes.string.isRequired,
  onRoomStatusChange: PropTypes.func.isRequired
};

// RoomWidget component

const StyledHorizontalDiv = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  div:first-child {
    margin-right: 10px;
  }
`;

const StyledSectionForRoomWidget = styled.div`
  background-color: ${props => (props.checked ? "" : "#DBDBE3")};
  border-radius: 6px;
  border: ${props =>
    props.checked ? "3px solid #e7e7e7" : "3px solid #CBD0DB"};
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-bottom: 10px;
  margin-right: 10px;
  min-width: 150px;
`;

StyledSectionForRoomWidget.propTypes = {
  checked: PropTypes.bool.isRequired
};

const StyledRoomLabelSpan = styled.span`
  ${sharedRoomLabelStyles};
  padding: 4px 0px 3px 5px;
  background-color: #e7e7e7;
`;

export const RoomWidget = ({ roomStatus, onRoomStatusChange }) => {
  return (
    <StyledSectionForRoomWidget
      role={`check-in room number ${roomStatus.roomNumber}`}
      aria-disabled={
        roomStatus.roomNumber === "1" ? false : !roomStatus.checked
      }
      checked={roomStatus.roomNumber === "1" ? true : roomStatus.checked}
      data-testid={`room-${roomStatus.roomNumber}-widget-container`}
    >
      {roomStatus.roomNumber === 1 ? (
        <StyledRoomLabelSpan data-testid="room-1-status-label">
          Room 1
        </StyledRoomLabelSpan>
      ) : (
        <RoomCheckInStatusBar
          roomStatus={roomStatus}
          onRoomStatusChange={onRoomStatusChange}
        />
      )}
      <StyledHorizontalDiv>
        <GuestNumberDropdown
          labelPrefix="Adults"
          labelSuffix="(18+)"
          options={["1", "2"]}
          roomStatus={roomStatus}
          onRoomStatusChange={onRoomStatusChange}
          type="numAdults"
        />
        <GuestNumberDropdown
          labelPrefix="Children"
          labelSuffix="(0-17)"
          options={["0", "1", "2"]}
          roomStatus={roomStatus}
          onRoomStatusChange={onRoomStatusChange}
          type="numChildren"
        />
      </StyledHorizontalDiv>
    </StyledSectionForRoomWidget>
  );
};

RoomWidget.propTypes = {
  roomStatus: PropTypes.shape({
    roomNumber: PropTypes.number.isRequired,
    checked: PropTypes.bool.isRequired,
    numAdults: PropTypes.string.isRequired,
    numChildren: PropTypes.string.isRequired
  }),
  onRoomStatusChange: PropTypes.func.isRequired
};

// App component

const StyledMain = styled.main`
  padding: 20px;
`;

const StyledForm = styled.form``;

const StyledRoomsWidgetDiv = styled.div`
  align-content: center;
  align-items: flex-start;
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  justify-content: end;
  @media (max-width: 600px) {
    .flex-container > div {
      width: 100%;
    }
  }
`;

export const initialState = {
  roomStatuses: [
    {
      roomNumber: 1,
      checked: true,
      numAdults: "1",
      numChildren: "0"
    },
    {
      roomNumber: 2,
      checked: false,
      numAdults: "1",
      numChildren: "0"
    },
    {
      roomNumber: 3,
      checked: false,
      numAdults: "1",
      numChildren: "0"
    },
    {
      roomNumber: 4,
      checked: false,
      numAdults: "1",
      numChildren: "0"
    }
  ]
};

const RESET = "RESET";
const CHANGE_ROOM_STATUSES = "CHANGE_ROOM_STATUSES";

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_ROOM_STATUSES": {
      return { ...state, roomStatuses: action.roomStatuses };
    }
    case CHANGE_ROOM_STATUSES: {
      const updatedRoomStatuses = state.roomStatuses.map((prevRoom, index) => {
        if (
          prevRoom.roomNumber < action.payload.roomNumber &&
          action.payload.checked
        ) {
          return { ...prevRoom, checked: true };
        } else if (
          prevRoom.roomNumber >= action.payload.roomNumber &&
          !action.payload.checked
        ) {
          return {
            roomNumber: prevRoom.roomNumber,
            checked: false,
            numAdults: "1",
            numChildren: "0"
          };
        } else if (index !== action.payload.roomNumber - 1) {
          return { ...prevRoom };
        }
        return {
          ...prevRoom,
          ...action.payload
        };
      });

      return {
        ...state,
        roomStatuses: updatedRoomStatuses
      };
    }
    case RESET: {
      return init();
    }
    default:
      return state;
  }
};

// 1. include prop types

function init() {
  const data = JSON.parse(localStorage.getItem("roomStatuses"));
  const initialData = initialState.roomStatuses.map(room => {
    if (data && data[room.roomNumber - 1]) {
      return data[room.roomNumber - 1];
    }
    return room;
  });
  return { roomStatuses: data ? initialData : initialState.roomStatuses };
}

const App = () => {
  const [{ roomStatuses }, dispatch] = useReducer(reducer, initialState, init);

  return (
    <StyledMain>
      {/* This should be included for better accessibility */}
      <h1 data-testid="h1tag">Hilton Hotel rooms online check-in</h1>
      <StyledForm
        role="check-in form"
        onSubmit={e => {
          e.preventDefault();

          const allCheckedInRooms = roomStatuses.filter(
            room => room.checked === true
          );
          localStorage.setItem(
            "roomStatuses",
            JSON.stringify(allCheckedInRooms)
          );
        }}
      >
        <StyledRoomsWidgetDiv role="check-in room form">
          {roomStatuses.map(room => (
            <RoomWidget
              key={room.roomNumber}
              roomStatus={room}
              onRoomStatusChange={values => {
                dispatch({ type: CHANGE_ROOM_STATUSES, payload: values });
              }}
            />
          ))}
        </StyledRoomsWidgetDiv>
        <button type="submit">Submit</button>
        <button
          onClick={() => {
            dispatch({ type: RESET });
          }}
        >
          Reset
        </button>
      </StyledForm>
    </StyledMain>
  );
};

export default App;

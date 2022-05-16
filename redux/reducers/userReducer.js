let defaultState = {
  userDetail: {},
};

let userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "ADD_USER_DETAIL": {
      let newState = { ...state };

      if (action.payload) {
        console.log("ADD_USER_DETAIL");

        newState.userDetail = action.payload;
      }
      console.log(newState, "👉");
      return newState;
    }

    default:
      return state;
  }
};

export default userReducer;
